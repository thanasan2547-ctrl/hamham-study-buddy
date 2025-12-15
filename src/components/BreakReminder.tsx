import './Wellness.css';

interface BreakReminderProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BreakReminder({ isOpen, onClose }: BreakReminderProps) {
    if (!isOpen) return null;

    const stretches = [
        "Reach for the sky! Stretch your arms up high! 🙆‍♀️",
        "Roll your shoulders back and forth. 🔄",
        "Look away from the screen at something 20 feet away. 👀",
        "Stand up and do a little wiggle dance! 💃",
        "Take 3 deep breaths... In... Out... 🧘‍♂️"
    ];

    const randomStretch = stretches[Math.floor(Math.random() * stretches.length)];

    return (
        <div className="break-reminder-overlay" onClick={onClose}>
            <div className="break-reminder-card" onClick={e => e.stopPropagation()}>
                <div className="break-icon">☕</div>
                <h2 className="break-title">Time for a Break!</h2>
                <p className="break-message">You've focused hard! Let's recharge for 5 minutes.</p>

                <div className="stretch-suggestion">
                    <strong>Suggestion:</strong><br />
                    {randomStretch}
                </div>

                <div className="flex flex-center gap-md">
                    <button className="btn btn-primary" onClick={onClose}>
                        Okay, taking a break!
                    </button>
                </div>
            </div>
        </div>
    );
}
