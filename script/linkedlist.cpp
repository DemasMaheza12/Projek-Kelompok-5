#include <iostream>
#include <string>
#include <emscripten.h>

namespace ZodiacCinema {

    struct TicketNode {
        std::string ticketData;
        TicketNode* next;
    };

    class HistoryLinkedList {
    private:
        TicketNode* head;
        TicketNode* tail;

    public:
        HistoryLinkedList() : head(nullptr), tail(nullptr) {}

        void insertTicket(const std::string& data) {
            TicketNode* newNode = new TicketNode{data, head};
            head = newNode;
            if (tail == nullptr) tail = newNode;
        }

        // --- 5. CALLBACK FUNCTION ---
        // Fungsi ini menerima pointer ke fungsi lain sebagai parameter
        void forEachTicket(void (*callback)(const char*)) {
            TicketNode* current = head;
            while (current != nullptr) {
                callback(current->ticketData.c_str());
                current = current->next;
            }
        }

        std::string getAllTickets() {
            if (head == nullptr) return "KOSONG";
            std::string result = "";
            TicketNode* current = head;
            while (current != nullptr) {
                result += current->ticketData;
                if (current->next != nullptr) result += "||";
                current = current->next;
            }
            return result;
        }
        
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

// Fungsi callback contoh untuk mencetak ke log C++
void logToConsole(const char* data) {
    printf("Processing Ticket: %s\n", data);
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void add_to_history(const char* data) {
        historyList.insertTicket(data);
    }

    EMSCRIPTEN_KEEPALIVE
    const char* get_all_history() {
        // Memanggil Callback sebelum mengembalikan data (untuk memenuhi syarat UTS)
        historyList.forEachTicket(logToConsole); 
        
        static std::string allData;
        allData = historyList.getAllTickets();
        return allData.c_str();
    }
    
    EMSCRIPTEN_KEEPALIVE
    void reset_history_list() {
        historyList.clearList();
    }
}