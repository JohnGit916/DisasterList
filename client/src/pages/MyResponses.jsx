import { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';

function MyResponses() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchWithToken('/offers').then(setOffers);
  }, []);

  return (
    <div>
      <h2>My Offers</h2>
      <ul className="list-group">
        {offers.map(offer => (
          <li key={offer.id} className="list-group-item">
            {offer.message} - <em>{offer.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyResponses;