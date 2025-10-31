import { Cloud, Home, LocateFixed, Trash2 } from 'lucide-react';

const Header = ({ toggleUnit, unit, onHome, onLocate, onClearHistory }) => {
  return (
    <header className="header">
      <div className="header-content">
        <button className="logo" onClick={onHome} title="Home (Jakarta)">
          <Cloud size={28} />
          <span>WWN — Weather Now</span>
        </button>
        <div className="header-actions">
          <button className="icon-btn" title="Home (Jakarta)" onClick={onHome}>
            <Home size={18} />
          </button>
          <button className="icon-btn" title="Use my location" onClick={onLocate}>
            <LocateFixed size={18} />
          </button>
          <button className="icon-btn" title="Clear search history" onClick={onClearHistory}>
            <Trash2 size={18} />
          </button>
          <button className="unit-toggle" onClick={toggleUnit} title="Toggle °C/°F">
            {unit === 'celsius' ? '°C' : '°F'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
