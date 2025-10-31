import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import WeatherCard from './components/WeatherCard';
import ForecastTable from './components/ForecastTable';
import HistoryTable from './components/HistoryTable';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // default: Jakarta
    fetchWeatherByCity('Jakarta');
  }, []);

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);
      }

      const newHistory = [
        {
          city,
          timestamp: new Date().toISOString()
        },
        ...history.filter(item => item.city.toLowerCase() !== city.toLowerCase())
      ].slice(0, 10);

      setHistory(newHistory);
      localStorage.setItem('weatherHistory', JSON.stringify(newHistory));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherHistory');
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!weatherResponse.ok) throw new Error('Location not found');
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);
      }

      const city = weatherData.name || 'Current Location';
      const newHistory = [
        { city, timestamp: new Date().toISOString() },
        ...history.filter((item) => item.city.toLowerCase() !== city.toLowerCase()),
      ].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => setError(err.message || 'Failed to get location'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const toggleUnit = () => {
    setUnit(prevUnit => prevUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const getWeatherBgClass = (w) => {
    if (!w) return 'bg-default';
    const main = w.weather?.[0]?.main?.toLowerCase() || '';
    if (main.includes('thunderstorm')) return 'bg-thunderstorm';
    if (main.includes('drizzle')) return 'bg-drizzle';
    if (main.includes('rain')) return 'bg-rain';
    if (main.includes('snow')) return 'bg-snow';
    if (main.includes('clear')) return 'bg-clear';
    if (main.includes('cloud')) return 'bg-clouds';
    if (['mist','fog','haze','smoke','dust','sand','ash','squall','tornado'].some(k => main.includes(k))) {
      return 'bg-mist';
    }
    return 'bg-default';
  };

  const getEffectClass = (w) => {
    if (!w) return '';
    const main = w.weather?.[0]?.main?.toLowerCase() || '';
    if (main.includes('thunderstorm')) return 'effect-thunderstorm';
    if (main.includes('drizzle')) return 'effect-rain';
    if (main.includes('rain')) return 'effect-rain';
    if (main.includes('snow')) return 'effect-snow';
    if (main.includes('clear')) return 'effect-clear';
    if (main.includes('cloud')) return 'effect-clouds';
    if (['mist','fog','haze','smoke'].some(k => main.includes(k))) return 'effect-fog';
    if (['dust','sand','ash'].some(k => main.includes(k))) return 'effect-dust';
    if (main.includes('squall')) return 'effect-rain';
    if (main.includes('tornado')) return 'effect-tornado';
    return '';
  };

  const getEffectDensity = (w) => {
    if (!w) return 60;
    const main = w.weather?.[0]?.main?.toLowerCase() || '';
    if (main.includes('thunderstorm')) return 180;
    if (main.includes('rain') || main.includes('drizzle')) return 160;
    if (main.includes('snow')) return 140;
    if (['mist','fog','haze','smoke'].some(k => main.includes(k))) return 80;
    if (main.includes('cloud')) return 60;
    if (['dust','sand','ash'].some(k => main.includes(k))) return 140;
    if (main.includes('tornado')) return 160;
    return 60;
  };

  const density = getEffectDensity(weather);
  const backCount = Math.round(density * 0.6);
  const frontCount = density - backCount;
  const isThunder = (weather?.weather?.[0]?.main || '').toLowerCase().includes('thunder');

  return (
    <div className={`app ${getWeatherBgClass(weather)}`}>
      {/* Ambient effects layer, rendered above the background and below content */}
      <div className={`effects ${getEffectClass(weather)}`} aria-hidden="true">
        <div className="layer back">
          {Array.from({ length: backCount }).map((_, i) => (
            <span key={`b-${i}`} style={{ '--i': i }} />
          ))}
        </div>
        <div className="layer front">
          {Array.from({ length: frontCount }).map((_, i) => (
            <span key={`f-${i}`} style={{ '--i': i }} />
          ))}
        </div>
        {isThunder && (
          <div className="bolts" aria-hidden="true">
            {[0,1,2].map((idx) => (
              <svg
                key={idx}
                className={`lightning lightning-${idx}`}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points="50,0 56,18 44,22 60,38 52,42 70,60 60,64 82,100"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        )}
      </div>
      <Header
        toggleUnit={toggleUnit}
        unit={unit}
        onHome={() => fetchWeatherByCity('Jakarta')}
        onLocate={handleLocate}
        onClearHistory={clearHistory}
      />

      <main className="main-content">
        <SearchForm onSearch={fetchWeatherByCity} currentCity={weather?.name} />

        {loading && <div className="loading">Loading weather data...</div>}
        {error && <div className="error">{error}</div>}

        {weather && (
          <>
            <WeatherCard weather={weather} unit={unit} />
            <ForecastTable forecast={forecast} unit={unit} />
            <HistoryTable
              history={history}
              onCityClick={fetchWeatherByCity}
              onClear={clearHistory}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
