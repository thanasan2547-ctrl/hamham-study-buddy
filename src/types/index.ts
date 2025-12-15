// Types for HamHam Study Buddy

export type SubjectCategory =
    | 'Mathematics'
    | 'Science'
    | 'Humanities'
    | 'Technology'
    | 'Social Sciences'
    | 'Language'
    | 'Arts'
    | 'Other';

export type DifficultyLevel = 'normal' | 'red-flag';

export type StudyStyle = 'early-bird' | 'night-owl';

export interface Subject {
    id: string;
    category: SubjectCategory;
    name: string;
    examDate: string; // ISO date string
    examTime: string; // HH:mm format
    difficulty: DifficultyLevel;
    progress: number; // 0-100
}

export interface TimeSlot {
    id: string;
    label: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    selected: boolean;
}

export interface StudySession {
    id: string;
    subjectId: string;
    date: string; // ISO date string
    startTime: string;
    endTime: string;
    completed: boolean;
}

export interface StudyPreferences {
    studyStyle: StudyStyle;
    timeSlots: TimeSlot[];
    customSlots: TimeSlot[];
    theme?: string;
    userName?: string;
}

export interface StudyState {
    subjects: Subject[];
    preferences: StudyPreferences;
    schedule: StudySession[];
    timerMinutes: number;
    timerSeconds: number;
    timerRunning: boolean;
    studyMinutesToday: number;
    mindCoins: number;

    // Gamification
    achievements: Achievement[];
    dailyChallenges: DailyChallenge[];
    petState: PetState;

    // Study Tools
    decks: Deck[];
    quizResults: QuizResult[];
    notes: Note[];
    resources: ResourceLink[];

    // Wellness
    moodHistory: MoodEntry[];

    // Analytics
    stats: StudyStats;
}

export const SUBJECT_CATEGORIES: { id: SubjectCategory; label: string; emoji: string }[] = [
    { id: 'Mathematics', label: 'Mathematics', emoji: '📊' },
    { id: 'Science', label: 'Science', emoji: '🔬' },
    { id: 'Humanities', label: 'Humanities', emoji: '📚' },
    { id: 'Technology', label: 'Technology', emoji: '💻' },
    { id: 'Social Sciences', label: 'Social Sciences', emoji: '🌍' },
    { id: 'Language', label: 'Language', emoji: '🗣️' },
    { id: 'Arts', label: 'Arts', emoji: '🎨' },
    { id: 'Other', label: 'Other', emoji: '📁' },
];

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
    { id: '1', label: '6:00-8:00 AM', startTime: '06:00', endTime: '08:00', selected: false },
    { id: '2', label: '8:00-10:00 AM', startTime: '08:00', endTime: '10:00', selected: false },
    { id: '3', label: '10:00-12:00 PM', startTime: '10:00', endTime: '12:00', selected: false },
    { id: '4', label: '12:00-2:00 PM', startTime: '12:00', endTime: '14:00', selected: false },
    { id: '5', label: '2:00-4:00 PM', startTime: '14:00', endTime: '16:00', selected: false },
    { id: '6', label: '4:00-6:00 PM', startTime: '16:00', endTime: '18:00', selected: false },
    { id: '7', label: '6:00-8:00 PM', startTime: '18:00', endTime: '20:00', selected: false },
    { id: '8', label: '8:00-10:00 PM', startTime: '20:00', endTime: '22:00', selected: false },
    { id: '9', label: '10:00-12:00 AM', startTime: '22:00', endTime: '00:00', selected: false },
];


export const getCategoryEmoji = (category: SubjectCategory): string => {
    return SUBJECT_CATEGORIES.find(c => c.id === category)?.emoji || '📁';
};

// ===== New Feature Types =====

// Gamification
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: 'study_time' | 'streak' | 'flashcards' | 'quiz_score' | 'total_sessions';
    requiredValue: number;
    unlocked: boolean;
    unlockedDate?: string;
}

export interface DailyChallenge {
    id: string;
    description: string;
    target: number;
    current: number;
    reward: number; // MindCoins
    type: 'study_minutes' | 'complete_sessions' | 'quiz_score' | 'review_cards';
    completed: boolean;
}

export interface PetState {
    happiness: number; // 0-100
    hunger: number; // 0-100
    level: number;
    xp: number;
    nextLevelXp: number;
    lastInteraction: string; // ISO date
}

// Study Tools
export interface Flashcard {
    id: string;
    front: string;
    back: string;
    box: number; // 1-5 for spaced repetition
    nextReview: string; // ISO date
    lastReviewed?: string;
}

export interface Deck {
    id: string;
    subjectId: string;
    title: string;
    cards: Flashcard[];
}

export interface QuizResult {
    id: string;
    deckId: string;
    score: number;
    totalQuestions: number;
    date: string;
}

export interface Note {
    id: string;
    subjectId: string;
    title: string;
    content: string; // Markdown
    tags: string[];
    lastModified: string;
}

export interface ResourceLink {
    id: string;
    subjectId: string;
    title: string;
    url: string;
    type: 'video' | 'article' | 'pdf' | 'other';
}

// Wellness
export type Mood = 'great' | 'good' | 'neutral' | 'tired' | 'stressed';

export interface MoodEntry {
    id: string;
    date: string; // ISO date
    mood: Mood;
    note?: string;
    context: 'pre-study' | 'post-study' | 'daily';
}

// Analytics
export interface StudyStats {
    totalStudyTime: number; // minutes
    currentStreak: number;
    longestStreak: number;
    sessionsCompleted: number;
    avergeSessionLength: number;
    mostProductiveTime: string; // e.g. "08:00-10:00"
}
