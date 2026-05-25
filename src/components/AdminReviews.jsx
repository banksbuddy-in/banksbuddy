import React, { useState, useEffect } from "react";
import apiFetch from "../lib/api.js";
import "./AddCareer.css";
import { useNavigate } from "react-router-dom";
import { useToast, useConfirm } from "../context/ToastContext";

export const AdminReviews = ({ embedded = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await apiFetch("/api/reviews");
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !review) {
      toast.error("Please provide name and review text.");
      return;
    }
    try {
      if (editingId) {
        await apiFetch(`/api/reviews/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ name, review }),
        });
        toast.success("Review updated successfully.");
        setEditingId(null);
      } else {
        await apiFetch("/api/reviews", {
          method: "POST",
          body: JSON.stringify({ name, review }),
        });
        toast.success("Review submitted successfully.");
      }
      setName("");
      setReview("");
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    }
  };

  const handleEdit = (reviewItem) => {
    setName(reviewItem.name);
    setReview(reviewItem.review);
    setEditingId(reviewItem.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm("Are you sure you want to delete this review?");
    if (!isConfirmed) return;
    try {
      await apiFetch(`/api/reviews/${id}`, { method: "DELETE" });
      toast.success("Review deleted successfully.");
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  const cancelEdit = () => {
    setName("");
    setReview("");
    setEditingId(null);
  };

  return (
    <div className={`add-career ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}
      <h2 className="ac-title">{editingId ? "Edit Review" : "Add Review"}</h2>

      <form className="ac-form" onSubmit={handleSubmit}>
        <label className="ac-label">Name</label>
        <input
          className="ac-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="ac-label">Review</label>
        <textarea
          className="ac-textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="ac-button" type="submit">
            {editingId ? "Update" : "Submit"} Review
          </button>
          {editingId && (
            <button className="btn" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="ac-title" style={{ marginTop: "2rem" }}>
        All Reviews ({reviews.length})
      </h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="review-card"
              style={{
                background: "#f8f9fa",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: "1px solid #ddd",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0" }}>{item.name}</h4>
              <p style={{ margin: "0 0 1rem 0", color: "#555" }}>
                {item.review}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#ffc107",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
