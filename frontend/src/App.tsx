import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
