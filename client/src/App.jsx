import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReportIncident from './pages/ReportIncident';
import IncidentDetails from './pages/IncidentDetails';
import Dashboard from './pages/Dashboard';
import MyResponses from './pages/MyResponses';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/report" element={<PrivateRoute><ReportIncident /></PrivateRoute>} />
          <Route path="/incident/:id" element={<PrivateRoute><IncidentDetails /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/my-responses" element={<PrivateRoute><MyResponses /></PrivateRoute>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
