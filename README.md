# Projek-Kelompok-5
Projek struktur data dan algoritma

LAKUIN AJA!

# 1. Clone repository Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# 2. Download dan install SDK terbaru
./emsdk install latest

# 3. Aktifkan SDK
./emsdk activate latest

# 4. Set environment variables (supaya perintah 'emcc' bisa dikenali)
# Jika kamu pakai Windows, gunakan perintah ini:
emsdk_env.bat
# Jika kamu pakai Mac/Linux, gunakan perintah ini:
source ./emsdk_env.sh

KALO ERROR ULANG LAGI
emsdk install latest

jika sudah di install
masukin ke path

Langkah-langkahnya:

1. Buka Start Menu Windows, ketik Environment Variables, lalu pilih Edit the system environment variables.

2. Akan muncul jendela System Properties, klik tombol Environment Variables... di bagian bawah.

3. Di bagian User variables (kotak atas) atau System variables (kotak bawah), cari variabel yang bernama Path, klik satu kali, lalu klik tombol Edit....

4. Klik tombol New, lalu masukkan lokasi folder emsdk milikmu beserta folder upstream\emscripten di dalamnya. Kamu biasanya perlu menambahkan dua baris baru, contohnya seperti ini (sesuaikan dengan lokasi asli foldermu):

5. C:\lokasi\folder\emsdk

6. C:\lokasi\folder\emsdk\upstream\emscripten

7. Klik OK di semua jendela untuk menyimpan pengaturan.

8. Penting: Tutup (silang) jendela terminalmu yang sekarang, lalu buka terminal yang baru agar sistem bisa membaca pengaturan yang baru saja disimpan.


selanjutnya
clone semua dari github ini

trus jalanin di vscode masing masing


ini buat nge compile
emcc main.cpp.cpp -o app.js --bind
