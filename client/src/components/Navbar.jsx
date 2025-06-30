import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [username, setUsername] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload.username || payload.sub || payload.identity || payload.user_id;
        setUsername(name);
        localStorage.setItem('username', name); // Backup
      } catch (err) {
        console.error("Failed to decode token", err);
        setUsername(localStorage.getItem("username"));
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">DisasterLink</Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav align-items-center">
          {token ? (
            <>
              <li className="nav-item me-3 text-light">
                <span role="img" aria-label="user">👤</span> <strong>{username}</strong>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/report">Report</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/my-responses">My Offers</Link></li>
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-light ms-2" onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
