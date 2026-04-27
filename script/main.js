const movie = document.querySelectorAll('.film');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const genreText = document.querySelector('.genre');
const titleText = document.querySelector('.title');
const tombolPesan = document.querySelector('.btn-pesan');
const jadwalMenu = document.querySelector('.jadwal-menu');

let currentIndex = 1; // Akan dioverride oleh C++ nanti

// 1. Fungsi Render Visual (Mengatur CSS Class)
function updateCarousel() {
  let total = movie.length;

  let prev3Index = (currentIndex - 3 + total) % total;
  let prev2Index = (currentIndex - 2 + total) % total;
  let prevIndex = (currentIndex - 1 + total) % total;
  let nextIndex = (currentIndex + 1) % total;
  let next2Index = (currentIndex + 2) % total;
  let next3Index = (currentIndex + 3) % total;

  // Reset semua class
  movie.forEach(card => {
    card.className = 'film';
  });

  // Tambahkan class animasi
  movie[prev3Index].classList.add('hilang-kiri');
  movie[prev2Index].classList.add('kiri-luar');
  movie[prevIndex].classList.add('kiri');
  movie[currentIndex].classList.add('tengah');
  movie[nextIndex].classList.add('kanan');
  movie[next2Index].classList.add('kanan-luar');
  movie[next3Index].classList.add('hilang-kanan');
}

// ==========================================
// 2. INTEGRASI WEBASSEMBLY (C++)
// ==========================================

// Tunggu sampai Emscripten selesai memuat module C++
Module.onRuntimeInitialized = function() {
    
    // Inisialisasi data Linked List di C++
    Module._init_carousel_data();

    // Render awal
    renderDataFromCpp();
    
    // Event Listener Navigasi WebAssembly
    nextBtn.addEventListener('click', () => {
      Module._move_next_cpp(); // C++ menggeser pointer current->next
      renderDataFromCpp();
      jadwalMenu.classList.remove('tampil');
    });
    
    prevBtn.addEventListener('click', () => {
      Module._move_prev_cpp(); // C++ menggeser pointer current->prev
      renderDataFromCpp();
      jadwalMenu.classList.remove('tampil');
    });
};

// Fungsi untuk menarik data hasil hitungan C++ ke HTML
function renderDataFromCpp() {
    // 1. Ambil indeks posisi Node saat ini dari C++
    currentIndex = Module._get_current_index();
    
    // 2. Ambil teks dari C++ dan ubah formatnya
    const titleFromC = UTF8ToString(Module._get_current_title());
    const genreFromC = UTF8ToString(Module._get_current_genre());
    
    // 3. Tampilkan di layar HTML
    titleText.textContent = titleFromC;
    genreText.textContent = genreFromC;
    
    // 4. Update posisi CSS poster
    updateCarousel();
}

// Interaksi Menu Jadwal
tombolPesan.addEventListener('click', () => {
  jadwalMenu.classList.toggle('tampil');
});

// ==========================================
// LOGIKA PENYIMPANAN LOCAL STORAGE
// ==========================================

// Tangkap semua tombol jam tayang
const jamButtons = document.querySelectorAll('.btn-jam');

jamButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Ambil judul film dari elemen HTML yang sedang aktif saat ini
        const judulFilmAktif = titleText.textContent; 
        
        // Ambil teks jam yang diklik (misal: "12:00")
        const jamTayang = this.textContent;

        // 1. SIMPAN KE LOCAL STORAGE
        // 'zodiac_movie' dan 'zodiac_time' adalah nama kunci (key) buatan kita
        localStorage.setItem('zodiac_movie', judulFilmAktif);
        localStorage.setItem('zodiac_time', jamTayang);

        console.log("Berhasil menyimpan ke laci: " + judulFilmAktif + " jam " + jamTayang);
        
        // Karena elemen <a> memiliki href="seat.html", browser akan otomatis
        // pindah halaman setelah kode di atas selesai dieksekusi.
    });
});