import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { CharacterSheet } from '@/pages/CharacterSheetPage';
import CharacterLevelUpPage from '@/pages/LevelUpPage';
import { LoginPage } from '@/pages/LoginPage';
import { RequireAuth } from '@/components/Auth/RequireAuth';
import { Header } from '@/components/Layout/Header';
import { LanguageProvider } from '@/context/LanguageContext';
import LandingPage from '@/pages';
import DashboardPage from '@/pages/DashboardPage';
import CreateCampaign from '@/pages/CreateCampaignPage';
import CampaignPage from '@/pages/CampaignPage';
import CreateCharacter from '@/pages/CreateCharacterPage';
import CampaignHandbookPage from '@/pages/CampaignHandbookPage';

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
                    <CreateCampaign />
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
              path="/campaign/:id/create-character"
              element={
                <RequireAuth>
                  <>
                    <CreateCharacter />
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
                    <CharacterLevelUpPage />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/campaign/:id/handbook"
              element={
                <RequireAuth>
                  <>
                    <CampaignHandbookPage />
                  </>
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </Router>
    </LanguageProvider>
  );
}

export default App;
