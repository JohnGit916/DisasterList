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
    const res = await fetchWithToken(`/offers/${offerId}`, 'PUT', { status: 'accepted' });
    console.log("ACCEPT RESPONSE:", res);

    if (res && res.status && res.status.toLowerCase() === 'accepted') {
      fetchData();
    } else {
      alert(res.error || 'Failed to update offer status');
    }
  };

  const handleDeleteIncident = async () => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      await fetchWithToken(`/incidents/${incident.id}`, 'DELETE');
      window.location.href = '/dashboard';
    }
  };

  if (!incident) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Incident Details</h1>
      <div className="incident-detail p-4 bg-light rounded shadow-sm">
        <h2>{incident.title}</h2>
        <p>{incident.description}</p>
        <p className="text-muted mb-2">
          📍 {incident.location} &nbsp;|&nbsp; 👤 Reported by User #{incident.user_id}
        </p>
        {incident.created_at && (
          <p className="text-muted small">
            📅 Reported on: {new Date(incident.created_at).toLocaleString()}
          </p>
        )}

        <h4 className="mt-4">Offers</h4>
        {offers.length === 0 ? (
          <p className="text-muted">No offers yet.</p>
        ) : (
          <ul className="list-group">
            {offers.map((offer) => (
              <li
                key={offer.id}
                className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row"
              >
                <div>
                  <p className="mb-1">💬 {offer.message}</p>
                  <small className="text-muted">
                    👤 User #{offer.user_id} &nbsp;|&nbsp; Status: <em>{offer.status}</em>
                  </small>
                </div>

                <div className="mt-2 mt-md-0">
                  {offer.status === 'pending' && incident.user_id === currentUserId && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleAccept(offer.id)}
                    >
                      Accept
                    </button>
                  )}
                  {offer.user_id === currentUserId && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteOffer(offer.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {incident.user_id !== currentUserId ? (
          <form onSubmit={handleOfferSubmit} className="mt-4">
            <textarea
              className="form-control mb-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Offer help..."
              required
            ></textarea>
            <button className="btn btn-primary" type="submit">
              Send Offer
            </button>
          </form>
        ) : (
          <>
            <p className="text-muted mt-4">
              <em>You reported this incident. You can manage incoming offers above.</em>
            </p>
            <button
              className="btn btn-outline-danger mt-2"
              onClick={handleDeleteIncident}
            >
              Delete This Incident
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default IncidentDetails;
