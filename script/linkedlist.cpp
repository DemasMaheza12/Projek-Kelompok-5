#include <iostream>
#include <string>
#include <emscripten.h>

namespace ZodiacCinema {

    // 1. STRUCT & 3. POINTER
    struct TicketNode {
        std::string ticketData; // Kita simpan data tiket dalam format JSON string
        TicketNode* next;
    };

    class HistoryLinkedList {
    private:
        TicketNode* head;
        TicketNode* tail;

    public:
        HistoryLinkedList() : head(nullptr), tail(nullptr) {}

        // Menambahkan tiket baru ke akhir list (Insert at Tail)
// Mengubah logika menjadi Insert at Head (Data terbaru di atas)
        void insertTicket(const std::string& data) {
            // 1. Buat node baru, pointer 'next'-nya langsung menunjuk ke 'head' saat ini
            TicketNode* newNode = new TicketNode{data, head};

            // 2. Pindahkan 'head' ke node yang baru dibuat agar ia jadi yang paling depan
            head = newNode;

            // 3. Jika list sebelumnya kosong, maka tail juga menunjuk ke node yang sama
            if (tail == nullptr) {
                tail = newNode;
            }
        }

        // Mengambil semua isi Linked List disatukan dengan pemisah "||"
        std::string getAllTickets() {
            if (head == nullptr) return "KOSONG";

            std::string result = "";
            TicketNode* current = head; // Traversal pointer
            
            while (current != nullptr) {
                result += current->ticketData;
                if (current->next != nullptr) {
                    result += "||"; // Pembatas antar node
                }
                current = current->next;
            }
            return result;
        }
        
        // Membersihkan memori (Penting di C++)
        void clearList() {
            TicketNode* current = head;
            while (current != nullptr) {
                TicketNode* nextNode = current->next;
                delete current;
                current = nextNode;
            }
            head = tail = nullptr;
        }
    };
}

ZodiacCinema::HistoryLinkedList historyList;

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void add_to_history(const char* data) {
        historyList.insertTicket(data);
    }

    EMSCRIPTEN_KEEPALIVE
    const char* get_all_history() {
        static std::string allData;
        allData = historyList.getAllTickets();
        return allData.c_str();
    }
    
    EMSCRIPTEN_KEEPALIVE
    void reset_history_list() {
        historyList.clearList();
    }
}