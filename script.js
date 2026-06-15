/* ============================================
   САЙХАН ГОВЬ — JavaScript
   Ингэний Хоормогтой Зайрмаг
   ============================================ */

// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
  apiKey: "AIzaSyB5yQxlMLUXN5xgoC6WlHmIKgp1c_XieR0",
  authDomain: "saikhan-gobi-fdbee.firebaseapp.com",
  projectId: "saikhan-gobi-fdbee",
  storageBucket: "saikhan-gobi-fdbee.firebasestorage.app",
  messagingSenderId: "650891488214",
  appId: "1:650891488214:web:dcade5f5b3a0074f99d277",
  measurementId: "G-MLMLV7X1Q7"
};

let db = null;
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} else {
  console.warn("Firebase SDK not loaded. Firestore operations will be skipped.");
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const scrollY = window.scrollY;
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 10;
    const colors = ['#D4A853', '#F0C96B', '#E8734A', 'rgba(212,168,83,0.5)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.cssText = `
      width:${size}px; height:${size}px; left:${x}%;
      bottom:0; background:${color};
      animation-duration:${duration}s; animation-delay:${delay}s;
    `;
    container.appendChild(particle);
  }
}
createParticles();

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.benefit-card, .product-card, .combo-card, .store-item, ' +
  '.channel-card, .testimonial-card, .cert-card, ' +
  '.about-images, .about-text'
).forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ===== CART SYSTEM =====
let cartItems = [];
let isWholesale = false;

const productPrices = {
  'Ингэний хоормогтой зайрмаг': { retail: 3000, wholesale: 2500 },
  'Конус зайрмаг': { retail: 3000, wholesale: 2500 }
};

function togglePrices(checked) {
  isWholesale = checked;
  
  // Update toggle UI elements if they exist
  const priceToggleCheckbox = document.getElementById('priceToggleCheckbox');
  if (priceToggleCheckbox) priceToggleCheckbox.checked = isWholesale;
  
  const retailLabel = document.getElementById('retailLabel');
  const wholesaleLabel = document.getElementById('wholesaleLabel');
  if (retailLabel && wholesaleLabel) {
    if (isWholesale) {
      retailLabel.classList.remove('active');
      wholesaleLabel.classList.add('active');
    } else {
      retailLabel.classList.add('active');
      wholesaleLabel.classList.remove('active');
    }
  }
  
  // Update checkout order type dropdown
  const forderType = document.getElementById('forderType');
  if (forderType) {
    forderType.value = isWholesale ? 'wholesale' : 'retail';
  }
  
  // Update product card prices in the grid UI
  const p1Val = productPrices['Ингэний хоормогтой зайрмаг'][isWholesale ? 'wholesale' : 'retail'];
  const p2Val = productPrices['Конус зайрмаг'][isWholesale ? 'wholesale' : 'retail'];

  const priceVanillaEl = document.getElementById('priceVanilla');
  const priceConeEl = document.getElementById('priceCone');
  if (priceVanillaEl) priceVanillaEl.innerHTML = `₮${p1Val.toLocaleString()} <small>/ аяга</small>`;
  if (priceConeEl) priceConeEl.innerHTML = `₮${p2Val.toLocaleString()} <small>/ конус</small>`;

  // Update order form input labels/prices
  const psPrice1 = document.getElementById('psPrice1');
  const psPrice2 = document.getElementById('psPrice2');
  if (psPrice1) psPrice1.textContent = `₮${p1Val.toLocaleString()}`;
  if (psPrice2) psPrice2.textContent = `₮${p2Val.toLocaleString()}`;

  // Recalculate cart items
  cartItems.forEach(item => {
    if (productPrices[item.name]) {
      item.price = isWholesale ? productPrices[item.name].wholesale : productPrices[item.name].retail;
    }
  });
  
  updateCart();
  updateTotal();
}

function changeOrderType(value) {
  togglePrices(value === 'wholesale');
}

function toggleCart() {
  document.getElementById('cartFloat').classList.toggle('open');
}

document.getElementById('cartClose').addEventListener('click', () => {
  document.getElementById('cartFloat').classList.remove('open');
});

function addToOrder(name, defaultPrice) {
  let price = defaultPrice;
  if (productPrices[name]) {
    price = isWholesale ? productPrices[name].wholesale : productPrices[name].retail;
  }
  
  const existing = cartItems.find(item => item.name === name);
  if (existing) {
    existing.qty++;
    existing.price = price;
  } else {
    cartItems.push({ name, price, qty: 1 });
  }
  updateCart();
  showNotification(`✅ "${name}" нэмэгдлээ!`);
  document.getElementById('cartFloat').classList.add('open');
}

function showNotification(msg) {
  const n = document.createElement('div');
  n.style.cssText = `
    position:fixed; top:100px; right:30px; z-index:9999;
    background:var(--gold); color:#0D0B08;
    padding:12px 20px; border-radius:12px;
    font-weight:700; font-size:0.88rem;
    box-shadow:0 8px 24px rgba(212,168,83,0.4);
    animation:slideUp 0.3s ease; transition:opacity 0.3s ease;
  `;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 2200);
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  updateCart();
}

function updateCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const totalAmount = document.getElementById('totalAmount');
  const btnCheckout = document.getElementById('btnCheckout');

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  cartCount.textContent = totalItems;

  if (cartItems.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Захиалга хоосон байна</p>';
    cartTotal.style.display = 'none';
    btnCheckout.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cartItems.map((item, i) => `
      <div class="cart-item">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">×${item.qty}</span>
        <span class="cart-item-price">₮${(item.price * item.qty).toLocaleString()}</span>
        <button class="cart-item-del" onclick="removeCartItem(${i})">✕</button>
      </div>
    `).join('');
    totalAmount.textContent = `₮${totalPrice.toLocaleString()}`;
    cartTotal.style.display = 'flex';
    btnCheckout.style.display = 'block';
  }
}

function goToCheckout() {
  document.getElementById('cartFloat').classList.remove('open');
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('qty1').value = 0;
    document.getElementById('qty2').value = 0;
    
    cartItems.forEach(item => {
      if (item.name.includes('Ингэний хоормогтой')) document.getElementById('qty1').value = item.qty;
      else if (item.name.includes('Конус')) document.getElementById('qty2').value = item.qty;
    });
    updateTotal();
  }, 600);
}

// ===== ORDER FORM TOTAL =====
function changeQty(id, delta) {
  const input = document.getElementById(id);
  input.value = Math.max(0, parseInt(input.value || 0) + delta);
  updateTotal();
}

function updateTotal() {
  const q1 = parseInt(document.getElementById('qty1').value) || 0;
  const q2 = parseInt(document.getElementById('qty2').value) || 0;
  
  const p1 = isWholesale ? productPrices['Ингэний хоормогтой зайрмаг'].wholesale : productPrices['Ингэний хоормогтой зайрмаг'].retail;
  const p2 = isWholesale ? productPrices['Конус зайрмаг'].wholesale : productPrices['Конус зайрмаг'].retail;
  
  const sub = q1 * p1 + q2 * p2;
  const grand = sub + 1000;
  document.getElementById('formTotal').textContent = `₮${sub.toLocaleString()}`;
  document.getElementById('formGrandTotal').textContent = `₮${grand.toLocaleString()}`;
}

// ===== ORDER FORM SUBMIT =====
async function submitOrder(event) {
  event.preventDefault();
  const btn = document.getElementById('btnSubmit');
  const submitText = document.getElementById('submitText');
  const form = document.getElementById('orderForm');
  const successMsg = document.getElementById('successMsg');

  const q1 = parseInt(document.getElementById('qty1').value) || 0;
  const q2 = parseInt(document.getElementById('qty2').value) || 0;

  if (q1 + q2 === 0) {
    alert('Та наад зах нь нэг бүтээгдэхүүн сонгоно уу!');
    return;
  }

  btn.disabled = true;
  submitText.textContent = '⏳ Илгээж байна...';

  const name = document.getElementById('fname').value;
  const phone = document.getElementById('fphone').value;
  const address = document.getElementById('faddress').value;
  const orderType = document.getElementById('forderType').value;
  const payment = document.getElementById('fpayment').value;
  const note = document.getElementById('fnote').value || 'Байхгүй';
  const orderCode = 'БГ-' + Date.now().toString().slice(-6);

  const translateTopping = (val) => {
    if (val === 'нэрс') return 'Нэрс сүмс 🫐';
    if (val === 'гүзээлзгэнэ') return 'Гүзээлзгэнэ сүмс 🍓';
    if (val === 'шоколад') return 'Шоколад сүмс 🍫';
    return 'Байхгүй';
  };

  // Read toppings for both products
  const t1 = document.getElementById('topping1') ? document.getElementById('topping1').value : 'none';
  const t2 = document.getElementById('topping2').value;

  // Prices based on current mode
  const p1 = isWholesale ? productPrices['Ингэний хоормогтой зайрмаг'].wholesale : productPrices['Ингэний хоормогтой зайрмаг'].retail;
  const p2 = isWholesale ? productPrices['Конус зайрмаг'].wholesale : productPrices['Конус зайрмаг'].retail;

  // Calculate total
  const subTotal = q1 * p1 + q2 * p2;
  const grandTotal = subTotal + 1000;

  // Build items text
  let itemsDetail = '';
  if (q1 > 0) itemsDetail += `• Ингэний хоормогтой зайрмаг (аяга): ${q1}ш (Чимэглэл: ${translateTopping(t1)}) (Үнэ: ₮${p1.toLocaleString()})\n`;
  if (q2 > 0) itemsDetail += `• Ингэний хоормогтой конус зайрмаг: ${q2}ш (Чимэглэл: ${translateTopping(t2)}) (Үнэ: ₮${p2.toLocaleString()})\n`;

  const orderTypeStr = isWholesale ? 'БӨӨНИЙ ЗАХИАЛГА (Дэлгүүр) 📦' : 'ЖИЖИГЛЭН ЗАХИАЛГА 🛒';

  // 1. Send Email Notification via Web3Forms
  const emailPayload = {
    access_key: '349453a0-1e23-4537-b10d-24ce3e661baf',
    subject: `[${isWholesale ? 'БӨӨНИЙ' : 'ЖИЖИГЛЭН'}] Сайхан Говь Захиалга: ${orderCode} - ${name} (${phone})`,
    from_name: 'Сайхан Говь Вэбсайт',
    name: name,
    email: 'no-reply@bayangovi.mn',
    message: `
🐫 ШИНЭ ЗАХИАЛГА ИРЛЭЭ (${isWholesale ? 'БӨӨНИЙ' : 'ЖИЖИГЛЭН'}) 🐫

Захиалгын код: ${orderCode}
Захиалгын төрөл: ${orderTypeStr}
Захиалагчийн нэр: ${name}
Утасны дугаар: ${phone}
Хүргэх хаяг: ${address}
Төлбөрийн арга: ${payment}
Нэмэлт тэмдэглэл: ${note}

ЗАХИАЛСАН БҮТЭЭГДЭХҮҮН:
${itemsDetail}
-----------------------------
Захиалгын дүн: ₮${subTotal.toLocaleString()}
Хүргэлтийн хөлс: ₮1,000
Нийт дүн: ₮${grandTotal.toLocaleString()}
    `
  };

  try {
    // 1. Save to Firebase Firestore (if loaded)
    if (db) {
      try {
        await db.collection('orders').add({
          code: orderCode,
          name: name,
          phone: phone,
          address: address,
          orderType: orderType,
          payment: payment,
          note: note,
          items: {
            vanillaCup: { qty: q1, topping: t1 },
            coneIcecream: { qty: q2, topping: t2 }
          },
          itemsText: itemsDetail.trim(),
          total: grandTotal,
          status: 'Шинэ',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Order saved to Firebase Firestore successfully.');
      } catch (fsError) {
        console.error('Failed to save to Firestore, continuing with email/whatsapp:', fsError);
      }
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });
    
    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('bayan_govi_orders') || '[]');
    orders.push({
      code: orderCode, name, phone, address, payment, note,
      type: orderType,
      items: { q1, q2 },
      total: grandTotal,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('bayan_govi_orders', JSON.stringify(orders));

    // 2. Build WhatsApp Message & Link (using 94968379 as recipient)
    const waText = `🐪 *САЙХАН ГОВЬ ЗАХИАЛГА [${isWholesale ? 'БӨӨНИЙ' : 'ЖИЖИГЛЭН'}]* 🐪\n\n*Код:* ${orderCode}\n*Төрөл:* ${orderTypeStr}\n*Нэр:* ${name}\n*Утас:* ${phone}\n*Хаяг:* ${address}\n*Төлбөр:* ${payment}\n*Нэмэлт:* ${note}\n\n*Захиалга:*\n${itemsDetail}\n*Нийт дүн:* ₮${grandTotal.toLocaleString()} (Хүргэлттэй)`;
    const waUrl = `https://api.whatsapp.com/send?phone=97694968379&text=${encodeURIComponent(waText)}`;

    // Show success & Configure button
    form.style.display = 'none';
    successMsg.style.display = 'block';
    document.getElementById('successCode').textContent = `Захиалгын дугаар: ${orderCode}`;
    
    const waBtn = document.getElementById('whatsappBtn');
    if (waBtn) {
      waBtn.href = waUrl;
      waBtn.style.display = 'inline-flex';
    }

    // Auto open WhatsApp in a new tab
    window.open(waUrl, '_blank');

    // Clear cart
    cartItems = [];
    updateCart();

  } catch (error) {
    console.error('Error submitting order:', error);
    alert('Захиалга илгээхэд алдаа гарлаа. Та утсаар холбогдож өгнө үү: 9496-8379');
    btn.disabled = false;
    submitText.textContent = '✅ Дахин илгээх';
  }
}

