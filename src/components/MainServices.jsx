import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import './services.css'
import { specSv } from './Data_Special'
import NewServices from './Data_Services'

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
  const [services] = useState(NewServices)

  return (
    <div id='services' className="main-services-container">
      <h1>Loan Services</h1>

      <div className="services-list">
        {services.map(s => (
          <div key={s.id} onClick={() => {hanService(`/services/${toSlug(s.id)}`)}} className="service-card">
            {
              s.image.endsWith('.mp4') ? (
                <video src={s.image} autoPlay muted loop/>
              ): (
                <img src={s.image} alt={s.Title} />
              )
            }
            {/* <img src={s.svimage} alt={s.title} /> */}
            <div className="service-title">{s.Title}</div>
            <div className="service-overview">{s.overview[2]}</div>
          </div>
        ))}
      </div>

      <hr />
      <h1>Core Services</h1>
      <div className="services-list spec">
        {
          specSv.map((s, index) => (
            <div key={index} className="service-card spec" onClick={() => {hanService(s.URL)}}>
              <img src={s.smg}  alt={s.title} />
              <div className="service-title">{s.title}</div>
              <div className="service-overview">{s.overview}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MainServices
