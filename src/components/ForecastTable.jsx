import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

const ForecastTable = ({ forecast, unit }) => {
  if (!forecast || !forecast.list) return null;

  const getDailyForecast = () => {
    // Group forecast items by local date of the city (avoid client timezone skew)
    const tzOffset = forecast?.city?.timezone ?? 0; // seconds
    const toCityDate = (unixSec) => new Date((unixSec + tzOffset) * 1000);

    // Today's key in city time
    const nowCity = toCityDate(Math.floor(Date.now() / 1000));
    const todayKey = `${nowCity.getUTCFullYear()}-${nowCity.getUTCMonth()}-${nowCity.getUTCDate()}`;

    const groups = new Map();
    for (const item of forecast.list) {
      const d = toCityDate(item.dt);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }

    // Sort keys ascending, skip today, pick next 5 days
    const keys = [...groups.keys()].sort((a, b) => {
      const [ay, am, ad] = a.split('-').map(Number);
      const [by, bm, bd] = b.split('-').map(Number);
      return new Date(Date.UTC(ay, am, ad)) - new Date(Date.UTC(by, bm, bd));
    }).filter((k) => k !== todayKey).slice(0, 5);

    const result = keys.map((key) => {
      const items = groups.get(key);
      // Choose item closest to 12:00
      let best = items[0];
      let bestDiff = Infinity;
      for (const it of items) {
        const d = toCityDate(it.dt);
        const diff = Math.abs(d.getUTCHours() - 12);
        if (diff < bestDiff) {
          best = it; bestDiff = diff;
        }
      }
      const d = toCityDate(best.dt);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
      const dateLabel = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', timeZone: 'UTC' });
      return {
        day: dayName,
        date: dateLabel,
        temp: best.main.temp,
        weather: best.weather[0].main,
        description: best.weather[0].description,
        icon: best.weather[0].icon,
      };
    });

    return result;
  };

  const getWeatherIcon = (weather) => {
    switch (weather.toLowerCase()) {
      case 'rain':
        return <CloudRain size={24} />;
      case 'snow':
        return <CloudSnow size={24} />;
      case 'clear':
        return <Sun size={24} />;
      default:
        return <Cloud size={24} />;
    }
  };

  const dailyData = getDailyForecast();

  // Hitung titik grafik dari suhu harian (mengikuti unit tampilan)
  const temps = dailyData.length ? dailyData.map(d => (unit === 'celsius' ? d.temp : (d.temp * 9/5) + 32)) : [0];
  // Use a normalized 0..100 width for stable scaling; avoid huge stroke scaling
  const width = 100;
  const height = 100;
  const paddingY = 12;
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = Math.max(1, maxT - minT);
  const stepX = dailyData.length > 1 ? width / (dailyData.length - 1) : width;

  const points = temps
    .map((t, i) => {
      const norm = (t - minT) / range;        // 0..1
      const y = paddingY + (1 - norm) * (height - paddingY * 2); // suhu tinggi -> y kecil
      const x = Math.round(i * stepX);
      return `${x},${Math.round(y)}`;
    })
    .join(' ');

  return (
    <div className="forecast-section">
      <div className="forecast-list">
        {dailyData.map((day, index) => {
          const temp = unit === 'celsius' ? day.temp : (day.temp * 9/5) + 32;
          return (
            <div key={index} className="forecast-item">
              <div className="forecast-content">
                <span className="forecast-day">{day.day} • {day.date}</span>
                <span className="forecast-temp">{Math.round(temp)}°</span>
                <span className="forecast-desc">{day.description}</span>
              </div>
              <div className="forecast-icon">
                {getWeatherIcon(day.weather)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="forecast-graph">
        <svg className="graph-line" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="white"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.split(' ').map((pt, i) => {
            const [cx, cy] = pt.split(',').map(Number);
            return <circle key={i} cx={cx} cy={cy} r="3.5" fill="white" vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
      </div>
    </div>
  );
};

export default ForecastTable;
