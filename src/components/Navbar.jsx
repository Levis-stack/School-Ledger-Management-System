import { Link } from 'react-router-dom';
import { GraduationCap, Users, UserPlus } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <GraduationCap size={24} />
          <span className="brand-text">School Fee Manager</span>
        </Link>
        <div className="navbar-links">
          <Link to="/students" className="navbar-link">
            <Users size={20} />
            <span>Student List</span>
          </Link>
          <Link to="/admit" className="navbar-link">
            <UserPlus size={20} />
            <span>Admit Student</span>
          </Link>
          <button onClick={toggleTheme} className="navbar-link theme-toggle-btn">
            {darkMode ? '☀️' : '🌙 '}
          </button>
        </div>
      </div>
    </nav>
  );
}
