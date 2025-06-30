import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithToken } from '../utils/api';

function Home() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchWithToken('/incidents').then(setIncidents);
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Reported Incidents</h2>
      {incidents.length === 0 ? (
        <p className="text-muted">No incidents have been reported yet.</p>
      ) : (
        <div className="row">
          {incidents.map((incident) => (
            <div key={incident.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{incident.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    📍 {incident.location || 'Unknown'} &nbsp;|&nbsp; 👤 User #{incident.user_id}
                  </h6>
                  {incident.created_at && (
                    <p className="text-muted small mb-1">
                      🕒 {new Date(incident.created_at).toLocaleString()}
                    </p>
                  )}
                  <p className="card-text">
                    {incident.description?.slice(0, 100)}...
                  </p>
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

export default Home;
