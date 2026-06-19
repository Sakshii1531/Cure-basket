import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { SkeletonTable } from '../components/Skeleton';
import { useAuth } from '../../context/AuthContext';

const MODULES = [
  { id: 'medicines', name: 'Medicines' },
  { id: 'categories', name: 'Categories' },
  { id: 'brands', name: 'Brands' },
  { id: 'orders', name: 'Orders' },
  { id: 'prescriptions', name: 'Prescriptions' },
  { id: 'users', name: 'Users & Staff' },
  { id: 'blogs', name: 'Blogs' },
  { id: 'reviews', name: 'Reviews' },
  { id: 'coupons', name: 'Coupons' },
  { id: 'banners', name: 'Banners' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'settings', name: 'Settings & Templates' },
  { id: 'roles', name: 'Roles & Permissions' },
  { id: 'chat', name: 'Live Chat' },
];

const ACTIONS = ['read', 'write', 'delete'];

function Roles() {
  const { can } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  
  // Form state
  const [roleName, setRoleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState(
    MODULES.reduce((acc, mod) => {
      acc[mod.id] = { read: false, write: false, delete: false };
      return acc;
    }, {})
  );
  
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRoles = () => {
    setLoading(true);
    api.get('/roles')
      .then(res => {
        setRoles(res.data.data);
        setError('');
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load roles');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setRoleName('');
    setEmail('');
    setPassword('');
    setPermissions(
      MODULES.reduce((acc, mod) => {
        acc[mod.id] = { read: false, write: false, delete: false };
        return acc;
      }, {})
    );
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setModalMode('edit');
    setSelectedRoleId(role._id);
    setRoleName(role.name);
    setEmail(role.email || '');
    setPassword('');
    
    const initialPerms = MODULES.reduce((acc, mod) => {
      acc[mod.id] = { read: false, write: false, delete: false };
      return acc;
    }, {});

    role.permissions.forEach(p => {
      if (initialPerms[p.module]) {
        p.actions.forEach(act => {
          initialPerms[p.module][act] = true;
        });
      }
    });

    setPermissions(initialPerms);
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (moduleId, action, value) => {
    setPermissions(prev => {
      const updated = { ...prev };
      updated[moduleId] = { ...updated[moduleId], [action]: value };

      // Logical helpers:
      // If write or delete is checked, read MUST be checked
      if ((action === 'write' || action === 'delete') && value) {
        updated[moduleId].read = true;
      }
      // If read is unchecked, write and delete MUST be unchecked
      if (action === 'read' && !value) {
        updated[moduleId].write = false;
        updated[moduleId].delete = false;
      }

      return updated;
    });
  };

  const toggleAllForModule = (moduleId, checkAll) => {
    setPermissions(prev => {
      const updated = { ...prev };
      updated[moduleId] = {
        read: checkAll,
        write: checkAll,
        delete: checkAll
      };
      return updated;
    });
  };

  const toggleAllPermissions = (checkAll) => {
    setPermissions(
      MODULES.reduce((acc, mod) => {
        acc[mod.id] = { read: checkAll, write: checkAll, delete: checkAll };
        return acc;
      }, {})
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error('Please enter a valid email address');
        return;
      }

      if (modalMode === 'add') {
        if (!password) {
          toast.error('Password is required when email is set');
          return;
        }
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return;
        }
      } else {
        const currentRole = roles.find(r => r._id === selectedRoleId);
        const hadEmail = currentRole && currentRole.email;
        if (!hadEmail && !password) {
          toast.error('Password is required to configure login credentials');
          return;
        }
        if (password && password.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return;
        }
      }
    }

    setSaving(true);

    // Format permissions for API
    const formattedPermissions = Object.entries(permissions)
      .map(([moduleId, actionsObj]) => {
        const activeActions = Object.entries(actionsObj)
          .filter(([_, val]) => val)
          .map(([key]) => key);
        
        return {
          module: moduleId,
          actions: activeActions
        };
      })
      .filter(p => p.actions.length > 0); // Only send modules with active permissions

    const payload = {
      name: roleName.trim(),
      email: email.trim() || '',
      permissions: formattedPermissions
    };

    if (password) {
      payload.password = password;
    }

    try {
      if (modalMode === 'add') {
        await api.post('/roles', payload);
        toast.success('Role created successfully');
      } else {
        await api.put(`/roles/${selectedRoleId}`, payload);
        toast.success('Role updated successfully');
      }
      fetchRoles();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/roles/${deleteId}`);
      toast.success('Role deleted successfully');
      setRoles(prev => prev.filter(r => r._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete role');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Roles & Permissions</h2>
          <p className="text-gray-500 text-sm">Configure staff roles and customize their read, write, and do-not-access permissions.</p>
        </div>
        {(can('roles', 'write') || !can) && (
          <button
            onClick={openAddModal}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Role
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Table of Roles */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Role Name</th>
                  <th className="px-6 py-4">Active Modules Permission</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {roles.map((role) => {
                  const allowedModules = role.permissions
                    .filter(p => p.actions.length > 0)
                    .map(p => {
                      const modInfo = MODULES.find(m => m.id === p.module);
                      return modInfo ? modInfo.name : p.module;
                    });

                  return (
                    <tr key={role._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{role.name}</td>
                      <td className="px-6 py-4 max-w-xs md:max-w-md lg:max-w-xl">
                        <div className="flex flex-wrap gap-1.5">
                          {allowedModules.length > 0 ? (
                            allowedModules.map((m, idx) => (
                              <span key={idx} className="bg-teal-50 text-primary text-[11px] font-bold px-2 py-0.5 rounded-md">
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic text-xs">No module access (Dashboard & Chat only)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(role.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(role)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteId(role._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Role"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400 text-sm">
                      No custom roles created yet. Click "Add Role" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Role?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this custom role? Users currently assigned this role will revert to normal customers.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 p-6 shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'Create Custom Role' : 'Edit Custom Role'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto py-4 pr-1 space-y-6">
                {/* Role Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Role Name *</label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Pharmacist, Order Manager"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    required
                  />
                </div>

                {/* Login Credentials (Optional) */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-gray-900">Login Credentials (Optional)</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Define credentials to allow direct login via the admin portal.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email / User ID</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. chemist@curebasket.com"
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        Password {modalMode === 'add' ? (email ? '*' : '') : ''}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={modalMode === 'edit' ? '•••••••• (leave blank to keep)' : '••••••••'}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions Matrix */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-800">Permissions Matrix</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAllPermissions(true)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Grant All
                      </button>
                      <span className="text-gray-300 text-xs">|</span>
                      <button
                        type="button"
                        onClick={() => toggleAllPermissions(false)}
                        className="text-xs font-bold text-red-500 hover:underline"
                      >
                        Revoke All
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-inner max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0 border-b border-gray-100 z-10">
                        <tr className="text-left text-xs font-bold text-gray-500 uppercase">
                          <th className="px-4 py-3">Module</th>
                          <th className="px-4 py-3 text-center">Read</th>
                          <th className="px-4 py-3 text-center">Write</th>
                          <th className="px-4 py-3 text-center">Delete</th>
                          <th className="px-4 py-3 text-right">Quick Select</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-55">
                        {MODULES.map((mod) => {
                          const isModuleChecked = permissions[mod.id];
                          const hasAll = isModuleChecked.read && isModuleChecked.write && isModuleChecked.delete;

                          return (
                            <tr key={mod.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 font-semibold text-gray-900">{mod.name}</td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={permissions[mod.id].read}
                                  onChange={(e) => handleCheckboxChange(mod.id, 'read', e.target.checked)}
                                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={permissions[mod.id].write}
                                  onChange={(e) => handleCheckboxChange(mod.id, 'write', e.target.checked)}
                                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={permissions[mod.id].delete}
                                  onChange={(e) => handleCheckboxChange(mod.id, 'delete', e.target.checked)}
                                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => toggleAllForModule(mod.id, !hasAll)}
                                  className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${
                                    hasAll 
                                      ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                                      : 'bg-teal-50 text-primary hover:bg-teal-100'
                                  }`}
                                >
                                  {hasAll ? 'Revoke Module' : 'Grant Module'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark disabled:opacity-60 transition-colors shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;
