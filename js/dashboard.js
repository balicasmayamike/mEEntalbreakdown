const Dash={
 streak(){const D=new Set(App.state.days);let n=0,d=new Date();if(!D.has(App.ymd(d)))d.setDate(d.getDate()-1);
  while(D.has(App.ymd(d))){n++;d.setDate(d.getDate()-1)}return n},
 by(key){const m={};App.state.history.forEach(h=>{const k=h[key];(m[k]=m[k]||{n:0,ok:0}).n++;if(h.ok)m[k].ok++});return m},
 render(el){
  const H=App.state.history,tot=H.length,ok=H.filter(h=>h.ok).length,pct=tot?Math.round(ok/tot*100):0;
  const rows=Object.entries(this.by('t')).map(([t,v])=>({t,...v,p:Math.round(v.ok/v.n*100)})).sort((a,b)=>a.p-b.p);
  const weak=rows.filter(r=>r.n>=3&&r.p<70),mastered=Object.values(App.state.cards).filter(c=>c.box>=4).length;
  el.innerHTML=`<h1>Dashboard</h1><div class="grid">
  <div class="card stat"><div class="big">${pct}%</div><small>Overall accuracy (${ok}/${tot})</small></div>
  <div class="card stat"><div class="big">🔥 ${this.streak()}</div><small>Day streak</small></div>
  <div class="card stat"><div class="big">${App.state.sessions.length}</div><small>Quizzes taken</small></div>
  <div class="card stat"><div class="big">${mastered}</div><small>Cards mastered</small></div></div>
  <div class="card"><h2>Weak areas</h2>${weak.length?weak.map(r=>`<div class="row between"><span>${r.t}</span><span class="mono" style="color:var(--bad)">${r.p}%</span></div>`).join(''):'<p class="muted">None detected yet (needs 3+ answers in a subtopic with accuracy below 70%).</p>'}</div>
  <div class="card"><h2>Accuracy by subtopic</h2>${rows.length?rows.map(r=>`<div style="margin:.6rem 0"><div class="row between"><span>${r.t}</span><span class="mono">${r.p}% · ${r.n}</span></div><div class="bar ${r.p<70?'bad':'ok'}"><i style="width:${r.p}%"></i></div></div>`).join(''):'<p class="muted">Take a quiz to see stats.</p>'}</div>
  <div class="card"><h2>Recent sessions</h2>${App.state.sessions.slice(-8).reverse().map(s=>`<div class="row between"><span>${s.d} · ${s.sub}</span><span class="mono">${s.score}/${s.total}</span></div>`).join('')||'<p class="muted">No sessions yet.</p>'}</div>
  <div class="card"><h2>Data</h2><div class="row"><button class="btn" id="ex">Export JSON</button><label class="btn ghost" style="display:inline-block">Import JSON<input type="file" id="im" accept=".json" hidden></label><button class="btn bad" id="rs">Reset</button></div></div>`;
  el.querySelector('#ex').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(App.state,null,2)],{type:'application/json'}));a.download='study-hub-progress.json';a.click()};
  el.querySelector('#im').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.history))throw 0;App.state=Object.assign({history:[],sessions:[],cards:{},days:[]},d);App.save();App.render()}catch(x){alert('Invalid progress file.')}};r.readAsText(f)};
  el.querySelector('#rs').onclick=()=>{if(confirm('Erase all progress?')){App.state={history:[],sessions:[],cards:{},days:[]};App.save();App.render()}};
 }
};
App.views.dashboard=el=>Dash.render(el);
