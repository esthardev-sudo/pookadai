const shops = [
  { id: 1, name: "Sri Murugan Flowers", area: "Main Bazaar", rating: 4.7, delivery: true },
  { id: 2, name: "Lakshmi Flower Mart", area: "Temple Street", rating: 4.5, delivery: true },
  { id: 3, name: "Green Petals", area: "Bus Stand Road", rating: 4.3, delivery: false },
  { id: 4, name: "Annai Poo Kadai", area: "Market Road", rating: 4.6, delivery: true },
  { id: 5, name: "PooKadai Studio", area: "Chennai", rating: 5, delivery: true }
];

const flowers = [
  { id: 1, name: "Malli Poo (Jasmine)", type: "Jasmine", emoji: "🤍", color: "#fdf6e3", price: 900, unit: "kg", fresh: "Today, 5 AM", desc: "Fragrant jasmine buds, ideal for garlands and hair.", stock: true, shop: 1, popular: true },
  { id: 2, name: "Malli Poo (Jasmine)", type: "Jasmine", emoji: "🤍", color: "#fdf6e3", price: 850, unit: "kg", fresh: "Today, 6 AM", desc: "Fresh jasmine from local farms, tightly budded.", stock: true, shop: 2 },
  { id: 3, name: "Mullai Poo", type: "Jasmine", emoji: "🌼", color: "#f3f8e8", price: 700, unit: "kg", fresh: "Today, 5 AM", desc: "Soft white mullai with a sweet, light scent.", stock: true, shop: 1 },
  { id: 4, name: "Rose (Red)", type: "Rose", emoji: "🌹", color: "#fde8ee", price: 30, unit: "100g", fresh: "Today, 6 AM", desc: "Deep red roses for worship and decoration.", stock: true, shop: 1, popular: true },
  { id: 5, name: "Rose Bunch", type: "Rose", emoji: "🌹", color: "#fde8ee", price: 120, unit: "bunch", fresh: "Yesterday evening", desc: "A bunch of 10 stems, great for gifting.", stock: true, shop: 2 },
  { id: 6, name: "Thamarai (Lotus)", type: "Lotus", emoji: "🪷", color: "#fdeaf4", price: 15, unit: "piece", fresh: "Today, 5 AM", desc: "Pink lotus, picked at dawn for pooja.", stock: true, shop: 3, popular: true },
  { id: 7, name: "Thamarai (Lotus)", type: "Lotus", emoji: "🪷", color: "#fdeaf4", price: 20, unit: "piece", fresh: "Today, 7 AM", desc: "Large lotus flowers, delivered in water.", stock: false, shop: 1 },
  { id: 8, name: "Samanthi", type: "Samanthi", emoji: "🌼", color: "#fff6d6", price: 200, unit: "kg", fresh: "Today, 6 AM", desc: "Yellow and white samanthi, long lasting.", stock: true, shop: 2, popular: true },
  { id: 9, name: "Samanthi", type: "Samanthi", emoji: "🌼", color: "#fff6d6", price: 220, unit: "kg", fresh: "Today, 5 AM", desc: "Thick-petal samanthi for garlands.", stock: true, shop: 4 },
  { id: 10, name: "Sevanthi", type: "Sevanthi", emoji: "🏵️", color: "#fdeee3", price: 260, unit: "kg", fresh: "Yesterday evening", desc: "Colourful sevanthi, popular for decorations.", stock: true, shop: 4 },
  { id: 11, name: "Sevanthi", type: "Sevanthi", emoji: "🏵️", color: "#fdeee3", price: 240, unit: "kg", fresh: "Yesterday evening", desc: "Pink and white sevanthi.", stock: false, shop: 3 },
  { id: 12, name: "Kanakambaram", type: "Kanakambaram", emoji: "🌺", color: "#ffe9dc", price: 40, unit: "100g", fresh: "Today, 6 AM", desc: "Orange kanakambaram, loved for hair garlands.", stock: true, shop: 4, popular: true },
  { id: 13, name: "Kanakambaram", type: "Kanakambaram", emoji: "🌺", color: "#ffe9dc", price: 45, unit: "100g", fresh: "Today, 5 AM", desc: "Bright and fresh, sold in small packets.", stock: true, shop: 1 },
  { id: 14, name: "Marigold (Chendumalli)", type: "Marigold", emoji: "🏵️", color: "#fff0c7", price: 80, unit: "kg", fresh: "Today, 6 AM", desc: "Golden marigold for festivals and weddings.", stock: true, shop: 3 },
  { id: 101, name: "Sunday Kind of Love", type: "Bouquet", emoji: "🌷", color: "#fde8ee", price: 1499, unit: "bunch", fresh: "Made to order", desc: "Roses, lisianthus and all the soft things.", stock: true, shop: 5, popular: true },
  { id: 102, name: "A Little Sunshine", type: "Bouquet", emoji: "🌻", color: "#fff6d6", price: 1299, unit: "bunch", fresh: "Made to order", desc: "Sunny yellows for no particular reason.", stock: true, shop: 5, popular: true },
  { id: 103, name: "Blush Hour", type: "Bouquet", emoji: "💐", color: "#fdeaf4", price: 1699, unit: "bunch", fresh: "Made to order", desc: "Peonies, pretty roses and a little daydream.", stock: true, shop: 5 },
  { id: 104, name: "The Good Day Bunch", type: "Bouquet", emoji: "🌼", color: "#f3f8e8", price: 1399, unit: "bunch", fresh: "Made to order", desc: "Colourful seasonal stems, just because.", stock: true, shop: 5 }
];

