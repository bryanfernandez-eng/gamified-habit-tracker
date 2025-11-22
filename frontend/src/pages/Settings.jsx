import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userApi } from '../services/userApi'
import { AlertCircle, Check, X, Eye, EyeOff } from 'lucide-react'

const Settings = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('name')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Display Name State
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [isEditingName, setIsEditingName] = useState(false)
  const [loadingName, setLoadingName] = useState(false)

  // Password State
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [loadingPassword, setLoadingPassword] = useState(false)

  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(false)

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  // Display Name Handler
  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      showError('Display name cannot be empty')
      return
    }

    if (displayName.length > 150) {
      showError('Display name must be 150 characters or less')
      return
    }

    try {
      setLoadingName(true)
      await userApi.updateDisplayName(displayName)
      showSuccess('Display name updated successfully!')
      setIsEditingName(false)
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to update display name')
    } finally {
      setLoadingName(false)
    }
  }

  // Password Handler
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showError('All password fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      showError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      showError('New password must be at least 8 characters')
      return
    }

    try {
      setLoadingPassword(true)
      await userApi.changePassword(oldPassword, newPassword, confirmPassword)
      showSuccess('Password changed successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to change password')
    } finally {
      setLoadingPassword(false)
    }
  }

  // Account Deletion Handler
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      showError('Please type "DELETE" to confirm account deletion')
      return
    }

    try {
      setLoadingDelete(true)
      await userApi.deleteAccount()
      showSuccess('Account deleted successfully. Logging out...')
      setTimeout(() => logout(), 2000)
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to delete account')
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1924] text-slate-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center uppercase">
          Settings
        </h1>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900 border-2 border-green-700 text-green-200 flex items-center">
            <Check size={20} className="mr-2" />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900 border-2 border-red-700 text-red-200 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {errorMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-700 mb-8 overflow-x-auto">
          {[
            { id: 'name', label: 'Display Name' },
            { id: 'password', label: 'Password' },
            { id: 'delete', label: 'Delete Account' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold uppercase whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-yellow-400 border-b-4 border-yellow-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 border-4 border-gray-700 p-6">
          {/* Display Name Tab */}
          {activeTab === 'name' && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Change Display Name</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Name: <span className="text-yellow-400">{user?.display_name || 'Not set'}</span>
                  </label>
                </div>

                {!isEditingName ? (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-6 py-2 bg-yellow-700 border-2 border-yellow-600 text-yellow-200 hover:bg-yellow-600 font-medium"
                  >
                    Edit Display Name
                  </button>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter new display name"
                      className="w-full bg-gray-700 border-2 border-gray-600 px-4 py-2 text-gray-200 placeholder-gray-500 focus:border-yellow-600 focus:outline-none"
                      maxLength={150}
                    />
                    <div className="text-xs text-gray-400">
                      {displayName.length}/150 characters
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateDisplayName}
                        disabled={loadingName}
                        className="px-6 py-2 bg-green-700 border-2 border-green-600 text-green-200 hover:bg-green-600 font-medium disabled:opacity-50"
                      >
                        {loadingName ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false)
                          setDisplayName(user?.display_name || '')
                        }}
                        className="px-6 py-2 bg-gray-700 border-2 border-gray-600 text-gray-200 hover:bg-gray-600 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Change Password</h2>
              <div className="space-y-4">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full bg-gray-700 border-2 border-gray-600 px-4 py-2 text-gray-200 placeholder-gray-500 focus:border-yellow-600 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                    >
                      {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      className="w-full bg-gray-700 border-2 border-gray-600 px-4 py-2 text-gray-200 placeholder-gray-500 focus:border-yellow-600 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-gray-700 border-2 border-gray-600 px-4 py-2 text-gray-200 placeholder-gray-500 focus:border-yellow-600 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loadingPassword}
                  className="w-full mt-6 px-6 py-3 bg-yellow-700 border-2 border-yellow-600 text-yellow-200 hover:bg-yellow-600 font-bold uppercase disabled:opacity-50"
                >
                  {loadingPassword ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}

          {/* Delete Account Tab */}
          {activeTab === 'delete' && (
            <div>
              <h2 className="text-2xl font-bold text-red-400 mb-6">Delete Account</h2>
              <div className="bg-red-900 border-2 border-red-700 p-4 mb-6">
                <p className="text-red-200 text-sm">
                  ⚠️ <strong>Warning:</strong> Deleting your account is permanent and cannot be undone. All your data will be lost.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-700 border-2 border-red-600 text-red-200 hover:bg-red-600 font-medium"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    To confirm deletion, please type <strong className="text-red-400">DELETE</strong> below:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                    placeholder="Type DELETE to confirm"
                    className="w-full bg-gray-700 border-2 border-gray-600 px-4 py-2 text-gray-200 placeholder-gray-500 focus:border-red-600 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loadingDelete || deleteConfirmText !== 'DELETE'}
                      className="px-6 py-2 bg-red-700 border-2 border-red-600 text-red-200 hover:bg-red-600 font-medium disabled:opacity-50"
                    >
                      {loadingDelete ? 'Deleting...' : 'Permanently Delete Account'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeleteConfirmText('')
                      }}
                      className="px-6 py-2 bg-gray-700 border-2 border-gray-600 text-gray-200 hover:bg-gray-600 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
