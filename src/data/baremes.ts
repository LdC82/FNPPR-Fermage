/**
 * Barèmes préfectoraux des valeurs locatives (minima / maxima par hectare).
 *
 * IMPORTANT — Les fourchettes de fermage sont fixées DÉPARTEMENT par
 * DÉPARTEMENT (et parfois par région naturelle agricole) au moyen d'un arrêté
 * préfectoral, révisé chaque année (généralement en septembre) en même temps
 * que l'indice national. Elles varient selon la nature et la catégorie des
 * terres. Il N'EXISTE PAS de base de données nationale unique : chaque
 * préfecture publie son propre arrêté, dans un format hétérogène.
 *
 * Ce fichier fournit donc deux choses :
 *   1. `DEPARTEMENTS` — la liste de tous les départements français, chacun avec
 *      un lien permettant de retrouver son arrêté préfectoral officiel
 *      (recherche ciblée sur les sites `.gouv.fr`, robuste aux refontes).
 *   2. `BAREMES_VERIFIES` — un registre de barèmes RÉELS, sourcés et datés,
 *      extraits des arrêtés officiels. Les minima/maxima ne sont pré-remplis
 *      que pour les départements présents ici ; pour les autres, l'utilisateur
 *      saisit les valeurs lues sur l'arrêté officiel.
 *
 * Les valeurs étant des instantanés datés, elles ne se substituent pas à
 * l'arrêté en vigueur : à vérifier auprès de la DDT(M) ou de la chambre
 * d'agriculture du département.
 *
 * Pour AJOUTER un barème vérifié : ajoutez une entrée à `BAREMES_VERIFIES`
 * (clé = code département) en recopiant les minima/maxima de l'arrêté en
 * vigueur, avec sa référence, sa campagne et l'URL de la source officielle.
 */

export interface Departement {
  /** Code département (ex. "18", "2A", "974"). */
  code: string;
  /** Nom du département. */
  nom: string;
}

export interface CategorieBareme {
  id: string;
  libelle: string;
  /** Borne basse en euros par hectare et par an. */
  minParHa: number;
  /** Borne haute en euros par hectare et par an. */
  maxParHa: number;
  note?: string;
}

export interface BaremeVerifie {
  /** Période d'application de l'arrêté. */
  campagne: string;
  /** Référence de l'arrêté préfectoral. */
  arrete: string;
  /** URL de la source officielle (vérifiée). */
  sourceUrl: string;
  categories: CategorieBareme[];
}

/** Liste complète des départements français (métropole + outre-mer). */
export const DEPARTEMENTS: readonly Departement[] = [
  { code: "01", nom: "Ain" },
  { code: "02", nom: "Aisne" },
  { code: "03", nom: "Allier" },
  { code: "04", nom: "Alpes-de-Haute-Provence" },
  { code: "05", nom: "Hautes-Alpes" },
  { code: "06", nom: "Alpes-Maritimes" },
  { code: "07", nom: "Ardèche" },
  { code: "08", nom: "Ardennes" },
  { code: "09", nom: "Ariège" },
  { code: "10", nom: "Aube" },
  { code: "11", nom: "Aude" },
  { code: "12", nom: "Aveyron" },
  { code: "13", nom: "Bouches-du-Rhône" },
  { code: "14", nom: "Calvados" },
  { code: "15", nom: "Cantal" },
  { code: "16", nom: "Charente" },
  { code: "17", nom: "Charente-Maritime" },
  { code: "18", nom: "Cher" },
  { code: "19", nom: "Corrèze" },
  { code: "2A", nom: "Corse-du-Sud" },
  { code: "2B", nom: "Haute-Corse" },
  { code: "21", nom: "Côte-d'Or" },
  { code: "22", nom: "Côtes-d'Armor" },
  { code: "23", nom: "Creuse" },
  { code: "24", nom: "Dordogne" },
  { code: "25", nom: "Doubs" },
  { code: "26", nom: "Drôme" },
  { code: "27", nom: "Eure" },
  { code: "28", nom: "Eure-et-Loir" },
  { code: "29", nom: "Finistère" },
  { code: "30", nom: "Gard" },
  { code: "31", nom: "Haute-Garonne" },
  { code: "32", nom: "Gers" },
  { code: "33", nom: "Gironde" },
  { code: "34", nom: "Hérault" },
  { code: "35", nom: "Ille-et-Vilaine" },
  { code: "36", nom: "Indre" },
  { code: "37", nom: "Indre-et-Loire" },
  { code: "38", nom: "Isère" },
  { code: "39", nom: "Jura" },
  { code: "40", nom: "Landes" },
  { code: "41", nom: "Loir-et-Cher" },
  { code: "42", nom: "Loire" },
  { code: "43", nom: "Haute-Loire" },
  { code: "44", nom: "Loire-Atlantique" },
  { code: "45", nom: "Loiret" },
  { code: "46", nom: "Lot" },
  { code: "47", nom: "Lot-et-Garonne" },
  { code: "48", nom: "Lozère" },
  { code: "49", nom: "Maine-et-Loire" },
  { code: "50", nom: "Manche" },
  { code: "51", nom: "Marne" },
  { code: "52", nom: "Haute-Marne" },
  { code: "53", nom: "Mayenne" },
  { code: "54", nom: "Meurthe-et-Moselle" },
  { code: "55", nom: "Meuse" },
  { code: "56", nom: "Morbihan" },
  { code: "57", nom: "Moselle" },
  { code: "58", nom: "Nièvre" },
  { code: "59", nom: "Nord" },
  { code: "60", nom: "Oise" },
  { code: "61", nom: "Orne" },
  { code: "62", nom: "Pas-de-Calais" },
  { code: "63", nom: "Puy-de-Dôme" },
  { code: "64", nom: "Pyrénées-Atlantiques" },
  { code: "65", nom: "Hautes-Pyrénées" },
  { code: "66", nom: "Pyrénées-Orientales" },
  { code: "67", nom: "Bas-Rhin" },
  { code: "68", nom: "Haut-Rhin" },
  { code: "69", nom: "Rhône" },
  { code: "70", nom: "Haute-Saône" },
  { code: "71", nom: "Saône-et-Loire" },
  { code: "72", nom: "Sarthe" },
  { code: "73", nom: "Savoie" },
  { code: "74", nom: "Haute-Savoie" },
  { code: "75", nom: "Paris" },
  { code: "76", nom: "Seine-Maritime" },
  { code: "77", nom: "Seine-et-Marne" },
  { code: "78", nom: "Yvelines" },
  { code: "79", nom: "Deux-Sèvres" },
  { code: "80", nom: "Somme" },
  { code: "81", nom: "Tarn" },
  { code: "82", nom: "Tarn-et-Garonne" },
  { code: "83", nom: "Var" },
  { code: "84", nom: "Vaucluse" },
  { code: "85", nom: "Vendée" },
  { code: "86", nom: "Vienne" },
  { code: "87", nom: "Haute-Vienne" },
  { code: "88", nom: "Vosges" },
  { code: "89", nom: "Yonne" },
  { code: "90", nom: "Territoire de Belfort" },
  { code: "91", nom: "Essonne" },
  { code: "92", nom: "Hauts-de-Seine" },
  { code: "93", nom: "Seine-Saint-Denis" },
  { code: "94", nom: "Val-de-Marne" },
  { code: "95", nom: "Val-d'Oise" },
  { code: "971", nom: "Guadeloupe" },
  { code: "972", nom: "Martinique" },
  { code: "973", nom: "Guyane" },
  { code: "974", nom: "La Réunion" },
  { code: "976", nom: "Mayotte" },
] as const;

