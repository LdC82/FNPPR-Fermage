import couvertureUrl from "../assets/revue-ppr.jpg";

const REVUE_URL = "https://www.propriete-rurale.com/la-revue-propriete-privee-rurale/";
const ABONNEMENT_URL =
  "https://www.propriete-rurale.com/produit/abonnement-revue-la-propriete-privee-rurale/";

/**
 * Encart publicitaire (colonne de gauche) pour la revue éditée par la FNPPR,
 * « La Propriété Privée Rurale ». Image et liens issus du site officiel.
 */
export function RevueAd() {
  return (
    <aside className="pub" aria-label="Publicité — Revue La Propriété Privée Rurale">
      <div className="pub-card">
        <span className="pub-mention">La revue de la FNPPR</span>
        <a href={REVUE_URL} target="_blank" rel="noopener noreferrer">
          <img
            src={couvertureUrl}
            alt="Couverture de la revue La Propriété Privée Rurale (n°497)"
            className="pub-couv"
          />
        </a>
        <h2 className="pub-titre">La Propriété Privée Rurale</h2>
        <p className="pub-texte">
          Depuis plus de 40 ans, la revue des propriétaires ruraux : conseils
          juridiques, fiscaux et pratiques. <strong>6 numéros par an.</strong>
        </p>
        <a
          className="pub-bouton"
          href={ABONNEMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          S'abonner
        </a>
        <a className="pub-lien" href={REVUE_URL} target="_blank" rel="noopener noreferrer">
          En savoir plus
        </a>
      </div>
    </aside>
  );
}
