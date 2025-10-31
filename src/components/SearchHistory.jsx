import { History, X } from 'lucide-react';

const SearchHistory = ({ onCityClick }) => {
  const getHistory = () => {
    const history = localStorage.getItem('weatherSearchHistory');
    return history ? JSON.parse(history) : [];
  };

  const clearHistory = () => {
    localStorage.removeItem('weatherSearchHistory');
    window.location.reload();
  };

  const removeCity = (cityToRemove) => {
    const history = getHistory();
    const updated = history.filter(city => city !== cityToRemove);
    localStorage.setItem('weatherSearchHistory', JSON.stringify(updated));
    window.location.reload();
  };

  const history = getHistory();

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="search-history">
      <div className="history-header">
        <h3>
          <History size={20} />
          Search History
        </h3>
        <button onClick={clearHistory} className="clear-button" title="Clear all history">
          Clear All
        </button>
      </div>

      <div className="history-list">
        {history.map((city, index) => (
          <div key={index} className="history-item">
            <button
              onClick={() => onCityClick(city)}
              className="history-city"
            >
              {city}
            </button>
            <button
              onClick={() => removeCity(city)}
              className="remove-button"
              title="Remove from history"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
