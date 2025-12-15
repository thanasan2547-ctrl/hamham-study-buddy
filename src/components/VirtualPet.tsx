import { useStudy } from '../context/StudyContext';
import './Gamification.css';

export default function VirtualPet() {
    const { state, feedPet } = useStudy();
    const { petState, mindCoins } = state;

    // Determine pet mood based on happiness
    const getPetMood = () => {
        if (petState.happiness >= 80) return 'happy';
        if (petState.happiness >= 40) return 'normal';
        return 'sad';
    };

    // Determine pet image (placeholder logic - would swap images)
    const getPetEmoji = () => {
        const mood = getPetMood();
        switch (mood) {
            case 'happy': return '🐹'; // Needs specific image
            case 'normal': return '🐹';
            case 'sad': return '😿';
            default: return '🐹';
        }
    };

    const handleFeed = () => {
        if (mindCoins >= 20) {
            feedPet();
        } else {
            alert('Not enough MindCoins to feed! Study more to earn coins. 🪙');
        }
    };

    const isHungry = petState.hunger < 50;
    const isSad = petState.happiness < 40;

    return (
        <div className="virtual-pet-container card-yellow animate-bounce-in">
            <div className="pet-display">
                <div className={`pet-image emoji-icon-xl ${petState.happiness > 80 ? 'bounce' : ''}`}>
                    {getPetEmoji()}
                </div>
                {/* Speech bubble */}
                {(isHungry || isSad) && (
                    <div className="pet-speech-bubble" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '0.8rem',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        {isHungry ? 'I\'m hungry! 🧀' : 'Play with me! 🥺'}
                    </div>
                )}
            </div>

            <div className="pet-stats">
                <div className="stat-pill">
                    ❤️
                    <div className="stat-bar-mini">
                        <div className="stat-fill-mini happiness-fill" style={{ width: `${petState.happiness}%` }}></div>
                    </div>
                </div>
                <div className="stat-pill">
                    🍖
                    <div className="stat-bar-mini">
                        <div className="stat-fill-mini hunger-fill" style={{ width: `${petState.hunger}%` }}></div>
                    </div>
                </div>
            </div>

            <button
                className="btn btn-primary btn-sm feed-btn"
                onClick={handleFeed}
                disabled={mindCoins < 20}
                style={{ width: '100%', marginTop: '1rem' }}
            >
                Feed (20 🪙)
            </button>
            <div className="text-secondary text-xs mt-2" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Balance: {mindCoins} 🪙
            </div>
        </div>
    );
}
