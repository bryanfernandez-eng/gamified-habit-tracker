// frontend/src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react'
import { Shield, Users, UserCheck, UserX, Trash2, Edit3, Plus, RefreshCw, Search, X, AlertTriangle, BarChart2, Zap } from 'lucide-react'
import { gameApi } from '../services/gameApi'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const leaderboardData = await gameApi.getLeaderboard()

      // Transform leaderboard data for admin view
      const adminUsers = leaderboardData.map(user => ({
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email || 'N/A',
        level: user.level,
        is_active: true, // Assuming all in leaderboard are active
        is_superuser: false, // Would need API update to include this
        date_joined: new Date().toISOString(), // Placeholder
        current_xp: user.current_xp,
        strength: user.strength,
        intelligence: user.intelligence,
        creativity: user.creativity,
        social: user.social,
        health: user.health,
      }))

      setUsers(adminUsers)
      setStats({
        total_users: adminUsers.length,
        active_users: adminUsers.filter(u => u.is_active).length,
        inactive_users: adminUsers.filter(u => !u.is_active).length,
        admin_users: adminUsers.filter(u => u.is_superuser).length,
      })
    } catch (err) {
      setError('Failed to load user data. Please check your connection.')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active) ||
      (filterStatus === 'admin' && user.is_superuser)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-transparent border-t-yellow-400 border-r-yellow-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-yellow-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-yellow-400 uppercase">Loading Admin Panel</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b-4 border-double border-yellow-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-yellow-400 uppercase tracking-wider">Admin Panel</h1>
                <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">System Management & User Control</p>
              </div>
            </div>

            <button
              onClick={loadData}
              className="inline-flex items-center px-4 py-2 bg-gray-700 border-2 border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-gray-900 uppercase text-xs font-bold transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border-2 border-red-700 text-red-200 px-4 py-3 rounded mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 border-4 border-double border-yellow-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-xs uppercase font-bold tracking-wide">Total Users</p>
                  <p className="text-3xl font-bold text-yellow-300 mt-2">{stats.total_users}</p>
                </div>
                <Users className="w-10 h-10 text-yellow-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 border-4 border-double border-green-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-xs uppercase font-bold tracking-wide">Active Users</p>
                  <p className="text-3xl font-bold text-green-300 mt-2">{stats.active_users}</p>
                </div>
                <UserCheck className="w-10 h-10 text-green-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 border-4 border-double border-red-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-xs uppercase font-bold tracking-wide">Inactive Users</p>
                  <p className="text-3xl font-bold text-red-300 mt-2">{stats.inactive_users}</p>
                </div>
                <UserX className="w-10 h-10 text-red-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 border-4 border-double border-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-xs uppercase font-bold tracking-wide">Administrators</p>
                  <p className="text-3xl font-bold text-purple-300 mt-2">{stats.admin_users}</p>
                </div>
                <Shield className="w-10 h-10 text-purple-600 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        <div className="bg-gray-800 border-4 border-double border-gray-700">
          <div className="px-6 py-4 border-b-2 border-gray-700 bg-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <BarChart2 className="w-6 h-6 text-yellow-400 mr-3" />
                <div>
                  <h2 className="text-lg font-bold text-yellow-400 uppercase">User Management</h2>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">Manage all system users</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-900 border-2 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-yellow-600 focus:outline-none"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-900 border-2 border-gray-600 text-gray-200 px-3 py-2 focus:border-yellow-600 focus:outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="admin">Admins</option>
                </select>

                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-yellow-700 border-2 border-yellow-600 text-yellow-200 hover:bg-yellow-600 uppercase text-xs font-bold transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700 border-b-2 border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">XP</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id} className={idx % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-800'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-sm flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-white">
                            {(user.display_name || user.username).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-yellow-300">
                            {user.display_name || user.username}
                          </div>
                          <div className="text-xs text-gray-400">@{user.username}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">{user.email}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold text-yellow-300">Lv.{user.level}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">{user.current_xp}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold border-2 ${
                        user.is_active
                          ? 'border-green-600 bg-green-900/30 text-green-300'
                          : 'border-red-600 bg-red-900/30 text-red-300'
                      }`}>
                        {user.is_active ? (
                          <>
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold border-2 ${
                        user.is_superuser
                          ? 'border-purple-600 bg-purple-900/30 text-purple-300'
                          : 'border-gray-600 bg-gray-900/30 text-gray-300'
                      }`}>
                        {user.is_superuser ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <Users className="w-3 h-3 mr-1" />
                            User
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit user"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmUser(user)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 bg-gray-800/50">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-yellow-400 mb-2">No users found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search criteria or filters'
                    : 'No users in the system yet'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateForm && (
        <UserFormModal
          title="Create New User"
          onSave={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <UserFormModal
          title="Edit User"
          user={editingUser}
          onSave={() => setEditingUser(null)}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <DeleteConfirmModal
          user={deleteConfirmUser}
          onConfirm={() => {
            setDeleteConfirmUser(null)
            loadData()
          }}
          onCancel={() => setDeleteConfirmUser(null)}
        />
      )}
    </div>
  )
}

// Gamified User Form Modal
function UserFormModal({ title, user = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    display_name: user?.display_name || '',
    password: '',
    is_active: user?.is_active ?? true,
    is_superuser: user?.is_superuser || false
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="bg-gray-800 border-4 border-double border-yellow-600 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b-2 border-gray-700 bg-gray-700/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-yellow-400 uppercase">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-yellow-400">
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wide mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                errors.username ? 'border-red-600 focus:border-red-500' : 'border-gray-700 focus:border-yellow-600'
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-400">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wide mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                errors.display_name ? 'border-red-600 focus:border-red-500' : 'border-gray-700 focus:border-yellow-600'
              }`}
              placeholder="Enter display name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                errors.email ? 'border-red-600 focus:border-red-500' : 'border-gray-700 focus:border-yellow-600'
              }`}
              placeholder="Enter email"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 border-2 border-yellow-600 focus:ring-yellow-600"
              />
              <span className="ml-2 text-xs font-bold text-yellow-400 uppercase">Active</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_superuser"
                checked={formData.is_superuser}
                onChange={handleChange}
                className="w-4 h-4 border-2 border-yellow-600 focus:ring-yellow-600"
              />
              <span className="ml-2 text-xs font-bold text-yellow-400 uppercase">Admin</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t-2 border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 border-2 border-gray-600 text-gray-300 hover:bg-gray-600 uppercase text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-2 bg-yellow-700 border-2 border-yellow-600 text-yellow-200 hover:bg-yellow-600 uppercase text-xs font-bold transition-all"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
function DeleteConfirmModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="bg-gray-800 border-4 border-double border-red-600 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-900/50 rounded-sm p-3 mr-3 border-2 border-red-700">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-red-400 uppercase">Confirm Deletion</h3>
          </div>

          <div className="mb-6">
            <p className="text-gray-300 mb-3 text-sm">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="bg-gray-900 border-2 border-red-700 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-900/50 border-2 border-red-700 rounded-sm flex items-center justify-center">
                  <span className="text-sm font-bold text-red-300">
                    {(user.display_name || user.username).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="font-bold text-yellow-300">{user.display_name || user.username}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 border-2 border-gray-600 text-gray-300 hover:bg-gray-600 uppercase text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-700 border-2 border-red-600 text-red-200 hover:bg-red-600 uppercase text-xs font-bold transition-all"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
