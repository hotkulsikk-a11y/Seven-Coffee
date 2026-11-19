const WA = "6285358384078";
const PRICE = 15000;
const rp = n => "Rp " + n.toLocaleString("id-ID");
const IMG = {sanger:"img/ice-sanger-espresso.jpg", aren:"img/ice-aren-latte.jpg"};
const PRODUCTS = [
  { id:"sanger", price:15000, name:"Ice Sanger Espresso", tag:"strong", badge:"Khas Aceh", badge2:"Kopi Kuat",
    desc:"Espresso ganda yang pekat dipadu susu kental manis dan krimer — legit, creamy, dengan tendangan kopi yang tegas.",
    comp:[{n:"Espresso",v:60,u:"ml",c:"#3b2316"},{n:"Susu Kental Manis (SKM)",v:35,u:"ml",c:"#e9d3a8"},{n:"Krimer",v:10,u:"gr",c:"#f3ead8"}],
    notes:["Pekat","Manis legit","Creamy"]},
  { id:"aren", price:15000, name:"Ice Aren Latte", tag:"milky", badge:"Gula Aren", badge2:"Favorit",
    desc:"Susu segar yang lembut, sirup gula aren yang wangi karamel, dan satu shot espresso di atasnya — ringan dan menyegarkan.",
    comp:[{n:"Susu",v:100,u:"ml",c:"#f3ead8"},{n:"Espresso",v:30,u:"ml",c:"#3b2316"},{n:"Gula Aren",v:25,u:"ml",c:"#a8641e"}],
    notes:["Lembut","Karamel aren","Segar"]}
];
const state = {}; let cart = [];
try{ cart = JSON.parse(localStorage.getItem("k7cart")||"[]"); }catch(e){}

function glass(p){
  // layered cup drawing, liquid portion proportional (gr treated ~ml for visual)
  const total = p.comp.reduce((a,b)=>a+b.v,0), H=110, top=22; let y=top+H;
  const order = [...p.comp].sort((a,b)=> (a.n==="Espresso")-(b.n==="Espresso")); // espresso on top
  let layers = "";
  [...order].forEach(c=>{ const h=c.v/total*H; y-=h; layers+=`<rect x="0" y="${y.toFixed(1)}" width="100" height="${(h+.5).toFixed(1)}" fill="${c.c}"/>`; });
  return `<svg width="86" height="150" viewBox="0 0 100 150" aria-hidden="true">
    <defs><clipPath id="cp-${p.id}"><path d="M10 18h80l-8 118a8 8 0 0 1-8 7H26a8 8 0 0 1-8-7L10 18Z"/></clipPath></defs>
    <g clip-path="url(#cp-${p.id})">${layers}
      <rect x="30" y="48" width="18" height="18" rx="3" fill="#fff" opacity=".35" transform="rotate(12 39 57)"/>
      <rect x="54" y="78" width="16" height="16" rx="3" fill="#fff" opacity=".3" transform="rotate(-10 62 86)"/></g>
    <path d="M10 18h80l-8 118a8 8 0 0 1-8 7H26a8 8 0 0 1-8-7L10 18Z" fill="none" stroke="#0f2a4a" stroke-width="3"/>
    <rect x="5" y="12" width="90" height="8" rx="4" fill="#0f2a4a"/></svg>`;
}

