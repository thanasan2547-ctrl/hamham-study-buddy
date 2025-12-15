import { Subject, StudySession, StudyPreferences, TimeSlot } from '../types';

// Generate study schedule based on subjects and preferences
export function generateSchedule(
    subjects: Subject[],
    preferences: StudyPreferences
): StudySession[] {
    const sessions: StudySession[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get selected time slots
    const selectedSlots: TimeSlot[] = [
        ...preferences.timeSlots.filter((s) => s.selected),
        ...preferences.customSlots,
    ];

    if (selectedSlots.length === 0 || subjects.length === 0) {
        return sessions;
    }

    // Sort slots by start time
    const sortedSlots = [...selectedSlots].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });

    // If early bird, prioritize morning slots; if night owl, prioritize evening slots
    if (preferences.studyStyle === 'night-owl') {
        sortedSlots.reverse();
    }

    // Sort subjects: red flag subjects first, then by exam date
    const sortedSubjects = [...subjects].sort((a, b) => {
        // Red flag subjects first
        if (a.difficulty === 'red-flag' && b.difficulty !== 'red-flag') return -1;
        if (a.difficulty !== 'red-flag' && b.difficulty === 'red-flag') return 1;
        // Then by exam date
        return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
    });

    // Generate sessions for the next 4 weeks
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 28);

    let currentDate = new Date(today);
    let sessionCount = 0;
    const maxSessions = 100; // Limit total sessions

    while (currentDate < endDate && sessionCount < maxSessions) {
        const dayOfWeek = currentDate.getDay();

        // Skip weekends as rest days (Saturday = 6, Sunday = 0)
        // But allow some study on weekends if exams are near
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Check if any exam is within 3 days - then study on weekends too
        const hasUrgentExam = sortedSubjects.some((subject) => {
            const examDate = new Date(subject.examDate);
            const daysUntilExam = Math.ceil(
                (examDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilExam >= 0 && daysUntilExam <= 3;
        });

        if (!isWeekend || hasUrgentExam) {
            // Assign subjects to time slots
            sortedSlots.forEach((slot, slotIndex) => {
                // Rotate through subjects
                const subjectIndex = (sessionCount + slotIndex) % sortedSubjects.length;
                const subject = sortedSubjects[subjectIndex];

                // Only create sessions before the exam date
                const examDate = new Date(subject.examDate);
                examDate.setHours(23, 59, 59, 999);

                if (currentDate <= examDate) {
                    // Red flag subjects get more sessions
                    const shouldAddSession =
                        subject.difficulty === 'red-flag' || slotIndex < 2;

                    if (shouldAddSession && sessionCount < maxSessions) {
                        sessions.push({
                            id: crypto.randomUUID(),
                            subjectId: subject.id,
                            date: currentDate.toISOString().split('T')[0],
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            completed: false,
                        });
                        sessionCount++;
                    }
                }
            });
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return sessions;
}

// Get sessions for a specific date
export function getSessionsForDate(
    sessions: StudySession[],
    date: Date
): StudySession[] {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter((s) => s.date === dateStr);
}

// Get sessions for a week
export function getSessionsForWeek(
    sessions: StudySession[],
    weekStart: Date
): Map<string, StudySession[]> {
    const weekSessions = new Map<string, StudySession[]>();

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        weekSessions.set(dateStr, sessions.filter((s) => s.date === dateStr));
    }

    return weekSessions;
}

// Calculate days until exam
export function getDaysUntilExam(examDate: string): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    return Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// Format remaining time
export function formatRemainingTime(days: number): string {
    if (days < 0) return 'Passed';
    if (days === 0) return 'Today!';
    if (days === 1) return '1 day remaining';
    if (days <= 7) return `${days} days remaining`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return '1 week remaining';
    return `${weeks} weeks remaining`;
}
