import { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    decodeToken();
    fetchData();
  }, []);

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

  const fetchData = async () => {
    const allIncidents = await fetchWithToken('/incidents');
    setIncidents(allIncidents);
  };

  const filteredIncidents = incidents.filter(
    (incident) => incident.user_id === currentUserId
  );

  return (
    <div className="container">
      <h2 className="mb-4">My Reported Incidents</h2>
      {filteredIncidents.length === 0 ? (
        <p className="text-muted">You haven't reported any incidents yet.</p>
      ) : (
        <ul className="list-group">
          {filteredIncidents.map((incident) => (
            <li key={incident.id} className="list-group-item dashboard-card">
              <Link to={`/incident/${incident.id}`} className="fw-bold text-decoration-none">
                {incident.title}
              </Link>
              <p className="mb-0 text-muted small">📍 {incident.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
