// Products data
const products = [
  {
    id: 1,
    name: "DSLR Camera",
    price: 89.99,
    image: "https://amateurphotographer.com/wp-content/uploads/sites/7/2024/03/Nikon-D6-DSLR-photo-Mike-Topham-Iceland.jpg",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 129.99,
    image: "https://5.imimg.com/data5/SELLER/Default/2023/1/EW/BS/ID/99197044/men-smart-watch.png",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 74.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVFLZWrVQoitYN8rry4hyUJjBmtsK-Uo2z1Q&s",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 45.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPAkOMk6bAt8mpGIFEaeyziRxkRPaExPNaw&s",
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 25.99,
    image: "https://m.media-amazon.com/images/I/81usrjZts1L._AC_SX385_.jpg",
  },
];

// DOM references
const mainContent = document.getElementById("main-content");

const homeBtn = document.getElementById("home-btn");
const productsBtn = document.getElementById("products-btn");
const contactBtn = document.getElementById("contact-btn");

const cartBtn = document.getElementById("cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartSidebar = document.getElementById("cart");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");
const cartCountDisplay = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart");

let cart = {}; // id => {id, name, price, qty}

// --- Render Functions ---

function renderHome() {
  mainContent.innerHTML = `
    <section class="home-note" aria-live="polite">
      <p>Welcome to ShopEasy! Browse our exclusive collection of premium tech gadgets and accessories. Quality and style guaranteed!</p>
    </section>
  `;
  mainContent.focus();
}

function renderProducts() {
  mainContent.innerHTML = `
    <section class="products" aria-label="Product listings">
      ${products
        .map(
          (p) => `
        <article class="product-card" tabindex="0" aria-label="${p.name}, price $${p.price.toFixed(2)}">
          <img src="${p.image}" alt="${p.name}" class="product-image" />
          <div class="product-info">
            <h3 class="product-title">${p.name}</h3>
            <p class="product-price">$${p.price.toFixed(2)}</p>
            <button class="btn-add" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add to Cart</button>
          </div>
        </article>
      `
        )
        .join("")}
    </section>
  `;
  mainContent.focus();

  // Add event listeners to add buttons
  document.querySelectorAll(".btn-add").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    })
  );
}

function renderContact() {
  mainContent.innerHTML = `
    <form class="contact-form" aria-label="Contact us form">
      <h2>Contact Us</h2>
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required autocomplete="name" />
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="email" />
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" required></textarea>
      <button type="submit">Send Message</button>
      <p id="contact-success" class="contact-success" role="alert" aria-live="polite" hidden></p>
    </form>
  `;
  mainContent.focus();

  // Add form submission event listener
  const form = mainContent.querySelector(".contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Here you can add logic to send message to backend or email service.
    const successMsg = document.getElementById("contact-success");
    successMsg.textContent = "Thank you for contacting us! We'll get back to you soon.";
    successMsg.hidden = false;
    form.reset();
  });
}

// --- Cart Functions ---

function updateCartCount() {
  const count = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  cartCountDisplay.textContent = count;
}

function renderCart() {
  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalDisplay.textContent = "Total: $0.00";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = Object.values(cart)
    .map((item) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      return `
      <div class="cart-item" tabindex="0">
        <span class="cart-item-name">${item.name} x${item.qty}</span>
        <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
        <button class="btn-remove" aria-label="Remove ${item.name} from cart" data-id="${item.id}">&times;</button>
      </div>
    `;
    })
    .join("");
  cartTotalDisplay.textContent = `Total: $${total.toFixed(2)}`;

  // Attach remove button handlers
  cartItemsContainer.querySelectorAll(".btn-remove").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      removeFromCart(id);
    })
  );
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { ...product, qty: 1 };
  }
  updateCartCount();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  if (!cart[id]) return;
  cart[id].qty--;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  updateCartCount();
  renderCart();
}

function clearCart() {
  cart = {};
  updateCartCount();
  renderCart();
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("active");
  cartSidebar.setAttribute("aria-hidden", "false");
  cartSidebar.focus();
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
  cartSidebar.setAttribute("aria-hidden", "true");
  cartBtn.focus();
}

// --- Navigation & Event Listeners ---

function setActiveNav(clickedBtn) {
  [homeBtn, productsBtn, contactBtn].forEach((btn) =>
    btn.classList.remove("active")
  );
  clickedBtn.classList.add("active");
}

homeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActiveNav(homeBtn);
  renderHome();
});

productsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActiveNav(productsBtn);
  renderProducts();
});

contactBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActiveNav(contactBtn);
  renderContact();
});

cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openCart();
});

closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

clearCartBtn.addEventListener("click", () => {
  clearCart();
});

// Keyboard accessibility: close cart on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cartSidebar.classList.contains("open")) {
    closeCart();
  }
});

// Initialize page with Home content
renderHome();
updateCartCount();
renderCart();
