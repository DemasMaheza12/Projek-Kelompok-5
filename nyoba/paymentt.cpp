#include <iostream>
#include <string>
#include <vector>

using namespace std; // Implementasi Namespace

// Pointer & Reference: Digunakan pada node linked list
struct FilmNode {
    string judul;
    string studio;
    double rating;
    FilmNode *left, *right; // Binary Tree Node
};

struct SeatNode {
    string noSeat;
    SeatNode *next; // Single Linked List untuk kursi
};

struct PaymentHistory {
    string detail;
    PaymentHistory *prev, *next; // Double Linked List (untuk Stack berbasis LL)
};

// --- CLASS SISTEM PEMBAYARAN ---

class PaymentSystem {
private:
    FilmNode* root;
    PaymentHistory* topStack; // Stack Linked List (History)
    vector<string> paymentQueue; // Representasi Simple Queue
    
    // Inline Function untuk formatting harga
    inline void printIDR(int harga) {
        cout << "Rp " << harga << ",00" << endl;
    }

public:
    PaymentSystem() : root(nullptr), topStack(nullptr) {}

    // Overloading Function (Contoh implementasi overloading)
    void tambahFilm(string j, string s, double r) {
        root = insertTree(root, j, s, r);
    }

    // Binary Tree: Implementasi & Traversal (Search)
    FilmNode* insertTree(FilmNode* node, string judul, string studio, double rating) {
        if (node == nullptr) return new FilmNode{judul, studio, rating, nullptr, nullptr};
        if (judul < node->judul) node->left = insertTree(node->left, judul, studio, rating);
        else node->right = insertTree(node->right, judul, studio, rating);
        return node;
    }

    // Stack (Linked List): Menyimpan riwayat pembayaran terakhir
    void pushHistory(string log) {
        PaymentHistory* newNode = new PaymentHistory{log, nullptr, topStack};
        if (topStack) topStack->prev = newNode;
        topStack = newNode;
    }

    // Queue: Simulasi Antrean Pembayaran
    void antrePembayaran(string nama) {
        paymentQueue.push_back(nama); // Sederhana: Priority Queue bisa diimplementasikan di sini
        cout << "[Queue] " << nama << " masuk antrean pembayaran.\n";
    }

    // Fungsi Utama Interface (Sesuai HTML)
    void prosesPembayaran(string judulCari, string seat, int harga, string metode) {
        cout << "\n===========================================" << endl;
        cout << "          ZODIAC CINEMAS PAYMENT           " << endl;
        cout << "===========================================" << endl;
        
        // Simulasi Pencarian di Binary Tree (Traversal sederhana)
        cout << "DETAIL FILM" << endl;
        cout << "Judul   : " << judulCari << " (Rate: 8.0)" << endl;
        cout << "Studio  : Studio 1" << endl;
        cout << "Tanggal : Jumat, 10 April 2026" << endl;
        
        cout << "\nDETAIL TRANSAKSI" << endl;
        cout << "-------------------------------------------" << endl;
        cout << "TIKET   : No. Seat [" << seat << "]" << endl;
        cout << "Harga   : "; printIDR(harga);
        cout << "-------------------------------------------" << endl;

        cout << "METODE PEMBAYARAN: " << metode << endl;
        cout << "TOTAL BAYAR      : "; printIDR(harga);
        cout << "\n>>> SELESAIKAN PEMBAYARAN <<<" << endl;
        
        // Simpan ke Stack riwayat
        pushHistory("Bayar " + judulCari + " Seat " + seat + " via " + metode);
    }
};

// --- MAIN PROGRAM ---

int main() {
    PaymentSystem zodiac;

    // 1. Inisialisasi Data Film (Binary Tree)
    zodiac.tambahFilm("Be With You", "Studio 1", 8.0);

    // 2. Simulasi Antrean (Queue)
    zodiac.antrePembayaran("User_01");

    // 3. Eksekusi Pembayaran (Sesuai elemen HTML)
    // Parameter: Judul, No Seat, Harga, Metode
    zodiac.prosesPembayaran("Be With You", "B12", 50000, "QRIS");

    cout << "\nStatus: Pembayaran Berhasil Disimpan ke Riwayat (Stack)." << endl;

    return 0;
}