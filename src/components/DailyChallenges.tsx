import { useEffect } from 'react';
import { useStudy } from '../context/StudyContext';

import './Gamification.css';

export default function DailyChallenges() {
    const { state, dispatch } = useStudy();
    const { dailyChallenges } = state;

    // Initialize challenges if empty (mock logic, ideally done in context/backend)
    useEffect(() => {
        if (dailyChallenges.length === 0) {
            // Logic to fetch/initialize challenges
            // We need an action to set challenges, defaulting to simple mock here
            // In a real app, this would be a specific dispatch
        }
    }, [dailyChallenges.length, state.stats, dispatch]);

    const toggleChallenge = (id: string) => {
        dispatch({ type: 'COMPLETE_CHALLENGE', payload: id });
    };

    return (
        <div className="daily-challenges-container card">
            <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                <span>🎯</span> Daily Goals
            </h3>

            <div className="challenges-list">
                {dailyChallenges.length > 0 ? dailyChallenges.map(challenge => (
                    <div key={challenge.id} className={`challenge-item ${challenge.completed ? 'completed' : ''}`}>
                        <div
                            className={`challenge-checkbox ${challenge.completed ? 'checked' : ''}`}
                            onClick={() => toggleChallenge(challenge.id)}
                        >
                            {challenge.completed && '✓'}
                        </div>
                        <div className="challenge-info">
                            <div className="challenge-text">{challenge.description}</div>
                            <div className="challenge-reward">
                                <span>🪙</span> +{challenge.reward}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-secondary text-center py-4">
                        <p>Loading challenges...</p>
                        {/* Placeholder fallback since we didn't implement generation logic yet */}
                        <div className="challenge-item">
                            <div className="challenge-checkbox"></div>
                            <div className="challenge-info">
                                <div className="challenge-text">Study 25 min</div>
                                <div className="challenge-reward">🪙 +25</div>
                            </div>
                        </div>
                        <div className="challenge-item">
                            <div className="challenge-checkbox"></div>
                            <div className="challenge-info">
                                <div className="challenge-text">Log mood</div>
                                <div className="challenge-reward">🪙 +10</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
