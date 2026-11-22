const App={
 key:'studyHubV1',state:{history:[],sessions:[],cards:{},days:[],examDate:''},views:{},
 load(){try{Object.assign(this.state,JSON.parse(localStorage.getItem(this.key))||{})}catch(e){}},
 save(){try{localStorage.setItem(this.key,JSON.stringify(this.state))}catch(e){}},
 all(){return Object.values(QB).flat()},
 pool(s,t){return this.all().filter(q=>(!s||s==='ALL'||q.subject===s)&&(!t||t==='ALL'||q.subtopic===t))},
 subtopics(s){return s&&s!=='ALL'?CATALOG[s].map(x=>x.name):Object.values(CATALOG).flat().map(x=>x.name)},
 maxFor(s,t){const n=this.pool(s,t).length;if(n)return n;const L=s&&s!=='ALL'?CATALOG[s]:Object.values(CATALOG).flat();
  return t&&t!=='ALL'?(L.find(x=>x.name===t)||{items:0}).items:L.reduce((k,x)=>k+x.items,0)},
 subOpts(s){const E=x=>x.replace(/&/g,'&amp;'),L=s&&s!=='ALL'?CATALOG[s]:Object.values(CATALOG).flat();
  return '<option value="ALL">All subtopics</option>'+L.map(x=>`<option value="${E(x.name)}">${E(x.name)}</option>`).join('')},
 check(){const names=new Set(this.subtopics()),ids=new Set(),bad=[];
  this.all().forEach(q=>{if(!names.has(q.subtopic))bad.push(q.id+': unknown subtopic "'+q.subtopic+'"');if(ids.has(q.id))bad.push('duplicate id '+q.id);ids.add(q.id)});
  if(bad.length)console.warn('Question bank issues:\n'+bad.join('\n'));return bad},
 today(){return this.ymd(new Date())},
 ymd(d){const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)},
 mark(){const t=this.today();if(!this.state.days.includes(t)){this.state.days.push(t);this.save()}},
 shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
 opts(a){return a.map(x=>`<option>${x}</option>`).join('')},
 math(el){try{renderMathInElement(el,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})}catch(e){}},
 render(){
  const r=location.hash.replace('#/','')||'home',el=document.getElementById('app');
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===r));
  (this.views[r]||this.views.home)(el);if(r==='home'||!r)this.countdown(el);this.math(el);if(this.last!==r){window.scrollTo(0,0);this.last=r}
 },
 init(){this.load();this.bad=this.check();window.addEventListener('hashchange',()=>this.render());this.render()}
};
App.SUBJ={MATH:{name:'Mathematics',desc:'Strengthen your mathematical foundations.',ico:'π',c:'#5559d8'},ESAS:{name:'Engineering Sciences & Applied Subjects',desc:'Connect the principles behind engineering.',ico:'∑',c:'#277665'},EE:{name:'Electrical Engineering',desc:'Build a deeper understanding of circuits.',ico:'↯',c:'#9b652d'}};
App.head=(e,t,l)=>`<div class="wrap head"><p class="eyebrow">${e}</p><h1>${t}</h1><p class="lead">${l}</p></div>`;
App.esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
App.views.home=el=>{
 const cards=Object.keys(App.SUBJ).map(k=>{const S=App.SUBJ[k],tot=CATALOG[k].reduce((n,x)=>n+x.items,0),ld=(QB[k]||[]).length,p=tot?Math.round(ld/tot*100):0;
  const bg={MATH:'#eeeffd',ESAS:'#e8f2ee',EE:'#f8efe2'}[k];
  return `<article class="subj" style="--c:${S.c}"><div class="subj-top"><span class="ico" style="background:${bg}">${S.ico}</span><span class="stag">${k}</span></div>
  <h3>${App.esc(S.name)}</h3><p class="desc">${S.desc}</p>
  <div><div class="loaded"><span>${ld} / ${tot} questions loaded</span><span>${p}%</span></div><div class="meter"><i style="width:${p}%"></i></div></div>
  <div class="subj-foot"><span>${CATALOG[k].length} subtopics</span><a class="link" href="#/quiz" data-subj="${k}">Start quiz →</a></div></article>`}).join('');
 el.innerHTML=`<div class="wrap hero"><div><p class="eyebrow">Your practice buddy</p><h1>A little practice.<br>A lot more confidence.</h1>
 <p class="lead">Subtopic quizzes, timed mock board exams, and spaced-repetition flashcards. Build your knowledge, one session at a time.</p>
 <div class="row"><a class="btn" href="#/quiz">Start a quiz &nbsp;→</a><a class="btn ghost" href="#/flashcards">Review flashcards</a></div></div>
 <div class="countdown" id="dd"></div></div>
 ${App.bad&&App.bad.length?`<div class="wrap"><div class="card" style="border-color:var(--bad);margin-bottom:24px"><b>Question bank issues</b><br>${App.bad.slice(0,8).map(App.esc).join('<br>')}</div></div>`:''}
 <section class="wrap"><div class="sec-h"><div><h2>What will you learn today?</h2><p>Choose a subject and make your next session count.</p></div><span class="pill">3 subjects</span></div><div class="cards3">${cards}</div></section>
 <section class="wrap"><h2 style="font-size:21px;font-weight:600;margin-bottom:18px">Find your study rhythm</h2><div class="methods">
 <a class="method" href="#/flashcards" style="background:#eeedf9"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="15" height="12" rx="2"/><path d="M6 4h14a1 1 0 0 1 1 1v11"/></svg><div><small>RECALL &amp; RETAIN</small><h3>Flashcards</h3><p>Make it stick with spaced-repetition reviews.</p><span class="link">Review flashcards &nbsp;→</span></div></a>
 <a class="method" href="#/quiz" data-mock style="background:#edf1f5"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg><div><small>PRACTICE UNDER PRESSURE</small><h3>Mock board exam</h3><p>Get exam-ready with a timed practice session.</p><span class="link">Take a mock exam &nbsp;→</span></div></a></div></section>`;
 el.querySelectorAll('[data-subj]').forEach(a=>a.onclick=()=>{App.pre={subject:a.dataset.subj}});
 el.querySelectorAll('[data-mock]').forEach(a=>a.onclick=()=>{App.pre={mode:'mock'}});
};
App.countdown=el=>{
 const box=el.querySelector('#dd');if(!box)return;const d=App.state.examDate,ed=App.editDate||!d;
 const top=`<div class="row between"><span class="d-h">Exam countdown</span><span class="arrow">↗</span></div>`;
 if(ed){box.innerHTML=top+`<p class="d-sub">${d?'Update your exam date.':'Set your target exam date to start the day count.'}</p><input type="date" id="ed" class="date-dark" value="${d||''}" min="${App.today()}"><div class="d-foot"><button id="es">Save date</button>${d?'<button class="dim" id="ec">Cancel</button>':''}</div>`;
  box.querySelector('#es').onclick=()=>{const v=box.querySelector('#ed').value;if(!v)return alert('Pick a date first.');App.state.examDate=v;App.editDate=false;App.save();App.countdown(el)};
  const c=box.querySelector('#ec');if(c)c.onclick=()=>{App.editDate=false;App.countdown(el)};return}
 const [y,m,dd]=d.split('-').map(Number),t=new Date(y,m-1,dd),n=new Date(),n0=new Date(n.getFullYear(),n.getMonth(),n.getDate()),k=Math.round((t-n0)/864e5);
 const num=k>0?`<b>${k}</b><span>${k===1?'day':'days'} to go</span>`:k===0?`<b style="font-size:48px">D-DAY</b><span>Good luck!</span>`:`<b>${-k}</b><span>${-k===1?'day':'days'} since exam</span>`;
 box.innerHTML=top+`<div class="d-num">${num}</div><p class="d-date">${t.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p><div class="d-foot"><button id="ec">Change date</button><button class="dim" id="ex2">Clear</button></div>`;
 box.querySelector('#ec').onclick=()=>{App.editDate=true;App.countdown(el)};
 box.querySelector('#ex2').onclick=()=>{App.state.examDate='';App.editDate=false;App.save();App.countdown(el)};
};
window.addEventListener('load',()=>App.init());