const cartKey = "pookadai-market-cart";
const orderKey = "pookadai-market-last-order";
const $ = (selector) => document.querySelector(selector);
const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;
const params = new URLSearchParams(window.location.search);
const flowerById = (id) => flowers.find((flower) => flower.id === Number(id));
const shopById = (id) => shops.find((shop) => shop.id === Number(id));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

function getCart() {
  const stored = localStorage.getItem(cartKey);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) =>
      item &&
      flowerById(item.id) &&
      Number.isSafeInteger(item.qty) &&
      item.qty > 0 &&
      flowerById(item.id).stock
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Saved flower cart data is invalid.", error);
      return [];
    }
    throw error;
  }
}

function updateBadge() {
  const badge = $("#badge");
  if (badge) badge.textContent = getCart().reduce((total, item) => total + item.qty, 0);
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateBadge();
}

function toast(message) {
  let element = $("#toast");
  if (!element) {
    element = document.createElement("div");
    element.id = "toast";
    element.setAttribute("role", "status");
    document.body.append(element);
  }
  element.textContent = message;
  element.classList.add("show");
  window.setTimeout(() => element.classList.remove("show"), 1800);
}

function addToCart(id, quantity = 1) {
  const flower = flowerById(id);
  if (!flower || !flower.stock) {
    toast("Sorry, this flower is currently unavailable.");
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === flower.id);
  if (existing) existing.qty += quantity;
  else cart.push({ id: flower.id, qty: quantity });
  saveCart(cart);
  toast("Added to your bag.");
}

function totals(cart = getCart(), doorDelivery = cart.every((item) => shopById(flowerById(item.id).shop).delivery)) {
  const subtotal = cart.reduce((sum, item) => sum + flowerById(item.id).price * item.qty, 0);
  const delivery = !doorDelivery || subtotal === 0 || subtotal >= 500 ? 0 : 40;
  return { subtotal, delivery, total: subtotal + delivery };
}

function visual(flower) {
  const alt = escapeHtml(flower.name);
  const content = flower.img
    ? `<img src="${escapeHtml(flower.img)}" alt="${alt}" loading="lazy">`
    : `<span aria-hidden="true">${escapeHtml(flower.emoji)}</span>`;
  return `<div class="pic" style="background:${flower.color}" role="img" aria-label="${alt}">${content}</div>`;
}

function card(flower) {
  const shop = shopById(flower.shop);
  return `<article class="card">
    <a href="flower-details.html?id=${flower.id}" aria-label="View ${escapeHtml(flower.name)} details">${visual(flower)}</a>
    <div class="body">
      <span class="tag ${flower.stock ? "ok" : "out"}">${flower.stock ? "In stock" : "Out of stock"}</span>
      <h3>${escapeHtml(flower.name)}</h3>
      <p class="muted">🏪 ${escapeHtml(shop.name)}, ${escapeHtml(shop.area)}</p>
      <p class="muted">🌿 Fresh: ${escapeHtml(flower.fresh)}</p>
      <div class="row"><strong>${money(flower.price)}<small> / ${escapeHtml(flower.unit)}</small></strong>
        <button class="btn small" type="button" data-action="add" data-id="${flower.id}" ${flower.stock ? "" : "disabled"}>Add</button>
      </div>
    </div>
  </article>`;
}

