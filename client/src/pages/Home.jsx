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
          <div key={incident.id} className="col-md-6">
            <div className="incident-card">
              <h5>{incident.title}</h5>
              <p className="incident-meta">{incident.location}</p>
              <p>{incident.description.slice(0, 100)}...</p>
              <Link to={`/incident/${incident.id}`} className="btn btn-outline-primary btn-sm">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;