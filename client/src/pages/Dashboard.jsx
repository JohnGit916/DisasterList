import { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchWithToken('/incidents').then(data => {
      const userId = localStorage.getItem('token'); // simplistic check
      setIncidents(data.filter(i => i.user_id));
    });
  }, []);

  return (
    <div>
      <h2>My Reported Incidents</h2>
      <ul className="list-group">
        {incidents.map(incident => (
          <li key={incident.id} className="list-group-item">
            <Link to={`/incident/${incident.id}`}>{incident.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
