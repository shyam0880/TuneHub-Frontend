import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import '../../styles/UserList.css';
import Loading from '../ui/Loading';

export default function UserList() {
  const { setAlertData, apiUrl, contextUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('User not found');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setAlertData({ show: true, status: false, message: error.message });
        setUsers([]); // Optional: clear on error
      }
    };

    fetchUsers();
  }, [apiUrl, setAlertData]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const isAsc = prev.key === key && prev.direction === 'asc';
      return { key, direction: isAsc ? 'desc' : 'asc' };
    });
  };

  const filteredUsers = [...users]
    .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    if (contextUser.role === "USER" ) {
      return <Navigate to="/dashboard" replace />;
    }
      
    if (contextUser === undefined) {
        return <Loading />;
    }

  return (
    <div className="user-list-container">
      <h2>🧑‍💼 User Directory</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th onClick={() => handleSort('username')}>Name</th>
              <th onClick={() => handleSort('email')}>Email</th>
              <th onClick={() => handleSort('role')}>Role</th>
              <th onClick={() => handleSort('premium')}>Premium</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td>
                    <img
                      // src={user.image || `https://ui-avatars.com/api/?name=${user.username}`}
                      src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&rounded=true`}
                      alt={user.username}
                      className="avatar"
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-tag ${user.role === 'ADMIN' ? 'ADMIN' : 'USER'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.premium ? '✅' : '❌'}</td>
                  <td className="address">{user.address}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
