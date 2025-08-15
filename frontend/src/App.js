import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeSubmit from './pages/ResumeSubmit';
import Shortlist from './pages/Shortlist';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/submit" element={<ResumeSubmit />} />
        <Route path="/shortlist" element={<Shortlist />} />
      </Routes>
    </Router>
  );
}

export default App;

