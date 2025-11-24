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
    <div className="min-h-screen bg-rulebook-paper text-rulebook-ink py-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-serif font-bold text-rulebook-ink mb-8 text-center uppercase tracking-widest">
          Settings
        </h1>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-rulebook-forest/10 border-2 border-rulebook-forest text-rulebook-forest flex items-center rounded-sm font-serif">
            <Check size={20} className="mr-2" />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson flex items-center rounded-sm font-serif">
            <AlertCircle size={20} className="mr-2" />
            {errorMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b-2 border-rulebook-charcoal mb-8 overflow-x-auto">
          {[
            { id: 'name', label: 'Display Name' },
            { id: 'password', label: 'Password' },
            { id: 'delete', label: 'Delete Account' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-serif font-bold uppercase whitespace-nowrap transition-colors tracking-wider ${activeTab === tab.id
                  ? 'text-rulebook-crimson border-b-4 border-rulebook-crimson bg-rulebook-ink/5'
                  : 'text-rulebook-ink/60 hover:text-rulebook-ink hover:bg-rulebook-ink/5'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rulebook-card p-8">
          {/* Display Name Tab */}
          {activeTab === 'name' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-rulebook-ink mb-6 uppercase tracking-wide">Change Display Name</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-rulebook-ink/60 mb-2 uppercase tracking-wide">
                    Current Name: <span className="text-rulebook-ink font-serif text-lg ml-2">{user?.display_name || 'Not set'}</span>
                  </label>
                </div>

                {!isEditingName ? (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-6 py-2 bg-rulebook-ink text-rulebook-paper hover:bg-rulebook-crimson transition-all font-serif font-bold uppercase tracking-wider rounded-sm"
                  >
                    Edit Display Name
                  </button>
                ) : (
                  <div className="space-y-6">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter new display name"
                      className="w-full bg-transparent border-b-2 border-rulebook-ink/30 px-2 py-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:border-rulebook-crimson focus:outline-none font-serif text-lg transition-colors"
                      maxLength={150}
                    />
                    <div className="text-xs text-rulebook-ink/40 font-mono text-right">
                      {displayName.length}/150 characters
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleUpdateDisplayName}
                        disabled={loadingName}
                        className="px-6 py-2 bg-rulebook-forest text-rulebook-paper hover:bg-green-700 transition-all font-serif font-bold uppercase tracking-wider rounded-sm disabled:opacity-50"
                      >
                        {loadingName ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false)
                          setDisplayName(user?.display_name || '')
                        }}
                        className="px-6 py-2 bg-transparent border-2 border-rulebook-ink/20 text-rulebook-ink hover:border-rulebook-ink transition-all font-serif font-bold uppercase tracking-wider rounded-sm"
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
              <h2 className="text-2xl font-serif font-bold text-rulebook-ink mb-6 uppercase tracking-wide">Change Password</h2>
              <div className="space-y-6">
                {/* Old Password */}
                <div>
                  <label className="block text-xs font-bold text-rulebook-ink/60 mb-2 uppercase tracking-wide">
                    Current Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.old ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full bg-transparent border-b-2 border-rulebook-ink/30 px-2 py-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:border-rulebook-crimson focus:outline-none pr-10 font-mono transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      className="absolute right-2 top-2 text-rulebook-ink/40 hover:text-rulebook-crimson transition-colors"
                    >
                      {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-rulebook-ink/60 mb-2 uppercase tracking-wide">
                    New Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      className="w-full bg-transparent border-b-2 border-rulebook-ink/30 px-2 py-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:border-rulebook-crimson focus:outline-none pr-10 font-mono transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-2 top-2 text-rulebook-ink/40 hover:text-rulebook-crimson transition-colors"
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-rulebook-ink/60 mb-2 uppercase tracking-wide">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-transparent border-b-2 border-rulebook-ink/30 px-2 py-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:border-rulebook-crimson focus:outline-none pr-10 font-mono transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-2 top-2 text-rulebook-ink/40 hover:text-rulebook-crimson transition-colors"
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loadingPassword}
                  className="w-full mt-6 px-6 py-3 bg-rulebook-ink text-rulebook-paper hover:bg-rulebook-crimson transition-all font-serif font-bold uppercase tracking-wider rounded-sm disabled:opacity-50"
                >
                  {loadingPassword ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}

          {/* Delete Account Tab */}
          {activeTab === 'delete' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-rulebook-crimson mb-6 uppercase tracking-wide">Delete Account</h2>
              <div className="bg-rulebook-crimson/10 border-2 border-rulebook-crimson p-4 mb-6 rounded-sm">
                <p className="text-rulebook-crimson text-sm font-serif">
                  ⚠️ <strong>Warning:</strong> Deleting your account is permanent and cannot be undone. All your data will be lost.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-rulebook-crimson text-rulebook-paper hover:bg-red-800 transition-all font-serif font-bold uppercase tracking-wider rounded-sm"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-6">
                  <p className="text-rulebook-ink font-serif">
                    To confirm deletion, please type <strong className="text-rulebook-crimson">DELETE</strong> below:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                    placeholder="Type DELETE to confirm"
                    className="w-full bg-transparent border-b-2 border-rulebook-crimson px-2 py-2 text-rulebook-crimson placeholder-rulebook-crimson/30 focus:outline-none font-mono font-bold tracking-widest"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loadingDelete || deleteConfirmText !== 'DELETE'}
                      className="px-6 py-2 bg-rulebook-crimson text-rulebook-paper hover:bg-red-800 transition-all font-serif font-bold uppercase tracking-wider rounded-sm disabled:opacity-50"
                    >
                      {loadingDelete ? 'Deleting...' : 'Permanently Delete Account'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeleteConfirmText('')
                      }}
                      className="px-6 py-2 bg-transparent border-2 border-rulebook-ink/20 text-rulebook-ink hover:border-rulebook-ink transition-all font-serif font-bold uppercase tracking-wider rounded-sm"
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
