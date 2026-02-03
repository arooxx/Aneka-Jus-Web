/* =============================
   DATA PRODUK (DATABASE LOKAL)
   ============================= */
const products = [
  { id: 1, name: "Jus Mangga", price: 10000, img: "assets/img/jus-mangga.jpg" },
  { id: 2, name: "Jus Alpukat", price: 10000, img: "assets/img/jus-alpukat.jpg" },
  { id: 3, name: "Jus Naga", price: 10000, img: "assets/img/jus-buahnaga.jpg" },
  { id: 4, name: "Jus Jeruk", price: 10000, img: "assets/img/jus-jeruk.jpg" },
  { id: 5, name: "Jus Melon", price: 10000, img: "assets/img/jus-melon.jpg" },
  { id: 6, name: "Jus Jambu", price: 10000, img: "assets/img/jus-jambu.jpg" },
  { id: 7, name: "Jus Nanas", price: 10000, img: "assets/img/jus-nanas.jpg" },
  { id: 8, name: "Jus Strawberry", price: 10000, img: "assets/img/jus-strawberry.jpg" },
];

const fallbackImg = "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500";

// FORMATTER RUPIAH
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// ============================
// LOGIKA UMUM (NAVBAR & CART)
// ============================
function updateBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = count;
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateBadge();
  alert(`Berhasil menambahkan ${product.name} ke keranjang!`);
}

// =====================================
// LOGIKA HALAMAN KERANJANG (CART PAGE)
// =====================================
function renderCart() {
  const tableBody = document.getElementById("cart-items");
  const summaryBox = document.getElementById("cart-summary");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const totalEl = document.getElementById("cart-total");

  if (!tableBody) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    tableBody.innerHTML = "";
    if (summaryBox) summaryBox.style.display = "none";
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  if (summaryBox) summaryBox.style.display = "flex";
  if (emptyMsg) emptyMsg.style.display = "none";

  let grandTotal = 0;

  tableBody.innerHTML = cart
    .map((item) => {
      const totalItem = item.price * item.qty;
      grandTotal += totalItem;
      return `
            <tr>
                <td>
                    <div class="cart-item-info">
                        <img src="${item.img}" onerror="this.src='${fallbackImg}'">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>${rupiah(item.price)}</td>
                <td>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 'minus')">-</button>
                    <span style="margin:0 10px;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 'plus')">+</button>
                </td>
                <td>${rupiah(totalItem)}</td>
                <td>
                    <button onclick="removeFromCart(${item.id})" class="btn-remove">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  if (totalEl) totalEl.innerText = rupiah(grandTotal);
}

function changeQty(id, action) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.id === id);
  if (item) {
    if (action === "plus") item.qty++;
    else if (action === "minus") {
      item.qty--;
      if (item.qty < 1) item.qty = 1;
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateBadge();
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateBadge();
}

function checkout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Keranjang belanja Anda masih kosong.");
    return;
  }
  const nameInput = document.getElementById("customer-name");
  const customerName = nameInput.value.trim();

  if (!customerName) {
    alert("Mohon isi Nama Pemesan terlebih dahulu!");
    nameInput.focus();
    return;
  }

  alert(`Terima kasih Kak ${customerName}!\nPesanan berhasil dibuat.`);
  localStorage.removeItem("cart");
  window.location.reload();
}

// ==============================
// LOGIKA HALAMAN MENU (SLIDER)
// ==============================
function renderMenuSlider() {
  const container = document.getElementById("product-slider");
  if (!container) return;

  container.innerHTML = products
    .map(
      (item) => `
        <div class="card">
            <img src="${item.img}" onerror="this.src='${fallbackImg}'">
            <div class="card-body">
                <h3>${item.name}</h3>
                <span class="card-price">${rupiah(item.price)}</span>
                <button onclick="addToCart(${item.id})" class="btn-add">
                    + Keranjang
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

function scrollMenu(direction) {
  const container = document.getElementById("product-slider");
  if (!container) return;
  const scrollAmount = 300;
  if (direction === "left") container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  else container.scrollBy({ left: scrollAmount, behavior: "smooth" });
}

// ==================================
//  AUTO RUN (SAAT WEBSITE DIMUAT)
// ==================================
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  renderMenuSlider();
  renderCart();
});

// ===================================
//  LOGIKA LOGIN & REGISTER (ADMIN)
// ===================================
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("reg-name").value;
  const user = document.getElementById("reg-username").value;
  const pass = document.getElementById("reg-password").value;

  localStorage.setItem("admin_account", JSON.stringify({ name, username: user, password: pass }));
  alert("Registrasi Berhasil! Silakan Login.");
  window.location.href = "login.html";
}

function handleLogin(event) {
  event.preventDefault();
  const userIn = document.getElementById("login-username").value;
  const passIn = document.getElementById("login-password").value;
  const savedAdmin = JSON.parse(localStorage.getItem("admin_account"));

  if (
    (userIn === "admin" && passIn === "123") ||
    (savedAdmin && userIn === savedAdmin.username && passIn === savedAdmin.password)
  ) {
    alert("Login Berhasil!");
    localStorage.setItem("isAdminLoggedIn", "true");
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Username atau Password salah!");
  }
}
