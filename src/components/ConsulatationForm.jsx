import React, { useState } from 'react'
import { db } from '../firebase'
import { ref, push } from 'firebase/database'
import './AddCareer.css'

export const ConsulatationForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      reason,
      createdAt: new Date().toISOString(),
    }

    try {
      await push(ref(db, 'consultations'), payload)
      setStatus('Request submitted — we will contact you soon.')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setReason('')
    } catch (err) {
      console.error(err)
      setStatus('Failed to submit request. Please try again later.')
    }
  }

  return (
    <div className="add-career">
      <h2 className="ac-title">Request a Consultation</h2>

      <form className="ac-form" onSubmit={handleSubmit}>
        <label className="ac-label">First Name</label>
        <input className="ac-input" value={firstName} onChange={e => setFirstName(e.target.value)} required />

        <label className="ac-label">Last Name</label>
        <input className="ac-input" value={lastName} onChange={e => setLastName(e.target.value)} required />

        <label className="ac-label">Email</label>
        <input className="ac-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label className="ac-label">Contact Number</label>
        <input className="ac-input" value={phone} onChange={e => setPhone(e.target.value)} required />

        <label className="ac-label">Reason for Consultation</label>
        <textarea className="ac-textarea" value={reason} onChange={e => setReason(e.target.value)} required />

        <button className="ac-button" type="submit">Send Request</button>
      </form>

      {status && <p className="ac-status">{status}</p>}
    </div>
  )
}

export default ConsulatationForm