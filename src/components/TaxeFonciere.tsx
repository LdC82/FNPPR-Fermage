import { useMemo, useState } from "react";
import {
  calculerLigneTaxe,
  totalImputePreneur,
  totalMontant,
  PARAMS_DEGREVEMENT_2025,
  type MethodeTaxe,
  type ResultatTaxe,
} from "../lib/taxeFonciere";
import { formaterEuros } from "../lib/format";

type CalculTaxe =
  | { erreur: string }
  | {
      resultats: { ligne: LigneUI; res: ResultatTaxe }[];
      totalPreneur: number;
      totalGeneral: number;
    };

interface LigneUI {
  id: string;
  libelle: string;
  methode: MethodeTaxe;
  montantAppele: string;
  partExploitant: string; // %
  tauxBail: string; // %
  fraisDeRole: string; // %
}

const LIGNES_INITIALES: LigneUI[] = [
  {
    id: "commune",
    libelle: "TFNB – part communale",
    methode: "tfnb",
    montantAppele: "200",
    partExploitant: "100",
    tauxBail: "20",
    fraisDeRole: "3",
  },
  {
    id: "interco",
    libelle: "TFNB – part intercommunale",
    methode: "tfnb",
    montantAppele: "0",
    partExploitant: "100",
    tauxBail: "20",
    fraisDeRole: "3",
  },
  {
    id: "chambre",
    libelle: "Frais de chambre d'agriculture",
    methode: "simple",
    montantAppele: "0",
    partExploitant: "100",
    tauxBail: "50",
    fraisDeRole: "8",
  },
  {
    id: "gemapi",
    libelle: "Taxe GEMAPI",
    methode: "simple",
    montantAppele: "0",
    partExploitant: "100",
    tauxBail: "0",
    fraisDeRole: "3",
  },
  {
    id: "remembrement",
    libelle: "Taxe de remembrement",
    methode: "simple",
    montantAppele: "0",
    partExploitant: "100",
    tauxBail: "0",
    fraisDeRole: "3",
  },
];

const num = (s: string) => Number(s.replace(",", ".").trim());

