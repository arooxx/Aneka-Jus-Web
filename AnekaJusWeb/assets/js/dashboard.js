// --- NAVIGASI ---
function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach((el) => (el.style.display = "none"));
  document.getElementById("section-" + sectionId).style.display = "block";

  // Update active state sidebar
  document.querySelectorAll(".sidebar-menu li").forEach((el) => el.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

function logout() {
  if (confirm("Keluar dari admin?")) window.location.href = "index.html";
}

function hapusBaris(btn) {
  if (confirm("Hapus data ini?")) btn.closest("tr").remove();
}

// --- FUNGSI TAMBAH DATA ---

// TAMBAH MENU
function tambahMenu() {
  const nama = prompt("Masukkan Nama Menu Jus:");
  const harga = prompt("Masukkan Harga (contoh: 15000):");

  if (nama && harga) {
    const tbody = document.getElementById("tbody-menu");
    const newRow = `
            <tr>
                <td>${nama}</td>
                <td>Jus Buah</td>
                <td>Rp ${parseInt(harga).toLocaleString("id-ID")}</td>
                <td><span class="badge success">Tersedia</span></td>
                <td><button class="btn-del" onclick="hapusBaris(this)">Hapus</button></td>
            </tr>
        `;
    tbody.insertAdjacentHTML("beforeend", newRow);
  }
}

// Stok
function tambahStok(jenis) {
  const nama = prompt(`Masukkan Nama ${jenis}:`);
  const jumlahInput = prompt("Masukkan Jumlah (Angka saja, misal: 10):");

  if (nama && jumlahInput) {
    const angka = parseInt(jumlahInput);
    let satuan = "";
    let statusHtml = "";

    // Tentukan Satuan
    if (jenis === "Buah") satuan = "Kg";
    else if (jenis === "Bahan") satuan = "Unit";
    else satuan = "Pcs";

    // Logika Status Otomatis
    if (angka <= 0) {
      statusHtml = '<span class="badge danger">Habis</span>';
    } else if (angka < 5) {
      statusHtml = '<span class="badge warning">Menipis</span>';
    } else {
      statusHtml = '<span class="badge success">Aman</span>';
    }

    // Masukkan ke Tabel
    const idTbody = "tbody-" + jenis.toLowerCase();
    const tbody = document.getElementById(idTbody);

    if (tbody) {
      const newRow = `
                <tr>
                    <td>${nama}</td>
                    <td>${angka} ${satuan}</td>
                    <td>${statusHtml}</td> 
                    <td><button class="btn-del" onclick="hapusBaris(this)">Hapus</button></td>
                </tr>
            `;
      tbody.insertAdjacentHTML("beforeend", newRow);
    }
  }
}

// Karyawan
function tambahKaryawan() {
  const nama = prompt("Nama Karyawan:");
  const posisi = prompt("Posisi:");
  if (nama) {
    document
      .getElementById("tbody-karyawan")
      .insertAdjacentHTML(
        "beforeend",
        `<tr><td>${nama}</td><td>${posisi}</td><td><button class="btn-del" onclick="hapusBaris(this)">Hapus</button></td></tr>`,
      );
  }
}
