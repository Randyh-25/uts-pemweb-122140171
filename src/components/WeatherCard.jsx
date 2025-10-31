import { Cloud, Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Navigation2 } from 'lucide-react';

const WeatherCard = ({ weather, unit }) => {
  if (!weather) {
    return null;
  }

  const { main, weather: weatherInfo, wind, visibility, sys, name, dt, timezone } = weather;
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  // sesuaikan ke timezone kota (timezone = offset detik dari UTC)
  const toLocalDate = (timestamp) => new Date((timestamp + (timezone ?? 0)) * 1000);

  const formatTime = (timestamp) => {
    return toLocalDate(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return toLocalDate(timestamp).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const windDeg = wind?.deg ?? 0;

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="location-info">
          <h2 className="city-name">{name}, {sys.country}</h2>
          <p className="current-date">{formatDate(dt)}</p>
        </div>
      </div>

      <div className="weather-main">
        <div className="weather-icon-section">
          <img
            src={getWeatherIcon(weatherInfo[0].icon)}
            alt={weatherInfo[0].description}
            className="weather-icon"
          />
          <p className="weather-description">{weatherInfo[0].description}</p>
        </div>

        <div className="temperature-section">
          <div className="temperature-main">
            {Math.round(main.temp)}{tempUnit}
          </div>
          <div className="temperature-details">
            <span>Feels like: {Math.round(main.feels_like)}{tempUnit}</span>
            <span>Min: {Math.round(main.temp_min)}{tempUnit} | Max: {Math.round(main.temp_max)}{tempUnit}</span>
          </div>
        </div>
      </div>

      <div className="weather-details-grid">
        <div className="detail-item">
          <Droplets size={24} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{main.humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <Wind size={24} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Wind</span>
            <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {wind.speed} {speedUnit}
              <Navigation2
                size={18}
                className="detail-icon"
                style={{ transform: `rotate(${windDeg}deg)` }}
                title={`Direction ${windDeg}°`}
              />
            </span>
          </div>
        </div>

        <div className="detail-item">
          <Gauge size={24} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{main.pressure} hPa</span>
          </div>
        </div>

        <div className="detail-item">
          <Eye size={24} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>

        <div className="detail-item">
          <Sunrise size={24} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Sunrise</span>
            <span className="detail-value">{formatTime(sys.sunrise)}</span>
          </div>
        </div>

        <div className="detail-item">
          <Sunset size={24} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Sunset</span>
            <span className="detail-value">{formatTime(sys.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
