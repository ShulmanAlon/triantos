import './index.css';
import { CharacterCreator } from './pages/CharacterCreator';

function App() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-screen-md">
        <CharacterCreator mode="create" />
      </div>
    </main>
  );
}

export default App;
