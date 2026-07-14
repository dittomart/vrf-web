/* ============================================================
   VRF KITCHEN — Shared App Logic
   Pure Vegetarian Cloud Kitchen · Demo Mode
   ============================================================ */

/* ---------- Brand config ---------- */
const VRF = {
  brand: "VRF Kitchen",
  owner: "Vijay Raghavan's",
  tagline: "Taste • Time • Quality",
  city: "Coimbatore",
  area: "R.S. Puram",
  radius: 6,           // km
  eta: 35,             // minutes
  minOrder: 149,
  freeDeliveryAbove: 349,
  deliveryCharge: 29,
  phone: "9372381280",
  whatsapp: "9372381280",
  demo: true,
};

/* ---------- Demo catalog (Restaurant / Pure Veg) ---------- */
const CATEGORIES = [
  { id: "starters",   name: "Starters",    icon: "salad" },
  { id: "biryani",    name: "Biryani",     icon: "cooking-pot" },
  { id: "maincourse", name: "Main Course", icon: "utensils" },
  { id: "breads",     name: "Breads",      icon: "wheat" },
  { id: "southindian",name: "South Indian",icon: "flame" },
  { id: "desserts",   name: "Desserts",    icon: "ice-cream-bowl" },
  { id: "beverages",  name: "Beverages",   icon: "cup-soda" },
  { id: "combos",     name: "Combo Meals", icon: "layout-grid" },
];

