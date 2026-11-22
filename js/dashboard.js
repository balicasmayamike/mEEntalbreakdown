const Dash={tab:'overview',
 streak(){const D=new Set(App.state.days);let n=0,d=new Date();if(!D.has(App.ymd(d)))d.setDate(d.getDate()-1);
  while(D.has(App.ymd(d))){n++;d.setDate(d.getDate()-1)}return n},
 by(key){const m={};App.state.history.forEach(h=>{const k=h[key];(m[k]=m[k]||{n:0,ok:0}).n++;if(h.ok)m[k].ok++});return m},
 empty(ico,t,p,l,h){return `<div class="empty"><span class="eico">${ico}</span><div><b>${t}</b><p>${p}</p><a class="link" href="${h}">${l} →</a></div></div>`},
 render(el){
  const I=App.I,E=App.esc,H=App.state.history,tot=H.length,ok=H.filter(h=>h.ok).length,pct=tot?Math.round(ok/tot*100):0,S=App.state.sessions;
  const rows=Object.entries(this.by('t')).map(([t,v])=>({t,...v,p:Math.round(v.ok/v.n*100)})).sort((a,b)=>a.p-b.p);
  const subj=Object.entries(this.by('s')).map(([t,v])=>({t,...v,p:Math.round(v.ok/v.n*100)}));
  const weak=rows.filter(r=>r.n>=3&&r.p<70),mastered=Object.values(App.state.cards).filter(c=>c.box>=4).length;
  const badge=!tot?'Just getting started':pct>=70?'On track':'Keep going';
  const bar=r=>`<div><div class="row between" style="margin-bottom:8px;flex-wrap:nowrap"><span>${E(r.t)}</span><span class="num">${r.p}% · ${r.n}</span></div><div class="meter" style="--c:${r.p<70?'var(--bad)':'var(--ok)'}"><i style="width:${r.p}%"></i></div></div>`;
  const acc=`<div class="card"><div class="card-h"><div><h2>Accuracy by subtopic</h2><p class="sub">See where your knowledge is taking shape.</p></div><span class="badge">${rows.length} ${rows.length===1?'TOPIC':'TOPICS'}</span></div>
   ${rows.length?`<div class="bars">${(this.tab==='accuracy'?rows:rows.slice(0,8)).map(bar).join('')}</div>`:this.empty(I.chart,'No topic data yet','Take a quick quiz to see your accuracy by subtopic.','Start a quiz','#/quiz')}</div>`;
  const body=this.tab==='accuracy'
   ?`<div class="card"><div class="card-h"><div><h2>Accuracy by subject</h2><p class="sub">How each subject is going overall.</p></div></div>${subj.length?`<div class="bars">${subj.map(bar).join('')}</div>`:this.empty(I.chart,'No subject data yet','Finish a quiz and your subject accuracy will show up here.','Start a quiz','#/quiz')}</div>`+acc
   :acc+`<div class="card"><div class="card-h"><div><h2>Weak areas</h2><p class="sub">Topics with lower accuracy deserve another look.</p></div>${I.target}</div>
   ${weak.length?weak.map(r=>`<div class="line"><span>${E(r.t)}</span><b style="color:var(--bad)">${r.p}%</b></div>`).join(''):this.empty(I.target,'Nothing to focus on yet','After a few questions, your focus areas will appear here.','Try a practice quiz','#/quiz')}</div>
   <div class="card"><div class="card-h"><div><h2>Recent sessions</h2><p class="sub">Your latest practice, all in one place.</p></div>${I.history}</div>
   ${S.length?S.slice(-8).reverse().map(s=>`<div class="line"><span>${s.d} · ${E(s.sub)}</span><b>${s.score}/${s.total}</b></div>`).join(''):this.empty(I.clock,'Your first session starts here','Complete a quiz and your recent activity will show up here.','Start practicing','#/quiz')}</div>`;
  el.innerHTML=`<div class="wrap dhead"><div><p class="eyebrow">Your learning workspace</p><h1>Your dashboard</h1><p class="lead">See what you know, discover what needs work, and keep moving forward.</p></div><a class="btn" href="#/quiz">${I.play} Start a quiz</a></div>
  <div class="wrap split"><div class="stack">
   <div class="card over"><div class="card-h"><div><h2>Progress overview</h2><p class="sub">A clearer picture of your board prep, one session at a time.</p></div><span class="badge">${badge}</span></div>
    <div class="stats3"><div><b>${pct}%</b><span>Overall accuracy</span></div><div><b>${S.length}</b><span>Sessions completed</span></div><div><b>${tot}</b><span>Questions answered</span></div></div></div>
   <div class="tabs"><button data-t="overview" class="${this.tab==='overview'?'on':''}">Overview</button><button data-t="accuracy" class="${this.tab==='accuracy'?'on':''}">Accuracy</button></div>
   ${body}</div>
  <div class="aside"><div class="dark dprog"><span class="eyebrow">Your progress</span><div><div class="big">${pct}%</div><div class="dsub" style="margin-top:6px">overall accuracy (${ok} of ${tot} correct)</div></div>
   <div class="drows"><div>Day streak<b><span class="star">✦</span>${this.streak()}</b></div><div>Quizzes taken<b>${S.length}</b></div><div>Cards mastered<b>${mastered}</b></div></div></div>
  <div class="tip"><span class="eyebrow">Your data</span><h3>Back up your progress</h3><p>Copy your sessions as JSON, import a backup, or reset your practice history.</p>
   <div class="row" style="margin-top:8px"><button class="btn sm" id="ex">Export</button><label class="btn ghost sm" style="display:inline-flex;cursor:pointer">Import<input type="file" id="im" accept=".json" hidden></label><button class="btn ghost sm" id="rs" style="color:var(--bad)">Reset</button></div></div></div></div>`;
  el.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{this.tab=b.dataset.t;App.render()});
  el.querySelector('#ex').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(App.state,null,2)],{type:'application/json'}));a.download='master-the-boards-progress.json';a.click()};
  el.querySelector('#im').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.history))throw 0;App.state=Object.assign({history:[],sessions:[],cards:{},days:[],examDate:''},d);App.save();App.render()}catch(x){alert('Invalid progress file.')}};r.readAsText(f)};
  el.querySelector('#rs').onclick=()=>{if(confirm('Erase all progress?')){App.state={history:[],sessions:[],cards:{},days:[],examDate:App.state.examDate};App.save();App.render()}};
 }
};
App.views.dashboard=el=>Dash.render(el);
