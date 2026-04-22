#include <emscripten/emscripten.h>
#include <vector>
#include <string>

// Struktur data film
struct Movie {
    std::string title;
    std::string genre;
};

std::vector<Movie> dataMovie = {
    {"Dilan 1991", "Drama, Romance"},
    {"Be With You", "Fantasy, Romance"},
    {"Tak Ingin Usai di Sini", "Drama, Romance"},
    {"Na Willa", "Drama, Musical"},
    {"Sore: Istri dari Masa Depan", "Romance, Fantasy"},
    {"Danur: The Last Chapter", "Horror, Supranatural"},
    {"The Call", "Horror, Mystery"},
    {"Elf", "Comedy, Fantasy"},
    {"Tunggu Aku Sukses Nanti", "Drama, Comedy"},
    {"Humint", "Action, Thriller"},
    {"5cm", "Drama, Adventure"},
    {"Azzamine", "Drama, Romance"}
};

int currentIndex = 1;

// ==============================================================================
// BLOK EM_JS: Menulis JavaScript langsung di dalam C++ untuk memanipulasi DOM
// ==============================================================================

// Fungsi untuk memperbarui class pada gambar dan teks
EM_JS(void, updateDOM, (int p3, int p2, int p1, int c, int n1, int n2, int n3, const char* title, const char* genre), {
    const movies = document.querySelectorAll('.film');
    movies.forEach(card => card.className = 'film'); // Bersihkan class

    // Pasang class baru berdasarkan index yang dihitung oleh C++
    movies[p3].classList.add('hilang-kiri');
    movies[p2].classList.add('kiri-luar');
    movies[p1].classList.add('kiri');
    movies[c].classList.add('tengah');
    movies[n1].classList.add('kanan');
    movies[n2].classList.add('kanan-luar');
    movies[n3].classList.add('hilang-kanan');

    // UTF8ToString wajib digunakan untuk mengubah pointer (const char*) dari memori C++ menjadi String di browser
    document.querySelector('.title').textContent = UTF8ToString(title);
    document.querySelector('.genre').textContent = UTF8ToString(genre);
});

// Fungsi untuk menyembunyikan jadwal saat digeser
EM_JS(void, hideJadwal, (), {
    document.querySelector('.jadwal-menu').classList.remove('tampil');
});

// Fungsi untuk memasang Event Listener pada tombol-tombol HTML
EM_JS(void, setupEventListeners, (), {
    // Tombol Kanan memanggil fungsi C++ (_nextMovie)
    document.querySelector('.next').addEventListener('click', () => {
        Module._nextMovie(); 
    });
    
    // Tombol Kiri memanggil fungsi C++ (_prevMovie)
    document.querySelector('.prev').addEventListener('click', () => {
        Module._prevMovie();
    });

    // Tombol Pesan (Tetap sederhana, langsung toggle class)
    document.querySelector('.btn-pesan').addEventListener('click', () => {
        document.querySelector('.jadwal-menu').classList.toggle('tampil');
    });
});


// ==============================================================================
// LOGIKA UTAMA C++
// ==============================================================================

// Fungsi pembantu untuk memanggil updateDOM agar kode lebih rapi
void triggerDOMUpdate() {
    int total = dataMovie.size();
    updateDOM(
        (currentIndex - 3 + total) % total,
        (currentIndex - 2 + total) % total,
        (currentIndex - 1 + total) % total,
        currentIndex,
        (currentIndex + 1) % total,
        (currentIndex + 2) % total,
        (currentIndex + 3) % total,
        dataMovie[currentIndex].title.c_str(), // c_str() mengubah string C++ ke const char* (pointer)
        dataMovie[currentIndex].genre.c_str()
    );
}

extern "C" {
    // KEEPALIVE memastikan compiler tidak menghapus fungsi ini, 
    // karena akan dipanggil dari event listener JS
    EMSCRIPTEN_KEEPALIVE void nextMovie() {
        currentIndex = (currentIndex + 1) % dataMovie.size();
        triggerDOMUpdate();
        hideJadwal();
    }

    EMSCRIPTEN_KEEPALIVE void prevMovie() {
        currentIndex = (currentIndex - 1 + dataMovie.size()) % dataMovie.size();
        triggerDOMUpdate();
        hideJadwal();
    }
}

// Fungsi utama (Entry point) saat WebAssembly dimuat pertama kali
int main() {
    setupEventListeners(); // Pasang semua tombol
    triggerDOMUpdate();    // Atur posisi awal (index 1)
    return 0;
}