function shopCard(shop) {
  const count = flowers.filter((flower) => flower.shop === shop.id && flower.stock).length;
  return `<a class="card" href="flowers.html?shop=${shop.id}">
    <div class="body"><h3>🏪 ${escapeHtml(shop.name)}</h3>
      <p class="muted">📍 ${escapeHtml(shop.area)}</p>
      <p>⭐ ${shop.rating.toFixed(1)} rating</p>
      <p>🌸 ${count} flowers in stock</p>
      <p class="muted">${shop.delivery ? "🚚 Door delivery available" : "🚶 Pickup only"}</p>
    </div>
  </a>`;
}

function renderLayout() {
  $("#site-header").innerHTML = `<div class="bar container">
    <a class="logo" href="index.html">🌸 Poo<span>Kadai</span></a>
    <form class="search" action="flowers.html" role="search">
      <input name="q" placeholder="Search flowers..." aria-label="Search flowers">
      <button type="submit" aria-label="Submit search">🔍</button>
    </form>
    <button class="menu" type="button" aria-label="Toggle navigation" aria-expanded="false">☰</button>
    <nav aria-label="Main navigation">
      <a href="../index.html">Home</a><a href="flowers.html">Flowers</a><a href="shops.html">Nearby Shops</a>
      <a class="cart" href="cart.html" aria-label="Cart"><span aria-hidden="true">🛒</span><b id="badge" aria-live="polite">0</b></a>
    </nav>
  </div>`;
  $("#site-footer").innerHTML = `<div class="container">
    <div><div class="logo">🌸 PooKadai</div><p>Fresh flowers from nearby shops, at your door.</p></div>
    <div><a href="flowers.html">Flowers</a><br><a href="shops.html">Shops</a><br><a href="cart.html">Cart</a></div>
    <div>Demo storefront · Sample data only · No real payments</div>
  </div>`;
  updateBadge();
}

function renderHome() {
  const types = [...new Set(flowers.map((flower) => flower.type))];
  $("#main").innerHTML = `
    <section class="hero"><div class="container">
      <h1>Fresh Flowers Delivered to Your Door</h1>
      <p>Order jasmine, roses, lotus and more from flower shops near you. Picked every morning.</p>
      <form class="herosearch" action="flowers.html" role="search">
        <input name="q" placeholder="Try jasmine, rose, lotus..." aria-label="Search flower names">
        <button class="btn" type="submit">Search</button>
      </form>
      <div class="badges"><span>🌿 Fresh Flowers</span><span>🕐 Daily Fresh Stock</span><span>🚚 Door Delivery</span><span>🏪 Nearby Flower Shops</span><span>💰 Affordable Prices</span></div>
    </div></section>
    <section class="container"><h2>Shop by flower</h2><div class="cats">
      ${types.map((type) => `<a href="flowers.html?type=${encodeURIComponent(type)}"><span aria-hidden="true">${escapeHtml(flowers.find((flower) => flower.type === type).emoji)}</span>${escapeHtml(type)}</a>`).join("")}
    </div></section>
    <section class="container" style="padding-top:0"><h2>Popular flowers</h2><div class="grid">${flowers.filter((flower) => flower.popular).map(card).join("")}</div></section>
    <section class="container" style="padding-top:0"><h2>Nearby flower shops</h2><div class="grid">${shops.map(shopCard).join("")}</div></section>
    <section class="container" style="padding-top:0"><h2>Today's fresh flowers</h2><div class="grid">${flowers.filter((flower) => flower.stock && flower.fresh.startsWith("Today")).slice(0, 4).map(card).join("")}</div></section>
    <section class="why"><div class="container"><h2>Why choose us</h2><div class="grid">
      <article class="card"><span aria-hidden="true">🌿</span><h3>Fresh Flowers</h3><p class="muted">Picked the same morning.</p></article>
      <article class="card"><span aria-hidden="true">🕐</span><h3>Daily Fresh Stock</h3><p class="muted">New stock every day.</p></article>
      <article class="card"><span aria-hidden="true">🚚</span><h3>Door Delivery</h3><p class="muted">Right to your home.</p></article>
      <article class="card"><span aria-hidden="true">🏪</span><h3>Nearby Shops</h3><p class="muted">Support local sellers.</p></article>
      <article class="card"><span aria-hidden="true">💰</span><h3>Affordable Prices</h3><p class="muted">Fair market rates.</p></article>
    </div></div></section>`;
}

