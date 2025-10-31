import { Cloud } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Cloud size={32} />
          <h1>Weather Dashboard</h1>
        </div>
        <p className="header-subtitle">Real-time weather information for cities worldwide</p>
      </div>
    </header>
  );
};

export default Header;