const PRODUCTS = [
  // starters
  { id: "p1",  cat: "starters",   name: "Paneer Tikka",           desc: "8 pcs · char-grilled cottage cheese in tandoori spices", price: 240, mrp: 280, img:"1567188040759-fb8a883dc6d8", best: true,  ordered: 214, tags:["veg","bestseller"] },
  { id: "p2",  cat: "starters",   name: "Gobi 65",                desc: "Crispy fried cauliflower tossed in curry leaves & chilli", price: 160, mrp: 190, img:"1606491956689-2ea866880c84", best: false, ordered: 88,  tags:["veg","spicy"] },
  { id: "p3",  cat: "starters",   name: "Veg Manchurian (Dry)",   desc: "Indo-Chinese veg balls in tangy garlic sauce",           price: 180, mrp: 200, img:"1585032226651-759b368d7246", best: false, ordered: 121, tags:["veg"] },
  { id: "p4",  cat: "starters",   name: "Mushroom Pepper Fry",    desc: "Button mushrooms in black pepper & onion masala",        price: 200, mrp: 230, img:"1611489142329-5f62cfa43e6b", best: false, ordered: 64,  tags:["veg","spicy"] },
  // biryani
  { id: "p5",  cat: "biryani",    name: "Veg Dum Biryani",        desc: "Fragrant seeraga samba rice, layered vegetables, saffron", price: 220, mrp: 250, img:"1589302168068-964664d93dc0", best: true,  ordered: 402, tags:["veg","bestseller"] },
  { id: "p6",  cat: "biryani",    name: "Paneer Biryani",         desc: "Aromatic biryani loaded with soft paneer cubes",          price: 260, mrp: 290, img:"1633945274405-b6c8069047b0", best: true,  ordered: 268, tags:["veg","bestseller"] },
  { id: "p7",  cat: "biryani",    name: "Mushroom Biryani",       desc: "Coimbatore-style mushroom biryani with mint raita",       price: 240, mrp: 270, img:"1596797038530-2c107229654b", best: false, ordered: 97,  tags:["veg"] },
  // main course
  { id: "p8",  cat: "maincourse", name: "Paneer Butter Masala",   desc: "Rich buttery tomato gravy with fresh paneer",             price: 230, mrp: 260, img:"1631452180519-c014fe946bc7", best: true,  ordered: 311, tags:["veg","bestseller"] },
  { id: "p9",  cat: "maincourse", name: "Kadai Veg",              desc: "Mixed vegetables in roasted kadai masala",                price: 210, mrp: 240, img:"1585937421612-70a008356fbe", best: false, ordered: 76,  tags:["veg"] },
  { id: "p10", cat: "maincourse", name: "Dal Tadka",              desc: "Yellow lentils tempered with ghee, cumin & garlic",       price: 160, mrp: 180, img:"1546833999-b9f581a1996d", best: false, ordered: 143, tags:["veg"] },
  { id: "p11", cat: "maincourse", name: "Chettinad Veg Kurma",    desc: "South-style coconut kurma, perfect with parotta",         price: 190, mrp: 210, img:"1567337710282-00832b415979", best: false, ordered: 88,  tags:["veg","spicy"] },
  // breads
  { id: "p12", cat: "breads",     name: "Butter Naan",            desc: "Soft tandoor naan brushed with butter",                   price: 45,  mrp: 55,  img:"1626074353765-517a681e40be", best: false, ordered: 190, tags:["veg"] },
  { id: "p13", cat: "breads",     name: "Kerala Parotta (2 pcs)", desc: "Flaky layered parotta, made fresh",                       price: 60,  mrp: 70,  img:"1565557623262-b51c2513a641", best: true,  ordered: 233, tags:["veg","bestseller"] },
  { id: "p14", cat: "breads",     name: "Tandoori Roti",          desc: "Whole-wheat roti from the clay oven",                     price: 35,  mrp: 40,  img:"1574653853027-5382a3d23a15", best: false, ordered: 71,  tags:["veg"] },
  // south indian
  { id: "p15", cat: "southindian",name: "Masala Dosa",            desc: "Crispy dosa with potato masala, sambar & chutney",        price: 90,  mrp: 110, img:"1668236543090-82eba5ee5976", best: true,  ordered: 356, tags:["veg","bestseller"] },
  { id: "p16", cat: "southindian",name: "Idli Vada Combo",        desc: "2 idli + 1 medu vada with sambar & 3 chutneys",           price: 80,  mrp: 95,  img:"1589301760014-d929f3979dbc", best: false, ordered: 128, tags:["veg"] },
  { id: "p17", cat: "southindian",name: "Ghee Pongal",            desc: "Comforting rice-dal pongal loaded with ghee & pepper",    price: 100, mrp: 120, img:"1630409351217-bc4fa6422075", best: false, ordered: 84,  tags:["veg"] },
  // desserts
  { id: "p18", cat: "desserts",   name: "Gulab Jamun (2 pcs)",    desc: "Warm khoya dumplings soaked in cardamom syrup",           price: 60,  mrp: 70,  img:"1601050690597-df0568f70950", best: false, ordered: 167, tags:["veg"] },
  { id: "p19", cat: "desserts",   name: "Rava Kesari",            desc: "Ghee-rich saffron semolina sweet",                        price: 70,  mrp: 80,  img:"1605197161470-2b4c8d1e2b3f", best: false, ordered: 59,  tags:["veg"] },
  // beverages
  { id: "p20", cat: "beverages",  name: "Filter Coffee",          desc: "Authentic Kongu-style degree filter coffee",              price: 40,  mrp: 45,  img:"1509042239860-f550ce710b93", best: true,  ordered: 289, tags:["veg","bestseller"] },
  { id: "p21", cat: "beverages",  name: "Fresh Lime Soda",        desc: "Sweet & salt lime soda, freshly churned",                 price: 55,  mrp: 60,  img:"1621263764928-df1444c5e859", best: false, ordered: 102, tags:["veg"] },
  { id: "p22", cat: "beverages",  name: "Jigarthanda",            desc: "Madurai special — milk, almond gum, ice cream",           price: 90,  mrp: 100, img:"1638176066666-ffb2f013c7dd", best: false, ordered: 76,  tags:["veg"] },
  // combos
  { id: "p23", cat: "combos",     name: "Meals Combo (Unlimited)",desc: "Rice, sambar, rasam, 3 curries, poriyal, curd, papad, sweet", price: 180, mrp: 220, img:"1585937421612-70a008356fbe", best: true,  ordered: 421, tags:["veg","bestseller"] },
  { id: "p24", cat: "combos",     name: "Parotta + Kurma Combo",  desc: "2 parotta + veg kurma + gulab jamun",                     price: 150, mrp: 175, img:"1567337710282-00832b415979", best: false, ordered: 134, tags:["veg"] },
];

/* ---------- assets ---------- */
const LOGO = "assets/image.png";

