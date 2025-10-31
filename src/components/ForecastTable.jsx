import { useEffect, useRef, useState } from 'react';
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

    // Sort keys ascending by date key
    const keysAll = [...groups.keys()].sort((a, b) => {
      const [ay, am, ad] = a.split('-').map(Number);
      const [by, bm, bd] = b.split('-').map(Number);
      return new Date(Date.UTC(ay, am, ad)) - new Date(Date.UTC(by, bm, bd));
    });

    // Prefer next 5 days ahead (excluding today). If less than 5 exist,
    // include today to always render 5 rows as per spec.
    const futureKeys = keysAll.filter((k) => k !== todayKey);
    const pickKeys = (futureKeys.length >= 5 ? futureKeys : keysAll).slice(0, 5);

    const result = pickKeys.map((key) => {
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

  // Responsive measuring: make SVG coordinates match rendered size to avoid stretch
  const graphHostRef = useRef(null);
  const [size, setSize] = useState({ w: 320, h: 140 });
  useEffect(() => {
    const el = graphHostRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      // Clamp minimal sizes to avoid division by zero
      setSize({ w: Math.max(240, rect.width), h: Math.max(120, rect.height) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Hitung titik grafik dari suhu harian (mengikuti unit tampilan)
  const temps = dailyData.length ? dailyData.map(d => (unit === 'celsius' ? d.temp : (d.temp * 9/5) + 32)) : [0];
  // gunakan ukuran aktual container agar koordinat = pixel, tidak terdistorsi
  const width = size.w;
  const height = size.h;
  const paddingY = 16;
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = Math.max(1, maxT - minT);
  const stepX = dailyData.length > 1 ? width / (dailyData.length - 1) : width;

  const pts = temps.map((t, i) => {
    const norm = (t - minT) / range; // 0..1
    const y = paddingY + (1 - norm) * (height - paddingY * 2);
    const x = Math.round(i * stepX);
    return { x, y };
  });

  // Utility: Catmull-Rom to Bezier to menghasilkan kurva halus
  const smoothPath = (p, tension = 0.25) => {
    if (p.length === 0) return '';
    if (p.length === 1) return `M ${p[0].x},${p[0].y}`;
    let d = `M ${p[0].x},${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = p[i + 2] || p[i + 1];
      const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
      const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
      const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
      const cp2y = p2.y - (p3.y - p1.y) * tension / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const dLine = smoothPath(pts);
  const dArea = `${dLine} L ${pts[pts.length - 1]?.x ?? 0},${height} L ${pts[0]?.x ?? 0},${height} Z`;

  // Index titik minimum dan maksimum untuk badge kecil
  const minIdx = temps.indexOf(minT);
  const maxIdx = temps.indexOf(maxT);

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
      <div className="forecast-graph" ref={graphHostRef}>
        <svg className="graph-line" width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="tempGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vertical separators per day (subtle) */}
          {pts.map((p, i) => (
            i > 0 && i < pts.length ? (
              <line key={`sep-${i}`} x1={p.x} x2={p.x} y1={paddingY} y2={height - paddingY}
                stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ) : null
          ))}

          {/* Area under curve */}
          <path d={dArea} fill="url(#areaGrad)" />

          {/* Smooth temperature curve with glow */}
          <path d={dLine} fill="none" stroke="url(#tempGrad)" strokeWidth="2.5" filter="url(#glow)" vectorEffect="non-scaling-stroke" />

          {/* Nodes */}
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.8" fill="#fff" opacity="0.95" />
              <circle cx={p.x} cy={p.y} r="6" fill="rgba(255,255,255,0.15)" />
            </g>
          ))}

          {/* Min/Max badges near points */}
          {pts[minIdx] && (
            <g transform={`translate(${pts[minIdx].x + 2}, ${Math.min(height - 10, pts[minIdx].y + 10)})`}>
              <rect x="0" y="-6" rx="3" ry="3" width="20" height="8" fill="rgba(255,255,255,0.15)" />
              <text x="10" y="0" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="5">min</text>
            </g>
          )}
          {pts[maxIdx] && (
            <g transform={`translate(${pts[maxIdx].x + 2}, ${Math.max(8, pts[maxIdx].y - 10)})`}>
              <rect x="0" y="-6" rx="3" ry="3" width="20" height="8" fill="rgba(255,255,255,0.15)" />
              <text x="10" y="0" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="5">max</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default ForecastTable;
