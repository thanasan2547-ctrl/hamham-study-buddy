import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import './StatsPage.css';

export default function StatsPage() {
    const navigate = useNavigate();
    const { state } = useStudy();
    const { stats, subjects } = state;

    // Mock data for weekly chart until we have real history tracking
    const weeklyData = [
        { day: 'Mon', minutes: 45 },
        { day: 'Tue', minutes: 90 },
        { day: 'Wed', minutes: 30 },
        { day: 'Thu', minutes: 60 },
        { day: 'Fri', minutes: 120 },
        { day: 'Sat', minutes: 0 },
        { day: 'Sun', minutes: state.studyMinutesToday }, // Today (assume Sunday for mock)
    ];

    const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 60);

    return (
        <div className="stats-page">
            <header className="page-header">
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
                <div className="header-title"><span>📈</span> Analytics</div>
                <div style={{ width: 60 }}></div>
            </header>

            <div className="page-content">

                {/* Key Metrics */}
                <div className="stats-overview-grid">
                    <div className="big-stat-card">
                        <div className="big-stat-value">{stats.totalStudyTime}</div>
                        <div className="big-stat-label">Total Minutes</div>
                    </div>
                    <div className="big-stat-card">
                        <div className="big-stat-value">{stats.currentStreak} 🔥</div>
                        <div className="big-stat-label">Day Streak</div>
                    </div>
                    <div className="big-stat-card">
                        <div className="big-stat-value">{stats.sessionsCompleted}</div>
                        <div className="big-stat-label">Sessions Done</div>
                    </div>
                    <div className="big-stat-card">
                        <div className="big-stat-value">{subjects.length}</div>
                        <div className="big-stat-label">Subjects</div>
                    </div>
                </div>

                {/* Weekly Activity Chart */}
                <div className="chart-container">
                    <h3 className="text-xl font-bold mb-4">Weekly Activity</h3>
                    <div className="chart-placeholder">
                        {weeklyData.map((d, i) => (
                            <div key={i} className="bar-group">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${(d.minutes / maxMinutes) * 100}%`,
                                        opacity: d.minutes > 0 ? 1 : 0.3
                                    }}
                                    title={`${d.minutes} mins`}
                                ></div>
                                <div className="bar-label">{d.day}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subject Breakdown (Simple List) */}
                <div className="chart-container">
                    <h3 className="text-xl font-bold mb-4">Subject Breakdown</h3>
                    <div className="flex flex-col gap-sm">
                        {subjects.map(subject => (
                            <div key={subject.id} className="flex flex-col">
                                <div className="flex flex-between text-sm mb-1">
                                    <span>{subject.name}</span>
                                    <span>{subject.progress}%</span>
                                </div>
                                <div className="goal-progress-bar">
                                    <div
                                        className="goal-progress-fill"
                                        style={{ width: `${subject.progress}%`, background: 'var(--color-primary)' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {subjects.length === 0 && <p className="text-secondary">No subjects added yet.</p>}
                    </div>
                </div>

                {/* Goals Tracking */}
                <div className="goals-section">
                    <h3 className="text-xl font-bold mb-4">Current Goals</h3>
                    <div className="flex flex-col gap-md">
                        <div className="goal-item">
                            <div className="goal-icon">🏆</div>
                            <div className="goal-details">
                                <div className="flex flex-between">
                                    <span className="goal-title">Reach Level 5</span>
                                    <span className="text-sm text-secondary">{state.petState.level}/5</span>
                                </div>
                                <div className="goal-progress-bar">
                                    <div className="goal-progress-fill" style={{ width: `${(state.petState.level / 5) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="goal-item">
                            <div className="goal-icon">💰</div>
                            <div className="goal-details">
                                <div className="flex flex-between">
                                    <span className="goal-title">Earn 500 MindCoins</span>
                                    <span className="text-sm text-secondary">{state.mindCoins}/500</span>
                                </div>
                                <div className="goal-progress-bar">
                                    <div className="goal-progress-fill" style={{ width: `${Math.min(100, (state.mindCoins / 500) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
