Module.onRuntimeInitialized = () => {
    const ticketList = document.getElementById('ticket-list');
    
    // 1. Ambil data dari LocalStorage
    const historyDataRaw = localStorage.getItem('zodiac_history');
    const historyArray = historyDataRaw ? JSON.parse(historyDataRaw) : [];

    if (historyArray.length === 0) {
        ticketList.innerHTML = `<div class="empty-state">Belum ada tiket</div>`;
        return;
    }

    // 2. Masukkan data ke Linked List C++
    Module._reset_history_list(); 
    historyArray.forEach(ticket => {
        Module._add_to_history(stringToNewUTF8(JSON.stringify(ticket)));
    });

    // 3. Tarik data dari Linked List C++ 
    const linkedListData = UTF8ToString(Module._get_all_history());
    
    // 4. Render ke HTML
    ticketList.innerHTML = '';
    
    const ticketsFromCpp = linkedListData.split("||");
    
    // KAMUS POSTER: Cocokin judul film dengan nama file di folder img/
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
        "JUMBO": "jumbo.jpg"
    };

    ticketsFromCpp.forEach(ticketStr => {
        if(!ticketStr) return;
        
        const data = JSON.parse(ticketStr);
        
        // Pengecekan gambar
        let posterSrc = "";
        if (daftarPoster[data.movie]) {
            posterSrc = `img/${daftarPoster[data.movie]}`;
        } else {
            // Kalau judul nggak ada di kamus, pakai gambar default aja biar gak error 404
            posterSrc = `img/bwy.jpg`; 
        }
        
        // Buat elemen HTML Tiket
        const ticketHTML = `
            <div class="hist-ticket">
                <div class="hist-left">
                    <img src="${posterSrc}" class="hist-poster" alt="poster ${data.movie}">
                    <div class="hist-movie-info">
                        <p class="hist-brand">Zodiac cinemas</p>
                        <h4>${data.movie}</h4>
                        <p class="hist-studio">PONDOK LABU, STUDIO 1</p>
                    </div>
                </div>
                
                <div class="hist-divider">
                    <div class="hist-notch-top"></div>
                    <div class="hist-notch-bottom"></div>
                </div>

                <div class="hist-mid">
                    <div class="hist-row"><span class="hist-label">Tiket</span> <span>${data.seats}</span></div>
                    <div class="hist-row"><span class="hist-label">Jam</span> <span>${data.time}</span></div>
                    <div class="hist-row"><span class="hist-label">Tanggal</span> <span>${data.date}</span></div>
                </div>

                <div class="hist-divider">
                    <div class="hist-notch-top"></div>
                    <div class="hist-notch-bottom"></div>
                </div>

                <div class="hist-right">
                    <p class="hist-code-label">Kode Booking</p>
                    <p class="hist-code">${data.code}</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=ZODIAC-${data.code}" class="hist-qr" alt="QR Code">
                </div>
            </div>
        `;
        ticketList.innerHTML += ticketHTML;
    });
};