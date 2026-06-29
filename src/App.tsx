import { useState } from "react";
import { IndexationCalculator } from "./components/IndexationCalculator";
import { BornesPrefectorales } from "./components/BornesPrefectorales";
import { DenreesConverter } from "./components/DenreesConverter";
import { IndicesTable } from "./components/IndicesTable";
import { ANNEE_MAX } from "./data/indices";

type Onglet = "indexation" | "bornes" | "denrees" | "indices";

const ONGLETS: { id: Onglet; libelle: string }[] = [
  { id: "indexation", libelle: "Réévaluation" },
  { id: "bornes", libelle: "Bornes préfectorales" },
  { id: "denrees", libelle: "Conversion denrées" },
  { id: "indices", libelle: "Tableau des indices" },
];

export function App() {
  const [onglet, setOnglet] = useState<Onglet>("indexation");

  return (
    <>
      <header className="app-header">
        <div className="inner">
          <span className="logo" aria-hidden="true">
            🌾
          </span>
          <div>
            <h1>Calculateur de fermage</h1>
            <p>
              Pour les propriétaires ruraux — réévaluation selon l'indice
              national, bornes préfectorales et conversion des baux en denrées.
            </p>
          </div>
        </div>
      </header>

      <main>
        <nav className="tabs" aria-label="Modules de calcul">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              className={onglet === o.id ? "active" : undefined}
              onClick={() => setOnglet(o.id)}
              aria-pressed={onglet === o.id}
            >
              {o.libelle}
            </button>
          ))}
        </nav>

        {onglet === "indexation" && <IndexationCalculator />}
        {onglet === "bornes" && <BornesPrefectorales />}
        {onglet === "denrees" && <DenreesConverter />}
        {onglet === "indices" && <IndicesTable />}
      </main>

      <footer className="app-footer">
        <div className="avertissement">
          <strong>Avertissement.</strong> Ce calculateur est fourni à titre
          indicatif. Les montants obtenus ne se substituent pas aux arrêtés
          préfectoraux ni à la réglementation en vigueur (Code rural et de la
          pêche maritime, art. L411-11 et suivants). En cas de doute, rapprochez-vous
          de votre chambre d'agriculture, d'un notaire ou des services de l'État.
        </div>
        <p style={{ margin: "0 0 0.3rem" }}>
          <strong>Sources des indices</strong> (mis à jour jusqu'à l'indice{" "}
          {ANNEE_MAX}) :
        </p>
        <ul>
          <li>
            Arrêté du 23 juillet 2025 constatant l'indice national des fermages
            2025 —{" "}
            <a
              href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051987943"
              target="_blank"
              rel="noopener noreferrer"
            >
              Légifrance
            </a>
          </li>
          <li>
            Arrêté du 17 juillet 2024 constatant l'indice national des fermages
            2024 —{" "}
            <a
              href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050058521"
              target="_blank"
              rel="noopener noreferrer"
            >
              Légifrance
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
}
