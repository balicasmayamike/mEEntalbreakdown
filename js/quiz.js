const Quiz={s:null,tm:null,
 render(el){if(!this.s)return this.setup(el);this.s.done?this.review(el):this.run(el)},
 setup(el){
  const pre=App.pre||{};App.pre=null;let mode=pre.mode||'sub';const I=App.I;
  const CNT=[5,10,15,20,25,30,50,75,100],TIM=[0,10,15,20,30,45,60,90,120,180];
  const subj=Object.keys(CATALOG).map(k=>`<option value="${k}">${k} — ${App.esc(App.SUBJ[k].name)}</option>`).join('');
  el.innerHTML=App.head('Practice with purpose','Quiz & Mock Board Exam','Focus on a subtopic or put your knowledge to the test. Make this session yours.')+`
  <div class="wrap split"><section class="card set">
   <div class="row between"><h2>Set up your session</h2><span class="step">01 / CONFIGURE</span></div>
   <div class="grp" style="gap:12px"><span class="lbl">Mode</span><div class="modes">
    <button class="mode" data-m="sub"><span class="row between" style="flex-wrap:nowrap"><b>Subtopic Quiz</b><i class="radio"></i></span><span>Focus on what you want to learn.</span></button>
    <button class="mode" data-m="mock"><span class="row between" style="flex-wrap:nowrap"><b>Mock Board Exam</b><i class="radio"></i></span><span>Practice in an exam-style session.</span></button></div></div>
   <hr><div class="grp" id="foc"><div><h3>Choose your focus</h3><p class="sub">Start broad or narrow down to a specific topic.</p></div>
    <div class="two"><label>Subject<select id="qs">${subj}</select></label><label>Subtopic<select id="qt"></select></label></div></div>
   <hr><div class="grp"><div><h3>Make it fit your time</h3><p class="sub">Choose a quick practice round or a longer challenge.</p></div><div class="two">
    <label>Number of questions<select id="qn"></select><small id="mx"></small></label>
    <label>Timer in minutes<select id="qd">${TIM.map(x=>`<option value="${x}">${x?x+' minutes':'No timer'}</option>`).join('')}</select><small>Pick a time limit, or none to go at your own pace.</small></label></div></div>
   <div class="note">${I.spark}<span>Build a session that works for you. You can always start again with a different focus.</span></div></section>
  <div class="aside"><div class="dark"><div class="row between"><h2>Your next session</h2><span class="arrow">↗</span></div>
   <div class="dgl"><div><div class="big" id="sn">10</div><div class="dsub" style="font-size:13px">questions</div></div><div><div class="t" id="st">No timer</div><div class="dsub" id="sts">Go at your own pace</div></div></div>
   <div class="drows"><div>Mode<b id="sm"></b></div><div>Subject<b id="ss"></b></div><div>Subtopic<b id="sb"></b></div></div>
   <button class="btn block" id="go"><span>Start quiz</span><span style="font-size:19px">→</span></button>
   <p class="dsub" style="text-align:center;font-size:12px">Ready when you are. Let’s make progress.</p></div>
   <div class="tip"><span class="eyebrow">A little every day</span><h3>Lift and repeat.</h3><p>Small sessions. Stronger recall. Try a focused quiz, review what you learned, and come back for another round.</p></div></div></div>
  <div class="mbar-sp"></div><div class="mbar"><button class="btn block" id="go2"><span>Start quiz</span><span style="font-size:19px">→</span></button></div>`;
  const $=i=>el.querySelector('#'+i);
  if(pre.subject)$('qs').value=pre.subject;
  const fill=()=>{$('qt').innerHTML=App.subOpts($('qs').value)};
  const upd=reset=>{
   const m=mode==='mock',mx=m?App.maxFor('ALL','ALL'):App.maxFor($('qs').value,$('qt').value);
   const keep=+$('qn').value,list=CNT.filter(x=>x<mx).concat(mx);
   const want=reset||!list.includes(keep)?(m?30:10):keep,pick=list.filter(x=>x<=want).pop()||list[0];
   $('qn').innerHTML=mx?list.map(x=>`<option value="${x}"${x===pick?' selected':''}>${x} questions${x===mx?' (all)':''}</option>`).join(''):'<option value="0">No questions loaded</option>';
   $('mx').textContent='Up to '+mx+' available for this selection.';
   const n=+$('qn').value||0,d=+$('qd').value||0;
   el.querySelectorAll('.mode').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));
   $('qs').disabled=$('qt').disabled=m;$('foc').classList.toggle('off',m);
   $('sn').textContent=n;$('st').textContent=d?d+' min':'No timer';$('sts').textContent=d?'Auto-submits at zero':'Go at your own pace';
   $('sm').textContent=m?'Mock Board Exam':'Subtopic Quiz';$('ss').textContent=m?'All subjects':App.SUBJ[$('qs').value].name;
   $('sb').textContent=m?'All subtopics':$('qt').selectedOptions[0].textContent;
  };
  fill();upd(1);
  $('qs').onchange=()=>{fill();upd(1)};$('qt').onchange=()=>upd(1);$('qn').onchange=()=>upd(0);$('qd').onchange=()=>upd(0);
  el.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{mode=b.dataset.m;$('qd').value=mode==='mock'?'60':'0';upd(1)});
  $('go2').onclick=()=>$('go').click();
  $('go').onclick=()=>this.start(mode,$('qs').value,$('qt').value,+$('qn').value||10,+$('qd').value||0);
 },
 start(mode,s,t,n,min){
  const pool=App.shuffle(mode==='mock'?App.all():App.pool(s,t)).slice(0,n).map(x=>App.shuf(x));
  if(!pool.length)return alert('No questions loaded for this selection yet.');
  this.s={mode,sub:mode==='mock'?'MOCK':s,qs:pool,ans:{},i:0,done:false,end:min?Date.now()+min*6e4:null};
  clearInterval(this.tm);
  if(min)this.tm=setInterval(()=>{const r=this.s.end-Date.now(),e=document.getElementById('tm');
   if(r<=0)return this.finish();if(e)e.textContent=this.fmt(r)},500);
  App.render();
 },
 fmt(ms){const s=Math.max(0,Math.ceil(ms/1e3));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},
 run(el){
  const S=this.s,q=S.qs[S.i];
  el.innerHTML=`<div class="narrow"><div class="row between"><span class="eyebrow">Item ${S.i+1} of ${S.qs.length}</span>${S.end?`<span class="timer" id="tm">${this.fmt(S.end-Date.now())}</span>`:''}</div>
  <div class="bar"><i style="width:${(S.i+1)/S.qs.length*100}%"></i></div>
  <div class="card"><span class="tag">${q.subject} · ${App.esc(q.subtopic)}</span><p class="qtext">${q.question}</p>
  ${Object.entries(q.choices).map(([k,v])=>`<button class="opt ${S.ans[S.i]===k?'sel':''}" data-k="${k}"><span class="let">${k}</span><span>${v}</span></button>`).join('')}</div>
  <div class="row between navrow" style="margin-top:20px"><button class="btn ghost" id="pv" ${S.i?'':'disabled'}>← Previous</button>
  ${S.i<S.qs.length-1?'<button class="btn" id="nx">Next →</button>':'<button class="btn ok" id="fin">Submit</button>'}</div></div>`;
  el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{S.ans[S.i]=b.dataset.k;App.render()});
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
  el.innerHTML=App.head('Session complete','Your results','Review each answer below and learn from the solutions.')+`<div class="wrap split rev"><div class="stack">
  ${S.qs.map((q,i)=>`<div class="card"><span class="tag">${App.esc(q.subtopic)}</span><p class="qtext"><b>${i+1}.</b> ${q.question}</p>
  ${Object.entries(q.choices).map(([k,v])=>`<div class="opt ${k===q.answer?'right':k===S.ans[i]?'wrong':''}"><span class="let">${k}</span><span>${v}</span></div>`).join('')}
  <p class="sm mute" style="margin-top:12px">Your answer: ${S.ans[i]||'—'} · Correct: ${q.answer}</p>${q.solution?`<div class="sol">${q.solution}</div>`:''}</div>`).join('')}</div>
  <div class="aside"><div class="dark"><h2>Final score</h2><div><div class="big">${S.score}/${S.qs.length}</div><div class="dsub">${p}% correct</div></div><button class="btn block" id="nw"><span>New quiz</span><span>→</span></button></div></div></div>`;
  el.querySelector('#nw').onclick=()=>{this.s=null;App.render()};
 }
};
App.views.quiz=el=>Quiz.render(el);
