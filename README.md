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
- Navigasi Home dan Education memuat halaman secara dinamis tanpa memuat ulang dokumen.
- Riwayat pendidikan ditampilkan dari `data/education.json`.
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

## Struktur Berkas

- `index.html` — struktur semantik landing page dan metadata.
- `assets/css/style.css` — tampilan, responsivitas, glassmorphism, dan animasi.
- `assets/js/main.js` — pemuatan halaman dan konten JSON serta state navigasi.
- `assets/fonts/fonts.css` — deklarasi font Geologica lokal.
- `data/portfolio.json` — konten hero dan label menu yang dapat dikustomisasi.
- `page/home.html` dan `page/education.html` — fragmen halaman yang dimuat secara dinamis.
- `data/education.json` — daftar tingkat dan institusi pendidikan.

## Dependensi

Dependensi yang tersedia di proyek dicatat dalam `package.json`: Bootstrap, Bootstrap Icons, jQuery, MDB UI Kit, Remix Icon, Select2, SweetAlert2, dan Swiper. Halaman landing ini tidak memuat dependensi dari CDN; hanya Remix Icon yang digunakan oleh antarmuka.
