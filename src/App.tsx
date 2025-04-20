import { LanguageToggle } from './components/LanguageToggle';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';
import { CharacterCreator } from './pages/CharacterCreator';

function App() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
        <LanguageToggle />
        <div className="w-full max-w-screen-md">
          <CharacterCreator mode="create" />
        </div>
      </main>
    </LanguageProvider>
  );
}

export default App;
