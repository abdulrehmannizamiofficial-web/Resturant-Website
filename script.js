/* ============================================================
   NIZAMI BITES — Shared site script (used on every page)
   ============================================================ */

/* ---------------- Menu Data ---------------- */
const menuItems = [
  {id:1, name:"Chicken Biryani", cat:"biryani", price:450, img:"images/chicken-biryani.jpg", desc:"Fragrant basmati rice cooked with spiced chicken and fried onions.", tag:"Bestseller"},
  {id:2, name:"Beef Biryani", cat:"biryani", price:500, img:"images/beef-biryani.jpg", desc:"Rich, aromatic biryani with tender beef chunks."},
  {id:3, name:"Chicken Karahi (Half)", cat:"karahi", price:900, img:"images/chicken-karahi.webp", desc:"Classic tomato-based chicken karahi, cooked fresh in desi ghee."},
  {id:4, name:"Chicken Karahi (Full)", cat:"karahi", price:1700, img:"images/chicken-karahi.webp", desc:"Full portion of our signature spicy chicken karahi."},
  {id:5, name:"Chicken Tikka Pizza", cat:"pizza", price:950, img:"images/pizza-tikka.webp", desc:"Loaded with spicy chicken tikka, capsicum and mozzarella."},
  {id:6, name:"Fajita Pizza", cat:"pizza", price:1050, img:"images/pizza-fajita.jpg", desc:"Grilled chicken fajita, onions, bell peppers, melted cheese.", tag:"Bestseller"},
  {id:7, name:"Beef Zinger Burger", cat:"burger", price:550, img:"images/beef-burger.jpg", desc:"Crispy beef zinger patty, lettuce, mayo, sesame bun."},
  {id:8, name:"Crispy Chicken Burger", cat:"burger", price:500, img:"images/burger.jpg", desc:"Golden fried chicken fillet with house sauce."},
  {id:9, name:"Chicken Shawarma", cat:"shawarma", price:300, img:"images/chicken-shawarma.jpg", desc:"Grilled chicken strips, garlic sauce, fresh veggies, wrapped.", tag:"Bestseller"},
  {id:10, name:"Beef Shawarma", cat:"shawarma", price:320, img:"images/beef-shawarma.webp", desc:"Juicy beef shawarma with tahini and pickles."},
  {id:11, name:"Spicy Hot Wings (6pc)", cat:"wings", price:600, img:"images/spicy-hot-wings.jpg", desc:"Crispy fried wings tossed in fiery hot sauce."},
  {id:12, name:"BBQ Hot Wings (6pc)", cat:"wings", price:600, img:"images/bbq-hot-wings.jpg", desc:"Smoky BBQ glazed chicken wings, char-grilled finish."},
  {id:13, name:"Chicken Alfredo Pasta", cat:"pasta", price:750, img:"images/chicken-alfredo-pasta.webp", desc:"Creamy alfredo sauce, grilled chicken, parmesan."},
  {id:14, name:"Chicken Tikka Pasta", cat:"pasta", price:780, img:"images/chicken-tikka-pasta.webp", desc:"Fusion pasta with spicy chicken tikka and tomato cream sauce."},
  {id:15, name:"Chicken Samosa (6pc)", cat:"samosa", price:250, img:"images/samosa.png", desc:"Crispy fried samosas filled with spiced chicken keema."},
  {id:16, name:"Vegetable Samosa (6pc)", cat:"samosa", price:200, img:"images/samosa.png", desc:"Golden pastry filled with spiced potato and peas."},
  {id:17, name:"Gulab Jamun (4pc)", cat:"sweets", price:250, img:"images/gulab-jamun.webp", desc:"Soft, syrup-soaked classic South Asian sweet."},
  {id:18, name:"Kheer", cat:"sweets", price:200, img:"images/kheer.jpg", desc:"Creamy rice pudding garnished with nuts."},
  {id:19, name:"Vanilla Ice Cream", cat:"icecream", price:180, img:"images/vanilla-icecream.jpg", desc:"Classic creamy vanilla scoop."},
  {id:20, name:"Chocolate Fudge Ice Cream", cat:"icecream", price:220, img:"images/chocolate-icecream.webp", desc:"Rich chocolate ice cream with fudge swirl."},
  {id:21, name:"Soft Drink (Regular)", cat:"drinks", price:100, img:"images/soft-drink.jpg", desc:"Chilled Coke, Pepsi, Sprite or Fanta."},
  {id:22, name:"Fresh Lemonade", cat:"drinks", price:150, img:"images/fresh-lemonade.jpg", desc:"Fresh-squeezed, chilled and refreshing."},
  {id:23, name:"Mineral Water", cat:"drinks", price:60, img:"images/mineral-water.jpg", desc:"500ml chilled bottled water."},
];

