import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../lib/api.js";
import "./AdminOffers.css";

export const AdminOffers = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [offerName, setOfferName] = useState("");
  const [offerImage, setOfferImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const data = await apiFetch("/api/offers");
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      alert("Error fetching offers");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOfferImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addOffer = async (e) => {
    e.preventDefault();
    if (offers.length >= 2) {
      alert("Maximum 2 offers allowed. Please delete an existing offer first.");
      return;
    }
    if (!offerName || !offerImage) {
      alert("Please provide both offer name and image");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/offers", {
        method: "POST",
        body: JSON.stringify({ name: offerName, image: offerImage }),
      });
      alert("Offer added successfully!");
      setOfferName("");
      setOfferImage("");
      fetchOffers();
    } catch (error) {
      console.error("Error adding offer:", error);
      alert("Error adding offer");
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await apiFetch(`/api/offers/${offerId}`, { method: "DELETE" });
      alert("Offer deleted successfully!");
      fetchOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Error deleting offer");
    }
  };

  return (
    <div id="admin-offers" className={embedded ? "embedded" : ""}>
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}
      <h1>Manage Offers</h1>
      <p className="info-text">Maximum 2 offers allowed</p>
      <div className="admin-offers-container">
        <div className="add-offer-form">
          <h2>Add New Offer</h2>
          <form onSubmit={addOffer}>
            <div className="form-group">
              <label>Offer Name:</label>
              <input
                type="text"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                placeholder="Enter offer name"
                required
              />
            </div>
            <div className="form-group">
              <label>Offer Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              {offerImage && (
                <div className="image-preview">
                  <img src={offerImage} alt="Preview" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || offers.length >= 2}
            >
              {loading ? "Adding..." : "Add Offer"}
            </button>
          </form>
        </div>
        <div className="offers-list">
          <h2>Current Offers ({offers.length}/2)</h2>
          {offers.length === 0 ? (
            <p>No offers added yet</p>
          ) : (
            <div className="offers-grid">
              {offers.map((offer) => (
                <div key={offer.id} className="offer-item">
                  <img src={offer.image} alt={offer.name} />
                  <h3>{offer.name}</h3>
                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
