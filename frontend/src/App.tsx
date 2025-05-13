import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  );
}

export default App;
