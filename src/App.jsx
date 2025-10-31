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
  const [unit, setUnit] = useState('metric');

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const saveToHistory = (city) => {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');

    if (!history.includes(city)) {
      const newHistory = [city, ...history].slice(0, 10);
      localStorage.setItem('weatherSearchHistory', JSON.stringify(newHistory));
    }
  };

  // terima unitOverride, default ke unit saat ini jika tidak diberikan
  const fetchWeatherData = async (city, unitOverride) => {
    const units = unitOverride || unit;

    setLoading(true);
    setError(null);

    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`
      );

      if (!currentWeatherResponse.ok) {
        throw new Error('City not found');
      }

      const currentData = await currentWeatherResponse.json();
      setCurrentWeather(currentData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }

      const forecastData = await forecastResponse.json();
      setForecast(forecastData.list);

      saveToHistory(city);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city) => {
    fetchWeatherData(city, unit); // pastikan unit yang dipakai konsisten
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    if (currentWeather) {
      // refetch dengan unit baru (jangan pakai state lama)
      fetchWeatherData(currentWeather.name, newUnit);
    }
  };

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
    const cityToLoad =
      history[0] || defaultCities[Math.floor(Math.random() * defaultCities.length)];

    fetchWeatherData(cityToLoad, unit);
  }, []);

  const defaultCities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
    'London', 'New York', 'Tokyo', 'Paris', 'Singapore'
  ];

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="container">
          <SearchForm
            onSearch={handleSearch}
            unit={unit}
            onUnitChange={handleUnitChange}
          />

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading weather data...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
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
