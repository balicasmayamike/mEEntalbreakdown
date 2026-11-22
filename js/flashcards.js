const Cards={q:null,flip:false,IV:[0,1,3,7,14,30],
 due(s,t){const T=App.today();return App.pool(s,t).filter(q=>{const c=App.state.cards[q.id];return !c||c.due<=T})},
 render(el){if(!this.q)return this.pick(el);this.q.length?this.show(el):this.finished(el)},
 pick(el){
  const I=App.I,subj=Object.keys(CATALOG).map(k=>`<option value="${k}">${k} — ${App.esc(App.SUBJ[k].name)}</option>`).join('');
  el.innerHTML=App.head('Recall & retain','Flashcards','Spaced repetition keeps what you learn. Review what is due today.')+`
  <div class="wrap split"><section class="card set"><div class="row between" style="align-items:flex-start"><div><h2>Choose a deck</h2><p class="sub" style="margin-top:6px">Find a topic to practise at your own pace.</p></div><span class="step">01 / Select</span></div>
   <div class="two"><label>Subject<select id="fs"><option value="">Select a subject</option><option value="ALL">All subjects</option>${subj}</select></label><label>Subtopic<select id="ft" disabled><option>Choose a subject first</option></select></label></div>
   <p class="hint">Cards you know come back after 1, 3, 7, 14 and 30 days. Cards you miss return in this session.</p>
   <div class="deck"><div><span class="eyebrow gray">Selected deck</span><h3 id="dkt">No deck selected yet</h3><p id="dkd">Choose a subject and subtopic to see available practice cards.</p></div><div class="deckn"><b id="dkn">—</b><small>practice cards</small></div></div></section>
  <div class="aside"><div class="dark"><div class="row between"><h2>Your review queue</h2><span class="arrow">${I.layers}</span></div>
   <div><div class="big" id="dn">—</div><div class="dsub" style="margin-top:6px">cards due</div></div><p class="dsub" id="dm">No study history is available yet. Select a deck to start a practice review.</p>
   <div class="drows"><div>Subject<b id="ds">Not selected</b></div><div>Subtopic<b id="dt">Not selected</b></div><div>Mastered<b id="dmm">—</b></div></div>
   <button class="btn block" id="fg" disabled><span>Start review</span><span style="font-size:19px">→</span></button></div>
   <div class="tip"><span class="eyebrow">Lift and repeat</span><h3>Short reviews beat long cram sessions.</h3><p>Pick a deck, test your recall, then reveal the answer. A few focused minutes can make the next review easier.</p></div></div></div>
  <div class="mbar-sp"></div><div class="mbar"><button class="btn block" id="fg2" disabled><span>Start review</span><span style="font-size:19px">→</span></button></div>`;
  const $=i=>el.querySelector('#'+i);
  const upd=()=>{
   const s=$('fs').value,t=$('ft').value;
   if(!s){$('ft').disabled=true;$('ft').innerHTML='<option>Choose a subject first</option>';
    $('dkt').textContent='No deck selected yet';$('dkd').textContent='Choose a subject and subtopic to see available practice cards.';$('dkn').textContent='—';
    $('dn').textContent='—';$('dm').textContent='No study history is available yet. Select a deck to start a practice review.';$('ds').textContent=$('dt').textContent='Not selected';$('dmm').textContent='—';
    $('fg').disabled=$('fg2').disabled=true;return}
   const pool=App.pool(s,t),n=this.due(s,t).length,ms=pool.filter(c=>(App.state.cards[c.id]||{}).box>=4).length;
   $('dkt').textContent=(s==='ALL'?'All subjects':s)+' — '+(t&&t!=='ALL'?t:'All subtopics');$('dkd').textContent=pool.length+' cards in this deck · '+n+' due today.';$('dkn').textContent=pool.length;
   $('dn').textContent=n;$('dm').textContent=n?n+' cards are ready for review.':'You are all caught up. Check back later.';
   $('ds').textContent=s==='ALL'?'All subjects':App.SUBJ[s].name;$('dt').textContent=t&&t!=='ALL'?t:'All subtopics';$('dmm').textContent=ms+' cards';
   $('fg').disabled=$('fg2').disabled=!n;
  };
  $('fs').onchange=()=>{const s=$('fs').value;
   if(!s||s==='ALL'){$('ft').innerHTML='<option value="ALL">All subtopics</option>';$('ft').disabled=true;if(!s)$('ft').innerHTML='<option>Choose a subject first</option>'}
   else{$('ft').innerHTML=App.subOpts(s);$('ft').disabled=false}upd()};
  $('ft').onchange=upd;
  $('fg2').onclick=()=>$('fg').click();
  $('fg').onclick=()=>{this.q=App.shuffle(this.due($('fs').value,$('ft').value)).map(x=>App.shuf(x));this.flip=false;App.render()};
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
