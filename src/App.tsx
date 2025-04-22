import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { CharacterCreator } from './pages/CharacterCreatorPage';
import { CharacterSheet } from './pages/CharacterSheetPage';
import { LevelUp } from './pages/LevelUpPage';
import { LoginPage } from './pages/LoginPage';
import { RequireAuth } from './components/Auth/RequireAuth';
import { Header } from './components/Layout/Header';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './pages';
import DashboardPage from './pages/DashboardPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignPage from './pages/CampaignPage';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <main className="w-full max-w-screen-md mx-auto p-4">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <>
                    <DashboardPage />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/create-campaign"
              element={
                <RequireAuth>
                  <>
                    <CreateCampaignPage />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/campaign/:id"
              element={
                <RequireAuth>
                  <>
                    <CampaignPage />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/create"
              element={
                <RequireAuth>
                  <>
                    <CharacterCreator mode={'create'} />{' '}
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/character/:id"
              element={
                <RequireAuth>
                  <>
                    <CharacterSheet />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/character/:id/level-up"
              element={
                <RequireAuth>
                  <>
                    <LevelUp />{' '}
                  </>
                </RequireAuth>
              }
            />
          </Routes>
          {/* <TestSupabaseConnection /> */}
        </main>
      </Router>
    </LanguageProvider>
  );
}

export default App;
