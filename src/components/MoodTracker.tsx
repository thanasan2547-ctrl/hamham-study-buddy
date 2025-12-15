import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Mood } from '../types';
import './Wellness.css';

export default function MoodTracker() {
    const { state, addMood } = useStudy();
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [hasLoggedToday, setHasLoggedToday] = useState(false); // Simple check

    const moods: { id: Mood; emoji: string; label: string }[] = [
        { id: 'great', emoji: '🤩', label: 'Great' },
        { id: 'good', emoji: '😊', label: 'Good' },
        { id: 'neutral', emoji: '😐', label: 'Okay' },
        { id: 'tired', emoji: '😴', label: 'Tired' },
        { id: 'stressed', emoji: '😫', label: 'Stressed' },
    ];

    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(mood);
        addMood(mood);
        setHasLoggedToday(true);

        // Reset selection visual after a moment
        setTimeout(() => setSelectedMood(null), 2000);
    };

    return (
        <div className="mood-tracker-container animate-fadeIn">
            <h3 className="text-md font-bold text-primary mb-2">How are you feeling?</h3>

            {hasLoggedToday ? (
                <div className="animate-slideUp">
                    <p className="text-secondary mb-2">Thanks for checking in! 💖</p>
                </div>
            ) : (
                <p className="text-sm text-secondary">Log your mood to track your wellness</p>
            )}

            <div className="mood-options">
                {moods.map((m) => (
                    <button
                        key={m.id}
                        className={`mood-btn ${selectedMood === m.id ? 'selected' : ''}`}
                        onClick={() => handleMoodSelect(m.id)}
                        title={m.label}
                    >
                        {m.emoji}
                    </button>
                ))}
            </div>

            {/* Mini History (Last 5 days) */}
            <div className="mood-history-mini">
                {state.moodHistory.slice(0, 5).reverse().map((entry) => (
                    <div
                        key={entry.id}
                        className={`mood-dot ${entry.mood}`}
                        title={`${new Date(entry.date).toLocaleDateString()}: ${entry.mood}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
