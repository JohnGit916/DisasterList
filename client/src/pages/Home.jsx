import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithToken } from '../utils/api';

function Home() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchWithToken('/incidents')
      .then(data => setIncidents(data));
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Reported Incidents</h2>
      <div className="row">
        {incidents.map((incident) => (
          <div key={incident.id} className="col-md-6 mb-4">
            <div className="incident-card p-3 border rounded shadow-sm h-100">
              <h5 className="mb-2">{incident.title}</h5>
              <p className="text-muted small mb-1">
                📍 {incident.location} &nbsp;|&nbsp; 👤 User #{incident.user_id}
              </p>
              <p>{incident.description.slice(0, 100)}...</p>
              <Link to={`/incident/${incident.id}`} className="btn btn-outline-primary btn-sm mt-2">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