const DELIVERY_FEE = 100;

/* ---------------- Cart (persisted across all 5 pages) ---------------- */
function getCart(){ return JSON.parse(localStorage.getItem('nb_cart') || '{}'); }
function saveCart(c){ localStorage.setItem('nb_cart', JSON.stringify(c)); }
let cart = getCart();

function getCartCount(){ return Object.values(cart).reduce((a,b)=>a+b, 0); }
function getSubtotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const item = menuItems.find(m=>m.id == id);
    return item ? sum + (item.price * qty) : sum;
  }, 0);
}

function addToCart(id, btnEl){
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderControl(id);
  renderCart();
  if(btnEl){
    btnEl.classList.remove('bump'); void btnEl.offsetWidth; btnEl.classList.add('bump');
  }
}
function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderControl(id);
  renderCart();
}
function removeFromCart(id){
  delete cart[id];
  saveCart(cart);
  renderControl(id);
  renderCart();
}

/* ---------------- Menu Grid (menu.html only) ---------------- */
function renderMenu(filterCat = 'all', searchTerm = ''){
  const menuGrid = document.getElementById('menuGrid');
  if(!menuGrid) return;
  menuGrid.innerHTML = '';
  const filtered = menuItems.filter(item=>{
    const matchesCat = filterCat === 'all' || item.cat === filterCat;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if(filtered.length === 0){
    menuGrid.innerHTML = '<div class="no-results">No items found. Try a different search or category.</div>';
    return;
  }

  filtered.forEach((item, i)=>{
    const card = document.createElement('div');
    card.className = 'menu-card reveal';
    card.style.transitionDelay = (i % 6) * 0.06 + 's';
    card.innerHTML = `
      <div class="menu-card-media">
        ${item.tag ? `<span class="tag">${item.tag}</span>` : ''}
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-card-body">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer">
          <div class="menu-card-price">Rs. ${item.price}</div>
          <div id="ctrl-${item.id}"></div>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
    renderControl(item.id);
    observeReveal(card);
  });
}

function renderControl(id){
  const el = document.getElementById(`ctrl-${id}`);
  if(!el) return;
  const qty = cart[id] || 0;
  if(qty === 0){
    el.innerHTML = `<button class="add-btn" onclick="addToCart(${id}, this)">+ Add</button>`;
  }else{
    el.innerHTML = `
      <div class="qty-stepper">
        <button onclick="changeQty(${id}, -1)">−</button>
        <span>${qty}</span>
        <button onclick="changeQty(${id}, 1)">+</button>
      </div>
    `;
  }
}

/* ---------------- Featured Items (index.html only) ---------------- */
function renderFeatured(){
  const el = document.getElementById('featuredGrid');
  if(!el) return;
  const featured = menuItems.filter(i=>i.tag === 'Bestseller');
  el.innerHTML = '';
  featured.forEach((item, i)=>{
    const card = document.createElement('div');
    card.className = 'menu-card reveal';
    card.style.transitionDelay = (i % 6) * 0.08 + 's';
    card.innerHTML = `
      <div class="menu-card-media">
        <span class="tag">${item.tag}</span>
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-card-body">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer">
          <div class="menu-card-price">Rs. ${item.price}</div>
          <a href="menu.html" class="add-btn" style="text-decoration:none;">View</a>
        </div>
      </div>
    `;
    el.appendChild(card);
    observeReveal(card);
  });
}

/* ---------------- Cart Drawer (present on every page) ---------------- */
function renderCart(){
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsEl = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartDelivery = document.getElementById('cartDelivery');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  if(!cartBadge) return;

  const count = getCartCount();
  cartBadge.textContent = count;

  if(count === 0){
    cartItemsEl.innerHTML = `<div class="cart-empty"><span class="emoji">🛒</span>Your cart is empty.<br>Add something tasty!</div>`;
    checkoutBtn.disabled = true;
  }else{
    cartItemsEl.innerHTML = '';
    Object.entries(cart).forEach(([id,qty])=>{
      const item = menuItems.find(m=>m.id == id);
      if(!item) return;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-media"><img src="${item.img}" alt="${item.name}"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">Rs. ${item.price} x ${qty} = Rs. ${item.price*qty}</div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button onclick="changeQty(${item.id}, -1)">−</button>
              <span>${qty}</span>
              <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });
    checkoutBtn.disabled = false;
  }

  const subtotal = getSubtotal();
  const delivery = count > 0 ? DELIVERY_FEE : 0;
  cartSubtotal.textContent = `Rs. ${subtotal}`;
  cartDelivery.textContent = `Rs. ${delivery}`;
  cartTotal.textContent = `Rs. ${subtotal + delivery}`;
}

function initCartDrawer(){
  const cartDrawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('overlay');
  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCart');
  if(!cartDrawer) return;

  cartBtn.addEventListener('click', ()=>{
    cartDrawer.classList.add('open');
    overlay.classList.add('show');
  });
  closeCartBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', ()=>{ closeCart(); closeCheckoutModal(); });
}
function closeCart(){
  const cartDrawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('overlay');
  if(!cartDrawer) return;
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
}

/* ---------------- Checkout Modal (login-gated) ---------------- */
let pendingCheckout = false;

function initCheckoutModal(){
  const modalOverlay = document.getElementById('modalOverlay');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const backToCartBtn = document.getElementById('backToCartBtn');
  const codOption = document.getElementById('codOption');
  const jazzOption = document.getElementById('jazzOption');
  const jazzBox = document.getElementById('jazzBox');
  const checkoutForm = document.getElementById('checkoutForm');
  if(!modalOverlay) return;

  checkoutBtn.addEventListener('click', ()=>{
    if(!getCurrentUser()){
      closeCart();
      pendingCheckout = true;
      openAuthModal('Please login or sign up to place your order.');
      return;
    }
    closeCart();
    modalOverlay.classList.add('show');
  });

  backToCartBtn.addEventListener('click', ()=>{
    closeCheckoutModal();
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('overlay').classList.add('show');
  });

  [codOption, jazzOption].forEach(opt=>{
    opt.addEventListener('click', ()=>{
      codOption.classList.remove('selected');
      jazzOption.classList.remove('selected');
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      jazzBox.classList.toggle('show', opt === jazzOption);
    });
  });

  checkoutForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const payment = document.querySelector('input[name="payment"]:checked').value === 'jazzcash' ? 'JazzCash' : 'Cash on Delivery';

    let orderText = `Hi Nizami Bites! I'd like to place an order.%0A%0A`;
    orderText += `*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A*Payment:* ${payment}%0A%0A*Order:*%0A`;

    Object.entries(cart).forEach(([id,qty])=>{
      const item = menuItems.find(m=>m.id == id);
      if(!item) return;
      orderText += `- ${item.name} x${qty} = Rs. ${item.price*qty}%0A`;
    });

    const subtotal = getSubtotal();
    orderText += `%0ASubtotal: Rs. ${subtotal}%0ADelivery: Rs. ${DELIVERY_FEE}%0A*Total: Rs. ${subtotal + DELIVERY_FEE}*`;

    const waLink = `https://wa.me/923292440275?text=${orderText}`;
    window.open(waLink, '_blank');

    closeCheckoutModal();
    alert('Your order details are ready on WhatsApp — hit send there to confirm your order with Nizami Bites!');

    cart = {};
    saveCart(cart);
    renderMenu(activeCat, activeSearch);
    renderCart();
    this.reset();
    codOption.click();
  });
}
function closeCheckoutModal(){
  const modalOverlay = document.getElementById('modalOverlay');
  if(modalOverlay) modalOverlay.classList.remove('show');
}

/* ---------------- Login / Sign Up (demo, frontend-only) ---------------- */
function getUsers(){ return JSON.parse(localStorage.getItem('nb_users') || '[]'); }
function saveUsers(users){ localStorage.setItem('nb_users', JSON.stringify(users)); }
function getCurrentUser(){ return JSON.parse(localStorage.getItem('nb_current_user') || 'null'); }
function setCurrentUser(user){
  localStorage.setItem('nb_current_user', JSON.stringify(user));
  renderAuthArea();
}
function logout(){
  localStorage.removeItem('nb_current_user');
  renderAuthArea();
}

function renderAuthArea(){
  const authArea = document.getElementById('authArea');
  if(!authArea) return;
  const user = getCurrentUser();
  if(user){
    authArea.innerHTML = `
      <div class="user-pill" id="userPill" title="Logged in as ${user.name}">
        <span class="user-pill-avatar">${user.name.charAt(0).toUpperCase()}</span>
        <span class="user-pill-name">${user.name.split(' ')[0]}</span>
      </div>
    `;
    document.getElementById('userPill').addEventListener('click', ()=>{
      if(confirm(`Logged in as ${user.name} (${user.email}).\n\nLogout?`)){
        logout();
      }
    });
  }else{
    authArea.innerHTML = `
      <button class="icon-btn" id="loginBtn" title="Login / Sign Up">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </button>
    `;
    document.getElementById('loginBtn').addEventListener('click', ()=>openAuthModal());
  }
}

function openAuthModal(message){
  const authModalOverlay = document.getElementById('authModalOverlay');
  const noteEl = document.getElementById('authGateNote');
  if(!authModalOverlay) return;
  if(noteEl){
    if(message){ noteEl.textContent = message; noteEl.style.display = 'block'; }
    else{ noteEl.style.display = 'none'; }
  }
  authModalOverlay.classList.add('show');
}
function closeAuth(){
  const authModalOverlay = document.getElementById('authModalOverlay');
  if(authModalOverlay) authModalOverlay.classList.remove('show');
  pendingCheckout = false;
}

function switchAuthTab(tab){
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const loginPane = document.getElementById('loginPane');
  const signupPane = document.getElementById('signupPane');
  if(tab === 'login'){
    loginTabBtn.classList.add('active');
    signupTabBtn.classList.remove('active');
    loginPane.style.display = 'block';
    signupPane.style.display = 'none';
  }else{
    signupTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
    signupPane.style.display = 'block';
    loginPane.style.display = 'none';
  }
}

function afterAuthSuccess(){
  closeAuth();
  const modalOverlay = document.getElementById('modalOverlay');
  if(pendingCheckout && modalOverlay){
    pendingCheckout = false;
    modalOverlay.classList.add('show');
  }
}

function initAuthModal(){
  const authModalOverlay = document.getElementById('authModalOverlay');
  if(!authModalOverlay) return;
  const closeAuthModal = document.getElementById('closeAuthModal');
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  closeAuthModal.addEventListener('click', closeAuth);
  authModalOverlay.addEventListener('click', (e)=>{ if(e.target === authModalOverlay) closeAuth(); });
  loginTabBtn.addEventListener('click', ()=>switchAuthTab('login'));
  signupTabBtn.addEventListener('click', ()=>switchAuthTab('signup'));

  signupForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const users = getUsers();
    if(users.some(u=>u.email === email)){
      alert('An account with this email already exists. Please login instead.');
      switchAuthTab('login');
      return;
    }
    users.push({name, email, password});
    saveUsers(users);
    setCurrentUser({name, email});
    afterAuthSuccess();
    this.reset();
  });

  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const match = users.find(u=>u.email === email && u.password === password);
    if(!match){
      alert('No matching account found. Please check your email/password, or sign up.');
      return;
    }
    setCurrentUser({name: match.name, email: match.email});
    afterAuthSuccess();
    this.reset();
  });
}

