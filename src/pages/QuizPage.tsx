import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { Deck, Flashcard } from '../types';
import './QuizPage.css';

export default function QuizPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useStudy();
    const { decks, subjects } = state;

    const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

    // Helper to generate options
    const generateOptions = (deck: Deck, correctCard: Flashcard) => {
        // Pick 3 random wrong answers from other cards in deck
        const otherCards = deck.cards.filter(c => c.id !== correctCard.id);
        const wrongAnswers = otherCards
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => c.back);

        // If not enough cards, specific placeholders (or duplicate logic)
        while (wrongAnswers.length < 3) {
            wrongAnswers.push(`Random Answer ${wrongAnswers.length + 1}`);
        }

        const options = [...wrongAnswers, correctCard.back];
        return options.sort(() => 0.5 - Math.random());
    };

    // State for current options to prevent re-shuffling on render
    const [currentOptions, setCurrentOptions] = useState<string[]>([]);

    const activeDeck = decks.find(d => d.id === activeDeckId);

    const startQuiz = (deckId: string) => {
        const deck = decks.find(d => d.id === deckId);
        if (deck && deck.cards.length >= 4) {
            setActiveDeckId(deckId);

            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResult(false);
            setIsAnswerRevealed(false);
            setSelectedAnswer(null);

            // Set initial options
            setCurrentOptions(generateOptions(deck, deck.cards[0]));
        } else {
            alert('Deck must have at least 4 cards to start a quiz!');
            // Ideally a better UI message
        }
    };

    const handleAnswer = (answer: string) => {
        if (isAnswerRevealed || !activeDeck) return;

        setSelectedAnswer(answer);
        setIsAnswerRevealed(true);

        const currentCard = activeDeck.cards[currentQuestionIndex];
        const isCorrect = answer === currentCard.back;

        if (isCorrect) {
            setScore(score + 1);
        }

        // Auto move after delay
        setTimeout(() => {
            if (currentQuestionIndex < activeDeck.cards.length - 1) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setIsAnswerRevealed(false);
                setSelectedAnswer(null);
                setCurrentOptions(generateOptions(activeDeck, activeDeck.cards[nextIndex]));
            } else {
                finishQuiz(score + (isCorrect ? 1 : 0));
            }
        }, 1500);
    };

    const finishQuiz = (finalScore: number) => {
        setShowResult(true);
        // Dispatch rewards
        dispatch({ type: 'ADD_XP', payload: finalScore * 10 });
        dispatch({ type: 'ADD_MIND_COINS', payload: finalScore * 5 });

        // Complete daily challenge if applicable
        // dispatch({ type: 'UPDATE_CHALLENGE', payload: 'quiz_score' }); // Mock
    };

    const renderDeckList = () => (
        <div className="decks-view animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-center">Choose a Deck to Quiz</h2>
            <div className="tools-grid">
                {decks.map(deck => {
                    const subject = subjects.find(s => s.id === deck.subjectId);
                    return (
                        <div key={deck.id} className="deck-card" onClick={() => startQuiz(deck.id)}>
                            <div className="deck-title">{deck.title}</div>
                            <div className="deck-info">📚 {subject?.name}</div>
                            <div className="deck-info">🎴 {deck.cards.length} cards</div>
                        </div>
                    );
                })}
            </div>
            {decks.length === 0 && (
                <div className="text-center py-8 text-secondary">
                    <p>No decks available. Create cards in Flashcards first!</p>
                    <button className="btn btn-primary mt-4" onClick={() => navigate('/flashcards')}>Go to Flashcards</button>
                </div>
            )}
        </div>
    );

    const renderQuestion = () => {
        if (!activeDeck) return null;
        const currentCard = activeDeck.cards[currentQuestionIndex];

        return (
            <div className="quiz-container animate-slideUp">
                <div className="flex flex-between mb-4 text-secondary">
                    <span>Question {currentQuestionIndex + 1}/{activeDeck.cards.length}</span>
                    <span>Score: {score}</span>
                </div>

                <div className="question-card">
                    <div className="question-text">{currentCard.front}</div>
                    <div className="options-grid">
                        {currentOptions.map((option, idx) => {
                            let optionClass = 'quiz-option';
                            if (isAnswerRevealed) {
                                if (option === currentCard.back) optionClass += ' correct';
                                else if (option === selectedAnswer) optionClass += ' wrong';
                            }

                            return (
                                <button
                                    key={idx}
                                    className={optionClass}
                                    onClick={() => handleAnswer(option)}
                                    disabled={isAnswerRevealed}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderResult = () => (
        <div className="quiz-container animate-slideUp">
            <h2 className="text-2xl font-bold mb-4">Quiz Complete! 🎉</h2>
            <div className="score-circle">
                <div className="score-value">{Math.round((score / (activeDeck?.cards.length || 1)) * 100)}%</div>
                <div className="score-label">{score} / {activeDeck?.cards.length} Correct</div>
            </div>
            <p className="mb-6 text-secondary">You earned {score * 10} XP and {score * 5} MindCoins!</p>
            <div className="flex flex-center gap-md">
                <button className="btn btn-primary" onClick={() => setActiveDeckId(null)}>Try Another Deck</button>
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className="quiz-page">
            <header className="page-header">
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
                <div className="header-title"><span>📝</span> Quick Quiz</div>
                <div style={{ width: 60 }}></div>
            </header>

            <div className="page-content">
                {!activeDeckId ? renderDeckList() : showResult ? renderResult() : renderQuestion()}
            </div>
        </div>
    );
}
