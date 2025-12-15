import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { Note } from '../types';
import './NotesPage.css';

export default function NotesPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useStudy();
    const { notes, subjects } = state;

    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    // Editor state
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editSubject, setEditSubject] = useState('');



    const handleCreateNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            subjectId: subjects[0]?.id || '',
            title: 'Untitled Note',
            content: '',
            tags: [],
            lastModified: new Date().toISOString()
        };
        dispatch({ type: 'ADD_NOTE', payload: newNote });
        openNote(newNote);
    };

    const openNote = (note: Note) => {
        setActiveNoteId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditSubject(note.subjectId);
    };

    const handleSave = () => {
        if (activeNoteId) {
            const updatedNote: Note = {
                id: activeNoteId,
                subjectId: editSubject,
                title: editTitle,
                content: editContent,
                tags: [], // Tags logic could be added later
                lastModified: new Date().toISOString()
            };
            dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
            setActiveNoteId(null);
        }
    };

    const handleDelete = () => {
        if (activeNoteId && window.confirm('Are you sure you want to delete this note?')) {
            dispatch({ type: 'DELETE_NOTE', payload: activeNoteId });
            setActiveNoteId(null);
        }
    };

    const renderEditor = () => (
        <div className="note-editor animate-slideUp">
            <div className="flex flex-between mb-4">
                <button className="btn btn-ghost" onClick={() => setActiveNoteId(null)}>← Cancel</button>
                <div className="flex gap-sm">
                    <button className="btn btn-primary" onClick={handleSave}>💾 Save</button>
                    {activeNoteId && <button className="btn btn-ghost text-red" onClick={handleDelete}>🗑️</button>}
                </div>
            </div>

            <div className="editor-header">
                <input
                    className="editor-title-input"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Note Title"
                />
                <select
                    value={editSubject}
                    onChange={e => setEditSubject(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="" disabled>Select Subject</option>
                    {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            <textarea
                className="editor-textarea"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                placeholder="Start typing your notes here..."
            />
        </div>
    );

    const renderList = () => (
        <div className="notes-list-view animate-fadeIn">
            <div className="notes-grid">
                {notes.map(note => {
                    const subject = subjects.find(s => s.id === note.subjectId);
                    return (
                        <div key={note.id} className="note-card" onClick={() => openNote(note)}>
                            <div className="note-header">
                                <div className="note-title">{note.title}</div>
                                <div className="note-date">{new Date(note.lastModified).toLocaleDateString()}</div>
                            </div>
                            <div className="text-secondary text-sm mb-2">📚 {subject?.name || 'No Subject'}</div>
                            <div className="note-preview">
                                {note.content || '(No content)'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {notes.length === 0 && (
                <div className="text-center py-8 text-secondary">
                    <div className="emoji-icon-lg mb-2">📓</div>
                    <p>No notes yet. Tap + to create one!</p>
                </div>
            )}

            <button className="fab" onClick={handleCreateNote}>+</button>
        </div>
    );

    return (
        <div className="notes-page">
            <header className="page-header">
                <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
                <div className="header-title"><span>📓</span> My Notes</div>
                <div style={{ width: 60 }}></div>
            </header>

            <div className="page-content">
                {activeNoteId ? renderEditor() : renderList()}
            </div>
        </div>
    );
}