/* ---------------- Category Filter + Search (menu.html only) ---------------- */
let activeCat = 'all';
let activeSearch = '';
function initMenuControls(){
  const chips = document.querySelectorAll('.cat-chip');
  const searchInput = document.getElementById('searchInput');
  if(chips.length === 0) return;

  const params = new URLSearchParams(window.location.search);
  const preset = params.get('cat');
  if(preset){
    chips.forEach(c=>c.classList.remove('active'));
    const target = document.querySelector(`.cat-chip[data-cat="${preset}"]`);
    if(target){ target.classList.add('active'); activeCat = preset; }
  }

  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.cat;
      renderMenu(activeCat, activeSearch);
    });
  });

  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      activeSearch = e.target.value;
      if(activeSearch.trim() !== ''){
        chips.forEach(c=>c.classList.remove('active'));
        document.querySelector('.cat-chip[data-cat="all"]').classList.add('active');
        activeCat = 'all';
      }
      renderMenu(activeCat, activeSearch);
    });
  }
}

/* ---------------- Contact Form (contact.html only) ---------------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    let text = `Hi Nizami Bites! I have a message.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Message:* ${message}`;
    window.open(`https://wa.me/923292440275?text=${text}`, '_blank');
    this.reset();
  });
}

/* ---------------- Scroll Reveal Animations ---------------- */
let revealObserver;
function observeReveal(el){
  if(!revealObserver){
    revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
  }
  revealObserver.observe(el);
}
function initScrollReveal(){
  document.querySelectorAll('.reveal').forEach(el=>observeReveal(el));
}

/* ---------------- Back to Top ---------------- */
function initBackToTop(){
  const backToTop = document.getElementById('backToTop');
  if(!backToTop) return;
  window.addEventListener('scroll', ()=>{
    backToTop.classList.toggle('show', window.scrollY > 400);
  });
  backToTop.addEventListener('click', ()=>{
    window.scrollTo({top:0, behavior:'smooth'});
  });
}

/* ---------------- Init ---------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  requestAnimationFrame(()=>document.body.classList.add('loaded'));
  renderAuthArea();
  initCartDrawer();
  initCheckoutModal();
  initAuthModal();
  initMenuControls();
  renderMenu(activeCat, activeSearch);
  renderFeatured();
  renderCart();
  initContactForm();
  initBackToTop();
  initScrollReveal();
});
