"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, MessageCircle, ShieldCheck, ShoppingCart } from 'lucide-react'

export default function ProductGrid({ photos, shop }: { photos: any[], shop: any }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)

  // 1. Logique pour fermer en cliquant en dehors de la popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Si la popup est ouverte, et qu'on clique sur un élément qui n'est PAS dans le contenu de la popup, on ferme
      if (selectedProduct && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        setSelectedProduct(null);
      }
    }

    // On ajoute l'écouteur d'événement uniquement quand la popup est ouverte
    if (selectedProduct) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Nettoyage de l'écouteur quand le composant est retiré
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProduct]);

  return (
    <>
      {/* GRILLE DES PRODUITS (Respectant le style Landing Page) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {photos.map((photo) => {
          const priceMatch = photo.caption?.match(/(\d+)\s*(?:DH|Dhs|MAD)/i);
          const price = priceMatch ? priceMatch[1] : null;

          return (
            <div 
              key={photo.id} 
              onClick={() => setSelectedProduct(photo)}
              className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer p-3"
            >
              <div className="relative aspect-square w-full bg-gray-50 overflow-hidden rounded-[1.5rem]">
                {photo.media_type === 'VIDEO' ? (
                  <video src={photo.media_url} className="w-full h-full object-cover" muted />
                ) : (
                  <Image src={photo.media_url} alt="" fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                
                {price && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-orange-600 shadow-sm text-sm">
                        {price} DH
                    </div>
                )}
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight tracking-tight mb-2 group-hover:text-orange-500 transition-colors">
                    {photo.caption?.split('#')[0] || "Produit Souk"}
                </h3>
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL DE DÉTAILS (CORRIGÉE : Taille, Texte et Fermeture Extérieure) */}
      {selectedProduct && (
        // Overlay (Fond gris transparent)
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300">
          
          // Contenu de la Popup (On ajoute la ref ici)
          <div 
            ref={modalContentRef}
            className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom duration-300"
          >
            
            {/* Bouton Fermer */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-[110] bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-500 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            {/* Partie Gauche : Média (Réduit en hauteur) */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center h-[40vh] md:h-[85vh]">
              {selectedProduct.media_type === 'VIDEO' ? (
                <video src={selectedProduct.media_url} controls autoPlay loop className="max-h-full w-full object-contain" />
              ) : (
                <div className="relative w-full h-full p-4 md:p-8">
                  <Image src={selectedProduct.media_url} alt="" fill className="object-contain" priority />
                </div>
              )}
            </div>

            {/* Partie Droite : Infos (Texte réduit) */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              
              <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full mb-4 self-start border border-gray-100">
                 <ShieldCheck size={14} className="text-green-500" />
                 <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Article Certifié</span>
              </div>

              {/* Titre réduit */}
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 leading-tight tracking-tight uppercase italic leading-none">
                {selectedProduct.caption?.split('#')[0] || "Détails"}
              </h2>

              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const p = selectedProduct.caption?.match(/(\d+)\s*(?:DH|Dhs|MAD)/i);
                  return p ? (
                    <div className="bg-orange-50 text-orange-600 px-5 py-2 rounded-full text-2xl font-black tracking-tighter shadow-sm border border-orange-100">
                      {p[1]} DH
                    </div>
                  ) : <span className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Prix sur demande</span>
                })()}
              </div>

              {/* Texte de description REDUIT (sm) */}
              <p className="text-sm text-gray-500 leading-normal italic mb-8 border-l-4 border-orange-100 pl-4 py-1">
                 {selectedProduct.caption || "Aucune description supplémentaire."}
              </p>

              {/* Bouton style E-commerce Pro */}
              <a 
                href={`https://wa.me/${shop.whatsapp_number || '212600000000'}?text=${encodeURIComponent(`Salam! Je suis intéressé par ce produit chez ${shop.name} : ${selectedProduct.permalink}`)}`}
                target="_blank"
                className="mt-auto flex items-center justify-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[1.5rem] font-bold text-lg transition-all shadow-xl shadow-orange-100 active:scale-95"
              >
                <ShoppingCart size={18} />
                <span className="font-bold">Acheter maintenant</span>
              </a>
              
            </div>
          </div>
        </div>
      )}
    </>
  )
}