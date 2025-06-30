import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../utils/api';

function ReportIncident() {
  const [formData, setFormData] = useState({ title: '', description: '', location: '' });
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchWithToken('/incidents', 'POST', formData);
    if (res.id) navigate(`/incident/${res.id}`);
    else alert(res.error);
  };

  return (
    <div>
      <h2>Report New Incident</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <input type="text" name="title" placeholder="Title" required className="form-control mb-2" onChange={handleChange} />
        <textarea name="description" placeholder="Description" required className="form-control mb-2" onChange={handleChange}></textarea>
        <input type="text" name="location" placeholder="Location" required className="form-control mb-2" onChange={handleChange} />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default ReportIncident;