import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import apiFetch from "../lib/api.js";
import { FaStar, FaArrowLeft, FaCheckCircle, FaSpinner } from "react-icons/fa";
import "./FeedbackForm.css";

export const FeedbackForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in both Name and Message.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          review: message.trim(),
          rating: rating,
        }),
      });

      setSubmitted(true);
      toast.success("Thank you! Review submitted successfully.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fb-success-container">
        <div className="fb-success-card">
          <div className="fb-success-icon-wrapper">
            <FaCheckCircle className="fb-success-icon animate-pop" />
          </div>
          <h2 className="fb-success-title">Feedback Submitted!</h2>
          <p className="fb-success-text">
            Thank you, <strong>{name}</strong>! Your review has been saved and will be featured on our testimonials section soon.
          </p>
          <div className="fb-success-actions">
            <button className="fb-btn-primary" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <button className="fb-btn-secondary" onClick={() => {
              setSubmitted(false);
              setName("");
              setMessage("");
              setRating(5);
            }}>
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-page-container">
      <div className="fb-card-wrapper">
        <button className="fb-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft style={{ marginRight: "8px" }} /> Back
        </button>

        <div className="fb-grid-single">
          {/* Form Column */}
          <div className="fb-form-col">
            <div className="fb-form-header">
              <h2>Share Your Review</h2>
              <p>Let us know how BanksBuddy helped you achieve your financial goals.</p>
            </div>

            <form className="fb-form" onSubmit={handleSubmit}>
              {/* Rating selection */}
              <div className="fb-form-group">
                <label className="fb-label">Overall Rating</label>
                <div className="fb-stars-wrapper">
                  {[...Array(5)].map((_, index) => {
                    const starVal = index + 1;
                    return (
                      <button
                        type="button"
                        key={index}
                        className={`fb-star-btn ${
                          starVal <= (hoverRating || rating) ? "active" : ""
                        }`}
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        aria-label={`Rate ${starVal} Star${starVal > 1 ? "s" : ""}`}
                      >
                        <FaStar />
                      </button>
                    );
                  })}
                  <span className="fb-rating-text">
                    {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                  </span>
                </div>
              </div>

              {/* Name field */}
              <div className="fb-form-group">
                <label className="fb-label" htmlFor="fb-name">
                  Full Name
                </label>
                <input
                  id="fb-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="fb-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Message field */}
              <div className="fb-form-group">
                <label className="fb-label" htmlFor="fb-message">
                  Your Experience / Message
                </label>
                <textarea
                  id="fb-message"
                  placeholder="Write your detailed experience here..."
                  className="fb-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="fb-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" style={{ marginRight: "8px" }} />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
