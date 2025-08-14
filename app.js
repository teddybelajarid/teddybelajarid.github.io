
// Theme + utilities
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => Array.from(ctx.querySelectorAll(q));
const fmtIDR = (n) => n.toLocaleString('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 });

// Year
$("#year").textContent = new Date().getFullYear();

// Audio toggle (user gesture required to play)
const bgAudio = $("#bgAudio");
const soundToggle = $("#soundToggle");
if (soundToggle && bgAudio) {
  soundToggle.addEventListener("click", async () => {
    if (bgAudio.paused) {
      try { await bgAudio.play(); soundToggle.setAttribute("aria-pressed", "true"); soundToggle.textContent = "🔈"; }
      catch(e){ console.log(e); }
    } else {
      bgAudio.pause(); soundToggle.setAttribute("aria-pressed", "false"); soundToggle.textContent = "🔊";
    }
  });
}

// Simple product data
const PRODUCTS = [
  {id:"p1", title:"Headphone Wireless BT5", price:299000, rating:4.7, img:"assets/img/prod1.svg"},
  {id:"p2", title:"Smartwatch Fit+ Pro", price:459000, rating:4.8, img:"assets/img/prod2.svg"},
  {id:"p3", title:"Keyboard Mekanik TKL", price:379000, rating:4.6, img:"assets/img/prod3.svg"},
  {id:"p4", title:"Cordless Drill 12V", price:529000, rating:4.9, img:"assets/img/prod4.svg"},
  {id:"p5", title:"Kamera Aksi 4K", price:899000, rating:4.5, img:"assets/img/prod5.svg"},
  {id:"p6", title:"Speaker Bluetooth 20W", price:339000, rating:4.7, img:"assets/img/prod6.svg"},
];

// LocalStorage Cart
const cartKey = "enb_cart_v1";
const getCart = () => JSON.parse(localStorage.getItem(cartKey) || "[]");
const setCart = (items) => localStorage.setItem(cartKey, JSON.stringify(items));

function addToCart(id, qty=1){
  const items = getCart();
  const idx = items.findIndex(i=>i.id===id);
  if(idx>-1) items[idx].qty += qty;
  else items.push({id, qty});
  setCart(items);
  renderCart();
}

function removeFromCart(id){
  const items = getCart().filter(i=>i.id!==id);
  setCart(items);
  renderCart();
}

function changeQty(id, delta){
  const items = getCart();
  const it = items.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  setCart(items);
  renderCart();
}

function cartCount(){
  return getCart().reduce((a,b)=>a+b.qty,0);
}

function cartSubtotal(){
  const items = getCart();
  return items.reduce((sum,{id,qty}) => {
    const p = PRODUCTS.find(x=>x.id===id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function renderCart(){
  const count = cartCount();
  const cartCountEl = $("#cartCount");
  if (cartCountEl) cartCountEl.textContent = count;

  const panel = $("#cartPanel");
  const list = $("#cartItems");
  const total = $("#cartTotal");

  if (!panel || !list || !total) return;

  const items = getCart();
  list.innerHTML = "";
  items.forEach(({id,qty}) => {
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div>
        <div class="title">${p.title}</div>
        <div class="price">${fmtIDR(p.price)}</div>
      </div>
      <div class="qty">
        <button class="btn ghost" data-act="dec" aria-label="Kurangi">−</button>
        <strong>${qty}</strong>
        <button class="btn ghost" data-act="inc" aria-label="Tambah">＋</button>
        <button class="btn ghost" data-act="rem" aria-label="Hapus">🗑</button>
      </div>`;
    item.querySelector('[data-act="dec"]').onclick = () => changeQty(id,-1);
    item.querySelector('[data-act="inc"]').onclick = () => changeQty(id,1);
    item.querySelector('[data-act="rem"]').onclick = () => removeFromCart(id);
    list.appendChild(item);
  });
  total.textContent = fmtIDR(cartSubtotal());
}

// Render product grid
const grid = $("#productGrid");
if (grid){
  function renderProducts(list){
    grid.innerHTML = "";
    list.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <span class="badge-free">Free Ongkir</span>
        <img class="thumb" src="${p.img}" alt="${p.title}">
        <div class="title">${p.title}</div>
        <div class="rating">★ ${p.rating}</div>
        <div class="price">${fmtIDR(p.price)}</div>
        <div class="actions">
          <button class="btn primary" data-id="${p.id}">Tambah ke Keranjang</button>
          <a href="checkout.html" class="btn ghost">Checkout</a>
        </div>
      `;
      card.querySelector("button").onclick = () => addToCart(p.id,1);
      grid.appendChild(card);
    });
  }
  renderProducts(PRODUCTS);

  // Sort & search
  $("#sortSelect").addEventListener("change", (e)=>{
    const v = e.target.value;
    let list = [...PRODUCTS];
    if (v==="price-asc") list.sort((a,b)=>a.price-b.price);
    if (v==="price-desc") list.sort((a,b)=>b.price-a.price);
    if (v==="rating-desc") list.sort((a,b)=>b.rating-a.rating);
    renderProducts(list);
  });

  $("#searchInput").addEventListener("input", (e)=>{
    const q = e.target.value.toLowerCase();
    const list = PRODUCTS.filter(p=> p.title.toLowerCase().includes(q));
    renderProducts(list);
  });
}

// Slider
(function initSlider(){
  const slider = $("#heroSlider");
  if (!slider) return;
  const slidesEl = slider.querySelector(".slides");
  const slides = $$(".slide", slider);
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");
  const dots = slider.querySelector(".dots");
  let i = 0, timer;

  function go(n){
    i = (n + slides.length) % slides.length;
    slidesEl.style.transform = `translateX(-${i*100}%)`;
    $$(".dots button", slider).forEach((d,di)=> d.classList.toggle("active", di===i));
  }
  function auto(){ clearInterval(timer); timer = setInterval(()=>go(i+1), 5000); }

  slides.forEach((_, idx)=>{
    const b = document.createElement("button");
    if (idx===0) b.classList.add("active");
    b.addEventListener("click", ()=>{ go(idx); auto(); });
    dots.appendChild(b);
  });

  prev.addEventListener("click", ()=>{ go(i-1); auto(); });
  next.addEventListener("click", ()=>{ go(i+1); auto(); });
  slider.addEventListener("mouseenter", ()=>clearInterval(timer));
  slider.addEventListener("mouseleave", auto);
  auto();
})();

// Cart panel open/close
const cartBtn = $("#cartBtn");
const cartPanel = $("#cartPanel");
const closeCart = $("#closeCart");
const openCartFooter = $("#openCartFooter");

function openCart(){ cartPanel.classList.add("open"); cartPanel.setAttribute("aria-hidden","false"); }
function hideCart(){ cartPanel.classList.remove("open"); cartPanel.setAttribute("aria-hidden","true"); }
cartBtn && cartBtn.addEventListener("click", openCart);
closeCart && closeCart.addEventListener("click", hideCart);
openCartFooter && openCartFooter.addEventListener("click", (e)=>{ e.preventDefault(); openCart(); });

// Checkout page summary
(function initCheckout(){
  if (!/checkout\.html$/.test(location.pathname)) return;
  const container = $("#summaryItems");
  const items = JSON.parse(localStorage.getItem(cartKey) || "[]");
  container.innerHTML = items.length ? "" : "<p>Keranjang masih kosong.</p>";
  let subtotal = 0;
  items.forEach(({id,qty})=>{
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    subtotal += p.price*qty;
    const row = document.createElement("div");
    row.className = "total-row";
    row.innerHTML = `<span>${p.title} × ${qty}</span><strong>${fmtIDR(p.price*qty)}</strong>`;
    container.appendChild(row);
  });
  const shipping = items.length ? (subtotal >= 200000 ? 0 : 20000) : 0;
  $("#summarySubtotal").textContent = fmtIDR(subtotal);
  $("#summaryShipping").textContent = fmtIDR(shipping);
  $("#summaryTotal").textContent = fmtIDR(subtotal + shipping);

  $("#checkoutForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    alert("Pesanan demo dibuat! Terima kasih sudah belanja di EnB Electronics n Tools. (Ini demo statis)");
    localStorage.removeItem(cartKey);
    location.href = "index.html";
  });
})();

// Initial render cart state
renderCart();
