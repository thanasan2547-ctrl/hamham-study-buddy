import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { SUBJECT_CATEGORIES, SubjectCategory, DifficultyLevel, getCategoryEmoji } from '../types';
import './AddSubjectsPage.css';

export default function AddSubjectsPage() {
  const navigate = useNavigate();
  const { state, addSubject, removeSubject } = useStudy();
  
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');

  const handleAddSubject = () => {
    if (!selectedCategory || !subjectName.trim() || !examDate) return;
    addSubject({
      category: selectedCategory,
      name: subjectName.trim(),
      examDate,
      examTime: examTime || '09:00',
      difficulty,
    });
    setSubjectName('');
    setExamDate('');
    setExamTime('');
    setDifficulty('normal');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="add-subjects-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>← Back</button>
        <div className="header-center">
          <div className="header-avatar">🐹</div>
          <div className="header-bubble">Let's add your subjects! 📚</div>
        </div>
        <div className="step-indicator">Step 1 of 2</div>
      </header>

      <div className="progress-container">
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: '50%' }}></div></div>
      </div>

      <div className="page-content">
        <div className="card form-card">
          <h2 className="section-title"><span>➕</span> Add Your Subjects</h2>

          <div className="form-section">
            <label className="form-label"><span>📁</span> Subject Category</label>
            <div className="category-grid">
              {SUBJECT_CATEGORIES.map((cat) => (
                <button key={cat.id} className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}>
                  <span className="category-emoji">{cat.emoji}</span>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><span>📝</span> Subject Name</label>
              <input type="text" placeholder="e.g., Calculus I" value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label"><span>📅</span> Exam Date</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label"><span>⏰</span> Exam Time</label>
              <input type="time" value={examTime} onChange={(e) => setExamTime(e.target.value)} className="form-input" />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label"><span>🎯</span> Difficulty Level</label>
            <div className="difficulty-grid">
              <button className={`difficulty-btn normal ${difficulty === 'normal' ? 'active' : ''}`}
                onClick={() => setDifficulty('normal')}>
                <div className="difficulty-icon">✅</div>
                <div><div className="difficulty-title">Normal</div><div className="difficulty-desc">Regular effort required</div></div>
              </button>
              <button className={`difficulty-btn red-flag ${difficulty === 'red-flag' ? 'active' : ''}`}
                onClick={() => setDifficulty('red-flag')}>
                <div className="difficulty-icon">🚩</div>
                <div><div className="difficulty-title">Red Flag</div><div className="difficulty-desc">Hard/Important subject</div></div>
              </button>
            </div>
          </div>

          <button className="btn btn-secondary add-subject-btn" onClick={handleAddSubject}
            disabled={!selectedCategory || !subjectName.trim() || !examDate}>
            <span>➕</span> Add Subject
          </button>
        </div>

        {state.subjects.length > 0 && (
          <div className="subjects-list">
            <h3 className="list-title">Your Subjects ({state.subjects.length})</h3>
            {state.subjects.map((subject) => (
              <div key={subject.id} className="subject-item">
                <div className="subject-icon">{getCategoryEmoji(subject.category)}</div>
                <div className="subject-info">
                  <div className="subject-name">{subject.name} {subject.difficulty === 'red-flag' && <span>🚩</span>}</div>
                  <div className="subject-meta">📅 {formatDate(subject.examDate)} at ⏰ {subject.examTime}</div>
                </div>
                <button className="remove-btn" onClick={() => removeSubject(subject.id)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button className="btn btn-primary next-btn" onClick={() => navigate('/study-style')}
            disabled={state.subjects.length === 0}>Next →</button>
        </div>
      </div>
    </div>
  );
}
