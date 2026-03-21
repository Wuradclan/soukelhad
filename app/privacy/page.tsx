import React from 'react';

export const metadata = {
  title: 'Politique de Confidentialité | Souk El Had Agadir',
  description: 'Informations sur la gestion de vos données personnelles sur soukelhadagadir.com',
};

export default function PrivacyPolicy() {
  // Date fixe pour éviter les erreurs d'hydratation et faire plus "officiel"
  const lastUpdate = "21 mars 2026";
  const contactEmail = "a.wurad@gmail.com";

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 border-b pb-4">
          Politique de Confidentialité
        </h1>

        <div className="prose prose-orange text-gray-700 space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">1. Introduction</h2>
            <p>
              Bienvenue sur <strong>Souk El Had Agadir</strong> (soukelhadagadir.com). Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique explique comment nous traitons les informations lorsque vous utilisez notre plateforme, notamment pour l'affichage des flux Instagram des commerçants.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">2. Données collectées</h2>
            <p>
              Dans le cadre de l'utilisation de l'API Instagram, nous collectons uniquement les données strictement nécessaires :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Identifiants Instagram :</strong> Nom d'utilisateur et ID de compte.</li>
              <li><strong>Contenu Médias :</strong> Photos, vidéos et légendes publiées publiquement sur votre compte Instagram.</li>
              <li><strong>Jetons d'accès :</strong> Pour maintenir la connexion automatique à votre flux.</li>
              <li><strong>Contact :</strong> Votre numéro WhatsApp pour la mise en relation client.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">3. Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Afficher votre catalogue de produits dynamiquement sur votre page boutique.</li>
              <li>Permettre aux clients de vous contacter directement via WhatsApp.</li>
            </ul>
          </section>

          <section className="bg-orange-50 p-6 rounded-2xl border-l-4 border-orange-500 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950 mb-3">4. Instructions de suppression des données</h2>
            <p className="mb-4 text-sm">
              Conformément aux exigences de Meta, vous pouvez demander la suppression de vos données à tout moment :
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li>
                Envoyez un e-mail à <strong>{contactEmail}</strong> avec pour objet "Suppression de données".
              </li>
              <li>
                Précisez votre nom d'utilisateur Instagram associé à votre boutique.
              </li>
              <li>
                Sous 48h, tous vos jetons d'accès et médias stockés seront définitivement supprimés de nos serveurs.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-950 mb-3">5. Contact</h2>
            <p>
              Pour toute question concernant cette politique, vous pouvez contacter le responsable : <br />
              <strong>Wurad Ait</strong><br />
              Email : <span className="text-orange-600 font-bold">{contactEmail}</span>
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-8 border-t italic">
            Dernière mise à jour : {lastUpdate}
          </p>
        </div>
      </div>
    </main>
  );
}