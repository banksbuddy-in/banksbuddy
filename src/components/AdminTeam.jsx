import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../lib/api.js";
import "./AdminTeam.css";
import { useToast, useConfirm } from "../context/ToastContext";

export const AdminTeam = ({ embedded = false }) => {
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const data = await apiFetch("/api/team");
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !role || !image) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      if (editingId) {
        // Update existing member
        await apiFetch(`/api/team/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ name, role, image }),
        });
        toast.success("Team member updated successfully!");
      } else {
        // Create new member
        const memberId = Date.now().toString();
        await apiFetch(`/api/team/${memberId}`, {
          method: "POST",
          body: JSON.stringify({ name, role, image }),
        });
        toast.success("Team member added successfully!");
      }
      resetForm();
      fetchTeamMembers();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Error saving team member");
    }
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setImage("");
    setEditingId(null);
  };

  const handleEdit = (member) => {
    setName(member.name);
    setRole(member.role);
    setImage(member.image);
    setEditingId(member.id);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm("Are you sure you want to delete this team member?");
    if (!isConfirmed) return;
    try {
      await apiFetch(`/api/team/${id}`, { method: "DELETE" });
      toast.success("Team member deleted successfully!");
      fetchTeamMembers();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Error deleting team member");
    }
  };

  return (
    <div id="admin-team" className={embedded ? "embedded" : ""}>
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}
      <h1>Team Management</h1>
      <div className="team-container">
        <div className="team-form">
          <h2>{editingId ? "Edit" : "Add"} Member</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Preview" className="preview" />}
            <div className="form-btns">
              <button type="submit">{editingId ? "Update" : "Add"}</button>
              {editingId && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="team-list">
          <h2>Team Members ({teamMembers.length})</h2>
          {teamMembers.map((member) => (
            <div key={member.id} className="member-card">
              <img src={member.image} alt={member.name} />
              <div className="member-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <div className="member-btns">
                <button onClick={() => handleEdit(member)}>Edit</button>
                <button onClick={() => handleDelete(member.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
