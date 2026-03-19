import React, { useState } from 'react';
import TripCard from '../components/TripCard';

const TripList = ({ trips, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.notes.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="trip-list-container">
      <div className="trip-list-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {filteredTrips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>No trips yet</h3>
          <p>Start documenting your adventures by adding your first trip</p>
        </div>
      ) : (
        <div className="trip-grid">
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;