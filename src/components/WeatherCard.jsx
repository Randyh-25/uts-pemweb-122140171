import { MapPin, Wind, Droplets, Calendar } from 'lucide-react';

const WeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  const { name, main, weather: weatherData, wind, dt } = weather;
  const { temp, humidity } = main;
  const { description, main: category, icon } = weatherData[0];

  const temperature = unit === 'celsius' ? temp : (temp * 9/5) + 32;
  const windSpeed = `${Math.round(wind.speed * 3.6)} km/h`; // m/s -> km/h

  const getDate = () => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTime = () => {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location-info">
          <MapPin size={20} />
          <span className="city-name">{name}</span>
        </div>
        <div className="date-time">
          <Calendar size={16} />
          <span>{getDate()}</span>
          <span className="time">{getTime()}</span>
        </div>
      </div>

      <div className="weather-main">
        <div className="weather-description">
          <h1 className="weather-condition">{category}</h1>
          <p className="weather-category">{description}</p>
          <p className="weather-detail">
            People could expect below average air quality.They are typically
            storm-cloud and surrounded by sunshine that risk and visibility.
          </p>
        </div>

        <div className="temperature-display">
          {/* Current weather icon from OpenWeatherMap */}
          {icon && (
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              width={84}
              height={84}
              loading="lazy"
            />
          )}
          <span className="temperature">{Math.round(temperature)}°</span>
        </div>
      </div>

      <div className="weather-stats">
        <div className="stat-item">
          <Wind size={20} />
          <span>Wind Speed</span>
          <strong>{windSpeed}</strong>
        </div>
        <div className="stat-item">
          <Droplets size={20} />
          <span>Humidity</span>
          <strong>{humidity}%</strong>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
