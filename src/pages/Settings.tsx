import { useState } from 'react';
import { User, Bell, Shield, Save, Palette } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and system settings</p>
      </div>

      {saved && (
        <div className="toast-message toast-success">
          <Shield size={16} />
          Settings saved successfully
        </div>
      )}

      <div className="settings-layout">
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'settings-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Settings</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="Admin User" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="admin@example.com" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" defaultValue="Administrator" disabled />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" defaultValue="+63 912 345 6789" />
                </div>
                <div className="form-group form-group-full">
                  <label>Bio</label>
                  <textarea rows={3} defaultValue="Administrator of the Alumni Tracking System." />
                </div>
              </div>
              <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <div className="settings-options">
                <div className="settings-option">
                  <div>
                    <strong>Email Notifications</strong>
                    <p>Receive email notifications for important updates</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="settings-option">
                  <div>
                    <strong>Event Reminders</strong>
                    <p>Get notified about upcoming alumni events</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="settings-option">
                  <div>
                    <strong>Survey Alerts</strong>
                    <p>Receive alerts when new surveys are created</p>
                  </div>
                  <input type="checkbox" />
                </div>
                <div className="settings-option">
                  <div>
                    <strong>New Alumni Notifications</strong>
                    <p>Get notified when new alumni register</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
              <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
              </div>
              <div className="settings-option">
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <input type="checkbox" />
              </div>
              <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <Shield size={16} />
                  Update Security</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              <div className="settings-options">
                <div className="settings-option">
                  <div>
                    <strong>Dark Mode</strong>
                    <p>Toggle between light and dark theme</p>
                  </div>
                  <input type="checkbox" />
                </div>
                <div className="settings-option">
                  <div>
                    <strong>Compact Sidebar</strong>
                    <p>Reduce sidebar width for more content space</p>
                  </div>
                  <input type="checkbox" />
                </div>
              </div>
              <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  Save Appearance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;