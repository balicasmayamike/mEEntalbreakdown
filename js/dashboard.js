const Dash={
 streak(){const D=new Set(App.state.days);let n=0,d=new Date();if(!D.has(App.ymd(d)))d.setDate(d.getDate()-1);
  while(D.has(App.ymd(d))){n++;d.setDate(d.getDate()-1)}return n},
 by(key){const m={};App.state.history.forEach(h=>{const k=h[key];(m[k]=m[k]||{n:0,ok:0}).n++;if(h.ok)m[k].ok++});return m},
 render(el){
  const H=App.state.history,tot=H.length,ok=H.filter(h=>h.ok).length,pct=tot?Math.round(ok/tot*100):0;
  const rows=Object.entries(this.by('t')).map(([t,v])=>({t,...v,p:Math.round(v.ok/v.n*100)})).sort((a,b)=>a.p-b.p);
  const weak=rows.filter(r=>r.n>=3&&r.p<70),mastered=Object.values(App.state.cards).filter(c=>c.box>=4).length;
  const E=App.esc;
  el.innerHTML=App.head('Track your progress','Dashboard','See how you are doing and where to focus next.')+`<div class="wrap split rev"><div class="stack">
  <div class="card"><div class="row between" style="margin-bottom:18px"><h2>Accuracy by subtopic</h2><span class="step">${rows.length} ${rows.length===1?'TOPIC':'TOPICS'}</span></div>
   ${rows.length?`<div class="bars">${rows.map(r=>`<div><div class="row between" style="margin-bottom:8px"><span>${E(r.t)}</span><span class="num">${r.p}% · ${r.n}</span></div><div class="meter" style="--c:${r.p<70?'var(--bad)':'var(--ok)'}"><i style="width:${r.p}%"></i></div></div>`).join('')}</div>`:'<p class="mute">Take a quiz to see your accuracy here.</p>'}</div>
  <div class="card"><h2 style="margin-bottom:12px">Weak areas</h2>${weak.length?weak.map(r=>`<div class="line"><span>${E(r.t)}</span><b style="color:var(--bad)">${r.p}%</b></div>`).join(''):'<p class="mute sm">None detected yet. Topics appear here after 3+ answers with accuracy below 70%.</p>'}</div>
  <div class="card"><h2 style="margin-bottom:12px">Recent sessions</h2>${App.state.sessions.slice(-8).reverse().map(s=>`<div class="line"><span>${s.d} · ${E(s.sub)}</span><b>${s.score}/${s.total}</b></div>`).join('')||'<p class="mute sm">No sessions yet.</p>'}</div></div>
  <div class="aside"><div class="dark"><div class="row between"><h2>Your progress</h2><span class="arrow">↗</span></div>
   <div><div class="big">${pct}%</div><div class="dsub">overall accuracy (${ok} of ${tot})</div></div>
   <div class="drows"><div>Day streak<b>🔥 ${this.streak()}</b></div><div>Quizzes taken<b>${App.state.sessions.length}</b></div><div>Cards mastered<b>${mastered}</b></div></div></div>
  <div class="tip"><span class="eyebrow">Your data</span><h3>Back up your progress</h3><p>Everything is stored in this browser. Export it to keep a copy or move to another device.</p>
   <div class="row" style="margin-top:6px"><button class="btn sm" id="ex">Export</button><label class="btn ghost sm" style="display:inline-flex;cursor:pointer;font-weight:600">Import<input type="file" id="im" accept=".json" hidden></label><button class="btn ghost sm" id="rs" style="color:var(--bad)">Reset</button></div></div></div></div>`;
  el.querySelector('#ex').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(App.state,null,2)],{type:'application/json'}));a.download='master-the-boards-progress.json';a.click()};
  el.querySelector('#im').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.history))throw 0;App.state=Object.assign({history:[],sessions:[],cards:{},days:[],examDate:''},d);App.save();App.render()}catch(x){alert('Invalid progress file.')}};r.readAsText(f)};
  el.querySelector('#rs').onclick=()=>{if(confirm('Erase all progress?')){App.state={history:[],sessions:[],cards:{},days:[],examDate:App.state.examDate};App.save();App.render()}};
 }
};
App.views.dashboard=el=>Dash.render(el);
