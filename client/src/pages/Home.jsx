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
    <div>
      <h2>Reported Incidents</h2>
      <div className="list-group">
        {incidents.map(incident => (
          <Link key={incident.id} to={`/incident/${incident.id}`} className="list-group-item list-group-item-action">
            <strong>{incident.title}</strong><br />
            <small>{incident.location}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;