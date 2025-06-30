import { Link } from 'react-router-dom';

function IncidentCard({ incident }) {
  return (
    <div className="incident-card">
      <h5>{incident.title}</h5>
      <p className="incident-meta">
        📍 {incident.location} &nbsp;|&nbsp; 👤 User #{incident.user_id}
      </p>
      <p>{incident.description?.slice(0, 100)}...</p>
      <Link to={`/incident/${incident.id}`} className="btn btn-outline-primary btn-sm mt-2">
        View Details
      </Link>
    </div>
  );
}

export default IncidentCard;
