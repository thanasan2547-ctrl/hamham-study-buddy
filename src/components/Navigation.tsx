import { NavLink } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
    const navItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/calendar', icon: '📅', label: 'Calendar' },
        { path: '/flashcards', icon: '🎴', label: 'Flashcards' },
        { path: '/stats', icon: '📈', label: 'Stats' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <nav className="navigation-bar animate-slideUp">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
