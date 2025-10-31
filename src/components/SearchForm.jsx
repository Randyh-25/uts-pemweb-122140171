import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchForm = ({ onSearch, unit, onUnitChange, onUseMyLocation }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularCities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
    'London', 'New York', 'Tokyo', 'Paris', 'Singapore'
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 0) {
      const filtered = popularCities.filter(c =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <MapPin className="search-icon" size={20} />
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city name..."
            className="search-input"
            required
            minLength={2}
            maxLength={50}
            autoComplete="off"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
            Search
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onUseMyLocation}
            title="Use my current location"
          >
            <MapPin size={18} />
            Use my location
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                <MapPin size={16} />
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className="unit-toggle">
        <button
          className={`unit-button ${unit === 'metric' ? 'active' : ''}`}
          onClick={() => onUnitChange('metric')}
        >
          °C
        </button>
        <button
          className={`unit-button ${unit === 'imperial' ? 'active' : ''}`}
          onClick={() => onUnitChange('imperial')}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
