# Rapport — mission msec-images

Date : 26 octobre 2026
Dépôt : `C:\pos-system\repos\msec-technology-consulting`
Branche : `main`
Périmètre : intégration de 9 images fournies par Oscar, avec variantes WebP/JPG, textes bilingues, contrôle des poids et vérification Lighthouse mobile.

## 1. Correspondance des images

Les originaux restent dans `C:\Users\oscar\Downloads` (non modifiés). Une copie de travail est placée dans `assets/images/source/` (non versionnée, les PNG lourds sont ignorés).

| Nom cible | Fichier d'origine | Contenu identifié | Emplacement prévu |
|---|---|---|---|
| `msec-office` | Consultant M-SEC au bureau.png | Homme en polo M-SEC devant le logo et le drapeau de la RDC | Hero |
| `msec-strategy` | Réflexion stratégique au coucher du soleil.png | Homme pensif, classeurs « Stratégie de réussite » et « Plan de récupération T4 » | Services, conseil |
| `msec-network` | Baie réseau et skyline urbain.png | Baie réseau câblée bleu/orange | Galerie, salle serveurs |
| `msec-security` | Analyste cybersécurité face aux écrans.png | Femme devant des écrans de vidéosurveillance et un tableau de sécurité | Galerie, sécurité |
| `msec-field` | Technicien de terrain et cartographie connectée.png | Technicien en gilet orange avec tablette, 4x4 et antenne | Services, interventions terrain |
| `msec-dev` | Développeur concentré face aux écrans.png | Développeur devant du code et un schéma réseau | Produits, développement |
| `msec-pos` | Paiement convivial au comptoir du café.png | Caissière avec caisse tactile et paiement par QR | Produits, POS Pro |
| `msec-cabling` | Avant-après _ câblage réseau organisé.png | Montage « Avant / Après » d'une baie | Galerie, réalisations |
| `msec-remote-site` | Démonstration solaire au sommet des collines.png | 4x4, antenne satellite et panneaux solaires | Services, sites isolés |

## 2. Étapes

| Étape | Fichiers principaux | Vérifications | Commit / tag | Poussé |
|---|---|---|---|---|
| 1 — Copie, optimisation, script | `scripts/image-manifest.mjs`, `scripts/optimize-images.mjs`, `tests/media.test.mjs`, `public/media/*`, `.gitignore` | `npm test` vert : 6 tests unitaires, build 19 pages, `astro check` 0 erreur, HTML valide, 811 liens locaux | `msec-img-step-1` | oui |
| 2 — Intégration HomePage + i18n | `src/components/MediaImage.astro`, `src/components/HomePage.astro`, `src/i18n/fr.json`, `src/i18n/en.json`, `public/media/*` | `npm test` vert : 6 tests unitaires, build 19 pages, `astro check` 0 erreur, HTML valide, 887 liens locaux | `msec-img-step-2` | oui |
| 3 — Vérification finale | rapport, build local | `npm test` vert ; Lighthouse mobile 100 / 100 (FR et EN) ; aucune image servie > 300 Ko | `msec-img-step-3` puis `msec-images` | oui |

## 3. Intégration des visuels

| Image | Emplacement | Texte affiché (fr / en) |
|---|---|---|
| `msec-office` | Hero, image prioritaire (`fetchpriority="high"`, `loading="eager"`) | « M-SEC Technology Consulting — Kinshasa, RDC » + mention « Illustration » |
| `msec-strategy` | Section services, visuel « Conseil » | « Cadrer la stratégie » / « Set the strategy » |
| `msec-field` | Section services, visuel « Interventions terrain » | « Déployer sur site » / « Deploy on site » |
| `msec-remote-site` | Section services, visuel « Sites isolés » | « Connecter les sites isolés » / « Connect isolated sites » |
| `msec-dev` | Section produits (`#products`), visuel développement | « Concevoir et documenter » / « Design and document » |
| `msec-pos` | Section produits (`#products`), visuel POS Pro | « Encaissement tactile et QR » / « Touch and QR checkout » |
| `msec-network` | Galerie « En images » | « Salle serveurs » / « Server room » |
| `msec-security` | Galerie « En images » | « Sécurité périmétrique » / « Perimeter security » |
| `msec-cabling` | Galerie « En images » | « Câblage structuré — montage Avant / Après — illustration » |

Chaque `<img>` est rendu par `src/components/MediaImage.astro` avec `srcset` (320/640/1024/1600 px), `sizes`, `width`/`height` explicites, `decoding="async"`, `loading="lazy"` (sauf le hero) et un JPG 1600 px en secours. Tous les textes (alt, titres, légendes, mention « Illustration ») viennent de `fr.json` et `en.json`.

### Honnêteté des visuels

- La galerie s'intitule désormais « En images » / « In pictures » et précise que les visuels sont des illustrations, pas des chantiers clients réels.
- Chaque visuel d'illustration porte la mention « Illustration ».
- `msec-cabling` est explicitement présenté comme un montage « Avant / Après » d'illustration.
- La mention « Professionnels certifiés » / « Certified professionals » et l'image `msec-team` ont été retirées. L'image `msec-server`, devenue inutile, a aussi été supprimée de `public/media`.
- Le hero n'écrit pas « notre siège » : la légende est « M-SEC Technology Consulting — Kinshasa, RDC ».

