import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Key, Check } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      setSuccessMsg("Password changed successfully!");
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Account Settings</h2>
          <p className="text-xs text-slate-500 font-medium">Manage user profile preferences and password options</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-4 border-b border-white/5 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/10 border border-violet-500/15 text-violet-400">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{user?.full_name || 'ResumeIQ User'}</h4>
                <p className="text-xs text-slate-400 font-semibold">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={user?.full_name || ''}
                disabled
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
              />
            </div>
          </Card>

          {/* Change Password Card */}
          <Card className="md:col-span-1">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Key className="h-4.5 w-4.5 text-violet-400" />
              <span>Update Password</span>
            </h4>

            {successMsg && (
              <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3.5 py-2.5 rounded-lg text-xs font-semibold mb-4 animate-pulse">
                <Check className="h-4 w-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="secondary"
                className="w-full mt-2"
                disabled={!password || password !== confirmPassword}
              >
                Change Password
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
