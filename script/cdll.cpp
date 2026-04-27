#include <iostream>
#include <string>
#include <emscripten.h>

namespace ZodiacCinema {

    // Struct untuk menyimpan data film dan posisi indeks HTML-nya
    struct Movie {
        std::string title;
        std::string genre;
        int domIndex; 
    };

    // Node Circular Doubly Linked List
    struct Node {
        Movie data;
        Node* next;
        Node* prev;
    };

    class MovieCarousel {
    private:
        Node* head;
        Node* current;

    public:
        MovieCarousel() : head(nullptr), current(nullptr) {}

        // Fungsi menambah film ke ujung Linked List
        void addMovie(std::string title, std::string genre, int index) {
            Node* newNode = new Node{{title, genre, index}, nullptr, nullptr};

            if (!head) {
                head = newNode;
                head->next = head;
                head->prev = head;
                current = head;
            } else {
                Node* tail = head->prev; // Node terakhir sebelum head
                
                tail->next = newNode;
                newNode->prev = tail;
                
                newNode->next = head;
                head->prev = newNode;
            }
        }

        // Logic Navigasi Pointer
        void next() { if (current) current = current->next; }
        void prev() { if (current) current = current->prev; }

        // Getter untuk dikirim ke JavaScript
        int getCurrentIndex() { return current ? current->data.domIndex : 0; }
        std::string getCurrentTitle() { return current ? current->data.title : ""; }
        std::string getCurrentGenre() { return current ? current->data.genre : ""; }
        
        // Fitur khusus untuk set awal karena JS kamu mulai dari index 1 ("Be With You")
        void setCurrentByIndex(int index) {
            if (!head) return;
            Node* temp = head;
            do {
                if (temp->data.domIndex == index) {
                    current = temp;
                    return;
                }
                temp = temp->next;
            } while (temp != head);
        }
    };
}

// Inisialisasi Objek Global
ZodiacCinema::MovieCarousel carousel;

// Jembatan WebAssembly (Binding)
extern "C" {
    
    // Inisialisasi Data dari C++ langsung
    EMSCRIPTEN_KEEPALIVE
    void init_carousel_data() {
        carousel.addMovie("Dilan 1991", "Drama, Romance", 0);
        carousel.addMovie("Be With You", "Fantasy, Romance", 1);
        carousel.addMovie("Tak Ingin Usai di Sini", "Drama, Romance", 2);
        carousel.addMovie("Na Willa", "Drama, Musical", 3);
        carousel.addMovie("Sore: Istri dari Masa Depan", "Romance, Fantasy", 4);
        carousel.addMovie("Danur: The Last Chapter", "Horror, Supranatural", 5);
        carousel.addMovie("The Call", "Horror, Mystery", 6);
        carousel.addMovie("Elf", "Comedy, Fantasy", 7);
        carousel.addMovie("Tunggu Aku Sukses Nanti", "Drama, Comedy", 8);
        carousel.addMovie("Humint", "Action, Thriller", 9);
        carousel.addMovie("5cm", "Drama, Adventure", 10);
        carousel.addMovie("Azzamine", "Drama, Romance", 11);

        // Atur posisi awal ke index 1 ("Be With You") sesuai desain UI-mu
        carousel.setCurrentByIndex(1);
    }

    EMSCRIPTEN_KEEPALIVE
    void move_next_cpp() { carousel.next(); }

    EMSCRIPTEN_KEEPALIVE
    void move_prev_cpp() { carousel.prev(); }

    EMSCRIPTEN_KEEPALIVE
    int get_current_index() { return carousel.getCurrentIndex(); }

    // Harus diubah jadi c_str() agar bisa dibaca UTF8ToString di JS
    EMSCRIPTEN_KEEPALIVE
    const char* get_current_title() {
        static std::string title;
        title = carousel.getCurrentTitle();
        return title.c_str();
    }

    EMSCRIPTEN_KEEPALIVE
    const char* get_current_genre() {
        static std::string genre;
        genre = carousel.getCurrentGenre();
        return genre.c_str();
    }
}