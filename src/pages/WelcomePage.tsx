import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

// Using a nice placeholder if local image fails
const mascotImage = '/hamham-mascot.png';

export default function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <div className="welcome-container">

                {/* Hero Section */}
                <header className="hero-section">
                    <div className="hero-text">
                        <span className="hero-badge">✨ V1.0 Now Live</span>
                        <h1 className="hero-title">Your Cute & Smart Study Companion</h1>
                        <p className="hero-subtitle">
                            Turn boring study sessions into a fun adventure! HamHam helps you plan,
                            focus, and stay motivated with gamified rewards and wellness tools.
                        </p>
                        <div className="hero-buttons">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/add-subjects')}
                            >
                                Get Started 🚀
                            </button>
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Features
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="mascot-circle-bg"></div>
                        <img
                            src={mascotImage}
                            alt="HamHam Mascot"
                            className="hero-mascot-img"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML += '<div style="font-size: 15rem;">🐹</div>';
                            }}
                        />
                    </div>
                </header>

                {/* How It Works Section */}
                <section className="how-it-works-section">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-desc">Achieving your goals is as staggering as 1-2-3</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Create Your Plan</h3>
                            <p className="text-secondary">Add your subjects and exam dates. We'll generate a smart schedule for you.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3 className="step-title">Study & Focus</h3>
                            <p className="text-secondary">Use the Pomodoro timer and flashcards to master your materials.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3 className="step-title">Earn & Grow</h3>
                            <p className="text-secondary">Gain XP, level up, and feed HamHam with your hard-earned MindCoins!</p>
                        </div>
                    </div>
                </section>

                {/* All Features Grid */}
                <section id="features" className="features-section">
                    <div className="section-header">
                        <h2 className="section-title">Everything You Need</h2>
                        <p className="section-desc">Packed with features to boost your productivity</p>
                    </div>

                    <div className="features-grid-expanded">
                        <div className="feature-box">
                            <div className="feature-icon-lg">🍅</div>
                            <h3>Focus Timer</h3>
                            <p className="text-secondary">Integrated Pomodoro timer with break reminders to prevent burnout.</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-lg">📊</div>
                            <h3>Analytics</h3>
                            <p className="text-secondary">Track your study time, streaks, and subject progress over time.</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-lg">🎴</div>
                            <h3>Flashcards</h3>
                            <p className="text-secondary">Create decks and review key concepts with ease.</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-lg">🎮</div>
                            <h3>Gamification</h3>
                            <p className="text-secondary">Complete daily challenges and unlock achievements.</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-lg">🧘</div>
                            <h3>Wellness</h3>
                            <p className="text-secondary">Log your mood and get stretch reminders to stay healthy.</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-lg">🐹</div>
                            <h3>Virtual Pet</h3>
                            <p className="text-secondary">Keep HamHam happy and fed by staying consistent with your studies.</p>
                        </div>
                    </div>
                </section>

                <footer className="simple-footer">
                    <p>© 2025 HamHam Study Buddy • Made with 🧡</p>
                </footer>

            </div>
        </div>
    );
}
