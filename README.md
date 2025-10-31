# Weather at a Glance (WAAG)

Nama: Randy Hendriyawan  
NIM: 122140171

Dashboard cuaca berbasis React + Vite yang memanfaatkan OpenWeatherMap API sebagai pemenuhan UTS Pengembangan Aplikasi Web (studi kasus: Weather Dashboard). Aplikasi menampilkan cuaca saat ini, ramalan 5 hari, riwayat pencarian, efek visual dinamis sesuai kondisi cuaca, serta halaman eksplorasi negara berdasarkan cuaca.

## ⚙️ Teknologi
- React 18 + Vite
- CSS modern + Tailwind directives (utility build)
- lucide-react (ikon)
- Fetch API (async/await)
- LocalStorage (riwayat & cache eksplorasi)

## 📂 Struktur Project (ringkas)
```
.
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.tsx
│   └── components/
│       ├── Header.jsx
│       ├── SearchForm.jsx
│       ├── WeatherCard.jsx
│       ├── ForecastTable.jsx
│       ├── HistoryTable.jsx
│       ├── ExploreByWeather.jsx
│       └── About.jsx
└── src/data/capitals.json
```

## 🚀 Menjalankan Secara Lokal
1. Instal dependencies
   ```bash
   npm install
   ```
2. Siapkan environment variable (lihat bagian Env)
3. Jalankan dev server
   ```bash
   npm run dev
   ```
4. Buka di browser: http://localhost:5173

## 🔑 Environment Variables
Buat file `.env` di root project dengan isi:
```
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```
Catatan: gunakan key OpenWeatherMap yang aktif. Untuk deployment di Vercel, tambahkan variable yang sama di Settings → Environment Variables.

## 🧩 Fitur Utama
- Pencarian kota dengan autocomplete populer.
- Cuaca saat ini: ikon resmi OWM, suhu, kelembapan, angin, waktu lokal.
- Ramalan 5 hari: selalu menampilkan 5 item, grafik suhu halus dengan area gradien, glow, separator, dan titik non-distorsi (responsive via ResizeObserver).
- Riwayat pencarian: tersimpan di localStorage, tombol Clear hanya ada di bagian Riwayat (bukan di header).
- Toggle satuan °C/°F.
- Explore Countries by Weather: daftar ibu kota dunia, filter berdasarkan kondisi cuaca saat ini; hasil dicache ±10 menit.
- Efek visual dinamis sesuai kondisi cuaca (Clear rays, Clouds drift, Rain/Drizzle, Snow, Fog/Mist/Haze/Smoke, Thunderstorm dengan kilat SVG).
- Halaman About menjelaskan fitur dan konfigurasi.

## 🧭 Navigasi Aplikasi
- Header: Home, Explore, Use my Location, About, Toggle unit.
- Halaman: Home (default Jakarta), Explore, About.

## 🌐 Link Deployment
Jika sudah dideploy:

👉 https://uts-pemweb-122140171.vercel.app

## � Catatan Teknis
- Data forecast bersumber dari endpoint 5-day/3-hour; jika horizon belum 5 hari penuh, aplikasi menyertakan hari ini agar konsisten 5 item sesuai spesifikasi.
- Beberapa style menggunakan efek blur dan overlay; pastikan perangkat tidak mengaktifkan prefers-reduced-motion untuk melihat animasi.

---

Randy Hendriyawan – 122140171  
Institut Teknologi Sumatera (ITERA)
