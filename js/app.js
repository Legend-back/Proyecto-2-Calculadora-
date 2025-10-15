const display=document.getElementById('display');
const keys=document.querySelector('.keys');
const isOperator=ch=>['+','-','x','X','*','/'].includes(ch);

function append(val){
  let cur=display.value;
  if(isOperator(val)){
    if(!cur&&val!=='-')return;
    if(cur&&isOperator(cur.at(-1))){display.value=cur.slice(0,-1)+(val==='x'?'x':val);return;}
  }
  if(val==='.'){
    const lastNum=cur.split(/[+\-xX*/]/).pop();
    if(!lastNum)val='0.';
    else if(lastNum.includes('.'))return;
  }
  display.value+=val;
}
function backspace(){display.value=display.value.slice(0,-1);}
function clearAll(){display.value='';}

function sanitize(expr){
  return expr.replace(/[xX]/g,'*').replace(/÷/g,'/').replace(/-/g,'-').replace(/[+\-*/.]$/,'');
}
function round10(n){return Math.round((n+Number.EPSILON)*1e10)/1e10;}
function formatSci(numStr){
  const n=Number(numStr);
  if(!Number.isFinite(n))return'Error';
  const abs=Math.abs(n);
  if((abs!==0&&(abs>=1e12||abs<1e-6))||numStr.length>14){
    const exp=Math.floor(Math.log10(abs));
    const mant=n/10**exp;
    return mant.toPrecision(8).replace(/\.?0+$/,'')+'x10^'+exp;
  }
  return numStr;
}
function evaluate(){
  try{
    const expr=sanitize(display.value);
    if(!expr)return;
    if(!/^[\d.+\-*/() ]+$/.test(expr))throw new Error('bad');
    const result=Function('"use strict";return('+expr+')')();
    display.value=formatSci(String(round10(result)));
  }catch{
    display.value='Error';
    setTimeout(()=>display.value='',800);
  }
}
keys.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  const action=b.dataset.action; const val=b.dataset.value;
  if(action==='clear')return clearAll();
  if(action==='backspace')return backspace();
  if(action==='equals')return evaluate();
  if(val!==undefined)return append(val);
});
document.addEventListener('keydown',e=>{
  const k=e.key;
  if(/\d/.test(k))return append(k);
  if(k=== '.')return append('.');
  if(k==='+'||k==='-')return append(k);
  if(k==='*'||k.toLowerCase()==='x')return append('x');
  if(k==='/')return append('/');
  if(k==='Enter'||k==='='){e.preventDefault();return evaluate();}
  if(k==='Backspace'){e.preventDefault();return backspace();}
  if(k==='Escape')return clearAll();
});
