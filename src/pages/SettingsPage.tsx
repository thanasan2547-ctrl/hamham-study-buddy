import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import './SettingsPage.css';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { state, setTheme, setUserName } = useStudy();
    const [nameDraft, setNameDraft] = useState(state.preferences.userName || 'Friend');

    const themes = [
        { id: 'default', name: 'HamHam Orange', primary: '#FF8C42', secondary: '#FFD966', bg: '#FFF8F0' },
        { id: 'ocean', name: 'Ocean Breeze', primary: '#00B4D8', secondary: '#48CAE4', bg: '#E0F7FA' },
        { id: 'forest', name: 'Deep Forest', primary: '#4CAF50', secondary: '#AED581', bg: '#F1F8E9' },
        { id: 'sunset', name: 'Sunset Glow', primary: '#FF7043', secondary: '#FFCC80', bg: '#FFF3E0' },
        { id: 'dark', name: 'Midnight Mode', primary: '#808080', secondary: '#404040', bg: '#121212' },
    ];

    const handleSaveName = () => {
        setUserName(nameDraft);
        // Could show a toast here
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="settings-page page">
            <header className="page-header">
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
                <div className="header-title"><span>⚙️</span> Settings</div>
                <div style={{ width: 60 }}></div>
            </header>

            <div className="page-content">

                {/* Profile Section */}
                <section className="settings-section">
                    <h3>👤 Profile</h3>
                    <div className="profile-form">
                        <input
                            type="text"
                            value={nameDraft}
                            onChange={(e) => setNameDraft(e.target.value)}
                            placeholder="Your Name"
                        />
                        <button className="btn btn-primary" onClick={handleSaveName}>Save</button>
                    </div>
                </section>

                {/* Theme Section */}
                <section className="settings-section">
                    <h3>🎨 App Theme</h3>
                    <div className="theme-grid">
                        {themes.map(theme => (
                            <div
                                key={theme.id}
                                className={`theme-option ${state.preferences.theme === theme.id ? 'active' : ''}`}
                                onClick={() => setTheme(theme.id)}
                            >
                                <div
                                    className="theme-preview"
                                    style={{
                                        // Pass CSS variables inline for the preview
                                        ['--preview-primary' as any]: theme.primary,
                                        ['--preview-secondary' as any]: theme.secondary,
                                        ['--preview-bg' as any]: theme.bg,
                                    }}
                                >
                                    {state.preferences.theme === theme.id && (
                                        <div className="flex-center h-full text-white text-2xl">✓</div>
                                    )}
                                </div>
                                <span className="theme-label">{theme.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="settings-section">
                    <h3>🔔 Notifications</h3>
                    <div className="flex flex-col gap-sm">
                        <div className="toggle-row">
                            <span>Study Reminders</span>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="toggle-row">
                            <span>Break Alerts</span>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={true} readOnly />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                <section className="settings-section" style={{ borderColor: 'var(--accent-red)' }}>
                    <h3 className="text-red">Danger Zone</h3>
                    <button className="btn btn-secondary text-red w-full" onClick={handleClearData}>
                        🗑 Clear All Data
                    </button>
                    <p className="text-sm text-secondary mt-2 text-center">
                        Resets all progress, coins, and settings.
                    </p>
                </section>

                <p className="text-center text-sm text-light mt-8">
                    HamHam Study Buddy v1.2.0 <br />
                    Made with 🧡 for you
                </p>

            </div>
        </div>
    );
}
