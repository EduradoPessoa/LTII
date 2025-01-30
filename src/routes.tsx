import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Conversation from './pages/Conversation';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/conversation" element={<Conversation />} />
    </Routes>
  );
}

export default AppRoutes;