function renderProducts() {
  const types = [...new Set(flowers.map((flower) => flower.type))];
  const selectedType = params.get("type") || "";
  const selectedShop = params.get("shop") || "";
  const initialQuery = params.get("q") || "";

  $("#main").innerHTML = `<section class="container">
    <h1>Fresh Flowers</h1>
    <div class="filters">
      <input id="q" type="search" placeholder="Search flowers..." value="${escapeHtml(initialQuery)}" aria-label="Search flowers">
      <select id="type" aria-label="Filter by flower type"><option value="">All types</option>${types.map((type) => `<option value="${escapeHtml(type)}" ${selectedType === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}</select>
      <select id="shop" aria-label="Filter by flower shop"><option value="">All shops</option>${shops.map((shop) => `<option value="${shop.id}" ${selectedShop === String(shop.id) ? "selected" : ""}>${escapeHtml(shop.name)}</option>`).join("")}</select>
    </div>
    <div id="grid" class="grid" aria-live="polite"></div>
  </section>`;

  const draw = () => {
    const query = $("#q").value.trim().toLocaleLowerCase();
    const type = $("#type").value;
    const shop = $("#shop").value;
    const visible = flowers.filter((flower) =>
      flower.name.toLocaleLowerCase().includes(query) &&
      (!type || flower.type === type) &&
      (!shop || flower.shop === Number(shop))
    );
    $("#grid").innerHTML = visible.length
      ? visible.map(card).join("")
      : `<p class="empty">No flowers found. Try another search.</p>`;
  };

  ["q", "type", "shop"].forEach((id) => $(`#${id}`).addEventListener(id === "q" ? "input" : "change", draw));
  draw();
}

function renderDetails() {
  const flower = flowerById(params.get("id")) || flowers[0];
  const shop = shopById(flower.shop);
  $("#main").innerHTML = `<section class="container detail">
    <div>${visual(flower)}</div><div>
      <span class="tag ${flower.stock ? "ok" : "out"}">${flower.stock ? "In stock" : "Out of stock"}</span>
      <h1>${escapeHtml(flower.name)}</h1>
      <p class="price">${money(flower.price)} <small>/ ${escapeHtml(flower.unit)}</small></p>
      <p>${escapeHtml(flower.desc)}</p>
      <ul class="facts"><li>🌿 Freshness: ${escapeHtml(flower.fresh)}</li>
        <li>🏪 ${escapeHtml(shop.name)}, ${escapeHtml(shop.area)} (⭐ ${shop.rating.toFixed(1)})</li>
        <li>${shop.delivery ? "🚚 Door delivery available" : "🚶 Pickup only"}</li>
      </ul>
      <div class="qty" aria-label="Quantity">
        <button type="button" data-action="detail-minus" aria-label="Decrease quantity">−</button>
        <span id="quantity">1</span>
        <button type="button" data-action="detail-plus" aria-label="Increase quantity">+</button>
      </div>
      <button class="btn" type="button" data-action="detail-add" data-id="${flower.id}" ${flower.stock ? "" : "disabled"}>Add to Cart</button>
    </div>
  </section>`;
}

function renderShops() {
  $("#main").innerHTML = `<section class="container">
    <h1>Nearby Flower Shops</h1>
    <p class="muted" style="margin-bottom:20px">Choose a shop to see its flowers.</p>
    <div class="grid">${shops.map(shopCard).join("")}</div>
  </section>`;
}

