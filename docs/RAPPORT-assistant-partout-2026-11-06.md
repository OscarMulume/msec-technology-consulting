# Rapport - mission « assistant-partout » (démarrée le 06/11/2026)

Suivi des étapes (reprendre à la première étape non terminée).

| Étape | Statut | Fichiers | Tests | Commit | Tag | Poussé |
|---|---|---|---|---|---|---|
| P0 - 4 défauts du test réel | TERMINÉ (code ; recette en ligne au redéploiement P6) | `supabase/functions/assistant/{core,messages}.ts`, `scripts/assistant-live-check.mjs`, `tests/assistant-p0.test.mjs`, `docs/ASSISTANT.md` | `npm test` vert : 35 tests | voir git | `assistant-p0` | oui |
| P1 - Moteur multi-applications | TERMINÉ (code et tests ; déploiement + migration au P6) | `supabase/functions/assistant/{profiles,core,messages,store,index}.ts`, `scripts/app-knowledge.mjs`, `scripts/build-knowledge.mjs`, `supabase/migrations/20261106_assistant_multi_app.sql`, `tests/assistant-apps.test.mjs` | `npm test` vert : 43 tests | voir git | `assistant-p1` | oui |
| P2 - Widget unique et thémable | TERMINÉ (WebView Android 7 réel non testé) | `src/assistant/msec-assistant.src.js`, `scripts/build-assistant-widget.mjs`, `public/assistant/msec-assistant.js` + `public/assistant/v2/msec-assistant.js`, `tests/e2e/assistant.spec.mjs`, `package.json` | `npm test` vert (+ `check:widget`), `npm run test:e2e` : 15/15 | voir git | `assistant-p2` | oui |
| P3 - Malaika Ranch | TERMINÉ (affichage public NON activé : EN ATTENTE D'OSCAR) | msec : `supabase/functions/assistant/{catalog,core,index}.ts`, `apps/malaika.{fr,en}.md`, `tests/assistant-malaika.test.mjs` ; malaika-ranch-web : `lib/assistant.js`, `components/AssistantWidget.jsx`, `components/ShopPage.jsx`, `.env.local.example`, `tests/assistant.test.js` | msec : `npm test` vert (51 tests) ; malaika : vitest 65/65, `next build` OK | voir git | `assistant-p3` (2 dépôts) | oui |
| P4 - POS Pro | À FAIRE | | | | `assistant-p4` | non |
| P5 - Portfolio et site M-SEC | À FAIRE | | | | `assistant-p5` | non |
| P6 - Recette et clôture | À FAIRE | | | | `assistant-partout` | non |

## P0 - les 4 défauts du test réel

Le prompt `PROMPT-2` cite « P0 : les 4 défauts du test réel » sans les énumérer. **Hypothèse à confirmer par Oscar** : les défauts relevés dans le tableau du test réel du 05/11 (`RAPPORT-assistant-allegement-2026-11-05.md`) :

1. Réponse n° 2 (badges) coupée au milieu d'une phrase par `max_tokens = 350` -> `max_tokens` porté à 600 (le modèle raisonne avant de répondre) ; si le fournisseur répond `finish_reason = length`, la réponse est arrêtée à la dernière phrase complète.
2. Réponse n° 4 (Malaika) à la première personne (« que j'ai développée », « mon portfolio ») : l'assistant n'est pas Oscar -> règle 9 du prompt : troisième personne.
3. Réponse n° 4 (Malaika) : détails inventés (« paiement mobile », « gestion d'e-commerce », « Afrique centrale ») absents de la base -> règle 10 : ne décrire qu'avec les mots de la base.
4. Réponse n° 7 : HTML brut (`<a href=...>`) affiché tel quel dans le widget -> le serveur convertit tout HTML en texte (lien -> « texte : url ») ; prompt : texte simple. Par ailleurs la colonne « Trouvé » (true/false = « la base contenait la réponse ») était lue comme un échec pour les lignes 7 à 10, pourtant conformes : remplacée par un **Verdict auto** (attendu respecté, HTML, réponse coupée) dans `assistant-live-check.mjs`.

Limite de la longueur de réponse : 100 mots (au lieu de 120) pour réduire les coupures.

## P1 - moteur multi-applications

- `profiles.ts` : liste blanche `msec`, `portfolio`, `malaika`, `pos`, `herbo`, `monimmo` ; par profil : introduction, ton, règles propres, périmètre, origines CORS, langues, limites, `site_leads.source`. `herbo` et `monimmo` : `enabled: false` (la fonction répond 403 `app_disabled` sans appeler le modèle).
- Paramètre `app` du corps de la requête ; absent = `msec` (l'ancien widget continue de fonctionner) ; valeur inconnue = 400 `unknown_app`.
- CORS en deux temps : la requête préliminaire accepte l'origine de toute application activée ; chaque requête POST vérifie ensuite que l'origine appartient bien au profil demandé (Malaika ne peut pas se faire passer pour `msec`).
- Limitation et journal par application : clé `chat:<app>:<hash>`, colonne `assistant_logs.app`.
- Connaissances par application : `portfolio` = sous-ensemble vérifié de la base M-SEC (sections 1, 6, 7, 8, 9) ; `malaika` et `pos` = fichiers `supabase/functions/assistant/apps/<app>.<lang>.md` (P3 et P4). Tant qu'une application n'a pas de connaissances, la fonction répond 503 « indisponible » (jamais d'invention).
- Origines `pos` : serveur POS Pro (`https://pos-pro-msec.onrender.com`) + coquilles Tauri/Capacitor (`tauri://localhost`, `http://tauri.localhost`, `https://tauri.localhost`, `https://localhost`, `capacitor://localhost`). TODO Oscar : ajouter le domaine du back-office quand il sera acheté.
- **EN ATTENTE D'OSCAR / P6** : la migration `20261106_assistant_multi_app.sql` doit être appliquée sur Supabase `pos-pro-msec` AVANT le redéploiement de la fonction (nouvelles valeurs de `site_leads.source`, colonne `assistant_logs.app`). Elle est prévue au P6 avec le déploiement.

## P2 - widget unique et thémable

- `<msec-assistant app="malaika" lang="fr" accent="#8a4b12" logo="https://…">` : profils `msec`, `portfolio`, `malaika`, `pos` (titre, sous-titre, accueil, suggestions, accent par défaut) ; `title` et `welcome` surchargeables ; l'attribut `app` est envoyé au serveur (chat et demande de contact). Sans attribut : `msec` (rien ne change pour le site actuel).
- Accessibilité : contraste AA (4,5:1) garanti pour tout accent (assombri en clair, éclairci en sombre ; texte du bouton noir ou blanc selon le meilleur contraste) ; test e2e avec un jaune clair en clair et en sombre. Clavier, `role="dialog"`, zone `aria-live`, cibles de 44 px, Échap : inchangés et testés. Mode sombre : attribut `data-theme` du site, sinon `prefers-color-scheme`. `prefers-reduced-motion` : animation désactivée.
- Pour les applications hôtes : propriété `orderAction = { label, href }` (bouton « Commander sur WhatsApp », lien généré au clic, https uniquement) ; propriété `faq = [{ keywords, answer }]` : réponses hors ligne sans IA, avec message clair, aucun appel réseau.
- Compatibilité ancienne WebView : source compilée en **ES2017** avec le compilateur TypeScript (`npm run build:widget`) ; `npm run check:widget` (dans `npm test`) échoue si le fichier n'est pas à jour ou contient une syntaxe/API postérieure à ES2017 (chaînage optionnel, `??`, `catch {}`, `.at()`, `replaceAll`, …) ; CSS avec repli avant `min()`, `max()`, `dvh` ; `AbortController` facultatif.
- Adresses : `public/assistant/msec-assistant.js` (dernière version) et `public/assistant/v2/msec-assistant.js` (version figée, pour les applications qui ne veulent pas changer sans test). Publiées avec le site (GitHub Pages) : `https://oscarmulume.github.io/msec-technology-consulting/assistant/v2/msec-assistant.js`.
- Taille : 9,2 Ko gzip (6,7 Ko avant : profils et FAQ ajoutés ; ES2017 plus verbeux).
- **Non testé** : un vrai appareil ou émulateur Android 7 (aucun disponible ici). Le test s'appuie sur la compilation ES2017 et Chromium bureau. Chrome 54 minimum requis (Custom Elements v1) : une WebView Android 7 non mise à jour sous cette version n'affichera pas le widget (aucune erreur visible).

## P3 - Malaika Ranch, conseiller boutique

- **Lecture en direct, lecture seule** : la fonction lit les deux routes publiques de la boutique (`/api/products` = produits publiés uniquement, `/api/delivery-zones` = zones actives) avec cache de 2 minutes et délai de 5 s. Aucune clé, aucune commande, aucun brouillon (filtre `is_draft` doublé côté fonction), aucune quantité exacte (seulement « en stock / stock limité / hors stock », toujours « à confirmer sur WhatsApp »). Prix par unité avec la devise du produit (FC ou USD) ; zones de livraison avec frais en FC.
- Catalogue trop gros : budget de 4 200 caractères (~1 000 jetons), les produits cités dans la question passent en premier. Boutique illisible : consigne explicite de n'annoncer AUCUN prix ni disponibilité (pas de donnée périmée au-delà de 10 minutes).
- Connaissances statiques (`apps/malaika.{fr,en}.md`) : comment commander, paiements proposés (espèces à la livraison, M-Pesa, Airtel Money, Orange Money, Afrimoney : ceux du formulaire), livraison, interdits. Aucun prix, délai ou numéro écrit en dur (test automatique). Aucun délai de livraison n'est publié : l'assistant renvoie vers WhatsApp.
- Boutique : composant `AssistantWidget` (charge la version figée v2 du widget, profil `malaika`, accent `#8a4b12`) avec le bouton **« Commander sur WhatsApp »** : le lien est généré au clic avec le panier actuel (articles, unités, quantités, prix affichés par la boutique, « merci de confirmer la disponibilité »), numéro `NEXT_PUBLIC_WHATSAPP_NUMBER` ; sans numéro, le bouton n'a pas de lien (rien d'inventé).
- Origine CORS autorisée pour le profil : `https://malaika-ranch-web.vercel.app`.
- **Interrupteur** : `NEXT_PUBLIC_ASSISTANT_ENABLED` (Vercel), absent/`false` par défaut : le composant ne rend RIEN. **EN ATTENTE D'OSCAR** : obtenir l'accord du client Malaika, puis définir `NEXT_PUBLIC_ASSISTANT_ENABLED=true` dans Vercel et redéployer. Je n'ai pas activé l'affichage.
- Non testé ici : affichage réel dans le navigateur sur la boutique (le widget est testé sur le site M-SEC par Playwright ; la boutique est vérifiée par `next build` et les tests unitaires du lien WhatsApp) ; appel réel de la fonction pour Malaika (nécessite le déploiement, P6).

## P4 - POS Pro, aide caisse

- **Guide utilisateur** : `docs/GUIDE-UTILISATEUR-POS-PRO.md` (dépôt pos_msec), écrit d'après le code réel (connexion, mode démo, ouverture de caisse, commande, encaissement, rapports X/Z à comptage aveugle, hors ligne, abonnement). Prix d'abonnement : TODO explicite, jamais annoncé. Connaissances de l'assistant : `apps/pos.{fr,en}.md`, régénérées (`npm run build:knowledge`).
- **Rôle requis (utilisateur connecté)** : jeton court HMAC-SHA256 (15 min, sans donnée personnelle) délivré par Laravel (`GET /api/v1/assistant/token` Sanctum, `GET /assistant/token` session, 20 req/min) et vérifié par la fonction (`X-Assistant-Token`, secret `ASSISTANT_POS_SECRET`). Sans jeton valide : 401 `login_required`, aucun appel au modèle ; secret absent côté fonction ou Laravel : refus / 503, jamais de jeton faible.
- **Widget** : propriété `tokenProvider` (envoie `X-Assistant-Token`), ES2017 vérifié.
- **Hors ligne** : FAQ embarquée sans IA (5 sujets) dans `pos-shared` (caisse web, Tauri, Capacitor) et dans le back-office Blade (4 sujets), message « Hors ligne : … » explicite.
- **Interrupteurs, désactivés par défaut** : `VITE_ASSISTANT_ENABLED` (caisse) et `ASSISTANT_ENABLED` (Laravel).
- Tests : fonction 55 verts (dont 4 nouveaux : sans jeton, valide, falsifié/expiré/autre app/sans secret, pas de prix), `npm test` du site vert, pos-shared 50 verts, Laravel 107 verts (+3 sur le jeton).
- **EN ATTENTE D'OSCAR** : générer UN secret aléatoire, le mettre dans Laravel (`ASSISTANT_POS_SECRET` dans `.env`/Render) ET dans Supabase (`npx supabase secrets set ASSISTANT_POS_SECRET=... --project-ref cinzlzdfddvcjhmvnbtp`) ; domaine du back-office pour CORS quand il existera.
- Non testé : appel réel de bout en bout (nécessite le déploiement P6 et le secret), affichage dans l'application Android/Windows.

## P5 - Portfolio et site M-SEC sur le widget v2

- Site M-SEC : `<msec-assistant app="msec" lang=...>` chargé depuis `/assistant/v2/msec-assistant.js` (version figée). Portfolio (OscarMulume.github.io) : `app="portfolio"`, même fichier v2 du site M-SEC. Les deux restent masqués tant que `PUBLIC_ASSISTANT_ENABLED` n'est pas `true` (inchangé).
- Tests : site M-SEC `npm test` vert + 15 scénarios Playwright verts ; portfolio `npm test` vert (test d'intégration mis à jour : attribut `app="portfolio"` et URL v2). Aucune régression.
- Ordre de déploiement : pousser le site M-SEC (publie v2) avant le portfolio.

## ARRÊT DE SESSION (06/11/2026) - prochaine étape : P4

Arrêt volontaire après P3, à une limite propre (tout est poussé). La barre d'état Claude Code n'est pas lisible par l'agent (`%LOCALAPPDATA%\msec\claude-usage.json` absent) : l'arrêt est une précaution pour la limite hebdomadaire, pas une mesure à 80 %.

**Reprendre à P4 - POS Pro (`C:\pos-system`)**, constats déjà faits :
- Il n'existe PAS de guide utilisateur dans `docs/` (seulement des rapports techniques, `pos-shared/src/help/fr.json` = 8 infobulles). Le prompt demande de répondre « à partir du guide utilisateur » : il faut d'abord écrire `docs/GUIDE-UTILISATEUR-POS-PRO.md` à partir du comportement réel de l'application (vues `laravel/resources/views/pos/*.blade.php`, `pos-shared/index.html`, modale de gestion de caisse X/Z, synchronisation, abonnement), sans rien inventer, puis en tirer `apps/pos.{fr,en}.md`.
- « Rôle requis : utilisateur connecté » : la fonction vit sur Supabase, Laravel gère l'authentification. Piste : route Laravel `auth:sanctum` qui délivre un jeton court signé (HMAC) vérifié par la fonction (en-tête `X-Assistant-Token`, secret partagé `ASSISTANT_POS_SECRET`) ; le widget enverrait ce jeton via une propriété `tokenProvider`. EN ATTENTE D'OSCAR : définir le même secret côté Laravel (`.env`) et côté Supabase (`supabase secrets set`).
- Hors ligne : la propriété `faq` du widget est prête (P2) ; il reste à embarquer la FAQ (sans IA) dans `pos-shared` (caisse hors ligne, Tauri, Capacitor) et dans le back-office.
- Origines du profil `pos` : domaine du back-office à ajouter quand il existera (aucun domaine inventé).

**Ensuite** : P5 (portfolio et site M-SEC passent au widget v2 avec `app="portfolio"` / `app="msec"`, sans régression des tests), puis P6 (recette : 10 questions × 8 s par application, tableau ici ; `docs/ASSISTANT.md` : ajouter une app en 5 étapes, changer de modèle, activer/désactiver par app, lire les journaux ; **appliquer d'abord la migration `20261106_assistant_multi_app.sql`**, puis `npx supabase functions deploy assistant --project-ref cinzlzdfddvcjhmvnbtp --no-verify-jwt --yes` ; tag `assistant-partout` ; ne pas activer l'affichage public).

**EN ATTENTE D'OSCAR (cumul)** : accord du client Malaika avant `NEXT_PUBLIC_ASSISTANT_ENABLED=true` ; confirmation des 4 défauts de P0 (hypothèse ci-dessus) ; secret `ASSISTANT_POS_SECRET` (P4) ; domaine du back-office POS Pro (origine CORS).
