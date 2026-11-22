const Quiz={s:null,tm:null,
 render(el){if(!this.s)return this.setup(el);this.s.done?this.review(el):this.run(el)},
 setup(el){
  el.innerHTML=`<h1>Quiz & Mock Board Exam</h1><div class="card form">
  <label>Mode<select id="qm"><option value="sub">Subtopic Quiz</option><option value="mock">Mock Board Exam (all subjects)</option></select></label>
  <label id="ls">Subject<select id="qs">${App.opts(Object.keys(QB))}</select></label>
  <label id="lt">Subtopic<select id="qt"></select></label>
  <label>Number of questions<input type="number" id="qn" min="1" value="10"></label>
  <label>Timer in minutes (0 = none)<input type="number" id="qd" min="0" value="0"></label>
  <button class="btn" id="go">Start</button></div>`;
  const $=i=>el.querySelector('#'+i),fill=()=>{$('qt').innerHTML=App.opts(['ALL',...App.subtopics($('qs').value)])};
  fill();$('qs').onchange=fill;
  $('qm').onchange=()=>{const m=$('qm').value==='mock';$('ls').style.display=$('lt').style.display=m?'none':'';$('qn').value=m?30:10;$('qd').value=m?60:0};
  $('go').onclick=()=>this.start($('qm').value,$('qs').value,$('qt').value,+$('qn').value||10,+$('qd').value||0);
 },
 start(mode,s,t,n,min){
  const pool=App.shuffle(mode==='mock'?App.all():App.pool(s,t)).slice(0,n);
  if(!pool.length)return alert('No questions available.');
  this.s={mode,sub:mode==='mock'?'MOCK':s,qs:pool,ans:{},i:0,done:false,end:min?Date.now()+min*6e4:null};
  clearInterval(this.tm);
  if(min)this.tm=setInterval(()=>{const r=this.s.end-Date.now(),e=document.getElementById('tm');
   if(r<=0)return this.finish();if(e)e.textContent=this.fmt(r)},500);
  App.render();
 },
 fmt(ms){const s=Math.max(0,Math.ceil(ms/1e3));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},
 run(el){
  const S=this.s,q=S.qs[S.i];
  el.innerHTML=`<div class="row between"><span class="mono">Item ${S.i+1}/${S.qs.length}</span>${S.end?`<span class="timer" id="tm">${this.fmt(S.end-Date.now())}</span>`:''}</div>
  <div class="bar" style="margin:.6rem 0"><i style="width:${(S.i+1)/S.qs.length*100}%"></i></div>
  <div class="card"><span class="tag">${q.subject} · ${q.subtopic}</span><p>${q.question}</p>
  ${Object.entries(q.choices).map(([k,v])=>`<button class="choice ${S.ans[S.i]===k?'sel':''}" data-k="${k}"><b>${k}.</b> ${v}</button>`).join('')}</div>
  <div class="row between"><button class="btn ghost" id="pv" ${S.i?'':'disabled'}>Previous</button>
  ${S.i<S.qs.length-1?'<button class="btn" id="nx">Next</button>':'<button class="btn ok" id="fin">Submit</button>'}</div>`;
  el.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{S.ans[S.i]=b.dataset.k;App.render()});
  const g=i=>el.querySelector(i);
  if(g('#pv'))g('#pv').onclick=()=>{S.i--;App.render()};
  if(g('#nx'))g('#nx').onclick=()=>{S.i++;App.render()};
  if(g('#fin'))g('#fin').onclick=()=>{const un=S.qs.length-Object.keys(S.ans).length;if(!un||confirm(un+' unanswered. Submit anyway?'))this.finish()};
 },
 finish(){
  clearInterval(this.tm);const S=this.s;if(S.done)return;let sc=0;const d=App.today();
  S.qs.forEach((q,i)=>{const ok=S.ans[i]===q.answer;if(ok)sc++;App.state.history.push({id:q.id,s:q.subject,t:q.subtopic,ok,d})});
  S.score=sc;App.state.sessions.push({d,mode:S.mode,sub:S.sub,score:sc,total:S.qs.length});
  S.done=true;App.mark();App.save();App.render();
 },
 review(el){
  const S=this.s,p=Math.round(S.score/S.qs.length*100);
  el.innerHTML=`<h1>Results</h1><div class="card stat"><div class="big">${S.score}/${S.qs.length}</div><div class="mono muted">${p}%</div></div>
  ${S.qs.map((q,i)=>`<div class="card"><span class="tag">${q.subtopic}</span><p><b>${i+1}.</b> ${q.question}</p>
  ${Object.entries(q.choices).map(([k,v])=>`<div class="choice ${k===q.answer?'right':k===S.ans[i]?'wrong':''}"><b>${k}.</b> ${v}</div>`).join('')}
  <p class="muted">Your answer: ${S.ans[i]||'—'} · Correct: ${q.answer}</p>${q.solution?`<div class="sol">${q.solution}</div>`:''}</div>`).join('')}
  <button class="btn" id="nw">New Quiz</button>`;
  el.querySelector('#nw').onclick=()=>{this.s=null;App.render()};
 }
};
App.views.quiz=el=>Quiz.render(el);
