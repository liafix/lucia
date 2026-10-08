(function(){
  'use strict';
  var e = React.createElement;
  var hearts=[
    {id:1,left:'8%',top:'12%'},{id:2,left:'68%',top:'10%'},{id:3,left:'42%',top:'39%'},{id:4,left:'13%',top:'68%'},{id:5,left:'73%',top:'69%'}
  ];
  var answer={
    coffee:'Ahoj, Dušan. Tú kávu môžeme skúsiť 🙂',
    accounting:'Ahoj, Dušan. Účtovnícky pokec beriem — ale tú kávu k tomu asi tiež 🙂',
    later:'Ahoj, Dušan. Ďakujem za pozvanie, ale zatiaľ by som to nechala tak.'
  };
  var endings={
    coffee:{eyebrow:'MISIA SPLNENÁ',title:'Tak toto má dobrú bilanciu.',body:'Budem rád, keď sa dohodneme normálne v správe. Žiadny tlak — len káva a pohodový rozhovor.'},
    accounting:{eyebrow:'ODBORNÁ SEKCIA ODOMKNUTÁ',title:'Účtovníctvo má zrazu lepší marketing.',body:'Môžeme začať odborným pokecom a zistiť, kam sa konverzácia prirodzene posunie. Káva je povolená.'},
    later:{eyebrow:'ÚPLNE V POHODE',title:'Ďakujem, že si si to pozrela.',body:'Žiadne presviedčanie ani druhé kolo. Aj „nie“ alebo „nie teraz“ je úplne férová odpoveď.'}
  };

  function Ambient(){
    var sparks=[];
    for(var i=0;i<18;i++) sparks.push(e('span',{className:'spark',key:i,style:{left:((i*37)%94+2)+'%',top:((i*53)%88+4)+'%',animationDelay:(i*.11)+'s'}}));
    return e('div',{className:'ambient','aria-hidden':'true'},e('div',{className:'orb o1'}),e('div',{className:'orb o2'}),e('div',{className:'orb o3'}),sparks);
  }
  function Step(p){return e('div',{className:'step'},e('span',null,'MALÁ MISIA'),e('i',null),e('span',null,p.n+'/5'));}
  function GalleryBackdrop(){return e('div',{className:'photo-backdrop','aria-hidden':'true'},e('img',{className:'photo-backdrop-a',src:'./photos/moment-01.webp',alt:''}),e('img',{className:'photo-backdrop-b',src:'./photos/moment-02.webp',alt:''}),e('div',{className:'photo-backdrop-shade'}));}

  function App(props){
    React.Component.call(this,props);
    this.state={scene:'intro',caught:[],choice:null,copied:false,burst:null};
    this.catchHeart=this.catchHeart.bind(this);
    this.choose=this.choose.bind(this);
    this.copyText=this.copyText.bind(this);
    this.restart=this.restart.bind(this);
  }
  App.prototype=Object.create(React.Component.prototype);
  App.prototype.constructor=App;
  App.prototype.catchHeart=function(id){
    if(this.state.caught.indexOf(id)>=0)return;
    this.setState({caught:this.state.caught.concat(id),burst:{id:id,token:Date.now()}});
    var self=this;
    window.setTimeout(function(){if(self.state.burst&&self.state.burst.id===id)self.setState({burst:null});},720);
  };
  App.prototype.choose=function(choice){this.setState({choice:choice,copied:false,scene:'ending'});};
  App.prototype.fallbackCopy=function(text){
    var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();
    try{document.execCommand('copy');this.setState({copied:true});}catch(err){}
    document.body.removeChild(ta);
  };
  App.prototype.copyText=function(){
    var self=this,choice=this.state.choice;if(!choice)return;var text=answer[choice];
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){self.setState({copied:true});}).catch(function(){self.fallbackCopy(text);});}
    else this.fallbackCopy(text);
  };
  App.prototype.restart=function(){this.setState({scene:'intro',caught:[],choice:null,copied:false,burst:null});};
  App.prototype.renderBurst=function(){
    var b=this.state.burst;if(!b)return null;var h=hearts.filter(function(x){return x.id===b.id;})[0];if(!h)return null;
    var dots=[];for(var i=0;i<8;i++)dots.push(e('span',{key:i,className:'burst-dot',style:{'--i':i}}));
    return e('div',{key:b.token,className:'heart-burst',style:{left:h.left,top:h.top},'aria-hidden':'true'},e('span',{className:'burst-ring'}),dots);
  };
  App.prototype.render=function(){
    var self=this,scene=this.state.scene,caught=this.state.caught,choice=this.state.choice,copied=this.state.copied,content;
    if(scene==='intro') content=e('section',{className:'card center scene'},
      e('div',{className:'hero-icon'},e('span',{className:'heart-glyph','aria-hidden':'true'},'♥')),
      e('p',{className:'eyebrow'},'Niečo malé a netradičné'),
      e('h1',{className:'title'},'Ahoj, Lucia.'),
      e('p',{className:'subtitle'},'Namiesto obyčajnej správy som pripravil krátku misiu. Zaberie asi minútu a na konci je jedna jednoduchá otázka.'),
      e('button',{className:'button primary hero-btn',onClick:function(){self.setState({scene:'gallery'});}},'Začať malú misiu',e('span',{'aria-hidden':'true'},'→')),
      e('p',{className:'note'},'Bez registrácie, bez trackingu, len malý digitálny experiment.')
    );
    else if(scene==='gallery') content=e('section',{className:'card center scene gallery-card'},e(Step,{n:1}),
      e('p',{className:'eyebrow'},'Malé vizuálne intermezzo'),
      e('h2',{className:'title compact-title'},'Trochu osobnejšie.'),
      e('p',{className:'subtitle compact-subtitle'},'Dve momentky, ktoré sem jednoducho pasujú. Potom už ideš rovno na misiu.'),
      e('div',{className:'photo-stage','aria-label':'Dve momentky'},
        e('figure',{className:'photo-card photo-card-main'},e('img',{src:'./photos/moment-01.webp',alt:'Momentka troch kamarátok pred zrkadlom',draggable:false}),e('figcaption',null,'moment 01')),
        e('figure',{className:'photo-card photo-card-strip'},e('img',{src:'./photos/moment-02.webp',alt:'Čiernobiela momentka dvoch kamarátok pri zrkadle',draggable:false}),e('figcaption',null,'moment 02')),
        e('div',{className:'photo-glow','aria-hidden':'true'})
      ),
      e('p',{className:'gallery-lead'},'Dobre. Teraz už tá malá misia.'),
      e('button',{className:'button primary',onClick:function(){self.setState({scene:'game'});}},'Pokračovať ',e('span',{'aria-hidden':'true'},'♥'))
    );
    else if(scene==='game') content=e('section',{className:'card scene'},e(Step,{n:2}),
      e('div',{className:'row'},e('div',null,e('p',{className:'eyebrow'},'Heart collector'),e('h2',{className:'section-title'},'Nájdi 5 srdiečok.')),e('div',{className:'counter','aria-live':'polite'},e('span',{className:'counter-pop',key:caught.length},caught.length+'/5'))),
      e('div',{className:'track'},e('div',{className:'fill',style:{width:(caught.length/5*100)+'%'}})),
      e('div',{className:'game'},e('div',{className:'hint'},'Klikni alebo ťukni na všetky žiariace srdiečka.'),
        hearts.filter(function(h){return caught.indexOf(h.id)<0;}).map(function(h){return e('button',{key:h.id,className:'heart-btn',style:{left:h.left,top:h.top},'aria-label':'Chytiť srdiečko '+h.id,onClick:function(){self.catchHeart(h.id);}},'♥');}),
        self.renderBurst(),
        caught.length===5?e('div',{className:'done'},e('div',null,e('div',{className:'check'},'✓'),e('h3',null,'5 z 5.'),e('p',null,'Misia splnená. Teraz prichádza odborná časť… približne.'),e('button',{className:'button primary',onClick:function(){self.setState({scene:'balance'});}},'Pokračovať →'))):null)
    );
    else if(scene==='balance') content=e('section',{className:'card center scene'},e(Step,{n:3}),
      e('div',{className:'hero-icon small-icon'},e('span',{className:'sparkle-glyph'},'✦')),
      e('p',{className:'eyebrow'},'Srdcová bilancia'),e('h2',{className:'title compact-title'},'Bilancia sedí.'),
      e('div',{className:'ledger'},[['Odvaha napísať','100 %'],['Počet pozvaní','1'],['Šanca na dobrú kávu','?']].map(function(r,i){return e('div',{className:'ledger-row ledger-enter',style:{animationDelay:(i*.09)+'s'},key:r[0]},e('span',null,r[0]),e('span',null,r[1]));})),
      e('p',{className:'subtitle compact-subtitle'},'Bilancia sedí. Zostáva jedna položka.'),
      e('button',{className:'button primary hero-btn',onClick:function(){self.setState({scene:'invite'});}},'Odomknúť otázku →')
    );
    else if(scene==='invite') content=e('section',{className:'card center scene'},e(Step,{n:4}),e('p',{className:'eyebrow'},'Jedna malá otázka'),
      e('h2',{className:'title invite-title'},'Lucia, pôjdeš so mnou niekedy na kávu?'),
      e('p',{className:'subtitle'},'A ak chceš bezpečnejší začiatok, pokojne môžeme začať účtovníckym pokecom.'),
      e('div',{className:'choices'},
        e('button',{className:'button primary choice',onClick:function(){self.choose('coffee');}},'☕  Káva & spoznávanie'),
        e('button',{className:'button secondary choice',onClick:function(){self.choose('accounting');}},'♡  Účtovnícky pokec'),
        e('button',{className:'button secondary choice later',onClick:function(){self.choose('later');}},'Možno inokedy')),
      e('p',{className:'note'},'Každá odpoveď je férová odpoveď.')
    );
    else {
      var end=endings[choice];
      content=e('section',{className:'card center scene'},e(Step,{n:5}),e('div',{className:'hero-icon ending-icon'},e('span',{className:'heart-glyph'},choice==='later'?'✦':'♥')),
        e('p',{className:'eyebrow'},end.eyebrow),e('h2',{className:'title ending-title'},end.title),e('p',{className:'subtitle'},end.body),
        e('div',{className:'copy'},e('div',{className:'copy-label'},'Pripravená odpoveď'),e('p',null,answer[choice]),e('button',{className:'button secondary copy-btn',onClick:this.copyText},copied?'✓ Skopírované':'▣ Skopírovať odpoveď')),
        e('button',{className:'restart',onClick:this.restart},'↻ Spustiť znova'));
    }
    return e('main',{className:'shell'},e(Ambient),scene==='gallery'?e(GalleryBackdrop):null,e('div',{className:'stage'},content));
  };

  var root=document.getElementById('root');
  if(ReactDOM.createRoot)ReactDOM.createRoot(root).render(e(App));
  else ReactDOM.render(e(App),root);
})();
