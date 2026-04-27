// Mengambil data film dari LocalStorage
// Mengambil data film dari LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const movie = localStorage.getItem('zodiac_movie');
    const time = localStorage.getItem('zodiac_time');
    
    if (movie) {
        document.querySelector('.seat-header h2').textContent = `PILIH SEAT - ${movie} (${time})`;
    }

    // --- LOGIKA BARU: MENANDAI KURSI YANG SUDAH DIPESAN DARI HISTORY ---
    
    // 1. Ambil data history dari LocalStorage
    const historyDataRaw = localStorage.getItem('zodiac_history');
    const historyArray = historyDataRaw ? JSON.parse(historyDataRaw) : [];

    // 2. Kumpulkan semua kursi yang sudah dibeli khusus untuk film dan jam ini
    let bookedSeats = [];
    historyArray.forEach(ticket => {
        // Cek apakah di history ada tiket dengan judul dan jam yang sama persis
        if (ticket.movie === movie && ticket.time === time) {
            // Data kursi di history bentuknya string (contoh: "C9, C10")
            // Kita pecah string tersebut jadi array -> ["C9", "C10"]
            const seatsArray = ticket.seats.split(', '); 
            
            // Gabungkan ke keranjang bookedSeats
            bookedSeats = bookedSeats.concat(seatsArray);
        }
    });

    // 3. Cari semua tombol kursi di layar, kalau cocok dengan bookedSeats, ubah jadi kuning
    const allSeatButtons = document.querySelectorAll('.seat');
    allSeatButtons.forEach(btn => {
        if (bookedSeats.includes(btn.textContent)) {
            // Tambahkan class 'dipesan' agar warnanya berubah dan tidak bisa diklik
            btn.classList.add('dipesan');
        }
    });
    
    // --------------------------------------------------------------------
});

// ... (SISA KODE DI BAWAHNYA SEPERTI updateSidebar() DAN Module.onRuntimeInitialized TETAP SAMA, BIARKAN SAJA) ...

function updateSidebar() {
    const selected = document.querySelectorAll('.seat.dipilih');
    const list = document.getElementById('selected-seats-list');
    const price = document.getElementById('total-harga');
    const btn = document.getElementById('btn-summary');

    list.innerHTML = '';
    selected.forEach(s => {
        list.innerHTML += `<span class="seat-badge">${s.textContent}</span>`;
    });

    const total = selected.length * 50000;
    price.textContent = total > 0 ? `Rp ${total.toLocaleString('id-ID')}` : '-';
    btn.textContent = `RINGKASAN ORDER(${selected.length})`;
    
    // Simpan kursi terpilih untuk halaman payment
    const seatNames = Array.from(selected).map(s => s.textContent);
    localStorage.setItem('zodiac_selected_seats', JSON.stringify(seatNames));
    localStorage.setItem('zodiac_total_price', total);
}

Module.onRuntimeInitialized = () => {
    const seats = document.querySelectorAll('.seat');
    const undoBtn = document.getElementById('btn-undo');

    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            if (this.classList.contains('dipesan')) return;

            if (!this.classList.contains('dipilih')) {
                this.classList.add('dipilih');
                
                // 1. UPDATE UI DULU (Pindah ke atas)
                updateSidebar();
                
                // 2. BARU MASUKKAN KE C++ DENGAN TRY-CATCH
                try {
                    const ptr = stringToNewUTF8(this.textContent);
                    Module._push_seat(ptr);
                    // Module._free(ptr);   
                    console.log("Sukses PUSH ke Stack C++: " + this.textContent);
                } catch (error) {
                    console.error("Waduh, C++ Wasm Error nih:", error);
                }
            }
        });
    });

    // ... (Logika undoBtn di bawahnya tetap sama, tambahkan try...catch juga jika mau)
    undoBtn.addEventListener('click', () => {
        try {
            const lastSeat = UTF8ToString(Module._undo_seat());
            if (lastSeat !== "EMPTY") {
                seats.forEach(s => {
                    if (s.textContent === lastSeat) s.classList.remove('dipilih');
                });
                updateSidebar();
            }
        } catch (error) {
            console.error("Error saat UNDO C++:", error);
        }
    });
};
