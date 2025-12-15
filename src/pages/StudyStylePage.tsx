import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import './StudyStylePage.css';

export default function StudyStylePage() {
  const navigate = useNavigate();
  const { state, setStudyStyle, toggleTimeSlot, generateStudySchedule } = useStudy();
  const { preferences } = state;

  const handleGenerate = () => {
    generateStudySchedule();
    navigate('/dashboard');
  };

  return (
    <div className="study-style-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/add-subjects')}>← Back</button>
        <div className="header-center">
          <div className="header-avatar">🐹</div>
          <div className="header-bubble">When do you like to study? ⏰</div>
        </div>
        <div className="step-indicator">Step 2 of 2</div>
      </header>

      <div className="progress-container">
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: '100%' }}></div></div>
      </div>

      <div className="page-content">
        <div className="card style-card">
          <h2 className="section-title"><span>🌅</span> What's Your Study Style?</h2>
          <div className="style-grid">
            <button className={`style-btn ${preferences.studyStyle === 'early-bird' ? 'active' : ''}`}
              onClick={() => setStudyStyle('early-bird')}>
              <div className="style-icons">📚🌅</div>
              <div className="style-content">
                <div className="style-title">Early Bird</div>
                <div className="style-desc">Best for morning energy, fresh start.</div>
              </div>
              {preferences.studyStyle === 'early-bird' && <div className="style-selected">✓ Selected! Perfect for 6-10 AM sessions</div>}
            </button>
            <button className={`style-btn ${preferences.studyStyle === 'night-owl' ? 'active' : ''}`}
              onClick={() => setStudyStyle('night-owl')}>
              <div className="style-icons">🌙🦉</div>
              <div className="style-content">
                <div className="style-title">Night Owl</div>
                <div className="style-desc">Best for late night focus mode.</div>
              </div>
              {preferences.studyStyle === 'night-owl' && <div className="style-selected">✓ Selected! Perfect for evening sessions</div>}
            </button>
          </div>
        </div>

        <div className="card slots-card">
          <h2 className="section-title"><span>⏰</span> When Are You Available?</h2>
          <h3 className="slots-subtitle"><span>⚡</span> Quick Time Slots</h3>
          <div className="slots-grid">
            {preferences.timeSlots.map((slot) => (
              <button key={slot.id} className={`slot-btn ${slot.selected ? 'active' : ''}`}
                onClick={() => toggleTimeSlot(slot.id)}>
                {slot.label} {slot.selected && <span className="slot-check">✓</span>}
              </button>
            ))}
          </div>

          <div className="tip-box">
            <div className="tip-icon">🐹</div>
            <div className="tip-content">
              <div className="tip-title">Hamham's Tip</div>
              <div className="tip-text">Pick morning slots that match your energy! I recommend at least 3-4 time slots for a flexible schedule. 🌸</div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/add-subjects')}>← Previous</button>
          <button className="btn btn-primary generate-btn" onClick={handleGenerate}
            disabled={!preferences.timeSlots.some(s => s.selected)}>
            Generate My Schedule! ✨
          </button>
        </div>
      </div>
    </div>
  );
}