export function TaxeFonciere() {
  const [lignes, setLignes] = useState<LigneUI[]>(LIGNES_INITIALES);
  const [tauxDegrevement, setTauxDegrevement] = useState("30");
  const [coefficient, setCoefficient] = useState("1.43");

  function maj(id: string, champ: keyof LigneUI, valeur: string) {
    setLignes((arr) =>
      arr.map((l) => (l.id === id ? { ...l, [champ]: valeur } : l)),
    );
  }

  const calcul = useMemo<CalculTaxe>(() => {
    const params = {
      tauxDegrevement: num(tauxDegrevement) / 100,
      coefficientCorrecteur: num(coefficient),
    };
    if (!Number.isFinite(params.tauxDegrevement) || !Number.isFinite(params.coefficientCorrecteur)) {
      return { erreur: "Paramètres réglementaires invalides." };
    }
    try {
      const resultats = lignes.map((l) => {
        const res = calculerLigneTaxe(
          {
            montantAppele: num(l.montantAppele),
            partExploitant: num(l.partExploitant) / 100,
            tauxBail: num(l.tauxBail) / 100,
            fraisDeRole: num(l.fraisDeRole) / 100,
          },
          l.methode,
          params,
        );
        return { ligne: l, res };
      });
      return {
        resultats,
        totalPreneur: totalImputePreneur(resultats.map((r) => r.res)),
        totalGeneral: totalMontant(resultats.map((r) => r.res)),
      };
    } catch (e) {
      return { erreur: e instanceof Error ? e.message : "Erreur de calcul." };
    }
  }, [lignes, tauxDegrevement, coefficient]);

  return (
    <section className="card" aria-labelledby="titre-taxe">
      <h2 id="titre-taxe">Répartition de la taxe foncière (preneur / bailleur)</h2>
      <p className="intro">
        La taxe foncière est payée par le <strong>bailleur</strong>, mais le bail
        peut prévoir que le <strong>preneur</strong> en rembourse une part.
        Depuis 2006, les terres agricoles bénéficient d'un{" "}
        <strong>dégrèvement</strong> sur la part communale et intercommunale de
        la taxe foncière non bâtie (TFNB) au profit du preneur ; la loi
        n°2025-127 du 14/02/2025 l'a porté de 20 % à <strong>30 %</strong>.
      </p>

      {/* Paramètres réglementaires */}
      <div className="info" style={{ marginBottom: "1rem" }}>
        <strong>Paramètres réglementaires (réforme 2025).</strong> Le dégrèvement
        de 30 % s'applique aux parts communale et intercommunale de la TFNB ; le
        coefficient correcteur (1,43 = 100 ÷ 70) reconstitue la taxe théorique à
        partir du montant appelé (base abattue de 30 %).
        <div className="grille" style={{ marginTop: "0.75rem" }}>
          <div className="champ">
            <label htmlFor="degrevement">Taux de dégrèvement preneur (%)</label>
            <input
              id="degrevement"
              inputMode="decimal"
              value={tauxDegrevement}
              onChange={(e) => setTauxDegrevement(e.target.value)}
            />
          </div>
          <div className="champ">
            <label htmlFor="coef">Coefficient correcteur</label>
            <input
              id="coef"
              inputMode="decimal"
              value={coefficient}
              onChange={(e) => setCoefficient(e.target.value)}
            />
          </div>
        </div>
      </div>

      {"erreur" in calcul && calcul.erreur && (
        <p className="erreur">{calcul.erreur}</p>
      )}

      {"resultats" in calcul &&
        calcul.resultats.map(({ ligne, res }) => (
          <div className="taxe-bloc" key={ligne.id}>
            <div className="taxe-bloc-titre">
              <span>{ligne.libelle}</span>
              <span className={`badge ${ligne.methode === "tfnb" ? "conforme" : "inferieur"}`}>
                {ligne.methode === "tfnb" ? "TFNB · dégrèvement 2025" : "taxe annexe"}
              </span>
            </div>

            <div className="grille">
              <div className="champ">
                <label htmlFor={`ma-${ligne.id}`}>Montant appelé (€)</label>
                <span className="aide">Montant sur l'avis d'imposition</span>
                <input
                  id={`ma-${ligne.id}`}
                  inputMode="decimal"
                  value={ligne.montantAppele}
                  onChange={(e) => maj(ligne.id, "montantAppele", e.target.value)}
                />
              </div>
              <div className="champ">
                <label htmlFor={`pe-${ligne.id}`}>Part exploitée (%)</label>
                <span className="aide">Surface louée (relevé de propriété)</span>
                <input
                  id={`pe-${ligne.id}`}
                  inputMode="decimal"
                  value={ligne.partExploitant}
                  onChange={(e) => maj(ligne.id, "partExploitant", e.target.value)}
                />
              </div>
              <div className="champ">
                <label htmlFor={`tb-${ligne.id}`}>Taux du bail (%)</label>
                <span className="aide">Remboursement prévu au bail</span>
                <input
                  id={`tb-${ligne.id}`}
                  inputMode="decimal"
                  value={ligne.tauxBail}
                  onChange={(e) => maj(ligne.id, "tauxBail", e.target.value)}
                />
              </div>
              <div className="champ">
                <label htmlFor={`fr-${ligne.id}`}>Frais de rôle (%)</label>
                <span className="aide">{ligne.methode === "tfnb" ? "si taux > dégrèvement" : "frais de recouvrement"}</span>
                <input
                  id={`fr-${ligne.id}`}
                  inputMode="decimal"
                  value={ligne.fraisDeRole}
                  onChange={(e) => maj(ligne.id, "fraisDeRole", e.target.value)}
                />
              </div>
            </div>

            <div className="taxe-resultat">
              <span>
                Montant total : <strong>{formaterEuros(res.montantTotal)}</strong>
              </span>
              {res.imputePreneur < 0 ? (
                <span className="taxe-faveur">
                  En faveur du preneur (réduction de fermage) :{" "}
                  <strong>{formaterEuros(res.imputePreneur)}</strong>
                </span>
              ) : (
                <span>
                  Imputé au preneur :{" "}
                  <strong className="pos">{formaterEuros(res.imputePreneur)}</strong>
                </span>
              )}
              <span>
                Reste au bailleur : <strong>{formaterEuros(res.resteBailleur)}</strong>
              </span>
            </div>
          </div>
        ))}

      {"resultats" in calcul && (
        <div className="resultat">
          <div className="legende" style={{ marginBottom: "0.4rem" }}>
            Total des taxes (surface louée) : {formaterEuros(calcul.totalGeneral)}
          </div>
          <div className="montant-principal">
            {formaterEuros(calcul.totalPreneur)}
          </div>
          <div className="legende">
            {calcul.totalPreneur >= 0
              ? "À rembourser par le preneur au bailleur (toutes taxes)."
              : "En faveur du preneur : réduction nette de fermage (toutes taxes)."}{" "}
            Part restant à la charge du bailleur :{" "}
            <strong>
              {formaterEuros(calcul.totalGeneral - calcul.totalPreneur)}
            </strong>
            .
          </div>
        </div>
      )}

      {/* Explication détaillée */}
      <details className="explication">
        <summary>Comment ce calcul fonctionne-t-il&nbsp;?</summary>
        <p>
          <strong>TFNB (parts communale et intercommunale)</strong> — méthode
          de la réforme 2025 :
        </p>
        <p className="formule">
          Imputé au preneur = Montant total × (Taux du bail − Taux de
          dégrèvement) × Coefficient correcteur × (1 + frais de rôle si Taux du
          bail &gt; dégrèvement)
        </p>
        <ul>
          <li>
            <strong>Taux du bail &lt; 30 %</strong> : résultat négatif →{" "}
            <em>réduction du fermage</em> en faveur du preneur.
          </li>
          <li>
            <strong>Taux du bail = 30 %</strong> : aucun versement réciproque
            (le dégrèvement compense le remboursement prévu).
          </li>
          <li>
            <strong>Taux du bail &gt; 30 %</strong> : remboursement du preneur au
            bailleur, majoré des frais de rôle.
          </li>
        </ul>
        <p>
          <strong>Autres taxes</strong> (chambre d'agriculture, GEMAPI,
          remembrement…), non concernées par le dégrèvement :
        </p>
        <p className="formule">
          Imputé au preneur = Montant total × Taux du bail × (1 + frais de rôle)
        </p>
        <p>
          Le <strong>montant total</strong> est l'assiette pour la surface louée
          = Montant appelé × Part exploitée. Pour la chambre d'agriculture, la
          loi prévoit en pratique un remboursement de 50 % majoré de 8 % de frais
          de rôle.
        </p>
      </details>

      <p className="intro" style={{ marginTop: "1.25rem", marginBottom: 0, fontSize: "0.82rem" }}>
        Source : Fédération Nationale de la Propriété Privée Rurale — loi
        n°2025-127 du 14/02/2025, art. L415-3 du Code rural et de la pêche
        maritime. Calcul indicatif, à adapter aux clauses de votre bail. Valeurs
        de référence 2025 : dégrèvement {PARAMS_DEGREVEMENT_2025.tauxDegrevement * 100}
        %, coefficient {PARAMS_DEGREVEMENT_2025.coefficientCorrecteur}.
      </p>
    </section>
  );
}
