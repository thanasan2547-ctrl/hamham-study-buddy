import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { getCategoryEmoji, Subject } from '../types';
import { getSessionsForDate, getDaysUntilExam } from '../utils/scheduleGenerator';
import './CalendarPage.css';

type ViewMode = 'week' | 'month';

interface DayInfo {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    sessions: number;
    exams: Subject[];
}

export default function CalendarPage() {
    const navigate = useNavigate();
    const { state, generateStudySchedule } = useStudy();
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Generate schedule if not already generated
    useEffect(() => {
        if (state.subjects.length > 0 && state.schedule.length === 0) {
            generateStudySchedule();
        }
    }, [state.subjects.length, state.schedule.length, generateStudySchedule]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get week days
    const getWeekDays = (date: Date): DayInfo[] => {
        const days: DayInfo[] = [];
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            d.setHours(0, 0, 0, 0);

            const dateStr = d.toISOString().split('T')[0];
            const sessions = state.schedule.filter(s => s.date === dateStr);
            const exams = state.subjects.filter(s => s.examDate === dateStr);

            days.push({
                date: d,
                isCurrentMonth: d.getMonth() === date.getMonth(),
                isToday: d.getTime() === today.getTime(),
                sessions: sessions.length,
                exams,
            });
        }
        return days;
    };

    // Get month days
    const getMonthDays = (date: Date): DayInfo[] => {
        const days: DayInfo[] = [];
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Start from the Sunday of the week containing the first day
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // End at the Saturday of the week containing the last day
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

        const current = new Date(startDate);
        while (current <= endDate) {
            const d = new Date(current);
            d.setHours(0, 0, 0, 0);

            const dateStr = d.toISOString().split('T')[0];
            const sessions = state.schedule.filter(s => s.date === dateStr);
            const exams = state.subjects.filter(s => s.examDate === dateStr);

            days.push({
                date: d,
                isCurrentMonth: d.getMonth() === month,
                isToday: d.getTime() === today.getTime(),
                sessions: sessions.length,
                exams,
            });

            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    const days = viewMode === 'week' ? getWeekDays(currentDate) : getMonthDays(currentDate);

    const navigatePrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
    };

    const formatWeekRange = (date: Date) => {
        const weekDays = getWeekDays(date);
        const start = weekDays[0].date;
        const end = weekDays[6].date;
        return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}`;
    };

    const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    // Get sessions for selected date
    const selectedDateSessions = selectedDate
        ? getSessionsForDate(state.schedule, selectedDate)
        : [];

    const selectedDateExams = selectedDate
        ? state.subjects.filter(s => s.examDate === selectedDate.toISOString().split('T')[0])
        : [];

    return (
        <div className="calendar-page">
            <header className="page-header">
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <div className="header-title">
                    <span>📅</span> Study Calendar
                </div>
                <button className="btn btn-ghost" onClick={goToToday}>
                    Today
                </button>
            </header>

            <div className="page-content">
                {/* View Toggle */}
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
                        onClick={() => setViewMode('week')}
                    >
                        📆 Week
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                        onClick={() => setViewMode('month')}
                    >
                        🗓️ Month
                    </button>
                </div>

                {/* Navigation */}
                <div className="calendar-nav">
                    <button className="nav-btn" onClick={navigatePrevious}>
                        ◀
                    </button>
                    <span className="nav-title">
                        {viewMode === 'week' ? formatWeekRange(currentDate) : formatMonthYear(currentDate)}
                    </span>
                    <button className="nav-btn" onClick={navigateNext}>
                        ▶
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className={`calendar-grid ${viewMode}`}>
                    {/* Day Headers */}
                    {dayNames.map((name, i) => (
                        <div key={i} className="day-header">
                            {name}
                        </div>
                    ))}

                    {/* Day Cells */}
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={`day-cell ${day.isToday ? 'today' : ''} ${!day.isCurrentMonth ? 'other-month' : ''} ${selectedDate?.toDateString() === day.date.toDateString() ? 'selected' : ''}`}
                            onClick={() => setSelectedDate(day.date)}
                        >
                            <span className="day-number">{day.date.getDate()}</span>
                            <div className="day-indicators">
                                {day.sessions > 0 && (
                                    <span className="indicator sessions" title={`${day.sessions} sessions`}>
                                        📖 {day.sessions}
                                    </span>
                                )}
                                {day.exams.length > 0 && (
                                    <span className="indicator exam" title="Exam day!">
                                        🎯
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="calendar-legend">
                    <div className="legend-item">
                        <span className="legend-dot sessions"></span>
                        <span>Study Sessions</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot exam"></span>
                        <span>Exam Day</span>
                    </div>
                </div>

                {/* Selected Date Details */}
                {selectedDate && (
                    <div className="selected-date-details card animate-slideUp">
                        <h3 className="details-title">
                            📅 {selectedDate.toLocaleDateString('th-TH', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </h3>

                        {/* Exams */}
                        {selectedDateExams.length > 0 && (
                            <div className="details-section exams-section">
                                <h4>🎯 Exams Today</h4>
                                {selectedDateExams.map(exam => (
                                    <div key={exam.id} className="detail-item exam-item">
                                        <span className="item-icon">{getCategoryEmoji(exam.category)}</span>
                                        <div className="item-info">
                                            <span className="item-name">{exam.name}</span>
                                            <span className="item-time">⏰ {exam.examTime}</span>
                                        </div>
                                        {exam.difficulty === 'red-flag' && <span className="red-flag">🚩</span>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Study Sessions */}
                        {selectedDateSessions.length > 0 ? (
                            <div className="details-section sessions-section">
                                <h4>📖 Study Sessions ({selectedDateSessions.length})</h4>
                                {selectedDateSessions.map(session => {
                                    const subject = state.subjects.find(s => s.id === session.subjectId);
                                    if (!subject) return null;
                                    return (
                                        <div key={session.id} className={`detail-item session-item ${session.completed ? 'completed' : ''}`}>
                                            <span className="item-icon">{getCategoryEmoji(subject.category)}</span>
                                            <div className="item-info">
                                                <span className="item-name">{subject.name}</span>
                                                <span className="item-time">
                                                    🕐 {session.startTime} - {session.endTime}
                                                </span>
                                            </div>
                                            {session.completed && <span className="completed-check">✅</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="no-sessions">
                                <span className="emoji-icon-xl">🐹</span>
                                <p>No study sessions scheduled for this day!</p>
                                <p className="text-light">Take a break or add more subjects 🌟</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Upcoming Exams Summary */}
                <div className="upcoming-exams card">
                    <h3 className="card-title">⏰ Upcoming Exams</h3>
                    {state.subjects
                        .filter(s => getDaysUntilExam(s.examDate) >= 0)
                        .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
                        .slice(0, 5)
                        .map(exam => (
                            <div key={exam.id} className="upcoming-exam-item">
                                <span className="exam-emoji">{getCategoryEmoji(exam.category)}</span>
                                <div className="exam-info">
                                    <span className="exam-name">{exam.name}</span>
                                    <span className="exam-date">
                                        {new Date(exam.examDate).toLocaleDateString('th-TH', {
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    </span>
                                </div>
                                <span className={`days-badge ${getDaysUntilExam(exam.examDate) <= 3 ? 'urgent' : ''}`}>
                                    {getDaysUntilExam(exam.examDate) === 0
                                        ? 'Today!'
                                        : `${getDaysUntilExam(exam.examDate)} days`}
                                </span>
                            </div>
                        ))}
                    {state.subjects.filter(s => getDaysUntilExam(s.examDate) >= 0).length === 0 && (
                        <p className="no-exams text-secondary">No upcoming exams! 🎉</p>
                    )}
                </div>
            </div>
        </div>
    );
}
