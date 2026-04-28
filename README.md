# UTS_Kelompok_5
## Web pemesanan tiket bioskop untuk kasir

Semua logika inti aplikasi ini ditulis dalam bahasa C++, lalu dikompilasi menjadi WebAssembly menggunakan Emscripten agar bisa dijalankan langsung di browser. 

Terdapat 4 modul struktur data yang digunakan :
1. Circular Doubly Linked List — Carousel Film (cdll.cpp)
2. Stack — Pemilihan & Pembatalan Kursi (stack.cpp)
3. Queue — Antrean Pembayaran (queue.cpp)
4. Singly Linked List — Riwayat Transaksi (linkedlist.cpp)

Untuk modul algortima dan pemrograman, tersebar hampir disetiap code .cpp yang kami buat

Webnya memiliki 6 halaman 
1. Utama (index)
2. tentang webnya (about)
3. riwayat pemesanan (history)
4. pilih bangku (seat)
5. pembayaran (payment)
6. cetak tiket (cetak)

Selain menggunakan cpp untuk logic utamnya, kami juga menggunakan js sebagai sarana interaksi tambahan untuk web nya agar lebih inetraktif
