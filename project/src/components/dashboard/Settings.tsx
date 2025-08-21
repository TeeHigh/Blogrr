import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  Trash2, 
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Bell,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header';
import { defaultAvatar } from '../../constants/defaultAvatar';

const SAMPLE_AVATARS = [
  'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150'
];

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.fullname || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    collaborationRequests: true,
    newFollowers: false,
    weeklyDigest: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Globe },
    { id: 'account', name: 'Account', icon: Trash2 }
  ];

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await updateProfile(profileData);
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setSaving(true);
    try {
      // In a real app, this would call an API to change password
      alert('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you absolutely sure? This action cannot be undone.')) {
      try {
        // In a real app, this would call an API to delete the account
        logout();
        navigate('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <img
                    src={profileData.avatar || defaultAvatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Profile Picture</h4>
                  <p className="text-sm text-gray-600">Click the camera icon to change your avatar</p>
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  maxLength={300}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-sm text-gray-500 mt-1">{profileData.bio.length}/300 characters</p>
              </div>

              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Lock className="h-4 w-4" />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key === 'emailUpdates' && 'Email Updates'}
                        {key === 'collaborationRequests' && 'Collaboration Requests'}
                        {key === 'newFollowers' && 'New Followers'}
                        {key === 'weeklyDigest' && 'Weekly Digest'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'emailUpdates' && 'Receive email notifications for important updates'}
                        {key === 'collaborationRequests' && 'Get notified when someone wants to collaborate'}
                        {key === 'newFollowers' && 'Notifications when someone follows you'}
                        {key === 'weeklyDigest' && 'Weekly summary of your blog performance'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">Privacy settings will be available in a future update.</p>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                    <p className="text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                      All your posts, comments, and data will be permanently removed.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 relative">
        <div className="mb-8">
          {/* <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button> */}
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setProfileData(prev => ({ ...prev, avatar }));
                    setShowAvatarModal(false);
                  }}
                  className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-colors ${
                    profileData.avatar === avatar ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Account Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}