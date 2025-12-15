import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
    StudyState,
    Subject,
    StudySession,
    TimeSlot,
    StudyStyle,
    DEFAULT_TIME_SLOTS,
    PetState,
    Flashcard,
    Deck,
    Note,
    Mood,
    MoodEntry,
} from '../types';
import { generateSchedule } from '../utils/scheduleGenerator';

// Initial state
const initialState: StudyState = {
    subjects: [],
    preferences: {
        studyStyle: 'early-bird',
        timeSlots: DEFAULT_TIME_SLOTS,
        customSlots: [],
        theme: 'default',
        userName: 'Friend',
    },
    schedule: [],
    timerMinutes: 25,
    timerSeconds: 0,
    timerRunning: false,
    studyMinutesToday: 0,
    mindCoins: 100, // Start with some coins

    // Gamification
    achievements: [],
    dailyChallenges: [],
    petState: {
        happiness: 80,
        hunger: 20,
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        lastInteraction: new Date().toISOString()
    },

    // Study Tools
    decks: [],
    quizResults: [],
    notes: [],
    resources: [],

    // Wellness
    moodHistory: [],

    // Analytics
    stats: {
        totalStudyTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        sessionsCompleted: 0,
        avergeSessionLength: 0,
        mostProductiveTime: '00:00-00:00'
    }
};

// Action types
type Action =
    | { type: 'ADD_SUBJECT'; payload: Subject }
    | { type: 'REMOVE_SUBJECT'; payload: string }
    | { type: 'UPDATE_SUBJECT'; payload: Subject }
    | { type: 'UPDATE_SUBJECT_PROGRESS'; payload: { id: string; progress: number } }
    | { type: 'SET_STUDY_STYLE'; payload: StudyStyle }
    | { type: 'TOGGLE_TIME_SLOT'; payload: string }
    | { type: 'ADD_CUSTOM_SLOT'; payload: TimeSlot }
    | { type: 'GENERATE_SCHEDULE' }
    | { type: 'SET_SCHEDULE'; payload: StudySession[] }
    | { type: 'TOGGLE_SESSION_COMPLETE'; payload: string }
    | { type: 'SET_TIMER'; payload: { minutes: number; seconds: number } }
    | { type: 'TOGGLE_TIMER' }
    | { type: 'RESET_TIMER' }
    | { type: 'ADD_STUDY_MINUTES'; payload: number }
    | { type: 'ADD_MIND_COINS'; payload: number }
    | { type: 'SET_THEME'; payload: string }
    | { type: 'SET_USER_NAME'; payload: string }
    // New Actions
    | { type: 'UPDATE_PET_STATS'; payload: Partial<PetState> }
    | { type: 'ADD_XP'; payload: number }
    | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
    | { type: 'COMPLETE_CHALLENGE'; payload: string }
    | { type: 'ADD_DECK'; payload: Deck }
    | { type: 'ADD_CARD'; payload: { deckId: string; card: Flashcard } }
    | { type: 'UPDATE_CARD'; payload: { deckId: string; card: Flashcard } }
    | { type: 'ADD_NOTE'; payload: Note }
    | { type: 'UPDATE_NOTE'; payload: Note }
    | { type: 'DELETE_NOTE'; payload: string }
    | { type: 'ADD_MOOD'; payload: MoodEntry }
    | { type: 'LOAD_STATE'; payload: StudyState };

