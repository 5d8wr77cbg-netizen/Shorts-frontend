import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0B0F1A", surface: "#131827", border: "#1E2638",
  accent: "#FF4D6D", accentL: "#FF7A91", text: "#E8EAF0",
  muted: "#6B748A", success: "#34D399", warn: "#F59E0B",
};

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${C.bg};color:${C.text};font-family:'Inter',sans-serif;min-height:100vh}
.app{max-width:700px;margin:0 auto;padding:20px 14px 100px}

.logo{font-family:'Space Grotesk',sans-serif;font-size:21px;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:28px}
.logo-dot{width:9px;height:9px;border-radius:50%;background:${C.accent};flex-shrink:0}
.logo-sub{font-size:11px;font-weight:400;color:${C.muted};margin-top:1px}

.tabs{display:flex;gap:5px;margin-bottom:24px;padding:4px;background:${C.surface};border-radius:12px;border:1px solid ${C.border};overflow-x:auto}
.tab{flex:1;min-width:70px;padding:8px 4px;border:none;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;background:transparent;color:${C.muted};font-family:'Inter',sans-serif;white-space:nowrap}
.tab.active{background:${C.accent};color:#fff}
.tab:hover:not(.active){color:${C.text};background:${C.border}}

.card{background:${C.surface};border:1px solid ${C.border};border-radius:16px;padding:20px;margin-bottom:14px}
.card-title{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px;color:${C.text}}

label{display:block;font-size:11px;font-weight:500;color:${C.muted};text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px;margin-top:14px}
label:first-child{margin-top:0}
input,textarea,select{width:100%;padding:10px 13px;background:${C.bg};border:1px solid ${C.border};border-radius:10px;color:${C.text};font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:border-color .15s;resize:vertical}
input:focus,textarea:focus,select:focus{border-color:${C.accent}}
select option{background:${C.bg}}

.btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;padding:12px;border:none;border-radius:11px;font-size:14px;font-weight:600;cursor:pointer;transition:all .18s;font-family:'Space Grotesk',sans-serif;margin-top:14px}
.btn-primary{background:${C.accent};color:#fff}
.btn-primary:hover:not(:disabled){background:${C.accentL};transform:translateY(-1px)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-secondary{background:${C.border};color:${C.text};margin-top:8px}
.btn-secondary:hover:not(:disabled){background:#283044}
.btn-secondary:disabled{opacity:.4;cursor:not-allowed}
.btn-green{background:${C.success};color:#052e16;margin-top:8px}
.btn-green:hover{background:#6ee7b7}
.btn-purple{background:linear-gradient(135deg,#7c3aed,#c026d3);color:#fff;margin-top:8px}
.btn-sm{padding:7px 14px;font-size:12px;width:auto;margin-top:0;border-radius:8px}

.result{background:${C.bg};border:1px solid ${C.border};border-radius:11px;padding:16px;margin-top:14px;white-space:pre-wrap;font-size:13px;line-height:1.75;color:${C.text};position:relative;max-height:420px;overflow-y:auto}
.copy-btn{position:absolute;top:9px;right:9px;padding:4px 11px;border:1px solid ${C.border};border-radius:6px;background:${C.surface};color:${C.muted};font-size:11px;cursor:pointer;transition:all .15s;font-family:'Inter',sans-serif}
.copy-btn:hover{color:${C.text};border-color:${C.accent}}

.spinner{width:17px;height:17px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}

.tag-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}
.tag{padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500;background:${C.border};color:${C.muted};cursor:pointer;border:1px solid transparent;transition:all .15s;user-select:none}
.tag.active{background:rgba(255,77,109,.15);color:${C.accent};border-color:${C.accent}}

.alert{padding:11px 13px;border-radius:9px;font-size:12px;margin-top:12px;border:1px solid;line-height:1.5}
.alert-error{background:rgba(255,77,109,.08);border-color:rgba(255,77,109,.3);color:#ff8fa3}
.alert-success{background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.3);color:${C.success}}
.alert-info{background:rgba(99,179,237,.08);border-color:rgba(99,179,237,.3);color:#90cdf4}
.alert-warn{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.3);color:${C.warn}}

.progress-bar{height:5px;background:${C.border};border-radius:3px;margin-top:12px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,${C.accent},${C.accentL});border-radius:3px;transition:width .3s ease}
.render-log{font-size:11px;color:${C.muted};margin-top:6px;font-style:italic;min-height:16px}
.char-count{text-align:right;font-size:11px;color:${C.muted};margin-top:4px}

/* ── Video builder ── */
.format-row{display:flex;gap:8px;margin-top:6px}
.format-btn{flex:1;padding:10px 6px;border:1px solid ${C.border};border-radius:9px;background:${C.bg};color:${C.muted};font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;text-align:center;font-family:'Inter',sans-serif}
.format-btn.active{border-color:${C.accent};color:${C.accent};background:rgba(255,77,109,.08)}
.format-ratio{font-size:18px;display:block;margin-bottom:2px}

.scenes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
.scene-card{border:1px solid ${C.border};border-radius:9px;overflow:hidden;position:relative;cursor:pointer;transition:border-color .15s;background:${C.bg}}
.scene-card:hover,.scene-card.sel{border-color:${C.accent}}
.scene-card.sel{box-shadow:0 0 0 2px rgba(255,77,109,.3)}
.scene-thumb{width:100%;display:block;object-fit:cover}
.scene-thumb-placeholder{width:100%;background:linear-gradient(135deg,#1E2638,#131827);display:flex;align-items:center;justify-content:center;font-size:20px}
.scene-info{padding:6px 8px}
.scene-label-pill{font-size:9px;font-weight:700;color:${C.accent};text-transform:uppercase;letter-spacing:.5px}
.scene-text-preview{font-size:10px;color:${C.text};margin-top:2px;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.scene-dur-badge{position:absolute;top:5px;right:5px;background:rgba(0,0,0,.7);color:#fff;font-size:9px;padding:2px 5px;border-radius:4px}

.scene-editor{background:${C.bg};border:1px solid ${C.border};border-radius:11px;padding:14px;margin-top:10px}
.scene-editor-title{font-size:12px;font-weight:600;color:${C.accent};margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.upload-zone{border:2px dashed ${C.border};border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:border-color .15s;margin-top:6px;position:relative}
.upload-zone:hover{border-color:${C.accent}}
.upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-zone-text{font-size:13px;color:${C.muted}}
.upload-zone-icon{font-size:28px;margin-bottom:6px}

.img-preview{width:100%;border-radius:8px;object-fit:cover;max-height:140px;display:block;margin-top:8px}

.bg-picker{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}
.bg-swatch{width:30px;height:30px;border-radius:7px;cursor:pointer;border:2px solid transparent;transition:all .15s;flex-shrink:0}
.bg-swatch.active{border-color:#fff;transform:scale(1.18)}

.tts-controls{display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap}
.tts-badge{font-size:11px;padding:3px 9px;border-radius:6px;border:1px solid;font-weight:500}
.tts-badge-ok{border-color:${C.success};color:${C.success};background:rgba(52,211,153,.08)}
.tts-badge-warn{border-color:${C.warn};color:${C.warn};background:rgba(245,158,11,.08)}

.sub-timeline{margin-top:10px;border:1px solid ${C.border};border-radius:9px;overflow:hidden}
.sub-row{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid ${C.border};font-size:12px}
.sub-row:last-child{border-bottom:none}
.sub-time{color:${C.accent};font-family:monospace;font-size:11px;white-space:nowrap;min-width:90px}
.sub-text{color:${C.text};flex:1}

.video-wrap{display:flex;justify-content:center;margin-top:14px}
.video-el{border-radius:12px;border:2px solid ${C.border};background:#000;display:block;max-height:480px;max-width:100%}

.cover-wrap{display:flex;justify-content:center;margin-top:10px}
.cover-img{border-radius:10px;max-width:260px;width:100%;border:2px solid ${C.border}}

.step-indicator{display:flex;align-items:center;gap:0;margin-bottom:16px;overflow:hidden;border-radius:9px;border:1px solid ${C.border}}
.step-item{flex:1;padding:8px 4px;text-align:center;font-size:11px;font-weight:500;color:${C.muted};background:${C.bg};border-right:1px solid ${C.border};transition:all .2s;cursor:default}
.step-item:last-child{border-right:none}
.step-item.done{color:${C.success};background:rgba(52,211,153,.06)}
.step-item.active{color:${C.accent};background:rgba(255,77,109,.08);font-weight:700}

.api-status-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.api-pill{font-size:11px;padding:4px 10px;border-radius:20px;border:1px solid;display:flex;align-items:center;gap:5px}
.api-pill.ok{border-color:${C.success};color:${C.success};background:rgba(52,211,153,.07)}
.api-pill.off{border-color:${C.border};color:${C.muted};background:transparent}

.history-item{padding:11px;border-radius:9px;border:1px solid ${C.border};margin-bottom:8px;cursor:pointer;transition:border-color .15s}
.history-item:hover{border-color:${C.accent}}
.history-meta{font-size:10px;color:${C.muted};margin-bottom:4px}
.history-preview{font-size:12px;color:${C.text};overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.empty{text-align:center;color:${C.muted};padding:36px 0;font-size:14px}
.empty-icon{font-size:38px;margin-bottom:10px}

canvas{display:none}
`;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const NICHES    = ["Технологии","Лайфхаки","Мотивация","Образование","Юмор","Финансы","Здоровье","Путешествия","Готовка","Игры","Мода","Спорт"];
const TONES     = ["Энергичный","Серьёзный","Юмористический","Вдохновляющий","Провокационный","Образовательный"];
const DURATIONS = ["15 сек","30 сек","45 сек","60 сек"];

const FORMATS = [
  { id:"9:16", label:"Shorts", ratio:"9:16", w:540, h:960,  icon:"📱" },
  { id:"16:9", label:"YouTube",ratio:"16:9",w:1280,h:720,  icon:"🖥" },
  { id:"1:1",  label:"Соцсети",ratio:"1:1", w:720, h:720,  icon:"⬛" },
];

const BG_THEMES = [
  { name:"Ночной",  colors:["#0B0F1A","#1E2638"], accent:"#FF4D6D" },
  { name:"Закат",   colors:["#1a0533","#6b21a8"], accent:"#f59e0b" },
  { name:"Океан",   colors:["#0c1445","#1e3a8a"], accent:"#38bdf8" },
  { name:"Лес",     colors:["#052e16","#14532d"], accent:"#4ade80" },
  { name:"Огонь",   colors:["#450a0a","#991b1b"], accent:"#fb923c" },
  { name:"Серебро", colors:["#0f172a","#1e293b"], accent:"#e2e8f0" },
];

// ─────────────────────────────────────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────────────────────────────────────
// Global backend URL, set by App on mount (so plain functions can read it)
let GLOBAL_BACKEND = { url: "", ok: false };

// Generate text. Prefers your backend (OpenAI), falls back to the built-in
// Claude endpoint when running inside the Claude artifact preview.
async function callClaude(sys, usr, maxTokens = 1000) {
  // 1) Try backend first (works when deployed standalone)
  if (GLOBAL_BACKEND.ok && GLOBAL_BACKEND.url) {
    try {
      const r = await fetch(`${GLOBAL_BACKEND.url}/api/generate-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: sys, user: usr, maxTokens }),
      });
      if (r.ok) { const d = await r.json(); return d.text; }
    } catch { /* fall through to Claude */ }
  }
  // 2) Built-in Claude endpoint (only inside the artifact sandbox)
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:maxTokens, system:sys, messages:[{role:"user",content:usr}] }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const d = await res.json();
  return d.content.map(b => b.text||"").join("");
}

// Proxy calls – go through your backend to keep API keys safe
async function proxyPost(backendUrl, endpoint, body) {
  const res = await fetch(`${backendUrl}${endpoint}`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Backend ${res.status}: ${err}`);
  }
  return res;
}

// Generate image via backend → returns object URL
async function generateImage(backendUrl, prompt) {
  const res = await proxyPost(backendUrl, "/api/generate-image", { prompt });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// Generate TTS via backend → returns { audioUrl, durationSec }
async function generateTTS(backendUrl, text, voice = "alloy") {
  const res = await proxyPost(backendUrl, "/api/tts", { text, voice });
  const blob = await res.blob();
  const audioUrl = URL.createObjectURL(blob);
  // Measure duration
  const durationSec = await new Promise(resolve => {
    const a = new Audio(audioUrl);
    a.onloadedmetadata = () => resolve(a.duration || text.length / 15);
    a.onerror = () => resolve(text.length / 15);
  });
  return { audioUrl, durationSec };
}

// Check if backend is reachable
async function pingBackend(url) {
  try {
    const r = await fetch(`${url}/health`, { signal: AbortSignal.timeout(2500) });
    return r.ok;
  } catch { return false; }
}

// Build a REAL MP4 on the backend via FFmpeg.
// Sends scene images + audio + manifest, gets back an .mp4 blob.
async function buildMp4ViaBackend(backendUrl, scenes, format, onLog) {
  const fd = new FormData();
  const manifest = [];

  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    manifest.push({ duration: sc.duration, subtitle: sc.subtitle || "" });
    const idx = String(i).padStart(2, "0");

    // Image: required. If a scene has no image we render a gradient PNG on the fly.
    let imgBlob;
    if (sc.imageUrl) {
      imgBlob = await (await fetch(sc.imageUrl)).blob();
    } else {
      imgBlob = await gradientPng(format, sc);
    }
    fd.append("images", imgBlob, `img_${idx}.png`);

    // Audio: optional
    if (sc.audioUrl) {
      const audBlob = await (await fetch(sc.audioUrl)).blob();
      fd.append("audios", audBlob, `aud_${idx}.mp3`);
    }
  }

  fd.append("manifest", JSON.stringify(manifest));
  fd.append("format", format.id);

  onLog("☁️ Отправляю на сервер для сборки MP4…");
  const res = await fetch(`${backendUrl}/api/build-video`, { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Сервер вернул ошибку: ${err.slice(0, 200)}`);
  }
  onLog("📦 Получаю готовый MP4…");
  return await res.blob();
}

// Generate a gradient PNG for scenes without images (so FFmpeg has an input)
function gradientPng(format, scene) {
  const { w, h } = format;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  const theme = BG_THEMES[0];
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, theme.colors[0]); g.addColorStop(1, theme.colors[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // main text
  ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.round(w * 0.07)}px Arial,sans-serif`;
  ctx.shadowColor = "rgba(0,0,0,.8)"; ctx.shadowBlur = 14;
  wrapText(ctx, scene.text, w / 2, h * 0.45, w * 0.84, Math.round(w * 0.085));
  return new Promise(r => canvas.toBlob(r, "image/png"));
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseScenes(raw) {
  const blockRe = /(?:ХУУК|ХООУК|ОСНОВНАЯ ЧАСТЬ|КУЛЬМИНАЦИЯ|ПРИЗЫВ|CTA|СУБТИТРЫ|СЦЕНА\s*\d*)[^\n]*:\s*([^\n]+(?:\n(?![А-ЯA-Z]{3,}:)[^\n]*)*)/gi;
  const blocks = [];
  let m;
  while ((m = blockRe.exec(raw)) !== null) {
    const label = raw.slice(m.index, m.index+25).split(":")[0].trim();
    const body  = m[1].trim().replace(/\n/g," ").slice(0,120);
    if (body.length > 4) blocks.push({ label, body });
  }
  if (blocks.length >= 2) return blocks.map((b,i) => ({
    id:i, label:b.label, text:b.body, subtitle:b.body.split(/[.!?]/)[0].trim().slice(0,60),
    duration: i===0 ? 3 : Math.max(3, Math.ceil(b.body.length/18)),
    imageUrl:null, audioUrl:null, imagePrompt:"",
  }));

  const sents = raw.replace(/\n+/g," ").split(/(?<=[.!?])\s+/).filter(s=>s.trim().length>5);
  const grp=[]; let cur="";
  const LBLS=["ХУУК","СЦЕНА 1","СЦЕНА 2","СЦЕНА 3","СЦЕНА 4","КУЛЬМИНАЦИЯ","CTA"];
  sents.forEach(s=>{
    if((cur+" "+s).length>100&&cur){grp.push(cur.trim());cur=s;}else cur=cur?cur+" "+s:s;
  });
  if(cur.trim()) grp.push(cur.trim());
  return grp.slice(0,7).map((text,i)=>({
    id:i, label:LBLS[i]||`СЦЕНА ${i+1}`, text:text.slice(0,120),
    subtitle:text.split(/[.!?]/)[0].trim().slice(0,60),
    duration: i===0?3:Math.max(3,Math.ceil(text.length/18)),
    imageUrl:null, audioUrl:null, imagePrompt:"",
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(" "); let line=""; const lines=[];
  for (const w of words){
    const t=line+w+" ";
    if(ctx.measureText(t).width>maxW&&line){lines.push(line.trim());line=w+" ";}else line=t;
  }
  if(line) lines.push(line.trim());
  const totalH=lines.length*lineH;
  const startY=y-totalH/2;
  lines.forEach((l,i)=>ctx.fillText(l,x,startY+i*lineH));
  return lines.length;
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();ctx.fill();
}
function loadImg(src){
  return new Promise((res,rej)=>{
    if(!src){res(null);return;}
    const img=new Image();img.crossOrigin="anonymous";
    img.onload=()=>res(img);img.onerror=()=>res(null);img.src=src;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO RENDERER (Canvas + MediaRecorder)
// ─────────────────────────────────────────────────────────────────────────────
async function renderVideoBlob(scenes, theme, format, onProgress, onLog, audioCtx) {
  const { w:W, h:H } = format;
  const FPS = 30;

  // Pre-load images
  const imgs = await Promise.all(scenes.map(s => loadImg(s.imageUrl)));

  const canvas = document.createElement("canvas");
  canvas.width=W; canvas.height=H;
  const ctx = canvas.getContext("2d");

  // Merge audio tracks if available
  let audioStream = null;
  const hasAudio = scenes.some(s=>s.audioUrl);

  const mimeType = ["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"]
    .find(t=>MediaRecorder.isTypeSupported(t))||"video/webm";

  const vidStream = canvas.captureStream(FPS);
  const streamTracks = [...vidStream.getTracks()];

  // Add audio destination if we have audio
  let audioDestination = null;
  if (hasAudio && audioCtx) {
    audioDestination = audioCtx.createMediaStreamDestination();
    audioStream = audioDestination.stream;
    audioStream.getAudioTracks().forEach(t=>streamTracks.push(t));
  }
  const finalStream = new MediaStream(streamTracks);

  const chunks=[];
  const rec=new MediaRecorder(finalStream,{mimeType,videoBitsPerSecond:3_000_000});
  rec.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
  rec.start(80);
  onLog("⏺ Запись начата…");

  const totalFrames=scenes.reduce((s,sc)=>s+sc.duration*FPS,0);
  let framesDone=0;

  const gradient=(c1,c2)=>{
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,c1);g.addColorStop(1,c2);return g;
  };

  for(let si=0;si<scenes.length;si++){
    const sc=scenes[si];
    const img=imgs[si];
    const totalSF=sc.duration*FPS;
    onLog(`🎬 Сцена ${si+1}/${scenes.length}: ${sc.label}`);

    // Schedule audio playback
    if(sc.audioUrl && audioCtx && audioDestination){
      try{
        const resp=await fetch(sc.audioUrl);
        const ab=await resp.arrayBuffer();
        const buf=await audioCtx.decodeAudioData(ab);
        const src=audioCtx.createBufferSource();
        src.buffer=buf;
        src.connect(audioDestination);
        src.start(audioCtx.currentTime);
      }catch(e){ /* no audio for this scene */ }
    }

    for(let f=0;f<totalSF;f++){
      const prog=f/totalSF;
      const fadeIn=Math.min(1,prog*6);
      const fadeOut=f>(totalSF-FPS*0.4)?Math.max(0,1-(f-(totalSF-FPS*0.4))/(FPS*0.4)):1;
      const alpha=Math.min(fadeIn,fadeOut);

      // Background
      if(img){
        ctx.drawImage(img,0,0,W,H);
        ctx.fillStyle="rgba(0,0,0,0.52)";
        ctx.fillRect(0,0,W,H);
      } else {
        ctx.fillStyle=gradient(theme.colors[0],theme.colors[1]);
        ctx.fillRect(0,0,W,H);
        // grid
        ctx.strokeStyle="rgba(255,255,255,0.025)";ctx.lineWidth=1;
        for(let gx=0;gx<W;gx+=48){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
        for(let gy=0;gy<H;gy+=48){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}
        // glow
        const glow=ctx.createRadialGradient(W/2,H*0.3,0,W/2,H*0.3,W*0.6);
        glow.addColorStop(0,theme.accent+"33");glow.addColorStop(1,"transparent");
        ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
      }

      // Label pill
      ctx.globalAlpha=alpha*0.92;
      const pillTxt=sc.label.toUpperCase().slice(0,18);
      ctx.font=`bold ${Math.round(W*0.038)}px Arial,sans-serif`;
      const pillW=ctx.measureText(pillTxt).width+32;
      const pillY=Math.round(H*0.085);
      ctx.fillStyle=theme.accent+"33"; roundRect(ctx,W/2-pillW/2,pillY,pillW,Math.round(H*0.042),Math.round(H*0.021));
      ctx.fillStyle=theme.accent;ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText(pillTxt,W/2,pillY+Math.round(H*0.021));

      // Progress bar
      ctx.globalAlpha=0.45;
      ctx.fillStyle="rgba(255,255,255,0.08)";roundRect(ctx,W*0.07,H*0.145,W*0.86,3,1.5);
      ctx.fillStyle=theme.accent;roundRect(ctx,W*0.07,H*0.145,W*0.86*prog,3,1.5);

      // Main text
      ctx.globalAlpha=alpha;
      ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=16;
      ctx.fillStyle="#FFFFFF";
      const fontSize=sc.text.length>55?Math.round(W*0.068):Math.round(W*0.082);
      ctx.font=`bold ${fontSize}px 'Arial Black',Arial,sans-serif`;
      ctx.textAlign="center";ctx.textBaseline="middle";
      wrapText(ctx,sc.text,W/2,H*0.48,W*0.84,fontSize*1.25);
      ctx.shadowBlur=0;

      // Subtitle bar
      if(sc.subtitle){
        ctx.globalAlpha=alpha*0.97;
        const barH=Math.round(H*0.07);const barY=H-Math.round(H*0.19);
        ctx.fillStyle="rgba(0,0,0,0.72)";roundRect(ctx,W*0.05,barY,W*0.9,barH,9);
        ctx.fillStyle="#FFFFFF";
        ctx.font=`bold ${Math.round(W*0.042)}px Arial,sans-serif`;
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(sc.subtitle.slice(0,52),W/2,barY+barH/2);
      }

      // Scene dots
      ctx.globalAlpha=0.75;
      const dotY=H-Math.round(H*0.065);const dotSp=Math.round(W*0.03);
      const sx=W/2-(scenes.length-1)*dotSp/2;
      for(let d=0;d<scenes.length;d++){
        ctx.beginPath();ctx.arc(sx+d*dotSp,dotY,d===si?Math.round(W*0.009):Math.round(W*0.006),0,Math.PI*2);
        ctx.fillStyle=d===si?theme.accent:"rgba(255,255,255,0.3)";ctx.fill();
      }
      ctx.globalAlpha=1;

      framesDone++;
      onProgress(Math.round(framesDone/totalFrames*88));
      if(f%2===0) await new Promise(r=>setTimeout(r,0));
    }
  }

  onLog("⏹ Завершаю запись…");onProgress(92);
  await new Promise(res=>{rec.onstop=res;rec.stop();});
  onProgress(98);onLog("📦 Упаковываю видео…");
  const blob=new Blob(chunks,{type:mimeType});
  onProgress(100);
  return { blob, mimeType };
}

// ─────────────────────────────────────────────────────────────────────────────
// COVER GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
async function generateCover(topic, theme, format) {
  const { w:W, h:H } = format;
  const canvas = document.createElement("canvas");
  canvas.width=W; canvas.height=H;
  const ctx = canvas.getContext("2d");

  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,theme.colors[0]);g.addColorStop(1,theme.colors[1]);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);

  // Decorative circle
  const glow=ctx.createRadialGradient(W/2,H*0.42,0,W/2,H*0.42,W*0.65);
  glow.addColorStop(0,theme.accent+"55");glow.addColorStop(1,"transparent");
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);

  // Grid
  ctx.strokeStyle="rgba(255,255,255,0.03)";ctx.lineWidth=1;
  for(let x=0;x<W;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  // Accent bar top
  ctx.fillStyle=theme.accent;ctx.fillRect(0,0,W,6);

  // "SHORTS" label
  ctx.fillStyle=theme.accent;
  ctx.font=`bold ${Math.round(W*0.044)}px Arial,sans-serif`;
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillText("▶ YOUTUBE SHORTS",W/2,H*0.14);

  // Main title
  ctx.fillStyle="#FFFFFF";ctx.shadowColor="rgba(0,0,0,0.8)";ctx.shadowBlur=20;
  const fs=topic.length>40?Math.round(W*0.072):Math.round(W*0.092);
  ctx.font=`bold ${fs}px 'Arial Black',Arial,sans-serif`;
  wrapText(ctx,topic.toUpperCase(),W/2,H*0.48,W*0.82,fs*1.3);
  ctx.shadowBlur=0;

  // Bottom brand bar
  ctx.fillStyle="rgba(0,0,0,0.6)";roundRect(ctx,0,H*0.88,W,H*0.12,0);
  ctx.fillStyle="rgba(255,255,255,0.5)";
  ctx.font=`${Math.round(W*0.035)}px Arial,sans-serif`;
  ctx.fillText("Смотри полное видео →",W/2,H*0.944);

  return new Promise(res=>canvas.toBlob(blob=>res(URL.createObjectURL(blob)),"image/png"));
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PANEL (backend URL + status)
// ─────────────────────────────────────────────────────────────────────────────
function SettingsPanel({ backendUrl, setBackendUrl, backendOk, checkBackend }) {
  const [url, setUrl] = useState(backendUrl);
  return (
    <div className="card">
      <div className="card-title">⚙️ Настройки подключения</div>

      <div className="alert alert-info" style={{marginTop:0}}>
        <strong>Почему нужен бэкенд?</strong><br/>
        DALL-E (картинки), OpenAI TTS и FFmpeg требуют API-ключей, которые нельзя хранить в браузере — их увидит любой через DevTools. Бэкенд хранит ключи в <code>.env</code> и проксирует запросы. Без бэкенда работает генерация сценариев, Canvas-видео и загрузка своих картинок.
      </div>

      <label>URL бэкенда</label>
      <div style={{display:"flex",gap:8}}>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="http://localhost:4000" style={{flex:1}} />
        <button className="btn btn-secondary btn-sm" style={{width:"auto",flex:"0 0 auto"}}
          onClick={()=>{setBackendUrl(url);checkBackend(url);}}>
          Проверить
        </button>
      </div>

      <div className="api-status-row" style={{marginTop:10}}>
        <div className={`api-pill ${backendOk?"ok":"off"}`}>
          {backendOk?"✓":"✗"} Бэкенд {backendOk?"подключён":"не найден"}
        </div>
        <div className={`api-pill ${backendOk?"ok":"off"}`}>
          {backendOk?"✓":"✗"} DALL-E изображения
        </div>
        <div className={`api-pill ${backendOk?"ok":"off"}`}>
          {backendOk?"✓":"✗"} OpenAI TTS
        </div>
        <div className="api-pill ok">✓ Claude AI (встроен)</div>
        <div className="api-pill ok">✓ Canvas + WebM (браузер)</div>
      </div>

      <div className="alert alert-warn" style={{marginTop:12}}>
        <strong>Как запустить бэкенд локально:</strong><br/>
        1. Скачай <code>server.js</code> и <code>.env.example</code> из артефакта ниже<br/>
        2. <code>npm install</code> → <code>node server.js</code><br/>
        3. Вставь URL <code>http://localhost:4000</code> выше и нажми Проверить<br/>
        Или задеплой на <strong>Railway / Render</strong> за 3 минуты — бесплатно.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function VideoBuilder({ script, topic, backendUrl, backendOk }) {
  const [step, setStep]         = useState("scenes"); // scenes|edit|render|done
  const [scenes, setScenes]     = useState([]);
  const [selScene, setSelScene] = useState(null);
  const [theme, setTheme]       = useState(BG_THEMES[0]);
  const [format, setFormat]     = useState(FORMATS[0]);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [log, setLog]             = useState("");
  const [videoUrl, setVideoUrl]   = useState(null);
  const [videoMime, setVideoMime] = useState("video/webm");
  const [exportMode, setExportMode] = useState("browser"); // browser | mp4
  const [coverUrl, setCoverUrl]   = useState(null);
  const [genCoverLoading, setGenCoverLoading] = useState(false);
  const [parseLoading, setParseLoading]       = useState(false);
  const [imgLoading, setImgLoading]           = useState({});
  const [ttsLoading, setTtsLoading]           = useState({});
  const [subtitles, setSubtitles]             = useState([]); // [{start,end,text}]
  const audioCtxRef = useRef(null);

  // Derive subtitle list from scene durations
  useEffect(() => {
    let t=0; const subs=[];
    scenes.forEach(sc=>{
      subs.push({start:t,end:t+sc.duration,text:sc.subtitle||sc.text.slice(0,50)});
      t+=sc.duration;
    });
    setSubtitles(subs);
  },[scenes]);

  const getAudioCtx = () => {
    if(!audioCtxRef.current) audioCtxRef.current=new (window.AudioContext||window.webkitAudioContext)();
    return audioCtxRef.current;
  };

  // Parse scenes via AI
  const parseScenesAI = async () => {
    setParseLoading(true);
    try {
      const sys=`Разбей сценарий на 4-7 сцен для Shorts. Ответь ТОЛЬКО JSON без markdown:
[{"label":"ХУУК","text":"текст до 80 символов","subtitle":"субтитр до 50 символов","duration":3,"imagePrompt":"prompt for DALL-E in English, cinematic style"}]`;
      const raw=await callClaude(sys,`Сценарий:\n${script}\nВерни JSON.`);
      const clean=raw.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setScenes(parsed.map((s,i)=>({...s,id:i,imageUrl:null,audioUrl:null})));
      setStep("edit");
    } catch {
      const s=parseScenes(script);
      setScenes(s);
      setStep("edit");
    } finally { setParseLoading(false); }
  };

  // Generate image for one scene via backend
  const genImage = async (idx) => {
    if(!backendOk){alert("Подключи бэкенд для генерации изображений");return;}
    setImgLoading(l=>({...l,[idx]:true}));
    try {
      const sc=scenes[idx];
      const prompt=sc.imagePrompt || `${sc.text}, cinematic, vertical shot, 9:16, no text, photorealistic`;
      const url=await generateImage(backendUrl, prompt);
      updateScene(idx,{imageUrl:url});
    } catch(e){ alert("Ошибка генерации: "+e.message); }
    finally { setImgLoading(l=>({...l,[idx]:false})); }
  };

  // Generate all images
  const genAllImages = async () => {
    if(!backendOk){alert("Подключи бэкенд");return;}
    for(let i=0;i<scenes.length;i++) await genImage(i);
  };

  // TTS for one scene
  const genTTS = async (idx) => {
    if(!backendOk){alert("Подключи бэкенд для TTS");return;}
    setTtsLoading(l=>({...l,[idx]:true}));
    try {
      const sc=scenes[idx];
      const { audioUrl, durationSec }=await generateTTS(backendUrl, sc.text);
      updateScene(idx,{audioUrl, duration:Math.ceil(durationSec)+0.5});
    } catch(e){ alert("TTS ошибка: "+e.message); }
    finally { setTtsLoading(l=>({...l,[idx]:false})); }
  };

  // TTS all scenes
  const genAllTTS = async () => {
    for(let i=0;i<scenes.length;i++) await genTTS(i);
  };

  const updateScene=(idx,patch)=>setScenes(s=>s.map((sc,i)=>i===idx?{...sc,...patch}:sc));

  const handleImageUpload=(idx,file)=>{
    if(!file)return;
    const reader=new FileReader();
    reader.onload=e=>updateScene(idx,{imageUrl:e.target.result});
    reader.readAsDataURL(file);
  };

  const previewTTS=(text)=>{
    if(!window.speechSynthesis)return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);u.lang="ru-RU";u.rate=1.1;
    window.speechSynthesis.speak(u);
  };

  const doRender = async () => {
    setRendering(true);setProgress(0);setVideoUrl(null);setStep("done");
    try {
      if (exportMode === "mp4" && backendOk) {
        // Real MP4 via FFmpeg on the backend
        setProgress(20);
        const blob = await buildMp4ViaBackend(backendUrl, scenes, format, l=>setLog(l));
        setProgress(100);
        setVideoUrl(URL.createObjectURL(blob));
        setVideoMime("video/mp4");
        setLog("✅ MP4 готов!");
      } else {
        // Browser-side WebM via Canvas + MediaRecorder
        const audioCtx=scenes.some(s=>s.audioUrl)?getAudioCtx():null;
        const {blob,mimeType}=await renderVideoBlob(scenes,theme,format,p=>setProgress(p),l=>setLog(l),audioCtx);
        setVideoUrl(URL.createObjectURL(blob));setVideoMime(mimeType);setLog("✅ Видео готово!");
      }
    } catch(e){ setLog("❌ "+e.message); }
    finally { setRendering(false); }
  };

  const download=()=>{
    if(!videoUrl)return;
    const ext=videoMime.includes("mp4")?"mp4":"webm";
    const a=document.createElement("a");a.href=videoUrl;a.download=`short-${Date.now()}.${ext}`;a.click();
  };

  const doGenCover=async()=>{
    setGenCoverLoading(true);
    try{ const url=await generateCover(topic||"Shorts Video",theme,format); setCoverUrl(url); }
    catch(e){ alert("Ошибка обложки: "+e.message); }
    finally{ setGenCoverLoading(false); }
  };

  const downloadCover=()=>{
    if(!coverUrl)return;
    const a=document.createElement("a");a.href=coverUrl;a.download=`cover-${Date.now()}.png`;a.click();
  };

  // ── STEP INDICATOR ────────────────────────────────────────────────────────
  const STEPS=["scenes","edit","render","done"];
  const STEP_LABELS=["Разбивка","Редактор","Рендер","Готово"];

  return (
    <div className="card" style={{marginTop:14,borderColor:C.accent+"44"}}>
      <div className="card-title">🎬 Видео-редактор</div>

      <div className="step-indicator">
        {STEP_LABELS.map((l,i)=>{
          const sid=STEPS[i];
          const cur=STEPS.indexOf(step);
          return <div key={l} className={`step-item ${i===cur?"active":i<cur?"done":""}`}>{i<cur?"✓ ":""}{l}</div>;
        })}
      </div>

      {/* ── STEP 1: Parse ── */}
      {step==="scenes"&&(
        <>
          <div className="alert alert-info" style={{marginTop:0}}>AI разобьёт сценарий на 4–7 сцен и создаст DALL-E промпты для каждой картинки.</div>
          <button className="btn btn-primary" onClick={parseScenesAI} disabled={parseLoading}>
            {parseLoading?<><div className="spinner"/>Анализирую сценарий…</>:"🔪 Разбить на сцены"}
          </button>
        </>
      )}

      {/* ── STEP 2: Edit ── */}
      {step==="edit"&&scenes.length>0&&(
        <>
          {/* Format selector */}
          <label>Формат видео</label>
          <div className="format-row">
            {FORMATS.map(f=>(
              <div key={f.id} className={`format-btn ${format.id===f.id?"active":""}`} onClick={()=>setFormat(f)}>
                <span className="format-ratio">{f.icon}</span>
                <strong>{f.ratio}</strong><br/><span style={{fontSize:10}}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Theme */}
          <label>Фоновая тема (если нет картинок)</label>
          <div className="bg-picker">
            {BG_THEMES.map(t=>(
              <div key={t.name} title={t.name}
                className={`bg-swatch ${theme.name===t.name?"active":""}`}
                style={{background:`linear-gradient(135deg,${t.colors[0]},${t.colors[1]})`}}
                onClick={()=>setTheme(t)}/>
            ))}
          </div>

          {/* Batch actions */}
          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            <button className="btn btn-secondary btn-sm"
              onClick={genAllImages} disabled={!backendOk||Object.values(imgLoading).some(Boolean)}
              title={backendOk?"":"Нужен бэкенд"}>
              {Object.values(imgLoading).some(Boolean)?<><div className="spinner" style={{width:13,height:13}}/>…</>:"🖼 Все картинки (AI)"}
            </button>
            <button className="btn btn-secondary btn-sm"
              onClick={genAllTTS} disabled={!backendOk||Object.values(ttsLoading).some(Boolean)}
              title={backendOk?"":"Нужен бэкенд"}>
              {Object.values(ttsLoading).some(Boolean)?<><div className="spinner" style={{width:13,height:13}}/>…</>:"🎙 Вся озвучка (AI)"}
            </button>
            {!backendOk&&<span style={{fontSize:11,color:C.warn,alignSelf:"center"}}>⚠ AI-функции требуют бэкенда</span>}
          </div>

          {/* Scene grid */}
          <div className="scenes-grid">
            {scenes.map((sc,i)=>(
              <div key={sc.id} className={`scene-card ${selScene===i?"sel":""}`} onClick={()=>setSelScene(selScene===i?null:i)}>
                {sc.imageUrl
                  ? <img src={sc.imageUrl} className="scene-thumb" style={{aspectRatio:format.id==="16:9"?"16/9":"9/16"}} alt="scene"/>
                  : <div className="scene-thumb-placeholder" style={{aspectRatio:format.id==="16:9"?"16/9":"9/16"}}>🖼</div>
                }
                <div className="scene-dur-badge">{sc.duration}с</div>
                <div className="scene-info">
                  <div className="scene-label-pill">{sc.label}</div>
                  <div className="scene-text-preview">{sc.text}</div>
                  {sc.audioUrl&&<div style={{fontSize:9,color:C.success,marginTop:2}}>🎙 озвучка</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Scene editor (expanded) */}
          {selScene!==null&&scenes[selScene]&&(()=>{
            const sc=scenes[selScene];const idx=selScene;
            return(
              <div className="scene-editor">
                <div className="scene-editor-title">Редактор — {sc.label}</div>

                <label>Текст на экране</label>
                <textarea rows={2} value={sc.text} onChange={e=>updateScene(idx,{text:e.target.value})}/>

                <label>Субтитр (нижняя плашка)</label>
                <input value={sc.subtitle} onChange={e=>updateScene(idx,{subtitle:e.target.value})}/>

                <label>Длительность (сек)</label>
                <input type="number" min={2} max={15} value={sc.duration} onChange={e=>updateScene(idx,{duration:+e.target.value})}/>

                <label>Картинка</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>genImage(idx)}
                    disabled={!backendOk||imgLoading[idx]}>
                    {imgLoading[idx]?<><div className="spinner" style={{width:13,height:13}}/>AI…</>:"✨ AI-картинка"}
                  </button>
                  <div className="upload-zone" style={{flex:1,padding:"8px 12px",marginTop:0}}>
                    <input type="file" accept="image/*" onChange={e=>handleImageUpload(idx,e.target.files[0])}/>
                    <span className="upload-zone-text" style={{fontSize:12}}>📁 Загрузить свою</span>
                  </div>
                </div>
                {sc.imageUrl&&<img src={sc.imageUrl} className="img-preview" alt="bg"/>}

                <label>DALL-E промпт (для AI-картинки)</label>
                <input value={sc.imagePrompt} onChange={e=>updateScene(idx,{imagePrompt:e.target.value})}
                  placeholder="cinematic vertical shot, dark mood..."/>

                <label>Озвучка</label>
                <div className="tts-controls">
                  <button className="btn btn-secondary btn-sm" onClick={()=>genTTS(idx)}
                    disabled={!backendOk||ttsLoading[idx]}>
                    {ttsLoading[idx]?<><div className="spinner" style={{width:13,height:13}}/>…</>:"🎙 AI TTS"}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>previewTTS(sc.text)}>
                    🔊 Браузер
                  </button>
                  {sc.audioUrl
                    ?<span className="tts-badge tts-badge-ok">✓ Аудио готово</span>
                    :<span className="tts-badge tts-badge-warn">нет аудио</span>
                  }
                </div>
                {sc.audioUrl&&<audio src={sc.audioUrl} controls style={{width:"100%",marginTop:8,borderRadius:8}}/>}
              </div>
            );
          })()}

          {/* Subtitle timeline preview */}
          {subtitles.length>0&&(
            <>
              <label style={{marginTop:14}}>Тайминги субтитров</label>
              <div className="sub-timeline">
                {subtitles.map((s,i)=>(
                  <div key={i} className="sub-row">
                    <div className="sub-time">{s.start.toFixed(1)}с → {s.end.toFixed(1)}с</div>
                    <div className="sub-text">{s.text}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Cover + Render buttons */}
          <button className="btn btn-purple" onClick={doGenCover} disabled={genCoverLoading} style={{marginTop:14}}>
            {genCoverLoading?<><div className="spinner"/>Генерирую обложку…</>:"🖼 Сгенерировать обложку"}
          </button>
          {coverUrl&&(
            <div>
              <div className="cover-wrap"><img src={coverUrl} className="cover-img" alt="cover"/></div>
              <button className="btn btn-secondary" onClick={downloadCover}>⬇️ Скачать обложку PNG</button>
            </div>
          )}

          <label style={{marginTop:14}}>Формат экспорта</label>
          <div className="format-row">
            <div className={`format-btn ${exportMode==="browser"?"active":""}`} onClick={()=>setExportMode("browser")}>
              <span className="format-ratio">⚡</span><strong>WebM</strong><br/>
              <span style={{fontSize:10}}>в браузере, быстро</span>
            </div>
            <div className={`format-btn ${exportMode==="mp4"?"active":""}`}
              onClick={()=>backendOk?setExportMode("mp4"):alert("Подключи бэкенд для MP4")}
              style={{opacity:backendOk?1:0.5}}>
              <span className="format-ratio">🎬</span><strong>MP4</strong><br/>
              <span style={{fontSize:10}}>{backendOk?"FFmpeg на сервере":"нужен бэкенд"}</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{marginTop:10}} onClick={doRender}>
            {exportMode==="mp4"?"🎥 Собрать MP4 (сервер)":"🎥 Собрать видео (браузер)"}
          </button>
          <button className="btn btn-secondary" style={{fontSize:12}} onClick={()=>setStep("scenes")}>← Пересобрать сцены</button>
        </>
      )}

      {/* ── STEP 3/4: Render + Done ── */}
      {step==="done"&&(
        <>
          {rendering&&(
            <>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
              <div className="render-log">{log}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:4}}>Рендер {progress}% · не закрывай вкладку</div>
            </>
          )}
          {videoUrl&&(
            <>
              <div className="alert alert-success">✅ Готово! Формат: {videoMime.includes("mp4")?"MP4":"WebM (совместим с YouTube)"}</div>
              <div className="video-wrap">
                <video className="video-el" src={videoUrl} controls playsInline loop
                  style={{aspectRatio:format.id==="9:16"?"9/16":format.id==="16:9"?"16/9":"1/1"}}/>
              </div>
              <button className="btn btn-green" onClick={download}>⬇️ Скачать видео</button>
              <button className="btn btn-secondary" style={{fontSize:12}} onClick={()=>{setStep("edit");setVideoUrl(null);}}>← Изменить</button>
            </>
          )}
          {!rendering&&!videoUrl&&(
            <div className="alert alert-error">Ошибка рендера. <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setStep("edit")}>Назад</span></div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCRIPT TAB
// ─────────────────────────────────────────────────────────────────────────────
function ScriptTab({ history, setHistory, backendUrl, backendOk }) {
  const [topic,setTopic]=useState(""); const [niche,setNiche]=useState("Технологии");
  const [tone,setTone]=useState("Энергичный"); const [dur,setDur]=useState("60 сек");
  const [hook,setHook]=useState(""); const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(""); const [error,setError]=useState("");
  const [showVideo,setShowVideo]=useState(false);

  const generate=async()=>{
    if(!topic.trim()){setError("Введи тему");return;}
    setError("");setLoading(true);setResult("");setShowVideo(false);
    try{
      const sys=`Ты — эксперт по вирусным YouTube Shorts. Только русский язык.
Структура строго по блокам:
ХУУК (первые 3 секунды): ...
ОСНОВНАЯ ЧАСТЬ: ...
КУЛЬМИНАЦИЯ: ...
ПРИЗЫВ К ДЕЙСТВИЮ: ...
СУБТИТРЫ (ключевые фразы): ...
Короткие предложения, разговорный стиль.`;
      const out=await callClaude(sys,`Тема: "${topic}"\nНиша: ${niche} | Тон: ${tone} | Длит: ${dur}${hook?`\nХук: "${hook}"`:""}`,1200);
      setResult(out);
      setHistory(h=>[{type:"Сценарий",topic,result:out,time:new Date().toLocaleTimeString()},...h.slice(0,19)]);
    }catch(e){setError("Ошибка: "+e.message);}
    finally{setLoading(false);}
  };

  return(
    <div>
      <div className="card">
        <div className="card-title">✍️ Сценарий для Shorts</div>
        <label>Тема видео</label>
        <textarea rows={2} placeholder="Например: 5 способов просыпаться без будильника"
          value={topic} onChange={e=>setTopic(e.target.value)} maxLength={200}/>
        <div className="char-count">{topic.length}/200</div>
        <label>Ниша</label>
        <div className="tag-row">{NICHES.map(n=><span key={n} className={`tag ${niche===n?"active":""}`} onClick={()=>setNiche(n)}>{n}</span>)}</div>
        <label>Тон</label>
        <div className="tag-row">{TONES.map(t=><span key={t} className={`tag ${tone===t?"active":""}`} onClick={()=>setTone(t)}>{t}</span>)}</div>
        <label>Длительность</label>
        <div className="tag-row">{DURATIONS.map(d=><span key={d} className={`tag ${dur===d?"active":""}`} onClick={()=>setDur(d)}>{d}</span>)}</div>
        <label>Хук (необязательно)</label>
        <input placeholder="Первая фраза" value={hook} onChange={e=>setHook(e.target.value)}/>
        {error&&<div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading?<><div className="spinner"/>Генерирую…</>:"⚡ Создать сценарий"}
        </button>
      </div>
      {result&&(
        <>
          <div className="result"><button className="copy-btn" onClick={()=>navigator.clipboard.writeText(result)}>Копировать</button>{result}</div>
          <button className="btn btn-primary" style={{background:"linear-gradient(135deg,#FF4D6D,#c026d3)",marginTop:10}}
            onClick={()=>setShowVideo(v=>!v)}>
            {showVideo?"✕ Скрыть редактор":"🎬 Создать видео"}
          </button>
          {showVideo&&<VideoBuilder script={result} topic={topic} backendUrl={backendUrl} backendOk={backendOk} key={result.slice(0,20)}/>}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OTHER TABS (Ideas / Plan / Subs / History) — compact
// ─────────────────────────────────────────────────────────────────────────────
function SimpleTab({title, genFn, fields, history, setHistory, histType}) {
  const state={}; const setters={};
  // (simplified — each tab implements inline)
  return null;
}

function IdeasTab({history,setHistory}){
  const [niche,setNiche]=useState("Технологии");const [count,setCount]=useState("10");
  const [trend,setTrend]=useState("");const [loading,setLoading]=useState(false);
  const [result,setResult]=useState("");const [error,setError]=useState("");
  const go=async()=>{
    setError("");setLoading(true);setResult("");
    try{
      const out=await callClaude(`Стратег YouTube Shorts. Для каждой идеи:\n🎯 ИДЕЯ:\n📌 ФОРМАТ:\n🔥 ПОЧЕМУ ЗАЙДЁТ:\n📝 ХУУК:\n---`,
        `${count} идей для Shorts в нише "${niche}".${trend?` Тренд: "${trend}"`:""}`,1200);
      setResult(out);setHistory(h=>[{type:"Идеи",topic:niche,result:out,time:new Date().toLocaleTimeString()},...h.slice(0,19)]);
    }catch(e){setError(e.message);}finally{setLoading(false);}
  };
  return(<div><div className="card">
    <div className="card-title">💡 Идеи</div>
    <label>Ниша</label><div className="tag-row">{NICHES.map(n=><span key={n} className={`tag ${niche===n?"active":""}`} onClick={()=>setNiche(n)}>{n}</span>)}</div>
    <label>Количество</label><select value={count} onChange={e=>setCount(e.target.value)}>{["5","10","15","20"].map(n=><option key={n}>{n}</option>)}</select>
    <label>Тренд (необязательно)</label><input placeholder="ИИ, ChatGPT…" value={trend} onChange={e=>setTrend(e.target.value)}/>
    {error&&<div className="alert alert-error">{error}</div>}
    <button className="btn btn-primary" onClick={go} disabled={loading}>{loading?<><div className="spinner"/>…</>:"💡 Генерировать"}</button>
  </div>{result&&<div className="result"><button className="copy-btn" onClick={()=>navigator.clipboard.writeText(result)}>Копировать</button>{result}</div>}</div>);
}

function PlanTab({history,setHistory}){
  const [niche,setNiche]=useState("Технологии");const [days,setDays]=useState("7");
  const [goal,setGoal]=useState("");const [loading,setLoading]=useState(false);
  const [result,setResult]=useState("");const [progress,setProgress]=useState(0);
  const go=async()=>{
    setLoading(true);setResult("");setProgress(30);
    try{
      setProgress(65);
      const out=await callClaude(`YouTube-стратег. Для каждого дня:\n📅 ДЕНЬ N\n🎬 ТЕМА:\n🎯 ФОРМАТ:\n⏱ ВРЕМЯ:\n🏷 ХЭШТЕГИ:\n---`,
        `План на ${days} дней для "${niche}".${goal?` Цель: "${goal}"`:""}`,1400);
      setProgress(100);setResult(out);
      setHistory(h=>[{type:"Контент-план",topic:`${niche}/${days}д`,result:out,time:new Date().toLocaleTimeString()},...h.slice(0,19)]);
    }catch{} finally{setLoading(false);setTimeout(()=>setProgress(0),900);}
  };
  return(<div><div className="card">
    <div className="card-title">📅 Контент-план</div>
    <label>Ниша</label><div className="tag-row">{NICHES.map(n=><span key={n} className={`tag ${niche===n?"active":""}`} onClick={()=>setNiche(n)}>{n}</span>)}</div>
    <label>Период</label><select value={days} onChange={e=>setDays(e.target.value)}>{["7","14","30"].map(n=><option key={n}>{n} дней</option>)}</select>
    <label>Цель</label><input placeholder="1000 подписчиков…" value={goal} onChange={e=>setGoal(e.target.value)}/>
    {loading&&<div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>}
    <button className="btn btn-primary" onClick={go} disabled={loading}>{loading?<><div className="spinner"/>…</>:"📅 Создать план"}</button>
  </div>{result&&<div className="result"><button className="copy-btn" onClick={()=>navigator.clipboard.writeText(result)}>Копировать</button>{result}</div>}</div>);
}

function SubsTab({history,setHistory}){
  const [text,setText]=useState("");const [dur,setDur]=useState("60 сек");
  const [style,setStyle]=useState("Динамичный");const [loading,setLoading]=useState(false);
  const [result,setResult]=useState("");const [error,setError]=useState("");
  const STYLES=["Динамичный","Минималистичный","Жирный акцент","Покадровый"];
  const go=async()=>{
    if(!text.trim()){setError("Вставь текст");return;}
    setError("");setLoading(true);setResult("");
    try{
      const out=await callClaude(`Субтитровщик Shorts. Формат:\n[00:00 - 00:03] текст\nКЛЮЧЕВЫЕ СЛОВА заглавными. Стиль: ${style}.`,
        `Субтитры для Shorts (${dur}):\n\n${text}`);
      setResult(out);setHistory(h=>[{type:"Субтитры",topic:text.slice(0,40)+"…",result:out,time:new Date().toLocaleTimeString()},...h.slice(0,19)]);
    }catch(e){setError(e.message);}finally{setLoading(false);}
  };
  return(<div><div className="card">
    <div className="card-title">💬 Субтитры</div>
    <label>Текст сценария</label><textarea rows={5} placeholder="Вставь сценарий…" value={text} onChange={e=>setText(e.target.value)}/>
    <div className="char-count">{text.length} симв.</div>
    <label>Длительность</label><div className="tag-row">{DURATIONS.map(d=><span key={d} className={`tag ${dur===d?"active":""}`} onClick={()=>setDur(d)}>{d}</span>)}</div>
    <label>Стиль</label><div className="tag-row">{STYLES.map(s=><span key={s} className={`tag ${style===s?"active":""}`} onClick={()=>setStyle(s)}>{s}</span>)}</div>
    {error&&<div className="alert alert-error">{error}</div>}
    <button className="btn btn-primary" onClick={go} disabled={loading}>{loading?<><div className="spinner"/>…</>:"💬 Создать субтитры"}</button>
  </div>{result&&<div className="result"><button className="copy-btn" onClick={()=>navigator.clipboard.writeText(result)}>Копировать</button>{result}</div>}</div>);
}

function HistoryTab({history,setHistory}){
  const [sel,setSel]=useState(null);
  if(!history.length) return(<div className="card"><div className="empty"><div className="empty-icon">📂</div>История пуста</div></div>);
  if(sel!==null){
    const item=history[sel];
    return(<div>
      <button className="btn btn-secondary" onClick={()=>setSel(null)} style={{marginTop:0}}>← Назад</button>
      <div className="card" style={{marginTop:12}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div className="card-title">{item.type} — {item.topic}</div><span style={{fontSize:10,color:C.muted}}>{item.time}</span></div>
        <div className="result"><button className="copy-btn" onClick={()=>navigator.clipboard.writeText(item.result)}>Копировать</button>{item.result}</div>
      </div>
    </div>);
  }
  return(<div className="card">
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
      <div className="card-title" style={{marginBottom:0}}>История</div>
      <button onClick={()=>setHistory([])} style={{fontSize:11,color:C.accent,background:"none",border:"none",cursor:"pointer"}}>Очистить</button>
    </div>
    {history.map((item,i)=>(<div key={i} className="history-item" onClick={()=>setSel(i)}>
      <div className="history-meta">{item.type} · {item.time}</div>
      <div className="history-preview">{item.topic}</div>
    </div>))}
  </div>);
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
const TABS=[
  {id:"script",  label:"✍️ Сценарий"},
  {id:"ideas",   label:"💡 Идеи"},
  {id:"plan",    label:"📅 План"},
  {id:"subs",    label:"💬 Субтитры"},
  {id:"settings",label:"⚙️ API"},
  {id:"history", label:"📂 История"},
];

export default function App() {
  const [tab,setTab]=useState("script");
  const [history,setHistory]=useState([]);
  const [backendUrl,setBackendUrl]=useState("http://localhost:4000");
  const [backendOk,setBackendOk]=useState(false);

  const checkBackend=useCallback(async(url)=>{
    const target=url||backendUrl;
    const ok=await pingBackend(target);
    setBackendOk(ok);
    GLOBAL_BACKEND={ url:target, ok };
  },[backendUrl]);

  useEffect(()=>{checkBackend(backendUrl);},[]);

  const render=()=>{
    switch(tab){
      case "script":   return <ScriptTab   history={history} setHistory={setHistory} backendUrl={backendUrl} backendOk={backendOk}/>;
      case "ideas":    return <IdeasTab    history={history} setHistory={setHistory}/>;
      case "plan":     return <PlanTab     history={history} setHistory={setHistory}/>;
      case "subs":     return <SubsTab     history={history} setHistory={setHistory}/>;
      case "settings": return <SettingsPanel backendUrl={backendUrl} setBackendUrl={setBackendUrl} backendOk={backendOk} checkBackend={checkBackend}/>;
      case "history":  return <HistoryTab  history={history} setHistory={setHistory}/>;
      default: return null;
    }
  };

  return(
    <>
      <style>{css}</style>
      <div className="app">
        <div className="logo">
          <div className="logo-dot"/>
          <div>
            <div>Shorts Studio</div>
            <div className="logo-sub">
              AI · {backendOk
                ?<span style={{color:C.success}}>бэкенд ✓ DALL-E + TTS</span>
                :<span style={{color:C.muted}}>только браузер</span>}
            </div>
          </div>
        </div>
        <div className="tabs">{TABS.map(t=><button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
        {render()}
      </div>
    </>
  );
}
