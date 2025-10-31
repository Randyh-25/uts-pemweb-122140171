import { Cloud, Home, LocateFixed, Globe, Info } from 'lucide-react';

const Header = ({ toggleUnit, unit, onHome, onLocate, onExplore, onAbout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <button className="logo" onClick={onHome} title="Home (Jakarta)">
          <Cloud size={28} />
          <span>Weather at a Glance (WAAG)</span>
        </button>
        <div className="header-actions">
          <button className="icon-btn" title="Home (Jakarta)" onClick={onHome}>
            <Home size={18} />
          </button>
          <button className="icon-btn" title="Explore countries by weather" onClick={onExplore}>
            <Globe size={18} />
          </button>
          <button className="icon-btn" title="Use my location" onClick={onLocate}>
            <LocateFixed size={18} />
          </button>
          <button className="icon-btn" title="About this project" onClick={onAbout}>
            <Info size={18} />
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
