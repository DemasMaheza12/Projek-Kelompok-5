#include <iostream>
#include <string>
#include <emscripten.h>

namespace ZodiacCinema {

    struct Movie {
        std::string title;
        std::string genre;
        int domIndex; 
    };

    struct Node {
        Movie data;
        Node* next;
        Node* prev;
    };

    // --- 7. FUNCTION TEMPLATE ---
    // Template untuk mengecek apakah sebuah pointer valid (digunakan secara internal)
    template <typename T>
    bool isValid(T* ptr) {
        return ptr != nullptr;
    }

    class MovieCarousel {
    private:
        Node* head;
        Node* current;

    public:
        MovieCarousel() : head(nullptr), current(nullptr) {}

        // --- 7. FUNCTION OVERLOADING (Versi 1: Lengkap) ---
        void addMovie(std::string title, std::string genre, int index) {
            Node* newNode = new Node{{title, genre, index}, nullptr, nullptr};
            if (!isValid(head)) { // Menggunakan template
                head = newNode;
                head->next = head;
                head->prev = head;
                current = head;
            } else {
                Node* tail = head->prev;
                tail->next = newNode;
                newNode->prev = tail;
                newNode->next = head;
                head->prev = newNode;
            }
        }

        // --- 7. FUNCTION OVERLOADING (Versi 2: Tanpa Genre) ---
        void addMovie(std::string title, int index) {
            addMovie(title, "General", index);
        }

        void next() { if (isValid(current)) current = current->next; }
        void prev() { if (isValid(current)) current = current->prev; }

        int getCurrentIndex() { return isValid(current) ? current->data.domIndex : 0; }
        std::string getCurrentTitle() { return isValid(current) ? current->data.title : ""; }
        std::string getCurrentGenre() { return isValid(current) ? current->data.genre : ""; }
        
        void setCurrentByIndex(int index) {
            if (!isValid(head)) return;
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

ZodiacCinema::MovieCarousel carousel;

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void init_carousel_data() {
        // Contoh penggunaan Overloading
        carousel.addMovie("Dilan 1991", "Drama, Romance", 0);
        carousel.addMovie("Be With You", 1); // Menggunakan overloaded version (genre default: General)
        carousel.addMovie("Tak Ingin Usai di Sini", "Drama, Romance", 2);
        carousel.addMovie("Na Willa", "Drama, Musical", 3);
        carousel.addMovie("Sore: Istri dari Masa Depan", "Romance, Fantasy", 4);
        carousel.addMovie("Danur: The Last Chapter", "Horror", 5);
        carousel.addMovie("The Call", "Horror, Mystery", 6);
        carousel.addMovie("Elf", "Comedy", 7);
        carousel.addMovie("Tunggu Aku Sukses Nanti", "Drama, Comedy", 8);
        carousel.addMovie("Humint", "Action, Thriller", 9);
        carousel.addMovie("5cm", "Drama, Adventure", 10);
        carousel.addMovie("Azzamine", "Drama, Romance", 11);

        carousel.setCurrentByIndex(1);
    }

    EMSCRIPTEN_KEEPALIVE
    void move_next_cpp() { carousel.next(); }

    EMSCRIPTEN_KEEPALIVE
    void move_prev_cpp() { carousel.prev(); }

    EMSCRIPTEN_KEEPALIVE
    int get_current_index() { return carousel.getCurrentIndex(); }

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