function card(p){
  state[p.id] = {qty:1, sugar:"Normal", ice:"Normal"};
  const max = Math.max(...p.comp.map(c=>c.v));
  return `<article class="card" data-tag="${p.tag}" id="c-${p.id}">
    <div class="ph"><img src="${IMG[p.id]}" alt="${p.name}"><span class="badge">${p.badge}</span><span class="badge g">${p.badge2}</span></div>
    <div class="body">
      <div class="ttl"><h3>${p.name}</h3><span class="price">${rp(p.price)}<small> /gelas</small></span></div>
      <p class="desc">${p.desc}</p>
      <div class="tabs" role="tablist">
        <button class="on" data-p="komp">Komposisi</button><button data-p="sajian">Sajian</button><button data-p="atur">Atur Pesanan</button>
      </div>
      <div class="pane on" data-p="komp"><div class="comp">
        ${p.comp.map(c=>`<div class="row"><b>${c.n}</b><span class="v">${c.v} ${c.u}</span><div class="bar"><i data-w="${(c.v/max*100).toFixed(0)}" style="background:${c.c==="#f3ead8"||c.c==="#e9d3a8"?"#d6b77b":c.c}"></i></div></div>`).join("")}
      </div></div>
      <div class="pane" data-p="sajian"><div class="glass">${glass(p)}
        <div><div class="legend">${p.comp.map(c=>`<span><i style="background:${c.c};border:1px solid #d9cdb8"></i>${c.n}</span>`).join("")}<span><i style="background:#e8f1f8;border:1px solid #c9d8e6"></i>Es batu</span></div>
        <div class="notes" style="margin-top:10px">${p.notes.map(n=>`<span>${n}</span>`).join("")}</div></div></div></div>
      <div class="pane" data-p="atur" style="display:none;flex-direction:column;gap:12px">
        <div class="opt"><label>Level gula</label><div class="seg" data-k="sugar">${["Kurang","Normal","Ekstra"].map(s=>`<button class="${s==="Normal"?"on":""}">${s}</button>`).join("")}</div></div>
        <div class="opt"><label>Es</label><div class="seg" data-k="ice">${["Sedikit","Normal","Banyak"].map(s=>`<button class="${s==="Normal"?"on":""}">${s}</button>`).join("")}</div></div>
      </div>
      <div class="buy">
        <div class="qty"><button data-q="-1" aria-label="Kurangi">−</button><span>1</span><button data-q="1" aria-label="Tambah">+</button></div>
        <button class="btn addc" data-add>+ Keranjang</button>
        <a class="btn btn-wa" data-wa target="_blank" rel="noopener" href="#"><svg><use href="#wa"/></svg><span>Pesan via WA</span></a>
      </div>
    </div></article>`;
}

const grid = document.getElementById("grid");
grid.innerHTML = PRODUCTS.map(card).join("");

function waLink(text){ return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`; }
function singleMsg(p){
  const s=state[p.id];
  return `Halo Seven Coffee, saya mau pesan:\n\n☕ ${p.name}\nJumlah: ${s.qty} gelas × ${rp(p.price)}\nGula: ${s.sugar} | Es: ${s.ice}\n\nTotal: ${rp(s.qty*p.price)}\n\nTerima kasih!`;
}
function updateBtn(id){ const p=PRODUCTS.find(x=>x.id===id); document.querySelector(`#c-${id} [data-wa] span`).textContent="Pesan via WA"; }
function refreshWA(id){ const p=PRODUCTS.find(x=>x.id===id); document.querySelector(`#c-${id} [data-wa]`).href = waLink(singleMsg(p)); updateBtn(id); }
PRODUCTS.forEach(p=>refreshWA(p.id));

grid.addEventListener("click",e=>{
  const c = e.target.closest(".card"); if(!c) return; const id=c.id.slice(2), s=state[id];
  const tab = e.target.closest(".tabs button");
  if(tab){ c.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("on",b===tab));
    c.querySelectorAll(".pane").forEach(pn=>{ const on=pn.dataset.p===tab.dataset.p; pn.classList.toggle("on",on); if(pn.dataset.p==="atur") pn.style.display=on?"flex":"none"; });
    if(tab.dataset.p==="komp") animateBars(c); return; }
  const sb = e.target.closest(".seg button");
  if(sb){ const seg=sb.parentElement; seg.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===sb)); s[seg.dataset.k]=sb.textContent; refreshWA(id); return; }
  const q = e.target.closest("[data-q]");
  if(q){ s.qty=Math.max(1,Math.min(50,s.qty+ +q.dataset.q)); c.querySelector(".qty span").textContent=s.qty; refreshWA(id); return; }
  if(e.target.closest("[data-add]")){
    const p=PRODUCTS.find(x=>x.id===id);
    const ex=cart.find(i=>i.id===id&&i.sugar===s.sugar&&i.ice===s.ice);
    if(ex) ex.qty+=s.qty; else cart.push({id,name:p.name,qty:s.qty,sugar:s.sugar,ice:s.ice});
    saveCart(); toast(`${s.qty}× ${p.name} masuk keranjang`);
  }
});