function renderCart() {
  const cart = getCart();
  const orderTotals = totals(cart);
  if (!cart.length) {
    $("#main").innerHTML = `<section class="container empty"><h1>Your cart is empty 🌸</h1>
      <p class="muted" style="margin-bottom:18px">Add some fresh flowers to get started.</p>
      <a class="btn" href="flowers.html">Browse flowers</a>
    </section>`;
    return;
  }

  $("#main").innerHTML = `<section class="container"><h1>Your Cart</h1><div class="two">
    <div class="box">${cart.map((item) => {
      const flower = flowerById(item.id);
      const shop = shopById(flower.shop);
      return `<div class="item">${visual(flower)}
        <div class="info"><strong>${escapeHtml(flower.name)}</strong><p class="muted">${escapeHtml(shop.name)} · ${money(flower.price)} / ${escapeHtml(flower.unit)}</p></div>
        <div class="qty" aria-label="Quantity">
          <button type="button" data-action="decrease" data-id="${flower.id}" aria-label="Decrease ${escapeHtml(flower.name)} quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-action="increase" data-id="${flower.id}" aria-label="Increase ${escapeHtml(flower.name)} quantity">+</button>
        </div>
        <strong>${money(flower.price * item.qty)}</strong>
        <button class="remove" type="button" data-action="remove" data-id="${flower.id}" aria-label="Remove ${escapeHtml(flower.name)}">✕</button>
      </div>`;
    }).join("")}</div>
    <div class="box sum"><h3>Order Summary</h3>
      <div><span>Subtotal</span><span>${money(orderTotals.subtotal)}</span></div>
      <div><span>Delivery</span><span>${orderTotals.delivery ? money(orderTotals.delivery) : "Free"}</span></div>
      <div class="total"><span>Total</span><span>${money(orderTotals.total)}</span></div>
      <p class="muted">Delivery is free above ₹500; pickup orders have no delivery fee.</p><br>
      <a class="btn" href="checkout.html">Proceed to Checkout</a>
    </div>
  </div></section>`;
}

function renderCheckout() {
  const cart = getCart();
  if (!cart.length) {
    window.location.replace("cart.html");
    return;
  }
  const pickupRequired = cart.some((item) => !shopById(flowerById(item.id).shop).delivery);
  let orderTotals = totals(cart, !pickupRequired);
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  $("#main").innerHTML = `<section class="container"><h1>Checkout</h1><div class="two">
    <form id="checkout-form" class="box">
      <h3>Delivery details</h3>
      <label for="name">Full name</label><input id="name" name="name" autocomplete="name" required maxlength="100">
      <label for="mobile">Mobile number</label><input id="mobile" name="mobile" type="tel" inputmode="numeric" pattern="[0-9]{10}" title="Enter 10 digits" autocomplete="tel" required>
      ${pickupRequired
        ? `<p class="muted">Your bag includes flowers from a pickup-only shop. Please collect this order from the listed shops.</p><input type="hidden" name="door" value="no">`
        : `<label><input id="door" type="checkbox" name="door" value="yes" checked style="width:auto"> Door delivery</label>
          <div id="delivery-fields">
            <label for="address">Delivery address</label><textarea id="address" name="address" rows="2" autocomplete="street-address" required maxlength="300"></textarea>
            <label for="location">Location / Area</label><input id="location" name="location" autocomplete="address-level2" required maxlength="100">
            <label for="pincode">Pincode</label><input id="pincode" name="pincode" inputmode="numeric" pattern="[0-9]{6}" title="Enter 6 digits" autocomplete="postal-code" required>
          </div>`}
      <label for="date">Delivery date</label><input id="date" type="date" name="date" min="${localDate}" value="${localDate}" required>
      <label for="time">Delivery time</label><select id="time" name="time"><option>6 AM - 9 AM</option><option>9 AM - 12 PM</option><option>12 PM - 4 PM</option><option>4 PM - 8 PM</option></select>
      <h3 style="margin-top:20px">Payment</h3>
      <div class="pay">
        <label><input type="radio" name="pay" value="Online Payment (demo)" checked>Online payment (demo)</label>
        <label><input type="radio" name="pay" value="Cash on Delivery">Cash on delivery</label>
      </div>
      <div id="demoPay" style="display:block"><p class="muted">Demo checkout only. No payment is processed and no card details are collected.</p></div>
      <br><button class="btn" type="submit">Place Demo Order</button>
    </form>
    <div class="box sum"><h3>Order Summary</h3>
      ${cart.map((item) => `<div><span>${escapeHtml(flowerById(item.id).name)} × ${item.qty}</span><span>${money(flowerById(item.id).price * item.qty)}</span></div>`).join("")}
      <div><span>Subtotal</span><span id="checkout-subtotal">${money(orderTotals.subtotal)}</span></div>
      <div><span>Delivery</span><span id="checkout-delivery">${orderTotals.delivery ? money(orderTotals.delivery) : "Free"}</span></div>
      <div class="total"><span>Total</span><span id="checkout-total">${money(orderTotals.total)}</span></div>
    </div>
  </div></section>`;

  const doorCheckbox = $("#door");
  if (doorCheckbox) {
    doorCheckbox.addEventListener("change", () => {
      const deliveryFields = $("#delivery-fields");
      deliveryFields.hidden = !doorCheckbox.checked;
      deliveryFields.querySelectorAll("input, textarea").forEach((field) => {
        field.required = doorCheckbox.checked;
      });
      orderTotals = totals(cart, doorCheckbox.checked);
      $("#checkout-delivery").textContent = orderTotals.delivery ? money(orderTotals.delivery) : "Free";
      $("#checkout-total").textContent = money(orderTotals.total);
    });
  }

  $("#checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const doorDelivery = !pickupRequired && formData.door === "yes";
    const order = {
      ...formData,
      door: doorDelivery,
      deliveryOption: doorDelivery ? "Door delivery" : "Pickup from shop",
      id: `PK${Date.now().toString().slice(-6)}`,
      items: cart.map((item) => ({ ...flowerById(item.id), qty: item.qty })),
      totals: orderTotals
    };
    localStorage.setItem(orderKey, JSON.stringify(order));
    saveCart([]);
    window.location.href = "order-success.html";
  });
}

function renderSuccess() {
  const storedOrder = localStorage.getItem(orderKey);
  let order = null;
  if (storedOrder) {
    try {
      order = JSON.parse(storedOrder);
    } catch (error) {
      if (error instanceof SyntaxError) console.error("Saved order data is invalid.", error);
      else throw error;
    }
  }

  if (!order || !Array.isArray(order.items) || !order.totals) {
    $("#main").innerHTML = `<section class="container empty"><h1>No recent order</h1><a class="btn" href="flowers.html">Browse flowers</a></section>`;
    return;
  }

  $("#main").innerHTML = `<section class="container"><div class="box" style="max-width:560px;margin:auto">
    <div class="empty" style="padding:10px"><div class="ok-icon" aria-hidden="true">✅</div>
      <h1>Demo order placed!</h1><p class="muted">Order ID: <strong>${escapeHtml(order.id)}</strong></p>
    </div>
    <div class="sum">${order.items.map((item) => `<div><span>${escapeHtml(item.name)} × ${Number(item.qty)}</span><span>${money(item.price * item.qty)}</span></div>`).join("")}
      <div class="total"><span>Total</span><span>${money(order.totals.total)}</span></div>
    </div><br>
    ${order.door
      ? `<p>📦 Door delivery for <strong>${escapeHtml(order.name)}</strong>: ${escapeHtml(order.address)}, ${escapeHtml(order.location)} - ${escapeHtml(order.pincode)}</p>`
      : `<p>🏪 Pickup order for <strong>${escapeHtml(order.name)}</strong> from the selected flower shop${order.items.length > 1 ? "s" : ""}.</p>`}
    <p>🕐 ${escapeHtml(order.date)}, ${escapeHtml(order.time)}</p>
    <p>💳 ${escapeHtml(order.pay)}</p>
    <p class="muted">This is a demo confirmation. No real order or payment was submitted.</p>
    <br><a class="btn" href="index.html">Back to Flower Market</a>
  </div></section>`;
}

const renderers = {
  home: renderHome,
  products: renderProducts,
  details: renderDetails,
  shops: renderShops,
  cart: renderCart,
  checkout: renderCheckout,
  success: renderSuccess
};

function changeQuantity(id, amount) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === Number(id));
  if (!item) return;
  item.qty = Math.max(1, item.qty + amount);
  saveCart(cart);
  renderCart();
}

document.addEventListener("click", (event) => {
  const menuButton = event.target.closest(".menu");
  if (menuButton) {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
    document.body.classList.toggle("open", isOpen);
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "add") addToCart(id);
  if (action === "detail-add") {
    addToCart(id, Number($("#quantity").textContent));
  }
  if (action === "detail-minus") {
    $("#quantity").textContent = Math.max(1, Number($("#quantity").textContent) - 1);
  }
  if (action === "detail-plus") {
    $("#quantity").textContent = Math.min(99, Number($("#quantity").textContent) + 1);
  }
  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
  if (action === "remove") {
    saveCart(getCart().filter((item) => item.id !== Number(id)));
    renderCart();
  }
});

renderLayout();
const currentPage = document.body.dataset.page;
if (!renderers[currentPage]) {
  throw new Error(`Unknown storefront page: ${currentPage}`);
}
renderers[currentPage]();
