document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil data dari LocalStorage
    const movie = localStorage.getItem('zodiac_movie') || "FILM TIDAK DIKETAHUI";
    const time = localStorage.getItem('zodiac_time') || "--:--";
    const seatsRaw = localStorage.getItem('zodiac_selected_seats');
    const seats = seatsRaw ? JSON.parse(seatsRaw) : [];

    // Kamus poster (sama seperti di payment)
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
        "Azzamine": "azzamine.jpg",
        "JUMBO": "jumbo.jpg" // Sesuai contoh di gambar
    };

    // 2. Set Poster
    const posterImg = document.getElementById('ticket-poster');
    if (daftarPoster[movie]) {
        posterImg.src = `img/${daftarPoster[movie]}`;
    } else {
        posterImg.src = `img/default-poster.jpg`; // Fallback
    }

    // 3. Generate Kode Booking Acak (5 angka)
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    document.getElementById('booking-code').textContent = randomCode;

    // 4. Generate QR Code (Pakai API public dari goqr.me biar praktis, isinya kode booking)
    const qrImg = document.getElementById('qr-code-img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ZODIAC-${randomCode}`;

    // 5. Tulis Detail ke Layar
    document.getElementById('ticket-movie-title').textContent = movie;
    document.getElementById('ticket-time').textContent = time;
    document.getElementById('ticket-seats').textContent = seats.length > 0 ? seats.join(', ') : '-';
    
    // Generate Tanggal Hari Ini dengan format (misal: 02 Jul 2026)
    const today = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    document.getElementById('ticket-date').textContent = today.toLocaleDateString('id-ID', options).replace('.', '');

    // 6. Logika Tombol Cetak
    // 6. Logika Tombol Cetak
    const btnPrint = document.getElementById('btn-print');
    btnPrint.addEventListener('click', () => {
        window.print();
        
        setTimeout(() => {
            const konfirmasi = confirm("Cetak selesai. Kembali ke Menu Utama?");
            if(konfirmasi) {
                // --- BAGIAN BARU: SIMPAN KE RIWAYAT ---
                const newTicket = {
                    movie: movie,
                    date: document.getElementById('ticket-date').textContent,
                    time: time,
                    seats: seats.join(', '),
                    code: randomCode
                };
                
                // Ambil history lama, tambahin yang baru, simpan lagi
                let historyData = JSON.parse(localStorage.getItem('zodiac_history')) || [];
                historyData.push(newTicket);
                localStorage.setItem('zodiac_history', JSON.stringify(historyData));
                // ---------------------------------------

                // Bersihkan pesanan saat ini
                localStorage.removeItem('zodiac_movie');
                localStorage.removeItem('zodiac_time');
                localStorage.removeItem('zodiac_selected_seats');
                localStorage.removeItem('zodiac_total_price');
                
                // Balik ke menu utama
                window.location.href = 'index.html'; 
            }
        }, 1000);
    });
});