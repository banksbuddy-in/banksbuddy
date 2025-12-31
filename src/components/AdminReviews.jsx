import React, { useState } from 'react'
import { db } from '../firebase'
import { ref, push } from 'firebase/database'
import './AddCareer.css'
import { useNavigate } from 'react-router-dom'

export const AdminReviews = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('')
  const [review, setReview] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!name || !review) {
      setStatus('Please provide name and review text.')
      return
    }
    const payload = {
      name,
      review,
      createdAt: new Date().toISOString(),
    }

    try {
      await push(ref(db, 'reviews'), payload)
      setStatus('Review submitted successfully.')
      setName('')
      setReview('')
    } catch (err) {
      console.error(err)
      setStatus('Failed to submit review.')
    }
  }
  const n = useNavigate();
  return (
    <div className="add-career">
      <button className="back-btn" onClick={() => navigate('/admin')}>← Back to Admin</button>
      <h2 className="ac-title">Add Review</h2>

      <form className="ac-form" onSubmit={handleSubmit}>
        <label className="ac-label">Name</label>
        <input className="ac-input" value={name} onChange={e => setName(e.target.value)} required />

        <label className="ac-label">Review</label>
        <textarea className="ac-textarea" value={review} onChange={e => setReview(e.target.value)} required />

        <button className="ac-button" type="submit">Submit Review</button>
         <button className="btn" onClick={() => n("/admin")}>
          Back to Admin
        </button>
      </form>

      {status && <p className="ac-status">{status}</p>}
    </div>
  )
}

export default AdminReviews
