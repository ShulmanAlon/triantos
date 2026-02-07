import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { RequireAuth } from '@/components/Auth/RequireAuth';
import { Header } from '@/components/Layout/Header';
import { LanguageProvider } from '@/context/LanguageContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';

const LandingPage = lazy(() => import('@/pages'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const CreateCampaign = lazy(() => import('@/pages/CreateCampaignPage'));
const CampaignPage = lazy(() => import('@/pages/CampaignPage'));
const CreateCharacter = lazy(() => import('@/pages/CreateCharacterPage'));
const CharacterSheet = lazy(() => import('@/pages/CharacterSheetPage'));
const CharacterLevelUpPage = lazy(() => import('@/pages/LevelUpPage'));
const CampaignHandbookPage = lazy(() => import('@/pages/CampaignHandbookPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));

const LoadingFallback = () => (
  <div className="p-4 text-sm text-(--muted)">Loading…</div>
);

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Router>
          {/* TODO: Add dedicated mobile layout support. */}
          <main className="w-full max-w-6xl mx-auto px-5 pb-12">
            <Header />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/create-campaign"
                  element={
                    <RequireAuth>
                      <CreateCampaign />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/campaign/:id"
                  element={
                    <RequireAuth>
                      <CampaignPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/campaign/:id/create-character"
                  element={
                    <RequireAuth>
                      <CreateCharacter />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/character/:id"
                  element={
                    <RequireAuth>
                      <CharacterSheet />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/character/:id/level-up"
                  element={
                    <RequireAuth>
                      <CharacterLevelUpPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/campaign/:id/handbook"
                  element={
                    <RequireAuth>
                      <CampaignHandbookPage />
                    </RequireAuth>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <ToastContainer />
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
