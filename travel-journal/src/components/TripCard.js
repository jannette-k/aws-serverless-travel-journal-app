import React, { useState } from 'react';

const TripCard = ({ trip, onEdit, onDelete }) => {
  console.log("trip image_url:", trip.image_url);
  console.log("full trip:", trip);

  const [imageError, setImageError] = useState(false);
  
  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop';
  const image_url = imageError ? defaultImage : (trip.image_url || defaultImage);

  return (
    <div className="trip-card">
      <div className="trip-card-image">
        <img 
          src={image_url} 
          alt={trip.destination}
          onError={() => setImageError(true)}
        />
        <div className="trip-card-overlay">
          <h3>{trip.destination}</h3>
        </div>
      </div>
      
      <div className="trip-card-content">
        <div className="trip-card-header">
          <span className="trip-date">{trip.date}</span>
          {trip.rating && (
            <span className="trip-rating">
              {'⭐'.repeat(trip.rating)}
            </span>
          )}
        </div>
        
        <p className="trip-notes">{trip.notes}</p>
        
        {trip.tags && trip.tags.length > 0 && (
          <div className="trip-tags">
            {trip.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="trip-card-actions">
          <button className="btn-secondary" onClick={() => onEdit(trip)}>
            Edit
          </button>
          <button className="btn-danger" onClick={() => onDelete(trip.TripID)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;