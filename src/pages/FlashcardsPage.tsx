import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';

import './FlashcardsPage.css';

export default function FlashcardsPage() {
    const navigate = useNavigate();
    const { state, createDeck, addCard } = useStudy();
    const { decks, subjects } = state;

    const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
    const [isStudying, setIsStudying] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [newDeckSubject, setNewDeckSubject] = useState(subjects[0]?.id || '');

    // Card creation state
    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');

    const activeDeck = decks.find(d => d.id === activeDeckId);

    const handleCreateDeck = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDeckName && newDeckSubject) {
            createDeck(newDeckName, newDeckSubject);
            setNewDeckName('');
        }
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeDeckId && newFront && newBack) {
            addCard(activeDeckId, newFront, newBack);
            setNewFront('');
            setNewBack('');
        }
    };

    const startStudy = () => {
        if (activeDeck && activeDeck.cards.length > 0) {
            setIsStudying(true);
            setCurrentCardIndex(0);
            setIsFlipped(false);
        }
    };

    const nextCard = () => {
        if (activeDeck && currentCardIndex < activeDeck.cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        } else {
            // End of deck
            setIsStudying(false);
            // Could dispatch 'COMPLETE_SESSION' or similar logic here
        }
    };

    const renderDeckList = () => (
        <div className="decks-view animate-fadeIn">
            <div className="card mb-6">
                <h3 className="text-lg font-bold mb-4">Create New Deck</h3>
                <form onSubmit={handleCreateDeck} className="flex gap-md flex-col sm:flex-row">
                    <input
                        type="text"
                        placeholder="Deck Name (e.g., Biology Chapter 1)"
                        value={newDeckName}
                        onChange={(e) => setNewDeckName(e.target.value)}
                        className="flex-1"
                        required
                    />
                    <select
                        value={newDeckSubject}
                        onChange={(e) => setNewDeckSubject(e.target.value)}
                        className="flex-1"
                        required
                    >
                        <option value="" disabled>Select Subject</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary" disabled={!newDeckName || !newDeckSubject}>
                        + Create
                    </button>
                </form>
            </div>

            <div className="tools-grid">
                {decks.map(deck => {
                    const subject = subjects.find(s => s.id === deck.subjectId);
                    return (
                        <div key={deck.id} className="deck-card" onClick={() => setActiveDeckId(deck.id)}>
                            <h3 className="deck-title">{deck.title}</h3>
                            <div className="deck-info">
                                <div>📚 {subject?.name || 'Unknown Subject'}</div>
                                <div>🎴 {deck.cards.length} cards</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {decks.length === 0 && (
                <div className="text-center py-8 text-secondary">
                    <div className="emoji-icon-lg mb-2">🎴</div>
                    <p>No flashcard decks yet. Create one to start studying!</p>
                </div>
            )}
        </div>
    );

    const renderDeckView = () => {
        if (!activeDeck) return null;
        return (
            <div className="deck-detail-view animate-slideUp">
                <div className="flex flex-between mb-6">
                    <h2 className="text-xl font-bold">{activeDeck.title}</h2>
                    <div className="flex gap-sm">
                        <button className="btn btn-primary" onClick={startStudy} disabled={activeDeck.cards.length === 0}>
                            ▶ Start Studying
                        </button>
                        <button className="btn btn-secondary" onClick={() => setActiveDeckId(null)}>Close</button>
                    </div>
                </div>

                {/* Add Card Form */}
                <div className="card mb-6 bg-card-blue">
                    <h4 className="font-bold mb-3">Add New Card</h4>
                    <form onSubmit={handleAddCard} className="flex flex-col gap-sm">
                        <div className="flex gap-md flex-col sm:flex-row">
                            <input
                                type="text"
                                placeholder="Front (Question)"
                                value={newFront}
                                onChange={(e) => setNewFront(e.target.value)}
                                className="flex-1"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Back (Answer)"
                                value={newBack}
                                onChange={(e) => setNewBack(e.target.value)}
                                className="flex-1"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-secondary self-start">
                            + Add Card
                        </button>
                    </form>
                </div>

                {/* Cards List */}
                <div className="cards-list">
                    {activeDeck.cards.map((card) => (
                        <div key={card.id} className="card-item">
                            <div className="card-content">
                                <div className="card-side">
                                    <div className="card-side-label">Front</div>
                                    <div>{card.front}</div>
                                </div>
                                <div className="card-side" style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
                                    <div className="card-side-label">Back</div>
                                    <div>{card.back}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {activeDeck.cards.length === 0 && <p className="text-center text-secondary">No cards in this deck yet.</p>}
                </div>
            </div>
        );
    };

    const renderStudyMode = () => {
        if (!activeDeck || activeDeck.cards.length === 0) return null;
        const card = activeDeck.cards[currentCardIndex];

        return (
            <div className="study-mode-view animate-fadeIn">
                <div className="text-center mb-4">
                    <span className="badge badge-orange">
                        Card {currentCardIndex + 1} of {activeDeck.cards.length}
                    </span>
                </div>

                <div
                    className={`flashcard-container`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                        <div className="card-face card-front">
                            {card.front}
                            <div className="text-xs text-light absolute bottom-4">Click to flip</div>
                        </div>
                        <div className="card-face card-back">
                            {card.back}
                        </div>
                    </div>
                </div>

                <div className="study-controls">
                    <button className="btn btn-secondary" onClick={() => setIsStudying(false)}>Stop</button>
                    <button className="btn btn-primary" onClick={nextCard}>
                        {currentCardIndex < activeDeck.cards.length - 1 ? 'Next Card →' : 'Finish'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flashcards-page">
            <header className="page-header">
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
                <div className="header-title"><span>🎴</span> Flashcards</div>
                <div style={{ width: 60 }}></div> {/* Spacer */}
            </header>

            <div className="page-content">
                {isStudying ? renderStudyMode() : activeDeckId ? renderDeckView() : renderDeckList()}
            </div>
        </div>
    );
}
