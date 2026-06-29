# AI Agent Skills Definition (FIXMI Project)

## 1. Core Framework Mastery
* Menguasai pengembangan Next.js 14+ menggunakan App Router (`/app` directory).
* Mahir menulis kode menggunakan TypeScript (`.tsx`) dengan strict typing untuk props dan state.
* Memahami secara mendalam perbedaan serta pemisahan antara Server Components dan Client Components, termasuk keharusan menggunakan direktif `"use client"` di bagian atas file untuk komponen yang membutuhkan interaksi browser.

## 2. 3D Web & Interaction (WebGL)
* Ahli dalam implementasi ekosistem 3D berbasis komponen deklaratif menggunakan Three.js, React Three Fiber (R3F), dan `@react-three/drei`.
* Mampu memuat dan merender model 3D berformat `.glb` menggunakan hook `useGLTF` dari `@react-three/drei`.
* Menguasai penggunaan hook `useFrame` dan penerapan fungsi matematika lerp (Linear Interpolation) untuk membuat rotasi model 3D bereaksi dan mengikuti kursor mouse secara halus.
* Memiliki pemahaman tentang pencahayaan 3D (ambient & directional light) agar model terlihat realistis, serta konsep optimasi aset 3D seperti Draco Compression.

## 3. Advanced Scroll Animation & Storytelling
* Ahli menggunakan library animasi GSAP (GreenSock) dan plugin ScrollTrigger.
* Menguasai teknik menggambar urutan gambar (image sequence) frame demi frame ke dalam elemen HTML5 `<canvas>` untuk menciptakan ilusi video storytelling yang dikontrol oleh scroll.
* Mampu memanipulasi object state (contoh: `frame.current` dari 0 ke 300) dan mengikatnya dengan posisi scroll menggunakan fungsi `onUpdate` dari ScrollTrigger.
* Memastikan animasi scroll terasa mulus (menggunakan nilai `scrub: true` atau numerik) dan dapat melakukan reverse secara otomatis saat pengguna melakukan scroll ke atas.

## 4. UI/UX & Styling
* Mahir menggunakan Tailwind CSS untuk mempercepat styling komponen UI yang rapi, clean, dan responsif (mobile-friendly), seperti pada pembuatan Navbar dan Tabel Harga.
* Mampu mengimplementasikan efek UI modern seperti pembuatan background blur pada Navbar saat pengguna melakukan scroll.

## 5. Performance & Data Handling
* Mampu menulis script pre-loading gambar di background agar ratusan frame untuk image sequence tidak blank atau patah-patah saat user melakukan scroll.
* Memahami pentingnya mencegah memory leak di React dengan cara memisahkan logika GSAP ke dalam hook `useGSAP` atau `useEffect` yang terstruktur secara clean.
* Dapat merender data secara dinamis dari file lokal `data/pricelist.json` ke dalam bentuk tabel.