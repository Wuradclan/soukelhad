import React from 'react';

export default function InstagramConnectButton() {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  
  // NOUVEAU FLUX : Facebook OAuth pour Instagram Graph API
  // On demande les permissions de base Instagram et la lecture des pages liées
  const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,pages_show_list&response_type=code`;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Synchronisation Automatique</h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        Connectez votre compte Instagram Professionnel pour que votre vitrine se mette à jour toute seule.
      </p>
      
      <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-md mb-6 w-full text-center border border-orange-200">
        💡 <strong>Note :</strong> Votre compte Instagram doit être un profil Professionnel lié à une Page Facebook.
      </div>

      <a 
        href={facebookAuthUrl}
        className="inline-flex items-center gap-3 bg-[#1877F2] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        {/* Icône SVG Facebook/Meta unifiée */}
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
        Continuer avec Facebook
      </a>
    </div>
  );
}