// ===== CONTACT FORM =====
async function submitContact(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  
  const name = document.getElementById('cname').value;
  const phone = document.getElementById('cphone').value;
  const message = document.getElementById('cmsg').value;

  btn.disabled = true;
  btn.textContent = '⏳ Илгээж байна...';

  const payload = {
    access_key: '349453a0-1e23-4537-b10d-24ce3e661baf',
    subject: `Сайхан Говь Вэбсайт - Санал хүсэлт: ${name} (${phone})`,
    from_name: 'Сайхан Говь Вэбсайт Санал Хүсэлт',
    name: name,
    email: 'no-reply@bayangovi.mn',
    message: `
🐫 ВЭБСАЙТААС САНАЛ ХҮСЭЛТ ИРЛЭЭ 🐫

Илгээгч: ${name}
Утасны дугаар: ${phone}

Мессеж:
${message}
    `
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    btn.textContent = '✅ Амжилттай илгээгдлээ!';
    btn.style.background = '#5A8C5A';
    setTimeout(() => {
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);

  } catch (error) {
    console.error('Error submitting contact form:', error);
    alert('Илгээхэд алдаа гарлаа. Та утсаар холбогдож санал хүсэлтээ өгнө үү: 9496-8379');
    btn.textContent = orig;
    btn.disabled = false;
  }
}

// ===== STORES MAP =====
const storeMapUrls = [
  // 1. Nomin Supermarket Dalanzadgad
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2791.9568910408544!2d104.41400267597143!3d43.576880079124016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5e165b43de25c7e1%3A0xfa53cfa15f5c15e5!2sNomin%20Supermarket!5e0!3m2!1sen!2smn!4v1718500000000!5m2!1sen!2smn",
  // 2. Cultural Palace Center Dalanzadgad
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2791.9056262423377!2d104.413812!3d43.57864835824578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5e165b42d38589ab%3A0x7d6f5fb843a0e6ad!2sCentral%20Square%20Dalanzadgad!5e0!3m2!1sen!2smn!4v1718500000000!5m2!1sen!2smn",
  // 3. Jargalant District Dalanzadgad (Local Market)
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.1156262423377!2d104.4172!3d43.5705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5e165ab50cf585df%3A0xc3cf9069d3012877!2sDalanzadgad%2C%20Mongolia!5e0!3m2!1sen!2smn!4v1718500000000!5m2!1sen!2smn",
  // 4. Coming Soon: Tavan bogd
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27918.571439778233!2d104.3845!3d43.5786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5e165ab50cf585df%3A0xc3cf9069d3012877!2sDalanzadgad%2C%20Mongolia!5e0!3m2!1sen!2smn!4v1718500000000!5m2!1sen!2smn",
  // 5. Coming Soon: Airport Road
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27918.571439778233!2d104.3845!3d43.5786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5e165ab50cf585df%3A0xc3cf9069d3012877!2sDalanzadgad%2C%20Mongolia!5e0!3m2!1sen!2smn!4v1718500000000!5m2!1sen!2smn"
];

function selectStore(index) {
  document.querySelectorAll('.store-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
  
  const mapIframe = document.getElementById('gmap_canvas');
  if (mapIframe && storeMapUrls[index]) {
    mapIframe.src = storeMapUrls[index];
  }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== PRODUCT CARD TILT =====
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('cartFloat').classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ===== INIT =====
updateTotal();

console.log('🐪 Сайхан Говь — Ингэний Хоормогтой Зайрмаг');
console.log('📍 Даланзадгад хот, Өмнөговь аймаг, Монгол улс');
console.log('📞 9496-8379 | 9902-0609');
console.log('✅ MNAS Гэрчилгээ №26-318');
