import { useStudy } from '../context/StudyContext';
import { Achievement } from '../types';
import './Gamification.css';

export default function Achievements() {
    const { state } = useStudy();

    // Mock achievements if empty
    const displayAchievements: Achievement[] = state.achievements.length > 0 ? state.achievements : [
        { id: '1', title: 'First Steps', description: 'Complete your first study session', icon: '🌱', condition: 'total_sessions', requiredValue: 1, unlocked: true },
        { id: '2', title: 'On Fire!', description: 'Reach a 3-day streak', icon: '🔥', condition: 'streak', requiredValue: 3, unlocked: false },
        { id: '3', title: 'Bookworm', description: 'Study for 10 hours total', icon: '📚', condition: 'study_time', requiredValue: 600, unlocked: false },
        { id: '4', title: 'Early Bird', description: 'Study before 8 AM', icon: '🌅', condition: 'total_sessions', requiredValue: 1, unlocked: false }, // Mock condition
    ];

    return (
        <div className="achievements-container card mt-4">
            <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                <span>🏆</span> Achievements
            </h3>

            <div className="achievements-grid">
                {displayAchievements.map(achievement => (
                    <div
                        key={achievement.id}
                        className={`achievement-badge ${achievement.unlocked ? 'unlocked' : ''}`}
                        title={`${achievement.title}: ${achievement.description}`}
                    >
                        <div className="achievement-icon">{achievement.icon}</div>
                        <div className="achievement-name">{achievement.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
