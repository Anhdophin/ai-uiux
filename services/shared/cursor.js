
(function(){
  if (window.matchMedia('(pointer: coarse)').matches) return;
  let dot, ring, x=innerWidth/2, y=innerHeight/2, rx=x, ry=y;
  function init(){
    document.documentElement.classList.add('cursor-ready');
    const layer=document.createElement('div'); layer.className='cursor-layer';
    dot=document.createElement('div'); dot.className='cursor-dot';
    ring=document.createElement('div'); ring.className='cursor-ring';
    layer.append(ring,dot); document.body.appendChild(layer);
    addEventListener('mousemove', e=>{x=e.clientX;y=e.clientY; document.documentElement.classList.toggle('cursor-hover', !!e.target.closest('button,a,input,textarea,select,[data-cursor-hover]'));}, {passive:true});
    addEventListener('mousedown', ()=>document.documentElement.classList.add('cursor-press'), {passive:true});
    addEventListener('mouseup', ()=>document.documentElement.classList.remove('cursor-press'), {passive:true});
    addEventListener('mouseleave', ()=>layer.style.opacity='0', {passive:true});
    addEventListener('mouseenter', ()=>layer.style.opacity='1', {passive:true});
    loop();
  }
  function loop(){ rx += (x-rx)*0.18; ry += (y-ry)*0.18; dot.style.transform=`translate(${x}px, ${y}px) translate(-50%, -50%)`; ring.style.transform=`translate(${rx}px, ${ry}px) translate(-50%, -50%)`; requestAnimationFrame(loop); }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded', init,{once:true}):init();
})();
