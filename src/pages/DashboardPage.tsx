import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { getCategoryEmoji } from '../types';
import { getDaysUntilExam, formatRemainingTime } from '../utils/scheduleGenerator';
import LevelProgress from '../components/LevelProgress';
import VirtualPet from '../components/VirtualPet';
import DailyChallenges from '../components/DailyChallenges';
import Achievements from '../components/Achievements';
import MoodTracker from '../components/MoodTracker';
import BreakReminder from '../components/BreakReminder';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { state, getRedFlagSubjects, getUpcomingExams, dispatch } = useStudy();
  const [activeTab, setActiveTab] = useState<'overview' | 'timer' | 'achievements'>('overview');
  const [showBreakReminder, setShowBreakReminder] = useState(false);

  const redFlagCount = getRedFlagSubjects().length;
  const upcomingExams = getUpcomingExams();

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (state.timerRunning) {
      interval = window.setInterval(() => {
        if (state.timerSeconds === 0) {
          if (state.timerMinutes === 0) {
            dispatch({ type: 'TOGGLE_TIMER' });
            dispatch({ type: 'ADD_MIND_COINS', payload: 10 });
            dispatch({ type: 'ADD_STUDY_MINUTES', payload: 25 });
            dispatch({ type: 'ADD_XP', payload: 50 }); // Add XP for finishing timer
            dispatch({ type: 'RESET_TIMER' });
            // Show break reminder
            setShowBreakReminder(true);
          } else {
            dispatch({ type: 'SET_TIMER', payload: { minutes: state.timerMinutes - 1, seconds: 59 } });
          }
        } else {
          dispatch({ type: 'SET_TIMER', payload: { minutes: state.timerMinutes, seconds: state.timerSeconds - 1 } });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.timerRunning, state.timerMinutes, state.timerSeconds, dispatch]);

  const formatTime = (min: number, sec: number) =>
    `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/study-style')}>← Back</button>
        <div className="header-title"><span>📊</span> Your Study Dashboard</div>
        <button className="btn btn-ghost" onClick={() => navigate('/add-subjects')}>✏️ Edit Plan</button>
      </header>

      <div className="page-content">

        {/* Key Metrics Banner */}
        <div className="stats-banner mb-6">
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <div className="stat-card hover-lift" onClick={() => navigate('/stats')} style={{ cursor: 'pointer' }}>
              <span className="stat-icon">📊</span>
              <div className="stat-text">
                <div className="stat-value">Stats</div>
                <div className="stat-label">View Report</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🚩</span>
              <div className="stat-text">
                <div className="stat-value">{redFlagCount}</div>
                <div className="stat-label">Red Flags</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🔥</span>
              <div className="stat-text">
                <div className="stat-value">{state.stats.currentStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🧠</span>
              <div className="stat-text">
                <div className="stat-value">{state.mindCoins}</div>
                <div className="stat-label">MindCoins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-main-grid">
          <div className="left-column flex flex-col gap-md">
            <VirtualPet />
            <MoodTracker />
            <LevelProgress />
          </div>

          <div className="right-column flex flex-col gap-md">
            <DailyChallenges />
            <div className="card exams-card">
              <h3 className="card-title"><span>⏰</span> Upcoming</h3>
              {upcomingExams.length > 0 ? (
                <div className="upcoming-mini-list">
                  {upcomingExams.slice(0, 2).map((exam) => (
                    <div key={exam.id} className="exam-item-mini">
                      <div className="exam-icon-sm">{getCategoryEmoji(exam.category)}</div>
                      <div className="exam-info-mini">
                        <div className="exam-name-sm">{exam.name}</div>
                        <div className="exam-date-sm">{new Date(exam.examDate).toLocaleDateString('th-TH')}</div>
                      </div>
                      <div className="exam-remaining-sm badge badge-orange">{getDaysUntilExam(exam.examDate)} days</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-sm text-center py-2">No exams soon! 🎉</p>
              )}
            </div>
          </div>
        </div>

        <BreakReminder isOpen={showBreakReminder} onClose={() => setShowBreakReminder(false)} />

        <div className="tabs-container mt-6">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`} onClick={() => setActiveTab('timer')}>🍅 Focus Timer</button>
          <button className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>🏆 Achievements</button>
        </div>

        {activeTab === 'timer' && (
          <div className="timer-section card animate-slideUp">
            <h3 className="timer-title"><span>⏱️</span> Focus Timer <span>🍅</span></h3>
            <div className="timer-display">
              <div className="timer-time">{formatTime(state.timerMinutes, state.timerSeconds)}</div>
              <div className="timer-mode">🍅 Focus Mode</div>
            </div>
            <div className="timer-controls">
              <button className="btn btn-primary timer-btn" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}>
                {state.timerRunning ? '⏸ Pause' : '▶ Start'}
              </button>
              <button className="btn btn-secondary timer-btn" onClick={() => dispatch({ type: 'RESET_TIMER' })}>⏱ Full Timer</button>
            </div>
            <div className="timer-stats">
              <div className="timer-stat"><div className="timer-stat-value">{state.studyMinutesToday}</div><div className="timer-stat-label">Minutes Today</div></div>
              <div className="timer-stat"><div className="timer-stat-value">+{state.timerRunning ? '50' : '0'} XP</div><div className="timer-stat-label">Potential XP</div></div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && <Achievements />}

        {activeTab === 'overview' && (
          <div className="animate-slideUp">
            {/* Tools Shortcuts */}
            <div className="tools-shortcuts mb-6 grid grid-cols-2 sm:grid-cols-4 gap-sm">
              <button className="btn btn-secondary flex-col p-4 h-auto" onClick={() => navigate('/flashcards')}>
                <span className="text-2xl mb-1">🎴</span>
                <span className="text-sm">Flashcards</span>
              </button>
              <button className="btn btn-secondary flex-col p-4 h-auto" onClick={() => navigate('/quiz')}>
                <span className="text-2xl mb-1">📝</span>
                <span className="text-sm">Quiz</span>
              </button>
              <button className="btn btn-secondary flex-col p-4 h-auto" onClick={() => navigate('/notes')}>
                <span className="text-2xl mb-1">📓</span>
                <span className="text-sm">Notes</span>
              </button>
              <button className="btn btn-secondary flex-col p-4 h-auto" onClick={() => navigate('/resources')}>
                <span className="text-2xl mb-1">🔗</span>
                <span className="text-sm">Resources</span>
              </button>
            </div>

            <div className="bottom-grid">
              <div className="card exams-card">
                <h3 className="card-title"><span>⏰</span> Upcoming Exams</h3>
                {upcomingExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="exam-item">
                    <div className="exam-icon">{getCategoryEmoji(exam.category)}</div>
                    <div className="exam-info">
                      <div className="exam-name">{exam.name} {exam.difficulty === 'red-flag' && <span>🚩</span>}</div>
                      <div className="exam-date">📅 {new Date(exam.examDate).toLocaleDateString('th-TH')} at ⏰ {exam.examTime}</div>
                    </div>
                    <div className="exam-remaining">{formatRemainingTime(getDaysUntilExam(exam.examDate))}</div>
                  </div>
                ))}
                {upcomingExams.length === 0 && <p className="text-secondary text-center py-4">No upcoming exams! 🎉</p>}
              </div>

              <div className="card progress-card">
                <h3 className="card-title"><span>📖</span> Study Progress</h3>
                {state.subjects.slice(0, 3).map((subject) => (
                  <div key={subject.id} className="progress-item">
                    <div className="progress-header">
                      <span>● {subject.name}</span>
                      {subject.difficulty === 'red-flag' && <span>🚩</span>}
                      <span className="progress-percent">{subject.progress}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${subject.progress}%` }}></div></div>
                  </div>
                ))}
                {state.subjects.length === 0 && <p className="text-secondary text-center py-4">Add subjects to see progress! 📚</p>}
              </div>
            </div>

            <button className="btn btn-primary calendar-btn" onClick={() => navigate('/calendar')}>
              📅 View Full Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
