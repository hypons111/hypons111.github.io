"use strict";(self["webpackChunkhomepage"]=self["webpackChunkhomepage"]||[]).push([[90],{7090:function(e,t,a){a.r(t),a.d(t,{default:function(){return c}});var r=a(6768),n=a(4232),l=a(144);const s={id:"clcok"},u={id:"container"},o={id:"circle"};var v={__name:"Clock",setup(e){const t=(0,l.KR)(),a=(0,l.KR)(),v=(0,l.KR)(),i=(0,l.KR)(),c=(0,l.KR)(),d=(0,l.KR)();let p;function k(){const e=new Date,r=e.getHours(),n=e.getMinutes(),l=e.getSeconds();t.value=0===r?"24":r,a.value=0===n?"60":n,v.value=0===l?"60":l,i.value=30*r,c.value=6*n,d.value=6*l}function f(){p=setInterval((()=>{k()}),1e3)}return(0,r.sV)((()=>{k(),f()})),(0,r.xo)((()=>{clearInterval(p)})),(e,l)=>((0,r.uX)(),(0,r.CE)("div",s,[(0,r.Lk)("div",u,[(0,r.Lk)("div",o,[(0,r.Lk)("div",{id:"hPointer",class:"pointer",style:(0,n.Tr)({transform:`rotate(${i.value}deg)`})},[(0,r.Lk)("span",{class:"number",style:(0,n.Tr)({transform:`translate(-50%, 10px) rotate(${-i.value}deg)`})},[(0,r.Lk)("p",null,(0,n.v_)(t.value),1)],4)],4),(0,r.Lk)("div",{id:"mPointer",class:"pointer",style:(0,n.Tr)({transform:`rotate(${c.value}deg)`})},[(0,r.Lk)("span",{class:"number",style:(0,n.Tr)({transform:`translate(-50%, 10px) rotate(${-c.value}deg)`})},[(0,r.Lk)("p",null,(0,n.v_)(a.value),1)],4)],4),(0,r.Lk)("div",{id:"sPointer",class:"pointer",style:(0,n.Tr)({transform:`rotate(${d.value}deg)`})},[(0,r.Lk)("span",{class:"number",style:(0,n.Tr)({transform:`translate(-50%, 10px) rotate(${-d.value}deg)`})},[(0,r.Lk)("p",null,(0,n.v_)(v.value),1)],4)],4)])])]))}};const i=v;var c=i}}]);
//# sourceMappingURL=90.425f1061.js.map