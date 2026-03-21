'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Initialisation du client Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Email ou mot de passe incorrect.");
      } else {
        // Redirection vers le dashboard
        router.push('/user');
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">
        
        {/* Header avec les couleurs du Souk d'Agadir */}
        <div className="bg-orange-600 p-8 text-center text-white">
          <h1 className="text-3xl font-black tracking-tight">Souk El Had</h1>
          <p className="text-orange-100 mt-2 font-medium opacity-90">Espace Commerçant</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Champ Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email professionnel</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="nom@boutique.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Mot de passe</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Message d'erreur visuel */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Bouton de connexion */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 mt-2"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Souk El Had Agadir &copy; 2026 - Plateforme Commerçants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}