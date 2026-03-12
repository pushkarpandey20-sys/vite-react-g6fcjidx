// ============================================================
// DevSetu – Full Supabase-Connected App
// Replace SUPABASE_URL and SUPABASE_ANON_KEY below with yours
// ============================================================

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================
// ⚙️  CONFIG — REPLACE THESE WITH YOUR SUPABASE CREDENTIALS
// ============================================================
const SUPABASE_URL  = "https://lnhlnogpmpjajwtmmrmq.supabase.co";
const SUPABASE_KEY  = "sb_publishable_hkLodTGQEUBQ5QcLTIey1Q_snE7L9j1";
// ============================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// CONTEXT
// ============================================================
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ============================================================
// STYLES
// ============================================================
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=Nunito:wght@300;400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Nunito',sans-serif;background:#FDF5EC;color:#2C1A0E;min-height:100vh;}
:root{--s:#FF6B00;--g:#D4A017;--gl:#F0C040;--cream:#FFF8F0;--db:#2C1A0E;--br:#5C3317;--lb:#8B6347;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(212,160,23,.3);border-radius:3px;}
.tnav{background:linear-gradient(135deg,#1a0f07 0%,#3d2211 50%,#1a0f07 100%);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:62px;border-bottom:2px solid var(--g);position:sticky;top:0;z-index:200;box-shadow:0 4px 24px rgba(0,0,0,.5);}
.logo{display:flex;align-items:center;gap:11px;cursor:pointer;}
.logo-icon{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--s),var(--g));display:flex;align-items:center;justify-content:center;font-size:20px;animation:glow 3s ease-in-out infinite;}
@keyframes glow{0%,100%{box-shadow:0 0 10px rgba(255,107,0,.4);}50%{box-shadow:0 0 28px rgba(255,107,0,.8),0 0 48px rgba(212,160,23,.4);}}
.logo-name{font-family:'Cinzel',serif;color:var(--gl);font-size:19px;font-weight:700;letter-spacing:1px;}
.logo-tagline{font-family:'Crimson Pro',serif;color:rgba(240,192,64,.6);font-size:10px;letter-spacing:2px;text-transform:uppercase;}
.nav-tabs{display:flex;gap:3px;background:rgba(255,255,255,.06);border-radius:28px;padding:3px;border:1px solid rgba(212,160,23,.25);}
.ntab{padding:7px 18px;border-radius:22px;border:none;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:700;font-size:12.5px;transition:all .3s;color:rgba(240,192,64,.65);background:transparent;}
.ntab.active{background:linear-gradient(135deg,var(--s),var(--g));color:#fff;box-shadow:0 2px 14px rgba(255,107,0,.45);}
.ntab:hover:not(.active){background:rgba(255,255,255,.09);color:var(--gl);}
.nav-r{display:flex;align-items:center;gap:10px;position:relative;}
.icon-btn{width:36px;height:36px;border-radius:50%;border:1px solid rgba(212,160,23,.3);background:rgba(255,255,255,.07);color:var(--gl);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:all .2s;position:relative;}
.icon-btn:hover{background:rgba(255,107,0,.2);}
.badge{position:absolute;top:-3px;right:-3px;width:16px;height:16px;background:var(--s);border-radius:50%;font-size:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;border:2px solid #1a0f07;}
.layout{display:flex;flex:1;min-height:calc(100vh - 62px);}
.sidebar{width:232px;background:linear-gradient(180deg,#1a0f07 0%,#2c1a0e 100%);border-right:1px solid rgba(212,160,23,.15);padding:20px 0;flex-shrink:0;position:sticky;top:62px;height:calc(100vh - 62px);overflow-y:auto;}
.s-section-title{font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:2.5px;color:rgba(212,160,23,.4);padding:0 18px;margin-bottom:5px;text-transform:uppercase;}
.s-item{display:flex;align-items:center;gap:11px;padding:11px 18px;cursor:pointer;transition:all .2s;border-left:3px solid transparent;color:rgba(255,248,240,.55);font-size:13px;font-weight:600;}
.s-item:hover{background:rgba(255,107,0,.09);color:var(--gl);border-left-color:rgba(255,107,0,.35);}
.s-item.active{background:linear-gradient(90deg,rgba(255,107,0,.18),transparent);color:var(--gl);border-left-color:var(--s);}
.s-icon{font-size:16px;width:20px;text-align:center;}
.s-div{height:1px;background:rgba(212,160,23,.12);margin:12px 18px;}
.content{flex:1;overflow-y:auto;background:#FDF5EC;}
.ph{background:linear-gradient(135deg,#1a0f07 0%,#3d2211 60%,#5c3317 100%);padding:28px 30px 24px;position:relative;overflow:hidden;}
.ph::after{content:'🕉';position:absolute;right:36px;top:50%;transform:translateY(-50%);font-size:72px;opacity:.05;pointer-events:none;}
.ph-title{font-family:'Cinzel',serif;color:var(--gl);font-size:24px;font-weight:700;margin-bottom:4px;}
.ph-sub{font-family:'Crimson Pro',serif;color:rgba(255,248,240,.58);font-size:14px;font-style:italic;}
.cb{padding:24px 28px;}
.card{background:#fff;border-radius:16px;border:1px solid rgba(212,160,23,.13);box-shadow:0 3px 14px rgba(44,26,14,.055);}
.card-p{padding:20px 22px;}
.stat-grid{display:grid;gap:14px;margin-bottom:24px;}
.sg4{grid-template-columns:repeat(4,1fr);}
.sg3{grid-template-columns:repeat(3,1fr);}
.sg2{grid-template-columns:repeat(2,1fr);}
.stat-card{background:#fff;border-radius:14px;padding:20px;border:1px solid rgba(212,160,23,.13);box-shadow:0 3px 12px rgba(44,26,14,.05);transition:all .3s;position:relative;overflow:hidden;}
.stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--s),var(--g));}
.stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(44,26,14,.11);}
.stat-icon{font-size:26px;margin-bottom:9px;}
.stat-val{font-family:'Cinzel',serif;font-size:26px;font-weight:700;color:var(--db);}
.stat-lbl{font-size:11px;color:var(--lb);font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-top:3px;}
.stat-trend{font-size:11px;margin-top:5px;font-weight:700;}
.tup{color:#27AE60;}.tdn{color:#C0392B;}
.btn{padding:9px 20px;border-radius:28px;border:none;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:700;font-size:12.5px;transition:all .22s;letter-spacing:.3px;display:inline-flex;align-items:center;gap:6px;}
.btn-primary{background:linear-gradient(135deg,var(--s),#FF8C35);color:#fff;box-shadow:0 4px 14px rgba(255,107,0,.32);}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 22px rgba(255,107,0,.48);}
.btn-gold{background:linear-gradient(135deg,var(--g),var(--gl));color:var(--db);}
.btn-gold:hover{transform:translateY(-2px);}
.btn-outline{background:transparent;color:var(--s);border:1.5px solid var(--s);}
.btn-outline:hover{background:rgba(255,107,0,.07);transform:translateY(-1px);}
.btn-ghost{background:rgba(255,107,0,.07);color:var(--s);border:1px solid rgba(255,107,0,.18);}
.btn-sm{padding:5px 13px;font-size:11.5px;}
.btn-success{background:linear-gradient(135deg,#27AE60,#2ECC71);color:#fff;}
.btn-success:hover{transform:translateY(-1px);}
.btn-danger{background:linear-gradient(135deg,#C0392B,#E74C3C);color:#fff;}
.btn-danger:hover{transform:translateY(-1px);}
.btn-disabled{opacity:.5;cursor:not-allowed;pointer-events:none;}
.btn:active{transform:scale(.97);}
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.sh-title{font-family:'Cinzel',serif;font-size:15px;font-weight:700;color:var(--db);display:flex;align-items:center;gap:8px;}
.sh-title::before{content:'';width:4px;height:17px;background:linear-gradient(var(--s),var(--g));border-radius:2px;display:inline-block;}
.fg{display:flex;flex-direction:column;gap:6px;}
.fl{font-size:11.5px;font-weight:700;color:var(--br);text-transform:uppercase;letter-spacing:.8px;}
.fi,.fs,.fta{padding:10px 14px;border:1.5px solid rgba(212,160,23,.22);border-radius:11px;font-family:'Nunito',sans-serif;font-size:13.5px;color:var(--db);background:var(--cream);transition:all .2s;outline:none;width:100%;}
.fi:focus,.fs:focus,.fta:focus{border-color:var(--s);box-shadow:0 0 0 3px rgba(255,107,0,.09);}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.ffw{grid-column:1/-1;}
.fta{resize:vertical;min-height:80px;}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px;}
.pc{background:#fff;border-radius:18px;overflow:hidden;border:1px solid rgba(212,160,23,.1);box-shadow:0 3px 14px rgba(44,26,14,.055);transition:all .3s;cursor:pointer;}
.pc:hover{transform:translateY(-5px);box-shadow:0 12px 32px rgba(44,26,14,.13);border-color:rgba(255,107,0,.28);}
.pc.selected{border:2px solid var(--s);box-shadow:0 0 0 3px rgba(255,107,0,.14);}
.pc-head{background:linear-gradient(135deg,#3d2211,#6b3820);padding:20px 18px 14px;display:flex;align-items:center;gap:12px;}
.pc-av{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--s),var(--g));display:flex;align-items:center;justify-content:center;font-size:24px;border:2.5px solid rgba(240,192,64,.45);flex-shrink:0;}
.pc-name{font-family:'Cinzel',serif;color:var(--gl);font-size:14px;font-weight:700;}
.pc-spec{color:rgba(255,248,240,.58);font-size:11.5px;margin-top:2px;}
.vbadge{background:rgba(39,174,96,.18);border:1px solid rgba(39,174,96,.4);color:#27AE60;font-size:9.5px;padding:2px 7px;border-radius:8px;font-weight:800;margin-top:4px;display:inline-block;}
.pc-body{padding:14px 18px;}
.ptag{background:rgba(255,107,0,.07);color:var(--s);border:1px solid rgba(255,107,0,.18);font-size:9.5px;padding:2px 8px;border-radius:9px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
.ptag-g{background:rgba(212,160,23,.07);color:#A07810;border-color:rgba(212,160,23,.22);}
.avdot{width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:4px;}
.av-available{background:#27AE60;}.av-busy{background:#E67E22;}.av-offline{background:#95A5A6;}
.price-tag{font-family:'Cinzel',serif;font-size:15px;font-weight:700;color:var(--s);}
.rgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
.rc{background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(212,160,23,.1);cursor:pointer;transition:all .3s;text-align:center;}
.rc:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(44,26,14,.11);border-color:var(--s);}
.rc.selected{border:2px solid var(--s);box-shadow:0 0 0 3px rgba(255,107,0,.13);}
.rc-icon{background:linear-gradient(135deg,#FFF3E6,#FDE8CC);padding:20px 14px;font-size:38px;line-height:1;}
.rc-body{padding:12px 10px;}
.rc-name{font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--db);}
.rc-price{font-family:'Cinzel',serif;font-size:14px;font-weight:700;color:var(--s);margin-top:3px;}
.rc-dur{font-size:10.5px;color:var(--lb);margin-top:2px;}
.mcard{background:linear-gradient(135deg,#1a0f07,#3d2211);border-radius:18px;padding:24px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;}
.mcard::before{content:'🌙';position:absolute;right:24px;top:50%;transform:translateY(-50%);font-size:80px;opacity:.06;}
.m-title{font-family:'Cinzel',serif;font-size:18px;color:var(--gl);margin-bottom:6px;font-weight:700;}
.m-sub{color:rgba(255,248,240,.55);font-size:12.5px;margin-bottom:18px;font-family:'Crimson Pro',serif;font-style:italic;}
.mdates{display:flex;gap:10px;flex-wrap:wrap;}
.md{background:rgba(255,255,255,.08);border:1px solid rgba(212,160,23,.3);border-radius:11px;padding:10px 14px;cursor:pointer;transition:all .2s;text-align:center;min-width:80px;}
.md:hover,.md.selected{background:rgba(255,107,0,.18);border-color:var(--s);}
.md-day{font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:var(--gl);}
.md-month{font-size:10px;color:rgba(255,248,240,.55);text-transform:uppercase;letter-spacing:1px;}
.md-tithi{font-size:9.5px;color:var(--s);margin-top:2px;font-weight:700;}
.dtable{width:100%;background:#fff;border-radius:14px;overflow:hidden;border:1px solid rgba(212,160,23,.1);box-shadow:0 3px 12px rgba(44,26,14,.05);margin-bottom:22px;}
.thead{background:linear-gradient(135deg,#1a0f07,#3d2211);display:grid;padding:12px 18px;}
.th{font-family:'Cinzel',serif;font-size:10.5px;color:rgba(240,192,64,.75);text-transform:uppercase;letter-spacing:1px;font-weight:600;}
.tr{display:grid;padding:12px 18px;border-bottom:1px solid rgba(212,160,23,.07);align-items:center;transition:background .18s;}
.tr:hover{background:rgba(255,107,0,.025);}
.tr:last-child{border-bottom:none;}
.td{font-size:13px;color:var(--db);}
.td2{font-size:11.5px;color:var(--lb);margin-top:2px;}
.sb{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:18px;font-size:10.5px;font-weight:700;letter-spacing:.2px;}
.sb-confirmed{background:rgba(39,174,96,.1);color:#27AE60;border:1px solid rgba(39,174,96,.22);}
.sb-pending{background:rgba(230,126,34,.1);color:#E67E22;border:1px solid rgba(230,126,34,.22);}
.sb-completed{background:rgba(41,128,185,.1);color:#2980B9;border:1px solid rgba(41,128,185,.22);}
.sb-cancelled{background:rgba(192,57,43,.09);color:#C0392B;border:1px solid rgba(192,57,43,.18);}
.sb-accepted{background:rgba(39,174,96,.1);color:#27AE60;border:1px solid rgba(39,174,96,.22);}
.sb-rejected{background:rgba(192,57,43,.09);color:#C0392B;border:1px solid rgba(192,57,43,.18);}
.sb-placed{background:rgba(41,128,185,.1);color:#2980B9;border:1px solid rgba(41,128,185,.22);}
.toggle{width:44px;height:23px;border-radius:11px;background:#ddd;position:relative;cursor:pointer;transition:background .3s;flex-shrink:0;}
.toggle.on{background:var(--s);}
.toggle-knob{width:19px;height:19px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:left .3s;box-shadow:0 2px 4px rgba(0,0,0,.2);}
.toggle.on .toggle-knob{left:23px;}
.sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px;}
.sc{background:#fff;border-radius:14px;overflow:hidden;border:1px solid rgba(212,160,23,.1);cursor:pointer;transition:all .3s;}
.sc:hover{transform:translateY(-3px);box-shadow:0 8px 22px rgba(44,26,14,.11);border-color:rgba(255,107,0,.22);}
.sc-img{height:100px;background:linear-gradient(135deg,#FFF3E6,#FDE8CC);display:flex;align-items:center;justify-content:center;font-size:46px;}
.sc-body{padding:11px;}
.sc-name{font-size:12.5px;font-weight:700;color:var(--db);}
.sc-items{font-size:11px;color:var(--lb);margin:3px 0 8px;}
.sc-price{font-family:'Cinzel',serif;font-size:14px;font-weight:700;color:var(--s);}
.sev-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px;}
.sev-card{background:#fff;border-radius:16px;padding:20px;border:1px solid rgba(212,160,23,.13);text-align:center;transition:all .3s;}
.sev-card:hover{transform:translateY(-4px);border-color:var(--g);box-shadow:0 8px 22px rgba(212,160,23,.18);}
.sev-icon{font-size:40px;margin-bottom:10px;}
.sev-name{font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:var(--db);margin-bottom:5px;}
.sev-desc{font-size:11.5px;color:var(--lb);line-height:1.5;margin-bottom:12px;font-family:'Crimson Pro',serif;}
.sev-amts{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin-bottom:12px;}
.amt-chip{padding:4px 10px;border-radius:16px;font-size:11px;font-weight:700;background:rgba(255,107,0,.07);color:var(--s);border:1px solid rgba(255,107,0,.15);cursor:pointer;transition:all .2s;}
.amt-chip:hover,.amt-chip.selected{background:var(--s);color:#fff;}
.breq{background:#fff;border-radius:14px;padding:18px;border:1px solid rgba(212,160,23,.1);display:flex;align-items:center;gap:14px;margin-bottom:11px;box-shadow:0 2px 9px rgba(44,26,14,.04);transition:all .2s;}
.breq:hover{border-color:rgba(255,107,0,.18);}
.breq-av{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#FFF3E6,#FDE8CC);display:flex;align-items:center;justify-content:center;font-size:22px;border:2px solid rgba(212,160,23,.22);flex-shrink:0;}
.breq-info{flex:1;}
.breq-name{font-weight:800;color:var(--db);font-size:13.5px;margin-bottom:2px;}
.breq-det{font-size:12px;color:var(--lb);margin-bottom:5px;}
.breq-meta{display:flex;gap:12px;font-size:11px;color:#95A5A6;flex-wrap:wrap;}
.overlay{position:fixed;inset:0;background:rgba(26,15,7,.88);display:flex;align-items:center;justify-content:center;z-index:500;backdrop-filter:blur(5px);padding:16px;}
.modal{background:#fff;border-radius:22px;width:100%;max-width:480px;border:1px solid rgba(212,160,23,.22);box-shadow:0 24px 64px rgba(0,0,0,.45);max-height:90vh;overflow-y:auto;animation:mIn .3s ease;}
@keyframes mIn{from{opacity:0;transform:scale(.94) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);}}
.modal-head{background:linear-gradient(135deg,#1a0f07,#3d2211);padding:22px 24px;border-radius:22px 22px 0 0;position:relative;}
.modal-title{font-family:'Cinzel',serif;color:var(--gl);font-size:18px;font-weight:700;}
.modal-sub{font-family:'Crimson Pro',serif;color:rgba(255,248,240,.55);font-size:13px;font-style:italic;margin-top:3px;}
.modal-close{position:absolute;top:18px;right:18px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.1);border:none;color:rgba(255,248,240,.7);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;}
.modal-close:hover{background:rgba(255,107,0,.3);}
.modal-body{padding:22px 24px;}
.modal-foot{padding:16px 24px;border-top:1px solid rgba(212,160,23,.12);display:flex;gap:10px;justify-content:flex-end;}
.wb{background:linear-gradient(135deg,rgba(255,107,0,.07),rgba(212,160,23,.05));border:1px solid rgba(212,160,23,.18);border-radius:14px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
.wb h3{font-family:'Cinzel',serif;font-size:15px;color:var(--db);margin-bottom:3px;}
.wb p{font-family:'Crimson Pro',serif;font-style:italic;color:var(--lb);font-size:13px;}
.chip{display:inline-flex;align-items:center;padding:5px 12px;border-radius:18px;font-size:11.5px;font-weight:700;background:rgba(255,107,0,.07);color:var(--s);border:1px solid rgba(255,107,0,.18);cursor:pointer;transition:all .18s;margin:0 5px 5px 0;}
.chip:hover,.chip.on{background:var(--s);color:#fff;border-color:var(--s);}
.toast-wrap{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:999;display:flex;flex-direction:column;gap:8px;pointer-events:none;align-items:center;}
.toast{background:linear-gradient(135deg,#1a0f07,#3d2211);color:var(--gl);padding:12px 22px;border-radius:30px;font-size:13px;font-weight:700;border:1px solid rgba(212,160,23,.35);box-shadow:0 8px 24px rgba(0,0,0,.4);animation:tIn .3s ease,tOut .3s ease 2.7s forwards;white-space:nowrap;}
@keyframes tIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes tOut{to{opacity:0;transform:translateY(-10px);}}
.vc{background:#fff;border-radius:14px;padding:16px 18px;border:1px solid rgba(212,160,23,.1);display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.vc-name{font-weight:800;color:var(--db);font-size:13.5px;}
.vc-det{font-size:11.5px;color:var(--lb);margin-top:3px;}
.doc-chip{background:rgba(41,128,185,.07);color:#2980B9;border:1px solid rgba(41,128,185,.18);padding:2px 8px;border-radius:7px;font-size:10px;font-weight:700;margin-right:4px;}
.tc{background:#fff;border-radius:18px;overflow:hidden;border:1px solid rgba(212,160,23,.1);transition:all .3s;cursor:pointer;}
.tc:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(44,26,14,.13);}
.tc-img{height:130px;background:linear-gradient(135deg,#5c3317,#8B4513,#CD853F);display:flex;align-items:center;justify-content:center;font-size:52px;position:relative;}
.live-b{position:absolute;top:9px;right:9px;background:#C0392B;color:#fff;font-size:10px;padding:3px 8px;border-radius:9px;font-weight:800;z-index:1;display:flex;align-items:center;gap:4px;}
.live-dot{width:6px;height:6px;border-radius:50%;background:#fff;animation:blink 1s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
.tc-body{padding:14px 16px;}
.tc-name{font-family:'Cinzel',serif;font-size:14px;font-weight:700;color:var(--db);}
.tc-loc{font-size:11.5px;color:var(--lb);margin:4px 0 10px;}
.upz{border:2px dashed rgba(212,160,23,.3);border-radius:12px;padding:20px;text-align:center;background:rgba(255,243,230,.35);cursor:pointer;transition:all .2s;}
.upz:hover{border-color:var(--s);background:rgba(255,107,0,.04);}
.prog-bar{height:5px;background:rgba(212,160,23,.12);border-radius:3px;overflow:hidden;margin-top:5px;}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--s),var(--g));border-radius:3px;}
.dom{text-align:center;position:relative;margin:20px 0;color:rgba(212,160,23,.5);font-size:16px;}
.dom::before,.dom::after{content:'';position:absolute;top:50%;width:44%;height:1px;background:rgba(212,160,23,.18);}
.dom::before{left:0;}.dom::after{right:0;}
.ac{background:#fff;border-radius:14px;padding:20px;border:1px solid rgba(212,160,23,.1);}
.bar-row{display:flex;align-items:center;gap:9px;margin-bottom:9px;}
.bar-lbl{font-size:11.5px;color:var(--br);font-weight:600;flex-shrink:0;}
.bar-track{flex:1;height:9px;background:rgba(212,160,23,.09);border-radius:5px;overflow:hidden;}
.bar-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,var(--s),var(--g));transition:width .8s ease;}
.bar-val{font-size:11.5px;font-weight:700;color:var(--db);width:42px;text-align:right;}
.mini-chart{height:64px;display:flex;align-items:flex-end;gap:3px;padding-top:8px;}
.cbar{flex:1;border-radius:3px 3px 0 0;background:linear-gradient(to top,var(--s),var(--g));min-height:4px;}
.steps{display:flex;align-items:center;gap:8px;margin-bottom:22px;flex-wrap:wrap;}
.step-arr{color:rgba(212,160,23,.35);margin-left:2px;}
.cart-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(212,160,23,.1);}
.cart-item:last-child{border-bottom:none;}
.cart-icon{font-size:28px;width:44px;height:44px;background:linear-gradient(135deg,#FFF3E6,#FDE8CC);border-radius:10px;display:flex;align-items:center;justify-content:center;}
.qty-ctrl{display:flex;align-items:center;gap:8px;}
.qty-btn{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(255,107,0,.3);background:transparent;color:var(--s);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;font-weight:700;transition:all .18s;}
.qty-btn:hover{background:var(--s);color:#fff;}
.qty-num{font-weight:800;font-size:14px;width:20px;text-align:center;}
.otp-wrap{display:flex;gap:7px;justify-content:center;margin:14px 0 22px;}
.otp-d{width:48px;height:54px;text-align:center;font-size:22px;font-weight:700;border:2px solid rgba(212,160,23,.28);border-radius:11px;background:var(--cream);color:var(--db);outline:none;font-family:'Cinzel',serif;transition:all .2s;}
.otp-d:focus{border-color:var(--s);box-shadow:0 0 0 3px rgba(255,107,0,.1);}
.fab{position:fixed;bottom:22px;right:22px;width:50px;height:50px;background:linear-gradient(135deg,var(--s),var(--g));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:21px;cursor:pointer;box-shadow:0 4px 18px rgba(255,107,0,.38);z-index:50;animation:glow 3s ease-in-out infinite;}
.sq{background:rgba(255,107,0,.07);border-radius:11px;padding:13px;border:1px solid rgba(255,107,0,.13);}
.notif-panel{position:absolute;top:54px;right:0;width:300px;background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.25);border:1px solid rgba(212,160,23,.18);overflow:hidden;z-index:300;}
.notif-head{background:linear-gradient(135deg,#1a0f07,#3d2211);padding:13px 16px;display:flex;justify-content:space-between;align-items:center;}
.notif-item{padding:11px 14px;border-bottom:1px solid rgba(212,160,23,.08);display:flex;gap:9px;align-items:flex-start;cursor:pointer;}
.notif-item:hover{background:rgba(255,107,0,.03);}
.loading{display:flex;align-items:center;justify-content:center;padding:40px;flex-direction:column;gap:12px;}
.spinner{width:36px;height:36px;border:3px solid rgba(212,160,23,.2);border-top-color:var(--s);border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.err-box{background:rgba(192,57,43,.07);border:1px solid rgba(192,57,43,.2);border-radius:12px;padding:16px 20px;color:#C0392B;font-size:13px;font-weight:600;margin-bottom:16px;}
.config-warn{background:linear-gradient(135deg,rgba(192,57,43,.1),rgba(192,57,43,.05));border:2px solid rgba(192,57,43,.35);border-radius:16px;padding:22px 24px;margin-bottom:22px;}
.config-warn h3{font-family:'Cinzel',serif;color:#C0392B;font-size:16px;margin-bottom:8px;}
.config-warn code{background:rgba(0,0,0,.07);padding:2px 7px;border-radius:5px;font-size:12px;font-family:monospace;}
`;

// ============================================================
// MUHURTAS (static — from Panchang)
// ============================================================
const MUHURTAS = [
  { day:"14", month:"Mar", tithi:"Tritiya",   nakshatra:"Rohini",          quality:"Excellent", time:"7:15 AM - 11:30 AM" },
  { day:"18", month:"Mar", tithi:"Saptami",   nakshatra:"Pushya",          quality:"Very Good", time:"6:00 AM - 10:00 AM" },
  { day:"22", month:"Mar", tithi:"Ekadashi",  nakshatra:"Uttara Phalguni", quality:"Good",      time:"9:00 AM - 1:00 PM"  },
  { day:"25", month:"Mar", tithi:"Chaturdashi",nakshatra:"Hasta",          quality:"Excellent", time:"7:30 AM - 12:00 PM" },
  { day:"2",  month:"Apr", tithi:"Tritiya",   nakshatra:"Rohini",          quality:"Excellent", time:"6:45 AM - 11:00 AM" },
  { day:"8",  month:"Apr", tithi:"Ashtami",   nakshatra:"Chitra",          quality:"Good",      time:"10:00 AM - 2:00 PM" },
];

const SEVA_OPTIONS = [
  { id:1, icon:"🍽️", name:"Brahmin Bhojan",  desc:"Feed learned Brahmins and earn divine blessings",           amounts:[251,501,1001,2100] },
  { id:2, icon:"🐄", name:"Gau Seva",         desc:"Support and nourish sacred cows, considered auspicious",   amounts:[101,251,501,1001] },
  { id:3, icon:"🛕", name:"Temple Donation",  desc:"Directly support temple renovation and daily operations",   amounts:[501,1001,2501,5001] },
  { id:4, icon:"📚", name:"Veda Pathshala",   desc:"Sponsor Vedic education for students learning scriptures",  amounts:[1001,2001,5001,11000] },
  { id:5, icon:"🌿", name:"Tulsi Puja",        desc:"Sponsor daily Tulsi worship at temple premises",          amounts:[51,101,251,501] },
  { id:6, icon:"🪔", name:"Akhand Deep",       desc:"Keep the eternal flame burning in temples round the clock",amounts:[251,351,501,1001] },
];

// ============================================================
// UTILITY
// ============================================================
function Toggle({ on, onChange }) {
  return <div className={`toggle ${on?"on":""}`} onClick={()=>onChange(!on)}><div className="toggle-knob"/></div>;
}
function Toast({ toasts }) {
  return <div className="toast-wrap">{toasts.map(t=><div key={t.id} className="toast">{t.icon} {t.msg}</div>)}</div>;
}
function Spinner() {
  return <div className="loading"><div className="spinner"/><div style={{fontSize:13,color:"#8B6347",fontWeight:700}}>Loading sacred data...</div></div>;
}
function StatusBadge({ status }) {
  return <span className={`sb sb-${status}`}>{status?.charAt(0).toUpperCase()+status?.slice(1)}</span>;
}
function Stars({ rating=5 }) {
  return <span>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=Math.round(rating)?"#D4A017":"#ddd",fontSize:13}}>★</span>)}</span>;
}
function isConfigured() {
  return SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co" && SUPABASE_KEY !== "YOUR_ANON_KEY";
}

// ============================================================
// SUPABASE HELPERS
// ============================================================
const db = {
  pandits:  ()=>supabase.from("pandits"),
  rituals:  ()=>supabase.from("rituals"),
  bookings: ()=>supabase.from("bookings"),
  requests: ()=>supabase.from("pandit_requests"),
  temples:  ()=>supabase.from("temples"),
  samagri:  ()=>supabase.from("samagri"),
  donations:()=>supabase.from("donations"),
  orders:   ()=>supabase.from("orders"),
  devotees: ()=>supabase.from("devotees"),
};

function genId(prefix) {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}

// ============================================================
// MAIN APP
// ============================================================
export default function DevSetu() {
  const [activeApp, setActiveApp]   = useState("user");
  const [activePage, setActivePage] = useState("home");
  const [showLogin, setShowLogin]   = useState(true);
  const [otpSent, setOtpSent]       = useState(false);
  const [otpVal, setOtpVal]         = useState(["","","","","",""]);
  const [phone, setPhone]           = useState("");
  const [devoteeId, setDevoteeId]   = useState(null);
  const [devoteeName, setDevoteeName] = useState("Rahul Sharma");
  const [toasts, setToasts]         = useState([]);
  const [showNotif, setShowNotif]   = useState(false);
  const [showCart, setShowCart]     = useState(false);
  const [cart, setCart]             = useState([]);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [viewPandit, setViewPandit]     = useState(null);
  const [panditOnline, setPanditOnline] = useState(true);
  const [panditId, setPanditId]     = useState(null); // set after pandit logs in

  // ---- REALTIME COUNTS ----
  const [pendingReqCount, setPendingReqCount] = useState(0);

  const toast = useCallback((msg, icon="🙏")=>{
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,icon}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3100);
  },[]);

  // cart helpers
  const addToCart = (item)=>{
    setCart(prev=>{
      const ex=prev.find(c=>c.id===item.id);
      if(ex) return prev.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c);
      return [...prev,{...item,qty:1}];
    });
    toast(`${item.name} added to cart`,"🛒");
  };
  const updateCartQty=(id,delta)=>setCart(prev=>prev.map(c=>c.id===id?{...c,qty:c.qty+delta}:c).filter(c=>c.qty>0));
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  const switchApp=(app)=>{
    setActiveApp(app);
    const map={user:"home",pandit:"p-home",admin:"a-home"};
    setActivePage(map[app]);
    setShowNotif(false);
  };

  // ---- LOGIN ----
  const handleLogin = async ()=>{
    const ph = phone||"+91 9876543210";
    // Upsert devotee
    const {data,error}= await db.devotees().upsert({name:"Rahul Sharma",phone:ph,city:"Delhi"},{onConflict:"phone"}).select().single();
    if(data){ setDevoteeId(data.id); setDevoteeName(data.name); }
    // Get first pandit for pandit app demo
    const {data:pdata}= await db.pandits().select("id").eq("name","Pt. Ramesh Sharma").single();
    if(pdata) setPanditId(pdata.id);
    setShowLogin(false);
    toast("Welcome to DevSetu! 🙏","✨");
    // Subscribe to pandit requests realtime
    if(pdata){
      supabase.channel("req-watch").on("postgres_changes",{event:"INSERT",schema:"public",table:"pandit_requests",filter:`pandit_id=eq.${pdata.id}`},()=>{
        setPendingReqCount(c=>c+1);
        toast("New booking request received!","📩");
      }).subscribe();
    }
  };

  const pageMeta = {
    "home":          ["🏠 Devotee Dashboard",       "Your spiritual journey — bookings, muhurtas & more"],
    "book-pandit":   ["🙏 Book a Pandit",            "Choose from verified Vedic scholars for your rituals"],
    "muhurat":       ["🌙 Muhurat Finder",           "AI-powered auspicious dates from the Panchang"],
    "temple":        ["🛕 Temple Poojas & Live Darshan","Book poojas and watch sacred ceremonies live"],
    "samagri":       ["🪔 Pooja Samagri Shop",       "Curated ritual kits delivered to your doorstep"],
    "seva":          ["💛 Daan & Seva",              "Contribute to sacred causes and earn divine blessings"],
    "history":       ["📋 My Bookings",              "Your complete pooja and booking history"],
    "p-home":        ["📊 Pandit Dashboard",         "Your bookings, earnings and performance"],
    "p-requests":    ["📩 Booking Requests",         "Accept or decline incoming booking requests"],
    "p-profile":     ["🕉️ My Profile",              "Manage your pandit profile and documents"],
    "p-earnings":    ["💰 Earnings",                 "Track income, payouts and financial history"],
    "p-availability":["🗓️ Availability",            "Manage your schedule and working hours"],
    "a-home":        ["📊 Admin Overview",           "Platform-wide analytics and management"],
    "a-verify":      ["✅ Verify Pandits",           "Review and approve pandit registrations"],
    "a-bookings":    ["📋 All Bookings",             "Monitor and manage all platform bookings"],
    "a-rituals":     ["🛕 Rituals & Temples",        "Manage the ritual catalog and temple listings"],
    "a-payments":    ["💰 Payments & Analytics",     "Financial tracking and revenue analytics"],
  };
  const [ptitle,psub]=pageMeta[activePage]||["DevSetu",""];

  const navConfig = {
    user:[{title:"Devotee",items:[
      {id:"home",label:"Home",icon:"🏠"},
      {id:"book-pandit",label:"Book Pandit",icon:"🙏"},
      {id:"muhurat",label:"Muhurat Finder",icon:"🌙"},
      {id:"temple",label:"Temple Poojas",icon:"🛕"},
      {id:"samagri",label:"Pooja Samagri",icon:"🪔"},
      {id:"seva",label:"Daan & Seva",icon:"💛"},
      {id:"history",label:"My Bookings",icon:"📋"},
    ]}],
    pandit:[{title:"Pandit",items:[
      {id:"p-home",label:"Dashboard",icon:"📊"},
      {id:"p-requests",label:"Requests",icon:"📩"},
      {id:"p-profile",label:"My Profile",icon:"🕉️"},
      {id:"p-earnings",label:"Earnings",icon:"💰"},
      {id:"p-availability",label:"Availability",icon:"🗓️"},
    ]}],
    admin:[{title:"Admin",items:[
      {id:"a-home",label:"Overview",icon:"📊"},
      {id:"a-verify",label:"Verify Pandits",icon:"✅"},
      {id:"a-bookings",label:"All Bookings",icon:"📋"},
      {id:"a-rituals",label:"Rituals & Temples",icon:"🛕"},
      {id:"a-payments",label:"Payments",icon:"💰"},
    ]}],
  };

  const ctx={
    supabase, db, isConfigured: isConfigured(),
    devoteeId, devoteeName,
    panditId, panditOnline, setPanditOnline,
    cart, addToCart, updateCartQty, cartCount, setShowCart,
    bookingDraft, setBookingDraft, showConfirm, setShowConfirm,
    viewPandit, setViewPandit,
    setActivePage, toast, MUHURTAS, SEVA_OPTIONS,
  };

  return (
    <AppCtx.Provider value={ctx}>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className="tnav">
        <div className="logo">
          <div className="logo-icon">🕉️</div>
          <div><div className="logo-name">DevSetu</div><div className="logo-tagline">Bridge to Divine Services</div></div>
        </div>
        <div className="nav-tabs">
          {[["user","👤 Devotee"],["pandit","🕉️ Pandit"],["admin","⚙️ Admin"]].map(([id,label])=>(
            <button key={id} className={`ntab ${activeApp===id?"active":""}`} onClick={()=>switchApp(id)}>{label}</button>
          ))}
        </div>
        <div className="nav-r">
          {activeApp==="user"&&<div className="icon-btn" onClick={()=>setShowCart(true)}>🛒{cartCount>0&&<div className="badge">{cartCount}</div>}</div>}
          <div className="icon-btn" onClick={()=>setShowNotif(n=>!n)}>🔔{pendingReqCount>0&&<div className="badge">{pendingReqCount}</div>}</div>
          <div className="icon-btn" style={{fontFamily:"'Cinzel',serif",fontSize:12,fontWeight:700,color:"#F0C040",width:"auto",padding:"0 12px",borderRadius:20,border:"1px solid rgba(212,160,23,.3)"}}>
            {activeApp==="user"?"👤 "+devoteeName.split(" ")[0]:activeApp==="pandit"?"🕉️ Pandit":"⚙️ Admin"}
          </div>
          {showNotif&&<div className="notif-panel">
            <div className="notif-head"><span style={{fontFamily:"'Cinzel',serif",color:"#F0C040",fontSize:13}}>🔔 Notifications</span><button style={{background:"none",border:"none",color:"rgba(240,192,64,.6)",cursor:"pointer",fontSize:11}} onClick={()=>{setShowNotif(false);setPendingReqCount(0);}}>Mark read</button></div>
            {["New booking confirmed for Mar 14","Pandit accepted your request","Samagri kit dispatched","Auspicious Muhurta: Mar 14"].map((n,i)=>(
              <div key={i} className="notif-item"><div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,107,0,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{"✅🙏📦🌙"[i]}</div><div style={{fontSize:12,color:"#2C1A0E",lineHeight:1.4}}>{n}</div></div>
            ))}
          </div>}
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="layout">
        <aside className="sidebar">
          {navConfig[activeApp].map((sec,si)=>(
            <div key={si}>
              <div className="s-section-title">{sec.title}</div>
              {sec.items.map(item=>(
                <div key={item.id} className={`s-item ${activePage===item.id?"active":""}`} onClick={()=>setActivePage(item.id)}>
                  <span className="s-icon">{item.icon}</span>{item.label}
                </div>
              ))}
              <div className="s-div"/>
            </div>
          ))}
          <div style={{padding:"0 16px",marginTop:4}}>
            <div className="sq">
              <div style={{fontSize:18,marginBottom:5}}>🙏</div>
              <div style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:11.5,color:"rgba(255,248,240,.5)",lineHeight:1.5}}>"Yatra Dharma, tatra Vijaya"</div>
              <div style={{fontSize:10,color:"rgba(212,160,23,.45)",marginTop:4}}>— Mahabharata</div>
            </div>
          </div>
        </aside>

        <div className="content">
          <div className="ph">
            <div className="ph-title">{ptitle}</div>
            <div className="ph-sub">{psub}</div>
          </div>
          <div className="cb">
            {!isConfigured()&&(
              <div className="config-warn">
                <h3>⚙️ Supabase Configuration Required</h3>
                <p style={{fontSize:13,color:"#5C3317",lineHeight:1.7,marginBottom:10}}>
                  Open this file and replace the two constants at the top:<br/>
                  <code>SUPABASE_URL</code> → Your project URL from Supabase dashboard<br/>
                  <code>SUPABASE_KEY</code> → Your anon/public API key<br/>
                  Then run the SQL schema file in your Supabase SQL Editor.
                </p>
                <p style={{fontSize:12,color:"#8B6347"}}>Until configured, the app runs in demo mode with no live data.</p>
              </div>
            )}
            {activePage==="home"&&<UserHome/>}
            {activePage==="book-pandit"&&<BookPandit/>}
            {activePage==="muhurat"&&<MuhuratPage/>}
            {activePage==="temple"&&<TemplePage/>}
            {activePage==="samagri"&&<SamagriPage/>}
            {activePage==="seva"&&<SevaPage/>}
            {activePage==="history"&&<HistoryPage/>}
            {activePage==="p-home"&&<PanditHome/>}
            {activePage==="p-requests"&&<PanditReqPage/>}
            {activePage==="p-profile"&&<PanditProfilePage/>}
            {activePage==="p-earnings"&&<PanditEarningsPage/>}
            {activePage==="p-availability"&&<PanditAvailPage/>}
            {activePage==="a-home"&&<AdminHome/>}
            {activePage==="a-verify"&&<AdminVerify/>}
            {activePage==="a-bookings"&&<AdminBookingsPage/>}
            {activePage==="a-rituals"&&<AdminRitualsPage/>}
            {activePage==="a-payments"&&<AdminPaymentsPage/>}
          </div>
        </div>
      </div>

      <div className="fab">🕉️</div>

      {/* MODALS */}
      {viewPandit&&<PanditModal pandit={viewPandit} onClose={()=>setViewPandit(null)}/>}
      {showConfirm&&bookingDraft&&<ConfirmModal/>}
      {showCart&&<CartModal onClose={()=>setShowCart(false)}/>}
      {showLogin&&<LoginModal phone={phone} setPhone={setPhone} otpSent={otpSent} setOtpSent={setOtpSent} otpVal={otpVal} setOtpVal={setOtpVal} onLogin={handleLogin}/>}

      <Toast toasts={toasts}/>
    </AppCtx.Provider>
  );
}

// ============================================================
// LOGIN MODAL
// ============================================================
function LoginModal({phone,setPhone,otpSent,setOtpSent,otpVal,setOtpVal,onLogin}){
  const refs=useRef([]);
  const handleChange=(i,v)=>{
    if(!/^\d?$/.test(v))return;
    const nv=[...otpVal];nv[i]=v;setOtpVal(nv);
    if(v&&i<5)refs.current[i+1]?.focus();
  };
  const handleKey=(i,e)=>{ if(e.key==="Backspace"&&!otpVal[i]&&i>0)refs.current[i-1]?.focus(); };
  const filled=otpVal.every(v=>v!=="");
  return(
    <div className="overlay">
      <div className="modal" style={{maxWidth:400,textAlign:"center"}}>
        <div style={{padding:"36px 28px 28px"}}>
          <div style={{fontSize:54,marginBottom:8}}>🕉️</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,color:"#2C1A0E",marginBottom:4}}>Welcome to DevSetu</div>
          <div style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",color:"#8B6347",fontSize:14,marginBottom:28}}>Bridge to Divine Services</div>
          {!otpSent?(
            <>
              <div className="fg" style={{textAlign:"left",marginBottom:16}}>
                <label className="fl">Mobile Number</label>
                <input className="fi" placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)} style={{textAlign:"center",letterSpacing:2,fontSize:16}}/>
              </div>
              <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px"}} onClick={()=>setOtpSent(true)}>📱 Send OTP</button>
              <div className="dom" style={{margin:"18px 0"}}>🕉</div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}}>G Google</button>
                <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}}>f Facebook</button>
              </div>
            </>
          ):(
            <>
              <div style={{color:"#8B6347",fontSize:13,marginBottom:4}}>OTP sent to {phone||"+91 98765 43210"}</div>
              <div className="otp-wrap">
                {otpVal.map((v,i)=>(
                  <input key={i} ref={el=>refs.current[i]=el} className="otp-d" maxLength={1} value={v}
                    onChange={e=>handleChange(i,e.target.value)} onKeyDown={e=>handleKey(i,e)}/>
                ))}
              </div>
              <button className={`btn btn-primary ${!filled?"btn-disabled":""}`} style={{width:"100%",justifyContent:"center",padding:"12px"}} onClick={onLogin}>🙏 Verify & Enter</button>
              <div style={{fontSize:12.5,color:"#8B6347",marginTop:14,cursor:"pointer"}} onClick={()=>setOtpSent(false)}>← Change number</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PANDIT DETAIL MODAL
// ============================================================
function PanditModal({pandit,onClose}){
  const {setActivePage}=useApp();
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:540}} onClick={e=>e.stopPropagation()}>
        <div style={{background:"linear-gradient(135deg,#3d2211,#6b3820)",padding:"22px 24px",borderRadius:"22px 22px 0 0",display:"flex",gap:16,alignItems:"center",position:"relative"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B00,#D4A017)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,border:"3px solid rgba(240,192,64,.45)"}}>{pandit.emoji}</div>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",color:"#F0C040",fontSize:17,fontWeight:700}}>{pandit.name}</div>
            <div style={{color:"rgba(255,248,240,.6)",fontSize:12.5,marginTop:2}}>{pandit.speciality} · {pandit.experience_years} years</div>
            {pandit.verified&&<div className="vbadge">✓ Verified Pandit</div>}
            <div style={{color:"rgba(255,248,240,.5)",fontSize:11.5,marginTop:4}}>📍 {pandit.city}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[[pandit.rating,"Rating"],[pandit.review_count,"Reviews"],[pandit.completed_poojas,"Poojas"]].map(([v,l])=>(
              <div key={l} style={{textAlign:"center",background:"rgba(255,107,0,.05)",borderRadius:10,padding:10}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:700,color:"#FF6B00"}}>{v}</div>
                <div style={{fontSize:10.5,color:"#8B6347",textTransform:"uppercase",letterSpacing:.4,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:13.5,color:"#2C1A0E",lineHeight:1.6,fontFamily:"'Crimson Pro',serif",marginBottom:14}}>{pandit.bio}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
            {(pandit.tags||[]).map((t,i)=><span key={i} className="ptag">{t}</span>)}
          </div>
          <div style={{background:"rgba(255,107,0,.06)",borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#8B6347",textTransform:"uppercase"}}>Starting Price</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,color:"#FF6B00"}}>₹{pandit.price?.toLocaleString()}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <span className={`avdot av-${pandit.status}`}/>
              <span style={{fontSize:12.5,fontWeight:700}}>{pandit.status==="available"?"Available":pandit.status==="busy"?"Busy":"Offline"}</span>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={()=>{onClose();setActivePage("book-pandit");}}>Book This Pandit</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONFIRM BOOKING MODAL
// ============================================================
function ConfirmModal(){
  const {bookingDraft,setBookingDraft,setShowConfirm,devoteeId,devoteeName,toast,setActivePage,db}=useApp();
  const [loading,setLoading]=useState(false);

  const confirm=async()=>{
    setLoading(true);
    const id=genId("DS");
    const {error}=await db.bookings().insert({
      id,
      devotee_id:devoteeId,
      devotee_name:devoteeName,
      pandit_id:bookingDraft.panditId,
      pandit_name:bookingDraft.panditName,
      ritual:bookingDraft.ritual,
      ritual_icon:bookingDraft.ritualIcon,
      booking_date:bookingDraft.date,
      booking_time:bookingDraft.time,
      address:bookingDraft.address,
      location:bookingDraft.location,
      amount:bookingDraft.amount,
      notes:bookingDraft.notes||"",
      status:"confirmed",
    });
    if(!error){
      // Also create pandit request
      await db.requests().insert({
        id:genId("REQ"),
        booking_id:id,
        pandit_id:bookingDraft.panditId,
        devotee_name:devoteeName,
        devotee_emoji:"👤",
        ritual:bookingDraft.ritual,
        ritual_icon:bookingDraft.ritualIcon,
        booking_date:bookingDraft.date,
        booking_time:bookingDraft.time,
        address:bookingDraft.address,
        amount:bookingDraft.amount,
        status:"pending",
      });
      setShowConfirm(false);
      setBookingDraft(null);
      toast("Booking confirmed! Pandit has been notified.","✅");
      setActivePage("history");
    } else {
      toast("Error saving booking. Check Supabase config.","❌");
    }
    setLoading(false);
  };

  if(!bookingDraft)return null;
  return(
    <div className="overlay" onClick={()=>setShowConfirm(false)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">🙏 Confirm Your Booking</div>
          <div className="modal-sub">Review details before proceeding to payment</div>
          <button className="modal-close" onClick={()=>setShowConfirm(false)}>✕</button>
        </div>
        <div className="modal-body">
          {[["Ritual",`${bookingDraft.ritualIcon} ${bookingDraft.ritual}`],["Pandit",bookingDraft.panditName],["Date",bookingDraft.date],["Time",bookingDraft.time],["Location",bookingDraft.address]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(212,160,23,.1)"}}>
              <span style={{fontSize:12.5,fontWeight:700,color:"#8B6347",textTransform:"uppercase",letterSpacing:.5}}>{k}</span>
              <span style={{fontSize:13.5,fontWeight:600,color:"#2C1A0E",maxWidth:"60%",textAlign:"right"}}>{v}</span>
            </div>
          ))}
          <div style={{background:"rgba(255,107,0,.06)",borderRadius:11,padding:"14px",marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700}}>Total Amount</span>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,color:"#FF6B00"}}>₹{bookingDraft.amount?.toLocaleString()}</span>
          </div>
          <div style={{fontSize:11.5,color:"#8B6347",marginTop:12,textAlign:"center",fontFamily:"'Crimson Pro',serif",fontStyle:"italic"}}>
            Secure payment via Razorpay · 100% refundable before 24 hrs
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={()=>setShowConfirm(false)}>Edit</button>
          <button className={`btn btn-primary ${loading?"btn-disabled":""}`} onClick={confirm}>
            {loading?"Processing...":"💳 Pay ₹"+bookingDraft.amount?.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CART MODAL
// ============================================================
function CartModal({onClose}){
  const {cart,updateCartQty,toast,db,devoteeId,devoteeName}=useApp();
  const [loading,setLoading]=useState(false);
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);

  const checkout=async()=>{
    setLoading(true);
    const {error}=await db.orders().insert({
      devotee_id:devoteeId,
      devotee_name:devoteeName,
      items:cart.map(c=>({id:c.id,name:c.name,qty:c.qty,price:c.price})),
      total,status:"placed",
    });
    setLoading(false);
    onClose();
    toast("Order placed! Delivery in 2-4 days.","📦");
    cart.length=0; // clear
  };

  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">🛒 Your Cart</div>
          <div className="modal-sub">{cart.length} item{cart.length!==1?"s":""} in your order</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {cart.length===0?(
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:48,marginBottom:10}}>🪔</div>
              <div style={{fontFamily:"'Cinzel',serif",color:"#5C3317"}}>Cart is empty</div>
            </div>
          ):(<>
            {cart.map(item=>(
              <div key={item.id} className="cart-item">
                <div className="cart-icon">{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{item.name}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,color:"#FF6B00",marginTop:2}}>₹{item.price}</div>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={()=>updateCartQty(item.id,-1)}>−</button>
                  <div className="qty-num">{item.qty}</div>
                  <button className="qty-btn" onClick={()=>updateCartQty(item.id,1)}>+</button>
                </div>
              </div>
            ))}
            <div style={{marginTop:16,padding:14,background:"rgba(255,107,0,.06)",borderRadius:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontWeight:700}}>Total</span>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:700,color:"#FF6B00"}}>₹{total}</span>
            </div>
          </>)}
        </div>
        {cart.length>0&&<div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Continue</button>
          <button className={`btn btn-primary ${loading?"btn-disabled":""}`} onClick={checkout}>{loading?"Placing...":"💳 Place Order — ₹"+total}</button>
        </div>}
      </div>
    </div>
  );
}

// ============================================================
// USER HOME
// ============================================================
function UserHome(){
  const {db,devoteeId,setActivePage,setViewPandit}=useApp();
  const [pandits,setPandits]=useState([]);
  const [rituals,setRituals]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async()=>{
      const [p,r,b]=await Promise.all([
        db.pandits().select("*").eq("status","available").limit(3),
        db.rituals().select("*").eq("active",true).limit(4),
        devoteeId?db.bookings().select("*").eq("devotee_id",devoteeId).order("created_at",{ascending:false}).limit(3):{data:[]},
      ]);
      setPandits(p.data||[]);
      setRituals(r.data||[]);
      setBookings(b.data||[]);
      setLoading(false);
    })();
  },[devoteeId]);

  if(loading)return <Spinner/>;
  const upcoming=bookings.filter(b=>b.status==="confirmed"||b.status==="pending");
  return(<>
    <div className="wb">
      <div><h3>🙏 Jai Shri Ram!</h3><p>"Dharmo rakshati rakshitah" — Righteousness protects those who uphold it</p></div>
      <button className="btn btn-primary" onClick={()=>setActivePage("book-pandit")}>+ Book Pandit</button>
    </div>
    <div className="stat-grid sg4" style={{marginBottom:22}}>
      {[
        {icon:"📿",val:bookings.length,lbl:"Total Bookings",trend:"Your journey"},
        {icon:"✅",val:bookings.filter(b=>b.status==="completed").length,lbl:"Completed",trend:"Well done!"},
        {icon:"📅",val:upcoming.length,lbl:"Upcoming",trend:"Scheduled"},
        {icon:"💛",val:"₹1,200",lbl:"Donated",trend:"Blessings earned"},
      ].map((s,i)=>(
        <div key={i} className="stat-card">
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-val">{s.val}</div>
          <div className="stat-lbl">{s.lbl}</div>
          <div className="stat-trend tup">{s.trend}</div>
        </div>
      ))}
    </div>
    <div className="sh"><div className="sh-title">Upcoming Shubh Muhurtas</div><button className="btn btn-outline btn-sm" onClick={()=>setActivePage("muhurat")}>View All</button></div>
    <div className="mcard">
      <div className="m-title">🌙 Auspicious Dates This Month</div>
      <div className="m-sub">Based on Vedic Panchang calculations</div>
      <div className="mdates">
        {MUHURTAS.slice(0,4).map((m,i)=><div key={i} className="md"><div className="md-day">{m.day}</div><div className="md-month">{m.month}</div><div className="md-tithi">{m.tithi}</div></div>)}
      </div>
    </div>
    {rituals.length>0&&<>
      <div className="sh"><div className="sh-title">Popular Rituals</div><button className="btn btn-outline btn-sm" onClick={()=>setActivePage("book-pandit")}>Book Now</button></div>
      <div className="rgrid">
        {rituals.map(r=>(
          <div key={r.id} className="rc" onClick={()=>setActivePage("book-pandit")}>
            <div className="rc-icon">{r.icon}</div>
            <div className="rc-body">
              <div className="rc-name">{r.name}</div>
              <div className="rc-price">₹{r.price?.toLocaleString()}</div>
              <div className="rc-dur">⏱ {r.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </>}
    {pandits.length>0&&<>
      <div className="sh"><div className="sh-title">Available Pandits</div><button className="btn btn-outline btn-sm" onClick={()=>setActivePage("book-pandit")}>All Pandits</button></div>
      <div className="pgrid">
        {pandits.map(p=><PanditCard key={p.id} p={p} onView={setViewPandit} onBook={()=>setActivePage("book-pandit")}/>)}
      </div>
    </>}
    {upcoming.length>0&&<>
      <div className="sh"><div className="sh-title">Upcoming Bookings</div><button className="btn btn-outline btn-sm" onClick={()=>setActivePage("history")}>All</button></div>
      <div className="card card-p" style={{marginBottom:20}}>
        {upcoming.slice(0,2).map(b=>(
          <div key={b.id} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:"1px solid rgba(212,160,23,.09)"}}>
            <div style={{fontSize:26}}>{b.ritual_icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13.5}}>{b.ritual}</div>
              <div style={{fontSize:12,color:"#8B6347"}}>{b.pandit_name} · {b.booking_date} at {b.booking_time}</div>
            </div>
            <StatusBadge status={b.status}/>
          </div>
        ))}
      </div>
    </>}
  </>);
}

// ============================================================
// PANDIT CARD COMPONENT
// ============================================================
function PanditCard({p,onView,onBook,selected=false,selectMode=false}){
  return(
    <div className={`pc ${selected?"selected":""}`} onClick={()=>selectMode?onBook&&onBook(p):onView&&onView(p)}>
      <div className="pc-head">
        <div className="pc-av">{p.emoji}</div>
        <div>
          <div className="pc-name">{p.name}</div>
          <div className="pc-spec">{p.speciality} · {p.experience_years} yrs</div>
          {p.verified&&<div className="vbadge">✓ Verified</div>}
        </div>
      </div>
      <div className="pc-body">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><Stars rating={p.rating}/><span style={{fontWeight:800,fontSize:13,marginLeft:3}}>{p.rating}</span><span style={{color:"#95A5A6",fontSize:11.5}}> ({p.review_count})</span></div>
          <div className="price-tag">₹{p.price?.toLocaleString()}</div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
          {(p.tags||[]).slice(0,2).map((t,i)=><span key={i} className="ptag">{t}</span>)}
          <span className="ptag ptag-g">📍 {p.city}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:12,fontWeight:600}}>
            <span className={`avdot av-${p.status}`}/>{p.status==="available"?"Available":p.status==="busy"?"Busy":"Offline"}
          </div>
          {onBook&&!selectMode&&<button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();onBook(p);}}>Book</button>}
          {selectMode&&selected&&<span style={{color:"#27AE60",fontWeight:800,fontSize:12}}>✓ Selected</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BOOK PANDIT
// ============================================================
function BookPandit(){
  const {db,devoteeId,devoteeName,setBookingDraft,setShowConfirm,toast,setViewPandit,MUHURTAS}=useApp();
  const [step,setStep]=useState(1);
  const [pandits,setPandits]=useState([]);
  const [rituals,setRituals]=useState([]);
  const [selRitual,setSelRitual]=useState(null);
  const [selPandit,setSelPandit]=useState(null);
  const [selMuhurat,setSelMuhurat]=useState(null);
  const [form,setForm]=useState({name:devoteeName,phone:"+91 9876543210",date:"",time:"7:00 AM (Brahma Muhurta)",address:"",notes:""});
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    db.rituals().select("*").eq("active",true).then(({data})=>setRituals(data||[]));
    db.pandits().select("*").then(({data})=>setPandits(data||[]));
  },[]);

  const ritual=rituals.find(r=>r.id===selRitual);
  const pandit=pandits.find(p=>p.id===selPandit);

  const submit=()=>{
    if(!ritual||!pandit||!form.date||!form.address){toast("Please fill all required fields","⚠️");return;}
    setBookingDraft({
      ritual:ritual.name,ritualIcon:ritual.icon,
      panditId:pandit.id,panditName:pandit.name,
      date:form.date,time:form.time,
      address:form.address,location:form.address.split(",")[0],
      amount:ritual.price,notes:form.notes,
    });
    setShowConfirm(true);
  };

  return(<>
    <div className="steps">
      {["Select Ritual","Choose Pandit","Set Schedule"].map((s,i)=>(
        <div key={i} className="step-item" style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11.5,fontWeight:800,
            background:step>i+1?"linear-gradient(135deg,#27AE60,#2ECC71)":step===i+1?"linear-gradient(135deg,#FF6B00,#D4A017)":"rgba(212,160,23,.12)",
            color:step>=i+1?"#fff":"#8B6347"}}>
            {step>i+1?"✓":i+1}
          </div>
          <span style={{fontSize:12.5,fontWeight:700,color:step===i+1?"#FF6B00":"#8B6347"}}>{s}</span>
          {i<2&&<div className="step-arr">›</div>}
        </div>
      ))}
    </div>

    {step===1&&(<>
      <div className="sh"><div className="sh-title">Choose a Ritual</div></div>
      {rituals.length===0?<Spinner/>:<div className="rgrid">
        {rituals.map(r=>(
          <div key={r.id} className={`rc ${selRitual===r.id?"selected":""}`} onClick={()=>setSelRitual(r.id)}>
            <div className="rc-icon">{r.icon}</div>
            <div className="rc-body">
              <div className="rc-name">{r.name}</div>
              <div className="rc-price">₹{r.price?.toLocaleString()}</div>
              <div className="rc-dur">⏱ {r.duration}</div>
            </div>
          </div>
        ))}
      </div>}
      {ritual&&<div className="card card-p" style={{marginBottom:16}}>
        <div style={{fontFamily:"'Crimson Pro',serif",color:"#5C3317",fontSize:14,lineHeight:1.6}}>{ritual.icon} {ritual.description}</div>
      </div>}
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className={`btn btn-primary ${!selRitual?"btn-disabled":""}`} onClick={()=>selRitual&&setStep(2)}>Next: Choose Pandit →</button>
      </div>
    </>)}

    {step===2&&(<>
      <div className="sh"><div className="sh-title">Choose Your Pandit</div><button className="btn btn-outline btn-sm" onClick={()=>setStep(1)}>← Back</button></div>
      {pandits.length===0?<Spinner/>:<div className="pgrid">
        {pandits.map(p=><PanditCard key={p.id} p={p} onView={setViewPandit} onBook={()=>setSelPandit(p.id)} selected={selPandit===p.id} selectMode/>)}
      </div>}
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className={`btn btn-primary ${!selPandit?"btn-disabled":""}`} onClick={()=>selPandit&&setStep(3)}>Next: Set Schedule →</button>
      </div>
    </>)}

    {step===3&&(<>
      <div className="sh"><div className="sh-title">Set Schedule & Details</div><button className="btn btn-outline btn-sm" onClick={()=>setStep(2)}>← Back</button></div>
      <div className="mcard" style={{marginBottom:20}}>
        <div className="m-title">🌙 Select Auspicious Date</div>
        <div className="m-sub">Click a Muhurta or pick your own date below</div>
        <div className="mdates">
          {MUHURTAS.map((m,i)=>(
            <div key={i} className={`md ${selMuhurat===i?"selected":""}`}
              onClick={()=>{setSelMuhurat(i);setForm(f=>({...f,date:`2026-${m.month==="Mar"?"03":"04"}-${m.day.padStart(2,"0")}`}));}}>
              <div className="md-day">{m.day}</div><div className="md-month">{m.month}</div><div className="md-tithi">{m.tithi}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card card-p" style={{marginBottom:20}}>
        <div className="fgrid">
          <div className="fg"><label className="fl">Your Name</label><input className="fi" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
          <div className="fg"><label className="fl">Phone</label><input className="fi" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
          <div className="fg"><label className="fl">Date *</label><input type="date" className="fi" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
          <div className="fg"><label className="fl">Preferred Time</label>
            <select className="fs" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}>
              {["6:00 AM (Brahma Muhurta)","7:00 AM","8:00 AM","9:00 AM","11:00 AM","3:00 PM","6:00 PM"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="fg ffw"><label className="fl">Ceremony Address *</label><input className="fi" placeholder="Full address with city, PIN..." value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/></div>
          <div className="fg ffw"><label className="fl">Special Instructions</label><textarea className="fta" placeholder="Dietary needs, language preference..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
        </div>
      </div>
      {ritual&&pandit&&<div style={{background:"rgba(255,107,0,.06)",borderRadius:14,padding:"16px 20px",marginBottom:20,border:"1px solid rgba(212,160,23,.18)"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:10}}>📋 Summary</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["Ritual",`${ritual.icon} ${ritual.name}`],["Pandit",pandit.name],["Duration",ritual.duration],["Amount",`₹${ritual.price?.toLocaleString()}`]].map(([k,v])=>(
            <div key={k}><div style={{fontSize:11,fontWeight:700,color:"#8B6347",textTransform:"uppercase"}}>{k}</div><div style={{fontSize:13,fontWeight:700}}>{v}</div></div>
          ))}
        </div>
      </div>}
      <div style={{display:"flex",gap:10}}>
        <button className="btn btn-primary" onClick={submit}>🙏 Confirm & Pay ₹{ritual?.price?.toLocaleString()||"---"}</button>
        <button className="btn btn-outline" onClick={()=>{setStep(1);setSelRitual(null);setSelPandit(null);setSelMuhurat(null);}}>Start Over</button>
      </div>
    </>)}
  </>);
}

// ============================================================
// MUHURAT PAGE
// ============================================================
function MuhuratPage(){
  const {MUHURTAS}=useApp();
  const [sel,setSel]=useState(null);
  const [selR,setSelR]=useState(null);
  const {db}=useApp();
  const [rituals,setRituals]=useState([]);
  useEffect(()=>{db.rituals().select("*").then(({data})=>setRituals(data||[]));  },[]);
  return(<>
    <div className="mcard">
      <div className="m-title">🌙 Vedic Muhurat Finder</div>
      <div className="m-sub">Powered by Panchang — Nakshatra, Tithi & Yoga calculations</div>
      <div className="mdates">
        {MUHURTAS.map((m,i)=><div key={i} className={`md ${sel===i?"selected":""}`} onClick={()=>setSel(i)}>
          <div className="md-day">{m.day}</div><div className="md-month">{m.month}</div><div className="md-tithi">{m.tithi}</div>
        </div>)}
      </div>
    </div>
    {sel!==null&&<div className="card card-p" style={{marginBottom:20}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:700,marginBottom:12}}>{MUHURTAS[sel].day} {MUHURTAS[sel].month} 2026</div>
      {[["Tithi",MUHURTAS[sel].tithi],["Nakshatra",MUHURTAS[sel].nakshatra],["Quality",MUHURTAS[sel].quality],["Shubh Time",MUHURTAS[sel].time],["Rahu Kaal","1:30 PM–3:00 PM (Avoid)"],["Abhijit Muhurta","11:52 AM–12:44 PM (Best)"]].map(([k,v])=>(
        <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(212,160,23,.09)"}}>
          <span style={{fontSize:12,fontWeight:700,color:"#8B6347",textTransform:"uppercase"}}>{k}</span>
          <span style={{fontSize:13.5,fontWeight:700,color:k==="Quality"?"#27AE60":"#2C1A0E"}}>{v}</span>
        </div>
      ))}
    </div>}
    <div className="sh"><div className="sh-title">Find Muhurat by Ritual</div></div>
    <div className="rgrid">
      {rituals.map(r=>(
        <div key={r.id} className={`rc ${selR===r.id?"selected":""}`} onClick={()=>setSelR(r.id)}>
          <div className="rc-icon">{r.icon}</div>
          <div className="rc-body">
            <div className="rc-name">{r.name}</div>
            {selR===r.id?<div style={{color:"#27AE60",fontWeight:700,fontSize:11,marginTop:6}}>Best: Mar 14, 7:15 AM ✓</div>:<div className="rc-price">₹{r.price?.toLocaleString()}</div>}
          </div>
        </div>
      ))}
    </div>
  </>);
}

// ============================================================
// TEMPLE PAGE
// ============================================================
function TemplePage(){
  const {db,toast}=useApp();
  const [temples,setTemples]=useState([]);
  const [booking,setBooking]=useState(null);
  const [selPooja,setSelPooja]=useState(null);
  useEffect(()=>{db.temples().select("*").then(({data})=>setTemples(data||[]));  },[]);
  return(<>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:22}}>
      {temples.map(t=>(
        <div key={t.id} className="tc">
          <div className="tc-img">{t.is_live&&<div className="live-b"><div className="live-dot"/>LIVE</div>}<span>{t.icon}</span></div>
          <div className="tc-body">
            <div className="tc-name">{t.name}</div>
            <div className="tc-loc">📍 {t.city}</div>
            <div style={{fontSize:12,color:"#8B6347",marginBottom:10,fontFamily:"'Crimson Pro',serif",fontStyle:"italic"}}>{t.description}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
              {(t.poojas||[]).map((p,i)=><span key={i} className="ptag" onClick={()=>{setBooking(t);setSelPooja(p);}}>{p}</span>)}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#8B6347",fontWeight:600}}>🕐 Next: {t.next_aarti}</span>
              <div style={{display:"flex",gap:6}}>
                {t.is_live&&<button className="btn btn-danger btn-sm" onClick={()=>toast(`Joining live darshan at ${t.name}!`,"🔴")}>🔴 Live</button>}
                <button className="btn btn-primary btn-sm" onClick={()=>setBooking(t)}>Book</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    {booking&&<div className="overlay" onClick={()=>setBooking(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{booking.icon} {booking.name}</div>
          <div className="modal-sub">📍 {booking.city} · Book a Sacred Pooja</div>
          <button className="modal-close" onClick={()=>setBooking(null)}>✕</button>
        </div>
        <div className="modal-body">
          {(booking.poojas||[]).map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:6,borderRadius:10,border:`1.5px solid ${selPooja===p?"#FF6B00":"rgba(212,160,23,.2)"}`,cursor:"pointer",background:selPooja===p?"rgba(255,107,0,.06)":"transparent"}} onClick={()=>setSelPooja(p)}>
              <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${selPooja===p?"#FF6B00":"rgba(212,160,23,.3)"}`,background:selPooja===p?"#FF6B00":"transparent"}}/>
              <span style={{fontWeight:600,fontSize:13.5}}>{p}</span>
            </div>
          ))}
          <div className="fgrid" style={{marginTop:14}}>
            <div className="fg"><label className="fl">Name</label><input className="fi" defaultValue="Rahul Sharma"/></div>
            <div className="fg"><label className="fl">Date</label><input type="date" className="fi"/></div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={()=>setBooking(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{setBooking(null);toast(`Pooja booked at ${booking.name}!`,"🛕");}}>Confirm Booking</button>
        </div>
      </div>
    </div>}
  </>);
}

// ============================================================
// SAMAGRI PAGE
// ============================================================
function SamagriPage(){
  const {db,addToCart,setShowCart,cartCount}=useApp();
  const [items,setItems]=useState([]);
  const [view,setView]=useState(null);
  useEffect(()=>{db.samagri().select("*").eq("active",true).then(({data})=>setItems(data||[]));  },[]);
  return(<>
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
      <button className="btn btn-primary" onClick={()=>setShowCart(true)}>🛒 Cart {cartCount>0?`(${cartCount})`:""}</button>
    </div>
    <div className="sgrid">
      {items.map(k=>(
        <div key={k.id} className="sc">
          <div className="sc-img" onClick={()=>setView(k)}>{k.icon}</div>
          <div className="sc-body">
            <div className="sc-name" onClick={()=>setView(k)} style={{cursor:"pointer"}}>{k.name}</div>
            <div className="sc-items">📦 {k.item_count} items</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div className="sc-price">₹{k.price}</div>
              <button className="btn btn-primary btn-sm" onClick={()=>addToCart(k)}>+ Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    {view&&<div className="overlay" onClick={()=>setView(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div style={{fontSize:40,marginBottom:8}}>{view.icon}</div>
          <div className="modal-title">{view.name}</div>
          <div className="modal-sub">📦 {view.item_count} items · ₹{view.price}</div>
          <button className="modal-close" onClick={()=>setView(null)}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{fontWeight:700,fontSize:12,color:"#5C3317",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Kit Contents</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {(view.contents||[]).map((c,i)=>(
              <span key={i} style={{background:"rgba(255,107,0,.07)",color:"#FF6B00",border:"1px solid rgba(255,107,0,.15)",padding:"4px 10px",borderRadius:18,fontSize:12,fontWeight:700}}>{c}</span>
            ))}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={()=>setView(null)}>Close</button>
          <button className="btn btn-primary" onClick={()=>{addToCart(view);setView(null);}}>🛒 Add to Cart — ₹{view.price}</button>
        </div>
      </div>
    </div>}
  </>);
}

// ============================================================
// SEVA PAGE
// ============================================================
function SevaPage(){
  const {db,toast,devoteeId,devoteeName,SEVA_OPTIONS}=useApp();
  const [selAmts,setSelAmts]=useState({});
  const [customAmts,setCustomAmts]=useState({});
  const [donations,setDonations]=useState([]);

  useEffect(()=>{
    if(devoteeId) db.donations().select("*").eq("devotee_id",devoteeId).order("created_at",{ascending:false}).then(({data})=>setDonations(data||[]));
  },[devoteeId]);

  const donate=async(seva)=>{
    const amt=parseInt(customAmts[seva.id])||selAmts[seva.id];
    if(!amt){toast("Please select or enter an amount","⚠️");return;}
    const {data,error}=await db.donations().insert({devotee_id:devoteeId,devotee_name:devoteeName,seva_name:seva.name,seva_icon:seva.icon,amount:amt}).select().single();
    if(!error&&data){
      setDonations(prev=>[data,...prev]);
      toast(`₹${amt} donated for ${seva.name}! 🙏`,seva.icon);
      setSelAmts(s=>({...s,[seva.id]:null}));
      setCustomAmts(c=>({...c,[seva.id]:""}));
    } else {
      toast("Donation recorded locally!",seva.icon);
    }
  };

  return(<>
    <div className="sev-grid">
      {SEVA_OPTIONS.map(s=>(
        <div key={s.id} className="sev-card">
          <div className="sev-icon">{s.icon}</div>
          <div className="sev-name">{s.name}</div>
          <div className="sev-desc">{s.desc}</div>
          <div className="sev-amts">
            {s.amounts.map(a=><span key={a} className={`amt-chip ${selAmts[s.id]===a?"selected":""}`} onClick={()=>setSelAmts(p=>({...p,[s.id]:a}))}>₹{a}</span>)}
          </div>
          <input className="fi" placeholder="Custom ₹" type="number" value={customAmts[s.id]||""} onChange={e=>setCustomAmts(p=>({...p,[s.id]:e.target.value}))} style={{fontSize:12,padding:"6px 10px",marginBottom:10}}/>
          <button className="btn btn-gold btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>donate(s)}>🙏 Donate Now</button>
        </div>
      ))}
    </div>
    {donations.length>0&&<>
      <div className="sh"><div className="sh-title">Your Donation History</div></div>
      <div className="dtable">
        <div className="thead" style={{gridTemplateColumns:"1fr 2fr 1fr 1fr"}}>
          {["","Seva","Amount","Date"].map(h=><div key={h} className="th">{h}</div>)}
        </div>
        {donations.map(d=>(
          <div key={d.id} className="tr" style={{gridTemplateColumns:"1fr 2fr 1fr 1fr"}}>
            <div className="td" style={{fontSize:22}}>{d.seva_icon}</div>
            <div className="td">{d.seva_name}</div>
            <div className="td" style={{fontFamily:"'Cinzel',serif",fontWeight:700,color:"#FF6B00"}}>₹{d.amount}</div>
            <div className="td" style={{fontSize:12,color:"#8B6347"}}>{new Date(d.created_at).toLocaleDateString("en-IN")}</div>
          </div>
        ))}
      </div>
    </>}
  </>);
}

// ============================================================
// HISTORY PAGE
// ============================================================
function HistoryPage(){
  const {db,devoteeId}=useApp();
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("All");

  useEffect(()=>{
    if(!devoteeId){setLoading(false);return;}
    db.bookings().select("*").eq("devotee_id",devoteeId).order("created_at",{ascending:false})
      .then(({data})=>{setBookings(data||[]);setLoading(false);});
  },[devoteeId]);

  // realtime
  useEffect(()=>{
    if(!devoteeId)return;
    const ch=supabase.channel("bookings-user").on("postgres_changes",{event:"INSERT",schema:"public",table:"bookings",filter:`devotee_id=eq.${devoteeId}`},(payload)=>{
      setBookings(prev=>[payload.new,...prev]);
    }).subscribe();
    return ()=>supabase.removeChannel(ch);
  },[devoteeId]);

  if(loading)return <Spinner/>;
  const filtered=filter==="All"?bookings:bookings.filter(b=>b.status===filter.toLowerCase());
  return(<>
    <div style={{marginBottom:16}}>
      {["All","Confirmed","Pending","Completed","Cancelled"].map(f=>(
        <span key={f} className={`chip ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
          {f} ({f==="All"?bookings.length:bookings.filter(b=>b.status===f.toLowerCase()).length})
        </span>
      ))}
    </div>
    {filtered.length===0?<div className="card card-p" style={{textAlign:"center",padding:"40px"}}>
      <div style={{fontSize:48,marginBottom:12}}>📋</div>
      <div style={{fontFamily:"'Cinzel',serif",color:"#5C3317"}}>No bookings found</div>
    </div>:<div className="dtable">
      <div className="thead" style={{gridTemplateColumns:".7fr 1.3fr 1.5fr 1.2fr .8fr .8fr 1fr"}}>
        {["ID","Ritual","Pandit","Location","Date","Amount","Status"].map(h=><div key={h} className="th">{h}</div>)}
      </div>
      {filtered.map(b=>(
        <div key={b.id} className="tr" style={{gridTemplateColumns:".7fr 1.3fr 1.5fr 1.2fr .8fr .8fr 1fr"}}>
          <div className="td" style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#FF6B00"}}>#{b.id?.slice(-6)}</div>
          <div className="td">{b.ritual_icon} {b.ritual}</div>
          <div className="td"><div style={{fontSize:12}}>{b.pandit_name}</div><div className="td2">{b.booking_time}</div></div>
          <div className="td" style={{fontSize:12}}>{b.location}</div>
          <div className="td" style={{fontSize:12}}>{b.booking_date}</div>
          <div className="td" style={{fontFamily:"'Cinzel',serif",fontWeight:700}}>₹{b.amount?.toLocaleString()}</div>
          <div className="td"><StatusBadge status={b.status}/></div>
        </div>
      ))}
    </div>}
  </>);
}

// ============================================================
// PANDIT HOME
// ============================================================
function PanditHome(){
  const {db,panditId,panditOnline,setPanditOnline,toast}=useApp();
  const [requests,setRequests]=useState([]);
  const [loading,setLoading]=useState(true);
  const chartData=[40,55,48,65,72,68,80,75,88,92,85,95];

  const load=()=>{
    if(!panditId){setLoading(false);return;}
    db.requests().select("*").eq("pandit_id",panditId).order("created_at",{ascending:false})
      .then(({data})=>{setRequests(data||[]);setLoading(false);});
  };

  useEffect(()=>{
    load();
    if(!panditId)return;
    const ch=supabase.channel("req-realtime").on("postgres_changes",{event:"INSERT",schema:"public",table:"pandit_requests",filter:`pandit_id=eq.${panditId}`},(p)=>{
      setRequests(prev=>[p.new,...prev]);
    }).subscribe();
    return ()=>supabase.removeChannel(ch);
  },[panditId]);

  const handleReq=async(id,status)=>{
    await db.requests().update({status}).eq("id",id);
    setRequests(prev=>prev.map(r=>r.id===id?{...r,status}:r));
    toast(status==="accepted"?"Booking accepted!":"Booking declined.",status==="accepted"?"✅":"❌");
  };

  if(loading)return <Spinner/>;
  const pending=requests.filter(r=>r.status==="pending");
  const accepted=requests.filter(r=>r.status==="accepted");
  return(<>
    <div className="wb">
      <div><h3>🙏 Jai Shri Ram, Pt. Ramesh Ji</h3><p>{pending.length} pending request{pending.length!==1?"s":""}</p></div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:13,fontWeight:700,color:panditOnline?"#27AE60":"#95A5A6"}}>{panditOnline?"🟢 Online":"⚫ Offline"}</span>
        <Toggle on={panditOnline} onChange={async v=>{
          setPanditOnline(v);
          if(panditId) await db.pandits().update({status:v?"available":"offline"}).eq("id",panditId);
          toast(v?"You are now online!":"You are now offline.",v?"🟢":"⚫");
        }}/>
      </div>
    </div>
    <div style={{background:"linear-gradient(135deg,#1a0f07,#3d2211,#5c3317)",borderRadius:16,padding:"22px",color:"#fff",display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr 1px 1fr",marginBottom:22}}>
      {[["₹42,500","This Month"],["23","Poojas Done"],["4.9 ★","Avg Rating"],[pending.length,"Pending"]].map(([v,l],i)=>(
        <>
          <div key={i} style={{textAlign:"center",padding:"0 8px"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,color:"#F0C040",marginBottom:4}}>{v}</div>
            <div style={{fontSize:10,color:"rgba(255,248,240,.5)",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
          </div>
          {i<3&&<div key={`d${i}`} style={{background:"rgba(212,160,23,.2)"}}/>}
        </>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:18,marginBottom:22}}>
      <div className="ac">
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Monthly Earnings</div>
        <div className="mini-chart" style={{height:72}}>{chartData.map((v,i)=><div key={i} className="cbar" style={{height:`${v}%`}}/>)}</div>
      </div>
      <div className="ac">
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Top Rituals</div>
        {[["Griha Pravesh",85],["Satyanarayan",68],["Rudrabhishek",52],["Navgrah",44]].map(([l,v])=>(
          <div key={l} className="bar-row">
            <div className="bar-lbl" style={{width:96}}>{l}</div>
            <div className="bar-track"><div className="bar-fill" style={{width:`${v}%`}}/></div>
            <div className="bar-val">{v}%</div>
          </div>
        ))}
      </div>
    </div>
    <div className="sh"><div className="sh-title">Pending Requests ({pending.length})</div></div>
    {pending.length===0?<div className="card card-p" style={{textAlign:"center",padding:"28px"}}>
      <div style={{fontSize:36,marginBottom:8}}>✅</div><div style={{fontFamily:"'Cinzel',serif",color:"#5C3317"}}>All caught up!</div>
    </div>:pending.map(r=><ReqCard key={r.id} r={r} onAction={handleReq}/>)}
    {accepted.length>0&&<>
      <div className="sh" style={{marginTop:8}}><div className="sh-title">Accepted ({accepted.length})</div></div>
      {accepted.slice(0,3).map(r=><ReqCard key={r.id} r={r} readOnly/>)}
    </>}
  </>);
}

function ReqCard({r,onAction,readOnly=false}){
  return(
    <div className="breq">
      <div className="breq-av">{r.devotee_emoji||"👤"}</div>
      <div className="breq-info">
        <div className="breq-name">{r.devotee_name}</div>
        <div className="breq-det">{r.ritual_icon} {r.ritual}</div>
        <div className="breq-meta">
          <span>📅 {r.booking_date}</span>
          <span>🕐 {r.booking_time}</span>
          <span>📍 {r.address}</span>
        </div>
      </div>
      <div style={{textAlign:"right",marginRight:12,flexShrink:0}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:17,fontWeight:700,color:"#FF6B00"}}>₹{r.amount?.toLocaleString()}</div>
        <StatusBadge status={r.status}/>
      </div>
      {!readOnly&&r.status==="pending"&&<div style={{display:"flex",gap:7,flexShrink:0}}>
        <button className="btn btn-success btn-sm" onClick={()=>onAction(r.id,"accepted")}>✓ Accept</button>
        <button className="btn btn-danger btn-sm" onClick={()=>onAction(r.id,"rejected")}>✕ Decline</button>
      </div>}
    </div>
  );
}

// ============================================================
// PANDIT REQUESTS PAGE
// ============================================================
function PanditReqPage(){
  const {db,panditId}=useApp();
  const [requests,setRequests]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("All");
  const {toast}=useApp();

  useEffect(()=>{
    if(!panditId){setLoading(false);return;}
    db.requests().select("*").eq("pandit_id",panditId).order("created_at",{ascending:false})
      .then(({data})=>{setRequests(data||[]);setLoading(false);});
  },[panditId]);

  const handleReq=async(id,status)=>{
    await db.requests().update({status}).eq("id",id);
    setRequests(prev=>prev.map(r=>r.id===id?{...r,status}:r));
    toast(status==="accepted"?"Accepted!":"Declined.",status==="accepted"?"✅":"❌");
  };

  if(loading)return <Spinner/>;
  const filtered=filter==="All"?requests:requests.filter(r=>r.status===filter.toLowerCase());
  return(<>
    <div style={{marginBottom:16}}>
      {["All","Pending","Accepted","Rejected"].map(f=>(
        <span key={f} className={`chip ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
          {f} ({f==="All"?requests.length:requests.filter(r=>r.status===f.toLowerCase()).length})
        </span>
      ))}
    </div>
    {filtered.map(r=><ReqCard key={r.id} r={r} onAction={handleReq} readOnly={r.status!=="pending"}/>)}
  </>);
}

// ============================================================
// PANDIT PROFILE PAGE
// ============================================================
function PanditProfilePage(){
  const {db,panditId,toast}=useApp();
  const allSpecs=["Griha Pravesh","Satyanarayan Katha","Navgrah Pooja","Rudrabhishek","Vivah","Mundan","Kaal Sarp Dosh","Havan","Vastu Puja","Maha Mrityunjaya"];
  const [form,setForm]=useState({name:"Pt. Ramesh Sharma",speciality:"Vedic & Tantric",experience_years:15,city:"Varanasi",bio:"",tags:[],phone:"+91 9876543210"});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    if(!panditId){setLoading(false);return;}
    db.pandits().select("*").eq("id",panditId).single().then(({data})=>{if(data){setForm(data);}setLoading(false);});
  },[panditId]);

  const save=async()=>{
    setSaving(true);
    if(panditId){ await db.pandits().update(form).eq("id",panditId); }
    setSaving(false);
    toast("Profile saved!","✅");
  };

  if(loading)return <Spinner/>;
  const completeness=[form.name,form.speciality,form.experience_years,form.city,form.bio,(form.tags||[]).length>0].filter(Boolean).length;

  return(<>
    <div className="card card-p" style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontWeight:700,fontSize:13,color:"#5C3317"}}>Profile Completeness</span>
        <span style={{fontFamily:"'Cinzel',serif",fontWeight:700,color:"#FF6B00"}}>{Math.round((completeness/6)*100)}%</span>
      </div>
      <div className="prog-bar"><div className="prog-fill" style={{width:`${(completeness/6)*100}%`}}/></div>
    </div>
    <div className="card card-p" style={{marginBottom:20}}>
      <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:22,marginBottom:22}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:88,height:88,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B00,#D4A017)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,margin:"0 auto 8px",border:"3px solid rgba(212,160,23,.4)"}}>{form.emoji||"🕉️"}</div>
          <button className="btn btn-outline btn-sm">Change</button>
        </div>
        <div className="fgrid">
          {[["Full Name","name"],["City","city"],["Speciality","speciality"],["Experience (yrs)","experience_years"]].map(([l,k])=>(
            <div key={k} className="fg"><label className="fl">{l}</label><input className="fi" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/></div>
          ))}
          <div className="fg ffw"><label className="fl">Bio</label><textarea className="fta" value={form.bio||""} onChange={e=>setForm(f=>({...f,bio:e.target.value}))}/></div>
        </div>
      </div>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Specializations</div>
      <div style={{display:"flex",flexWrap:"wrap",marginBottom:22}}>
        {allSpecs.map(s=>(
          <span key={s} className={`chip ${(form.tags||[]).includes(s)?"on":""}`}
            onClick={()=>setForm(f=>({...f,tags:(f.tags||[]).includes(s)?(f.tags||[]).filter(x=>x!==s):[...(f.tags||[]),s]}))}>
            {s}
          </span>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:22}}>
        {[["🪪","Aadhaar Card","Identity Proof"],["🎓","Qualification Cert","Education"],["🎬","Intro Video","60 sec, MP4"]].map(([ico,name,sub])=>(
          <div key={name} className="upz">
            <div style={{fontSize:28,marginBottom:6}}>{ico}</div>
            <div style={{fontWeight:700,fontSize:12.5,color:"#5C3317"}}>{name}</div>
            <div style={{fontSize:11,color:"#8B6347",marginTop:2}}>{sub}</div>
            <button className="btn btn-outline btn-sm" style={{marginTop:10}}>Upload</button>
          </div>
        ))}
      </div>
      <button className={`btn btn-primary ${saving?"btn-disabled":""}`} onClick={save}>{saving?"Saving...":"💾 Save Profile"}</button>
    </div>
  </>);
}

// ============================================================
// PANDIT EARNINGS PAGE
// ============================================================
function PanditEarningsPage(){
  const {db,panditId}=useApp();
  const [requests,setRequests]=useState([]);
  useEffect(()=>{
    if(!panditId)return;
    db.requests().select("*").eq("pandit_id",panditId).eq("status","accepted").then(({data})=>setRequests(data||[]));
  },[panditId]);
  const earned=requests.reduce((s,r)=>s+(r.amount*0.75||0),0);
  const chartData=[40,55,48,65,72,68,80,75,88,92,85,95];
  return(<>
    <div style={{background:"linear-gradient(135deg,#1a0f07,#3d2211,#5c3317)",borderRadius:16,padding:"22px",color:"#fff",display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr 1px 1fr",marginBottom:22}}>
      {[[`₹${(earned+42500).toLocaleString()}`,"This Month"],["₹3,87,200","This Year"],[requests.length+23,"Poojas Done"],["4.9 ★","Rating"]].map(([v,l],i)=>(
        <>
          <div key={i} style={{textAlign:"center",padding:"0 6px"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:700,color:"#F0C040",marginBottom:4}}>{v}</div>
            <div style={{fontSize:10,color:"rgba(255,248,240,.5)",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
          </div>
          {i<3&&<div key={`d${i}`} style={{background:"rgba(212,160,23,.2)"}}/>}
        </>
      ))}
    </div>
    <div className="ac" style={{marginBottom:22}}>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Monthly Earnings Trend</div>
      <div className="mini-chart" style={{height:80}}>{chartData.map((v,i)=><div key={i} className="cbar" style={{height:`${v}%`}}/>)}</div>
    </div>
    {requests.length>0&&<>
      <div className="sh"><div className="sh-title">Accepted Bookings</div></div>
      <div className="dtable">
        <div className="thead" style={{gridTemplateColumns:"1fr 1.5fr 1fr 1fr 1fr"}}>
          {["Req ID","Devotee","Ritual","Gross","Net (75%)"].map(h=><div key={h} className="th">{h}</div>)}
        </div>
        {requests.map((r,i)=>(
          <div key={i} className="tr" style={{gridTemplateColumns:"1fr 1.5fr 1fr 1fr 1fr"}}>
            <div className="td" style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#FF6B00"}}>#{r.id?.slice(-6)}</div>
            <div className="td">{r.devotee_name}</div>
            <div className="td">{r.ritual_icon} {r.ritual}</div>
            <div className="td" style={{fontWeight:700}}>₹{r.amount?.toLocaleString()}</div>
            <div className="td" style={{fontFamily:"'Cinzel',serif",fontWeight:700,color:"#27AE60"}}>₹{Math.round(r.amount*.75).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </>}
  </>);
}

// ============================================================
// PANDIT AVAILABILITY
// ============================================================
function PanditAvailPage(){
  const {toast}=useApp();
  const [avail,setAvail]=useState(
    ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d,i)=>({day:d,enabled:i!==0,from:"06:00",to:"20:00"}))
  );
  return(
    <div className="card card-p">
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:18}}>Weekly Schedule</div>
      {avail.map((a,i)=>(
        <div key={a.day} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:a.enabled?"rgba(255,243,230,.5)":"rgba(0,0,0,.02)",borderRadius:11,marginBottom:8,border:`1px solid ${a.enabled?"rgba(212,160,23,.2)":"rgba(0,0,0,.06)"}`}}>
          <div style={{width:92,fontWeight:700,color:a.enabled?"#5C3317":"#aaa",fontSize:13.5}}>{a.day}</div>
          <div style={{display:"flex",gap:10,flex:1,opacity:a.enabled?1:.4}}>
            {["from","to"].map(k=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:6}}>
                <label style={{fontSize:11,color:"#8B6347",fontWeight:700}}>{k==="from"?"From":"To"}</label>
                <input type="time" className="fi" value={a[k]} onChange={e=>setAvail(av=>av.map((x,j)=>j===i?{...x,[k]:e.target.value}:x))} style={{padding:"5px 9px",width:110}}/>
              </div>
            ))}
          </div>
          <Toggle on={a.enabled} onChange={v=>setAvail(av=>av.map((x,j)=>j===i?{...x,enabled:v}:x))}/>
        </div>
      ))}
      <button className="btn btn-primary" style={{marginTop:14}} onClick={()=>toast("Schedule saved!","✅")}>💾 Save Schedule</button>
    </div>
  );
}

// ============================================================
// ADMIN HOME
// ============================================================
function AdminHome(){
  const {db}=useApp();
  const [stats,setStats]=useState({pandits:0,bookings:0,pending:0,revenue:0});
  const [recent,setRecent]=useState([]);
  const [loading,setLoading]=useState(true);
  const chartData=[40,55,48,65,72,68,80,75,88,92,85,95];

  useEffect(()=>{
    (async()=>{
      const [p,b,pend]=await Promise.all([
        db.pandits().select("id",{count:"exact",head:true}),
        db.bookings().select("*").order("created_at",{ascending:false}).limit(8),
        db.requests().select("id",{count:"exact",head:true}).eq("status","pending"),
      ]);
      const bookingsData=b.data||[];
      const rev=bookingsData.reduce((s,x)=>s+(x.amount||0),0);
      setStats({pandits:p.count||0,bookings:b.count||bookingsData.length,pending:pend.count||0,revenue:rev});
      setRecent(bookingsData);
      setLoading(false);
    })();
  },[]);

  if(loading)return <Spinner/>;
  return(<>
    <div className="stat-grid sg4">
      {[
        {icon:"🙏",val:"1,247+",lbl:"Total Devotees",trend:"+89 this week"},
        {icon:"🕉️",val:stats.pandits,lbl:"Active Pandits",trend:`${stats.pending} pending req`},
        {icon:"📿",val:stats.bookings+4820,lbl:"Total Bookings",trend:"+234 this month"},
        {icon:"💰",val:`₹${((stats.revenue+2400000)/100000).toFixed(1)}L`,lbl:"Revenue",trend:"+18% vs last"},
      ].map((s,i)=>(
        <div key={i} className="stat-card">
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-val">{s.val}</div>
          <div className="stat-lbl">{s.lbl}</div>
          <div className="stat-trend tup">{s.trend}</div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:18,marginBottom:22}}>
      <div className="ac">
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Revenue Trend</div>
        <div className="mini-chart" style={{height:80}}>{chartData.map((v,i)=><div key={i} className="cbar" style={{height:`${v}%`}}/>)}</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
          {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m,i)=><span key={i} style={{fontSize:9,color:"#8B6347"}}>{m}</span>)}
        </div>
      </div>
      <div className="ac">
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Revenue Split</div>
        {[["Pandit Bookings",72],["Temple Poojas",14],["Samagri",8],["Daan & Seva",6]].map(([l,v])=>(
          <div key={l} className="bar-row">
            <div className="bar-lbl" style={{width:110,fontSize:11}}>{l}</div>
            <div className="bar-track"><div className="bar-fill" style={{width:`${v}%`}}/></div>
            <div className="bar-val">{v}%</div>
          </div>
        ))}
      </div>
    </div>
    <div className="sh"><div className="sh-title">Recent Bookings</div></div>
    <div className="dtable">
      <div className="thead" style={{gridTemplateColumns:".7fr 1.2fr 1.4fr 1.4fr .8fr .8fr 1fr"}}>
        {["ID","Devotee","Ritual","Pandit","Date","Amount","Status"].map(h=><div key={h} className="th">{h}</div>)}
      </div>
      {recent.map(b=>(
        <div key={b.id} className="tr" style={{gridTemplateColumns:".7fr 1.2fr 1.4fr 1.4fr .8fr .8fr 1fr"}}>
          <div className="td" style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#FF6B00"}}>#{b.id?.slice(-6)}</div>
          <div className="td">{b.devotee_name}</div>
          <div className="td">{b.ritual_icon} {b.ritual}</div>
          <div className="td" style={{fontSize:12}}>{b.pandit_name}</div>
          <div className="td" style={{fontSize:12}}>{b.booking_date}</div>
          <div className="td" style={{fontWeight:700}}>₹{b.amount?.toLocaleString()}</div>
          <div className="td"><StatusBadge status={b.status}/></div>
        </div>
      ))}
    </div>
  </>);
}

// ============================================================
// ADMIN VERIFY
// ============================================================
function AdminVerify(){
  const {db,setViewPandit,toast}=useApp();
  const [pandits,setPandits]=useState([]);
  const [loading,setLoading]=useState(true);
  const PENDING_MOCK=[
    {id:"p101",name:"Pt. Rajesh Dwivedi",city:"Bhopal",exp:8,docs:["Aadhaar","Certificate","Video"],spec:"Griha Pravesh, Havan",emoji:"🕉️",phone:"+91 9876543200",applied:"2026-03-08"},
    {id:"p102",name:"Pt. Sunil Pathak",city:"Prayagraj",exp:14,docs:["Aadhaar","Certificate"],spec:"Rudrabhishek, Navgrah",emoji:"☀️",phone:"+91 9876543201",applied:"2026-03-07"},
  ];
  const [pending,setPending]=useState(PENDING_MOCK);

  useEffect(()=>{
    db.pandits().select("*").eq("verified",true).then(({data})=>{setPandits(data||[]);setLoading(false);});
  },[]);

  if(loading)return <Spinner/>;
  return(<>
    <div className="stat-grid sg3" style={{marginBottom:22}}>
      {[{icon:"⏳",val:pending.length,lbl:"Awaiting Review"},{icon:"✅",val:pandits.length,lbl:"Verified Pandits"},{icon:"❌",val:"23",lbl:"Rejected"}].map((s,i)=>(
        <div key={i} className="stat-card">
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-val">{s.val}</div>
          <div className="stat-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
    <div className="sh"><div className="sh-title">Pending Verifications</div></div>
    {pending.length===0?<div className="card card-p" style={{textAlign:"center",padding:"28px"}}>
      <div style={{fontSize:36,marginBottom:8}}>✅</div><div style={{fontFamily:"'Cinzel',serif",color:"#5C3317"}}>All reviewed!</div>
    </div>:pending.map(p=>(
      <div key={p.id} className="vc">
        <div style={{width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B00,#D4A017)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:"2px solid rgba(212,160,23,.3)",flexShrink:0}}>{p.emoji}</div>
        <div style={{flex:1}}>
          <div className="vc-name">{p.name}</div>
          <div className="vc-det">📍 {p.city} · {p.exp} yrs · {p.spec}</div>
          <div style={{marginTop:4}}>{p.docs.map((d,j)=><span key={j} className="doc-chip">📄 {d}</span>)}</div>
          <div style={{fontSize:11,color:"#8B6347",marginTop:3}}>Applied: {p.applied} · {p.phone}</div>
        </div>
        <div style={{display:"flex",gap:7,flexShrink:0}}>
          <button className="btn btn-success btn-sm" onClick={()=>{setPending(prev=>prev.filter(x=>x.id!==p.id));toast(`${p.name} approved!`,"✅");}}>✓ Approve</button>
          <button className="btn btn-danger btn-sm" onClick={()=>{setPending(prev=>prev.filter(x=>x.id!==p.id));toast(`${p.name} rejected.`,"❌");}}>✕ Reject</button>
        </div>
      </div>
    ))}
    <div className="sh" style={{marginTop:8}}><div className="sh-title">Verified Pandits ({pandits.length})</div></div>
    <div className="pgrid">
      {pandits.slice(0,3).map(p=><PanditCard key={p.id} p={p} onView={setViewPandit}/>)}
    </div>
  </>);
}

// ============================================================
// ADMIN BOOKINGS
// ============================================================
function AdminBookingsPage(){
  const {db}=useApp();
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("All");

  useEffect(()=>{
    db.bookings().select("*").order("created_at",{ascending:false})
      .then(({data})=>{setBookings(data||[]);setLoading(false);});
    const ch=supabase.channel("admin-bookings").on("postgres_changes",{event:"INSERT",schema:"public",table:"bookings"},(p)=>{
      setBookings(prev=>[p.new,...prev]);
    }).subscribe();
    return ()=>supabase.removeChannel(ch);
  },[]);

  if(loading)return <Spinner/>;
  const filtered=filter==="All"?bookings:bookings.filter(b=>b.status===filter.toLowerCase());
  return(<>
    <div style={{marginBottom:16}}>
      {["All","Confirmed","Pending","Completed","Cancelled"].map(f=>(
        <span key={f} className={`chip ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
          {f} ({f==="All"?bookings.length:bookings.filter(b=>b.status===f.toLowerCase()).length})
        </span>
      ))}
    </div>
    <div className="dtable">
      <div className="thead" style={{gridTemplateColumns:".7fr 1.2fr 1.4fr 1.4fr .8fr .8fr 1fr"}}>
        {["ID","Devotee","Ritual","Pandit","Date","Amount","Status"].map(h=><div key={h} className="th">{h}</div>)}
      </div>
      {filtered.map(b=>(
        <div key={b.id} className="tr" style={{gridTemplateColumns:".7fr 1.2fr 1.4fr 1.4fr .8fr .8fr 1fr"}}>
          <div className="td" style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#FF6B00"}}>#{b.id?.slice(-6)}</div>
          <div className="td">{b.devotee_name}</div>
          <div className="td">{b.ritual_icon} {b.ritual}</div>
          <div className="td" style={{fontSize:12}}>{b.pandit_name}</div>
          <div className="td" style={{fontSize:12}}>{b.booking_date}</div>
          <div className="td" style={{fontWeight:700}}>₹{b.amount?.toLocaleString()}</div>
          <div className="td"><StatusBadge status={b.status}/></div>
        </div>
      ))}
    </div>
  </>);
}

// ============================================================
// ADMIN RITUALS
// ============================================================
function AdminRitualsPage(){
  const {db,toast}=useApp();
  const [rituals,setRituals]=useState([]);
  const [temples,setTemples]=useState([]);
  const [editing,setEditing]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [newR,setNewR]=useState({name:"",icon:"🕉️",price:"",duration:"",description:""});
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([db.rituals().select("*"),db.temples().select("*")])
      .then(([r,t])=>{setRituals(r.data||[]);setTemples(t.data||[]);setLoading(false);});
  },[]);

  const addRitual=async()=>{
    if(!newR.name||!newR.price){toast("Fill name and price","⚠️");return;}
    const {data,error}=await db.rituals().insert({...newR,price:parseInt(newR.price),active:true}).select().single();
    if(data){setRituals(prev=>[...prev,data]);setShowAdd(false);setNewR({name:"",icon:"🕉️",price:"",duration:"",description:""});toast("Ritual added!","✅");}
  };

  const deleteRitual=async(id)=>{
    await db.rituals().delete().eq("id",id);
    setRituals(prev=>prev.filter(x=>x.id!==id));
    toast("Ritual removed.","🗑️");
  };

  const saveEdit=async()=>{
    await db.rituals().update(editing).eq("id",editing.id);
    setRituals(prev=>prev.map(x=>x.id===editing.id?editing:x));
    setEditing(null);
    toast("Ritual updated!","✅");
  };

  if(loading)return <Spinner/>;
  return(<>
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
      <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add Ritual</button>
    </div>
    <div className="rgrid">
      {rituals.map(r=>(
        <div key={r.id} className="rc">
          <div className="rc-icon">{r.icon}</div>
          <div className="rc-body">
            <div className="rc-name">{r.name}</div>
            <div className="rc-price">₹{r.price?.toLocaleString()}</div>
            <div className="rc-dur">⏱ {r.duration}</div>
            <div style={{display:"flex",gap:6,marginTop:10}}>
              <button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>setEditing(r)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={()=>deleteRitual(r.id)}>✕</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="sh" style={{marginTop:8}}><div className="sh-title">Manage Temples</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      {temples.map(t=>(
        <div key={t.id} className="tc">
          <div className="tc-img">{t.is_live&&<div className="live-b"><div className="live-dot"/>LIVE</div>}<span>{t.icon}</span></div>
          <div className="tc-body">
            <div className="tc-name">{t.name}</div>
            <div className="tc-loc">📍 {t.city}</div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button className={`btn btn-sm ${t.is_live?"btn-danger":"btn-primary"}`}
                onClick={async()=>{
                  await db.temples().update({is_live:!t.is_live}).eq("id",t.id);
                  setTemples(prev=>prev.map(x=>x.id===t.id?{...x,is_live:!t.is_live}:x));
                  toast(t.is_live?"Live stopped.":"Temple is now LIVE!",t.is_live?"⚫":"🔴");
                }}>
                {t.is_live?"Stop Live":"Go Live"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    {(showAdd||editing)&&(
      <div className="overlay" onClick={()=>{setShowAdd(false);setEditing(null);}}>
        <div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-head">
            <div className="modal-title">{editing?"✏️ Edit Ritual":"➕ Add New Ritual"}</div>
            <button className="modal-close" onClick={()=>{setShowAdd(false);setEditing(null);}}>✕</button>
          </div>
          <div className="modal-body">
            <div className="fgrid">
              {[["Name","name"],["Icon (emoji)","icon"],["Price (₹)","price"],["Duration","duration"]].map(([l,k])=>(
                <div key={k} className="fg"><label className="fl">{l}</label>
                  <input className="fi" value={editing?editing[k]:newR[k]} onChange={e=>editing?setEditing(x=>({...x,[k]:e.target.value})):setNewR(x=>({...x,[k]:e.target.value}))}/>
                </div>
              ))}
              <div className="fg ffw"><label className="fl">Description</label>
                <textarea className="fta" value={editing?editing.description:newR.description} onChange={e=>editing?setEditing(x=>({...x,description:e.target.value})):setNewR(x=>({...x,description:e.target.value}))}/>
              </div>
            </div>
          </div>
          <div className="modal-foot">
            <button className="btn btn-outline btn-sm" onClick={()=>{setShowAdd(false);setEditing(null);}}>Cancel</button>
            <button className="btn btn-primary" onClick={editing?saveEdit:addRitual}>{editing?"Save Changes":"Add Ritual"}</button>
          </div>
        </div>
      </div>
    )}
  </>);
}

// ============================================================
// ADMIN PAYMENTS
// ============================================================
function AdminPaymentsPage(){
  const {db}=useApp();
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);
  const chartData=[40,55,48,65,72,68,80,75,88,92,85,95];

  useEffect(()=>{
    db.bookings().select("*").neq("status","cancelled").order("created_at",{ascending:false})
      .then(({data})=>{setBookings(data||[]);setLoading(false);});
  },[]);

  if(loading)return <Spinner/>;
  const total=bookings.reduce((s,b)=>s+(b.amount||0),0)+2400000;
  return(<>
    <div className="stat-grid sg4">
      {[
        {icon:"💰",val:`₹${(total/100000).toFixed(1)}L`,lbl:"Total Revenue",trend:"+18% vs last"},
        {icon:"💸",val:`₹${(total*.75/100000).toFixed(1)}L`,lbl:"Pandit Payouts",trend:"75% of revenue"},
        {icon:"🏦",val:`₹${(total*.25/100000).toFixed(1)}L`,lbl:"Platform Earnings",trend:"25% commission"},
        {icon:"⏳",val:`₹${(total*.05/1000).toFixed(0)}K`,lbl:"Pending Payouts",trend:"Due this week"},
      ].map((s,i)=>(
        <div key={i} className="stat-card">
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-val">{s.val}</div>
          <div className="stat-lbl">{s.lbl}</div>
          <div className="stat-trend tup">{s.trend}</div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
      <div className="ac">
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Monthly Revenue</div>
        <div className="mini-chart" style={{height:80}}>{chartData.map((v,i)=><div key={i} className="cbar" style={{height:`${v}%`}}/>)}</div>
      </div>
      <div className="ac">
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:12}}>Payment Methods</div>
        {[["Razorpay UPI",58],["Net Banking",22],["Credit Card",12],["Debit Card",8]].map(([l,v])=>(
          <div key={l} className="bar-row">
            <div className="bar-lbl" style={{width:110,fontSize:11}}>{l}</div>
            <div className="bar-track"><div className="bar-fill" style={{width:`${v}%`}}/></div>
            <div className="bar-val">{v}%</div>
          </div>
        ))}
      </div>
    </div>
    <div className="sh"><div className="sh-title">Transactions</div></div>
    <div className="dtable">
      <div className="thead" style={{gridTemplateColumns:"1fr 1.2fr 1.2fr .8fr .8fr .8fr 1fr"}}>
        {["Txn ID","Devotee","Ritual","Gross","Pandit (75%)","Platform (25%)","Status"].map(h=><div key={h} className="th">{h}</div>)}
      </div>
      {bookings.slice(0,10).map((b,i)=>(
        <div key={i} className="tr" style={{gridTemplateColumns:"1fr 1.2fr 1.2fr .8fr .8fr .8fr 1fr"}}>
          <div className="td" style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#FF6B00"}}>#TXN{1000+i}</div>
          <div className="td" style={{fontSize:12}}>{b.devotee_name}</div>
          <div className="td" style={{fontSize:12}}>{b.ritual}</div>
          <div className="td" style={{fontWeight:700}}>₹{b.amount?.toLocaleString()}</div>
          <div className="td" style={{color:"#27AE60",fontWeight:700}}>₹{Math.round(b.amount*.75).toLocaleString()}</div>
          <div className="td" style={{color:"#E67E22",fontWeight:700}}>₹{Math.round(b.amount*.25).toLocaleString()}</div>
          <div className="td"><StatusBadge status={b.status}/></div>
        </div>
      ))}
    </div>
  </>);
}
