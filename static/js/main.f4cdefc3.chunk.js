(this.webpackJsonppokedex=this.webpackJsonppokedex||[]).push([[0],{114:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(28),i=a.n(l),c=a(11),o=a.n(c),s=a(29),m=a(30),d=a(31),p=a(34),u=a(32),v=a(35),f=a(12),E=a.n(f),h=a(33),g=a(9),k=function(e){for(var t=e.split(/[ -]+/),a="",n=0;n<t.length;n++){var r=t[n];if("hp"===r)return"HP";a+="".concat(r.charAt(0).toUpperCase()).concat(r.slice(1)," ")}return a.slice(0,-1)},y=(a(4),function(){return r.a.createElement("div",{className:"mic-light-holder"},r.a.createElement("div",{className:"mic-light"}))}),b=function(e){var t=e.spriteUrl,a=e.spriteKey;return e.activeSprite?r.a.createElement("img",{alt:a,src:t}):null},N=function(e){var t=e.number,a=e.name,n="#".concat(t," ").concat(a);return r.a.createElement("div",{className:"number-display-wrapper"},r.a.createElement("div",{className:"number-display"},n))},w={normal:"#A8A878",fighting:"#C03028",flying:"#A890F0",poison:"#A040A0",ground:"#E0C068",rock:"#B8A038",bug:"#A8B820",ghost:"#705898",steel:"#B8B8D0",fire:"#F08030",water:"#6890F0",grass:"#78C850",electric:"#F8D030",psychic:"#F85888",ice:"#98D8D8",dragon:"#7038F8",dark:"#705848",fairy:"#EE99AC"},x=function(e){var t=e.type,a=w[t];return r.a.createElement("div",{className:"type-display",style:{backgroundColor:a}},t[0].toUpperCase()+t.slice(1))},C=function(e){var t=e.flavourText,a=e.statistics,n=e.heightWeight;switch(e.activeDisplay){case"flavourText":return r.a.createElement("div",{className:"secondary-display-wrapper"},t);case"statistics":return r.a.createElement("div",{className:"secondary-display-wrapper"},a.map((function(e){return r.a.createElement("div",{className:"statistic-wrapper",key:e.name},r.a.createElement("div",null,e.name),r.a.createElement("div",null,e.value))})));case"heightWeight":return r.a.createElement("div",{className:"secondary-display-wrapper"},r.a.createElement("div",{className:"height-weight-wrapper"},r.a.createElement("div",null,"Height"),r.a.createElement("div",null,"".concat(n.height/10,"m"))),r.a.createElement("div",{className:"height-weight-wrapper"},r.a.createElement("div",null,"Weight"),r.a.createElement("div",null,"".concat(n.weight/10,"kg"))));default:return null}},D=function(e){var t=e.upAction,a=e.rightAction,n=e.downAction,l=e.leftAction,i=function(){};return r.a.createElement("div",{className:"dpad-wrapper"},r.a.createElement("div",{role:"button",className:"dpad-btn dpad-up",onClick:t,onKeyDown:i,"aria-label":"Previous sprite",tabIndex:0}),r.a.createElement("div",{role:"button",className:"dpad-btn dpad-right",onClick:a,onKeyDown:i,"aria-label":"Next Pokemon",tabIndex:0}),r.a.createElement("div",{role:"button",className:"dpad-btn dpad-middle","aria-label":"No action"},r.a.createElement("div",{className:"dpad-middle-finger"})),r.a.createElement("div",{role:"button",className:"dpad-btn dpad-down",onClick:n,onKeyDown:i,"aria-label":"Next sprite",tabIndex:0}),r.a.createElement("div",{role:"button",className:"dpad-btn dpad-left",onClick:l,onKeyDown:i,"aria-label":"Previous Pokemon",tabIndex:0}))},S=function(e){var t=e.colour;return r.a.createElement("div",{className:"indicator-light ".concat(t)})},A=function(e){var t=e.screen,a=e.clickHandler;return r.a.createElement("div",{className:"grid-button",onClick:function(){a(t)},role:"button",tabIndex:0,"aria-label":"Grid button",onKeyDown:function(){}})},B=function(){return r.a.createElement("div",{className:"confirm-button"})},P=function(e){var t=e.colour,a=e.noMargin;return r.a.createElement("div",{className:"slim-button",style:{backgroundColor:t,marginRight:a?0:15}})};P.defaultProps={colour:"#2A2B26",noMargin:!1};var H=P,G=function(){return r.a.createElement("div",{className:"display-vent"})},T=function(){return r.a.createElement("div",{className:"power-button"})},R={0:"front_default",1:"back_default",2:"front_shiny",3:"back_shiny"},U=function(e){function t(){var e,a;Object(m.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(p.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={pokemonApiUrl:"https://pokeapi.co/api/v2/pokemon/",pokemonSpeciesUrl:"https://pokeapi.co/api/v2/pokemon-species/",cryUrl:"",pokedexNumber:151,pokemonData:[],pokemonSpeciesData:[],dataReady:!1,activeSprite:0,language:"en",version:"x",activeSecondaryDisplay:"flavourText",cache:{}},a.onNextPokemonClick=function(){var e=a.state.pokedexNumber+1;e>807||(a.setState({dataReady:!1,pokedexNumber:e,activeSecondaryDisplay:"flavourText"}),a.getData(e))},a.onPrevPokemonClick=function(){var e=a.state.pokedexNumber-1;e<1||(a.setState({dataReady:!1,pokedexNumber:e,activeSecondaryDisplay:"flavourText"}),a.getData(e))},a.onNextSpriteClick=function(){var e=a.state.activeSprite+1;e>3||a.setState({activeSprite:e})},a.onPrevSpriteClick=function(){var e=a.state.activeSprite-1;e<0||a.setState({activeSprite:e})},a.onGridButtonClick=function(e){e&&a.setState({activeSecondaryDisplay:e})},a}return Object(v.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.getData()}},{key:"getData",value:function(){var e=Object(s.a)(o.a.mark((function e(t){var a,n,r,l,i,c,s,m,d,p,u;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=this.state,n=a.pokemonApiUrl,r=a.pokemonSpeciesUrl,l=a.pokedexNumber,i=a.cache,c=[],s=[],!i[m=t||l]){e.next=10;break}d=i[m],c=d.pokemonData,s=d.pokemonSpeciesData,e.next=14;break;case 10:return p=E.a.get(n+m),u=E.a.get(r+m),e.next=14,Promise.all([p,u]).then((function(e){var t=e[0].data,a=e[1].data;c=t,s=a,i[m]={pokemonData:t,pokemonSpeciesData:a}}));case 14:this.setState({pokemonData:c,pokemonSpeciesData:s,activeSprite:0,dataReady:!0});case 15:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state,t=e.pokedexNumber,a=e.pokemonData,n=e.pokemonSpeciesData,l=e.dataReady,i=e.activeSprite,c=e.language,o=e.version,s=e.activeSecondaryDisplay;if(!l)return r.a.createElement(h.Wave,null);console.log(a),console.log(n);for(var m=a.types.sort((function(e,t){return e.slot-t.slot})),d=m[0].type.name,p=m[1]?m[1].type.name:null,u=a.sprites,v=n.flavor_text_entries.filter((function(e){return e.language.name===c&&e.version.name===o}))[0],f=t-1,E=t+1,w=0!==f,P=807!==E,U=i-1>=0,W=i+1<=3,_=a.stats,j=[],F=0;F<_.length;F++){var K=_[F];j.push({name:k(K.stat.name),value:K.base_stat})}var O={height:a.height,weight:a.weight};return r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"left-screen"},r.a.createElement("div",{className:"left-screen-header"},r.a.createElement("div",{className:"lights-container"},r.a.createElement(y,null),r.a.createElement(S,{colour:"red"}),r.a.createElement(S,{colour:"yellow"}),r.a.createElement(S,{colour:"green"})),r.a.createElement("div",{style:{width:"20%",display:"flex",flexDirection:"column",position:"relative"}},r.a.createElement("div",{style:{position:"absolute",height:1,backgroundColor:"#2A2B26",width:111.77,transform:"rotate(-32.4673deg)",top:89,left:-9}})),r.a.createElement("div",{style:{width:"30%",marginRight:20}},r.a.createElement("div",{style:{height:60,borderBottom:"1px solid #2A2B26"}}),r.a.createElement("div",{style:{height:60,borderRight:"1px solid #2A2B26"}}))),r.a.createElement("div",{className:"left-screen-content"},r.a.createElement("div",{className:"main-display-wrapper"},r.a.createElement("div",{className:"main-display-cut"}),r.a.createElement("div",{className:"sprite-container"},r.a.createElement("div",{className:"sprite-top"},r.a.createElement("div",{className:"sprite-cycle top",onClick:this.onPrevSpriteClick},U&&r.a.createElement(g.d,{color:"#fff"}))),r.a.createElement("div",{className:"sprite-middle"},r.a.createElement("div",{className:"sprite-cycle left",onClick:this.onPrevPokemonClick},w&&r.a.createElement(r.a.Fragment,null,r.a.createElement(g.b,{color:"#fff"}),r.a.createElement("span",{style:{color:"#fff",marginTop:10}},"#",f))),r.a.createElement("div",{className:"sprite-wrapper"},Object.keys(u).map((function(e){var t=u[e];if(t)return r.a.createElement(b,{spriteUrl:t,spriteKey:e,activeSprite:e===R[i],key:e})}))),r.a.createElement("div",{className:"sprite-cycle right",onClick:this.onNextPokemonClick},P&&r.a.createElement(g.c,{color:"#fff"}),r.a.createElement("span",{style:{color:"#fff",marginTop:10}},"#",E))),r.a.createElement("div",{className:"sprite-bottom"},r.a.createElement("div",{className:"sprite-cycle bottom",onClick:this.onNextSpriteClick},W&&r.a.createElement(g.a,{color:"#fff"})))),r.a.createElement("div",{className:"main-display-footer"},r.a.createElement(T,null),r.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},r.a.createElement(G,null),r.a.createElement(G,null),r.a.createElement(G,null),r.a.createElement(G,null)))),r.a.createElement("div",{className:"left-screen-footer"},r.a.createElement("div",{className:"left-screen-footer-left-col"},r.a.createElement("div",{className:"sprite-button"})),r.a.createElement("div",{className:"left-screen-footer-middle-col"},r.a.createElement("div",{className:"left-screen-footer-row"},r.a.createElement(H,{colour:"#D72113"}),r.a.createElement(H,{colour:"#fff",noMargin:!0})),r.a.createElement("div",{className:"left-screen-footer-row"},r.a.createElement(N,{number:t,name:a.name}))),r.a.createElement("div",{className:"left-screen-footer-right-col"},r.a.createElement(D,{upAction:this.onPrevSpriteClick,rightAction:this.onNextPokemonClick,downAction:this.onNextSpriteClick,leftAction:this.onPrevPokemonClick}))))),r.a.createElement("div",{className:"hinge-container"},r.a.createElement("div",{className:"hinge-top"}),r.a.createElement("div",{className:"hinge-middle"}),r.a.createElement("div",{className:"hinge-bottom"}),r.a.createElement("div",{className:"hinge-bottom-lid"})),r.a.createElement("div",{className:"right-screen"},r.a.createElement("div",{style:{height:60,backgroundColor:"#fff"}}),r.a.createElement("div",{style:{height:60,backgroundColor:"#fff",display:"flex",flexDirection:"row"}},r.a.createElement("div",{style:{width:"30%",backgroundColor:"#D72113",paddingLeft:20,paddingTop:20,display:"flex"}},r.a.createElement("div",{style:{borderLeft:"1px solid #000",borderTop:"1px solid #000",flex:1}})),r.a.createElement("div",{style:{width:"20%",position:"relative"}},r.a.createElement("div",{style:{position:"absolute",bottom:0,left:0,borderTop:"60px solid transparent",borderLeft:"60px solid #D72113"}}),r.a.createElement("div",{style:{width:82.6,height:1,backgroundColor:"#2A2B26",transform:"rotate(45deg)",position:"absolute",top:49,left:-14}})),r.a.createElement("div",{style:{width:"50%"}})),r.a.createElement("div",{style:{display:"flex",flexDirection:"row",height:20,marginLeft:20,marginRight:20,borderLeft:"1px solid #2A2B26"}},r.a.createElement("div",{style:{width:"40%"}}),r.a.createElement("div",{style:{width:"60%",borderBottom:"1px solid #2A2B26"}})),r.a.createElement("div",{className:"right-screen-content"},r.a.createElement(C,{activeDisplay:s,flavourText:v.flavor_text,statistics:j,heightWeight:O}),r.a.createElement("div",{className:"grid-button-container"},r.a.createElement(A,{clickHandler:this.onGridButtonClick,screen:"flavourText"}),r.a.createElement(A,{clickHandler:this.onGridButtonClick,screen:"statistics"}),r.a.createElement(A,{clickHandler:this.onGridButtonClick,screen:"heightWeight"}),r.a.createElement(A,{clickHandler:this.onGridButtonClick}),r.a.createElement(A,{clickHandler:this.onGridButtonClick}),r.a.createElement(A,{clickHandler:this.onGridButtonClick}),r.a.createElement(A,{clickHandler:this.onGridButtonClick}),r.a.createElement(A,{clickHandler:this.onGridButtonClick}),r.a.createElement(A,{clickHandler:this.onGridButtonClick}),r.a.createElement(A,{clickHandler:this.onGridButtonClick})),r.a.createElement("div",{className:"misc-button-container"},r.a.createElement("div",{className:"misc-button-left-col"},r.a.createElement("div",{className:"white-grid-button"}),r.a.createElement("div",{className:"white-grid-button"})),r.a.createElement("div",{className:"misc-button-right-col"},r.a.createElement("div",{className:"misc-button-row"},r.a.createElement(H,null),r.a.createElement(H,{noMargin:!0})),r.a.createElement("div",{className:"misc-button-row"},r.a.createElement(B,null)))),r.a.createElement("div",{className:"type-display-container"},r.a.createElement("div",{className:"type-display-wrapper"},r.a.createElement(x,{type:d})),r.a.createElement("div",{className:"type-display-wrapper"},p&&r.a.createElement(x,{type:p}))))))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(U,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},36:function(e,t,a){e.exports=a(114)},4:function(e,t,a){}},[[36,1,2]]]);
//# sourceMappingURL=main.f4cdefc3.chunk.js.map