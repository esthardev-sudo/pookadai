const flowers = [
  {
    id: 101,
    name: "Sunday Kind of Love",
    price: 1499,
    description: "Roses, lisianthus & all the soft things",
    category: ["bestseller", "soft"],
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=720&q=80",
    alt: "Soft pink roses in a hand-tied bouquet"
  },
  {
    id: 102,
    name: "A Little Sunshine",
    price: 1299,
    description: "Sunny yellows for no particular reason",
    category: ["bestseller", "bright"],
    badge: "Happy bunch",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=720&q=80",
    alt: "Bright yellow seasonal flowers"
  },
  {
    id: 103,
    name: "Blush Hour",
    price: 1699,
    description: "Peonies, pretty roses & a little daydream",
    category: ["soft"],
    badge: "",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=720&q=80",
    alt: "Blush and cream flowers arranged together"
  },
  {
    id: 104,
    name: "The Good Day Bunch",
    price: 1399,
    description: "Colourful seasonal stems, just because",
    category: ["bright"],
    badge: "Seasonal",
    image: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=720&q=80",
    alt: "A cheerful mixed bouquet of fresh flowers"
  }
];

const productGrid = document.querySelector("#product-grid");
const noResults = document.querySelector("#no-results");
const searchInput = document.querySelector("#flower-search");
let selectedFilter = "all";
const cartKey = "pookadai-market-cart";

function renderFlowers() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleFlowers = flowers.filter((flower) => {
    const matchesFilter = selectedFilter === "all" || flower.category.includes(selectedFilter);
    const matchesSearch = `${flower.name} ${flower.description} ${flower.category.join(" ")}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  productGrid.innerHTML = visibleFlowers.map((flower) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${flower.image}" alt="${flower.alt}" loading="lazy">
        ${flower.badge ? `<span class="product-badge">${flower.badge}</span>` : ""}
        <button class="add-button" type="button" data-add="${flower.id}" aria-label="Add ${flower.name} to your bag">+</button>
      </div>
      <div class="product-info">
        <h3>${flower.name}</h3>
        <p>₹${flower.price.toLocaleString("en-IN")}</p>
      </div>
      <p class="product-description">${flower.description}</p>
    </article>
  `).join("");

  noResults.hidden = visibleFlowers.length > 0;
}

function updateCart() {
  let cartCount = 0;
  try {
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    if (Array.isArray(cart)) {
      cartCount = cart.reduce((total, item) => total + (item && Number.isSafeInteger(item.qty) && item.qty > 0 ? item.qty : 0), 0);
    }
  } catch (error) {
    if (error instanceof SyntaxError) console.error("Saved flower cart data is invalid.", error);
    else throw error;
  }
  document.querySelector(".cart-count").textContent = cartCount;
  document.querySelector(".cart-link").setAttribute("aria-label", `Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`);
}

document.querySelector(".category-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  selectedFilter = button.dataset.filter;
  document.querySelectorAll(".category-chip").forEach((chip) => {
    const isActive = chip === button;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderFlowers();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  let cart;
  try {
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    cart = Array.isArray(storedCart)
      ? storedCart.filter((item) => item && Number.isSafeInteger(item.id) && Number.isSafeInteger(item.qty) && item.qty > 0)
      : [];
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.error("Saved flower cart data is invalid.", error);
    cart = [];
  }
  const flowerId = Number(button.dataset.add);
  const existingItem = cart.find((item) => item.id === flowerId);
  if (existingItem) existingItem.qty += 1;
  else cart.push({ id: flowerId, qty: 1 });
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCart();
  button.textContent = "✓";
  button.setAttribute("aria-label", `${button.dataset.add} added to your bag`);
  window.setTimeout(() => {
    button.textContent = "+";
    button.setAttribute("aria-label", `Add ${button.dataset.add} to your bag`);
  }, 1000);
});
window.addEventListener("storage", (event) => {
  if (event.key === cartKey) updateCart();
});

const searchPanel = document.querySelector("#search-panel");
const searchToggle = document.querySelector(".search-toggle");
const searchClose = document.querySelector(".search-close");

function setSearchOpen(isOpen) {
  searchPanel.hidden = !isOpen;
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) searchInput.focus();
}

searchToggle.addEventListener("click", () => setSearchOpen(searchPanel.hidden));
searchClose.addEventListener("click", () => setSearchOpen(false));
searchInput.addEventListener("input", renderFlowers);

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  primaryNav.classList.toggle("is-open", isOpen);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletter-email");
  document.querySelector("#form-message").textContent = "Thanks! Newsletter sign-up isn't connected yet.";
  event.currentTarget.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderFlowers();
