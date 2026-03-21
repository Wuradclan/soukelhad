// lib/instagram.ts

export async function getInstagramMedia(userAccessToken: string) {
    try {
      // 1. Récupérer les pages Facebook de l'utilisateur
      const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`);
      const pagesData = await pagesRes.json();
  
      if (!pagesData.data || pagesData.data.length === 0) {
        throw new Error("Aucune page Facebook trouvée pour cet utilisateur.");
      }
  
      let igAccountId = null;
  
      // 2. Chercher la première page qui possède un compte Instagram Business/Creator lié
      for (const page of pagesData.data) {
        const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${userAccessToken}`);
        const igData = await igRes.json();
  
        if (igData.instagram_business_account) {
          igAccountId = igData.instagram_business_account.id;
          break; // On a trouvé le compte, on sort de la boucle
        }
      }
  
      if (!igAccountId) {
        throw new Error("Aucun compte Instagram Professionnel n'est lié à ces pages Facebook.");
      }
  
      // 3. Récupérer les médias (photos/vidéos) du compte Instagram
      // On demande spécifiquement thumbnail_url pour que les vidéos aient une image de couverture
      const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=9&access_token=${userAccessToken}`);
      const mediaData = await mediaRes.json();
  
      return mediaData.data; // Retourne le tableau des 9 derniers posts
  
    } catch (error) {
      console.error("Erreur Fetch Instagram:", error);
      return null; // En cas d'erreur, on retourne null pour ne pas faire planter la page
    }
  }