import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

/* ============================================================================
Supabase setup
========================================================================== */
const SUPABASE_URL = "https://wudzcldsutonxlmgkbgb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZHpjbGRzdXRvbnhsbWdrYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTkyNjMsImV4cCI6MjA5ODIzNTI2M30.jR303Q8GKvCJHd9Na0Jtd3b1cXCHf9xIj8KS3eRMvNs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============================================================================
Brand Assets
========================================================================== */
const ASSET_LOGO_NAV = "data:image/png;base64,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";

/* PASTE YOUR ASSET_LOGO_LARGE STRING HERE */
const ASSET_LOGO_LARGE = "/* ... PASTE YOUR LOGO BASE64 STRING HERE ... */"; 

const ASSET_FAVICON_32 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACr0lEQVR42u2XO2hUURCGv3/O3l3xgYKVKEi0CAFFRWKhaGFSCJbGxkY7WxtD0MrGThBs1EIEKy18oiI2CoJFijRaBEFsRNFIRIyPbPYeC+eG43VjNrthEXRgmXPvHc7M/DPzn7PQvhhQ4V8Uue4nhCF/VjcDqABIeiApAsu7HUThbHWtVttQQqWtRmpHIrCxXq/3OwKxWwgE1zvdaZR03Z1bNxAostzieibGuAvIgLwbKBT1Xwu8BaLQ7SSZBSNhbdTegNdmDAPI9MjfBf+eL1YAxaahZJcDynNuAzHGfL2/awBkWba5SSmCj29YjAYsyrAUNAFMek+YpDOOwim3zZokqVZR6ZO4KelqlmWbEhKqAlClD5h2h5+BcV83gGOljPcAJ4F9rQSROdNdKkYNmAB2JzYrkO77t3pi1wCeJHbVBJUIxBA4WEK0KQIC+iWNAV9mN5DuSLoMvEwartAzrj9JOm1mI8DzxPmU88aFlNLnm/dAtdobQhiQdDHNxLONLfzeAN98/QrY2uq4rvgNGrPjDvn0HM6KaZgys2FqtR5gFdADbE/21B873cyOOGR7PdJl3htrS7CXA6gD0cxOtDr6TWGQ9NHr9z6pX93MDidZzpVFzPN8zNe1BO6it/J2OGBA0rUS1M1KUJTmKbCuk6NaDrlCYDBxMAmMJc8zDnvD1xH46vo7MJSw4IKoeLbLGw3eAc8k3QB2ANsk3XObYvOftC3uAr0hhAPAC2BlEtyiyjmf6ftmNiJpVNJj7/hf72+VSn8r3d8KJxQwrnFmHJ+Dzayg6xDCoAd6vhXyme98MGA1MOqbXvJvS0qH1C/3BklXQgj7O7wCzkZ+Npn3W+6koyN2YbcXsw9FQGb20IOZr3yhk8zLm1XM7KiZHer0Ov7X/c1aiH1R8xn+yyLID7Agw/Sivc1UAAAAAElFTkSuQmCC";
const ASSET_FAVICON_64 = "data:image/png;base64,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";
const ASSET_BLOT_BLACK_SMALL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADhUlEQVR42u2YT4gcRRTGf9+r6u7JRI2wIgZDlMTVXIIYEDZiFA8i4kFQETUQBENWPOWS3ARv4jlE8OASPPjnIpKbkJNIDlE8KAbEk5GAuGtigiQkm5n2MK/Wopnszji9ZsB9UMxQVV391fve+151wf/IAmBs2Hgmb5uRPpb0PlB431RYovR+oJZUA3dm4KfHizHGfUVR7Mm8OrWJMlVmACGEFySdl7RkZm816L/lCbIJOA/U3m4A97YVh5PusgZKoAv0vAXg7mlJlAAg6YPkQaFfgc3TAjDRvAX42aXmRCNhBMR/y1YbFAfgkpkd874Lvq45uBSX/fXM1LCKF4Lr4GMO5kyD3hkzOxpjfHSIU7TG2q0kVgK4N8WhmR3xsS2SvvL+ReD2DJhNyqgBxBjnJH0maSHzQpFRWAGY2RsOZBmoEd8jznlfX9IPLknmz7uEhmfNbD+wbZzESsF/G9LvmcZdM7OXh8zfxABA3+Ot19DFP4Dt+QNFUeyW9E02b4mBAzSKJxPAjqSz2SI10DOzt8uynO12u/eEEJ6S9HUay+dlyXGhqqoHEu1m9ibwZ+bxq64AX4xTMtMudko6IemspMXcm5IuNQDVQ1rffy9LOg0rtOfj1x3gp+PW9NAAPBNjfFLS5w1gNwN3s3YF+A34a0XgpR/LsnxoVIrXDlLpI9/98giA+oMqwzkzO1RV1Q7gjm63uzXGuDfGOJeSbZwkqSQdl/SJV4q0sxIIRVHszl7eXwNcH1jM4nCiwpEmzWYvecT7ogMkxvhERvFqAJOHF3yNTpaESajDuHVbA2mzeTObz0pXsvskfZtl6mr03vAY+3INkZ74UABluctPLksjZG8+fh1YNrOjjUPExBazr7RtDWA1cHEVWamHUS/pDLCrTU/awHnlg/+8hJ9CCM8BM5I+zGKtl9F6bfBfv5jZK2Z22OtxbWaHfPNVqxTHGOfM7LWs6APsaXjpap4gRVE8nM3dGUJ40cGtu1Ve7V9K4mtmr3c6ne1mdkDSQgg8kx0uclBdSe9kdb21k3fz7NZBfOex9d4I2lYC0cwOZl6+q22QK4It6WR6kcdkcG+ljYThYMtZSaddEVq/KkkfSu9mdbUH9mqW+a3frYz7HUJd10971gJYCLqcj494nFuXj/vgJ+j5TNtOeQmzabmXSbLzeAjh+YzWqbo0+k/AhBae37j23bBJ7G/cTxHhIziTEAAAAABJRU5ErkJggg==";

/* PASTE YOUR ASSET_SPLASH_FRAMES ARRAY HERE */
const ASSET_SPLASH_FRAMES = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" 
  /* ... PASTE YOUR 5 SPLASH FRAME STRINGS HERE ... */
];

