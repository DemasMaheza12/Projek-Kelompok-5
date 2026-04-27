document.addEventListener('DOMContentLoaded', () => {
    const movie = localStorage.getItem('zodiac_movie') || "FILM TIDAK DIKETAHUI";
    const time = localStorage.getItem('zodiac_time') || "--:--";
    const seatsRaw = localStorage.getItem('zodiac_selected_seats');
    const seats = seatsRaw ? JSON.parse(seatsRaw) : [];
    const totalPrice = parseInt(localStorage.getItem('zodiac_total_price')) || 0;

    // 1. Logika Ganti Poster Otomatis
    const posterImg = document.getElementById('pay-poster');
    
    // Daftar "Kamus" untuk mencocokkan judul film dengan nama file gambarnya
    const daftarPoster = {
        "Dilan 1991": "dilan.jpg",
        "Be With You": "bwy.jpg",
        "Tak Ingin Usai di Sini": "takusai.jpeg",
        "Na Willa": "Na Willa.jpg",
        "Sore: Istri dari Masa Depan": "sore.jpg",
        "Danur: The Last Chapter": "danur.jpg",
        "The Call": "call.jpg",
        "Elf": "elf.jpg",
        "Tunggu Aku Sukses Nanti": "akusukses.jpg",
        "Humint": "humint.jpg",
        "5cm": "5cm.jpg",
        "Azzamine": "azzamine.jpg"
    };

    // Jika judul film ada di daftar, ganti src gambarnya
    if (daftarPoster[movie]) {
        posterImg.src = `img/${daftarPoster[movie]}`;
    }

    // 2. Tampilkan di UI
    document.getElementById('pay-movie-title').textContent = movie;
    document.getElementById('pay-time').textContent = `Jam: ${time}`;
    document.getElementById('pay-ticket-count').textContent = `${seats.length} TIKET`;
    document.getElementById('pay-seats').textContent = seats.join(', ');
    document.getElementById('pay-subtotal').textContent = `Rp 50.000 x ${seats.length}`;
    document.getElementById('pay-total-price').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

    // 3. Logika Pemilihan Metode Pembayaran
    const btnMethods = document.querySelectorAll('.btn-method');
    
    // Hapus warna abu-abu (class active) dari semua tombol saat pertama kali dibuka
    btnMethods.forEach(b => b.classList.remove('active'));

    btnMethods.forEach(btn => {
        btn.addEventListener('click', function() {
            btnMethods.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// 4. Logika Antrean (Queue Wasm C++)
// 4. Logika Antrean (Queue Wasm C++) dengan Visualisasi
Module.onRuntimeInitialized = () => {
    const btnPay = document.getElementById('btn-pay');
    const overlay = document.getElementById('queue-overlay');
    const visualQueue = document.getElementById('visual-queue');
    const statusText = document.getElementById('queue-status-text');

    btnPay.addEventListener('click', () => {
        const selectedMethod = document.querySelector('.btn-method.active');
        if (!selectedMethod) {
            alert("Silakan pilih metode pembayaran terlebih dahulu!");
            return;
        }

        const seatsRaw = localStorage.getItem('zodiac_selected_seats');
        if (!seatsRaw || seatsRaw === "[]") {
            alert("Tidak ada kursi yang dipilih!");
            return;
        }

        // Tampilkan overlay
        overlay.classList.remove('hidden');
        visualQueue.innerHTML = ''; // Bersihkan queue sebelumnya

        // Biar antreannya kelihatan bekerja, kita masukkan 2 data dummy
        const queueData = [
            "Order #A12 (Online)",
            "Order #B45 (Debit)",
            `Pesanan: ${seatsRaw} via ${selectedMethod.textContent}` // Ini pesanan asli
        ];

        // ENQUEUE: Masukkan ke C++ dan ke UI Visual
        queueData.forEach((data, index) => {
            // Push ke memori C++
            // Push ke memori C++ dan bebaskan memori
            const ptr = stringToNewUTF8(data);
            Module._add_to_queue(ptr);
            Module._free(ptr);
            
            // Push ke UI
            const node = document.createElement('div');
            node.className = 'queue-node';
            node.id = `node-${index}`;
            node.textContent = data.includes("Pesanan") ? "Pesanan Saat Ini" : data;
            visualQueue.appendChild(node);
        });

        // Proses DEQUEUE satu-satu dengan jeda waktu (Simulasi Kasir)
        let processInterval = setInterval(() => {
            const firstNode = visualQueue.querySelector('.queue-node');
            
            if (firstNode) {
                // Beri warna hijau tanda sedang diproses
                firstNode.classList.add('processing');
                statusText.textContent = `Memproses: ${firstNode.textContent}...`;

                setTimeout(() => {
                    // Panggil fungsi Dequeue dari C++
                    const processedData = UTF8ToString(Module._process_queue());
                    console.log("Selesai diproses: " + processedData);
                    
                    // Hapus visual node terdepan (First Out)
                    firstNode.remove();

                    // Jika antrean kosong, hentikan interval
                    if (!visualQueue.querySelector('.queue-node')) {
                        clearInterval(processInterval);
                        statusText.textContent = "Semua pesanan selesai!";
                        
                        setTimeout(() => {
                            overlay.classList.add('hidden');
                            alert("Pembayaran Berhasil!");
                            window.location.href = 'cetak.html'; // Pindah ke halaman cetak tiket
                        }, 500);
                    }
                }, 800); // Waktu node menghilang (animasi CSS)
            }
        }, 1500); // Jeda waktu tiap proses pesanan
    });
};