import { Cloud, Sun, Moon } from 'lucide-react';

const Header = ({ theme = 'light', onToggleTheme = () => {} }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Cloud size={32} />
          <h1>Weather Dashboard</h1>
        </div>
        <div className="header-row">
          <p className="header-subtitle">Real-time weather information for cities worldwide</p>
          <button
            className="icon-button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
