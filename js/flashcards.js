const Cards={q:null,flip:false,IV:[0,1,3,7,14,30],
 due(s,t){const T=App.today();return App.pool(s,t).filter(q=>{const c=App.state.cards[q.id];return !c||c.due<=T})},
 render(el){if(!this.q)return this.pick(el);this.q.length?this.show(el):this.finished(el)},
 pick(el){
  el.innerHTML=`<h1>Flashcards</h1><div class="card form"><p class="muted">Spaced repetition (Leitner boxes). Known cards return after longer gaps: 1, 3, 7, 14, 30 days.</p>
  <label>Subject<select id="fs">${App.opts(['ALL',...Object.keys(QB)])}</select></label><label>Subtopic<select id="ft"></select></label>
  <div id="fd" class="mono"></div><button class="btn" id="fg">Study due cards</button></div>`;
  const $=i=>el.querySelector('#'+i),upd=()=>{$('fd').textContent=Cards.due($('fs').value,$('ft').value).length+' cards due'};
  const fill=()=>{$('ft').innerHTML=App.opts(['ALL',...App.subtopics($('fs').value)]);upd()};
  fill();$('fs').onchange=fill;$('ft').onchange=upd;
  $('fg').onclick=()=>{this.q=App.shuffle(this.due($('fs').value,$('ft').value));this.flip=false;App.render()};
 },
 show(el){
  const q=this.q[0];
  el.innerHTML=`<div class="row between"><h1>Flashcards</h1><span class="mono">${this.q.length} left</span></div>
  <div class="fc ${this.flip?'flip':''}" id="fc"><div class="fc-in"><div class="face"><span class="tag">${q.subtopic}</span><p>${q.question}</p>${Object.entries(q.choices).map(([k,v])=>`<div><b>${k}.</b> ${v}</div>`).join('')}<p class="muted">Tap to flip</p></div>
  <div class="face back"><b>Answer: ${q.answer}. ${q.choices[q.answer]}</b>${q.solution?`<div class="sol">${q.solution}</div>`:''}</div></div></div>
  <div class="row" id="rt" style="margin-top:1rem;visibility:${this.flip?'visible':'hidden'}"><button class="btn bad" data-r="0">Again</button><button class="btn" data-r="1">Good</button><button class="btn ok" data-r="2">Easy</button></div>`;
  el.querySelector('#fc').onclick=()=>{this.flip=!this.flip;el.querySelector('#fc').classList.toggle('flip',this.flip);el.querySelector('#rt').style.visibility=this.flip?'visible':'hidden'};
  el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>this.rate(+b.dataset.r));
 },
 rate(r){
  const q=this.q.shift(),c=App.state.cards[q.id]||{box:0};
  if(r===0){c.box=0;c.due=App.today();this.q.push(q)}
  else{c.box=Math.min(5,c.box+r);const d=new Date();d.setDate(d.getDate()+this.IV[c.box]);c.due=App.ymd(d)}
  App.state.cards[q.id]=c;App.mark();App.save();this.flip=false;App.render();
 },
 finished(el){el.innerHTML=`<h1>Flashcards</h1><div class="card stat"><div class="big">🎉 Done</div><p class="muted">No more due cards in this deck.</p><button class="btn" id="b">Back to decks</button></div>`;el.querySelector('#b').onclick=()=>{this.q=null;App.render()}}
};
App.views.flashcards=el=>Cards.render(el);
