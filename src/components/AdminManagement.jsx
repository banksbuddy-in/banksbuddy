import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, update } from 'firebase/database';
import { useAuth } from '../context/AuthContext';

export const AdminManagement = ({ embedded }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const { userRole, currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = [...users];

        // 1. Filter
        if (searchTerm.trim() !== '') {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(user =>
                (user.username && user.username.toLowerCase().includes(lowerTerm)) ||
                (user.email && user.email.toLowerCase().includes(lowerTerm))
            );
        }

        // 2. Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredUsers(result);
    }, [searchTerm, users, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const fetchUsers = async () => {
        try {
            const usersRef = ref(db, 'users');
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const usersList = Object.keys(usersData).map(key => ({
                    uid: key,
                    ...usersData[key]
                }));
                setUsers(usersList);
                setFilteredUsers(usersList);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    const toggleAdmin = async (uid, currentRole) => {
        const isRemovingAdmin = currentRole === 'admin';

        if (isRemovingAdmin) {
            // Prevent self-demotion
            if (uid === currentUser.uid) {
                alert("You cannot remove your own admin status.");
                return;
            }

            // Check total admin count
            const adminCount = users.filter(u => u.role === 'admin').length;
            if (adminCount <= 1) {
                alert("Cannot remove the last admin. There must be at least one admin.");
                return;
            }
        }

        const newRole = isRemovingAdmin ? 'user' : 'admin';
        try {
            await update(ref(db, `users/${uid}`), { role: newRole });
            // Optimistic update
            const updatedUsers = users.map(user =>
                user.uid === uid ? { ...user, role: newRole } : user
            );
            setUsers(updatedUsers);
            // filteredUsers will update via the useEffect dependency on 'users'
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role.");
        }
    };

    if (!embedded) {
        return (
            <div style={{ padding: '2rem' }}>
                <h1>Admin Management</h1>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '1rem', padding: '8px', width: '100%', maxWidth: '400px' }}
                />
                <UserTable
                    users={filteredUsers}
                    toggleAdmin={toggleAdmin}
                    loading={loading}
                    requestSort={handleSort}
                    sortConfig={sortConfig}
                />
            </div>
        )
    }

    return (
        <div className="admin-module">
            <div className="module-header">
                <h3>Admin Management</h3>
                <p>Manage user roles and permissions</p>
            </div>
            <div className="admin-controls" style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '100%', maxWidth: '300px' }}
                />
            </div>
            <UserTable users={filteredUsers} toggleAdmin={toggleAdmin} loading={loading} requestSort={handleSort} sortConfig={sortConfig} />
        </div>
    );
};

const UserTable = ({ users, toggleAdmin, loading, requestSort, sortConfig }) => {
    if (loading) return <p>Loading users...</p>;

    const getClassNamesFor = (name) => {
        if (!sortConfig) return;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    return (
        <div className="table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th onClick={() => requestSort('role')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                            Role {getClassNamesFor('role') === 'asc' ? '↑' : getClassNamesFor('role') === 'desc' ? '↓' : '↕'}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.uid}>
                            <td>{user.username || 'N/A'}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`status-badge ${user.role === 'admin' ? 'active' : 'pending'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <button
                                    className={`action-btn ${user.role === 'admin' ? 'reject' : 'approve'}`}
                                    onClick={() => toggleAdmin(user.uid, user.role)}
                                >
                                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
