const App={
 key:'studyHubV1',state:{history:[],sessions:[],cards:{},days:[]},views:{},
 load(){try{Object.assign(this.state,JSON.parse(localStorage.getItem(this.key))||{})}catch(e){}},
 save(){try{localStorage.setItem(this.key,JSON.stringify(this.state))}catch(e){}},
 all(){return Object.values(QB).flat()},
 pool(s,t){return this.all().filter(q=>(!s||s==='ALL'||q.subject===s)&&(!t||t==='ALL'||q.subtopic===t))},
 subtopics(s){return [...new Set(this.pool(s).map(q=>q.subtopic))]},
 today(){return this.ymd(new Date())},
 ymd(d){const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)},
 mark(){const t=this.today();if(!this.state.days.includes(t)){this.state.days.push(t);this.save()}},
 shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
 opts(a){return a.map(x=>`<option>${x}</option>`).join('')},
 math(el){try{renderMathInElement(el,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})}catch(e){}},
 render(){
  const r=location.hash.replace('#/','')||'home',el=document.getElementById('app');
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===r));
  (this.views[r]||this.views.home)(el);this.math(el);if(this.last!==r){window.scrollTo(0,0);this.last=r}
 },
 init(){this.load();window.addEventListener('hashchange',()=>this.render());this.render()}
};
App.views.home=el=>{
 const subs={MATH:'Mathematics',ESAS:'Engineering Sciences & Allied Subjects',EE:'Electrical Engineering'};
 el.innerHTML=`<section class="hero"><h1>Board Exam Study Hub</h1><p>Subtopic quizzes, timed mock board exams, and spaced-repetition flashcards. Progress is saved in your browser.</p>
 <div class="row" style="justify-content:center"><a class="btn" href="#/quiz">Start a Quiz</a><a class="btn ghost" href="#/flashcards">Review Flashcards</a></div></section>
 <div class="grid">${Object.keys(subs).map(s=>`<div class="card"><h2>${s}</h2><p class="muted">${subs[s]}</p><span class="tag">${(QB[s]||[]).length} questions</span> <span class="tag">${App.subtopics(s).length} subtopics</span></div>`).join('')}</div>`;
};
window.addEventListener('load',()=>App.init());
