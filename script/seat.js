document.addEventListener('DOMContentLoaded', () => {
    const movie = localStorage.getItem('zodiac_movie');
    const time = localStorage.getItem('zodiac_time');
    
    if (movie) {
        document.querySelector('.seat-header h2').textContent = `PILIH SEAT - ${movie} (${time})`;
    }

    // 1. Ambil data history dari LocalStorage (Kursi Dipesan/Kuning)
    const historyDataRaw = localStorage.getItem('zodiac_history');
    const historyArray = historyDataRaw ? JSON.parse(historyDataRaw) : [];

    let bookedSeats = [];
    historyArray.forEach(ticket => {
        if (ticket.movie === movie && ticket.time === time) {
            const seatsArray = ticket.seats.split(', '); 
            bookedSeats = bookedSeats.concat(seatsArray);
        }
    });

    // 2. Ambil data kursi yang SEDANG DIPILIH dari LocalStorage (Kursi Dipilih/Biru)
    const selectedSeatsRaw = localStorage.getItem('zodiac_selected_seats');
    const previouslySelectedSeats = selectedSeatsRaw ? JSON.parse(selectedSeatsRaw) : [];

    // 3. Terapkan kelas CSS berdasarkan status kursi
    const allSeatButtons = document.querySelectorAll('.seat');
    allSeatButtons.forEach(btn => {
        if (bookedSeats.includes(btn.textContent)) {
            // Jika sudah ada di riwayat pembelian sebelumnya
            btn.classList.add('dipesan');
        } else if (previouslySelectedSeats.includes(btn.textContent)) {
            // Jika statusnya sedang dipilih sebelum pindah halaman
            btn.classList.add('dipilih');
        }
    });
    
    // 4. Update Sidebar agar harga dan list kursi langsung muncul ketika kembali
    updateSidebar();
});

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
    price.textContent = total > 0 ? `Rp${total.toLocaleString('id-ID')}` : '-';
    btn.textContent = `RINGKASAN ORDER(${selected.length})`;
    
    // Simpan kursi terpilih untuk halaman payment
    const seatNames = Array.from(selected).map(s => s.textContent);
    localStorage.setItem('zodiac_selected_seats', JSON.stringify(seatNames));
    localStorage.setItem('zodiac_total_price', total);
}

Module.onRuntimeInitialized = () => {
    const seats = document.querySelectorAll('.seat');
    const undoBtn = document.getElementById('btn-undo');

    // --- LOGIKA BARU: Masukkan kembali kursi ke Stack Wasm C++ ---
    // Karena memori Wasm ter-reset saat refresh/kembali, kita perlu melakukan
    // push ulang agar fitur Stack (tombol UNDO) tetap mengetahui data sebelumnya.
    const selectedSeatsRaw = localStorage.getItem('zodiac_selected_seats');
    const previouslySelectedSeats = selectedSeatsRaw ? JSON.parse(selectedSeatsRaw) : [];

    previouslySelectedSeats.forEach(seatId => {
        try {
            const ptr = stringToNewUTF8(seatId);
            Module._push_seat(ptr);
            Module._free(ptr);
        } catch (error) {
            console.error("Gagal memuat ulang state Stack ke C++:", error);
        }
    });
    // -------------------------------------------------------------

    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            if (this.classList.contains('dipesan')) return;

            if (!this.classList.contains('dipilih')) {
                this.classList.add('dipilih');
                
                // 1. UPDATE UI DULU
                updateSidebar();
                
                // 2. BARU MASUKKAN KE C++ DENGAN TRY-CATCH
                try {
                    const ptr = stringToNewUTF8(this.textContent);
                    Module._push_seat(ptr);
                    Module._free(ptr);   
                    console.log("Sukses PUSH ke Stack C++: " + this.textContent);
                } catch (error) {
                    console.error("Waduh, C++ Wasm Error nih:", error);
                }
            }
        });
    });

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