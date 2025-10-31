const About = () => {
  return (
    <section className="about-section">
      <h2>About this Project</h2>
      <p>
        Weather at a Glance (WAAG) adalah dashboard cuaca berbasis React + Vite
        yang memanfaatkan OpenWeatherMap API. Aplikasi ini dibuat untuk memenuhi
        penugasan UTS Pengembangan Aplikasi Web (digit 1 - Weather Dashboard).
      </p>
      <ul>
        <li>Form pencarian kota dengan autocomplete.</li>
        <li>Cuaca saat ini: ikon, suhu, kelembapan, kecepatan angin.</li>
        <li>Forecast 5 hari (dipilih titik terdekat pukul 12:00).</li>
        <li>History pencarian (localStorage) + tombol clear di section history.</li>
        <li>Toggle unit °C/°F.</li>
        <li>Efek visual dinamis sesuai cuaca (rain, snow, fog, thunder, clouds, clear).</li>
        <li>Halaman Explore: daftar negara (berdasarkan ibu kota) difilter kondisi cuaca saat ini.</li>
      </ul>
      <h3>About Me</h3>
      <p>
        <strong>Randy Hendriyawan</strong><br />
        Teknik Informatika<br />
        Institut Teknologi Sumatera<br />
        Porto: <a href="https://randyhendriyawan.my.id/" target="_blank" rel="noreferrer">randyhendriyawan.my.id</a>
      </p>
    </section>
  );
};

export default About;
