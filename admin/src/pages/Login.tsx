import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-subtle flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xs space-y-6 animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary tracking-tight">EMT Operations</h1>
          <p className="text-xs text-muted mt-1">Sign in to your dashboard</p>
        </div>

        <div className="card p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-medium text-primary opacity-70">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field py-1.5 px-3 text-xs"
                placeholder="admin@emtfoods.com"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-medium text-primary opacity-70">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field py-1.5 px-3 text-xs"
              />
            </div>

            {error && (
              <div className="p-2 text-[10px] text-danger bg-danger/10 border border-danger/20 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4 py-2 text-xs uppercase tracking-wider font-bold transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
