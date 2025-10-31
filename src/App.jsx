import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import WeatherCard from './components/WeatherCard';
import DataTable from './components/DataTable';
import SearchHistory from './components/SearchHistory';
import './App.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // persist unit & theme
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'metric');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // simpan query terakhir untuk tombol Retry
  const [lastQuery, setLastQuery] = useState(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Tampilkan error jika API key tidak ada
  useEffect(() => {
    if (!API_KEY) {
      setError('Missing API key (VITE_OPENWEATHER_API_KEY). Tambahkan di file .env lalu restart dev server.');
    }
  }, [API_KEY]);

  const saveToHistory = (city) => {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
    // bandingkan case-insensitive agar tidak duplikat
    const exists = history.some((c) => String(c).toLowerCase() === String(city).toLowerCase());
    if (!exists) {
      const newHistory = [city, ...history].slice(0, 10);
      localStorage.setItem('weatherSearchHistory', JSON.stringify(newHistory));
    }
  };

  // fetch by city
  const fetchWeatherData = async (city, unitOverride, options = {}) => {
    const { saveHistory = true } = options;
    const units = unitOverride || unit;
    setLoading(true);
    setError(null);
    setLastQuery({ type: 'city', value: city, units });

    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
      );
      if (!currentWeatherResponse.ok) {
        const msg = currentWeatherResponse.status === 401 ? 'Invalid API key' : 'City not found';
        throw new Error(msg);
      }

      const currentData = await currentWeatherResponse.json();
      setCurrentWeather(currentData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
      );
      if (!forecastResponse.ok) {
        const msg = forecastResponse.status === 401 ? 'Invalid API key' : 'Forecast data not available';
        throw new Error(msg);
      }

      const forecastData = await forecastResponse.json();
      setForecast(forecastData.list);

      if (saveHistory) saveToHistory(currentData.name);
    } catch (err) {
      console.error('[fetchWeatherData]', err);
      setError(err.message || 'Failed to fetch weather data');
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch by geolocation (lat/lon)
  const fetchWeatherByCoords = async ({ lat, lon }, unitOverride, options = {}) => {
    const { saveHistory = true } = options;
    const units = unitOverride || unit;
    setLoading(true);
    setError(null);
    setLastQuery({ type: 'coords', value: { lat, lon }, units });

    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      );
      if (!currentWeatherResponse.ok) throw new Error('Location not found');

      const currentData = await currentWeatherResponse.json();
      setCurrentWeather(currentData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      );
      if (!forecastResponse.ok) throw new Error('Forecast data not available');

      const forecastData = await forecastResponse.json();
      setForecast(forecastData.list);

      if (saveHistory && currentData?.name) saveToHistory(currentData.name);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city) => {
    if (!city?.trim()) return;
    fetchWeatherData(city.trim(), unit, { saveHistory: true });
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
    if (currentWeather) {
      if (lastQuery?.type === 'coords' && lastQuery?.value) {
        fetchWeatherByCoords(lastQuery.value, newUnit, { saveHistory: false });
      } else {
        fetchWeatherData(currentWeather.name, newUnit, { saveHistory: false });
      }
    }
  };

  const handleUseMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        fetchWeatherByCoords({ lat, lon }, unit, { saveHistory: true });
      },
      () => setError('Failed to get your location'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleRetry = () => {
    if (!lastQuery) return;
    if (lastQuery.type === 'coords') {
      fetchWeatherByCoords(lastQuery.value, lastQuery.units, { saveHistory: false });
    } else {
      fetchWeatherData(lastQuery.value, lastQuery.units, { saveHistory: false });
    }
  };

  useEffect(() => {
    if (!API_KEY) return; // jangan fetch jika API key kosong
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
    const defaultCities = [
      'Jakarta','Surabaya','Bandung','Medan','Semarang',
      'Makassar','Palembang','Tangerang','Depok','Bekasi',
      'London','New York','Tokyo','Paris','Singapore'
    ];
    const cityToLoad = history[0] || defaultCities[Math.floor(Math.random() * defaultCities.length)];
    // initial load tidak menambah history
    fetchWeatherData(cityToLoad, unit, { saveHistory: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <main className="main-content">
        <div className="container">
          <SearchForm
            onSearch={handleSearch}
            unit={unit}
            onUnitChange={handleUnitChange}
            onUseMyLocation={handleUseMyLocation}
          />

          {loading && (
            <>
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading weather data...</p>
              </div>

              {/* Skeleton untuk kartu cuaca */}
              <div className="skeleton-card">
                <div className="skeleton-line w-40"></div>
                <div className="skeleton-line w-64"></div>
                <div className="skeleton-row">
                  <div className="skeleton-box lg"></div>
                  <div className="skeleton-col">
                    <div className="skeleton-line w-56"></div>
                    <div className="skeleton-line w-48"></div>
                    <div className="skeleton-line w-40"></div>
                  </div>
                </div>
              </div>

              {/* Skeleton untuk tabel */}
              <div className="skeleton-table">
                <div className="skeleton-line w-56"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-row table">
                    <div className="skeleton-line w-24"></div>
                    <div className="skeleton-line w-28"></div>
                    <div className="skeleton-line w-20"></div>
                    <div className="skeleton-line w-16"></div>
                    <div className="skeleton-line w-16"></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="search-button" onClick={handleRetry}>Retry</button>
                <button className="secondary-button" onClick={handleUseMyLocation}>
                  Use my location
                </button>
              </div>
            </div>
          )}

          {!loading && !error && currentWeather && (
            <>
              <WeatherCard weather={currentWeather} unit={unit} />
              <DataTable forecast={forecast} unit={unit} />
            </>
          )}

          <SearchHistory onCityClick={handleSearch} />
        </div>
      </main>

      <footer className="footer">
        <p>Weather Dashboard - Powered by OpenWeatherMap API</p>
      </footer>
    </div>
  );
}

export default App;
