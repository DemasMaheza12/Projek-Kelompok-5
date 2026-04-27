#include <iostream>
#include <string>
#include <emscripten.h>

namespace ZodiacCinema { // 4. NAMESPACE

    // 1. STRUCT
    struct OrderNode {
        std::string orderData;
        OrderNode* next; // 3. POINTER
    };

    class PaymentQueue {
    private:
        OrderNode* front; 
        OrderNode* rear;  

    public:
        PaymentQueue() : front(nullptr), rear(nullptr) {}

        // 6. INLINE FUNCTION
        inline bool isEmpty() const {
            return front == nullptr;
        }

        // 2. REFERENCE (const std::string&)
        void enqueue(const std::string& data) {
            OrderNode* newNode = new OrderNode{data, nullptr};
            if (isEmpty()) {
                front = rear = newNode;
                return;
            }
            rear->next = newNode;
            rear = newNode;
        }

        std::string dequeue() {
            if (isEmpty()) return "EMPTY";
            
            OrderNode* temp = front;
            std::string data = temp->orderData;
            
            front = front->next;
            if (front == nullptr) rear = nullptr;
            
            delete temp; 
            return data;
        }
    };
}

ZodiacCinema::PaymentQueue systemQueue;

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void add_to_queue(const char* data) {
        systemQueue.enqueue(data);
    }

    EMSCRIPTEN_KEEPALIVE
    const char* process_queue() {
        static std::string processedData;
        processedData = systemQueue.dequeue();
        return processedData.c_str();
    }
}