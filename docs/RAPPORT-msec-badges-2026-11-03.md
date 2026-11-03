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
| 3 - Vérification finale | `scripts/check-credentials.mjs`, `package.json`, `src/styles/tokens.css`, rapport | `npm test` vert : 6 tests unitaires, 19 pages, `astro check` 0/0, `html-validate` OK, 891 liens locaux, 3/3 liens Credly HTTP 200 ; Lighthouse mobile accessibilité 100/100 (FR et EN) ; contraste des boutons ≥ 4,5:1 en clair et sombre ; `deploy.yml` vert et page en ligne à jour | `ccee5c8` | `msec-badges-step-3` puis `msec-badges` | oui |

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

## 5. Étape 3 - Vérification

### Tests locaux

`npm test` est vert :

- 6 tests unitaires (`node --test`) ;
- build Astro de 19 pages ;
- `astro check` : 0 erreur, 0 avertissement, 0 indication ;
- `html-validate` : aucune erreur ;
- `check:links` : 891 références locales valides sur 19 fichiers HTML ;
- `check:credentials` : 3 / 3 liens Credly répondent en HTTP 200 (les deux badges + le profil).

Le script `scripts/check-credentials.mjs` est ajouté à `npm test` (mais pas au workflow CI, pour ne pas
dépendre de la disponibilité de Credly à chaque push). Il vérifie les liens réellement rendus dans `dist/`.

### Lighthouse mobile (Lighthouse 12.8.2, page en ligne)

| Page | Performance | Accessibilité | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Accueil FR | 100 | 100 | 1,4 s | 1,4 s | 0 ms | 0 |
| Accueil EN | 99 | 100 | 1,4 s | 1,5 s | 0 ms | 0 |

La première passe FR à froid a donné 89 en performance (speed-index 29,3 s) ; la seconde passe, cache GitHub
Pages réchauffé, donne 100. L'accessibilité reste à 100 dans les deux langues.

### Contraste des boutons (WCAG AA, manuel)

Le bouton « Vérifier sur Credly » utilise `--ms-gradient` avec `--ms-accent-contrast`. Le dégradé clair a été
assombri de `#087f8c → #0e9f94 → #2d9f74` à `#087f8c → #0a7d78 → #187a5c` pour que le texte blanc atteigne
4,5:1 sur tous les arrêts.

| Bouton / thème | Ratio minimum | Verdict |
|---|---:|---|
| Primaire, clair (blanc sur dégradé) | 4,75 / 4,98 / 5,28 | AA |
| Primaire, sombre (#042024 sur dégradé) | 6,95 / 8,03 / 9,56 | AAA |
| Secondaire, clair (#10161d sur blanc) | 18,19 | AAA |
| Secondaire, sombre (#f1f6f7 sur #14232a) | 14,78 | AAA |
| Fantôme, clair (#4c5a68 sur blanc) | 7,07 | AAA |
| Fantôme, sombre (#b5c2c7 sur #101c22) | 9,50 | AAA |

### Déploiement GitHub Pages

- Workflow `deploy.yml` vert après chaque push de la mission : run `41595092025` (étape 1), `41595189638`
  (étape 2), `41595595394` (étape 3). `CI` et `Scan de secrets` sont également verts.
- Page en ligne vérifiée avec un paramètre anti-cache : FR et EN répondent en HTTP 200, avec le bandeau
  `badge-panel`, les deux images, les boutons Credly, le lien profil et les données structurées
  (`hasCredential` × 2, `EducationalOccupationalCredential` × 10). `Last-Modified` du 3 novembre 2026 à
  07:20:21 GMT.
- Cause du déploiement `msec-images` qui semblait absent le 26 octobre : le workflow était déjà vert et la page
  servie avait bien `Last-Modified: 26 Oct 2026 12:13:45 GMT` avec les 9 visuels. GitHub Pages envoie
  `Cache-Control: max-age=600` : une page ouverte avant la fin du déploiement, ou restée en cache navigateur
  jusqu'à 10 minutes, affichait l'ancienne version. Aucun défaut de `deploy.yml` n'a été trouvé ; aucune
  correction de workflow n'était nécessaire. La vérification se fait désormais avec un paramètre `?v=...`.

## 6. Questions pour Oscar

- Existe-t-il un lien ou un document de vérification pour le « Grant AI Skills & Compute Africa » (juillet 2026) ?
  Si oui, il pourra être ajouté à la carte. Sinon, la mention reste sans lien, sans rien inventer.
- Existe-t-il un lien ou un document de vérification pour la « Licence en Sciences Informatiques — ISIPA » ?
  Même règle : aucune affirmation inventée.
- Faut-il demander à Cisco Networking Academy (ou Credly) des URLs publiques dédiées pour les trois badges qui
  n'ont aujourd'hui que le lien du profil (Networking Devices, Networking Basics, Introduction to Cybersecurity) ?

## 7. Ce qui n'a pas pu être fait

- La vérification indépendante par Claude n'a pas été refaite ici : elle reste à faire sur le commit final.
- Lighthouse a été lancé depuis cette machine vers la page en ligne ; les scores de performance varient avec le
  réseau et le cache (89 puis 100 sur deux passes FR). L'accessibilité, elle, reste stable à 100.
- Le thème sombre n'est pas émulé par Lighthouse : le contraste des boutons sombres a été vérifié par calcul
  des ratios WCAG sur les jetons de `tokens.css`.
- Les formulaires restent non branchés (situation connue du dépôt, hors périmètre de cette mission).

## 8. État Git final

- Branche : `main`.
- Tags de mission : `msec-badges-step-1`, `msec-badges-step-2`, `msec-badges-step-3`, `msec-badges`.
- Après le push final : `git status` propre et `git log origin/main..HEAD` vide (à contrôler juste après le
  `git push origin main --tags` final).
- URL à vérifier : <https://oscarmulume.github.io/msec-technology-consulting/#certifications> (FR) et
  <https://oscarmulume.github.io/msec-technology-consulting/en/#certifications> (EN).
