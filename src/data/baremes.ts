/**
 * Barèmes préfectoraux des valeurs locatives (minima / maxima par hectare).
 *
 * IMPORTANT — Les fourchettes de fermage sont fixées DÉPARTEMENT par
 * DÉPARTEMENT (et parfois par région naturelle) au moyen d'un arrêté
 * préfectoral, révisé chaque année (généralement en septembre) en même temps
 * que l'indice national. Elles varient selon la nature et la catégorie des
 * terres. Il n'existe pas de barème national unique.
 *
 * Ce fichier sert d'amorce : il contient des barèmes réels et sourcés, à
 * utiliser comme presets dans le module « Bornes préfectorales ». Pour les
 * départements absents, l'utilisateur saisit les valeurs de son propre arrêté.
 *
 * Pour AJOUTER un département : ajoutez une entrée à `BAREMES_PREFECTORAUX` en
 * recopiant les minima/maxima de l'arrêté préfectoral en vigueur, avec sa
 * référence, sa campagne et l'URL de la source.
 *
 * Les valeurs étant des instantanés datés, elles ne se substituent pas à
 * l'arrêté en vigueur : à vérifier auprès de la DDT ou de la chambre
 * d'agriculture du département.
 */

export interface CategorieBareme {
  id: string;
  libelle: string;
  /** Borne basse en euros par hectare et par an. */
  minParHa: number;
  /** Borne haute en euros par hectare et par an. */
  maxParHa: number;
  note?: string;
}

export interface BaremeDepartemental {
  /** Code département (ex. "18"). */
  code: string;
  /** Nom du département. */
  departement: string;
  /** Période d'application de l'arrêté. */
  campagne: string;
  /** Référence de l'arrêté préfectoral. */
  arrete: string;
  /** URL de la source officielle. */
  sourceUrl: string;
  categories: CategorieBareme[];
}

export const BAREMES_PREFECTORAUX: readonly BaremeDepartemental[] = [
  {
    code: "18",
    departement: "Cher",
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
        libelle: "Vignes IGP (4e à 30e année)",
        minParHa: 512.44,
        maxParHa: 768.66,
        note: "Vignes plantées par le preneur, fourchette par hectare cadastré.",
      },
    ],
  },
];
