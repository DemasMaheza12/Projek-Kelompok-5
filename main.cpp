#include <emscripten/val.h>
#include <emscripten/bind.h>

using namespace emscripten;

// Ini adalah fungsi C++ kita
void ubahTampilan() {
    // Mengambil elemen "document" dari browser
    val document = val::global("document");
    
    // Mencari elemen HTML dengan id "pesan"
    val elemen = document.call<val>("getElementById", val("pesan"));
    
    // Mengubah isi teks (innerHTML)
    elemen.set("innerHTML", val("Teks ini diubah menggunakan C++ via WebAssembly! CIHUYYY"));
    
    // Mengubah gaya CSS (warna teks) dari C++
    elemen["style"].set("color", val("#007bff"));
}

// Mengekspos fungsi ini agar bisa dikenali oleh halaman Web
EMSCRIPTEN_BINDINGS(my_module) {
    function("ubahTampilan", &ubahTampilan);
}

