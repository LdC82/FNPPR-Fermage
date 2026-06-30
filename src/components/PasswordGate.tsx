import { useState, type FormEvent, type ReactNode } from "react";
import { MOT_DE_PASSE_HASH, CLE_SESSION } from "../config";
import logoUrl from "../assets/logo-fnppr.jpg";

/** Calcule l'empreinte SHA-256 (hex) d'une chaîne via l'API Web Crypto. */
async function sha256Hex(texte: string): Promise<string> {
  const donnees = new TextEncoder().encode(texte);
  const empreinte = await crypto.subtle.digest("SHA-256", donnees);
  return Array.from(new Uint8Array(empreinte))
    .map((o) => o.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Écran de connexion par mot de passe. Tant que le bon mot de passe n'a pas
 * été saisi, le contenu (children) n'est pas affiché. Le déverrouillage est
 * mémorisé pour la durée de la session (sessionStorage).
 */
export function PasswordGate({ children }: { children: ReactNode }) {
  const [deverrouille, setDeverrouille] = useState(
    () => sessionStorage.getItem(CLE_SESSION) === "ok",
  );
  const [saisie, setSaisie] = useState("");
  const [erreur, setErreur] = useState(false);
  const [verification, setVerification] = useState(false);

  if (deverrouille) {
    return <>{children}</>;
  }

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setVerification(true);
    setErreur(false);
    const hash = await sha256Hex(saisie);
    if (hash === MOT_DE_PASSE_HASH) {
      sessionStorage.setItem(CLE_SESSION, "ok");
      setDeverrouille(true);
    } else {
      setErreur(true);
      setSaisie("");
    }
    setVerification(false);
  }

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={soumettre}>
        <img className="gate-logo" src={logoUrl} alt="Logo FNPPR" />
        <h1>Accès réservé</h1>
        <p>Ce calculateur de fermage est protégé. Saisissez le mot de passe.</p>

        <label htmlFor="gate-mdp" className="gate-label">
          Mot de passe
        </label>
        <input
          id="gate-mdp"
          type="password"
          value={saisie}
          autoFocus
          autoComplete="current-password"
          onChange={(e) => {
            setSaisie(e.target.value);
            setErreur(false);
          }}
        />

        {erreur && (
          <p className="gate-erreur" role="alert">
            Mot de passe incorrect.
          </p>
        )}

        <button type="submit" disabled={verification || saisie.length === 0}>
          {verification ? "Vérification…" : "Entrer"}
        </button>
      </form>
    </div>
  );
}
