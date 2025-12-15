import { useNavigate } from 'react-router-dom';
import './NotesPage.css'; // Reusing some CSS or need new one

export default function ResourcesPage() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <header className="page-header">
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
                <div className="header-title"><span>🔗</span> Resources</div>
                <div style={{ width: 60 }}></div>
            </header>

            <div className="page-content text-center">
                <div className="emoji-icon-xl mb-4">🚧</div>
                <h2>Coming Soon!</h2>
                <p className="text-secondary">We're building a space for all your study links and files.</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Go Home</button>
            </div>
        </div>
    );
}
