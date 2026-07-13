import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Glow Backdrop */}
      <div className="glow-bg glow-violet top-1/4 left-1/3"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to resume optimizations dashboard</p>
          </div>

          {errorMsg && (
            <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/5 border border-rose-500/10 px-4 py-3 rounded-lg text-sm mb-5">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full mt-4"
              isLoading={isSubmitting}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-violet-400 hover:text-violet-300 transition">
                Create one now
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
