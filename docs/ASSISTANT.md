# Assistant IA M-SEC : fonctionnement et mise en ligne

Ce document est écrit pour Oscar. Rien de ce qui suit n'a été exécuté : **l'assistant n'est pas en ligne** tant que vous n'avez pas fait la section « Mise en ligne ».

## Comment ça marche

```
Visiteur ──► site M-SEC / portfolio (GitHub Pages)
              │  composant <msec-assistant> (public/assistant/msec-assistant.js, aucune clé)
              ▼
        Fonction Supabase « assistant »  (projet pos-pro-msec)
              │  1. vérifie l'origine (seulement https://oscarmulume.github.io)
              │  2. applique les limites (20 messages/heure/visiteur, 500/jour au total)
              │  3. ajoute les connaissances (knowledge.fr/en) au prompt
              ▼
        Fournisseur du modèle (API compatible OpenAI : NVIDIA NIM au départ)
```

- La clé du modèle n'existe **que** dans les secrets Supabase. Elle n'est ni dans le code, ni dans les sites.
- Les demandes de contact vont dans la table `site_leads` avec `source = 'assistant'`. Le visiteur voit « enregistrée » seulement si l'insertion a réussi.
- Le journal (`assistant_logs`) garde la question tronquée (200 caractères, e-mails et numéros masqués), la langue, la date et « réponse trouvée oui/non ». Jamais de nom, d'e-mail ni d'adresse IP. Les limites utilisent un hash salé de l'adresse IP.
- Si le modèle ne répond pas (quota, panne, plus de 20 s) : message de secours avec l'e-mail, jamais une erreur brute.
- Le numéro de téléphone n'est jamais donné par l'assistant (décision par défaut, à confirmer).

## Les sites n'affichent l'assistant que si vous l'activez

Les deux sites ne montrent le composant que si la variable GitHub `PUBLIC_ASSISTANT_ENABLED` vaut `true`. Tant qu'elle n'existe pas, rien n'apparaît : on ne publie pas un assistant qui répondrait « indisponible ».

## Mise en ligne (à faire par Oscar, dans l'ordre)

Ouvrez PowerShell dans `C:\pos-system\repos\msec-technology-consulting`.

**0. Avant tout : une NOUVELLE clé NVIDIA.** L'ancienne a été écrite en clair dans un chat : considérez-la comme compromise. Créez-en une nouvelle sur le site NVIDIA (build.nvidia.com), puis supprimez l'ancienne. Ne l'écrivez dans aucun fichier ni message.

**1. Relire les connaissances.** Ouvrez `supabase/functions/assistant/knowledge.fr.md` et `knowledge.en.md` : tout ce qui y figure pourra être dit aux visiteurs. Corrigez les sources (pas ces fichiers) puis `npm run build:knowledge`.

**2. Vérifier la table `site_leads`.** Dans Supabase (projet `pos-pro-msec`) → Table Editor : la table `site_leads` doit exister. Sinon, exécutez d'abord `supabase/migrations/20261020_site_leads.sql` (étape 3, même méthode). Je n'ai pas pu le vérifier moi-même (l'accès en lecture de l'outil a échoué).

**3. Appliquer la migration.** Supabase → SQL Editor → collez le contenu de `supabase/migrations/20261104_assistant.sql` → Run. Elle peut être rejouée sans risque. Elle crée `assistant_rate_limits`, `assistant_logs` et la fonction `assistant_hit` (aucun accès public) et ajoute la colonne `source` à `site_leads`.

**4. Se connecter à Supabase.**
```powershell
npx supabase login
```