document.querySelectorAll(".chip").forEach(ch=>ch.onclick=()=>{
  document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x===ch));
  document.querySelectorAll(".card").forEach(cd=>cd.classList.toggle("hide", ch.dataset.f!=="all" && cd.dataset.tag!==ch.dataset.f));
});

function animateBars(root){ root.querySelectorAll(".bar i").forEach(i=>{ i.style.width=0; requestAnimationFrame(()=>requestAnimationFrame(()=>i.style.width=i.dataset.w+"%")); }); }
const io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ animateBars(en.target); io.unobserve(en.target);} }),{threshold:.3});
document.querySelectorAll(".card").forEach(c=>io.observe(c));

function saveCart(){ try{localStorage.setItem("k7cart",JSON.stringify(cart));}catch(e){} renderCart(); }
function renderCart(){
  const n = cart.reduce((a,b)=>a+b.qty,0); document.getElementById("cartN").textContent=n;
  const box=document.getElementById("items");
  box.innerHTML = cart.length ? cart.map((i,k)=>`<div class="item"><img src="${IMG[i.id]}" alt=""><div class="t"><b>${i.qty}× ${i.name}</b><small>Gula ${i.sugar} · Es ${i.ice} · ${rp(i.qty*PRICE)}</small></div><button class="rm" data-rm="${k}">Hapus</button></div>`).join("") : `<div class="empty">Keranjang masih kosong.<br>Tambahkan kopi dari menu.</div>`;
  updateSend();
}
function updateSend(){
  const nm=document.getElementById("nm").value.trim(), kl=document.getElementById("kl").value.trim(), ct=document.getElementById("ct").value.trim();
  let t="Halo Seven Coffee, saya mau pesan:\n\n";
  cart.forEach((i,k)=>t+=`${k+1}. ${i.name} — ${i.qty} × ${rp(PRICE)} = ${rp(i.qty*PRICE)} (Gula ${i.sugar}, Es ${i.ice})\n`);
  const n=cart.reduce((a,b)=>a+b.qty,0);
  t+=`\nTotal: ${n} gelas — ${rp(n*PRICE)}`;
  document.getElementById("totalV").textContent=rp(n*PRICE);
  if(nm) t+=`\nNama: ${nm}`; if(kl) t+=`\nKelas/Lokasi: ${kl}`; if(ct) t+=`\nCatatan: ${ct}`;
  t+="\n\nTerima kasih!";
  const a=document.getElementById("sendAll"); a.href=waLink(t);
  a.style.opacity=cart.length?1:.5; a.style.pointerEvents=cart.length?"auto":"none";
}
["nm","kl","ct"].forEach(id=>document.getElementById(id).addEventListener("input",updateSend));
document.getElementById("items").addEventListener("click",e=>{ const b=e.target.closest("[data-rm]"); if(b){ cart.splice(+b.dataset.rm,1); saveCart(); }});
function openCart(){ document.getElementById("ov").classList.add("on"); document.getElementById("drawer").classList.add("on"); }
function closeCart(){ document.getElementById("ov").classList.remove("on"); document.getElementById("drawer").classList.remove("on"); }
let tt; function toast(m){ const t=document.getElementById("toast"); t.textContent=m; t.classList.add("on"); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove("on"),2000); }
renderCart();
