/* scripts.js
   Lógica básica: productos demo, búsqueda, orden, carrito (localStorage),
   modales (cart + login) y accesibilidad mínima.
*/

// Datos de ejemplo
const PRODUCTS = [
  { id: "p1", title: "X-Force 350", price: 159900000, category: "Motos", badge: "Nuevo" },
  { id: "p2", title: "Repuesto - Filtro de aire", price: 45000, category: "Repuestos" },
  { id: "p3", title: "Casco Integral", price: 220000, category: "Ropa y Casco" },
  { id: "p4", title: "Maleta lateral 30L", price: 330000, category: "Accesorios" },
  { id: "p5", title: "Aceite 4T 1L", price: 42000, category: "Repuestos" },
  { id: "p6", title: "Guantes touring", price: 90000, category: "Ropa y Casco" }
];

// Formato de moneda (COP)
const fmt = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v);

// Selectores
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItemsWrap = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const yearSpan = document.getElementById('year');

// Estado de carrito
let CART = JSON.parse(localStorage.getItem('cfmall_cart') || "{}");

// Renders
function renderProducts(list){
  productGrid.innerHTML = '';
  if(!list.length){
    productGrid.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 400 220"><rect width="100%" height="100%" rx="8" fill="#eef6f8"></rect>
          <text x="16" y="120" fill="#7b8a90" font-size="20">${p.title}</text></svg>
      </div>
      <div class="product-info">
        <div class="product-title">${p.title}</div>
        <div class="product-price">${fmt(p.price)}</div>
        <div class="product-meta" style="color:var(--muted);font-size:13px">${p.category} ${p.badge? ' • '+p.badge : ''}</div>
      </div>
      <div class="card-actions">
        <button class="btn ghost view" data-id="${p.id}">Ver</button>
        <button class="btn primary add" data-id="${p.id}">Añadir al carrito</button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  // Bind botones
  document.querySelectorAll('.add').forEach(b => b.addEventListener('click', e => {
    const id = e.currentTarget.dataset.id;
    addToCart(id,1);
  }));
  document.querySelectorAll('.view').forEach(b => b.addEventListener('click', e => {
    const id = e.currentTarget.dataset.id;
    const p = PRODUCTS.find(x=>x.id===id);
    alert(`${p.title}\n\nPrecio: ${fmt(p.price)}\nCategoría: ${p.category}`);
  }));
}

// Filtrado y orden
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  let out = PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  const sort = sortSelect.value;
  if(sort === 'price-asc') out.sort((a,b)=>a.price-b.price);
  else if(sort === 'price-desc') out.sort((a,b)=>b.price-a.price);
  // else popular - keep order
  renderProducts(out);
}

// Carrito: agregar, renderizar, persistir
function saveCart(){ localStorage.setItem('cfmall_cart', JSON.stringify(CART)); }

function addToCart(id, qty=1){
  if(!CART[id]) CART[id] = 0;
  CART[id] += qty;
  saveCart();
  updateCartCount();
  showCartToast(`${qty} × añadido`);
}

function removeFromCart(id){
  delete CART[id];
  saveCart();
  renderCart();
  updateCartCount();
}

function setQty(id, qty){
  if(qty <= 0) removeFromCart(id);
  else { CART[id] = qty; saveCart(); renderCart(); updateCartCount(); }
}

function updateCartCount(){
  const total = Object.values(CART).reduce((a,b)=>a+b,0);
  cartCount.textContent = total;
}

function renderCart(){
  cartItemsWrap.innerHTML = '';
  const ids = Object.keys(CART);
  if(ids.length === 0){
    cartItemsWrap.innerHTML = '<p>Tu carrito está vacío.</p>';
    cartTotalEl.textContent = fmt(0);
    return;
  }
  let total = 0;
  ids.forEach(id=>{
    const p = PRODUCTS.find(x=>x.id===id);
    const qty = CART[id];
    const sub = p.price * qty;
    total += sub;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:700">${p.title}</div>
        <div style="color:var(--muted)">${fmt(p.price)} × ${qty} = ${fmt(sub)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <input type="number" class="qty" min="0" value="${qty}" data-id="${id}" aria-label="Cantidad ${p.title}" />
        <button class="btn ghost remove" data-id="${id}">Eliminar</button>
      </div>
    `;
    cartItemsWrap.appendChild(div);
  });
  cartTotalEl.textContent = fmt(total);

  // bind qty inputs
  cartItemsWrap.querySelectorAll('.qty').forEach(q => {
    q.addEventListener('change', e=>{
      const id = e.target.dataset.id;
      const val = parseInt(e.target.value || '0', 10);
      setQty(id, val);
    });
  });
  cartItemsWrap.querySelectorAll('.remove').forEach(b => b.addEventListener('click', e=>{
    removeFromCart(e.currentTarget.dataset.id);
  }));
}

// pequeños toasts (usando alertaria simple)
function showCartToast(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.right = '18px';
  el.style.bottom = '18px';
  el.style.background = 'var(--accent)';
  el.style.color = '#fff';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '8px';
  el.style.boxShadow = '0 6px 18px rgba(11,75,90,0.2)';
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity = '0', 1200);
  setTimeout(()=> el.remove(), 1800);
}

// Event listeners y acceso a modales
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS);
  applyFilters();
  updateCartCount();
  renderCart();
  yearSpan.textContent = new Date().getFullYear();
});

// Buscador en tiempo real
searchInput.addEventListener('input', () => applyFilters());
sortSelect.addEventListener('change', () => applyFilters());

// Cart modal
cartBtn.addEventListener('click', () => {
  if(typeof cartModal.showModal === 'function'){
    renderCart();
    cartModal.showModal();
  } else {
    alert('Tu navegador no soporta <dialog>. Abre el carrito en versión simplificada.');
  }
});
document.getElementById('closeCart')?.addEventListener('click', ()=> cartModal.close());

// Login modal
loginBtn.addEventListener('click', () => {
  if(typeof loginModal.showModal === 'function') loginModal.showModal();
  else alert('Modal no soportado.');
});
document.getElementById('closeLogin')?.addEventListener('click', ()=> loginModal.close());
document.getElementById('signin')?.addEventListener('click', (e) => {
  e.preventDefault();
  loginModal.close();
  alert('Inicio de sesión demo (no se autentica realmente).');
});

// Checkout demo
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  alert('Flujo de pago demo. Redirigir a pasarela en implementación real.');
  cartModal.close();
});

// menú móvil simple
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
menuBtn?.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  if(mainNav.style.display === 'block') mainNav.style.display = '';
  else mainNav.style.display = 'block';
});