/* ---------- image helper (real curated food photos) ---------- */
/* Per-product override map → verified Indian-veg Unsplash photo IDs */
const IMG = {
  p1:"1567188040759-fb8a883dc6d8", // paneer tikka
  p2:"1610057099431-d73a1c9d2f2f", // fried snack
  p3:"1626074353765-517a681e40be", // manchurian-ish
  p4:"1604908176997-125f25cc6f3d", // mushroom
  p5:"1589302168068-964664d93dc0", // biryani
  p6:"1633945274405-b6c8069047b0", // paneer biryani
  p7:"1596797038530-2c107229654b", // mushroom biryani
  p8:"1631452180519-c014fe946bc7", // paneer butter masala
  p9:"1585937421612-70a008356fbe", // veg curry
  p10:"1546833999-b9f581a1996d",   // dal
  p11:"1567337710282-00832b415979",// kurma
  p12:"1626074353765-517a681e40be",// naan
  p13:"1565557623262-b51c2513a641",// parotta
  p14:"1574653853027-5382a3d23a15",// roti
  p15:"1668236543090-82eba5ee5976",// dosa
  p16:"1589301760014-d929f3979dbc",// idli
  p17:"1630409351217-bc4fa6422075",// pongal
  p18:"1601050690597-df0568f70950",// gulab jamun
  p19:"1605197161470-2b4c8d1e2b3f",// kesari
  p20:"1509042239860-f550ce710b93",// coffee
  p21:"1621263764928-df1444c5e859",// lime soda
  p22:"1638176066666-ffb2f013c7dd",// jigarthanda
  p23:"1567337710282-00832b415979",// meals
  p24:"1565557623262-b51c2513a641",// combo
};
function imgUrl(id, w = 400, h = 300) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=75`;
}
function prodImg(p, w=400, h=300){ return imgUrl(IMG[p.id]||p.img, w, h); }
function getProduct(id){ return PRODUCTS.find(p => p.id === id); }
function money(n){ return "₹" + Number(n).toLocaleString("en-IN"); }

/* ============================================================
   REVERSE GEOCODING — real place name from coordinates
   (OpenStreetMap Nominatim, free, no key needed)
   ============================================================ */
async function reverseGeo(lat, lng){
  try{
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      {headers:{"Accept":"application/json"}});
    if(!r.ok) throw 0;
    const j = await r.json();
    const a = j.address||{};
    const clean = s => (s||"").replace(/\b(Zone|Ward)\s*\d+\b/gi,"").replace(/^[\s,·-]+|[\s,·-]+$/g,"").trim();
    const area = clean(a.suburb||a.neighbourhood||a.residential||a.village||a.town||a.city_district);
    const city = clean(a.city||a.town||a.county||a.state_district);
    const name = [area, city].filter(Boolean).join(", ") || clean(j.display_name?.split(",").slice(0,2).join(",")) || null;
    return name;
  }catch(e){ return null; }
}
function requireLocation() {
  let loc = null;
  try { loc = JSON.parse(localStorage.getItem("dittomart_location")); } catch(e){}
  if (!loc || !loc.serviceable || loc.lat == null || loc.lng == null) {
    window.location.replace("location.html");
    return false;
  }
  return loc;
}

/* ============================================================
   CART (localStorage)
   ============================================================ */
function getCart(){ try { return JSON.parse(localStorage.getItem("vrf_cart")) || {}; } catch(e){ return {}; } }
function saveCart(c){ localStorage.setItem("vrf_cart", JSON.stringify(c)); updateCartBadges(); }
function cartCount(){ const c=getCart(); return Object.values(c).reduce((a,b)=>a+b,0); }
function cartSubtotal(){ const c=getCart(); return Object.entries(c).reduce((s,[id,q])=>{const p=getProduct(id);return s+(p?p.price*q:0);},0); }
function addToCart(id, qty=1){ const c=getCart(); c[id]=(c[id]||0)+qty; if(c[id]<=0) delete c[id]; saveCart(c); }
function setQty(id, qty){ const c=getCart(); if(qty<=0) delete c[id]; else c[id]=qty; saveCart(c); }
function updateCartBadges(){
  const n = cartCount();
  document.querySelectorAll("[data-cart-badge]").forEach(el=>{
    el.textContent = n; el.classList.toggle("hidden", n===0);
  });
  document.querySelectorAll("[data-cart-sub]").forEach(el=> el.textContent = money(cartSubtotal()));
  renderStickyCart();
}

/* ---------- Buy Again (order history) ---------- */
function getHistory(){ try { return JSON.parse(localStorage.getItem("vrf_orders"))||[]; } catch(e){ return []; } }
function buyAgainItems(){
  const h = getHistory();
  if (h.length){
    const ids = [...new Set(h.flatMap(o=>o.items.map(i=>i.id)))].slice(0,6);
    return ids.map(getProduct).filter(Boolean);
  }
  // demo seed
  return ["p5","p8","p15","p13","p20","p23"].map(getProduct);
}

/* ---------- Wishlist (localStorage) ---------- */
function getWishlist(){ try{return JSON.parse(localStorage.getItem("vrf_wishlist"))||[]}catch(e){return[]} }
function toggleWishlist(id){
  let w=getWishlist();
  const has=w.includes(id);
  w = has ? w.filter(x=>x!==id) : [...w,id];
  localStorage.setItem("vrf_wishlist",JSON.stringify(w));
  return !has; // true = now saved
}
function inWishlist(id){ return getWishlist().includes(id); }

/* ---------- Auth ---------- */
function isLoggedIn(){ return localStorage.getItem("vrf_logged_in")==="true"; }
function setLoggedIn(v){ localStorage.setItem("vrf_logged_in", v?"true":"false"); }
/* full logout — wipe all user-specific data */
function logoutUser(){
  ["vrf_logged_in","vrf_phone","vrf_cart","vrf_orders","vrf_bill","vrf_last_order",
   "vrf_favs","vrf_wishlist","vrf_addresses","vrf_selected_addr"].forEach(k=>localStorage.removeItem(k));
}

/* ============================================================
   TOAST
   ============================================================ */
function toast(msg, icon="check-circle"){
  let t = document.getElementById("vrf-toast");
  if(!t){
    t = document.createElement("div");
    t.id = "vrf-toast";
    t.className = "fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-10 z-[100] flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--ink)] text-white text-sm font-semibold shadow-2xl transition-all duration-300 opacity-0";
    document.body.appendChild(t);
  }
  t.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4" style="color:var(--gold)"></i><span>${msg}</span>`;
  if(window.lucide) lucide.createIcons();
  requestAnimationFrame(()=>{ t.style.opacity="1"; t.style.transform="translate(-50%,0) scale(1)"; });
  t.animate([{transform:"translate(-50%,12px) scale(.9)"},{transform:"translate(-50%,-4px) scale(1.03)"},{transform:"translate(-50%,0) scale(1)"}],{duration:400,easing:"cubic-bezier(.2,.8,.2,1)"});
  clearTimeout(t._to);
  t._to = setTimeout(()=>{ t.style.opacity="0"; t.style.transform="translate(-50%,12px)"; }, 2200);
}

