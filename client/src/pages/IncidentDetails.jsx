import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';

function IncidentDetails() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchData();
    decodeToken();
  }, []);

  const fetchData = async () => {
    const inc = await fetchWithToken(`/incidents/${id}`);
    const res = await fetchWithToken(`/offers?incident_id=${id}`);
    setIncident(inc);
    setOffers(res);
  };

  const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(parseInt(payload.sub || payload.user_id || payload.identity || payload.id));
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  };

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
    <div className="container">
      <div className="incident-detail">
        <h2>{incident.title}</h2>
        <p>{incident.description}</p>
        <p className="location">Location: {incident.location}</p>

        <h4 className="mt-4">Offers</h4>
        <ul className="list-unstyled">
          {offers.map((offer) => (
            <li key={offer.id} className="offer-item">
              <span>{offer.message} - <em>{offer.status}</em></span>
              <span>
                {/* Only the incident reporter can accept offers */}
                {offer.status === 'pending' && incident.user_id === currentUserId && (
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleAccept(offer.id)}>Accept</button>
                )}

                {/* Only the offer creator can delete their own offer */}
                {offer.user_id === currentUserId && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOffer(offer.id)}>Delete</button>
                )}
              </span>
            </li>
          ))}
        </ul>

        {incident.user_id !== currentUserId ? (
          <form onSubmit={handleOfferSubmit} className="mt-4">
            <textarea className="form-control mb-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Offer help..." required></textarea>
            <button className="btn btn-primary" type="submit">Send Offer</button>
          </form>
        ) : (
          <p className="text-muted mt-4"><em>You reported this incident. You can manage incoming offers above.</em></p>
        )}
      </div>
    </div>
  );
}

export default IncidentDetails;
