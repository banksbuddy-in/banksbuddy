import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Admin = () => {
    const nv = useNavigate();
    function Adm (e) {
        nv(e);
    }
  return (
   <div id="admin">
        <h1>Admin Page</h1>
        <div className="admmn">
            <button onClick={() => {Adm("/admin-career")}}>Careers Page</button>
            <button onClick={() => {Adm("/admin-table")}}>Consultation Page</button>
            <button onClick={() => {Adm("/admin-reviews")}}>Testimonials Page</button>
            <button onClick={() => {Adm("/udc")}}>Review Page</button>
        </div>
   </div>
  )
}
