
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      if (isSignUp) setMessage('Check your email for the confirmation link!');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <div className="w-full max-w-sm flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-white/5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 5V19H11.5C15.5 19 18 16.5 18 12C18 7.5 15.5 5 11.5 5H7ZM9 7H11.25C13.25 7 15.5 8 15.5 12C15.5 16 13.25 17 11.25 17H9V7Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">DayLog</h1>
          <p className="text-zinc-500 font-medium">Capture your daily narrative.</p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 text-white placeholder-zinc-500 focus:border-zinc-700 transition-colors"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 text-white placeholder-zinc-500 focus:border-zinc-700 transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-white text-black rounded-2xl font-bold active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          {message && <p className="text-center text-sm font-medium text-zinc-400 mt-2">{message}</p>}
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-zinc-500 text-sm font-semibold hover:text-zinc-300 transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
