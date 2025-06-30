import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://disasterlist-backend.onrender.com/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } else alert(data.error);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h2>Signup</h2>
      <input name="username" className="form-control mb-2" placeholder="Username" onChange={handleChange} required />
      <input name="email" className="form-control mb-2" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" className="form-control mb-2" placeholder="Password" onChange={handleChange} required />
      <button type="submit" className="btn btn-primary">Signup</button>
    </form>
  );
}

export default Signup;