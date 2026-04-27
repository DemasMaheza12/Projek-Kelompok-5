#include <iostream>
#include <string>
#include <emscripten.h>

namespace ZodiacCinema {

    // Struct Node untuk Stack
    struct SeatNode {
        std::string seatId;
        SeatNode* next;
    };

    // Class Stack
    class SeatStack {
    private:
        SeatNode* top;

    public:
        SeatStack() : top(nullptr) {}

        void pushSeat(std::string id) {
            SeatNode* newNode = new SeatNode{id, top};
            top = newNode;
        }

        std::string popSeat() {
            if (top == nullptr) {
                return "EMPTY";
            }

            SeatNode* temp = top;
            std::string id = temp->seatId;
            top = top->next;
            
            delete temp; // Mencegah memory leak
            return id;
        }
    };
}

// Inisialisasi Objek Global
ZodiacCinema::SeatStack seatHistory;

// Binding WebAssembly
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void push_seat(const char* seatId) {
        seatHistory.pushSeat(seatId);
    }

    EMSCRIPTEN_KEEPALIVE
    const char* undo_seat() {
        static std::string undoneSeat;
        undoneSeat = seatHistory.popSeat();
        return undoneSeat.c_str();
    }
}