/* ============================================================
   STICKY CART BAR (floats above bottom nav)
   ============================================================ */
function renderStickyCart(){
  const bar = document.getElementById("sticky-cart");
  if(!bar) return;
  const n = cartCount();
  if(n===0){ bar.classList.add("translate-y-40"); return; }
  bar.classList.remove("translate-y-40");
  bar.querySelector("[data-sc-count]").textContent = n + (n>1?" items":" item");
  bar.querySelector("[data-sc-total]").textContent = money(cartSubtotal());
}

/* ============================================================
   BOTTOM NAV + WHATSAPP FAB (injected)
   ============================================================ */
function injectChrome(active){
  // Bottom nav — floating pill dock
  if(document.getElementById("bottom-nav")) return;
  const nav = document.createElement("nav");
  nav.id="bottom-nav";
  nav.className="md:hidden";
  const items=[
    {k:"home",label:"Home",icon:"house",href:"home.html"},
    {k:"search",label:"Menu",icon:"utensils-crossed",href:"category.html"},
    {k:"orders",label:"Orders",icon:"receipt-text",href:"orders.html"},
    {k:"profile",label:"Profile",icon:"user-round",href:"profile.html"},
  ];
  nav.innerHTML=`<div class="nav-dock">${items.map(i=>{
    const on = active===i.k;
    return `<a href="${i.href}" class="nav-item ${on?'is-active':''}" aria-label="${i.label}">
      <span class="nav-ico"><i data-lucide="${i.icon}"></i></span>
      <span class="nav-lbl">${i.label}</span>
    </a>`;}).join("")}</div>`;
  document.body.appendChild(nav);
  if(window.lucide) lucide.createIcons();
}

/* ============================================================
   ANIMATION ENGINE
   ============================================================ */
/* scroll reveal */
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:0.12, rootMargin:"0px 0px -40px 0px"});
  els.forEach(e=>io.observe(e));
}

