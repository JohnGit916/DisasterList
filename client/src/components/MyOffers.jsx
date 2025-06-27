// File: src/components/MyOffers.jsx
import React, { useEffect, useState } from 'react';

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyOffers = () => {
    // You can mock user ID 1 for now, or fetch based on token later
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/offers', {
      headers: {
        Authorization: `Bearer ${token}`, // backend should decode user
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setOffers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load your offers.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMyOffers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">My Offers</h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && offers.length === 0 && (
          <p className="text-gray-500">You haven't submitted any offers yet.</p>
        )}

        <ul className="space-y-4">
          {offers.map(offer => (
            <li key={offer.id} className="p-4 border rounded bg-gray-50">
              <p className="text-gray-800">{offer.message}</p>
              <p className="text-sm text-gray-500">Incident ID: {offer.incident_id}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyOffers;
