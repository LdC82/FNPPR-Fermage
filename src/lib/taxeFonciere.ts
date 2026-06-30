/**
 * Répartition de la taxe foncière (et taxes annexes) entre le preneur et le
 * bailleur d'un bail rural — d'après le tableau FNPPR « Taxes annexes au bail
 * rural », intégrant la réforme du dégrèvement de TFNB de 2025.
 *
 * Principe (art. L415-3 du Code rural et de la pêche maritime) :
 *  - La taxe foncière est due par le BAILLEUR (propriétaire), qui la paie à
 *    l'administration.
 *  - Le bail peut prévoir que le PRENEUR (exploitant) en rembourse une part.
 *  - Depuis 2006, les terres agricoles bénéficient d'un dégrèvement permanent
 *    sur la part communale et intercommunale de la taxe foncière sur les
 *    propriétés non bâties (TFNB), au profit du preneur. La loi n°2025-127 du
 *    14/02/2025 porte ce dégrèvement de 20 % à 30 %.
 *
 * Deux méthodes de calcul du montant imputé au preneur :
 *  - « tfnb »   : parts communale et intercommunale de la TFNB (réforme 2025).
 *       imputé = Montant total × (Taux du bail − Taux de dégrèvement)
 *                × Coefficient correcteur
 *                × (1 + frais de rôle SI Taux du bail > Taux de dégrèvement)
 *       Résultat négatif = réduction du fermage en faveur du preneur ;
 *       positif = remboursement du preneur au bailleur.
 *  - « simple » : autres taxes (chambre d'agriculture, GEMAPI, remembrement…),
 *       non concernées par le dégrèvement.
 *       imputé = Montant total × Taux du bail × (1 + frais de rôle)
 *
 * Montant total (assiette pour la surface louée) = Montant appelé × Part exploitée.
 */

import { arrondir } from "./fermage";

/** Paramètres réglementaires du dégrèvement de TFNB. */
export interface ParametresDegrevement {
  /** Taux de dégrèvement au profit du preneur (fraction, ex. 0,30 = 30 %). */
  tauxDegrevement: number;
  /** Coefficient correcteur reconstituant la taxe théorique (ex. 1,43). */
  coefficientCorrecteur: number;
}

/** Valeurs en vigueur depuis la loi n°2025-127 du 14/02/2025. */
export const PARAMS_DEGREVEMENT_2025: ParametresDegrevement = {
  tauxDegrevement: 0.3,
  coefficientCorrecteur: 1.43,
};

/** Valeurs antérieures à 2025 (pour mémoire). */
export const PARAMS_DEGREVEMENT_AVANT_2025: ParametresDegrevement = {
  tauxDegrevement: 0.2,
  coefficientCorrecteur: 1.25,
};

export type MethodeTaxe = "tfnb" | "simple";

export interface SaisieTaxe {
  /** Montant de la taxe appelé sur l'avis d'imposition (€). */
  montantAppele: number;
  /** Part de la parcelle effectivement louée/exploitée (fraction 0..1). */
  partExploitant: number;
  /** Taux contractuel de remboursement prévu au bail (fraction 0..1). */
  tauxBail: number;
  /** Frais de rôle (fraction, ex. 0,03 = 3 %). */
  fraisDeRole: number;
}

export interface ResultatTaxe {
  /** Assiette pour la surface louée = montant appelé × part exploitée. */
  montantTotal: number;
  /** Montant imputé au preneur (négatif possible en méthode « tfnb »). */
  imputePreneur: number;
  /** Montant restant à la charge du bailleur = total − imputé au preneur. */
  resteBailleur: number;
}

/**
 * Calcule la répartition d'une taxe entre preneur et bailleur.
 * @throws si les valeurs sont invalides.
 */
export function calculerLigneTaxe(
  saisie: SaisieTaxe,
  methode: MethodeTaxe,
  params: ParametresDegrevement = PARAMS_DEGREVEMENT_2025,
): ResultatTaxe {
  const { montantAppele, partExploitant, tauxBail, fraisDeRole } = saisie;
  for (const v of [montantAppele, partExploitant, tauxBail, fraisDeRole]) {
    if (!Number.isFinite(v)) {
      throw new Error("Toutes les valeurs doivent être numériques.");
    }
  }
  if (montantAppele < 0) {
    throw new Error("Le montant appelé doit être positif.");
  }

  const montantTotal = arrondir(montantAppele * partExploitant, 2);

  let imputePreneur: number;
  if (methode === "tfnb") {
    const majoration = tauxBail > params.tauxDegrevement ? fraisDeRole : 0;
    imputePreneur = arrondir(
      montantTotal *
        (tauxBail - params.tauxDegrevement) *
        params.coefficientCorrecteur *
        (1 + majoration),
      2,
    );
  } else {
    imputePreneur = arrondir(montantTotal * tauxBail * (1 + fraisDeRole), 2);
  }

  return {
    montantTotal,
    imputePreneur,
    resteBailleur: arrondir(montantTotal - imputePreneur, 2),
  };
}

/** Somme des montants imputés au preneur sur plusieurs lignes de taxe. */
export function totalImputePreneur(resultats: ResultatTaxe[]): number {
  return arrondir(
    resultats.reduce((s, r) => s + r.imputePreneur, 0),
    2,
  );
}

/** Somme des montants totaux (toutes taxes, surface louée). */
export function totalMontant(resultats: ResultatTaxe[]): number {
  return arrondir(
    resultats.reduce((s, r) => s + r.montantTotal, 0),
    2,
  );
}