// Reducer
function studyReducer(state: StudyState, action: Action): StudyState {
    switch (action.type) {
        case 'ADD_SUBJECT':
            return { ...state, subjects: [...state.subjects, action.payload] };
        case 'REMOVE_SUBJECT':
            return {
                ...state,
                subjects: state.subjects.filter((s) => s.id !== action.payload),
                schedule: state.schedule.filter((s) => s.subjectId !== action.payload),
            };
        case 'UPDATE_SUBJECT':
            return {
                ...state,
                subjects: state.subjects.map((s) =>
                    s.id === action.payload.id ? action.payload : s
                ),
            };
        case 'UPDATE_SUBJECT_PROGRESS':
            return {
                ...state,
                subjects: state.subjects.map((s) =>
                    s.id === action.payload.id
                        ? { ...s, progress: action.payload.progress }
                        : s
                ),
            };
        case 'SET_STUDY_STYLE':
            return {
                ...state,
                preferences: { ...state.preferences, studyStyle: action.payload },
            };
        case 'TOGGLE_TIME_SLOT':
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    timeSlots: state.preferences.timeSlots.map((slot) =>
                        slot.id === action.payload
                            ? { ...slot, selected: !slot.selected }
                            : slot
                    ),
                },
            };
        case 'ADD_CUSTOM_SLOT':
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    customSlots: [...state.preferences.customSlots, action.payload],
                },
            };
        case 'GENERATE_SCHEDULE': {
            const newSchedule = generateSchedule(state.subjects, state.preferences);
            return { ...state, schedule: newSchedule };
        }
        case 'SET_SCHEDULE':
            return { ...state, schedule: action.payload };
        case 'TOGGLE_SESSION_COMPLETE':
            const session = state.schedule.find(s => s.id === action.payload);
            const isCompleting = session && !session.completed;

            // Auto-update stats if completing
            const newStats = isCompleting
                ? {
                    ...state.stats,
                    sessionsCompleted: state.stats.sessionsCompleted + 1,
                    // Simple logic for now
                    sessionsCompletedToday: (state.stats.sessionsCompleted || 0) + 1
                }
                : state.stats;

            return {
                ...state,
                schedule: state.schedule.map((session) =>
                    session.id === action.payload
                        ? { ...session, completed: !session.completed }
                        : session
                ),
                stats: newStats,
                // Add coins and XP for completion
                mindCoins: isCompleting ? state.mindCoins + 20 : state.mindCoins,
                petState: isCompleting
                    ? { ...state.petState, happiness: Math.min(100, state.petState.happiness + 5), xp: state.petState.xp + 10 }
                    : state.petState
            };
        case 'SET_TIMER':
            return {
                ...state,
                timerMinutes: action.payload.minutes,
                timerSeconds: action.payload.seconds,
            };
        case 'TOGGLE_TIMER':
            return { ...state, timerRunning: !state.timerRunning };
        case 'RESET_TIMER':
            return {
                ...state,
                timerMinutes: 25,
                timerSeconds: 0,
                timerRunning: false,
            };
        case 'ADD_STUDY_MINUTES':
            return {
                ...state,
                studyMinutesToday: state.studyMinutesToday + action.payload,
                stats: {
                    ...state.stats,
                    totalStudyTime: state.stats.totalStudyTime + action.payload
                }
            };
        case 'ADD_MIND_COINS':
            return { ...state, mindCoins: state.mindCoins + action.payload };

        case 'SET_THEME':
            return { ...state, preferences: { ...state.preferences, theme: action.payload } };
        case 'SET_USER_NAME':
            return { ...state, preferences: { ...state.preferences, userName: action.payload } };

        // New Actions
        case 'UPDATE_PET_STATS':
            return {
                ...state,
                petState: { ...state.petState, ...action.payload }
            };
        case 'ADD_XP':
            const newXp = state.petState.xp + action.payload;
            const leveledUp = newXp >= state.petState.nextLevelXp;
            return {
                ...state,
                petState: {
                    ...state.petState,
                    xp: leveledUp ? newXp - state.petState.nextLevelXp : newXp,
                    level: leveledUp ? state.petState.level + 1 : state.petState.level,
                    nextLevelXp: leveledUp ? Math.floor(state.petState.nextLevelXp * 1.5) : state.petState.nextLevelXp
                }
            };
        case 'UNLOCK_ACHIEVEMENT':
            return {
                ...state,
                achievements: state.achievements.map(a =>
                    a.id === action.payload ? { ...a, unlocked: true, unlockedDate: new Date().toISOString() } : a
                )
            };
        case 'ADD_DECK':
            return { ...state, decks: [...state.decks, action.payload] };
        case 'ADD_CARD':
            return {
                ...state,
                decks: state.decks.map(d =>
                    d.id === action.payload.deckId
                        ? { ...d, cards: [...d.cards, action.payload.card] }
                        : d
                )
            };
        case 'UPDATE_CARD':
            return {
                ...state,
                decks: state.decks.map(d =>
                    d.id === action.payload.deckId
                        ? {
                            ...d,
                            cards: d.cards.map(c => c.id === action.payload.card.id ? action.payload.card : c)
                        }
                        : d
                )
            };
        case 'ADD_NOTE':
            return { ...state, notes: [action.payload, ...state.notes] };
        case 'UPDATE_NOTE':
            return {
                ...state,
                notes: state.notes.map(n => n.id === action.payload.id ? action.payload : n)
            };
        case 'DELETE_NOTE':
            return {
                ...state,
                notes: state.notes.filter(n => n.id !== action.payload)
            };
        case 'ADD_MOOD':
            return {
                ...state,
                moodHistory: [action.payload, ...state.moodHistory]
            };

        case 'LOAD_STATE':
            return action.payload;
        default:
            return state;
    }
}

// Context
interface StudyContextType {
    state: StudyState;
    dispatch: React.Dispatch<Action>;
    addSubject: (subject: Omit<Subject, 'id' | 'progress'>) => void;
    removeSubject: (id: string) => void;
    updateSubjectProgress: (id: string, progress: number) => void;
    setStudyStyle: (style: StudyStyle) => void;
    toggleTimeSlot: (id: string) => void;
    generateStudySchedule: () => void;
    getSelectedTimeSlots: () => TimeSlot[];
    getRedFlagSubjects: () => Subject[];
    getUpcomingExams: () => Subject[];
    setTheme: (theme: string) => void;
    setUserName: (name: string) => void;

    // New Helpers
    feedPet: () => void;
    addMood: (mood: Mood, note?: string) => void;
    createDeck: (title: string, subjectId: string) => void;
    addCard: (deckId: string, front: string, back: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'hamham-study-buddy-state-v2'; // Changed key to force reset or handle migration if needed

// Provider
export function StudyProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(studyReducer, initialState);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with initial state to ensure new fields exist
                dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
            } catch (e) {
                console.error('Failed to load saved state:', e);
            }
        }
    }, []);

    // Save to localStorage on state change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Helper functions
    const addSubject = (subject: Omit<Subject, 'id' | 'progress'>) => {
        const newSubject: Subject = {
            ...subject,
            id: crypto.randomUUID(),
            progress: 0,
        };
        dispatch({ type: 'ADD_SUBJECT', payload: newSubject });
    };

    const removeSubject = (id: string) => {
        dispatch({ type: 'REMOVE_SUBJECT', payload: id });
    };

    const updateSubjectProgress = (id: string, progress: number) => {
        dispatch({ type: 'UPDATE_SUBJECT_PROGRESS', payload: { id, progress } });
    };

    const setStudyStyle = (style: StudyStyle) => {
        dispatch({ type: 'SET_STUDY_STYLE', payload: style });
    };

    const toggleTimeSlot = (id: string) => {
        dispatch({ type: 'TOGGLE_TIME_SLOT', payload: id });
    };

    const generateStudySchedule = () => {
        dispatch({ type: 'GENERATE_SCHEDULE' });
    };

    const getSelectedTimeSlots = (): TimeSlot[] => {
        return [
            ...state.preferences.timeSlots.filter((s) => s.selected),
            ...state.preferences.customSlots,
        ];
    };

    const getRedFlagSubjects = (): Subject[] => {
        return state.subjects.filter((s) => s.difficulty === 'red-flag');
    };

    const getUpcomingExams = (): Subject[] => {
        const now = new Date();
        return state.subjects
            .filter((s) => new Date(s.examDate) >= now)
            .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
    };

    const setTheme = (theme: string) => {
        dispatch({ type: 'SET_THEME', payload: theme });
        document.documentElement.setAttribute('data-theme', theme);
    };

    const setUserName = (name: string) => {
        dispatch({ type: 'SET_USER_NAME', payload: name });
    };

    // New Helpers
    const feedPet = () => {
        if (state.mindCoins >= 20) {
            dispatch({ type: 'ADD_MIND_COINS', payload: -20 });
            dispatch({ type: 'UPDATE_PET_STATS', payload: { hunger: Math.max(0, state.petState.hunger - 30), happiness: Math.min(100, state.petState.happiness + 10) } });
        }
    };

    const addMood = (mood: Mood, note?: string) => {
        dispatch({
            type: 'ADD_MOOD',
            payload: {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                mood,
                note,
                context: 'daily' // Logic to determine context could be added later
            }
        });
    };

    const createDeck = (title: string, subjectId: string) => {
        dispatch({
            type: 'ADD_DECK',
            payload: {
                id: crypto.randomUUID(),
                title,
                subjectId,
                cards: []
            }
        });
    };

    const addCard = (deckId: string, front: string, back: string) => {
        dispatch({
            type: 'ADD_CARD',
            payload: {
                deckId,
                card: {
                    id: crypto.randomUUID(),
                    front,
                    back,
                    box: 1,
                    nextReview: new Date().toISOString()
                }
            }
        });
    };

    return (
        <StudyContext.Provider
            value={{
                state,
                dispatch,
                addSubject,
                removeSubject,
                updateSubjectProgress,
                setStudyStyle,
                toggleTimeSlot,
                generateStudySchedule,
                getSelectedTimeSlots,
                getRedFlagSubjects,
                getUpcomingExams,
                setTheme,
                setUserName,
                feedPet,
                addMood,
                createDeck,
                addCard,
            }}
        >
            {children}
        </StudyContext.Provider>
    );
}

// Hook
export function useStudy() {
    const context = useContext(StudyContext);
    if (context === undefined) {
        throw new Error('useStudy must be used within a StudyProvider');
    }
    return context;
}
