# Rapport - mission « assistant-partout » (démarrée le 06/11/2026)

Suivi des étapes (reprendre à la première étape non terminée).

| Étape | Statut | Fichiers | Tests | Commit | Tag | Poussé |
|---|---|---|---|---|---|---|
| P0 - 4 défauts du test réel | TERMINÉ (code ; recette en ligne au redéploiement P6) | `supabase/functions/assistant/{core,messages}.ts`, `scripts/assistant-live-check.mjs`, `tests/assistant-p0.test.mjs`, `docs/ASSISTANT.md` | `npm test` vert : 35 tests | voir git | `assistant-p0` | oui |
| P1 - Moteur multi-applications | TERMINÉ (code et tests ; déploiement + migration au P6) | `supabase/functions/assistant/{profiles,core,messages,store,index}.ts`, `scripts/app-knowledge.mjs`, `scripts/build-knowledge.mjs`, `supabase/migrations/20261106_assistant_multi_app.sql`, `tests/assistant-apps.test.mjs` | `npm test` vert : 43 tests | voir git | `assistant-p1` | oui |
| P2 - Widget unique et thémable | À FAIRE | | | | `assistant-p2` | non |
| P3 - Malaika Ranch | À FAIRE | | | | `assistant-p3` | non |
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
