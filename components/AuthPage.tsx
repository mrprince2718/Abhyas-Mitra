import React, { useState } from 'react';
import { SparkleIcon } from './icons';
import { Language } from '../types';

interface AuthPageProps {
  onLogin: (username: string, pass: string) => boolean;
  onSignUp: (username:string, pass: string, className: string, language: Language, subject: string) => boolean;
  onGuestLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp, onGuestLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [subject, setSubject] = useState('General');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    if (!isLogin && (!className || !language || !subject)) {
        setError('Class, language, and subject are required for sign up.');
        return;
    }

    let success = false;
    if (isLogin) {
      success = onLogin(username, password);
      if (!success) setError('Invalid username or password.');
    } else {
      success = onSignUp(username, password, className, language, subject);
      if (!success) setError('Username already taken.');
    }
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin); 
    setError('');
    setUsername('');
    setPassword('');
    setClassName('');
    setLanguage('English');
    setSubject('General');
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-base-200">
      <div className="w-full max-w-sm p-8 space-y-6 bg-base-100 rounded-2xl shadow-2xl">
        <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
                <SparkleIcon className="w-10 h-10 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">ABHYAS MITRA</h1>
            </div>
            <p className="text-content-secondary">{isLogin ? 'Welcome back! Please sign in.' : 'Create an account to get started.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-content-secondary block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-content-secondary block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {!isLogin && (
            <>
               <div>
                <label className="text-sm font-medium text-content-secondary block mb-2">Class (e.g., 10th, 12th Science)</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
               <div>
                <label className="text-sm font-medium text-content-secondary block mb-2">Primary Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option>General</option>
                  <option>Science</option>
                  <option>Mathematics</option>
                  <option>History</option>
                  <option>Geography</option>
                  <option>Literature</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-content-secondary block mb-2">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Gujarati">ગુજરાતી</option>
                </select>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-base-100 px-2 text-content-secondary">or</span>
          </div>
        </div>

        <button 
            type="button"
            onClick={onGuestLogin}
            className="w-full py-2.5 bg-base-300 text-content rounded-lg hover:bg-base-300/80 transition-colors font-semibold"
        >
            Continue as Guest
        </button>

        <p className="text-center text-sm text-content-secondary mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={handleToggleForm} className="font-medium text-primary hover:underline ml-1">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};