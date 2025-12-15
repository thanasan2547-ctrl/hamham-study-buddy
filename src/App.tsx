import { Routes, Route } from 'react-router-dom'
import { StudyProvider } from './context/StudyContext'
import WelcomePage from './pages/WelcomePage'
import AddSubjectsPage from './pages/AddSubjectsPage'
import StudyStylePage from './pages/StudyStylePage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import FlashcardsPage from './pages/FlashcardsPage'
import QuizPage from './pages/QuizPage'
import NotesPage from './pages/NotesPage'
import ResourcesPage from './pages/ResourcesPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'

import Layout from './components/Layout'

function App() {
    return (
        <StudyProvider>
            <Routes>
                <Route path="/" element={<WelcomePage />} />

                {/* Main App with Navigation */}
                <Route element={<Layout />}>
                    <Route path="/add-subjects" element={<AddSubjectsPage />} />
                    <Route path="/study-style" element={<StudyStylePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </StudyProvider>
    )
}

export default App