## 4. Poids avant / après

Source : fichiers PNG copiés depuis `Downloads`. Sortie : `public/media/`.

| Image | Source PNG | WebP 1600 | WebP 1024 | WebP 640 | WebP 320 | JPG 1600 |
|---|---:|---:|---:|---:|---:|---:|
| `msec-office` | 2 015 Ko | 82 Ko | 48 Ko | 26 Ko | 11 Ko | 138 Ko |
| `msec-strategy` | 1 917 Ko | 92 Ko | 53 Ko | 29 Ko | 11 Ko | 148 Ko |
| `msec-network` | 2 032 Ko | 159 Ko | 94 Ko | 48 Ko | 16 Ko | 233 Ko |
| `msec-security` | 2 050 Ko | 144 Ko | 85 Ko | 44 Ko | 15 Ko | 217 Ko |
| `msec-field` | 2 438 Ko | 181 Ko | 107 Ko | 56 Ko | 19 Ko | 251 Ko |
| `msec-dev` | 2 019 Ko | 133 Ko | 78 Ko | 41 Ko | 15 Ko | 208 Ko |
| `msec-pos` | 2 132 Ko | 146 Ko | 87 Ko | 47 Ko | 18 Ko | 224 Ko |
| `msec-cabling` | 2 926 Ko | 246 Ko | 141 Ko | 61 Ko | 17 Ko | 296 Ko |
| `msec-remote-site` | 2 813 Ko | 234 Ko | 127 Ko | 57 Ko | 16 Ko | 282 Ko |

Tous les WebP 1600 px sont sous 250 Ko et aucune image servie ne dépasse 300 Ko. Pour `msec-cabling` et `msec-remote-site`, la qualité a été abaissée de 80 à 78 en WebP (et 82 à 80 en JPG pour `msec-cabling`) uniquement pour respecter ces budgets. Les dimensions 1600 px sont 1600×1067 (3:2), 1600×1200 (4:3) ou 1600×900 (16:9) selon le cadrage d'origine.

Les anciens PNG lourds de `public/media` ont été supprimés (seul `og-image.png` reste en PNG). Les anciennes images `msec-office`, `msec-network` et `msec-security` sont remplacées par les nouvelles sous le même nom ; elles ne sont plus référencées et ne sont donc pas archivées. Les anciennes images `msec-team` et `msec-server` ont été retirées de `public/media` à l'étape 2 ; la mention « Professionnels certifiés » a été supprimée des traductions.

## 5. Vérification finale (étape 3)

- `npm test` vert : 6 tests unitaires, build de 19 pages, `astro check` 0 erreur / 0 avertissement, `html-validate` sans erreur, 887 références locales valides.
- Lighthouse 12.8.2 sur le build local (`npm run preview`), émulation mobile :

| Page | Performance | Accessibilité | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Accueil FR | 100 | 100 | 1,1 s | 1,6 s | 0 ms | 0 |
| Accueil EN | 100 | 100 | 0,9 s | 1,6 s | 0 ms | 0 |

- Poids : le plus gros fichier servi est `msec-cabling.jpg` (296 Ko), sous la limite de 300 Ko. Tous les WebP 1600 px sont sous 250 Ko. Aucun PNG lourd hors `og-image.png`. Ces points sont couverts par les tests unitaires.
- Les images utilisent `srcset` 320 / 640 / 1024 / 1600 px, `sizes`, `width` / `height` explicites, `decoding="async"` et `loading="lazy"`, sauf le hero en `loading="eager"` + `fetchpriority="high"`.

## 6. État Git et URL

- Branche : `main`. Tags de mission : `msec-img-step-1`, `msec-img-step-2`, `msec-img-step-3`, `msec-images`.
- Après le push final : `git status` propre et `git log origin/main..HEAD` vide.
- URL GitHub Pages à vérifier : <https://oscarmulume.github.io/msec-technology-consulting/> (FR) et <https://oscarmulume.github.io/msec-technology-consulting/en/> (EN).

## 7. Questions pour Oscar

- Confirmer que `msec-cabling` doit rester un visuel d'illustration « Avant / Après » et ne jamais être présenté comme un chantier client réel.
- Confirmer que les personnes des images ne doivent pas être présentées comme l'équipe réelle. La mention « Illustration » est affichée sur les visuels concernés depuis l'étape 2.

## 8. Ce qui n'a pas pu être fait

- Les anciennes versions de `msec-office`, `msec-network` et `msec-security` ont été écrasées à l'étape 1 sous le même nom : elles ne sont donc pas dans `public/media/archive/`. Elles restent récupérables dans l'historique Git (commit parent de `1009b57`) si Oscar veut les conserver.
- La vérification indépendante par Claude et la propagation effective de GitHub Pages n'ont pas été testées ici : l'URL ci-dessus est à contrôler après le déploiement.
- Les formulaires restent non branchés (situation connue du dépôt, hors périmètre de cette mission).