/* ============================================================================
Global CSS
========================================================================== */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --ink: #0A0A0A; --ink-soft: #121212; --ink-raised: #1A1A1A;
  --paper: #F4F2ED; --paper-dim: #B9B6AC; --paper-faint: #6E6C65;
  --line: rgba(244,242,237,0.12); --line-strong: rgba(244,242,237,0.25);
  --wash: rgba(244,242,237,0.04);
  --seal: #C8312A; --seal-dim: rgba(200,49,42,0.18);
  --ok: #F4F2ED; --warn: #D9A04B;
}
html { scroll-behavior: smooth; }
body { 
  background: var(--ink); color: var(--paper); font-family: 'Inter', sans-serif; 
  font-size: 15px; line-height: 1.6; overflow-x: hidden; 
}
body::after {
  content: ''; position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.035; pointer-events: none; z-index: 9999; mix-blend-mode: overlay;
}
::-webkit-scrollbar { width: 6px; } 
::-webkit-scrollbar-track { background: transparent; } 
::-webkit-scrollbar-thumb { background: var(--paper-dim); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--paper); }
button { cursor: pointer; border: none; outline: none; font-family: inherit; background: none; color: inherit; }
input, textarea, select { font-family: inherit; } 
a { color: inherit; text-decoration: none; }
.brush { font-family: 'Shippori Mincho', serif; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes brushBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes inkBleed { 0% { filter: blur(4px); opacity: 0; transform: scale(0.95); } 100% { filter: blur(0); opacity: 1; transform: scale(1); } }
@keyframes liquidPop { 
  0% { transform: scale(0.05) rotate(-8deg); opacity: 0; filter: blur(8px); } 
  18% { opacity: 1; filter: blur(2px); } 
  45% { transform: scale(1.1) rotate(3deg); opacity: 1; filter: blur(0px); } 
  70% { transform: scale(1.4) rotate(-2deg); opacity: 0.7; } 
  100% { transform: scale(2.2) rotate(1deg); opacity: 0; filter: blur(4px); } 
}
@keyframes shimmerInk { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.animate-fadeUp { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fadeIn { animation: fadeIn 0.25s ease forwards; }
.animate-inkBleed { animation: inkBleed 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.skeleton-ink { position: relative; background: var(--ink-soft); border: 1px solid var(--line); overflow: hidden; }
.skeleton-ink::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 20%, rgba(244,242,237,0.06) 50%, transparent 80%); background-size: 200% 100%; animation: shimmerInk 1.6s infinite; }
.ink-ripple { position: relative; overflow: hidden; }
.ink-ripple::after { content: ''; position: absolute; border-radius: 50%; background: var(--wash); width: 10px; height: 10px; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(0); transition: transform 0.5s, opacity 0.5s; opacity: 0; }
.ink-ripple:active::after { transform: translate(-50%,-50%) scale(24); opacity: 1; transition: 0s; }
.tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 11px; background: transparent; border: 1px solid var(--line-strong); border-radius: 2px; font-size: 10.5px; font-weight: 600; color: var(--paper-dim); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; transition: all 0.2s; }
.tag.action { cursor: pointer; }
.tag.action:hover { border-color: var(--paper); color: var(--paper); background: rgba(244,242,237,0.05); }
.tag.active { background: var(--paper); border-color: var(--paper); color: var(--ink); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 10px 20px; border-radius: 2px; font-size: 12.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid transparent; position: relative; overflow: hidden; }
.btn::before { content: ''; position: absolute; inset: 0; background: var(--paper); transform: scaleX(0); transform-origin: right; transition: transform 0.3s ease; z-index: -1; }
.btn:hover::before { transform: scaleX(1); transform-origin: left; }
.btn-primary { background: var(--paper); color: var(--ink); border-color: var(--paper); z-index: 1; }
.btn-primary:hover { color: var(--paper); background: transparent; }
.btn-ghost { background: transparent; color: var(--paper-dim); border: 1px solid var(--line-strong); }
.btn-ghost:hover { border-color: var(--paper); color: var(--paper); }
.btn-seal { background: var(--seal); color: var(--paper); border-color: var(--seal); }
.btn-seal:hover { filter: brightness(1.15); transform: translateY(-1px); }
.btn-sm { padding: 6px 14px; font-size: 11px; }
.btn-icon { padding: 8px; aspect-ratio: 1; }
.btn:disabled { opacity: 0.35; cursor: not-allowed; }
.card { background: var(--ink-soft); border: 1px solid var(--line); border-radius: 4px; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.card:hover { border-color: var(--line-strong); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
.toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; max-width: calc(100vw - 32px); }
.toast { padding: 14px 20px; background: var(--ink-soft); border: 1px solid var(--line-strong); border-left: 3px solid var(--paper); font-size: 13px; font-weight: 500; box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); max-width: 300px; letter-spacing: 0.01em; backdrop-filter: blur(10px); }
.toast.success { border-left-color: var(--paper); } 
.toast.error { border-left-color: var(--seal); } 
.toast.warn { border-left-color: var(--warn); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.2s ease; }
.modal { background: var(--ink-soft); border: 1px solid var(--line-strong); border-radius: 4px; padding: 30px; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; animation: fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1500; animation: fadeIn 0.2s ease; display: flex; justify-content: flex-end; }
.drawer { background: var(--ink-soft); border-left: 1px solid var(--line-strong); width: 100%; max-width: 420px; height: 100%; overflow-y: auto; animation: fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); padding: 22px; box-shadow: -20px 0 60px rgba(0,0,0,0.5); }
@media (max-width: 640px) { .drawer { max-width: 100%; } }
.nav { position: sticky; top: 0; z-index: 100; background: rgba(10,10,10,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--line); padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 16px; }
.manga-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
@media (min-width: 600px) { .manga-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 20px; } }
@media (min-width: 900px) { .manga-grid { grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 24px; } }
.manga-cover { aspect-ratio: 2/3; object-fit: cover; width: 100%; display: block; background: var(--ink-soft); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.card:hover .manga-cover { transform: scale(1.05); }
.input { width: 100%; background: var(--ink); border: 1px solid var(--line-strong); border-radius: 2px; padding: 12px 16px; color: var(--paper); font-size: 14px; transition: all 0.2s; outline: none; }
.input:focus { border-color: var(--paper); box-shadow: 0 0 0 2px rgba(244,242,237,0.1); }
.input::placeholder { color: var(--paper-faint); }
.panel-nav { position: fixed; right: 16px; top: 50%; transform: translateY(-50%); z-index: 200; display: flex; flex-direction: column; gap: 4px; transition: opacity 0.3s; }
.panel-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--paper-dim); opacity: 0.3; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.panel-dot:hover { opacity: 0.8; transform: scale(1.5); }
.panel-dot.active { background: var(--paper); opacity: 1; width: 4px; height: 24px; border-radius: 2px; }
.comment { display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--line); animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; background: var(--ink-raised); border: 1px solid var(--line-strong); letter-spacing: 0.02em; }
.chapter-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--line); cursor: pointer; transition: all 0.2s; border-radius: 4px; }
.chapter-item:hover { background: var(--wash); transform: translateX(4px); } 
.chapter-item.read { opacity: 0.5; }
.ctx-menu { position: fixed; background: var(--ink-raised); border: 1px solid var(--line-strong); border-radius: 4px; padding: 6px; min-width: 180px; z-index: 5000; animation: fadeUp 0.15s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 15px 40px rgba(0,0,0,0.6); backdrop-filter: blur(10px); }
.ctx-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 3px; font-size: 13px; cursor: pointer; transition: background 0.15s; width: 100%; text-align: left; }
.ctx-item:hover { background: var(--wash); } 
.ctx-item.danger { color: var(--seal); }
.dropzone { border: 2px dashed var(--line-strong); border-radius: 4px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s; }
.dropzone:hover, .dropzone.dragover { border-color: var(--paper); background: var(--wash); transform: scale(1.01); }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); border-top: 1px solid var(--line); display: flex; z-index: 100; padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -10px 30px rgba(0,0,0,0.3); }
.bottom-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 12px 0; color: var(--paper-faint); font-size: 10px; font-weight: 600; cursor: pointer; transition: color 0.2s; letter-spacing: 0.05em; text-transform: uppercase; position: relative; }
.bottom-nav-item.active { color: var(--paper); }
.bottom-nav-item.active::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 20px; height: 2px; background: var(--paper); border-radius: 1px; }
.bottom-nav-icon { font-size: 20px; line-height: 1; }
@media (min-width: 768px) { .bottom-nav { display: none; } }
@media (max-width: 767px) { .main-content { padding-bottom: 80px !important; } }
.scroll-x { overflow-x: auto; scrollbar-width: none; } 
.scroll-x::-webkit-scrollbar { display: none; }
.stars { display: flex; gap: 4px; } 
.star { font-size: 16px; cursor: pointer; transition: all 0.2s; color: var(--paper-dim); } 
.star:hover { transform: scale(1.3) rotate(15deg); color: var(--paper); }
.star.lit { color: var(--paper); text-shadow: 0 0 10px rgba(244,242,237,0.5); }
.seal-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--seal-dim); border: 1px solid var(--seal); border-radius: 2px; font-size: 10px; font-weight: 800; color: var(--seal); letter-spacing: 0.1em; text-transform: uppercase; }
.ink-loader-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
.ink-loader-label { font-family: 'Shippori Mincho', serif; font-size: 14px; color: var(--paper-dim); letter-spacing: 0.05em; }
.ink-loader-label .cursor { animation: brushBlink 1s step-end infinite; }
.quote-card { display: flex; align-items: center; gap: 12px; padding: 10px; margin-top: 10px; margin-bottom: 4px; border: 1px solid var(--line-strong); background: var(--ink); cursor: pointer; transition: all 0.2s; max-width: 300px; border-radius: 4px; }
.quote-card:hover { border-color: var(--paper); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
.quote-thumb-wrap { position: relative; width: 48px; height: 68px; flex-shrink: 0; border: 1px solid var(--line-strong); overflow: hidden; background: var(--ink-soft); border-radius: 2px; }
.quote-pin { position: absolute; bottom: -4px; right: -4px; width: 18px; height: 18px; border-radius: 50%; background: var(--paper); color: var(--ink); display: flex; align-items: center; justify-content: center; font-size: 10px; border: 2px solid var(--ink); }
.quote-fab { position: fixed; z-index: 50; right: 20px; bottom: 90px; display: flex; align-items: center; gap: 10px; padding: 12px 20px; background: var(--paper); color: var(--ink); border-radius: 99px; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; box-shadow: 0 12px 30px rgba(0,0,0,0.5); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.quote-fab:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
@media (min-width: 768px) { .quote-fab { bottom: 32px; } }
.brush-progress { position: absolute; top: 0; left: 0; height: 3px; background: var(--paper); transition: width 0.1s linear; box-shadow: 0 0 12px rgba(244,242,237,0.6); z-index: 20; }
.brush-progress::after { content: ''; position: absolute; right: -3px; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: var(--paper); border-radius: 50% 40% 60% 30%; filter: blur(1px); box-shadow: 0 0 10px var(--paper); }
.zen-vignette { position: fixed; inset: 0; pointer-events: none; z-index: 10; background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%); }
.ink-wipe { position: fixed; inset: 0; z-index: 9998; background: var(--ink); pointer-events: none; }
`;

/* ============================================================================
Ink Splash Visuals & Wipe Transition
========================================================================== */
const SPLASH_FRAME_MS = 90;

function useSplashFrame(frameCount, playing = true) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!playing || frameCount === 0) return;
    const id = setInterval(() => setFrame(f => (f + 1) % frameCount), SPLASH_FRAME_MS);
    return () => clearInterval(id);
  }, [frameCount, playing]);
  return frame;
}

function InkSplashLoader({ label = "loading", size = 96 }) {
  const frame = useSplashFrame(ASSET_SPLASH_FRAMES.length);
  return (
    <div className="ink-loader-wrap">
      <div style={{ position: "relative", width: size, height: size }}>
        <img src={ASSET_SPLASH_FRAMES[frame] || ASSET_SPLASH_FRAMES[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>
      {label && <div className="ink-loader-label brush">{label}<span className="cursor">_</span></div>}
    </div>
  );
}

function FullscreenInkLoader() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--ink)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <InkSplashLoader label="" size={140} />
        <img src={ASSET_LOGO_LARGE} alt="InkVault" style={{ height: 40, width: "auto", filter: "invert(1) brightness(1.4)", opacity: 0.95 }} />
      </div>
    </div>
  );
}

function InkWipe({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 800);
    return () => clearTimeout(t);
  }, [onComplete]);
  return (
    <div className="ink-wipe" style={{ animation: "liquidPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" }} />
  );
}

function SplashArrivalOverlay({ onDone, bgColor = "#0A0A0A" }) {
  const frame = useSplashFrame(ASSET_SPLASH_FRAMES.length, true);
  const isLight = bgColor === "#f5f5f0" || bgColor === "#e8e0d0";
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 1100);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ animation: "liquidPop 1.05s cubic-bezier(.15,.85,.25,1) forwards" }}>
        <img src={ASSET_SPLASH_FRAMES[frame] || ASSET_SPLASH_FRAMES[0]} alt="" width={320} height={320}
          style={{ filter: isLight ? "invert(0) brightness(0.15) contrast(1.5)" : "invert(1) brightness(2.2) contrast(1.1)", mixBlendMode: isLight ? "multiply" : "screen", display: "block" }} />
      </div>
    </div>
  );
}

/* ============================================================================
Mock Data & Hooks
========================================================================== */
const GENRES = ["Action","Adventure","Comedy","Drama","Fantasy","Horror","Isekai","Martial Arts","Mecha","Mystery","Psychological","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller","Webtoon","Historical","Cultivation"];
const STATUS = ["Ongoing","Completed","Hiatus","Dropped"];
const TYPES = ["Manhwa","Manga","Manhua"];
const TITLES = ["Shadow Monarch","Void Walker","Crimson Petal","Iron Soul","Neon Phantom","Starfall Chronicles","Dragon's Oath","Eternal Void","Silent Blade","Lost Heavens","The Last Curse","Rising Phoenix"];
const MOCK_COVERS = Array.from({length:12},(_,i)=>`https://picsum.photos/seed/mk${i+1}/300/450`);

function makePage(image, order) { return { id: `pg-${Math.random().toString(36).slice(2,9)}-${order}`, image, order }; }

const initLibrary = () => TITLES.map((title, i) => ({
  id: `m${i}`, title, cover: MOCK_COVERS[i], type: TYPES[i%3],
  genres: [GENRES[i%GENRES.length], GENRES[(i+3)%GENRES.length]],
  status: STATUS[i%4], author: ["Tae Jun","Yeon Ho","Ling Wei","Kana Mori"][i%4],
  description: `In a world where power determines destiny, one unlikely hero rises against all odds. Follow ${title} as they navigate a realm of secrets, betrayal, and unimaginable power.`,
  chapters: Array.from({length: 8+(i*3)}, (_,ci) => ({
    id: `${i}-ch${ci+1}`, number: ci+1,
    title: `Chapter ${ci+1}${ci===0?": The Beginning":ci===7?": Revelation":""}`,
    date: new Date(Date.now()-(8-ci)*7*86400000).toLocaleDateString(),
    pages: Array.from({length:12},(_,pi)=>makePage(`https://picsum.photos/seed/p${i}${ci}${pi}/800/1200`, pi)),
    comments: ci === 0 ? [
      {id:"c1",user:"NightReader",text:"The opening linework on this chapter is stunning",likes:42,date:"2 days ago",avatar:"NR",quote:null},
      {id:"c2",user:"VoidWalker99",text:"This page right here is when it clicked for me",likes:28,date:"3 days ago",avatar:"VW",quote:{pageIndex:4,thumb:`https://picsum.photos/seed/p${i}${ci}4/800/1200`}},
    ] : [],
  })),
  likes: Math.floor(Math.random()*5000)+100, dislikes: Math.floor(Math.random()*200),
  views: Math.floor(Math.random()*50000)+1000, rating: (3.5+Math.random()*1.5).toFixed(1),
}));

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type="default") => {
    const id = Date.now()+Math.random();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);
  },[]);
  return {toasts, show};
}

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(()=>{
    try{const s=localStorage.getItem(key);return s?JSON.parse(s):initial;}catch{return initial;}
  });
  const set = useCallback(v=>{
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try{localStorage.setItem(key,JSON.stringify(next));}catch{}
      return next;
    });
  },[key]);
  return [val, set];
}

function LazyImg({src, alt, className, style}) {
  const ref = useRef();
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVisible(true);obs.disconnect();}},{rootMargin:"200px"});
    obs.observe(el); return ()=>obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{position:"relative",...style}}>
      {!loaded && <div className="skeleton-ink" style={{position:"absolute",inset:0}}/>}
      {visible && <img src={src} alt={alt} className={className} loading="lazy" decoding="async"
        onLoad={()=>setLoaded(true)} style={{opacity:loaded?1:0,transition:"opacity 0.4s",width:"100%",height:"auto",display:"block"}}/>}
    </div>
  );
}

