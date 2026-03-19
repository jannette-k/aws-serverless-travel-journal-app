import React, { useState } from 'react';

const TripForm = ({ trip, onSave, onCancel }) => {
  const [formData, setFormData] = useState(trip || {
    destination: '',
    date: '',
    notes: '',
    image_url: '',
    rating: 5,
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
        destination: formData.destination,
        date: formData.date,
        image_url: formData.image_url || formData.imageUrl || '',
        notes: formData.notes,
        rating: formData.rating,
        tags: formData.tags,
        TripID: formData.TripID,
      // ...formData,
      // id: formData.id || Date.now()
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="trip-form-overlay">
      <div className="trip-form-container">
        <div className="trip-form-header">
          <h2>{formData.TripID ? 'Edit Trip' : 'New Trip'}</h2>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="trip-form">
          <div className="form-group">
            <label htmlFor="destination">Destination *</label>
            <input
              id="destination"
              name="destination"
              type="text"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Paris, France"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <small>Paste an image URL from Unsplash or other source</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>
                  {'⭐'.repeat(num)} ({num}/5)
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Write about your experience..."
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tag-input-container">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button type="button" className="btn-add-tag" onClick={addTag}>
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="trip-tags">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {formData.TripID ? 'Update Trip' : 'Add Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;