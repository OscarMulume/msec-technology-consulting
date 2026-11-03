# Rapport - mission msec-badges

Date : 3 novembre 2026
Dépôt : `C:\pos-system\repos\msec-technology-consulting`
Branche : `main`
Périmètre : afficher dans `#certifications` les badges Cisco vérifiables d'Oscar, corriger l'exactitude des textes existants et vérifier le déploiement GitHub Pages.

## 1. Données utilisées (vérifiées)

Source : profil Credly public <https://www.credly.com/users/oscar-mulume>, consulté le 3 novembre 2026.

| Badge (Cisco Networking Academy) | Délivré le | Lien de vérification |
|---|---|---|
| Ethical Hacker | 23 octobre 2026 | <https://www.credly.com/badges/bc73a9b9-0b18-423f-b230-485a61ddfcc6/public_url> |
| Junior Cybersecurity Analyst Career Path | 20 mars 2026 | <https://www.credly.com/badges/28ac05ee-4d11-4114-9c58-15cbf86c4589/public_url> |
| Networking Devices and Initial Configuration | 17 mars 2026 | profil Credly |
| Networking Basics | 4 mars 2026 | profil Credly |
| Introduction to Cybersecurity | 10 juillet 2022 | profil Credly |

Images fournies par Claude et déjà optimisées : `public/media/badges/cisco-ethical-hacker.webp` (18,6 Ko) et
`public/media/badges/cisco-junior-cybersecurity-analyst.webp` (21,1 Ko), toutes deux en 300 × 300 WebP.

## 2. Étapes

| Étape | Fichiers principaux | Vérifications | Commit | Tag | Poussé |
|---|---|---|---|---|---|
| 1 - Bloc « Badges Cisco vérifiés » | `src/components/HomePage.astro`, `src/i18n/fr.json`, `src/i18n/en.json`, `src/layouts/BaseLayout.astro`, `public/media/badges/*` | `npm test` vert : 6 tests unitaires, 19 pages construites, `astro check` 0 erreur / 0 avertissement, `html-validate` sans erreur, 891 références locales valides | `d11c97a` | `msec-badges-step-1` | oui |
| 2 - Exactitude des textes existants | `src/i18n/fr.json`, `src/i18n/en.json` | `npm test` vert : 6 tests unitaires, 19 pages construites, `astro check` 0 erreur / 0 avertissement, `html-validate` sans erreur, 891 références locales valides | `6c4b679` | `msec-badges-step-2` | oui |
| 3 - Vérification finale | à compléter | à compléter | à compléter | `msec-badges-step-3` puis `msec-badges` | à compléter |

## 3. Étape 1 - Bloc « Badges Cisco vérifiés »

- Un bandeau `badge-panel` ouvre la section `#certifications`, avant les cartes existantes.
- Les deux badges vérifiables sont affichés en cartes : image 300 × 300 avec texte alternatif, nom, émetteur
  (Cisco Networking Academy), date localisée, trois compétences clés et bouton « Vérifier sur Credly ».
- Les boutons sont de vrais liens externes : `target="_blank"`, `rel="noopener noreferrer"` et mention
  « s'ouvre dans un nouvel onglet » lue par les lecteurs d'écran.
- Les trois autres badges sont en liste compacte (nom + date) avec un lien unique « Voir les 5 badges sur Credly »
  vers le profil public.
- Tous les textes viennent de `src/i18n/fr.json` et `src/i18n/en.json`. Les dates sont localisées :
  `23 octobre 2026` / `October 23, 2026`, `20 mars 2026` / `March 20, 2026`, etc.
- Données structurées : `hasCredential` est ajouté à l'`Organization` et au `founder` `Person`, avec cinq
  `EducationalOccupationalCredential` (nom, `credentialCategory: Badge`, `dateCreated`, URL Credly) et
  `recognizedBy` Cisco Networking Academy.

## 4. Étape 2 - Exactitude des textes existants

- Titre de section : « Certifications & badges vérifiés » (fr) / « Certifications & verified badges » (en).
- La carte Cisco ne parle plus de « certification officielle ». Elle affiche : « Badge Cisco Networking Academy
  « Networking Devices and Initial Configuration » (mars 2026) », avec une preuve vérifiable.
- La carte « Hack The Box & Kali Linux » remplace « maîtrise » par « pratique » et cite le badge Cisco Ethical
  Hacker, vérifiable sur Credly, comme preuve.
- Les mentions génériques « chaque certification » deviennent « chaque badge ou certification » / « chaque badge
  et chaque validation ».
- Les cartes « Grant AI Skills & Compute Africa » et « Licence en Sciences Informatiques — ISIPA » restent
  affichées telles quelles : aucun lien de vérification ne figure dans les données fournies.

## 5. Questions pour Oscar

- Existe-t-il un lien ou un document de vérification pour le « Grant AI Skills & Compute Africa » (juillet 2026) ?
  Si oui, il pourra être ajouté à la carte. Sinon, la mention reste sans lien, sans rien inventer.
- Existe-t-il un lien ou un document de vérification pour la « Licence en Sciences Informatiques — ISIPA » ?
  Même règle : aucune affirmation inventée.
- Faut-il demander à Cisco Networking Academy (ou Credly) des URLs publiques dédiées pour les trois badges qui
  n'ont aujourd'hui que le lien du profil (Networking Devices, Networking Basics, Introduction to Cybersecurity) ?

## 6. Ce qui n'a pas pu être fait

- à compléter à l'étape 3.
