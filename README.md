# Portofolio Solihul Hadi

Landing page portofolio personal yang menampilkan identitas Solihul Hadi sebagai Web Developer. Halaman ini memberikan pengunjung gambaran singkat mengenai pemilik portofolio dan keahlian utamanya melalui tampilan responsif yang mengikuti referensi desktop dan mobile.

## Active Features

- Hero portofolio dengan latar gradien marun-keunguan, foto utama, dan tipografi berlapis.
- Tata letak yang responsif untuk desktop dan perangkat mobile.
- Navigasi mengambang dengan efek glassmorphism dan state aktif.
- Animasi teks bertahap dengan preferensi reduced motion.
- Teks hero dan label navigasi yang dapat disesuaikan lewat `data/portfolio.json`.
- Font Geologica dan ikon Remix Icon dimuat dari aset lokal.
- Favicon untuk browser, perangkat Apple, dan aplikasi Android menggunakan aset lokal.
- Navigasi Home, Education, Skills, Project, dan Contact memuat halaman secara dinamis tanpa memuat ulang dokumen.
- Riwayat pendidikan ditampilkan dari `data/education.json`.
- Halaman Skills menampilkan carousel Swiper; pada mobile tiap slide memuat hingga empat keahlian dalam grid dua kolom dan dua baris, dan dapat digeser dengan usapan.
- Halaman Project menampilkan tiga kartu per halaman di desktop dan dua di mobile; memilih kartu membuka dialog deskripsi proyek. Konten disiapkan sebelum ditampilkan agar transisi carousel tidak berkedip, dengan animasi kartu bertahap.
- Halaman Contact menampilkan email, telepon, tautan media sosial, dan viewer peta Google Maps responsif dari `data/contact.json`, dengan animasi transisi bertahap.
- Metadata dasar untuk SEO.

## Requirements

- PHP/WAMP atau server HTTP lokal lain untuk melayani halaman dan berkas JSON.
- Browser modern dengan dukungan CSS Grid, `backdrop-filter`, dan JavaScript.
- Aset lokal yang tersedia: `assets/img/user/person.png`, font Geologica, dan Remix Icon di `node_modules`.
- Favicon lokal dan manifest tersedia di `assets/img/pavicon`.
- Dependensi NPM yang tercantum pada `package.json` (ikon Remix Icon digunakan langsung dari `node_modules`).

## Persiapan dan Instalasi

1. Pastikan PHP/WAMP tersedia atau jalankan server HTTP lokal dari direktori proyek.
2. Jika dependensi belum terpasang, jalankan `npm install` pada direktori proyek.
3. Buka proyek melalui server lokal, misalnya `http://localhost/Portofolio/`, bukan dengan membuka `index.html` langsung. JavaScript mengambil konten dari `data/portfolio.json`.
4. Ubah teks pada `data/portfolio.json` untuk menyesuaikan konten hero dan label navigasi.
5. Ubah data pendidikan pada `data/education.json` untuk memperbarui riwayat pendidikan.
6. Ubah data keahlian pada `data/skills.json` dan sesuaikan path gambar yang tersedia pada `assets/img/skills/`.
7. Ubah nama, deskripsi, dan path gambar proyek pada `data/project.json`.
8. Ubah informasi kontak serta URL Google Maps dan URL embed peta pada `data/contact.json`.

## Struktur Berkas

- `index.html` — struktur semantik landing page dan metadata.
- `assets/css/style.css` — tampilan, responsivitas, glassmorphism, dan animasi.
- `assets/js/main.js` — pemuatan halaman dan konten JSON serta state navigasi.
- `assets/fonts/fonts.css` — deklarasi font Geologica lokal.
- `data/portfolio.json` — konten hero dan label menu yang dapat dikustomisasi.
- `page/home.html`, `page/education.html`, `page/skills.html`, `page/project.html`, dan `page/contact.html` — fragmen halaman yang dimuat secara dinamis.
- `data/education.json` — daftar tingkat dan institusi pendidikan.
- `data/skills.json` — nama, urutan, dan path gambar keahlian; carousel memakai Swiper lokal dari `node_modules`.
- `data/project.json` — nama, deskripsi, dan path gambar proyek.
- `data/contact.json` — email, telepon, media sosial, tautan Google Maps, dan URL embed peta.

## Dependensi

Dependensi yang tersedia di proyek dicatat dalam `package.json`: Bootstrap, Bootstrap Icons, jQuery, MDB UI Kit, Remix Icon, Select2, SweetAlert2, dan Swiper. Antarmuka menggunakan Remix Icon dan Swiper dari `node_modules`; tidak ada dependensi yang dimuat dari CDN.
