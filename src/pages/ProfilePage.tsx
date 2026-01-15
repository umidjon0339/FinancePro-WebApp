import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft, ShieldCheck, KeyRound, Save } from 'lucide-react';
import './ProfilePage.css'; // <--- Import the CSS here

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/auth'); 
      setSession(session);
    });
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      if (!session?.user?.email) throw new Error("User email not found");

      // Verify old password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword
      });

      if (verifyError) throw new Error("Current password is incorrect");

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (updateError) throw updateError;

      toast.success("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayUsername = session?.user?.email?.split('@')[0] || 'User';

  return (
    <div className="profile-container">
      
      {/* Back Button */}
      <button onClick={() => navigate('/')} className="back-btn">
        <ArrowLeft size={18} /> 
        <span>Back to Dashboard</span>
      </button>

      <div className="profile-card">
        {/* Header Profile Section */}
        <div className="profile-header">
          <div className="avatar-circle">
            <User size={40} className="text-indigo-600" />
          </div>
          <h1 className="username-title">{displayUsername}</h1>
          <div className="secure-badge">
            <ShieldCheck size={14} />
            <span>Secure Cloud Account</span>
          </div>
        </div>

        {/* Change Password Form */}
        <div style={{ padding: '0 4px' }}>
          <h3 className="section-header">
            <div className="icon-box">
              <KeyRound size={18} style={{ color: 'var(--text-secondary)' }} />
            </div>
            Change Password
          </h3>

          <form onSubmit={handleUpdatePassword}>
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Enter current password" 
                  className="profile-input"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-app)' }} // Slight tint
                />
              </div>
            </div>

            <div className="divider"></div>

            {/* New Password Inputs */}
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input 
                    type="password" 
                    placeholder="Enter new password" 
                    className="profile-input"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input 
                    type="password" 
                    placeholder="Retype new password" 
                    className="profile-input"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary update-btn">
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <Save size={18} /> Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};