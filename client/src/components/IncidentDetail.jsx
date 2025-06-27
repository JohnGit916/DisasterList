import React, { useEffect, useState } from 'react';
import OfferForm from './OfferForm';

const IncidentDetail = ({ incidentId, onBack }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = () => {
    if (!incidentId) return;

    fetch(`http://localhost:5000/incidents/${incidentId}/offers`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch offers:', err);
        setError('Failed to load offers');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOffers();
  }, [incidentId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <button
          onClick={onBack}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4 text-blue-900">
          Offers for Incident #{incidentId}
        </h2>

        {loading && <p className="text-gray-500">Loading offers...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && offers.length === 0 && (
          <p className="text-gray-500">No offers yet for this incident.</p>
        )}

        <ul className="space-y-4 mb-6">
          {offers.map((offer) => (
            <li key={offer.id} className="p-4 border rounded bg-gray-50">
              <p className="text-gray-800">{offer.message}</p>
              <p className="text-sm text-gray-500 mt-1">👤 User ID: {offer.user_id}</p>
            </li>
          ))}
        </ul>

        {/* ✅ Add Offer Form */}
        <OfferForm incidentId={incidentId} onOfferSubmitted={fetchOffers} />
      </div>
    </div>
  );
};

export default IncidentDetail;
