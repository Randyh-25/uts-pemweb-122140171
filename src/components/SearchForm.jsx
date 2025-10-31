import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const SearchForm = ({ onSearch, currentCity }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Jakarta', 'Singapore',
    'Tokyo', 'London', 'New York', 'Paris', 'Sydney'
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    onSearch(city);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for city..."
          className="search-input"
          required
          minLength={2}
        />
        <button type="submit" className="search-btn">Search</button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((city, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(city)}
            >
              <MapPin size={16} />
              <span>{city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