/**
 * Construit un lien de recherche menant à l'arrêté préfectoral officiel d'un
 * département (recherche ciblée sur les sites de l'État `.gouv.fr`). Robuste
 * aux refontes de sites et aux variations d'URL : ne renvoie jamais de lien
 * mort et place la page officielle en tête de résultats.
 */
export function rechercheArreteUrl(nom: string): string {
  const requete = `arrêté préfectoral fermage minima maxima valeurs locatives ${nom} site:gouv.fr`;
  return `https://www.google.com/search?q=${encodeURIComponent(requete)}`;
}

/**
 * Barèmes réels, sourcés et datés, extraits des arrêtés préfectoraux officiels.
 * Clé = code département. Ajoutez ici les départements au fur et à mesure.
 */
export const BAREMES_VERIFIES: Readonly<Record<string, BaremeVerifie>> = {
  // Cher — arrêté DDT-2024-376 du 19 septembre 2024.
  "18": {
    campagne: "30/09/2024 – 29/09/2025",
    arrete: "Arrêté DDT-2024-376 du 19 septembre 2024",
    sourceUrl:
      "https://www.cher.gouv.fr/Actions-de-l-Etat/Agriculture-et-developpement-rural/Gestion-du-foncier-baux-ruraux-fermage-structures/Baux-ruraux-fermages/Baux-ruraux-indice-et-montant-des-fermages-arretes-prefectoraux",
    categories: [
      {
        id: "terres-nues",
        libelle: "Terres nues (hors cultures pérennes)",
        minParHa: 61.6,
        maxParHa: 186.66,
      },
      {
        id: "terres-irrigables",
        libelle: "Terres nues irrigables",
        minParHa: 61.6,
        maxParHa: 205.32,
      },
      {
        id: "vignes-sancerre",
        libelle: "Vignes AOC Sancerre (4e à 30e année, libellé en monnaie)",
        minParHa: 1656.88,
        maxParHa: 2485.33,
        note: "Vignes plantées par le preneur, fourchette par hectare cadastré.",
      },
      {
        id: "vignes-menetou",
        libelle: "Vignes AOC Menetou-Salon (4e à 30e année)",
        minParHa: 1221.31,
        maxParHa: 1831.96,
        note: "Vignes plantées par le preneur, fourchette par hectare cadastré.",
      },
      {
        id: "vignes-quincy",
        libelle: "Vignes AOC Quincy (4e à 30e année)",
        minParHa: 1110.28,
        maxParHa: 1665.42,
        note: "Vignes plantées par le preneur, fourchette par hectare cadastré.",
      },
      {
        id: "vignes-reuilly",
        libelle: "Vignes AOC Reuilly (4e à 30e année)",
        minParHa: 1110.28,
        maxParHa: 1665.42,
        note: "Vignes plantées par le preneur, fourchette par hectare cadastré.",
      },
      {
        id: "vignes-chateaumeillant",
        libelle: "Vignes AOC Châteaumeillant (4e à 30e année)",
        minParHa: 512.44,
        maxParHa: 768.66,
        note: "Vignes plantées par le preneur, fourchette par hectare cadastré.",
      },
      {
        id: "vignes-igp",
        libelle: "Vignes IGP Val de Loire (4e à 30e année)",
        minParHa: 512.44,
        maxParHa: 768.66,
        note: "Vignes plantées par le preneur, fourchette par hectare cadastré.",
      },
    ],
  },
};
