import React, { useState } from 'react';

const OfferForm = ({ incidentId, onOfferSubmitted }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('You must be logged in to make an offer.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/incidents/${incidentId}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('');
        setStatus('Offer submitted successfully!');
        onOfferSubmitted(); // refresh offers
      } else {
        setStatus(data.error || 'Failed to submit offer.');
      }
    } catch (err) {
      console.error('Error submitting offer:', err);
      setStatus('Server error.');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Submit an Offer to Help</h3>
      {status && <p className="mb-2 text-sm text-red-600">{status}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can you help?"
          rows="3"
        ></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Offer
        </button>
      </form>
    </div>
  );
};

export default OfferForm;
