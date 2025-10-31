import { useEffect, useMemo, useState } from 'react';
import capitals from '../data/capitals.json';
import { Filter, RefreshCcw } from 'lucide-react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const CONDITIONS = [
  { key: 'clear', label: 'Clear' },
  { key: 'clouds', label: 'Clouds' },
  { key: 'rain', label: 'Rain/Drizzle' },
  { key: 'thunderstorm', label: 'Thunderstorm' },
  { key: 'snow', label: 'Snow' },
  { key: 'fog', label: 'Mist/Fog/Haze/Smoke' }
];

function mapMainToKey(main) {
  const m = (main || '').toLowerCase();
  if (m.includes('thunder')) return 'thunderstorm';
  if (m.includes('drizzle')) return 'rain';
  if (m.includes('rain')) return 'rain';
  if (m.includes('snow')) return 'snow';
  if (m.includes('clear')) return 'clear';
  if (m.includes('cloud')) return 'clouds';
  if (['mist','fog','haze','smoke'].some((k)=>m.includes(k))) return 'fog';
  // Map less-common categories to closest supported filter or other
  if (['dust','sand','ash'].some((k)=>m.includes(k))) return 'fog';
  if (m.includes('squall')) return 'rain';
  if (m.includes('tornado')) return 'other';
  return 'other';
}

function cacheKey() {
  return 'explore_capitals_weather_v1';
}

function loadCache() {
  try {
    const raw = localStorage.getItem(cacheKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // cache valid 10 minutes
    if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
      return parsed.data;
    }
  } catch {}
  return null;
}

function saveCache(data) {
  try {
    localStorage.setItem(cacheKey(), JSON.stringify({ timestamp: Date.now(), data }));
  } catch {}
}

export default function ExploreByWeather({ unit = 'celsius' }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('clear');

  const unitsParam = 'metric';

  const fetchAll = async () => {
    setLoading(true); setError(null);
    try {
      const cached = loadCache();
      if (cached) {
        setRecords(cached);
        setLoading(false);
        return;
      }

      // keep within 60 calls/min: we only fetch ~30 capitals once and cache
      const results = await Promise.all(
        capitals.map(async (c) => {
          const url = `${BASE_URL}/weather?lat=${c.lat}&lon=${c.lon}&appid=${API_KEY}&units=${unitsParam}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed fetching weather');
          const data = await res.json();
          const main = data.weather?.[0]?.main || '';
          const icon = data.weather?.[0]?.icon || '';
          const key = mapMainToKey(main);
          return {
            country: c.country,
            capital: c.capital,
            temp: data.main?.temp,
            wind: data.wind?.speed,
            humidity: data.main?.humidity,
            icon,
            main,
            key,
          };
        })
      );

      saveCache(results);
      setRecords(results);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const dataFiltered = useMemo(() => {
    return records.filter((r) => r.key === filter);
  }, [records, filter]);

  const toDisplayTemp = (t) => unit === 'celsius' ? Math.round(t) : Math.round((t * 9) / 5 + 32);

  return (
    <section className="explore">
      <div className="explore-header">
        <h2>Explore Countries by Weather</h2>
        <div className="explore-controls">
          <div className="select">
            <Filter size={16} />
            <select value={filter} onChange={(e)=>setFilter(e.target.value)} aria-label="Filter condition">
              {CONDITIONS.map((c)=> (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <button className="icon-btn" onClick={fetchAll} title="Refresh data">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading countries weather…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="explore-grid">
          {dataFiltered.length === 0 && (
            <div className="empty">No countries currently match this condition in the sampled list.</div>
          )}
          {dataFiltered.map((item, idx) => (
            <div key={idx} className="explore-card">
              <div className="top">
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt={item.main}
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <div className="place">
                  <h4>{item.capital}</h4>
                  <p>{item.country}</p>
                </div>
                <div className="temp">{toDisplayTemp(item.temp)}°</div>
              </div>
              <div className="meta">
                <span>Wind {Math.round((item.wind||0) * 3.6)} km/h</span>
                <span>Humidity {item.humidity}%</span>
                <span className="badge">{item.main}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
