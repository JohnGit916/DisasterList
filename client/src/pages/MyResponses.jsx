import { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';
import { Link } from 'react-router-dom';

function MyResponses() {
  const [offers, setOffers] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const fetchedOffers = await fetchWithToken('/offers');
    const allIncidents = await fetchWithToken('/incidents');
    setOffers(fetchedOffers);
    setIncidents(allIncidents);
  };

  const getIncident = (incident_id) =>
    incidents.find((i) => i.id === incident_id);

  return (
    <div className="container">
      <h2 className="mb-4">My Offers</h2>
      {offers.length === 0 ? (
        <p className="text-muted">You haven't submitted any offers yet.</p>
      ) : (
        <ul className="list-group">
          {offers.map((offer) => {
            const incident = getIncident(offer.incident_id);
            return (
              <li key={offer.id} className="list-group-item response-card">
                {incident ? (
                  <>
                    <Link to={`/incident/${incident.id}`} className="fw-bold text-decoration-none">
                      {incident.title} — {incident.location}
                    </Link>
                    <p className="mb-1">{offer.message}</p>
                    <small className="text-muted">Status: <em>{offer.status}</em></small>
                  </>
                ) : (
                  <p className="text-muted">Incident not found for offer ID {offer.id}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyResponses;