function ToastContainer({toasts}) {
  return <div className="toast-container">{toasts.map(t=><div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}</div>;
}

function Stars({value, onChange, readOnly}) {
  const [hover,setHover]=useState(0);
  return <div className="stars">{[1,2,3,4,5].map(s=>(
    <span key={s} className={`star ${(hover||value)>=s?"lit":""}`}
      onClick={()=>!readOnly&&onChange?.(s)} onMouseEnter={()=>!readOnly&&setHover(s)} onMouseLeave={()=>!readOnly&&setHover(0)}>★</span>
  ))}</div>;
}

function ContextMenu({x,y,items,onClose}) {
  useEffect(()=>{const h=()=>onClose();window.addEventListener("click",h,true);return()=>window.removeEventListener("click",h,true);},[onClose]);
  return (
    <div className="ctx-menu" style={{left:Math.min(x,window.innerWidth-180),top:Math.min(y,window.innerHeight-200)}}>
      {items.map((item,i)=><button key={i} className={`ctx-item ${item.danger?"danger":""}`} onClick={()=>{item.action();onClose();}}>{item.icon} {item.label}</button>)}
    </div>
  );
}

function filesToDataUrls(fileList) {
  const files = Array.from(fileList).filter(f => f.type.startsWith("image/"));
  return Promise.all(files.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
}

async function uploadDataUrlToStorage(dataUrl, pathHint) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = (blob.type.split("/")[1] || "png").split("+")[0];
  const path = `${pathHint}-${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
  const { error } = await supabase.storage.from("inkvault-images").upload(path, blob, { contentType: blob.type });
  if (error) throw error;
  const { data } = supabase.storage.from("inkvault-images").getPublicUrl(path);
  return data.publicUrl;
}

/* ============================================================================
Core Pages & Components
========================================================================== */
function HomePage({library,libraryLoading,bookmarks,setBookmarks,toast,setView,setCurrentManga}) {
  const [search,setSearch]=useState("");
  const [filterGenre,setFilterGenre]=useState("");
  const [filterType,setFilterType]=useState("");
  const [filterStatus,setFilterStatus]=useState("");
  const [sortBy,setSortBy]=useState("popular");
  const [activeTab,setActiveTab]=useState("all");
  const filtered = useMemo(()=>{
    let list=library.filter(m=>{
      if(search&&!m.title.toLowerCase().includes(search.toLowerCase()))return false;
      if(filterGenre&&!m.genres.includes(filterGenre))return false;
      if(filterType&&m.type!==filterType)return false;
      if(filterStatus&&m.status!==filterStatus)return false;
      if(activeTab==="bookmarked"&&!bookmarks.includes(m.id))return false;
      return true;
    });
    if(sortBy==="popular")list.sort((a,b)=>b.views-a.views);
    else if(sortBy==="rating")list.sort((a,b)=>b.rating-a.rating);
    else if(sortBy==="newest")list.sort((a,b)=>b.id.localeCompare(a.id));
    else if(sortBy==="az")list.sort((a,b)=>a.title.localeCompare(b.title));
    return list;
  },[library,search,filterGenre,filterType,filterStatus,sortBy,activeTab,bookmarks]);
  return (
    <div style={{padding:"20px",maxWidth:1200,margin:"0 auto"}}>
      <div style={{marginBottom:28,overflow:"hidden"}}>
        <div className="scroll-x" style={{display:"flex",gap:12,paddingBottom:4}}>
          {library.slice(0,3).map((m)=>(
            <div key={m.id} onClick={()=>{setCurrentManga(m);setView("detail");}} className="ink-ripple halftone"
              style={{flexShrink:0,width:280,overflow:"hidden",position:"relative",cursor:"pointer",
              background:"var(--ink-soft)",
              border:"1px solid var(--line-strong)",minHeight:140,display:"flex",alignItems:"flex-end"}}>
              <img src={m.cover} alt="" style={{position:"absolute",right:0,top:0,height:"100%",width:"50%",objectFit:"cover",opacity:0.5}} loading="lazy"/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to right, var(--ink) 30%, transparent 90%)"}}/>
              <div style={{padding:"16px",position:"relative",zIndex:1}}>
                <span className="tag" style={{marginBottom:8}}>{m.type}</span>
                <div className="brush" style={{fontSize:18,fontWeight:700,lineHeight:1.25,marginBottom:6}}>{m.title}</div>
                <div style={{fontSize:11,color:"var(--paper-dim)"}}>★ {m.rating} · {m.chapters.length} ch</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:"1px solid var(--line)",paddingBottom:0}}>
        {["all","bookmarked"].map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:"10px 16px",fontSize:12,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",
            color:activeTab===tab?"var(--paper)":"var(--paper-faint)",
            borderBottom:activeTab===tab?"2px solid var(--paper)":"2px solid transparent",cursor:"pointer"}}>
            {tab==="all"?"All Series":"My Library"}
            {tab==="bookmarked"&&bookmarks.length>0&&<span style={{marginLeft:6,border:"1px solid var(--line-strong)",borderRadius:99,padding:"1px 7px",fontSize:10}}>{bookmarks.length}</span>}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        <input className="input" placeholder="Search titles…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:"1 1 180px",minWidth:140,maxWidth:280}}/>
        <select className="input" value={filterGenre} onChange={e=>setFilterGenre(e.target.value)} style={{flex:"0 0 auto",minWidth:130}}>
          <option value="">All Genres</option>{GENRES.map(g=><option key={g}>{g}</option>)}
        </select>
        <select className="input" value={filterType} onChange={e=>setFilterType(e.target.value)} style={{flex:"0 0 auto",minWidth:110}}>
          <option value="">All Types</option>{TYPES.map(t=><option key={t}>{t}</option>)}
        </select>
        <select className="input" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{flex:"0 0 auto",minWidth:120}}>
          <option value="">Any Status</option>{STATUS.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="input" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{flex:"0 0 auto",minWidth:120}}>
          <option value="popular">Most Popular</option><option value="rating">Top Rated</option>
          <option value="newest">Newest</option><option value="az">A–Z</option>
        </select>
      </div>
      {libraryLoading ? (
        <div style={{display:"flex",justifyContent:"center",padding:"60px 0"}}>
          <InkSplashLoader label="loading library" size={72}/>
        </div>
      ) : filtered.length===0?(
        <div style={{textAlign:"center",padding:"60px 0",color:"var(--paper-faint)"}}>
          <div className="brush" style={{fontSize:32,marginBottom:10}}>無</div>
          <div style={{fontWeight:600,fontSize:13,letterSpacing:"0.03em"}}>NOTHING FOUND — try different filters</div>
        </div>
      ):(
        <div className="manga-grid">
          {filtered.map(m=><MangaCard key={m.id} manga={m} bookmarks={bookmarks} setBookmarks={setBookmarks} toast={toast} onClick={()=>{setCurrentManga(m);setView("detail");}}/>)}
        </div>
      )}
    </div>
  );
}

function MangaCard({manga,bookmarks,setBookmarks,toast,onClick}) {
  const isBookmarked=bookmarks.includes(manga.id);
  const [ctx,setCtx]=useState(null);
  return (
    <div className="card ink-ripple" style={{cursor:"pointer"}} onClick={onClick}
      onContextMenu={e=>{e.preventDefault();setCtx({x:e.clientX,y:e.clientY});}}>
      <div style={{position:"relative"}}>
        <LazyImg src={manga.cover} alt={manga.title} className="manga-cover" style={{aspectRatio:"2/3"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)"}}/>
        <div style={{position:"absolute",top:8,left:8}}><span className="tag" style={{fontSize:9,padding:"2px 7px",background:"var(--ink)"}}>{manga.type}</span></div>
        <button onClick={e=>{e.stopPropagation();setBookmarks(b=>b.includes(manga.id)?b.filter(x=>x!==manga.id):[...b,manga.id]);toast(isBookmarked?"Removed from library":"Added to library","success");}}
          style={{position:"absolute",top:8,right:8,background:isBookmarked?"var(--paper)":"rgba(0,0,0,0.55)",border:"1px solid var(--line-strong)",borderRadius:2,padding:"5px 8px",fontSize:13,cursor:"pointer",color:isBookmarked?"var(--ink)":"#fff",backdropFilter:"blur(4px)",fontWeight:700}}>
          {isBookmarked?"✓":"+"}
        </button>
        <div style={{position:"absolute",bottom:38,left:10}}>
          <span style={{fontSize:9,padding:"2px 7px",border:"1px solid var(--line-strong)",color:manga.status==="Ongoing"?"var(--paper)":"var(--paper-faint)",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>{manga.status}</span>
        </div>
        <div style={{position:"absolute",bottom:8,left:10,right:10}}>
          <div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{manga.title}</div>
          <div style={{fontSize:10,color:"var(--paper-dim)",marginTop:2}}>★ {manga.rating} · Ch.{manga.chapters.length}</div>
        </div>
      </div>
      {ctx&&<ContextMenu x={ctx.x} y={ctx.y} onClose={()=>setCtx(null)} items={[
        {icon:"✓",label:isBookmarked?"Remove bookmark":"Bookmark",action:()=>setBookmarks(b=>b.includes(manga.id)?b.filter(x=>x!==manga.id):[...b,manga.id])},
        {icon:"⧉",label:"Share",action:()=>{navigator.clipboard?.writeText(manga.title);toast("Copied to clipboard","success");}},
        {icon:"!",label:"Report",action:()=>toast("Reported","warn"),danger:true},
      ]}/>}
    </div>
  );
}

function DetailPage({manga,setManga,bookmarks,setBookmarks,toast,setView,setReaderState,user}) {
  const [tab,setTab]=useState("chapters");
  const [liked,setLiked]=useLocalStorage(`liked-${manga.id}`,false);
  const [disliked,setDisliked]=useLocalStorage(`disliked-${manga.id}`,false);
  const [userRating,setUserRating]=useLocalStorage(`rating-${manga.id}`,0);
  const [readChapters,setReadChapters]=useLocalStorage(`read-${manga.id}`,[]);
  const isBookmarked=bookmarks.includes(manga.id);
  const startReading=(chapterIdx=0, opts={})=>{setReaderState({manga,chapterIdx,...opts});setView("reader");};
  const totalComments = manga.chapters.reduce((sum,c)=>sum+(c.comments?.length||0),0);
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"20px"}}>
      <button className="btn btn-ghost btn-sm" onClick={()=>setView("home")} style={{marginBottom:16}}>← Back</button>
      <div style={{display:"flex",gap:20,marginBottom:24,flexWrap:"wrap"}}>
        <div style={{flexShrink:0,width:140,overflow:"hidden",border:"1px solid var(--line-strong)"}}>
          <img src={manga.cover} alt={manga.title} style={{width:"100%",display:"block"}} loading="lazy"/>
        </div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            <span className="tag">{manga.type}</span>
            <span className="tag" style={{color:manga.status==="Ongoing"?"var(--paper)":"var(--paper-faint)"}}>{manga.status}</span>
          </div>
          <h1 className="brush" style={{fontSize:"clamp(22px,4vw,30px)",fontWeight:800,lineHeight:1.2,marginBottom:6}}>{manga.title}</h1>
          <div style={{color:"var(--paper-dim)",fontSize:13,marginBottom:10}}>by <strong style={{color:"var(--paper)"}}>{manga.author}</strong></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{manga.genres.map(g=><span key={g} className="tag">{g}</span>)}</div>
          <div style={{display:"flex",gap:16,fontSize:12,color:"var(--paper-dim)",marginBottom:14,flexWrap:"wrap"}}>
            <span>{manga.views.toLocaleString()} views</span><span>{manga.likes} likes</span>
            <span>{totalComments} comments</span><span>{manga.chapters.length} ch</span><span>★ {manga.rating}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <Stars value={userRating} onChange={r=>{setUserRating(r);toast(`Rated ${r} stars`,"success");}}/>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button className="btn btn-primary" onClick={()=>startReading(0)}>Start Reading</button>
            <button className={`btn ${liked?"btn-primary":"btn-ghost"} btn-sm`} onClick={()=>{if(!user){toast("Sign in to like","warn");return;}setLiked(!liked);if(disliked)setDisliked(false);toast(liked?"Like removed":"Liked","success");}}>↑ {liked?"Liked":"Like"}</button>
            <button className={`btn ${disliked?"btn-danger":"btn-ghost"} btn-sm`} onClick={()=>{if(!user){toast("Sign in","warn");return;}setDisliked(!disliked);if(liked)setLiked(false);}}>↓</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setBookmarks(b=>b.includes(manga.id)?b.filter(x=>x!==manga.id):[...b,manga.id]);toast(isBookmarked?"Removed":"Added to library","success");}}>
              {isBookmarked?"✓ Saved":"+ Library"}
            </button>
          </div>
        </div>
      </div>
      <div style={{border:"1px solid var(--line)",padding:"16px 18px",marginBottom:20,fontSize:14,color:"var(--paper-dim)",lineHeight:1.7}}>{manga.description}</div>
      <div style={{display:"flex",gap:2,borderBottom:"1px solid var(--line)",marginBottom:16}}>
        {["chapters","info"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 16px",fontSize:12,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",color:tab===t?"var(--paper)":"var(--paper-faint)",borderBottom:tab===t?"2px solid var(--paper)":"2px solid transparent",cursor:"pointer",transition:"color 0.2s"}}>{t}</button>
        ))}
      </div>
      {tab==="chapters"&&(
        <div>
          {[...manga.chapters].reverse().map((ch,ri)=>{
            const idx=manga.chapters.length-1-ri;
            const isRead=readChapters.includes(ch.id);
            const commentCount = ch.comments?.length || 0;
            return <div key={ch.id} className={`chapter-item ${isRead?"read":""}`}>
              <div style={{flex:1,cursor:"pointer"}} onClick={()=>{setReadChapters(r=>r.includes(ch.id)?r:[...r,ch.id]);startReading(idx);}}>
                <div style={{fontWeight:600,fontSize:14}}>{ch.title}</div>
                <div style={{fontSize:11,color:"var(--paper-faint)"}}>{ch.date} · {ch.pages.length} pages {isRead&&"· read"}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={(e)=>{e.stopPropagation();startReading(idx,{openComments:true});}} style={{marginRight:10,fontSize:10}}>
                💬 {commentCount}
              </button>
              <div style={{color:"var(--paper-faint)",fontSize:18}}>→</div>
            </div>;
          })}
        </div>
      )}
      {tab==="info"&&(
        <div style={{display:"grid",gap:1,border:"1px solid var(--line)"}}>
          {[["Author",manga.author],["Type",manga.type],["Status",manga.status],["Chapters",manga.chapters.length],["Views",manga.views.toLocaleString()],["Rating",`${manga.rating} / 5`],["Genres",manga.genres.join(", ")]].map(([k,v])=>(
            <div key={k} style={{display:"flex",gap:12,padding:"12px 14px",borderBottom:"1px solid var(--line)"}}>
              <span style={{fontWeight:700,minWidth:90,color:"var(--paper-faint)",fontSize:11,letterSpacing:"0.05em",textTransform:"uppercase"}}>{k}</span>
              <span style={{fontSize:13}}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChapterComments({chapter, mangaId, onUpdateComments, user, toast, pendingQuote, onConsumeQuote, onJumpToPage}) {
  const [text,setText]=useState("");
  const [posting,setPosting]=useState(false);
  const comments = chapter.comments || [];
  const post = async () => {
    if(!user){toast("Sign in to comment","warn");return;}
    if(!text.trim() && !pendingQuote)return;
    setPosting(true);
    await onUpdateComments(mangaId, chapter.id, null, {
      type: "insert",
      text: text.trim(),
      quotePageId: pendingQuote?.pageId || null,
    });
    setPosting(false);
    setText("");
    if(pendingQuote) onConsumeQuote();
    toast("Comment posted","success");
  };
  return (
    <div>
      {pendingQuote && (
        <div style={{display:"flex",alignItems:"center",gap:10,padding:10,border:"1px solid var(--line-strong)",marginBottom:10,background:"var(--wash)"}}>
          <div className="quote-thumb-wrap" style={{width:34,height:48}}>
            <img src={pendingQuote.thumb} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(1) contrast(1.1)"}}/>
          </div>
          <div style={{flex:1,fontSize:12,color:"var(--paper-dim)"}}>Quoting <strong style={{color:"var(--paper)"}}>Page {pendingQuote.pageIndex+1}</strong> in your reply</div>
          <button className="btn btn-ghost btn-sm" onClick={onConsumeQuote}>✕</button>
        </div>
      )}
      {user ? (
        <div style={{marginBottom:20}}>
          <textarea className="input" rows={3} placeholder={pendingQuote ? "Add a comment about this page…" : "Share your thoughts on this chapter…"} value={text} onChange={e=>setText(e.target.value)} style={{resize:"vertical",marginBottom:8}}/>
          <button className="btn btn-primary btn-sm" onClick={post} disabled={posting}>{posting ? "Posting…" : "Post Comment"}</button>
        </div>
      ) : (
        <div style={{padding:"16px",border:"1px solid var(--line)",marginBottom:16,fontSize:13,color:"var(--paper-faint)"}}>Sign in to leave a comment</div>
      )}
      {comments.length === 0 && (
        <div style={{textAlign:"center",padding:"32px 0",color:"var(--paper-faint)",fontSize:13}}>No comments yet on this chapter.</div>
      )}
      {comments.map(c => (
        <CommentItem key={c.id} comment={c} user={user} toast={toast}
          onDelete={()=>onUpdateComments(mangaId, chapter.id, null, {type:"delete", commentId:c.id})}
          onJumpToPage={onJumpToPage}/>
      ))}
    </div>
  );
}

function CommentItem({comment,user,toast,onDelete,onJumpToPage}) {
  const [liked,setLiked]=useState(false);
  const [ctx,setCtx]=useState(null);
  const isMine=user?.username===comment.user;
  return (
    <div className="comment" onContextMenu={e=>{e.preventDefault();setCtx({x:e.clientX,y:e.clientY});}}>
      <div className="avatar">{comment.avatar}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
          <span style={{fontWeight:600,fontSize:13}}>{comment.user}</span>
          {isMine&&<span style={{fontSize:10,color:"var(--paper)",border:"1px solid var(--line-strong)",padding:"1px 6px"}}>You</span>}
          <span style={{fontSize:11,color:"var(--paper-faint)",marginLeft:"auto"}}>{comment.date}</span>
        </div>
        {comment.text && <p style={{fontSize:14,lineHeight:1.5,wordBreak:"break-word"}}>{comment.text}</p>}
        {comment.quote && onJumpToPage && (
          <div className="quote-card" onClick={()=>onJumpToPage(comment.quote.pageIndex)} title={`Jump to Page ${comment.quote.pageIndex+1}`}>
            <div className="quote-thumb-wrap">
              <img src={comment.quote.thumb} alt={`Page ${comment.quote.pageIndex+1}`} style={{width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(1) contrast(1.1)"}}/>
              <div className="quote-pin"><img src={ASSET_BLOT_BLACK_SMALL} alt="" style={{width:10,height:10}}/></div>
            </div>
            <div style={{fontSize:11.5,color:"var(--paper-dim)",fontWeight:600,lineHeight:1.4}}>
              <div style={{color:"var(--paper)",fontWeight:700}}>Jump to page</div>
              Page {comment.quote.pageIndex+1}
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:10,marginTop:6}}>
          <button onClick={()=>setLiked(!liked)} style={{color:liked?"var(--paper)":"var(--paper-faint)",fontSize:12,cursor:"pointer"}}>↑ {comment.likes+(liked?1:0)}</button>
        </div>
      </div>
      {ctx&&<ContextMenu x={ctx.x} y={ctx.y} onClose={()=>setCtx(null)} items={[
        ...(isMine?[{icon:"✕",label:"Delete",action:onDelete,danger:true}]:[]),
        {icon:"!",label:"Report",action:()=>toast("Comment reported","warn"),danger:true},
        ...(comment.text ? [{icon:"⧉",label:"Copy text",action:()=>{navigator.clipboard?.writeText(comment.text);toast("Copied","success");}}] : []),
      ]}/>}
    </div>
  );
}

function ReaderPage({readerState,setReaderState,toast,setView,onUpdateChapterComments,user}) {
  const {manga,chapterIdx,openComments}=readerState;
  const chapter=manga.chapters[chapterIdx];
  const pages = chapter.pages;
  const [progress,setProgress]=useState(0);
  const [showNav,setShowNav]=useState(true);
  const [showSettings,setShowSettings]=useState(false);
  const [maxWidth,setMaxWidth]=useLocalStorage("reader-width",800);
  const [bgColor,setBgColor]=useLocalStorage("reader-bg","#0A0A0A");
  const [zenMode,setZenMode]=useLocalStorage("reader-zen",false);
  const containerRef=useRef();
  const pageRefs=useRef([]);
  const hideNavTimer=useRef();
  const [currentPage,setCurrentPage]=useState(0);
  const [showComments,setShowComments]=useState(!!openComments);
  const [pendingQuote,setPendingQuote]=useState(null);
  const [arrivalKey,setArrivalKey]=useState(null);

  useEffect(()=>{
    const el=containerRef.current; if(!el) return;
    const onScroll=()=>{
      const{scrollTop,scrollHeight,clientHeight}=el;
      setProgress(Math.min(100,(scrollTop/(scrollHeight-clientHeight))*100));
      setCurrentPage(Math.min(pages.length-1, Math.floor(scrollTop/(scrollHeight/pages.length))));
    };
    el.addEventListener("scroll",onScroll,{passive:true});
    return()=>el.removeEventListener("scroll",onScroll);
  },[chapter,pages.length]);

  const resetHideTimer=()=>{
    if(zenMode) return;
    setShowNav(true);clearTimeout(hideNavTimer.current);hideNavTimer.current=setTimeout(()=>setShowNav(false),3500);
  };
  useEffect(()=>{resetHideTimer();return()=>clearTimeout(hideNavTimer.current);},[zenMode]);

  const goChapter=(delta)=>{
    const nextIdx=chapterIdx+delta;
    if(nextIdx<0||nextIdx>=manga.chapters.length){toast(delta>0?"You've finished all chapters":"This is the first chapter","warn");return;}
    setReaderState({manga,chapterIdx:nextIdx});
    containerRef.current?.scrollTo(0,0);
  };

  const captureQuote = () => {
    if(!user){toast("Sign in to quote a page","warn");return;}
    const page = pages[currentPage];
    setPendingQuote({pageIndex: currentPage, pageId: page.id, thumb: page.image});
    setShowComments(true);
    toast(`Page ${currentPage+1} tagged`, "success");
  };

  const handleJumpFromComment = (pageIndex) => {
    setShowComments(false);
    setTimeout(() => {
      const target = pageRefs.current[pageIndex];
      if (target) {
        target.scrollIntoView({ block: "center", behavior: "instant" });
        setTimeout(() => setArrivalKey(String(pageIndex)), 80);
      }
    }, 320);
  };

  return (
    <div style={{position:"fixed",inset:0,background:bgColor,display:"flex",flexDirection:"column",zIndex:500}}>
      <div className="brush-progress" style={{width:`${progress}%`}} />
      {zenMode && <div className="zen-vignette" />}

      <div style={{position:"absolute",top:0,left:0,right:0,zIndex:9,background:"rgba(10,10,10,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--line)",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,transform:showNav?"translateY(0)":"translateY(-100%)",transition:"transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"}}>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setView("detail")}>←</button>
        <div style={{flex:1,minWidth:0}}>
          <div className="brush" style={{fontSize:14,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{manga.title}</div>
          <div style={{fontSize:11,color:"var(--paper-faint)"}}>{chapter.title} · Page {currentPage+1}/{pages.length}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={()=>setZenMode(!zenMode)} style={{fontSize:11}}>{zenMode?"Exit Zen":"Zen"}</button>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setShowComments(true)}>💬</button>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setShowSettings(!showSettings)}>⚙</button>
      </div>

      {showSettings&&(
        <div style={{position:"absolute",top:60,right:16,zIndex:200,background:"var(--ink-raised)",border:"1px solid var(--line-strong)",padding:20,minWidth:240,animation:"fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",borderRadius:"6px",boxShadow:"0 20px 50px rgba(0,0,0,0.6)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--paper-faint)",marginBottom:12,letterSpacing:"0.05em",textTransform:"uppercase"}}>Reader Settings</div>
          <label style={{fontSize:13,display:"block",marginBottom:8}}>Max Width: {maxWidth}px</label>
          <input type="range" min={400} max={1200} step={50} value={maxWidth} onChange={e=>setMaxWidth(+e.target.value)} style={{width:"100%",marginBottom:16,accentColor:"var(--paper)"}}/>
          <label style={{fontSize:13,display:"block",marginBottom:8}}>Lighting</label>
          <div style={{display:"flex",gap:8}}>
            {[{c:"#0A0A0A",n:"Dark"},{c:"#1a1a1a",n:"Dim"},{c:"#f5f5f0",n:"Paper"},{c:"#e8e0d0",n:"Sepia"}].map(({c,n})=>(
              <button key={c} onClick={()=>setBgColor(c)} style={{flex:1,padding:"8px 0",background:c,border:bgColor===c?"2px solid var(--paper)":"1px solid var(--line-strong)",cursor:"pointer",borderRadius:"4px",fontSize:10,color:c==="#0A0A0A"||c==="#1a1a1a"?"#fff":"#000",fontWeight:600}}>{n}</button>
            ))}
          </div>
        </div>
      )}

      <div ref={containerRef} onMouseMove={resetHideTimer} onClick={resetHideTimer}
        style={{flex:1,overflowY:"auto",overflowX:"hidden",paddingTop:60}}>
        <div style={{maxWidth,margin:"0 auto"}}>
          {pages.map((page,i)=>(
            <div key={page.id} ref={el=>pageRefs.current[i]=el} style={{position:"relative"}}>
              <LazyImg src={page.image} alt={`Page ${i+1}`} style={{width:"100%",aspectRatio:"2/3",display:"block"}}/>
              {arrivalKey === String(i) && (
                <SplashArrivalOverlay key={arrivalKey} onDone={()=>setArrivalKey(null)} bgColor={bgColor} />
              )}
            </div>
          ))}
          <div style={{padding:"60px 20px",textAlign:"center",borderTop:"1px solid var(--line)"}}>
            <div className="brush" style={{fontSize:18,fontWeight:700,marginBottom:12}}>End of {chapter.title}</div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn btn-ghost" onClick={()=>goChapter(-1)}>← Prev Chapter</button>
              <button className="btn btn-primary" onClick={()=>goChapter(1)}>Next Chapter →</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(10,10,10,0.92)",backdropFilter:"blur(12px)",borderTop:"1px solid var(--line)",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,transform:showNav?"translateY(0)":"translateY(100%)",transition:"transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>goChapter(-1)}>← Prev</button>
        <div style={{flex:1,textAlign:"center",fontSize:12,color:"var(--paper-faint)"}}>Ch.{chapter.number} · {Math.round(progress)}%</div>
        <button className="btn btn-primary btn-sm" onClick={()=>goChapter(1)}>Next →</button>
      </div>

      <div className="panel-nav" style={{opacity:showNav?1:0}}>
        {pages.slice(0,20).map((_,i)=>{
          const approxPage=Math.floor((progress/100)*pages.length);
          return <div key={i} className={`panel-dot ${approxPage===i?"active":""}`}
            onClick={()=>{const ratio=i/pages.length;const el=containerRef.current;if(el)el.scrollTo({top:(el.scrollHeight-el.clientHeight)*ratio,behavior:"smooth"});}}/>;
        })}
      </div>

      {!zenMode && (
        <button className="quote-fab" style={{opacity:showNav?1:0,transform:showNav?"translateY(0)":"translateY(10px)"}} onClick={captureQuote}>
          ✎ Quote this page
        </button>
      )}

      {showComments && (
        <div className="drawer-overlay" onClick={e=>e.target===e.currentTarget&&setShowComments(false)}>
          <div className="drawer">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div className="brush" style={{fontSize:20,fontWeight:800}}>Discussion</div>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setShowComments(false)}>✕</button>
            </div>
            <div style={{fontSize:12,color:"var(--paper-faint)",marginBottom:20}}>{chapter.title}</div>
            <ChapterComments chapter={chapter} mangaId={manga.id} onUpdateComments={onUpdateChapterComments} user={user} toast={toast} pendingQuote={pendingQuote} onConsumeQuote={()=>setPendingQuote(null)} onJumpToPage={handleJumpFromComment}/>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
Auth — Cinematic Trailer (Optimized 2D Camera Version)
========================================================================== */
function AuthTrailer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    let W = 800, H = 400, DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = container.getBoundingClientRect();
      W = Math.floor(rect.width);
      H = Math.floor(rect.height);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const INK = "#0A0A0A", PAPER = "#F4F2ED", SEAL = "#C8312A";
    const PAPER_DIM = "#B9B6AC", PAPER_FAINT = "#6E6C65";

    const PI = Math.PI, TAU = PI * 2;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const lerp  = (a, b, t) => a + (b - a) * t;
    const mapRange = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeOutBack = t => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const grain = document.createElement("canvas");
    grain.width = W; grain.height = H;
    const gctx = grain.getContext("2d");
    const imgd = gctx.createImageData(W, H);
    for (let i = 0; i < imgd.data.length; i += 4) {
      const v = Math.floor(Math.random() * 30);
      imgd.data[i] = imgd.data[i + 1] = imgd.data[i + 2] = v;
      imgd.data[i + 3] = Math.random() * 35;
    }
    gctx.putImageData(imgd, 0, 0);

    const camera = { x: 0, y: 0, zoom: 1, rot: 0, tx: 0, ty: 0, tz: 1, tr: 0, shake: 0 };
    function setCameraTarget(x, y, z, r, shake = 0) {
      camera.tx = x; camera.ty = y; camera.tz = z; camera.tr = r; camera.shake = shake;
    }
    function applyCamera() {
      camera.x = lerp(camera.x, camera.tx, 0.08);
      camera.y = lerp(camera.y, camera.ty, 0.08);
      camera.zoom = lerp(camera.zoom, camera.tz, 0.08);
      camera.rot = lerp(camera.rot, camera.tr, 0.08);
      const sx = (Math.random() - 0.5) * camera.shake;
      const sy = (Math.random() - 0.5) * camera.shake;
      camera.shake *= 0.92;
      ctx.save();
      ctx.translate(W / 2 + sx, H / 2 + sy);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.rotate(camera.rot);
      ctx.translate(-W / 2 + camera.x, -H / 2 + camera.y);
    }
    function releaseCamera() { ctx.restore(); }

    function parallax(factor, drawFn) {
      ctx.save();
      ctx.translate(-camera.x * factor, -camera.y * factor);
      drawFn();
      ctx.restore();
    }

    const MAX_PARTICLES = 40;
    const particles = [];
    function spawn(x, y, n, opts = {}) {
      for (let i = 0; i < n && particles.length < MAX_PARTICLES; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * (opts.speed || 2),
          vy: (Math.random() - 0.5) * (opts.speed || 2),
          life: 1, decay: opts.decay || 0.02,
          size: opts.size || Math.random() * 2 + 0.8,
          color: opts.color || PAPER, gravity: opts.gravity || 0,
        });
      }
    }
    function tickParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
        p.vx *= 0.97; p.vy *= 0.97; p.life -= p.decay;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }
    function drawParticles() {
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    }

    const serif = '"Shippori Mincho", Georgia, serif';
    const sans  = 'Inter, -apple-system, sans-serif';

    function drawGrain(alpha = 0.04) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(grain, 0, 0, W, H); ctx.restore();
    }
    function drawVignette(s = 0.7) {
      const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(0,0,0,${s})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    function drawLogo(cx, cy, size, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha; ctx.fillStyle = PAPER;
      ctx.font = `800 ${size}px ${serif}`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("InkVault", cx, cy);
      if (alpha > 0.2) {
        const tw = ctx.measureText("InkVault").width;
        ctx.strokeStyle = PAPER; ctx.lineWidth = Math.max(1, size * 0.025);
        ctx.globalAlpha = alpha * 0.55;
        ctx.beginPath();
        for (let x = 0; x <= tw; x += 3) {
          const nx = cx - tw / 2 + x;
          const ny = cy + size * 0.55 + Math.sin(x * 0.08) * size * 0.02;
          x === 0 ? ctx.moveTo(nx, ny) : ctx.lineTo(nx, ny);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
    function drawAnimTextCenter(text, cx, cy, t, opts = {}) {
      const { size = 28, weight = "700", family = serif, color = PAPER, delay = 0.05 } = opts;
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.textBaseline = "middle";
      const widths = [...text].map(ch => ctx.measureText(ch).width);
      const total = widths.reduce((a, b) => a + b, 0);
      let ox = cx - total / 2;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const p = clamp((t - i * delay) / 0.3, 0, 1);
        if (p <= 0) { ox += widths[i]; continue; }
        ctx.save();
        ctx.globalAlpha = p; ctx.fillStyle = color;
        ctx.translate(ox, cy + (1 - easeOut(p)) * 10);
        ctx.fillText(ch, 0, 0);
        ctx.restore();
        ox += widths[i];
      }
    }

    const FPS = 30;
    const TOTAL = FPS * 15;
    const scenes = [];
    function addScene(start, end, draw, camFn) {
      scenes.push({ s: start * FPS, e: end * FPS, draw, cam: camFn });
    }

    addScene(0, 3, (lt) => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      parallax(0.3, () => {
        for (let i = 0; i < 5; i++) {
          const x = (W * 0.15) + i * (W * 0.18);
          const y = H * 0.3 + Math.sin(i * 2.1) * H * 0.15;
          ctx.save(); ctx.globalAlpha = 0.04 * easeOut(mapRange(lt, 0.2, 0.8));
          ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(x, y, 40 + i * 8, 0, TAU); ctx.fill(); ctx.restore();
        }
      });
      const logoT = mapRange(lt, 0.3, 0.85);
      if (logoT > 0) drawLogo(W / 2, H / 2 - 10, Math.round(lerp(70, 54, easeOut(logoT))), easeOut(logoT) * 0.95);
      const tagT = mapRange(lt, 0.55, 0.95);
      if (tagT > 0) {
        ctx.save(); ctx.globalAlpha = easeOut(tagT) * 0.7; ctx.fillStyle = PAPER_DIM;
        ctx.font = `600 11px ${sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("WHERE STORIES LIVE IN INK", W / 2, H / 2 + 44); ctx.restore();
      }
      drawVignette(0.9); drawGrain(0.05);
    }, (lt) => { setCameraTarget(0, 0, lerp(1.0, 1.15, easeOut(lt)), 0); });

    addScene(3, 6, (lt) => {
      ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
      parallax(0.4, () => {
        const bAlpha = 0.06 * easeOut(mapRange(lt, 0, 0.5));
        ctx.save(); ctx.globalAlpha = bAlpha; ctx.fillStyle = SEAL;
        ctx.beginPath(); ctx.arc(W * 0.85, H * 0.2, 80, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(W * 0.1, H * 0.8, 55, 0, TAU); ctx.fill(); ctx.restore();
      });
      drawAnimTextCenter("Manga without", W / 2, H * 0.38, mapRange(lt, 0.1, 0.5) * 8, { size: Math.min(42, W * 0.055), weight: "800" });
      const h2t = mapRange(lt, 0.22, 0.65);
      if (h2t > 0) {
        ctx.save(); ctx.globalAlpha = easeOut(clamp(h2t * 3, 0, 1)); ctx.fillStyle = SEAL;
        ctx.font = `800 ${Math.min(42, W * 0.055)}px ${serif}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const sc = lerp(1.15, 1, easeOutBack(clamp(h2t * 2, 0, 1)));
        ctx.translate(W / 2, H * 0.58); ctx.scale(sc, sc); ctx.fillText("compromise.", 0, 0); ctx.restore();
        if (h2t > 0.85) spawn(W / 2, H * 0.58, 1, { speed: 1.5, decay: 0.03, color: SEAL, size: 1.2 });
      }
      drawVignette(0.6); drawGrain(0.04);
    }, (lt) => { setCameraTarget(lerp(0, 15, easeInOut(lt)), lerp(0, -5, easeInOut(lt)), 1.02, lerp(0, -0.01, easeInOut(lt))); });

    addScene(6, 9, (lt) => {
      ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
      const stats = [
        { label: "SERIES", val: 12000, x: W * 0.22 },
        { label: "CHAPTERS", val: 240000, x: W * 0.5, hi: true },
        { label: "READERS", val: 98000, x: W * 0.78 },
      ];
      stats.forEach((s, i) => {
        const delay = i * 0.1;
        const p = mapRange(lt, 0.05 + delay, 0.5 + delay);
        if (p <= 0) return;
        const alpha = easeOut(p);
        const barH = easeOut(mapRange(lt, 0.1 + delay, 0.6 + delay)) * H * 0.28;
        ctx.save(); ctx.globalAlpha = alpha * 0.4; ctx.fillStyle = s.hi ? SEAL : PAPER;
        ctx.fillRect(s.x - 1, H * 0.62 - barH, 2, barH); ctx.restore();
        const nv = Math.floor(easeOut(mapRange(lt, 0.1 + delay, 0.75 + delay)) * s.val);
        const ns = nv >= 1000 ? Math.floor(nv / 1000) + "K" : String(nv);
        ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = s.hi ? SEAL : PAPER;
        ctx.font = `800 ${Math.min(26, W * 0.035)}px ${serif}`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(ns, s.x, H * 0.62); ctx.restore();
        ctx.save(); ctx.globalAlpha = alpha * 0.65; ctx.fillStyle = PAPER_DIM;
        ctx.font = `600 9px ${sans}`; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(s.label, s.x, H * 0.64); ctx.restore();
        if (Math.random() < 0.15) spawn(s.x, H * 0.62 - barH, 1, { speed: 1.5, decay: 0.05, size: 1.2, color: s.hi ? SEAL : PAPER, gravity: -0.02 });
      });
      drawAnimTextCenter("By the numbers", W / 2, H * 0.15, mapRange(lt, 0, 0.3) * 8, { size: 11, weight: "600", family: sans, color: PAPER_DIM });
      drawVignette(0.55); drawGrain(0.04);
    }, (lt) => { const pulse = 1 + Math.sin(lt * PI * 2) * 0.015; setCameraTarget(lerp(-10, 10, easeInOut(lt)), 0, pulse, 0); });

    addScene(9, 12, (lt) => {
      ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
      drawAnimTextCenter("Quote the page", W / 2, H * 0.22, mapRange(lt, 0.05, 0.4) * 8, { size: Math.min(32, W * 0.045), weight: "800" });
      drawAnimTextCenter("that moved you.", W / 2, H * 0.22 + Math.min(40, W * 0.055), mapRange(lt, 0.15, 0.5) * 8, { size: Math.min(32, W * 0.045), weight: "800", color: SEAL });
      const comments = [
        { user: "NightReader", text: "The linework here is stunning.", likes: 42, y: H * 0.55 },
        { user: "VoidWalker99", text: "This page changed everything for me.", likes: 28, y: H * 0.72, quoted: true },
      ];
      comments.forEach((c, i) => {
        const delay = i * 0.12;
        const cp = mapRange(lt, 0.3 + delay, 0.7 + delay);
        if (cp <= 0) return;
        const slide = lerp(-60, 0, easeOut(cp));
        const cX = W * 0.12 + slide, cW = W * 0.76, cH = c.quoted ? 70 : 54;
        ctx.save(); ctx.globalAlpha = easeOut(cp);
        ctx.fillStyle = "rgba(21,21,21,0.95)"; ctx.strokeStyle = "rgba(244,242,237,0.12)"; ctx.lineWidth = 0.5;
        ctx.fillRect(cX, c.y, cW, cH); ctx.strokeRect(cX, c.y, cW, cH);
        ctx.fillStyle = "#2a1a1a"; ctx.beginPath(); ctx.arc(cX + 18, c.y + 18, 12, 0, TAU); ctx.fill();
        ctx.fillStyle = PAPER_DIM; ctx.font = `700 9px ${sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.user.slice(0, 2).toUpperCase(), cX + 18, c.y + 18);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAPER; ctx.font = `600 11px ${sans}`; ctx.fillText(c.user, cX + 38, c.y + 16);
        ctx.fillStyle = PAPER_FAINT; ctx.font = `400 9px ${sans}`; ctx.fillText(`↑ ${c.likes}`, cX + 38 + ctx.measureText(c.user).width + 8, c.y + 16);
        ctx.fillStyle = PAPER_DIM; ctx.font = `400 11px ${sans}`; ctx.fillText(c.text, cX + 38, c.y + 34);
        if (c.quoted) {
          ctx.fillStyle = "#0d0d0d"; ctx.fillRect(cX + 38, c.y + 42, 18, 22);
          ctx.strokeStyle = "rgba(244,242,237,0.18)"; ctx.strokeRect(cX + 38, c.y + 42, 18, 22);
          ctx.fillStyle = SEAL; ctx.font = `700 9px ${sans}`; ctx.fillText("↗ Jump to Page 4", cX + 62, c.y + 56);
        }
        ctx.restore();
      });
      drawVignette(0.55); drawGrain(0.04);
    }, (lt) => { setCameraTarget(lerp(-8, 12, easeInOut(lt)), 0, 1.03, lerp(0.005, -0.005, easeInOut(lt))); });

    addScene(12, 15, (lt) => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      parallax(0.5, () => {
        ctx.save();
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * TAU;
          const p = mapRange(lt, 0.05, 0.55);
          const len = easeOut(p) * H * 0.7;
          ctx.strokeStyle = PAPER; ctx.lineWidth = 0.4; ctx.globalAlpha = easeOut(p) * 0.06;
          ctx.beginPath(); ctx.moveTo(W / 2, H / 2);
          ctx.lineTo(W / 2 + Math.cos(angle) * len, H / 2 + Math.sin(angle) * len); ctx.stroke();
        }
        ctx.restore();
      });
      drawVignette(0.92);
      const logoT = mapRange(lt, 0, 0.35);
      if (logoT > 0) {
        const sc = lerp(0, 1, easeOutBack(logoT));
        ctx.save(); ctx.translate(W / 2, H * 0.35); ctx.scale(sc, sc); ctx.translate(-W / 2, -H * 0.35);
        drawLogo(W / 2, H * 0.35, Math.min(54, W * 0.07), easeOut(logoT)); ctx.restore();
        if (logoT > 0.85) spawn(W / 2, H * 0.35, 2, { speed: 3, decay: 0.03, size: 1.5, color: PAPER, gravity: -0.02 });
      }
      drawAnimTextCenter("Your vault is waiting.", W / 2, H * 0.55, mapRange(lt, 0.3, 0.6) * 8, { size: Math.min(22, W * 0.03), weight: "800" });
      const ctaT = mapRange(lt, 0.6, 0.85);
      if (ctaT > 0) {
        ctx.save(); ctx.globalAlpha = easeOut(ctaT);
        const bW = Math.min(160, W * 0.2), bH = 32;
        const bX = W / 2 - bW - 8, bY = H * 0.72;
        ctx.fillStyle = PAPER; ctx.fillRect(bX, bY, bW, bH);
        ctx.fillStyle = INK; ctx.font = `700 10px ${sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("START READING →", bX + bW / 2, bY + bH / 2);
        ctx.strokeStyle = "rgba(244,242,237,0.3)"; ctx.strokeRect(W / 2 + 8, bY, bW, bH);
        ctx.fillStyle = PAPER_DIM; ctx.fillText("BROWSE LIBRARY", W / 2 + 8 + bW / 2, bY + bH / 2); ctx.restore();
      }
      const fadeT = mapRange(lt, 0.88, 1);
      if (fadeT > 0) { ctx.fillStyle = `rgba(0,0,0,${easeInOut(fadeT)})`; ctx.fillRect(0, 0, W, H); }
      drawGrain(0.05);
    }, (lt) => { setCameraTarget(0, 0, lerp(1.12, 1.0, easeInOut(lt)), lerp(-0.008, 0, easeInOut(lt))); });

    const FRAME_MS = 1000 / FPS;
    let frame = 0, raf = null, lastT = 0, running = true;

    function loop(ts) {
      if (!running) return;
      if (ts - lastT < FRAME_MS) { raf = requestAnimationFrame(loop); return; }
      lastT = ts;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      for (const sc of scenes) {
        if (frame < sc.s || frame >= sc.e) continue;
        const lt = (frame - sc.s) / (sc.e - sc.s);
        if (sc.cam) sc.cam(lt);
        applyCamera();
        sc.draw(lt);
        releaseCamera();
        break;
      }
      for (let i = 1; i < scenes.length; i++) {
        const d = Math.abs(frame - scenes[i].s);
        if (d < 3) {
          ctx.save(); ctx.globalAlpha = (1 - d / 3) * 0.5; ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H); ctx.restore();
        }
      }
      tickParticles(); drawParticles();
      frame = (frame + 1) % TOTAL;
      raf = requestAnimationFrame(loop);
    }

    function pause() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }
    function resume() { if (!running) { running = true; lastT = performance.now(); raf = requestAnimationFrame(loop); } }
    const onVis = () => document.hidden ? pause() : resume();
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);

    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "240px", position: "relative", overflow: "hidden", background: "#000" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

function AuthModal({onClose, onLogin, toast}) {
  const [mode,setMode]   = useState("login");
  const [email,setEmail] = useState("");
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [adminCode,setAdminCode] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError]   = useState("");
  const submit = async () => {
    if(!email.trim()||!password){ setError("Email and password are required."); return; }
    if(mode==="register"&&!username.trim()){ setError("Choose a username."); return; }
    setError(""); setLoading(true);
    try {
      if(mode==="login"){
        const{data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(error) throw error;
        await onLogin(data.user); onClose();
      } else {
        const{data,error}=await supabase.auth.signUp({
          email:email.trim(),password,options:{data:{username:username.trim()}}
        });
        if(error) throw error;
        if(data.user&&data.user.identities&&data.user.identities.length===0){
          setError("That email is already registered."); setLoading(false); return;
        }
        if(!data.session){
          toast("Account created — check your email to confirm, then sign in.","success");
          setMode("login"); return;
        }
        if(adminCode.trim()){
          const{data:redeemed,error:redeemError}=await supabase.rpc("redeem_admin_code",{input_code:adminCode.trim()});
          if(redeemError||!redeemed) toast("Admin code was invalid or already used.","warn");
          else toast("Admin access granted.","success");
        }
        await onLogin(data.user); onClose();
      }
    } catch(err) {
      let message="Something went wrong. Please try again.";
      if(err){
        if(typeof err==="string") message=err;
        else if(err.message) message=err.message;
        else if(err.error_description) message=err.error_description;
      }
      setError(message);
    } finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{
        background:'var(--ink-soft)',
        border:'1px solid var(--line-strong)',
        borderRadius:2,
        width:'100%',
        maxWidth:460,
        maxHeight:'90vh',
        overflowY:'auto',
        animation:'fadeUp 0.25s ease',
      }}>
        <div style={{position:'relative',overflow:'hidden',borderBottom:'1px solid var(--line)'}}>
          <AuthTrailer />
          <div style={{
            position:'absolute',inset:0,
            background:'linear-gradient(to bottom, transparent 55%, rgba(21,21,21,0.96) 100%)',
            pointerEvents:'none',
          }}/>
          <div style={{position:'absolute',bottom:12,left:16,pointerEvents:'none'}}>
            <img src={ASSET_LOGO_NAV} alt="InkVault"
              style={{height:18,width:'auto',display:'block',filter:'invert(1) brightness(1.4)',opacity:.9}}/>
          </div>
        </div>
        <div style={{padding:'26px 28px 28px'}}>
          <div className="brush" style={{fontSize:20,fontWeight:800,marginBottom:3}}>
            {mode==="login"?"Welcome back":"Join InkVault"}
          </div>
          <div style={{color:'var(--paper-faint)',fontSize:12.5,marginBottom:20}}>
            {mode==="login"?"Sign in to your account":"Create your free account"}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:6}}>
            <input className="input" type="email" placeholder="Email"
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
            {mode==="register"&&(
              <input className="input" placeholder="Username"
                value={username} onChange={e=>setUsername(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&submit()}/>
            )}
            <input className="input" type="password" placeholder="Password"
              value={password} onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
            {mode==="register"&&(
              <input className="input" placeholder="Admin code (optional)"
                value={adminCode} onChange={e=>setAdminCode(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&submit()}/>
            )}
          </div>
          {error&&<div style={{color:'var(--seal)',fontSize:12.5,marginTop:8,marginBottom:2}}>{error}</div>}
          <button className="btn btn-primary" onClick={submit} disabled={loading}
            style={{width:'100%',marginTop:14}}>
            {loading?"Please wait…":(mode==="login"?"Sign In":"Create Account")}
          </button>
          <div style={{textAlign:'center',marginTop:14,fontSize:12.5,color:'var(--paper-faint)'}}>
            {mode==="login"?"No account?":"Already have one?"}
            <button onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}}
              style={{color:'var(--paper)',marginLeft:4,cursor:'pointer',fontWeight:700,textDecoration:'underline'}}>
              {mode==="login"?"Sign up":"Sign in"}
            </button>
          </div>
          {mode==="register"&&(
            <div style={{marginTop:14,padding:'10px 12px',border:'1px solid var(--line)',fontSize:11.5,color:'var(--paper-faint)',lineHeight:1.5}}>
              Have an admin code from the InkVault team? Enter it above — it's single-use and grants admin access immediately. Leave it blank for a normal reader account.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageUploader({pages, onAddPages, onRemovePage, onReorder, toast}) {
  const fileInputRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setLoading(true);
    try {
      const urls = await filesToDataUrls(fileList);
      if (urls.length === 0) {
        toast("No image files found in that selection","warn");
      } else {
        onAddPages(urls);
        toast(`Added ${urls.length} page${urls.length>1?"s":""}`,"success");
      }
    } catch {
      toast("Could not read those files","error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div
        className={`dropzone ${dragOver?"dragover":""}`}
        onClick={()=>fileInputRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);}}
        style={{marginBottom:16}}
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment"
          style={{display:"none"}} onChange={e=>{handleFiles(e.target.files); e.target.value="";}}/>
        {loading ? (
          <div style={{display:"flex",justifyContent:"center"}}><InkSplashLoader label="reading files" size={56}/></div>
        ) : (
          <>
            <div className="brush" style={{fontSize:15,fontWeight:700,marginBottom:6}}>Drop pages here</div>
            <div style={{fontSize:12,color:"var(--paper-faint)"}}>or click to choose from your device or gallery · multiple files supported</div>
          </>
        )}
      </div>
      {pages.length > 0 ? (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:10,marginBottom:8}}>
          {pages.map((p,i)=>(
            <div key={p.id}
              draggable
              onDragStart={()=>setDragIdx(i)}
              onDragOver={e=>e.preventDefault()}
              onDrop={()=>{ if(dragIdx!==null && dragIdx!==i) onReorder(dragIdx,i); setDragIdx(null); }}
              style={{position:"relative",border:"1px solid var(--line-strong)",cursor:"grab",aspectRatio:"2/3",overflow:"hidden",opacity:dragIdx===i?0.4:1}}
            >
              <img src={p.image} alt={`Page ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(1) contrast(1.1)"}}/>
              <div style={{position:"absolute",top:3,left:3,background:"var(--ink)",border:"1px solid var(--line-strong)",fontSize:10,padding:"1px 5px",fontWeight:700}}>{i+1}</div>
              <button onClick={(e)=>{e.stopPropagation();onRemovePage(i);}}
                style={{position:"absolute",top:3,right:3,background:"var(--seal)",color:"#fff",width:18,height:18,fontSize:11,lineHeight:1,border:"none",borderRadius:2}}>✕</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{fontSize:11.5,color:"var(--paper-faint)"}}>No pages added yet.</div>
      )}
      {pages.length > 0 && <div style={{fontSize:11,color:"var(--paper-faint)"}}>Drag a page to reorder it.</div>}
    </div>
  );
}