**5. Déployer la fonction** (sans vérification de jeton, car les sites sont publics ; la protection vient de l'origine et des limites) :
```powershell
npx supabase functions deploy assistant --project-ref cinzlzdfddvcjhmvnbtp --no-verify-jwt
```

**6. Saisir les secrets** (la clé est tapée à l'invite, jamais écrite dans un fichier). Modèle choisi par Oscar (04/11/2026) : `z-ai/glm-5.3-flash` (NVIDIA, offre gratuite). Modèle de secours à utiliser manuellement si le premier disparaît : `deepseek-ai/deepseek-v4.1-flash` (la fonction n'utilise qu'UN modèle à la fois : il n'y a pas de bascule automatique ; pour basculer, relancez la commande ci-dessous en changeant `LLM_MODEL`) :
```powershell
$cle = Read-Host "Collez la NOUVELLE cle NVIDIA"
$sel = node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
npx supabase secrets set "LLM_API_KEY=$cle" "ASSISTANT_SALT=$sel" "LLM_BASE_URL=https://integrate.api.nvidia.com/v1" "LLM_MODEL=z-ai/glm-5.3-flash" --project-ref cinzlzdfddvcjhmvnbtp
Remove-Variable cle, sel
```
Ne définissez PAS `ASSISTANT_ALLOW_LOCALHOST` en production.

**7. Test réel** (10 questions : profil, badges, POS Pro, Malaika, services, prix, téléphone, hors périmètre, deux détournements) :
```powershell
node scripts/assistant-live-check.mjs
```
Collez le tableau obtenu dans `docs/RAPPORT-assistant-ia-2026-11-04.md` et relisez chaque réponse selon la colonne « Attendu ». Si une réponse est mauvaise, ne passez pas à l'étape 8.

**8. Afficher l'assistant sur les deux sites** (puis attendre que les déploiements se terminent) :
```powershell
gh variable set PUBLIC_ASSISTANT_ENABLED --body true -R OscarMulume/msec-technology-consulting
gh variable set PUBLIC_ASSISTANT_ENABLED --body true -R OscarMulume/OscarMulume.github.io
gh workflow run "Deploy to GitHub Pages" -R OscarMulume/msec-technology-consulting
gh workflow run "Déploiement GitHub Pages" -R OscarMulume/OscarMulume.github.io
```

**Retour arrière immédiat :** `gh variable set PUBLIC_ASSISTANT_ENABLED --body false -R <dépôt>` puis relancer le déploiement. Pour couper aussi le serveur : `npx supabase functions delete assistant --project-ref cinzlzdfddvcjhmvnbtp`.

## Changer de modèle ou de fournisseur sans toucher au code

La fonction parle à n'importe quelle API compatible OpenAI. Il suffit de changer les secrets ; en principe aucun redéploiement n'est nécessaire (si l'ancien modèle répond encore après quelques minutes, relancez la commande de déploiement de l'étape 5) :

```powershell
npx supabase secrets set "LLM_BASE_URL=<adresse du fournisseur, finissant par /v1>" "LLM_MODEL=<modele>" "LLM_API_KEY=<cle>" --project-ref cinzlzdfddvcjhmvnbtp
```

Gemini propose une adresse compatible OpenAI (voir la documentation Google). **L'offre gratuite de NVIDIA est prévue pour l'essai** : pour un usage réel, prévoyez un fournisseur payant ou Gemini, avec un plafond de dépense.

## Mettre à jour les connaissances

1. Modifiez les sources : textes des deux sites (`src/i18n`, `src/content`, `OscarMulume.github.io/src/data/profile.json`).
2. `npm run build:knowledge` (le script exige que le portfolio soit à côté : `..\OscarMulume.github.io`), puis relisez `git diff`.
3. `npm run check:knowledge` vérifie que les fichiers générés sont à jour.
4. Commit, puis redéployez : `npx supabase functions deploy assistant --project-ref cinzlzdfddvcjhmvnbtp --no-verify-jwt`.

## Lire les journaux et les demandes

Supabase → SQL Editor :

```sql
-- Questions des 7 derniers jours (sans données personnelles) et si une réponse a été trouvée
select created_at, lang, found, question
from public.assistant_logs
where created_at > now() - interval '7 days'
order by created_at desc;

-- Questions sans réponse : à ajouter aux connaissances
select question, count(*) from public.assistant_logs where not found group by question order by 2 desc limit 20;

-- Demandes laissées via l'assistant
select created_at, full_name, email, phone, message, status
from public.site_leads where source = 'assistant' order by created_at desc;
```

Erreurs de la fonction : Supabase → Edge Functions → assistant → Logs.

Sauvegarde : le code est sur GitHub ; les données (`site_leads`, `assistant_logs`) sont dans Supabase. Export : Table Editor → Export CSV, ou `pg_dump` avec la chaîne de connexion de la base.

## Limites et sécurité

- 20 messages/heure/visiteur, 500 messages/jour au total, 1 500 caractères par message, 4 tours d'historique, 600 jetons de réponse maximum (réponse coupée = arrêt à la dernière phrase complète), 20 s de délai.
- Connaissances allégées : identité/contact toujours envoyée + les 2 sections les plus pertinentes (mots-clés), soit moins de 1 500 jetons de contexte par requête.
- Si le fournisseur répond 429, la fonction attend le `retry-after` (plafonné à 8 s) et réessaie une fois.
- Si le compteur de limites est injoignable, la fonction refuse de répondre plutôt que de risquer un coût illimité.
- Demandes de détournement évidentes (« ignore tes instructions », demande de clé…) : réponse polie sans appeler le modèle.
- Un assistant IA peut se tromper : le prompt l'oblige à s'appuyer sur les connaissances, mais ce n'est pas une garantie absolue.
- Tests : `npm run test:unit` (fonction, 31 tests), `npm run test:e2e` (widget, 11 scénarios Playwright). Deno n'est pas installé sur le poste de développement : `index.ts` (Deno.serve) et la fonction SQL `assistant_hit` ne sont vérifiés qu'après le déploiement, par le test réel.

## Plusieurs applications, un seul moteur (assistant-partout)

Applications : `msec` (site), `portfolio`, `malaika`, `pos` ; `herbo` et `monimmo` sont préparées mais désactivées (`enabled: false`).

### Ajouter une nouvelle application en 5 étapes
1. `supabase/functions/assistant/profiles.ts` : ajouter l'identifiant à `AppId` et `APP_IDS`, puis un profil (intro, ton, règles, périmètre, origines CORS, limites, `leadSource`, `requiresLogin`).
2. Connaissances : créer `supabase/functions/assistant/apps/<app>.fr.md` et `<app>.en.md` (sections `##`, la première toujours envoyée, mots-clés `<!-- mots-cles: a, b -->`), puis `npm run build:knowledge`.
3. Base : ajouter `<app>` à la contrainte `site_leads_source_check` (nouvelle migration idempotente).
4. Application hôte : `<msec-assistant app="<app>" lang="fr" accent="#...">` chargé depuis `.../assistant/v2/msec-assistant.js`, derrière un interrupteur désactivé par défaut. Pour une application avec connexion : `requiresLogin: true`, propriété `tokenProvider` (jeton court signé par le serveur de l'application, voir `token.ts`) ; hors ligne : propriété `faq`.
5. Tests (`tests/assistant-<app>.test.mjs`), `npm test`, redéploiement de la fonction.

### Activer ou désactiver par application
- Côté serveur : `enabled` dans le profil (puis redéploiement) ; une application désactivée répond 403 `app_disabled`.
- Côté affichage : `PUBLIC_ASSISTANT_ENABLED` (site, portfolio), `NEXT_PUBLIC_ASSISTANT_ENABLED` (Malaika, Vercel), `VITE_ASSISTANT_ENABLED` (caisse POS Pro), `ASSISTANT_ENABLED` (back-office Laravel). Tous désactivés par défaut.

### POS Pro : jeton de connexion
Le même secret aléatoire doit exister dans Laravel (`ASSISTANT_POS_SECRET`) et dans Supabase : `npx supabase secrets set ASSISTANT_POS_SECRET=<valeur> --project-ref cinzlzdfddvcjhmvnbtp`. Sans secret, le profil `pos` refuse tout (401).

### Changer de modèle, lire les journaux
Voir les deux sections précédentes ; le journal `assistant_logs` a maintenant une colonne `app` : `select app, count(*) from assistant_logs group by app;`. Les demandes laissées dans `site_leads` portent `source = '<app>'`.

### Déploiement (ordre obligatoire)
1. Appliquer `supabase/migrations/20261106_assistant_multi_app.sql` sur `pos-pro-msec`.
2. `npx supabase functions deploy assistant --project-ref cinzlzdfddvcjhmvnbtp --no-verify-jwt --yes`.
3. `node scripts/assistant-live-check.mjs` puis lecture du tableau.
