import React from 'react';
import Link from 'next/link';

export default function VendrePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* NAVIGATION DISCRÈTE */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="font-black text-xl tracking-tighter uppercase">
          Souk El Had <span className="text-orange-600">Connect</span>
        </Link>
        <Link href="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm">
          S'inscrire
        </Link>
      </nav>

      {/* HERO SECTION B2B */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
            Votre boutique mérite une <span className="text-orange-600">vitrine digitale</span> à la hauteur.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Ne perdez plus de temps à gérer un site web complexe. Connectez votre Instagram, et nous créons votre boutique en ligne automatiquement.
          </p>
          <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-200 hover:scale-105 transition-transform uppercase">
              Réserver ma page (C'est Gratuit)
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION ARGUMENTS (POINTS FORTS) */}
      <section className="bg-slate-50 py-24 px-6 rounded-[4rem] mx-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-4xl mb-6">📸</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">Zéro Gestion</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Postez sur Instagram comme d'habitude. Vos photos apparaissent instantanément sur votre vitrine Souk El Had Connect.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-4xl mb-6">💬</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">Ventes Directes</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Un bouton "Commander sur WhatsApp" est ajouté sous chaque produit. Recevez les commandes directement sur votre téléphone.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="text-4xl mb-6">🌍</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">Visibilité Max</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Apparaissez sur la première page du Souk. Attirez des clients d'Agadir, du Maroc et du monde entier.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION ÉTAPES */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-16 uppercase italic tracking-tight">Comment ça marche ?</h2>
        <div className="space-y-12 text-left">
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black shrink-0">1</div>
            <div>
              <h4 className="text-xl font-black uppercase italic">Créez votre compte</h4>
              <p className="text-slate-500 font-medium">Choisissez le nom de votre boutique et votre adresse personnalisée.</p>
            </div>
          </div>
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black shrink-0">2</div>
            <div>
              <h4 className="text-xl font-black uppercase italic">Liez votre Instagram</h4>
              <p className="text-slate-500 font-medium">En un clic, nous synchronisons vos produits de manière sécurisée.</p>
            </div>
          </div>
          <div className="flex gap-8 items-start">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-black shrink-0">3</div>
            <div>
              <h4 className="text-xl font-black uppercase italic">Vendez !</h4>
              <p className="text-slate-500 font-medium">Partagez votre lien et recevez vos premières commandes sur WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pb-32 px-6 text-center">
        <div className="bg-slate-950 p-16 rounded-[4rem] text-white max-w-5xl mx-auto shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase italic tracking-tighter">Prêt à digitaliser votre commerce ?</h2>
          <Link href="/login" className="inline-block bg-orange-600 text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform uppercase">
            Commencer maintenant
          </Link>
          <p className="mt-6 text-slate-400 font-medium italic">Inscription gratuite pour les 100 premiers commerçants d'Agadir.</p>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-slate-100">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Architecture Digitale Agadir — Souk El Had Connect</p>
      </footer>
    </div>
  );
}