'use client';

import React from 'react';

export default function InstagramConnectButton() {
  // On utilise les noms exacts définis dans ton .env.local
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI;
  
  // 1. On encode l'URL pour éviter que les caractères spéciaux (: /) ne cassent la requête
  const encodedRedirect = encodeURIComponent(redirectUri || '');
  
  // 2. On définit les permissions (Scopes)
  // instagram_basic : pour lire les photos
  // pages_show_list : pour voir la page FB liée
  // public_profile : obligatoire pour le Login
  const scopes = 'public_profile,instagram_basic,pages_show_list';

  // Construction de l'URL finale pour l'API Graph v19.0 (ou v21.0 en 2026)
  const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirect}&scope=${scopes}&response_type=code`;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md mx-auto">
      <h3 className="text-xl font-black text-gray-900 mb-2">Souk El Had Connect</h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        Synchronisez vos produits Instagram directement sur votre vitrine numérique en un clic.
      </p>
      
      <div className="bg-blue-50 text-blue-700 text-xs p-4 rounded-xl mb-6 w-full border border-blue-100 flex gap-3">
        <span className="text-lg">💡</span>
        <p>
          Assurez-vous que votre compte <strong>Instagram est Professionnel</strong> et lié à une Page Facebook.
        </p>
      </div>

      <a 
        href={facebookAuthUrl}
        className="w-full inline-flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
        Démarrer la connexion
      </a>
    </div>
  );
}