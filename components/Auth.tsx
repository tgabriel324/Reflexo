
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
      if (isSignUp) setMessage('Verifique seu e-mail para confirmar!');
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
          <div className="w-24 h-24 mx-auto mb-6">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 text-white">REFLEXO</h1>
          <p className="text-zinc-500 font-medium">Sua evolução em foco.</p>
        </div>

        <div className="apple-glass p-8 rounded-[2.5rem] border-white/5">
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white placeholder-zinc-500 focus:bg-white/10 transition-all outline-none"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white placeholder-zinc-500 focus:bg-white/10 transition-all outline-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-white text-black rounded-2xl font-bold active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-xl"
              >
                {loading ? 'Aguarde...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
              </button>

              {message && <p className="text-center text-sm font-medium text-zinc-400 mt-2">{message}</p>}
            </form>

            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full mt-6 text-zinc-500 text-sm font-semibold hover:text-white transition-colors"
            >
              {isSignUp ? 'Já tem conta? Entrar' : "Novo por aqui? Criar conta"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;