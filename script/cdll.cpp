#include <iostream>
#include <string>
#include <emscripten.h>

namespace ZodiacCinema {

    struct Movie {
        std::string title;
        std::string genre;
        std::string imagePath;
        std::string rating;
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
        void addMovie(std::string title, std::string genre, std::string imagePath, std::string rating, int index) {
            Node* newNode = new Node{{title, genre, imagePath, rating, index}, nullptr, nullptr};
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
        void addMovie(std::string title, std::string genre, std::string imagePath, int index) {
            addMovie(title, genre, imagePath, "G" ,index);
        }

        void next() { if (isValid(current)) current = current->next; }
        void prev() { if (isValid(current)) current = current->prev; }

        int getCurrentIndex() { return isValid(current) ? current->data.domIndex : 0; }
        std::string getCurrentTitle() { return isValid(current) ? current->data.title : ""; }
        std::string getCurrentGenre() { return isValid(current) ? current->data.genre : ""; }
        std::string getCurrentImagePath() { return isValid(current) ? current->data.imagePath : ""; }
        std::string getCurrentRating() { return isValid(current) ? current->data.rating : ""; }

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
        carousel.addMovie("Dilan 1991", "Drama, Romance", "img/dilan.jpg","PG", 0);
        carousel.addMovie("Be With You", "Fantasy, Romance", "img/bwy.jpg", 1); // Menggunakan overloaded version ( default: G)
        carousel.addMovie("Tak Ingin Usai di Sini", "Drama, Romance", "img/takusai.jpeg", "PG-13", 2);
        carousel.addMovie("Na Willa", "Drama, Musical", "img/Na Willa.jpg", "G", 3);
        carousel.addMovie("Sore: Istri dari Masa Depan", "Romance, Fantasy", "img/sore.jpg", "PG-13", 4);
        carousel.addMovie("Danur: The Last Chapter", "Horror", "img/danur.jpg", "R", 5);
        carousel.addMovie("The Call", "Horror, Mystery", "img/call.jpg", "PG-13", 6);
        carousel.addMovie("Elf", "Comedy", "img/elf.jpg", "G", 7);
        carousel.addMovie("Tunggu Aku Sukses Nanti", "Drama, Comedy", "img/akusukses.jpg", "PG-13", 8);
        carousel.addMovie("Humint", "Action, Thriller", "img/humint.jpg", "PG-13", 9);
        carousel.addMovie("5cm", "Drama, Adventure", "img/5cm.jpg", 10); // Menggunakan overloaded version ( default: G)
        carousel.addMovie("Azzamine", "Drama, Romance", "img/azzamine.jpg", "G", 11);

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

    EMSCRIPTEN_KEEPALIVE
    const char* get_current_image_path() {
        static std::string imagePath;
        imagePath = carousel.getCurrentImagePath();
        return imagePath.c_str();
    }

    EMSCRIPTEN_KEEPALIVE
    const char* get_current_rating() {
        static std::string rating;
        rating = carousel.getCurrentRating();
        return rating.c_str();
    }

    EMSCRIPTEN_KEEPALIVE
    void set_current_by_index(int index) {
        carousel.setCurrentByIndex(index);
    }
}