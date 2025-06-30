import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';

function IncidentDetails() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    const inc = await fetchWithToken(`/incidents/${id}`);
    const res = await fetchWithToken(`/offers?incident_id=${id}`);
    setIncident(inc);
    setOffers(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchWithToken('/offers', 'POST', { message, incident_id: id });
    if (res.id) {
      setMessage('');
      fetchData();
    } else alert(res.error);
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Delete this offer?')) {
      await fetchWithToken(`/offers/${offerId}`, 'DELETE');
      fetchData();
    }
  };

  const handleAccept = async (offerId) => {
    await fetchWithToken(`/offers/${offerId}`, 'PUT', { status: 'accepted' });
    fetchData();
  };

  if (!incident) return <p>Loading...</p>;

  return (
    <div>
      <h2>{incident.title}</h2>
      <p>{incident.description}</p>
      <p><strong>Location:</strong> {incident.location}</p>

      <h4>Offers</h4>
      <ul className="list-group">
        {offers.map(offer => (
          <li key={offer.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{offer.message} - <em>{offer.status}</em></span>
            <span>
              {offer.status === 'pending' && (
                <button className="btn btn-success btn-sm me-2" onClick={() => handleAccept(offer.id)}>Accept</button>
              )}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOffer(offer.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleOfferSubmit} className="mt-4">
        <textarea className="form-control mb-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Offer help..." required></textarea>
        <button className="btn btn-primary" type="submit">Send Offer</button>
      </form>
    </div>
  );
}

export default IncidentDetails;
