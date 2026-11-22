const Cards={q:null,flip:false,IV:[0,1,3,7,14,30],
 due(s,t){const T=App.today();return App.pool(s,t).filter(q=>{const c=App.state.cards[q.id];return !c||c.due<=T})},
 render(el){if(!this.q)return this.pick(el);this.q.length?this.show(el):this.finished(el)},
 pick(el){
  const subj=['<option value="ALL">All subjects</option>',...Object.keys(CATALOG).map(k=>`<option value="${k}">${k} — ${App.esc(App.SUBJ[k].name)}</option>`)].join('');
  el.innerHTML=App.head('Recall & retain','Flashcards','Spaced repetition keeps what you learn. Review what is due today.')+`
  <div class="wrap split"><section class="card set"><div class="row between"><h2>Choose a deck</h2><span class="step">01 / SELECT</span></div>
   <div class="two"><label>Subject<select id="fs">${subj}</select></label><label>Subtopic<select id="ft"></select></label></div>
   <p class="hint">Cards you know come back after 1, 3, 7, 14 and 30 days. Cards you miss return in this session.</p></section>
  <div class="aside"><div class="dark"><div class="row between"><h2>Your review queue</h2><span class="arrow">↗</span></div>
   <div><div class="big" id="dn">0</div><div class="dsub">cards due</div></div>
   <div class="drows"><div>Subject<b id="ds"></b></div><div>Subtopic<b id="dt"></b></div><div>Mastered<b id="dm"></b></div></div>
   <button class="btn block" id="fg"><span>Start review</span><span style="font-size:19px">→</span></button></div>
   <div class="tip"><span class="eyebrow">Little and often</span><h3>Short reviews beat long cram sessions.</h3><p>Ten minutes a day keeps your memory fresh.</p></div></div></div>`;
  const $=i=>el.querySelector('#'+i);
  const upd=()=>{const n=this.due($('fs').value,$('ft').value).length;$('dn').textContent=n;$('fg').disabled=!n;
   $('ds').textContent=$('fs').value==='ALL'?'All subjects':App.SUBJ[$('fs').value].name;$('dt').textContent=$('ft').selectedOptions[0].textContent;
   $('dm').textContent=Object.values(App.state.cards).filter(c=>c.box>=4).length+' cards'};
  const fill=()=>{$('ft').innerHTML=App.subOpts($('fs').value);upd()};
  fill();$('fs').onchange=fill;$('ft').onchange=upd;
  $('fg').onclick=()=>{this.q=App.shuffle(this.due($('fs').value,$('ft').value));this.flip=false;App.render()};
 },
 show(el){
  const q=this.q[0];
  el.innerHTML=`<div class="narrow"><div class="row between"><span class="eyebrow">Flashcards</span><span class="pill">${this.q.length} left</span></div>
  <div class="fc ${this.flip?'flip':''}" id="fc"><div class="fc-in"><div class="face"><span class="tag">${App.esc(q.subtopic)}</span><p class="qtext">${q.question}</p>${Object.entries(q.choices).map(([k,v])=>`<div class="opt" style="cursor:inherit"><span class="let">${k}</span><span>${v}</span></div>`).join('')}<p class="sm mute" style="margin-top:14px">Tap the card to reveal the answer</p></div>
  <div class="face back"><span class="eyebrow">Answer</span><p class="qtext"><b>${q.answer}. ${q.choices[q.answer]}</b></p>${q.solution?`<div class="sol" style="background:#fff">${q.solution}</div>`:'<p class="sm mute">No solution added yet.</p>'}</div></div></div>
  <div class="row" id="rt" style="visibility:${this.flip?'visible':'hidden'};justify-content:center"><button class="btn bad" data-r="0">Again</button><button class="btn" data-r="1">Good</button><button class="btn ok" data-r="2">Easy</button></div>
  <p class="sm mute" style="text-align:center;margin-top:16px"><a class="link" href="#/flashcards" id="bk" style="color:var(--mute)">← Back to decks</a></p></div>`;
  el.querySelector('#fc').onclick=()=>{this.flip=!this.flip;el.querySelector('#fc').classList.toggle('flip',this.flip);el.querySelector('#rt').style.visibility=this.flip?'visible':'hidden'};
  el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>this.rate(+b.dataset.r));
  el.querySelector('#bk').onclick=e=>{e.preventDefault();this.q=null;App.render()};
 },
 rate(r){
  const q=this.q.shift(),c=App.state.cards[q.id]||{box:0};
  if(r===0){c.box=0;c.due=App.today();this.q.push(q)}
  else{c.box=Math.min(5,c.box+r);const d=new Date();d.setDate(d.getDate()+this.IV[c.box]);c.due=App.ymd(d)}
  App.state.cards[q.id]=c;App.mark();App.save();this.flip=false;App.render();
 },
 finished(el){el.innerHTML=`<div class="narrow"><div class="dark" style="text-align:center;justify-items:center;padding:48px"><div class="big">🎉</div><h2>All caught up</h2><p class="dsub">No more due cards in this deck.</p><button class="btn" id="b">Back to decks</button></div></div>`;el.querySelector('#b').onclick=()=>{this.q=null;App.render()}}
};
App.views.flashcards=el=>Cards.render(el);
