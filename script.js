/* ============================================
   БАЯН ГОВЬ — JavaScript
   Ингэний Хоормогтой Зайрмаг
   ============================================ */

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

function toggleCart() {
  document.getElementById('cartFloat').classList.toggle('open');
}

document.getElementById('cartClose').addEventListener('click', () => {
  document.getElementById('cartFloat').classList.remove('open');
});

function addToOrder(name, price) {
  const existing = cartItems.find(item => item.name === name);
  if (existing) {
    existing.qty++;
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
    cartItems.forEach(item => {
      if (item.name.includes('Ванилла')) document.getElementById('qty1').value = item.qty;
      else if (item.name.includes('Онцгой')) document.getElementById('qty2').value = item.qty;
      else if (item.name.includes('Шоколад')) document.getElementById('qty3').value = item.qty;
    });
    updateTotal();
  }, 600);
}

// ===== ORDER FORM TOTAL =====
const prices = [4500, 5500, 5000];

function changeQty(id, delta) {
  const input = document.getElementById(id);
  input.value = Math.max(0, parseInt(input.value || 0) + delta);
  updateTotal();
}

function updateTotal() {
  const q1 = parseInt(document.getElementById('qty1').value) || 0;
  const q2 = parseInt(document.getElementById('qty2').value) || 0;
  const q3 = parseInt(document.getElementById('qty3').value) || 0;
  const sub = q1 * prices[0] + q2 * prices[1] + q3 * prices[2];
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
  const q3 = parseInt(document.getElementById('qty3').value) || 0;

  if (q1 + q2 + q3 === 0) {
    alert('Та наад зах нь нэг бүтээгдэхүүн сонгоно уу!');
    return;
  }

  btn.disabled = true;
  submitText.textContent = '⏳ Илгээж байна...';

  const name = document.getElementById('fname').value;
  const phone = document.getElementById('fphone').value;
  const address = document.getElementById('faddress').value;
  const payment = document.getElementById('fpayment').value;
  const note = document.getElementById('fnote').value || 'Байхгүй';
  const orderCode = 'БГ-' + Date.now().toString().slice(-6);

  // Calculate total
  const subTotal = q1 * 4500 + q2 * 5500 + q3 * 5000;
  const grandTotal = subTotal + 1000;

  // Build items text
  let itemsDetail = '';
  if (q1 > 0) itemsDetail += `• Ванилла Зайрмаг: ${q1}ш\n`;
  if (q2 > 0) itemsDetail += `• Баян Говь Онцгой: ${q2}ш\n`;
  if (q3 > 0) itemsDetail += `• Хар Шоколад: ${q3}ш\n`;

  // 1. Send Email Notification via Web3Forms
  const emailPayload = {
    access_key: '349453a0-1e23-4537-b10d-24ce3e661baf',
    subject: `Баян Говь Захиалга: ${orderCode} - ${name} (${phone})`,
    from_name: 'Баян Говь Вэбсайт',
    name: name,
    email: 'no-reply@bayangovi.mn',
    message: `
🐫 ШИНЭ ЗАХИАЛГА ИРЛЭЭ 🐫

Захиалгын код: ${orderCode}
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
      items: { q1, q2, q3 },
      total: grandTotal,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('bayan_govi_orders', JSON.stringify(orders));

    // 2. Build WhatsApp Message & Link (using 99969000 as recipient)
    const waText = `🐪 *БАЯН ГОВЬ ЗАХИАЛГА* 🐪\n\n*Код:* ${orderCode}\n*Нэр:* ${name}\n*Утас:* ${phone}\n*Хаяг:* ${address}\n*Төлбөр:* ${payment}\n*Нэмэлт:* ${note}\n\n*Захиалга:*\n${itemsDetail}\n*Нийт дүн:* ₮${grandTotal.toLocaleString()} (Хүргэлттэй)`;
    const waUrl = `https://api.whatsapp.com/send?phone=97699969000&text=${encodeURIComponent(waText)}`;

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
    alert('Захиалга илгээхэд алдаа гарлаа. Та утсаар холбогдож өгнө үү: 9996-9000');
    btn.disabled = false;
    submitText.textContent = '✅ Дахин илгээх';
  }
}

// ===== CONTACT FORM =====
function submitContact(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = '✅ Амжилттай илгээгдлээ!';
  btn.disabled = true;
  btn.style.background = '#5A8C5A';
  setTimeout(() => {
    event.target.reset();
    btn.textContent = orig;
    btn.disabled = false;
    btn.style.background = '';
  }, 3000);
}

// ===== STORES MAP =====
function selectStore(index) {
  document.querySelectorAll('.store-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.map-pin').forEach((pin, i) => {
    pin.style.transform = i === index
      ? 'translate(-50%, -50%) scale(1.6)'
      : 'translate(-50%, -50%) scale(1)';
    pin.style.zIndex = i === index ? '10' : '2';
  });
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

console.log('🐪 Баян Говь — Ингэний Хоормогтой Зайрмаг');
console.log('📍 Даланзадгад хот, Өмнөговь аймаг, Монгол улс');
console.log('📞 9996-9000 | 9902-0609');
console.log('✅ MNAS Гэрчилгээ №26-318');
