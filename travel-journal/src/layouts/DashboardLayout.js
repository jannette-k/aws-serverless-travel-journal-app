import React, { useState, useEffect } from 'react';
import TripList from '../pages/TripList';
import TripForm from '../components/TripForm';
import { fetchTrips, addTripApi, updateTripApi, deleteTripApi } from '../api/trips';

const DashboardLayout = ({ onLogout }) => {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);
        const data = await fetchTrips();
        console.log("trips from DB:", data);
        Array.isArray(data) ? setTrips(data) : setTrips([]);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  const handleSaveTrip = async (trip) => {
    try {
      if (trip.TripID) {
        await updateTripApi(trip.TripID, trip);
        setTrips(trips.map(t => t.TripID === trip.TripID ? { ...t, ...trip } : t));
      } else {
        const response = await addTripApi(trip);
        console.log("Full response:", response);      // 👈 add this
        console.log("response.trip:", response.trip); // 👈 and this
        setTrips([...trips, response.trip]);
      }
      setShowForm(false);
      setEditingTrip(null);
    } catch (err) {
      console.error("API error:", err);
      alert("Error saving trip. Check console for details.");
    }
  };


  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await deleteTripApi(id);
      setTrips(trips.filter(t => t.TripID !== id));
    } catch (err) {
      console.error("API error:", err);
      alert("Error deleting trip. Check console for details.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>✈️ My Travel Journal</h1>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Add Trip
            </button>
            <button className="btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {loading ? (
          <p>Loading trips...</p>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-value">{trips.length}</div>
                <div className="stat-label">Total Trips</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {new Set(trips.map(t => t.destination.split(',')[1]?.trim() || t.destination)).size}
                </div>
                <div className="stat-label">Countries</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {trips.length > 0
                    ? (trips.reduce((sum, t) => sum + (t.rating || 0), 0) / trips.length).toFixed(1)
                    : 0}
                </div>
                <div className="stat-label">Avg Rating</div>
              </div>
            </div>

            <TripList
              trips={trips}
              onEdit={handleEditTrip}
              onDelete={handleDeleteTrip}
            />
          </>
        )}
      </main>

      {showForm && (
        <TripForm
          trip={editingTrip}
          onSave={handleSaveTrip}
          onCancel={handleCancel}
        />
      )}
    </div>
  ); // 👈 closes return
}; // 👈 closes the component — this was missing

export default DashboardLayout;