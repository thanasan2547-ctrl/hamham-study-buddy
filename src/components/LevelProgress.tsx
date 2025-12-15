import { useStudy } from '../context/StudyContext';
import './Gamification.css';

export default function LevelProgress() {
    const { state } = useStudy();
    const { petState } = state;

    const progressPercent = Math.min(100, (petState.xp / petState.nextLevelXp) * 100);

    return (
        <div className="level-progress-container animate-slideUp">
            <div className="level-header">
                <span className="level-badge">Lv. {petState.level}</span>
                <span className="xp-text">{Math.floor(petState.xp)} / {petState.nextLevelXp} XP</span>
            </div>
            <div className="xp-bar-container">
                <div
                    className="xp-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
        </div>
    );
}
