(function(){
function mount(){
  document.querySelectorAll('[data-background="signal-lines"]').forEach((host)=>{
    if(host.querySelector(':scope > .signal-lines-canvas')) return;
    const c=document.createElement('canvas'); c.className='signal-lines-canvas'; host.prepend(c);
    const ctx=c.getContext('2d'); let w=0,h=0,dpr=Math.min(window.devicePixelRatio||1,2);
    const cols=[]; const count=26;
    function resize(){ const r=host.getBoundingClientRect(); w=Math.max(1,Math.floor(r.width)); h=Math.max(1,Math.floor(r.height)); c.width=Math.floor(w*dpr); c.height=Math.floor(h*dpr); c.style.width=w+'px'; c.style.height=h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); cols.length=0; for(let i=0;i<count;i++){ cols.push({x:(i+.5)*(w/count), y:Math.random()*h, speed:.25+Math.random()*.6, len:h*(.22+.55*Math.random()), glow:2+Math.random()*6, size:1+Math.random()*3, alpha:.18+Math.random()*.35}); }}
    function draw(){ ctx.clearRect(0,0,w,h); for(const p of cols){ p.y -= p.speed; if(p.y + p.len < -20){ p.y = h + Math.random()*140; p.x=(Math.random()*w); p.len=h*(.18+.6*Math.random()); p.speed=.25+Math.random()*.6; p.glow=2+Math.random()*6; p.size=1+Math.random()*3; }
      const grad=ctx.createLinearGradient(p.x,p.y,p.x,p.y+p.len); grad.addColorStop(0,'rgba(0,255,115,0)'); grad.addColorStop(.7,`rgba(0,255,115,${p.alpha})`); grad.addColorStop(1,`rgba(120,255,180,${Math.min(.9,p.alpha+.35)})`);
      ctx.strokeStyle=grad; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x,p.y+p.len); ctx.stroke();
      ctx.fillStyle='rgba(0,255,115,.95)'; ctx.shadowBlur=14; ctx.shadowColor='rgba(0,255,115,.8)'; ctx.beginPath(); ctx.arc(p.x,p.y+p.len,p.size,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    } requestAnimationFrame(draw); }
    resize(); window.addEventListener('resize', resize, {passive:true}); requestAnimationFrame(draw);
  });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
