/* =========================================
   1. DATA PRODUK (DATABASE LOKAL)
   ========================================= */
const products = [
  { id: 1, name: "Jus Mangga", price: 10000, img: "assets/img/jus-mangga.jpg" },
  {
    id: 2,
    name: "Jus Alpukat",
    price: 10000,
    img: "assets/img/jus-alpukat.jpg",
  },
  { id: 3, name: "Jus Naga", price: 10000, img: "assets/img/jus-buahnaga.jpg" },
  { id: 4, name: "Jus Jeruk", price: 10000, img: "assets/img/jus-jeruk.jpg" },
  { id: 5, name: "Jus Melon", price: 10000, img: "assets/img/jus-melon.jpg" },
  { id: 6, name: "Jus Jambu", price: 10000, img: "assets/img/jus-jambu.jpg" },
  { id: 7, name: "Jus Nanas", price: 10000, img: "assets/img/jus-nanas.jpg" },
  {
    id: 8,
    name: "Jus Strawberry",
    price: 10000,
    img: "assets/img/jus-strawberry.jpg",
  },
];

// Gambar cadangan jika file asli tidak ditemukan
const fallbackImg =
  "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500";

/* =========================================
   2. LOGIKA UMUM (FORMATTER & NAVIGASI)
   ========================================= */

// Helper: Format ke Rupiah (Rp 10.000)
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Update Angka Merah di Navbar
function updateBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = count;
}

// Tambah Produk ke Keranjang
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

/* =========================================
   3. LOGIKA HALAMAN KERANJANG (CART PAGE)
   ========================================= */

// Render Tabel Keranjang
function renderCart() {
  const tableBody = document.getElementById("cart-items");
  const summaryBox = document.getElementById("cart-summary");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const totalEl = document.getElementById("cart-total");

  // Cek apakah elemen tabel ada? (Hanya jalan di cart.html)
  if (!tableBody) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Jika Kosong
  if (cart.length === 0) {
    tableBody.innerHTML = "";
    if (summaryBox) summaryBox.style.display = "none";
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  // Jika Ada Isi
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
                        <img src="${
                          item.img
                        }" onerror="this.src='${fallbackImg}'">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>${rupiah(item.price)}</td>
                <td>
                    <button class="qty-btn" onclick="changeQty(${
                      item.id
                    }, 'minus')">-</button>
                    <span style="margin:0 10px;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${
                      item.id
                    }, 'plus')">+</button>
                </td>
                <td>${rupiah(totalItem)}</td>
                <td>
                    <button onclick="removeFromCart(${
                      item.id
                    })" class="btn-remove">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  if (totalEl) totalEl.innerText = rupiah(grandTotal);
}

// Ubah Jumlah (Qty) dengan Tombol +/-
function changeQty(id, action) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.id === id);

  if (item) {
    if (action === "plus") {
      item.qty++;
    } else if (action === "minus") {
      item.qty--;
      if (item.qty < 1) item.qty = 1; // Minimal 1
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // Refresh tabel
  updateBadge(); // Refresh badge navbar
}

// Hapus Item dari Keranjang
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateBadge();
}

// Checkout: Simpan Data ke "Database" Orders
function checkout() {
  // 1. Ambil Data Keranjang
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Cek Keranjang Kosong
  if (cart.length === 0) {
    alert("Keranjang belanja Anda masih kosong.");
    return;
  }

  // 2. Ambil Nama Pemesan
  const nameInput = document.getElementById("customer-name");
  const customerName = nameInput.value.trim();

  // Validasi: Nama Wajib Diisi
  if (!customerName) {
    alert("Mohon isi Nama Pemesan terlebih dahulu!");
    nameInput.focus(); // Arahkan kursor ke kolom nama
    return;
  }

  // 3. Hitung Total
  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 4. Buat Data Pesanan (Order Object)
  const newOrder = {
    id: Date.now(), // ID Unik berdasarkan waktu (contoh: 1705638123)
    customer: customerName,
    items: cart, // Simpan barang apa saja yang dibeli
    total: total,
    date: new Date().toLocaleString("id-ID"), // Tanggal & Jam saat ini
    status: "Pending", // Status awal pesanan
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart"); // Hapus isi keranjang

  alert(
    `Terima kasih Kak ${customerName}!\nPesanan berhasil dibuat dan masuk ke sistem Admin.`
  );

  // Refresh halaman agar keranjang jadi kosong
  window.location.reload();
}

/* =========================================
   4. LOGIKA HALAMAN MENU (SLIDER)
   ========================================= */

// Render Card Produk ke Slider
function renderMenuSlider() {
  const container = document.getElementById("product-slider");
  if (!container) return; // Hanya jalan di menu.html

  container.innerHTML = products
    .map(
      (item) => `
        <div class="card">
            <div style="height: 200px; overflow: hidden; border-radius: 20px 20px 0 0;">
                <img src="${
                  item.img
                }" onerror="this.src='${fallbackImg}'" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="card-body">
                <h3 style="font-size:18px; margin-bottom:5px;">${item.name}</h3>
                <span class="card-price" style="color:#27ae60; font-weight:bold; display:block; margin-bottom:15px;">
                    ${rupiah(item.price)}
                </span>
                <button onclick="addToCart(${item.id})" class="btn-add">
                    + Keranjang
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Scroll Tombol Panah
function scrollMenu(direction) {
  const container = document.getElementById("product-slider");
  const scrollAmount = 320;

  if (direction === "left") {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
}

/* =========================================
   5. AUTO RUN (EKSEKUSI OTOMATIS)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateBadge(); // Selalu update angka keranjang di semua halaman
  renderMenuSlider(); // Render slider (hanya jika di menu.html)
  renderCart(); // Render tabel (hanya jika di cart.html)
});

/* =========================================
   6. LOGIKA LOGIN & REGISTER ADMIN
   ========================================= */

// 1. REGISTER
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("reg-name").value;
  const user = document.getElementById("reg-username").value;
  const pass = document.getElementById("reg-password").value;

  const adminData = { name: name, username: user, password: pass };
  localStorage.setItem("admin_account", JSON.stringify(adminData));

  alert("Registrasi Berhasil! Silakan Login.");

  // UPDATE DI SINI: Arahkan ke login.html
  window.location.href = "login.html";
}

// 2. LOGIN
function handleLogin(event) {
  event.preventDefault();
  const userIn = document.getElementById("login-username").value;
  const passIn = document.getElementById("login-password").value;
  const savedAdmin = JSON.parse(localStorage.getItem("admin_account"));

  if (
    (userIn === "admin" && passIn === "123") ||
    (savedAdmin &&
      userIn === savedAdmin.username &&
      passIn === savedAdmin.password)
  ) {
    alert("Login Berhasil!");
    localStorage.setItem("isAdminLoggedIn", "true");

    // Redirect ke Dashboard (Home)
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Username atau Password salah!");
  }
}
