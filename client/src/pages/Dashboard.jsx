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
    <div className="container py-4">
      <h2 className="mb-4">My Reported Incidents</h2>
      {filteredIncidents.length === 0 ? (
        <p className="text-muted">You haven't reported any incidents yet.</p>
      ) : (
        <div className="row">
          {filteredIncidents.map((incident) => (
            <div key={incident.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{incident.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    📍 {incident.location || 'Unknown'}<br />
                    🧑‍💼 User #{incident.user_id}
                  </h6>
                  <p className="card-text">
                    {incident.description?.slice(0, 100)}...
                  </p>
                  {incident.created_at && (
                    <p className="text-muted small mb-2">
                      🕒 {new Date(incident.created_at).toLocaleString()}
                    </p>
                  )}
                  <Link
                    to={`/incident/${incident.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
