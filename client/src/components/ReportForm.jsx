import React, { useState } from 'react';

const ReportForm = ({ onIncidentReported }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to report an incident.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Incident reported successfully!');
        setFormData({ title: '', description: '', location: '' });
        if (onIncidentReported) onIncidentReported();
      } else {
        setError(data.error || 'Failed to report incident');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Report an Incident</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Incident
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
