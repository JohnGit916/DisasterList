import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://disasterlist-backend.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);

      // Decode token and store username
      try {
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        if (payload.username) {
          localStorage.setItem('username', payload.username);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }

      navigate('/');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ minWidth: '350px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" className="form-control mb-3" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
          <input type="password" className="form-control mb-3" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