/* fly-to-cart animation */
function flyToCart(srcEl){
  const cart = document.querySelector("[data-cart-badge]") || document.querySelector("#bottom-nav a[href='cart.html']");
  if(!srcEl || !cart) return;
  const s = srcEl.getBoundingClientRect(), t = cart.getBoundingClientRect();
  const dot = document.createElement("div");
  dot.className = "fly";
  dot.style.left = s.left + s.width/2 - 11 + "px";
  dot.style.top  = s.top  + s.height/2 - 11 + "px";
  document.body.appendChild(dot);
  const dx = (t.left+t.width/2) - (s.left+s.width/2);
  const dy = (t.top+t.height/2) - (s.top+s.height/2);
  dot.animate([
    {transform:"translate(0,0) scale(1)",opacity:1},
    {transform:`translate(${dx*.5}px,${dy*.5-60}px) scale(1.1)`,opacity:1,offset:.6},
    {transform:`translate(${dx}px,${dy}px) scale(.2)`,opacity:.4}
  ],{duration:650,easing:"cubic-bezier(.5,-0.3,.5,1)"}).onfinish=()=>dot.remove();
  // bump cart badge
  const badge = document.querySelector("[data-cart-badge]");
  if(badge){ badge.animate([{transform:"scale(1)"},{transform:"scale(1.5)"},{transform:"scale(1)"}],{duration:400,delay:600}); }
}

/* ripple on .press buttons */
document.addEventListener("pointerdown",(e)=>{
  const b = e.target.closest(".ripple");
  if(!b) return;
  const r = b.getBoundingClientRect();
  const s = document.createElement("span");
  const size = Math.max(r.width,r.height);
  s.style.cssText=`position:absolute;border-radius:9999px;background:rgba(255,255,255,.4);pointer-events:none;width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px;transform:scale(0);opacity:1`;
  b.style.position=b.style.position||"relative"; b.style.overflow="hidden";
  b.appendChild(s);
  s.animate([{transform:"scale(0)",opacity:.6},{transform:"scale(2.4)",opacity:0}],{duration:600,easing:"ease-out"}).onfinish=()=>s.remove();
});

/* ============================================================
   3D ENGINE — pointer tilt (desktop) + scroll parallax (all)
   Delegated: works on dynamically-injected cards, no per-page code.
   ============================================================ */
(function(){
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(hover: none)").matches;

  /* ---- interactive tilt on any .lift / [data-tilt] card ---- */
  if(!reduce && !coarse){
    let cur=null, ev=null, raf=0;
    function frame(){
      raf=0; if(!cur||!ev) return;
      const r=cur.getBoundingClientRect();
      if(!r.width) return;
      const px=(ev.clientX-r.left)/r.width, py=(ev.clientY-r.top)/r.height;
      /* gentle for large cards, livelier for small ones */
      const max = r.width>520||r.height>420 ? 4 : cur.hasAttribute("data-tilt") ? 8 : 6;
      const ry=(px-0.5)*2*max, rx=-(py-0.5)*2*max;
      cur.style.transform=`perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px) translateZ(8px)`;
      cur.style.setProperty("--mx",(px*100).toFixed(1)+"%");
      cur.style.setProperty("--my",(py*100).toFixed(1)+"%");
    }
    function reset(el){ if(!el) return; el.classList.remove("is-tilting"); el.style.transform=""; }
    document.addEventListener("pointermove",(e)=>{
      if(e.pointerType==="touch") return;
      const card=e.target.closest(".lift,[data-tilt]");
      if(card!==cur){ reset(cur); cur=card; if(card) card.classList.add("is-tilting"); }
      if(cur){ ev=e; if(!raf) raf=requestAnimationFrame(frame); }
    },{passive:true});
    ["pointerleave","pointercancel","blur"].forEach(t=>
      document.addEventListener(t,()=>{ reset(cur); cur=null; }, true));
    // dropping out of a card into empty space
    document.addEventListener("pointerover",(e)=>{
      if(cur && !e.target.closest(".lift,[data-tilt]")){ reset(cur); cur=null; }
    },{passive:true});
  }

  /* ---- scroll parallax on decorative [data-parallax] layers ---- */
  if(!reduce){
    let raf=0;
    function run(){
      raf=0; const vh=window.innerHeight;
      document.querySelectorAll("[data-parallax]").forEach(el=>{
        const sp=parseFloat(el.getAttribute("data-parallax"))||0.12;
        const r=el.getBoundingClientRect();
        const center=r.top+r.height/2-vh/2;
        el.style.transform=`translate3d(0,${(-center*sp).toFixed(1)}px,0)`;
      });
    }
    const ping=()=>{ if(!raf) raf=requestAnimationFrame(run); };
    addEventListener("scroll",ping,{passive:true});
    addEventListener("resize",ping);
    document.addEventListener("DOMContentLoaded",run);
    setTimeout(run,60);
  }
})();

/* run on load */
document.addEventListener("DOMContentLoaded", ()=>{
  if(window.lucide) lucide.createIcons();
  updateCartBadges();
  initReveal();
  document.body.classList.add("page-enter");
});
