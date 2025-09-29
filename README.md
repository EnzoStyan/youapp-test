# YouApp Coding Test - Fullstack App 🚀
Aplikasi ini mencakup fitur autentikasi pengguna, manajemen profil, hingga fitur chat privat secara *real-time*.
---
## 🛠️ Teknologi yang Dipakai

Berikut adalah tumpukan teknologi (*tech stack*) yang digunakan dalam proyek ini:

### Backend
* **Framework**: NestJS
* **Database**: MongoDB
* **Komunikasi Real-time**: Socket.IO
* **Otentikasi**: JWT (JSON Web Tokens)
* **Validasi Data**: `class-validator` & `class-transformer`
* **Lingkungan**: Docker & Docker Compose

### Frontend
* **Framework**: Next.js (dengan App Router)
* **Styling**: Tailwind CSS
* **Manajemen State**: React Context & Hooks
* **Komunikasi API**: Axios
* **Bahasa**: TypeScript

---

## 🏃 Cara Menjalankan Proyek

Untuk menjalankan proyek ini di komputermu, ikuti langkah-langkah mudah berikut.

### Prasyarat
Pastikan kamu sudah menginstal:
1.  **Node.js** (versi 20 atau lebih tinggi direkomendasikan)
2.  **Docker Desktop** (pastikan sudah berjalan)

### Langkah-langkah Instalasi

1.  **Clone Repositori Ini**
    ```bash
    git clone [https://github.com/EnzoStyan/youapp-code-test.git](https://github.com/EnzoStyan/youapp-code-test.git)
    cd youapp-code-test
    ```

2.  **Jalankan Backend**
    Backend kita berjalan di dalam Docker, jadi super gampang!
    ```bash
    # Masuk ke folder backend
    cd backend

    # Jalankan dengan Docker Compose
    docker-compose up --build
    ```
    Biarkan terminal ini terbuka. Backend akan berjalan di `http://localhost:3000`.

3.  **Jalankan Frontend**
    Buka terminal **baru**, lalu jalankan perintah berikut dari folder **root** proyek.
    ```bash
    # Masuk ke folder frontend
    cd frontend

    # Instal semua paket yang dibutuhkan
    npm install

    # Jalankan server development
    npm run dev
    ```
    Frontend akan berjalan di `http://localhost:3001`. Buka alamat ini di browser-mu.

Selesai! Sekarang aplikasi sudah siap untuk diuji coba.

---

## ✨ Fitur Utama

* ✅ **Autentikasi Pengguna**: Sistem Register dan Login yang aman menggunakan JWT.
* 👤 **Manajemen Profil**: Pengguna bisa membuat, melihat, dan memperbarui profil mereka (nama, tanggal lahir, dll).
* 🔮 **Logika Bisnis Kustom**: Perhitungan Zodiak dan Shio (Horoskop) secara otomatis berdasarkan tanggal lahir.
* 💬 **Chat Real-time**: Fitur chat privat antar pengguna menggunakan WebSockets.
* 🔐 **Rute Terproteksi**: Halaman profil dan chat hanya bisa diakses setelah login.
* 💅 **UI Modern**: Tampilan yang dibuat semirip mungkin dengan desain Figma menggunakan Next.js dan Tailwind CSS.
