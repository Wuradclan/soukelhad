'use client';

import React from 'react';

export default function InstagramConnectButton() {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI;

  const handleConnect = () => {
    if (!appId || !redirectUri) {
      console.error("Variables Meta manquantes dans le .env");
      alert("Erreur de configuration : Variables d'environnement manquantes.");
      return;
    }

    // 1. LES SCOPES : C'est ici que tout se joue pour voir ta page Facebook
    const scope = [
      'instagram_basic',
      'instagram_manage_insights',
      'pages_show_list',       // CRUCIAL : Pour que l'API voie tes pages
      'pages_read_engagement', // CRUCIAL : Pour lier la page à Instagram
      'business_management'    // OPTIONNEL : Mais aide souvent pour les comptes Pro
    ].join(',');

    const encodedRedirect = encodeURIComponent(redirectUri);
    
    // 2. L'URL de connexion (On force le "re-consentement" avec auth_type=rerequest)
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirect}&scope=${scope}&response_type=code&auth_type=rerequest`;

    // Redirection vers Meta
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleConnect}
      className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-300 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-2xl hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
      Démarrer la connexion
    </button>
  );
}