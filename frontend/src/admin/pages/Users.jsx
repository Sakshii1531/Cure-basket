import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cb_users');
    const defaultUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', date: '2026-05-01' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', date: '2026-05-02' },
    ];
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  useEffect(() => {
    localStorage.setItem('cb_users', JSON.stringify(users));
  }, [users]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <p className="text-gray-500 text-sm">Manage registered users and customers.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
