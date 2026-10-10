Buatkan kode HTML, CSS, dan JavaScript untuk landing page portofolio personal berdasarkan ketentuan dan desain berikut:
# Aturan Agent
1. Baca aturan umum yang harus disepakati pada file .agentrules
2. Baca folder data yang berisikan Konten Web Menyesuaikan file JSON agar mudah di kostumasi

# Struktur & Aset File
1. Font Custom         : Gunakan font Geologica yang dimuat dari folder lokal assets/fonts/ via @font-face di CSS.
2. Gambar Karakter/Foto: Path file foto utama terletak di assets/img/user/person.png.

# Tata Letak (Layout) & Desain Visual
1. Background: Latar belakang menggunakan gradien warna marun gelap ke keunguan (dark maroon/purple gradient) seperti pada desain referensi.
2. Hero Section:
  - Teks Latar Belakang: Tulisan raksasa "Portofolio" berada di paling belakang dengan warna pudar/transparan, tepat di belakang foto utama.
  - Foto Utama: Berada di posisi tengah (center/overlay) di atas teks latar belakang.
  - Teks Informasi Kiri & Kanan (Melayang di samping foto):
    - Kiri Atas: "Assalamualaikum"
    - Kiri Tengah: Teks besar "Saya Solihul"
    - Kiri Bawah: Tagline keahlian "PHP + Javascript"
    - Kanan Atas: "Web Developer"
    - Kanan Tengah: Teks besar "Hadi" (posisi teks "Solihul Hadi" terbagi di kiri dan kanan foto)
    - Kanan Bawah: "Python"
  - Bottom Navigation Bar (Sticky Bar): 
    - Buat floating navigation bar melayang di bagian bawah layar (fixed/sticky bottom navigation).
    - Efek visual navbar menggunakan glassmorphism (latar transparan dengan backdrop-filter: blur()).
    - Menu nav meliputi Icon + Teks: Home, Education, Skills, Project, Contact.
    - Berikan state active yang jelas pada menu yang sedang dipilih.
  - Footer:
    - Tulisan pudar di paling bawah: "Copyright Solihul Hadi All Rights Reserved".
3. Animasi & Transisi
    Gunakan CSS Animation / ScrollReveal / Intersection Observer agar semua elemen teks muncul secara bertahap (staggered animation).
    Efek Kemunculan Teks:
    - Teks bagian atas muncul meluncur halus dari atas ke bawah (fade-in-down).
    - Teks samping kiri meluncur dari kiri (fade-in-left).
    - Teks samping kanan meluncur dari kanan (fade-in-right).
    - Animasi harus terasa sangat lembut (smooth transition with cubic-bezier).
Tolong sediakan kode HTML lengkap, CSS terpisah dengan sintaks yang rapi dan responsive (bagus di tampilan mobile maupun desktop), serta script JS untuk animasinya.