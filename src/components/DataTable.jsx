import { Calendar, Thermometer, Droplets, Wind } from 'lucide-react';

const DataTable = ({ forecast, unit }) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const getDailyForecast = (forecastList) => {
    const dailyData = {};

    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('id-ID');

      if (!dailyData[date]) {
        dailyData[date] = {
          date: item.dt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          weather: item.weather[0],
          count: 1
        };
      } else {
        dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
        dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
        dailyData[date].humidity += item.main.humidity;
        dailyData[date].wind_speed += item.wind.speed;
        dailyData[date].count += 1;
      }
    });

    return Object.values(dailyData).map(day => ({
      ...day,
      humidity: Math.round(day.humidity / day.count),
      wind_speed: (day.wind_speed / day.count).toFixed(1)
    })).slice(0, 5);
  };

  const dailyForecast = getDailyForecast(forecast);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="data-table-container">
      <h3 className="table-title">
        <Calendar size={24} />
        5-Day Weather Forecast
      </h3>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weather</th>
              <th>
                <Thermometer size={16} className="inline-icon" />
                Temperature
              </th>
              <th>
                <Droplets size={16} className="inline-icon" />
                Humidity
              </th>
              <th>
                <Wind size={16} className="inline-icon" />
                Wind Speed
              </th>
            </tr>
          </thead>
          <tbody>
            {dailyForecast.map((day, index) => (
              <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td className="date-cell">
                  {formatDate(day.date)}
                </td>
                <td className="weather-cell">
                  <div className="weather-info">
                    <img
                      src={getWeatherIcon(day.weather.icon)}
                      alt={day.weather.description}
                      className="table-weather-icon"
                    />
                    <span>{day.weather.main}</span>
                  </div>
                </td>
                <td className="temp-cell">
                  <span className="temp-max">{Math.round(day.temp_max)}{tempUnit}</span>
                  <span className="temp-separator">/</span>
                  <span className="temp-min">{Math.round(day.temp_min)}{tempUnit}</span>
                </td>
                <td>{day.humidity}%</td>
                <td>{day.wind_speed} {speedUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
