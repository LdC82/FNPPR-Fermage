import { describe, it, expect } from "vitest";
import {
  calculerLigneTaxe,
  totalImputePreneur,
  PARAMS_DEGREVEMENT_2025,
} from "./taxeFonciere";

const pleinePart = { montantAppele: 200, partExploitant: 1 };

describe("calculerLigneTaxe — méthode tfnb (réforme 2025)", () => {
  it("taux du bail < dégrèvement → réduction de fermage (négatif), sans frais de rôle", () => {
    // Exemple du fichier : 200 € à 20 % → 200 × (0,20 − 0,30) × 1,43 = -28,60
    const r = calculerLigneTaxe(
      { ...pleinePart, tauxBail: 0.2, fraisDeRole: 0.03 },
      "tfnb",
    );
    expect(r.imputePreneur).toBeCloseTo(-28.6, 2);
    expect(r.resteBailleur).toBeCloseTo(228.6, 2);
  });

  it("taux du bail > dégrèvement → remboursement preneur, frais de rôle inclus", () => {
    // Exemple du fichier : 200 € à 50 % → 200 × (0,50 − 0,30) × 1,43 × 1,03 = 58,92
    const r = calculerLigneTaxe(
      { ...pleinePart, tauxBail: 0.5, fraisDeRole: 0.03 },
      "tfnb",
    );
    expect(r.imputePreneur).toBeCloseTo(58.92, 2);
    expect(r.resteBailleur).toBeCloseTo(141.08, 2);
  });

  it("taux du bail = dégrèvement → aucun versement réciproque", () => {
    const r = calculerLigneTaxe(
      { ...pleinePart, tauxBail: 0.3, fraisDeRole: 0.03 },
      "tfnb",
    );
    expect(r.imputePreneur).toBe(0);
    expect(r.resteBailleur).toBe(200);
  });

  it("applique la part exploitée à l'assiette", () => {
    const r = calculerLigneTaxe(
      { montantAppele: 400, partExploitant: 0.5, tauxBail: 0.5, fraisDeRole: 0.03 },
      "tfnb",
    );
    expect(r.montantTotal).toBe(200);
    expect(r.imputePreneur).toBeCloseTo(58.92, 2);
  });
});

describe("calculerLigneTaxe — méthode simple", () => {
  it("chambre d'agriculture : 50 % + 8 % de frais de rôle", () => {
    const r = calculerLigneTaxe(
      { montantAppele: 100, partExploitant: 1, tauxBail: 0.5, fraisDeRole: 0.08 },
      "simple",
    );
    // 100 × 0,5 × 1,08 = 54
    expect(r.imputePreneur).toBe(54);
    expect(r.resteBailleur).toBe(46);
  });

  it("taux nul → rien imputé au preneur", () => {
    const r = calculerLigneTaxe(
      { montantAppele: 100, partExploitant: 1, tauxBail: 0, fraisDeRole: 0.03 },
      "simple",
    );
    expect(r.imputePreneur).toBe(0);
    expect(r.resteBailleur).toBe(100);
  });
});

describe("paramètres et totaux", () => {
  it("utilise les paramètres 2025 par défaut (30 % / 1,43)", () => {
    expect(PARAMS_DEGREVEMENT_2025.tauxDegrevement).toBe(0.3);
    expect(PARAMS_DEGREVEMENT_2025.coefficientCorrecteur).toBe(1.43);
  });

  it("totalImputePreneur additionne les lignes", () => {
    const a = calculerLigneTaxe({ ...pleinePart, tauxBail: 0.2, fraisDeRole: 0.03 }, "tfnb");
    const b = calculerLigneTaxe(
      { montantAppele: 100, partExploitant: 1, tauxBail: 0.5, fraisDeRole: 0.08 },
      "simple",
    );
    expect(totalImputePreneur([a, b])).toBeCloseTo(-28.6 + 54, 2);
  });

  it("rejette un montant négatif", () => {
    expect(() =>
      calculerLigneTaxe(
        { montantAppele: -1, partExploitant: 1, tauxBail: 0.5, fraisDeRole: 0.03 },
        "tfnb",
      ),
    ).toThrow();
  });
});