function AdminPanel({refetchLibrary,user,toast}) {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({title:"",author:"",description:"",type:"Manhwa",status:"Ongoing",genres:[],cover:"",chapters:[]});
  const [newChapterTitle,setNewChapterTitle]=useState("");
  const [activeChapterIdx,setActiveChapterIdx]=useState(null);
  const [justPublished,setJustPublished]=useState(false);
  const [publishing,setPublishing]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleGenre=g=>set("genres",form.genres.includes(g)?form.genres.filter(x=>x!==g):[...form.genres,g]);
  const titleValid = form.title.trim().length>0;
  const totalPages = form.chapters.reduce((s,c)=>s+c.pages.length,0);
  const publish=async ()=>{
    if(!titleValid){toast("Title is required","error");setStep(1);return;}
    if(form.chapters.length===0 || totalPages===0){toast("Add at least one page to a chapter first","error");setStep(2);return;}
    setPublishing(true);
    try {
      let coverUrl = form.cover;
      if (coverUrl && coverUrl.startsWith("data:")) {
        coverUrl = await uploadDataUrlToStorage(coverUrl, "cover");
      }
      const { data: seriesRow, error: seriesErr } = await supabase
        .from("series")
        .insert({
          title: form.title, author: form.author, description: form.description,
          type: form.type, status: form.status, genres: form.genres,
          cover_url: coverUrl || null, created_by: user.id,
        })
        .select().single();
      if (seriesErr) throw seriesErr;
      for (let i = 0; i < form.chapters.length; i++) {
        const ch = form.chapters[i];
        const { data: chapterRow, error: chErr } = await supabase
          .from("chapters")
          .insert({ series_id: seriesRow.id, number: i+1, title: ch.title })
          .select().single();
        if (chErr) throw chErr;
        for (let p = 0; p < ch.pages.length; p++) {
          const page = ch.pages[p];
          const imageUrl = page.image.startsWith("data:")
            ? await uploadDataUrlToStorage(page.image, "page")
            : page.image;
          const { error: pageErr } = await supabase
            .from("pages")
            .insert({ chapter_id: chapterRow.id, image_url: imageUrl, page_order: p });
          if (pageErr) throw pageErr;
          if (i === 0 && p === 0 && !coverUrl) {
            await supabase.from("series").update({ cover_url: imageUrl }).eq("id", seriesRow.id);
          }
        }
      }
      setJustPublished(true);
      toast("Published","success");
      await refetchLibrary();
      setTimeout(()=>{
        setJustPublished(false);
        setStep(1);setForm({title:"",author:"",description:"",type:"Manhwa",status:"Ongoing",genres:[],cover:"",chapters:[]});
        setActiveChapterIdx(null);
      },1600);
    } catch (err) {
      toast(err.message || "Publishing failed","error");
    } finally {
      setPublishing(false);
    }
  };
  const addChapter=()=>{
    if(!newChapterTitle.trim()){toast("Chapter needs a title","error");return;}
    const ch = {id:`ch-${Date.now()}`, number: form.chapters.length+1, title:newChapterTitle.trim(), date:new Date().toLocaleDateString(), pages:[]};
    set("chapters",[...form.chapters,ch]);
    setNewChapterTitle("");
    setActiveChapterIdx(form.chapters.length);
    toast("Chapter created — now add its pages","success");
  };
  const updateChapterPages = (chapterIdx, updater) => {
    setForm(f=>{
      const chapters = f.chapters.map((c,i)=> i===chapterIdx ? {...c, pages: updater(c.pages)} : c);
      return {...f, chapters};
    });
  };
  const steps=["Basics","Pages","Publish"];
  if (justPublished) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
        <div style={{textAlign:"center"}} className="animate-popIn">
          <div style={{position:"relative",display:"inline-block",marginBottom:18}}>
            <div style={{
              width:84, height:84, borderRadius:"50%", border:"3px solid var(--seal)",
              display:"flex", alignItems:"center", justifyContent:"center",
              transform:"rotate(-8deg)",
            }}>
              <span className="brush" style={{color:"var(--seal)",fontSize:13,fontWeight:800,letterSpacing:"0.05em"}}>PUBLISHED</span>
            </div>
          </div>
          <div className="brush" style={{fontSize:18,fontWeight:700}}>{form.title}</div>
          <div style={{fontSize:12,color:"var(--paper-faint)",marginTop:4}}>is now live in the library</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
        <div>
          <h1 className="brush" style={{fontSize:22,fontWeight:800}}>Upload a Series</h1>
          <div style={{fontSize:13,color:"var(--paper-faint)"}}>Add a new title to the library</div>
        </div>
        <span className="seal-badge" style={{marginLeft:"auto"}}>● Admin</span>
      </div>
      <div style={{display:"flex",gap:0,marginBottom:28,border:"1px solid var(--line)"}}>
        {steps.map((s,i)=>{
          const reachable = i===0 || titleValid;
          return (
            <button key={s} disabled={!reachable} onClick={()=>setStep(i+1)} style={{flex:1,padding:"10px 12px",fontSize:11.5,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",
              color:step===i+1?"var(--paper)":"var(--paper-faint)",
              borderBottom:step===i+1?"2px solid var(--paper)":"2px solid transparent",
              borderRight: i<steps.length-1 ? "1px solid var(--line)" : "none",
              }}><span style={{opacity:0.5,marginRight:5}}>{i+1}</span>{s}</button>
          );
        })}
      </div>
      {step===1&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}} className="animate-fadeUp">
          <div><label style={{fontSize:11,color:"var(--paper-faint)",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:7}}>Title *</label><input className="input" placeholder="Series title" value={form.title} onChange={e=>set("title",e.target.value)}/></div>
          <div><label style={{fontSize:11,color:"var(--paper-faint)",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:7}}>Author</label><input className="input" placeholder="Author name" value={form.author} onChange={e=>set("author",e.target.value)}/></div>
          <div><label style={{fontSize:11,color:"var(--paper-faint)",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:7}}>Description</label><textarea className="input" rows={4} placeholder="Synopsis…" value={form.description} onChange={e=>set("description",e.target.value)} style={{resize:"vertical"}}/></div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:140}}><label style={{fontSize:11,color:"var(--paper-faint)",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:7}}>Type</label><select className="input" value={form.type} onChange={e=>set("type",e.target.value)}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div style={{flex:1,minWidth:140}}><label style={{fontSize:11,color:"var(--paper-faint)",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:7}}>Status</label><select className="input" value={form.status} onChange={e=>set("status",e.target.value)}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
          </div>
          <div><label style={{fontSize:11,color:"var(--paper-faint)",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:8}}>Genres</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{GENRES.map(g=><span key={g} className={`tag action ${form.genres.includes(g)?"active":""}`} onClick={()=>toggleGenre(g)}>{g}</span>)}</div></div>
          <div style={{borderTop:"1px solid var(--line)",paddingTop:16,marginTop:4}}>
            <CoverPicker value={form.cover} onChange={(url)=>set("cover",url)} toast={toast}/>
          </div>
          <div style={{textAlign:"right"}}><button className="btn btn-primary" disabled={!titleValid} onClick={()=>setStep(2)}>Next →</button></div>
        </div>
      )}
      {step===2&&(
        <div className="animate-fadeUp">
          <div style={{marginBottom:18}}>
            <div className="brush" style={{fontSize:15,fontWeight:700,marginBottom:4}}>Chapter Pages</div>
            <div style={{fontSize:11.5,color:"var(--paper-faint)",lineHeight:1.5}}>
              The sequential artwork readers scroll through — different from the single Cover Art image you set in step 1. Each chapter gets its own ordered set of pages.
            </div>
          </div>
          <div style={{border:"1px solid var(--line)",padding:16,marginBottom:20}}>
            <div className="brush" style={{fontWeight:700,marginBottom:12}}>New Chapter</div>
            <div style={{display:"flex",gap:8}}>
              <input className="input" placeholder={`Chapter ${form.chapters.length+1} title`} value={newChapterTitle} onChange={e=>setNewChapterTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addChapter()}/>
              <button className="btn btn-primary" onClick={addChapter} style={{flexShrink:0}}>Add Chapter</button>
            </div>
          </div>
          {form.chapters.length===0 && (
            <div style={{textAlign:"center",padding:"32px 0",color:"var(--paper-faint)",fontSize:13,border:"1px solid var(--line)",marginBottom:20}}>No chapters yet — create one above, then upload its pages.</div>
          )}
          {form.chapters.map((ch,ci)=>{
            const isOpen = activeChapterIdx===ci;
            return (
              <div key={ch.id} style={{border:"1px solid var(--line)",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer"}} onClick={()=>setActiveChapterIdx(isOpen?null:ci)}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{ch.title}</div>
                    <div style={{fontSize:11,color:"var(--paper-faint)"}}>{ch.pages.length} page{ch.pages.length!==1?"s":""}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={(e)=>{e.stopPropagation();set("chapters",form.chapters.filter((_,i)=>i!==ci));if(activeChapterIdx===ci)setActiveChapterIdx(null);}}>Remove</button>
                  <span style={{color:"var(--paper-faint)"}}>{isOpen?"▾":"▸"}</span>
                </div>
                {isOpen && (
                  <div style={{padding:"0 14px 16px"}}>
                    <PageUploader
                      pages={ch.pages}
                      onAddPages={(urls)=>updateChapterPages(ci, prev=>[...prev, ...urls.map((url,i)=>makePage(url, prev.length+i))])}
                      onRemovePage={(idx)=>updateChapterPages(ci, prev=>prev.filter((_,i)=>i!==idx).map((p,i)=>({...p,order:i})))}
                      onReorder={(from,to)=>updateChapterPages(ci, prev=>{
                        const next=[...prev]; const [moved]=next.splice(from,1); next.splice(to,0,moved);
                        return next.map((p,i)=>({...p,order:i}));
                      })}
                      toast={toast}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
            <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={()=>setStep(3)}>Preview →</button>
          </div>
        </div>
      )}
      {step===3&&(
        <div className="animate-fadeUp">
          <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
            <div>
              <img src={form.cover||form.chapters[0]?.pages[0]?.image||`https://picsum.photos/seed/preview/300/450`} alt="" style={{width:100,border:"1px solid var(--line-strong)",objectFit:"cover",aspectRatio:"2/3",display:"block"}}/>
              {!form.cover && (
                <div style={{fontSize:9.5,color:"var(--paper-faint)",marginTop:4,maxWidth:100,lineHeight:1.4}}>using first page as cover</div>
              )}
            </div>
            <div style={{flex:1}}>
              <h2 className="brush" style={{fontSize:20,fontWeight:800,marginBottom:6}}>{form.title||"Untitled"}</h2>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}><span className="tag">{form.type}</span><span className="tag">{form.status}</span>{form.genres.slice(0,3).map(g=><span key={g} className="tag">{g}</span>)}</div>
              <div style={{fontSize:13,color:"var(--paper-dim)"}}>{form.description||"No description."}</div>
              <div style={{fontSize:12,color:"var(--paper-faint)",marginTop:8}}>{form.chapters.length} chapters · {totalPages} pages total · {form.author||"Unknown author"}</div>
            </div>
          </div>
          {totalPages===0 && (
            <div style={{padding:"10px 12px",border:"1px solid var(--seal-dim)",background:"var(--seal-dim)",color:"var(--seal)",fontSize:12,marginBottom:16}}>
              No pages uploaded yet — go back and add at least one page before publishing.
            </div>
          )}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={()=>setStep(2)}>← Edit</button>
            <button className="btn btn-seal" onClick={publish} disabled={publishing}>{publishing ? "Publishing…" : "Publish"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CoverPicker({value, onChange, toast}) {
  const fileInputRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const handleFile = async (fileList) => {
    const [url] = await filesToDataUrls(fileList).catch(()=>[]);
    if (url) onChange(url); else toast("Could not read that file","error");
  };
  return (
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div
        onClick={()=>fileInputRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files);}}
        style={{
          width:108, aspectRatio:"2/3", flexShrink:0, cursor:"pointer",
          border:`1.5px ${value?"solid":"dashed"} ${dragOver?"var(--paper)":"var(--line-strong)"}`,
          background: dragOver ? "var(--wash)" : "transparent",
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative", overflow:"hidden", transition:"border-color 0.18s, background 0.18s",
        }}
      >
        <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}}
          onChange={e=>{handleFile(e.target.files); e.target.value="";}}/>
        {value ? (
          <img src={value} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        ) : (
          <div style={{textAlign:"center",padding:8}}>
            <div style={{fontSize:20,marginBottom:4,opacity:0.5}}>▭</div>
            <div style={{fontSize:10,color:"var(--paper-faint)",lineHeight:1.4}}>Click or drop<br/>a cover image</div>
          </div>
        )}
      </div>
      <div style={{flex:1,minWidth:0,paddingTop:4}}>
        <div className="brush" style={{fontSize:13,fontWeight:700,marginBottom:4}}>Cover Art</div>
        <div style={{fontSize:11.5,color:"var(--paper-faint)",lineHeight:1.5,marginBottom:10}}>
          One image — this is what readers see in the library grid. Not a page from the chapter. Leave blank to use the first page of your first chapter instead.
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>fileInputRef.current?.click()}>{value?"Replace":"Choose image"}</button>
          {value && <button className="btn btn-ghost btn-sm" onClick={()=>onChange("")}>Clear</button>}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({user,bookmarks,toast,signOut,setView}) {
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"20px"}}>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:20,padding:"20px",border:"1px solid var(--line)",flexWrap:"wrap"}}>
        <div className="avatar" style={{width:60,height:60,fontSize:20}}>{user.username.slice(0,2).toUpperCase()}</div>
        <div style={{flex:1,minWidth:160}}>
          <div className="brush" style={{fontSize:19,fontWeight:800}}>{user.username}</div>
          {user.isAdmin&&<div className="seal-badge" style={{marginTop:5}}>● Admin</div>}
          <div style={{fontSize:13,color:"var(--paper-faint)",marginTop:4}}>{bookmarks.length} saved</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={()=>{signOut();toast("Signed out","default");}}>Sign out</button>
      </div>
      {!user.isAdmin && (
        <div style={{padding:"14px 18px",border:"1px solid var(--line)",marginBottom:24,fontSize:12,color:"var(--paper-faint)",lineHeight:1.6}}>
          Admin access is granted by a one-time code from the InkVault team during sign-up — there's no self-serve toggle. If you have a code, sign out and create a new account with it.
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,border:"1px solid var(--line)",marginBottom:24}}>
        {[{label:"Saved",val:bookmarks.length},{label:"Comments",val:0},{label:"Rating",val:"5★"}].map(s=>(
          <div key={s.label} style={{padding:"18px",textAlign:"center",borderRight:"1px solid var(--line)"}}>
            <div className="brush" style={{fontSize:22,fontWeight:800}}>{s.val}</div>
            <div style={{fontSize:11,color:"var(--paper-faint)",letterSpacing:"0.05em",textTransform:"uppercase",marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>
      {user.isAdmin&&(
        <button className="btn btn-primary" style={{width:"100%"}} onClick={()=>setView("admin")}>Open Admin Upload →</button>
      )}
    </div>
  );
}

export default function App() {
  const [library,setLibrary]=useState([]);
  const [libraryLoading,setLibraryLoading]=useState(true);
  const [view,setView]=useState("home");
  const [currentMangaId,setCurrentMangaId]=useState(null);
  const [readerState,setReaderState]=useState(null);
  const [user,setUser]=useState(null);
  const [bookmarks,setBookmarksState]=useState([]);
  const [showAuth,setShowAuth]=useState(false);
  const [booting,setBooting]=useState(true);
  const [wipeKey, setWipeKey] = useState(0);
  const {toasts,show:toast}=useToast();

  useEffect(() => {
    setWipeKey(k => k + 1);
  }, [view]);

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) { setUser(null); setBookmarksState([]); return; }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, role")
        .eq("id", authUser.id)
        .single();
      if (error) { setUser({ id: authUser.id, username: authUser.email, isAdmin: false }); return; }
      setUser({ id: authUser.id, username: data.username, isAdmin: data.role === "admin" });
      const { data: bm } = await supabase.from("bookmarks").select("series_id").eq("user_id", authUser.id);
      setBookmarksState((bm || []).map(b => b.series_id));
    } catch {
      setUser({ id: authUser.id, username: authUser.email, isAdmin: false });
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => loadProfile(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarksState([]);
  }, []);

  const setBookmarks = useCallback((updater) => {
    if (!user) { toast("Sign in to bookmark series","warn"); return; }
    setBookmarksState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const added = next.filter(id => !prev.includes(id));
      const removed = prev.filter(id => !next.includes(id));
      added.forEach(seriesId => {
        supabase.from("bookmarks").insert({ user_id: user.id, series_id: seriesId }).then();
      });
      removed.forEach(seriesId => {
        supabase.from("bookmarks").delete().eq("user_id", user.id).eq("series_id", seriesId).then();
      });
      return next;
    });
  }, [user, toast]);

  const fetchLibrary = useCallback(async () => {
    setLibraryLoading(true);
    const { data, error } = await supabase
      .from("series")
      .select(`
        id, title, author, description, type, status, genres, cover_url,
        views, likes, dislikes, rating,
        chapters (
          id, number, title,
          pages ( id, image_url, page_order ),
          comments ( id, text, likes, created_at, quote_page_id, user_id )
        )
      `)
      .order("created_at", { ascending: false });
    if (error) { toast("Could not load the library","error"); setLibraryLoading(false); return; }
    const shaped = (data || []).map(series => ({
      ...series,
      cover: series.cover_url,
      chapters: (series.chapters || [])
        .sort((a,b) => a.number - b.number)
        .map(ch => ({
          ...ch,
          date: "",
          pages: (ch.pages || [])
            .sort((a,b) => a.page_order - b.page_order)
            .map(p => ({ id: p.id, image: p.image_url, order: p.page_order })),
          comments: (ch.comments || [])
            .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
            .map(c => {
              const quotedPage = c.quote_page_id
                ? (ch.pages || []).find(p => p.id === c.quote_page_id)
                : null;
              return {
                id: c.id,
                user: c.profiles?.username || "unknown",
                text: c.text,
                likes: c.likes,
                date: new Date(c.created_at).toLocaleDateString(),
                avatar: (c.profiles?.username || "??").slice(0,2).toUpperCase(),
                quote: quotedPage ? { pageIndex: quotedPage.page_order, thumb: quotedPage.image_url } : null,
              };
            }),
        })),
    }));
    setLibrary(shaped);
    setLibraryLoading(false);
  }, [toast]);

  useEffect(() => { fetchLibrary(); }, [fetchLibrary]);

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=GLOBAL_CSS;
    document.head.appendChild(style);
    let link = document.querySelector("link[rel~='icon']");
    const createdLink = !link;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    const previousHref = link.href;
    link.type = "image/png";
    link.href = ASSET_FAVICON_64;
    const t=setTimeout(()=>setBooting(false), 1100);
    return()=>{
      document.head.removeChild(style);
      clearTimeout(t);
      if (createdLink) { link.remove(); }
      else { link.href = previousHref; }
    };
  },[]);

  const currentManga = useMemo(()=>library.find(m=>m.id===currentMangaId)||null, [library,currentMangaId]);

  const liveReaderState = useMemo(()=>{
    if (!readerState) return null;
    const freshManga = library.find(m=>m.id===readerState.manga.id) || readerState.manga;
    return {...readerState, manga: freshManga};
  },[readerState, library]);

  const updateChapterComments = useCallback(async (mangaId, chapterId, newComments, meta) => {
    if (meta?.type === "delete") {
      await supabase.from("comments").delete().eq("id", meta.commentId);
    } else if (meta?.type === "insert") {
      await supabase.from("comments").insert({
        chapter_id: chapterId,
        user_id: user.id,
        text: meta.text,
        quote_page_id: meta.quotePageId || null,
      });
    }
    fetchLibrary();
  },[user, fetchLibrary]);

  const setCurrentManga = (m) => setCurrentMangaId(m?.id ?? null);

  if (booting) {
    return <FullscreenInkLoader />;
  }

  if(view==="reader"&&liveReaderState){
    return <>
      <ReaderPage readerState={liveReaderState} setReaderState={setReaderState} toast={toast} setView={setView} onUpdateChapterComments={updateChapterComments} user={user}/>
      <ToastContainer toasts={toasts}/>
    </>;
  }

  const navItems=[
    {id:"home",icon:"⌂",label:"Browse"},
    {id:"profile",icon:"☷",label:"Profile"},
    ...(user?.isAdmin?[{id:"admin",icon:"✒",label:"Admin"}]:[]),
  ];

  return (
    <div style={{minHeight:"100vh"}}>
      {wipeKey > 0 && <InkWipe key={wipeKey} onComplete={() => {}} />}
      <nav className="nav">
        <img src={ASSET_LOGO_NAV} alt="InkVault" onClick={()=>setView("home")} style={{height:24,width:"auto",display:"block",filter:"invert(1) brightness(1.4)",cursor:"pointer"}}/>
        <div style={{flex:1}}/>
        {user?(
          <div className="avatar" style={{width:32,height:32,fontSize:11,cursor:"pointer",border:user.isAdmin?"1.5px solid var(--seal)":"1px solid var(--line-strong)"}} onClick={()=>setView("profile")}>
            {user.username.slice(0,2).toUpperCase()}
          </div>
        ):(
          <button className="btn btn-primary btn-sm" onClick={()=>setShowAuth(true)}>Sign In</button>
        )}
      </nav>
      <main className="main-content">
        {view==="home"&&<HomePage library={library} libraryLoading={libraryLoading} bookmarks={bookmarks} setBookmarks={setBookmarks} toast={toast} setView={setView} setCurrentManga={setCurrentManga}/>}
        {view==="detail"&&currentManga&&<DetailPage manga={currentManga} setManga={()=>{}} bookmarks={bookmarks} setBookmarks={setBookmarks} toast={toast} setView={setView} setReaderState={setReaderState} user={user}/>}
        {view==="profile"&&(user?<ProfilePage user={user} bookmarks={bookmarks} toast={toast} signOut={signOut} setView={setView}/>:(
          <div style={{textAlign:"center",padding:"80px 20px"}}>
            <div className="brush" style={{fontSize:36,marginBottom:14}}>人</div>
            <div className="brush" style={{fontSize:20,fontWeight:800,marginBottom:8}}>Not signed in</div>
            <button className="btn btn-primary" onClick={()=>setShowAuth(true)}>Sign In / Register</button>
          </div>
        ))}
        {view==="admin"&&(user?.isAdmin?<AdminPanel refetchLibrary={fetchLibrary} user={user} toast={toast}/>:(
          <div style={{textAlign:"center",padding:"80px 20px"}}>
            <div className="brush" style={{fontSize:36,marginBottom:14}}>鎖</div>
            <div className="brush" style={{fontSize:18,fontWeight:800,marginBottom:10}}>Admin access required</div>
            {user ? (
              <button className="btn btn-seal" onClick={()=>setView("profile")}>Get admin access →</button>
            ) : (
              <button className="btn btn-primary" onClick={()=>setShowAuth(true)}>Sign In</button>
            )}
          </div>
        ))}
      </main>
      <div className="bottom-nav">
        {navItems.map(n=>(
          <button key={n.id} className={`bottom-nav-item ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}>
            <span className="bottom-nav-icon">{n.icon}</span>{n.label}
          </button>
        ))}
        {!user&&<button className="bottom-nav-item" onClick={()=>setShowAuth(true)}><span className="bottom-nav-icon">⚿</span>Sign In</button>}
      </div>
      {showAuth&&<AuthModal toast={toast} onClose={()=>setShowAuth(false)} onLogin={async (authUser)=>{await loadProfile(authUser);toast(`Welcome back`, "success");}}/>}
      <ToastContainer toasts={toasts}/>
    </div>
  );
}