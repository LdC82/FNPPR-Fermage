# FNPPR-Fermage — Calculateur de fermage

Application web destinée aux **propriétaires ruraux** pour calculer et
contrôler les fermages (loyers des baux ruraux). Construite en **React + Vite +
TypeScript**, sans backend : tout est calculé côté navigateur et peut être
hébergé sur n'importe quel hébergement statique (GitHub Pages, Netlify…).

## Fonctionnalités

1. **Réévaluation annuelle** — applique l'indice national des fermages :
   `nouveau loyer = loyer initial × (indice année d'arrivée / indice année de départ)`,
   avec le détail du calcul et un **historique année par année**.
2. **Bornes préfectorales** — vérifie qu'un loyer respecte la fourchette
   (minimum / maximum par hectare) fixée par l'arrêté préfectoral du
   département, pour une surface donnée. Des **barèmes pré-remplis** par
   département sont proposés (voir ci-dessous), avec saisie manuelle possible.
3. **Conversion en denrées** — convertit un ancien bail exprimé en denrées
   (quintaux de blé, hectolitres de vin…) en montant annuel en euros.
4. **Tableau des indices** — l'indice national des fermages de 2009 à 2025.

## L'indice national des fermages

Base 100 en 2009. Depuis la loi de modernisation de l'agriculture du
27 juillet 2010, l'indice est national et unique : composé à 60 % de
l'évolution du revenu brut d'entreprise agricole à l'hectare (sur les cinq
années précédentes) et à 40 % de l'évolution du niveau général des prix de
l'année précédente. Il est constaté chaque année par arrêté ministériel.

Les valeurs sont stockées dans [`src/data/indices.ts`](src/data/indices.ts).
**Pour mettre à jour** lors de la publication de l'arrêté annuel (en général en
juillet), ajoutez une ligne au tableau `INDICES_FERMAGE`.

Sources :

- [Arrêté du 23 juillet 2025](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051987943) — indice 2025 = 123,06 (+0,42 %)
- [Arrêté du 17 juillet 2024](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050058521) — indice 2024 = 122,55 (+5,23 %)

## Barèmes préfectoraux

Les fourchettes de loyer (minima / maxima par hectare) sont fixées
**département par département** par arrêté préfectoral, révisé chaque année et
variable selon la nature et la catégorie des terres. Il n'existe pas de barème
national unique.

Les barèmes pré-remplis sont stockés dans
[`src/data/baremes.ts`](src/data/baremes.ts). Le fichier est amorcé avec un
barème réel et sourcé (département du **Cher**, arrêté DDT-2024-376 du
19 septembre 2024). **Pour ajouter un département**, ajoutez une entrée à
`BAREMES_PREFECTORAUX` en recopiant les minima/maxima de l'arrêté préfectoral en
vigueur, avec sa référence, sa campagne et l'URL de la source officielle. Pour
les départements absents, l'utilisateur saisit les valeurs de son propre arrêté.

## Déploiement

Un workflow GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
construit et publie le site sur **GitHub Pages** à chaque push sur `main`.

Pour l'activer : dans les réglages du dépôt, **Settings → Pages → Build and
deployment → Source : GitHub Actions**. Le site sera alors disponible sur
`https://<utilisateur>.github.io/FNPPR-Fermage/`. La configuration Vite utilise
un `base` relatif, compatible avec un hébergement en sous-répertoire.

## Développement

Prérequis : Node.js 18+.

```bash
npm install        # installer les dépendances
npm run dev        # serveur de développement (http://localhost:5173)
npm test           # lancer les tests unitaires (Vitest)
npm run build      # vérification TypeScript + build de production (dossier dist/)
npm run preview    # prévisualiser le build de production
```

## Structure

```
src/
  data/indices.ts          Valeurs officielles de l'indice national des fermages
  lib/fermage.ts           Fonctions de calcul pures (réévaluation, bornes, denrées)
  lib/fermage.test.ts      Tests unitaires (Vitest)
  lib/format.ts            Formatage € / % / nombres (fr-FR)
  components/              Composants de l'interface (un par module de calcul)
  App.tsx                  Mise en page et navigation par onglets
  main.tsx                 Point d'entrée React
```

## Avertissement

Ce calculateur est fourni à titre **indicatif**. Les montants obtenus ne se
substituent pas aux arrêtés préfectoraux ni à la réglementation en vigueur
(Code rural et de la pêche maritime, articles L411-11 et suivants). En cas de
doute, rapprochez-vous de votre chambre d'agriculture, d'un notaire ou des
services de l'État.
