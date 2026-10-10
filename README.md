# Portofolio Solihul Hadi

Landing page portofolio personal yang menampilkan identitas Solihul Hadi sebagai Web Developer. Halaman ini memberikan pengunjung gambaran singkat mengenai pemilik portofolio dan keahlian utamanya melalui tampilan responsif yang mengikuti referensi desktop dan mobile.

## Active Features

- Hero portofolio dengan latar gradien marun-keunguan, foto utama, dan tipografi berlapis.
- Preloader berlatar gelap menampilkan favicon, spinner, dan progress bar selama dua detik; setelah selesai, preloader menghilang dan animasi reveal halaman awal mulai terlihat.
- Tata letak yang responsif untuk desktop dan perangkat mobile.
- Navigasi mengambang dengan efek glassmorphism; pada layar mobile tombol menu aktif tampil terangkat seperti tombol floating.
- Animasi teks bertahap dengan preferensi reduced motion.
- Saat Home tidak menerima interaksi, teks hero bergeser lembut satu per satu dengan jeda dua detik; gerakan berhenti saat ada interaksi atau preferensi reduced motion aktif.
- Teks hero dan label navigasi yang dapat disesuaikan lewat `data/portfolio.json`.
- Font Geologica, Remix Icon, dan Swiper dimuat dari aset lokal yang ikut tersimpan di repositori, sehingga tetap tersedia pada GitHub Pages.
- Favicon untuk browser, perangkat Apple, dan aplikasi Android menggunakan aset lokal.
- Navigasi Home, Education, Skills, Project, dan Contact memuat halaman secara dinamis tanpa memuat ulang dokumen.
- Nama Solihul Hadi pada copyright footer berwarna oranye dan tertaut ke profil GitHub.
- Riwayat pendidikan ditampilkan dari `data/education.json` dalam susunan sticky note 2 × 2 berwarna `#ead8e8` pada desktop dan mobile, menggunakan font lokal Shadows Into Light. Ukuran sticky note dibatasi agar lebih proporsional pada desktop.
- Halaman Skills menampilkan carousel Swiper tanpa latar kartu; gambar keahlian memakai bingkai claymorphism. Pada mobile tiap slide memuat hingga empat keahlian dalam grid dua kolom dan dua baris, dan dapat digeser dengan usapan.
- Halaman Project menampilkan carousel coverflow dengan gambar proyek bertumpuk, tanpa garis pinggir, dan berbayang lembut; kartu aktif berukuran paling besar. Tiap proyek memiliki titik navigasi sendiri dan dapat dipilih satu per satu. Memilih gambar membuka dialog deskripsi tanpa garis pinggir agar tampil lebih alami.
- Halaman Contact menampilkan email, telepon, tautan media sosial, dan viewer peta Google Maps responsif dari `data/contact.json`, dengan animasi transisi bertahap.
- CI menjalankan `npm test` untuk memeriksa struktur data JSON setiap halaman, direktori aset gambar, serta keberadaan file gambar yang dirujuk oleh data.
- Kartu Education memiliki efek hover yang mengangkat dan membesarkan sticky note pada desktop.
- Metadata dasar untuk SEO.

## Requirements

- PHP/WAMP atau server HTTP lokal lain untuk melayani halaman dan berkas JSON.
- Browser modern dengan dukungan CSS Grid, `backdrop-filter`, dan JavaScript.
- Aset lokal yang tersedia: `assets/img/user/person.png`, font Geologica, dan Remix Icon di `assets/vendor/remixicon`.
- Font Shadows Into Light tersedia secara lokal di `assets/fonts` beserta lisensi SIL Open Font License.
- Favicon lokal dan manifest tersedia di `assets/img/pavicon`.
- Berkas vendor Remix Icon dan Swiper tersedia di `assets/vendor`; `node_modules` hanya diperlukan untuk pengembangan lokal.

## Persiapan dan Instalasi

1. Jalankan server HTTP lokal dari direktori proyek, misalnya PHP/WAMP pada `http://localhost/Portofolio/`; halaman mengambil konten dengan `fetch` sehingga tidak dapat dibuka langsung sebagai `file://`.
2. Jika dependensi pengembangan belum terpasang, jalankan `npm install` pada direktori proyek.
3. Jalankan `npm test` untuk memeriksa struktur data dan keberadaan folder serta file gambar.
4. Untuk GitHub Pages, atur sumber publikasi ke branch yang menyimpan `index.html` pada root (misalnya `main` / `/ (root)`). Aset memakai path relatif dari root repositori dan dependensi antarmuka sudah tersedia di `assets/vendor`.
5. Ubah teks pada `data/portfolio.json` untuk menyesuaikan konten hero dan label navigasi.
6. Ubah data pendidikan pada `data/education.json` untuk memperbarui riwayat pendidikan.
7. Ubah data keahlian pada `data/skills.json` dan sesuaikan path gambar yang tersedia pada `assets/img/skills/`.
8. Ubah nama, deskripsi, dan path gambar proyek pada `data/project.json`.
9. Ubah informasi kontak serta URL Google Maps dan URL embed peta pada `data/contact.json`.

## Struktur Berkas

- `index.html` — struktur semantik landing page dan metadata.
- `assets/css/style.css` — tampilan, responsivitas, glassmorphism, dan animasi.
- `assets/js/main.js` — pemuatan halaman dan konten JSON serta state navigasi.
- `assets/fonts/fonts.css` — deklarasi font Geologica lokal.
- `assets/vendor/remixicon/` dan `assets/vendor/swiper/` — stylesheet, font ikon, dan modul carousel lokal untuk deployment statis.
- `data/portfolio.json` — konten hero dan label menu yang dapat dikustomisasi.
- `page/home.html`, `page/education.html`, `page/skills.html`, `page/project.html`, dan `page/contact.html` — fragmen halaman yang dimuat secara dinamis.
- `data/education.json` — daftar tingkat dan institusi pendidikan.
- `data/skills.json` — nama, urutan, dan path gambar keahlian; carousel memakai Swiper lokal dari `assets/vendor/swiper`.
- `data/project.json` — nama, deskripsi, dan path gambar proyek.
- `data/contact.json` — email, telepon, media sosial, tautan Google Maps, dan URL embed peta.
- `tests/data.test.js` — pengujian skema data halaman dan keberadaan direktori/file gambar.
- `.github/workflows/ci.yml` — GitHub Actions untuk menjalankan pengujian pada push dan pull request.

## Dependensi

Dependensi pengembangan yang tercatat di `package.json`: Bootstrap, Bootstrap Icons, jQuery, MDB UI Kit, Remix Icon, Select2, SweetAlert2, dan Swiper. Pengujian menggunakan test runner bawaan Node.js tanpa dependensi tambahan. Antarmuka menggunakan salinan lokal Remix Icon dan Swiper di `assets/vendor`; tidak ada dependensi yang dimuat dari CDN atau diminta dari `node_modules` ketika situs berjalan.
