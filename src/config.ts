/**
 * Configuration de l'accès au site.
 *
 * Le site est protégé par un mot de passe unique partagé. Pour ne pas exposer
 * le mot de passe en clair dans le dépôt (public), on ne stocke que son
 * empreinte SHA-256 (hash). À la connexion, le hash du mot de passe saisi est
 * comparé à cette valeur.
 *
 * ⚠️ Sécurité : il s'agit d'une protection « de dissuasion ». Le site étant
 * statique, une personne techniquement avertie peut contourner cet écran. Pour
 * une vraie restriction (portail d'authentification), voir Cloudflare Access.
 *
 * POUR CHANGER LE MOT DE PASSE :
 *   1. Calculez l'empreinte SHA-256 du nouveau mot de passe, par exemple :
 *        - en ligne de commande :
 *            node -e "console.log(require('crypto').createHash('sha256').update('VOTRE_MDP').digest('hex'))"
 *        - ou demandez-la simplement, elle vous sera fournie.
 *   2. Remplacez la valeur de MOT_DE_PASSE_HASH ci-dessous.
 *
 * L'empreinte ci-dessous correspond au mot de passe en vigueur, défini avec le
 * propriétaire du site (le mot de passe lui-même n'apparaît pas dans le dépôt).
 */
export const MOT_DE_PASSE_HASH =
  "f8e31d0e8fe6282f8b8ae6e5c490b820734e06d3aa9fc2e179c49d0c89f33922";

/** Clé de stockage de session pour mémoriser le déverrouillage. */
export const CLE_SESSION = "fnppr-fermage-acces";
