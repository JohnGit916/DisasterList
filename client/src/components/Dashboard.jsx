import React, { useEffect, useState } from 'react';
import ReportForm from './ReportForm';
import IncidentDetail from './IncidentDetail';


const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const fetchIncidents = () => {
    fetch('http://localhost:5000/incidents')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched incidents:', data);
        setIncidents(data);
      })
      .catch(err => console.error('Failed to fetch incidents:', err));
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  if (selectedIncidentId) {
    return (
      <IncidentDetail
        incidentId={selectedIncidentId}
        onBack={() => setSelectedIncidentId(null)}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Reported Incidents</h1>

      {/* ✅ Show the report form once */}
      <ReportForm onIncidentReported={fetchIncidents} />

      {incidents.length === 0 ? (
        <p className="text-center text-gray-500">No incidents reported yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.map(incident => (
            <div key={incident.id} className="p-4 border rounded-lg shadow bg-white">
              <h2 className="text-xl font-semibold text-blue-900">{incident.title}</h2>
              <p className="text-gray-700 mt-1">{incident.description}</p>
              <p className="text-sm text-gray-500 mt-1">📍 {incident.location}</p>
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setSelectedIncidentId(incident.id)}
              >
                View Offers
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
