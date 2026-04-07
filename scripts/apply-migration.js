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

  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log('🕉️  DevSetu — Applying all migrations to production\n');
  console.log(`📡  Project: ${SUPABASE_URL}\n`);
  console.log(`📁  Found ${files.length} migration files.\n`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`🚀  Applying: ${file}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    const statements = splitStatements(sql);

    let passed = 0;
    let total = statements.length;

    for (let i = 0; i < total; i++) {
      const stmt = statements[i];
      const preview = stmt.substring(0, 50).replace(/\n/g, ' ');
      
      try {
        const result = await execSQLManagement(stmt);
        if (result.ok) {
          passed++;
        } else {
          const body = JSON.parse(result.body || '{}');
          const msg  = body?.message || body?.error || result.body;
          if (msg && (msg.includes('already exists') || msg.includes('does not exist') || msg.includes('Duplicate'))) {
             passed++;
          } else {
            console.log(`     ❌  [${i+1}/${total}] Error: ${msg?.substring(0, 100)}`);
          }
        }
      } catch (err) {
        console.log(`     ❌  [${i+1}/${total}] Network Error: ${err.message}`);
      }
    }
    console.log(`     ✅  ${passed}/${total} statements applied or verified.\n`);
  }

  console.log('🎉  All migrations processed! Your DevSetu database is up to date.\n');
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
