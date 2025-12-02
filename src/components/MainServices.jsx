import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import servicesData from './Data_Services'
import './services.css'

const toSlug = str => {
  if (!str) return ''
  return String(str)
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(`/[^a-z0-9-]/g`, '')
    .replace(/-+/g, '-')
}

export const MainServices = () => {
  const navigate = useNavigate();
  const hanService = (e) => {
    navigate(e);
  }
  const [services] = useState(servicesData)

  return (
    <div id='services' className="main-services-container">
      <h1>Main Services</h1>

      <div className="services-list">
        {services.map(s => (
          <div key={s.id} onClick={() => {hanService(`/services/${toSlug(s.id)}`)}} className="service-card">
            <div className="service-title">{s.title}</div>
            <div className="service-overview">{s.overview}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainServices
