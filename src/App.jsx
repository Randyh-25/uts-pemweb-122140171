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

  return (
    <div className={`app ${getWeatherBgClass(weather)}`}>
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
