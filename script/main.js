// --- KODE BARU: Reset pilihan kursi saat kembali ke menu utama ---
document.addEventListener('DOMContentLoaded', () => {
    // Hapus data kursi yang "sedang dipilih" (keranjang draft)
    localStorage.removeItem('zodiac_selected_seats');
    localStorage.removeItem('zodiac_total_price');
    // Catatan: 'zodiac_history' jangan dihapus karena itu data kursi yang SUDAH DIBAYAR
});
// -----------------------------------------------------------------

let movie = [];
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const genreText = document.querySelector('.genre');
const titleText = document.querySelector('.title');
const ratingText = document.querySelector('.rating');
const tombolPesan = document.querySelector('.btn-pesan');
const jadwalMenu = document.querySelector('.jadwal-menu');

let currentIndex = 1;

function updateCarousel() {
    let total = movie.length;
    if (total === 0) return; // ✅ Guard clause

    let prev3Index = (currentIndex - 3 + total) % total;
    let prev2Index = (currentIndex - 2 + total) % total;
    let prevIndex  = (currentIndex - 1 + total) % total;
    let nextIndex  = (currentIndex + 1) % total;
    let next2Index = (currentIndex + 2) % total;
    let next3Index = (currentIndex + 3) % total;

    movie.forEach(card => { card.className = 'film'; });

    movie[prev3Index].classList.add('hilang-kiri');
    movie[prev2Index].classList.add('kiri-luar');
    movie[prevIndex].classList.add('kiri');
    movie[currentIndex].classList.add('tengah');
    movie[nextIndex].classList.add('kanan');
    movie[next2Index].classList.add('kanan-luar');
    movie[next3Index].classList.add('hilang-kanan');
}

Module.onRuntimeInitialized = function () {
    Module._init_carousel_data();

    renderAllMovies();               // ✅ Render semua card dulu
    Module._set_current_by_index(1); // ✅ Reset posisi C++ ke index 1
    renderDataFromCpp();             // ✅ Baru render data & posisi visual

    nextBtn.addEventListener('click', () => {
        Module._move_next_cpp();
        renderDataFromCpp();
    });

    prevBtn.addEventListener('click', () => {
        Module._move_prev_cpp();
        renderDataFromCpp();
    });
};

// Logika untuk halaman pembayaran
function renderDataFromCpp() {
    currentIndex = Module._get_current_index();

    const titleFromC = UTF8ToString(Module._get_current_title());
    const genreFromC = UTF8ToString(Module._get_current_genre());
    const img        = UTF8ToString(Module._get_current_image_path());
    const rating     = UTF8ToString(Module._get_current_rating());

    updateCarousel(); // ✅ Update posisi visual

    const activeImg = document.querySelector('.film.tengah img');
    if (activeImg) activeImg.src = img;

    titleText.textContent = titleFromC;
    genreText.textContent = genreFromC;
    ratingText.textContent = rating;
}

function renderAllMovies() {
    const carousel = document.querySelector('.carousel');
    carousel.innerHTML = ""; // Kosongkan dulu

    for (let i = 0; i < 12; i++) {
        Module._set_current_by_index(i);

        const img = UTF8ToString(Module._get_current_image_path());

        const card = document.createElement('article');
        card.className = 'film';

        const image = document.createElement('img');
        image.src = img;
        image.alt = UTF8ToString(Module._get_current_title());

        card.appendChild(image);
        carousel.appendChild(card);
    }

    movie = Array.from(document.querySelectorAll('.film')); // ✅ Ambil SETELAH render
}

// Jadwal menu toggle
tombolPesan.addEventListener('click', () => {
    jadwalMenu.classList.toggle('tampil');
});

// Local Storage
const jamButtons = document.querySelectorAll('.btn-jam');
jamButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        // --- KODE BARU: Pastikan keranjang bersih-bersih lagi sebelum pindah halaman ---
        localStorage.removeItem('zodiac_selected_seats');
        localStorage.removeItem('zodiac_total_price');
        
        localStorage.setItem('zodiac_movie', titleText.textContent);
        localStorage.setItem('zodiac_time', this.textContent);
        console.log("Tersimpan: " + titleText.textContent + " jam " + this.textContent);
    });
});