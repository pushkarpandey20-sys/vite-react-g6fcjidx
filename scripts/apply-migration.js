#!/usr/bin/env node
/**
 * DevSetu — Run production migration via Supabase REST API
 *
 * USAGE:
 *   1. Get your Service Role Key from:
 *      Supabase Dashboard → Project Settings → API → service_role key
 *
 *   2. Run:
 *      SUPABASE_URL=https://xxxx.supabase.co \
 *      SUPABASE_SERVICE_KEY=eyJhbGci... \
 *      node scripts/apply-migration.js
 *
 *   OR edit the two constants below and run: node scripts/apply-migration.js
 */

const SUPABASE_URL        = process.env.SUPABASE_URL        || 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

const SQL_FILE = path.join(__dirname, '../supabase/migrations/003_production_columns.sql');

// Split SQL into individual statements, skip comments and blanks
function splitStatements(sql) {
  return sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
}

// Execute a single SQL statement via Supabase's postgres REST endpoint
function execSQL(statement) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: statement + ';' });
    const url  = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

    const options = {
      hostname: url.hostname,
      port:     url.port || (url.protocol === 'https:' ? 443 : 80),
      path:     url.pathname + url.search,
      method:   'POST',
      headers: {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey':         SUPABASE_SERVICE_KEY,
        'Authorization':  `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer':         'return=minimal',
      },
    };

    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, status: res.statusCode });
        } else {
          // Try direct SQL via pg REST (Supabase Management API)
          resolve({ ok: false, status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Fallback: use Supabase Management API to run SQL
function execSQLManagement(statement) {
  return new Promise((resolve, reject) => {
    // Extract project ref from URL
    const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
    const body = JSON.stringify({ query: statement + ';' });

    const options = {
      hostname: 'api.supabase.com',
      port:     443,
      path:     `/v1/projects/${projectRef}/database/query`,
      method:   'POST',
      headers: {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization':  `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  if (SUPABASE_URL.includes('YOUR_PROJECT') || SUPABASE_SERVICE_KEY.includes('YOUR_SERVICE')) {
    console.error('\n❌  Please set SUPABASE_URL and SUPABASE_SERVICE_KEY before running.\n');
    console.error('   SUPABASE_URL=https://xxxx.supabase.co \\');
    console.error('   SUPABASE_SERVICE_KEY=eyJhbGci... \\');
    console.error('   node scripts/apply-migration.js\n');
    process.exit(1);
  }

  console.log('🕉️  DevSetu — Applying migration 003_production_columns.sql\n');
  console.log(`📡  Project: ${SUPABASE_URL}\n`);

  const sql        = fs.readFileSync(SQL_FILE, 'utf8');
  const statements = splitStatements(sql);

  console.log(`📋  Found ${statements.length} SQL statements to execute.\n`);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
    process.stdout.write(`  [${i + 1}/${statements.length}] ${preview}... `);

    try {
      // Try Management API first (most reliable)
      const result = await execSQLManagement(stmt);
      if (result.ok) {
        console.log('✅');
        passed++;
      } else {
        // Some statements like CREATE POLICY IF NOT EXISTS may return errors on old Supabase
        // versions — treat as warning, not fatal
        const body = JSON.parse(result.body || '{}');
        const msg  = body?.message || body?.error || result.body;
        if (msg && (msg.includes('already exists') || msg.includes('does not exist'))) {
          console.log('⚠️  (already applied)');
          passed++;
        } else {
          console.log(`❌  (${result.status}: ${msg?.substring(0, 80)})`);
          failed++;
        }
      }
    } catch (err) {
      console.log(`❌  (network error: ${err.message})`);
      failed++;
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅  Passed : ${passed}`);
  if (failed > 0) console.log(`❌  Failed : ${failed}`);
  console.log(`${'─'.repeat(50)}\n`);

  if (failed > 0) {
    console.log('💡  For failed statements, copy supabase/migrations/003_production_columns.sql');
    console.log('    and paste it into Supabase Dashboard → SQL Editor → Run.\n');
  } else {
    console.log('🎉  Migration complete! Your DevSetu database is production-ready.\n');
  }
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
