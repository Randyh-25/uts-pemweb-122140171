# UTS Pengembangan Aplikasi Web

**Nama:** Randy Hendriyawan  
**NIM:** 122140171  

## 📘 Deskripsi Proyek
Proyek ini merupakan bagian dari Ujian Tengah Semester (UTS) mata kuliah **Pengembangan Aplikasi Web**.  
Aplikasi dikembangkan menggunakan **ReactJS** dengan studi kasus yang ditentukan berdasarkan digit terakhir NIM.  
Fokus utama pengembangan mencakup implementasi **Form**, **Tabel Dinamis**, **CSS Styling**, **Integrasi API**, serta **Deployment** ke **Vercel**.

## ⚙️ Teknologi yang Digunakan
- **Framework:** ReactJS (Create React App atau Vite)
- **Bahasa Pemrograman:** JavaScript (ES6+)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **HTTP Client:** Fetch API atau Axios
- **Styling:** CSS murni (diperbolehkan menggunakan Tailwind, Ant Design, atau Bootstrap)
- **Deployment Platform:** Vercel

## 📂 Struktur Folder
```
my-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SearchForm.jsx
│   │   ├── DataTable.jsx
│   │   └── DetailCard.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Cara Instalasi dan Menjalankan
1. Clone repository ini:
   ```bash
   git clone https://github.com/username/uts-pemweb-122140171.git
   ```
2. Masuk ke direktori project:
   ```bash
   cd uts-pemweb-122140171
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses:
   ```
   http://localhost:5173
   ```

## 🔑 Environment Variables
Jika API memerlukan API key (misalnya **OpenWeatherMap**), buat file `.env` pada root project:
```
REACT_APP_API_KEY=your_api_key_here
```

Untuk **Vercel Deployment**, tambahkan environment variable di menu:
**Settings → Environment Variables**

## 🌐 Link Deployment
Aplikasi telah di-deploy menggunakan **Vercel** dan dapat diakses melalui tautan berikut:

👉 [https://uts-pemweb-122140171.vercel.app](https://uts-pemweb-122140171.vercel.app)

## 🧩 Fitur Utama
- Form input dengan validasi HTML5 dan state management.
- Tabel data dinamis yang menampilkan hasil dari API.
- Desain responsif menggunakan Flexbox atau Grid.
- Implementasi modern JavaScript (arrow function, async/await, destructuring).
- Integrasi API dengan penanganan *loading* dan *error*.
- Penyimpanan data lokal menggunakan `localStorage`.
- Deployment React App ke Vercel.

## 📸 Screenshot Aplikasi

```
nyusul
![Tampilan Dashboard](./screenshot/dashboard.png)
```

---

**Randy Hendriyawan – 122140171**  
Institut Teknologi Sumatera (ITERA)
