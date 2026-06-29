import { useMemo, useState } from "react";
import { controleBornesPrefectorales } from "../lib/fermage";
import { formaterEuros, formaterNombre } from "../lib/format";

const LIBELLE_CONFORMITE = {
  conforme: "Loyer conforme à la fourchette",
  inferieur: "Loyer inférieur au minimum autorisé",
  superieur: "Loyer supérieur au maximum autorisé",
} as const;

export function BornesPrefectorales() {
  const [surface, setSurface] = useState("10");
  const [minHa, setMinHa] = useState("80");
  const [maxHa, setMaxHa] = useState("180");
  const [loyer, setLoyer] = useState("1500");

  const calcul = useMemo(() => {
    const s = Number(surface.replace(",", "."));
    const min = Number(minHa.replace(",", "."));
    const max = Number(maxHa.replace(",", "."));
    const l = Number(loyer.replace(",", "."));
    if ([s, min, max, l].some((n) => Number.isNaN(n))) {
      return { erreur: "Renseignez des valeurs numériques valides." };
    }
    try {
      return { resultat: controleBornesPrefectorales(s, min, max, l) };
    } catch (e) {
      return { erreur: e instanceof Error ? e.message : "Erreur de calcul." };
    }
  }, [surface, minHa, maxHa, loyer]);

  return (
    <section className="card" aria-labelledby="titre-bornes">
      <h2 id="titre-bornes">Contrôle des bornes préfectorales</h2>
      <p className="intro">
        Le loyer d'un bail rural doit rester dans la fourchette (minimum /
        maximum par hectare) fixée par l'<strong>arrêté préfectoral</strong> de
        votre département, selon la nature et la catégorie des terres. Saisissez
        les bornes de votre arrêté pour vérifier la conformité d'un loyer.
      </p>

      <div className="grille">
        <div className="champ">
          <label htmlFor="surface">Surface louée (ha)</label>
          <input
            id="surface"
            inputMode="decimal"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
          />
        </div>
        <div className="champ">
          <label htmlFor="min-ha">Minimum (€/ha/an)</label>
          <span className="aide">Borne basse de l'arrêté</span>
          <input
            id="min-ha"
            inputMode="decimal"
            value={minHa}
            onChange={(e) => setMinHa(e.target.value)}
          />
        </div>
        <div className="champ">
          <label htmlFor="max-ha">Maximum (€/ha/an)</label>
          <span className="aide">Borne haute de l'arrêté</span>
          <input
            id="max-ha"
            inputMode="decimal"
            value={maxHa}
            onChange={(e) => setMaxHa(e.target.value)}
          />
        </div>
        <div className="champ">
          <label htmlFor="loyer-propose">Loyer à vérifier (€/an)</label>
          <span className="aide">Montant total proposé</span>
          <input
            id="loyer-propose"
            inputMode="decimal"
            value={loyer}
            onChange={(e) => setLoyer(e.target.value)}
          />
        </div>
      </div>

      {"erreur" in calcul && calcul.erreur ? (
        <p className="erreur">{calcul.erreur}</p>
      ) : (
        "resultat" in calcul &&
        calcul.resultat && (
          <div className="resultat">
            <span className={`badge ${calcul.resultat.conformite}`}>
              {LIBELLE_CONFORMITE[calcul.resultat.conformite]}
            </span>

            <div className="detail-calcul" style={{ marginTop: "1rem" }}>
              <div>
                Fourchette autorisée pour {formaterNombre(calcul.resultat.surfaceHa)}{" "}
                ha :{" "}
                <strong>
                  {formaterEuros(calcul.resultat.minTotal)} —{" "}
                  {formaterEuros(calcul.resultat.maxTotal)}
                </strong>{" "}
                / an
              </div>
              <div style={{ marginTop: "0.4rem" }}>
                Loyer proposé : {formaterEuros(calcul.resultat.loyerPropose)} /an
                — soit{" "}
                <strong>
                  {formaterEuros(calcul.resultat.loyerProposeParHa)} /ha/an
                </strong>
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
}
