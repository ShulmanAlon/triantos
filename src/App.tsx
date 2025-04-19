import './index.css';
import { CharacterCreator } from './pages/CharacterCreator';

function App() {
  return (
    <main className="w-full max-w-screen-md mx-auto p-4">
      <CharacterCreator mode={'create'} />
    </main>
    // <div className="text-red-600 font-bold text-xl">
    //   If this is red, Tailwind is working 🎉
    // </div> //TODO: remove after tailwind fix
  );
}

export default App;
