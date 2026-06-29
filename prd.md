# Product Requirements Document (PRD) untuk Antigravity AI Agent

## TUGAS UTAMA
Bertindaklah sebagai Senior Next.js & WebGL Developer. Tugasmu adalah membangun sebuah website repair service perangkat pintar (iPhone, iPad, Android) yang sangat interaktif dan premium. Website ini membutuhkan implementasi 3D interaktif dan animasi scroll image sequence (mirip dengan gaya storytelling Apple atau website Corn Revolution), serta sistem routing untuk tabel harga (pricelist).

Tolong baca seluruh dokumen PRD ini sebelum menulis kode apa pun, lalu kerjakan selangkah demi selangkah berdasarkan fase yang ditentukan.

## 1. TECH STACK & ARSITEKTUR
Gunakan teknologi berikut dengan strict mode:
* Core Framework: Next.js 14+ (App Router)
* 3D Engine: Three.js, `@react-three/fiber`, `@react-three/drei`
* Animation: GSAP, `gsap/ScrollTrigger`
* Styling: Tailwind CSS
* Data Management: File JSON lokal (`/data/pricelist.json`)

## 2. STRUKTUR DIREKTORI (NEXT.JS APP ROUTER)
Bangun arsitektur folder seperti berikut:
* `app/page.tsx` (Landing Page berisi Hero 3D & Scroll Sequence)
* `app/pricelist/page.tsx` (Menu utama kategori: iPhone, iPad, Android)
* `app/pricelist/[kategori]/page.tsx` (Tabel harga dinamis berdasarkan kategori & tipe device)
* `components/` (Pisahkan komponen seperti Navbar.tsx, Hero3D.tsx, ScrollSequence.tsx, PriceTable.tsx)
* `data/pricelist.json` (Sumber data harga)
* `public/models/` (Tempat menyimpan file .glb)
* `public/sequence/` (Tempat menyimpan ratusan frame gambar .jpg atau .webp untuk animasi scroll)

## 3. FASE PENGEMBANGAN (KERJAKAN SECARA BERURUTAN)

### Phase 1: Project Setup & Layouting
* Inisialisasi project Next.js menggunakan Tailwind CSS.
* Instal semua dependencies (Three, R3F, Drei, GSAP).
* Buat `Navbar.tsx` global yang memiliki link ke "Home" (`/`) dan "Pricelist" (`/pricelist`). Navbar harus transparan di awal dan memiliki background blur saat di-scroll.

### Phase 2: Struktur Data & Halaman Pricelist
* Buat file `data/pricelist.json` yang memuat array kategori (iphone, ipad, android), tipe device (misal: iPhone 17 Pro Max), dan daftar layanannya (LCD, Battery, dll) beserta harganya.
* Buat routing dinamis di `app/pricelist/[kategori]/page.tsx`.
* Render data dari JSON ke dalam tabel menggunakan Tailwind CSS yang rapi, clean, dan responsif (mobile-friendly).

### Phase 3: Hero Section (R3F 3D Interaction)
* Buat komponen `Hero3D.tsx` di `app/page.tsx`.
* Gunakan `@react-three/fiber` dan muat model dummy `.glb` sementara menggunakan `@react-three/drei` `useGLTF`.
* Gunakan hook `useFrame` untuk membuat rotasi model 3D bereaksi (mengikuti) posisi kursor mouse secara halus menggunakan fungsi matematika lerp (Linear Interpolation).

### Phase 4: Animasi Scroll-Triggered Image Sequence (Bagian Paling Krusial)
* Buat komponen `ScrollSequence.tsx` di bawah hero section.
* Implementasikan HTML5 yang mengisi layar penuh (sticky / pinned saat di-scroll).
* Gunakan GSAP ScrollTrigger untuk memanipulasi object state (misal `frame.current` dari 0 ke 300).
* Pada setiap fungsi `onUpdate` dari GSAP, gambar frame gambar yang sesuai ke dalam kanvas.
* Pastikan scroll terasa mulus (`scrub: true` atau nilai scrub numerik) dan bisa di-reverse secara otomatis saat pengguna melakukan scroll ke atas.

### Phase 5: Optimasi & Preloading
* Tuliskan script pre-loading gambar untuk image sequence agar saat user melakukan scroll, gambar tidak patah-patah atau blank.
* Pastikan komponen 3D menggunakan konfigurasi cahaya (ambient & directional light) yang baik agar terlihat realistis.

## 4. ATURAN KODE UNTUK AGENT:
1.  Gunakan TypeScript (`.tsx`) dengan strict typing untuk props dan state.
2.  Pisahkan logika GSAP ke dalam hook `useGSAP` atau `useEffect` yang clean untuk menghindari memory leak di React.
3.  Jangan menggunakan server components untuk komponen yang membutuhkan interaksi browser (gunakan `"use client"` di bagian atas file untuk komponen R3F dan GSAP).

## 💡 Tips Ekstra Untukmu Saat Menggunakan Antigravity:
* **Siapkan Aset Dulu:** Antigravity tidak bisa membuat gambar 3D yang dipotong-potong menjadi ratusan frame. Kamu harus menyiapkan folder berisi `0001.jpg` hingga `0300.jpg` dan meletakkannya di folder `public/sequence/` sebelum menyuruh agen menjalankan fase 4.
* **Dummy Model:** Sediakan satu file `.glb` bebas (misal ukuran kecil di bawah 2MB) di folder `public/models/` agar agen bisa langsung menguji kode React Three Fiber di Fase 3 tanpa error.
* **Prompting Bertahap:** Jika agent terlihat kewalahan (kodenya terputus), perintahkan dia dengan: "Selesaikan Phase 1 dan 2 terlebih dahulu. Tunggu instruksiku sebelum lanjut ke Phase 3.". Ini menjaga kualitas kode tetap fokus dan terhindar dari bug.