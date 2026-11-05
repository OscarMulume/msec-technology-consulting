# Rapport — mission « assistant-allegement » (05/11/2026)

Constat vérifié par Claude le 05/11 : avec Groq (`openai/gpt-oss-120b`, offre gratuite : 8 000 tokens/minute,
200 000/jour), la 1re question répond en 2,4 s puis les suivantes sont refusées en 0,3 s, parce que chaque requête
envoyait toute la fiche de connaissances (~6 000 tokens).

## Ce qui change

- `scripts/build-knowledge.mjs` découpe maintenant les fiches par section `##` et génère `KNOWLEDGE_SECTIONS`
  (identité marquée « toujours », mots-clés simples par section).
- `supabase/functions/assistant/core.ts` n'envoie plus que l'identité/contact + les 2 sections les plus pertinentes
  (moins de 1 500 jetons de connaissances par requête), garde les règles anti-invention du prompt et limite
  l'historique aux 4 derniers tours.
- Réponse 429 du fournisseur : attente du `retry-after` (plafonnée à 8 s) puis un seul réessai.
- `max_tokens` passe de 400 à 350.
- `scripts/assistant-live-check.mjs` marque 8 s de pause entre les questions.

## Étapes

| Étape | Fichiers | Tests | Commit | Tag | Poussé |
|---|---|---|---|---|---|
| Allègement du contexte, historique 4 tours, 429, test réel | `scripts/build-knowledge.mjs`, `supabase/functions/assistant/{core,index}.ts`, `knowledge.generated.ts`, `tests/assistant-function.test.mjs`, `scripts/assistant-live-check.mjs`, `docs/ASSISTANT.md`, `.gitignore` | `npm test` vert : 31 tests unitaires, build, astro check 0 erreur, html-validate, 891 liens, 3/3 liens Credly | voir tag | `assistant-allegement` | oui |
| Redéploiement + test réel | fonction Edge `assistant` (Supabase `cinzlzdfddvcjhmvnbtp`) | `node scripts/assistant-live-check.mjs` : tableau ci-dessous | voir commit suivant | — | oui |

## Test réel après déploiement

Tableau à coller après le redéploiement et l'exécution de `node scripts/assistant-live-check.mjs`.

## Ce qui n'a pas pu être testé localement

- Aucun appel réel au fournisseur Groq dans `npm test` : les tests simulent le fournisseur (dont le 429 et le
  `retry-after`).
- Deno n'est pas installé sur le poste : `index.ts` (`Deno.serve`) et la fonction SQL `assistant_hit` ne sont
  vérifiés qu'après le déploiement, par le test réel.
