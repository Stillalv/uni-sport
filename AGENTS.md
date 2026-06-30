<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Aturan Eksekusi Git (Git Policy)
1. **Pengembangan Lokal Terlebih Dahulu (Local-First Development)**: Semua pengerjaan fitur baru (*features*), perbaikan *bug* (*fixes*), kustomisasi, atau perubahan kode lainnya harus diimplementasikan dan diselesaikan di lingkungan lokal terlebih dahulu.
2. **Validasi Sebelum Commit**: Sebelum melakukan *commit* lokal, pastikan perubahan kode telah lolos uji coba lokal (seperti `npm run build` dan pengecekan server *development*).
3. **Penyimpanan Lokal (Local Commit)**: Simpan setiap progres atau penyelesaian tugas dengan melakukan *commit* secara lokal (`git commit`) dengan pesan commit yang deskriptif dan terstruktur.
4. **Larangan Keras Push Otomatis**: Agen dilarang keras mengeksekusi perintah `git push` ke repositori *remote* secara otomatis setelah melakukan modifikasi kode.
5. **Push Hanya atas Instruksi Spesifik**: Unggah perubahan ke GitHub/produksi menggunakan `git push` hanya setelah mendapatkan izin eksplisit atau instruksi khusus dari pengguna (misalnya: "pls review and push", "push ke github").
6. **Review Sebelum Push**: Lakukan peninjauan singkat (`git status` dan `git log`) sebelum melakukan *push* untuk memastikan repositori dalam keadaan bersih dan hanya perubahan yang diinginkan saja yang terkirim.
7. **Strategi & Frekuensi Commit (Commit Strategy)**:
   * Hindari melakukan *commit* untuk setiap perubahan kecil atau baris kode tunggal (*commit spam*).
   * Lakukan *commit* hanya setelah satu unit fungsionalitas logis selesai dikerjakan, diuji, dan dipastikan berjalan (misal: satu fitur selesai dirancang, atau satu bug besar selesai diperbaiki).
   * Untuk fitur besar (*major feature*) atau perbaikan besar (*major fix*), pecah *commit* menjadi beberapa bagian logis secara bertahap (seperti backend/API terlebih dahulu, kemudian UI/frontend, lalu integrasi/finalisasi).
   * Gunakan format pesan *commit* standar (Conventional Commits) agar riwayat Git mudah dibaca, misalnya: `feat: ...` (fitur baru), `fix: ...` (perbaikan bug), `style: ...` (tata letak/visual), `refactor: ...` (restrukturisasi kode), `docs: ...` (dokumentasi).



# Aturan Bahasa (Language Policy)
Selalu jawab dan berkomunikasi dengan pengguna menggunakan Bahasa Indonesia secara konsisten, meskipun pengguna kadang menggunakan atau menyelipkan Bahasa Inggris dalam pertanyaannya. Selain itu, tulis dan buat semua dokumen perencanaan serta peninjauan proyek seperti rencana implementasi (`implementation_plan.md`), daftar tugas (`task.md`), dan catatan perubahan (`walkthrough.md`) menggunakan Bahasa Indonesia secara konsisten. Namun, seluruh teks antarmuka (UI Text) di dalam website/aplikasi (seperti teks tombol, placeholder input, modal, dropdown, dll) harus menggunakan Bahasa Inggris secara konsisten agar sesuai dengan standar proyek ini.

# Aturan Kualitas & Ketelitian Kerja (Quality & Thoroughness Policy)
1. **Analisis Konteks Sebelum Bertindak**: Sebelum mengubah kode, jelajahi file-file terkait untuk memahami alur data dan dependensinya secara penuh. Jangan membuat perubahan berdasarkan asumsi tanpa memeriksa implementasi aslinya.
2. **Implementasi Tuntas (No Placeholders)**: Selalu tulis kode secara lengkap dan utuh. Dilarang keras menyisakan komentar placeholder seperti `// TODO: implement later`, `// ... kode lainnya`, atau membiarkan fungsi kosong tanpa implementasi nyata.
3. **Wajib Uji Coba & Validasi**: Setiap kali selesai memodifikasi kode, jalankan perintah build proyek (`npx next build` atau `npm run build`) untuk memastikan bahwa kode tidak merusak aplikasi dan bebas dari *type error* TypeScript sebelum melaporkan hasil pekerjaan kepada pengguna.
4. **Konsistensi Arsitektur**: Patuhi pola arsitektur bersih (*Clean Architecture*) 4-layer yang sudah mapan dalam proyek ini ketika menambahkan atau mengubah fitur.
