# Rapport — mission « msbot-integration » (PROMPT-8)

Date : 06/11/2026. Dépôt : `msec-technology-consulting`. Référence : `docs/prompts/msbot-prototype-v6.html`, `FICHE-TECHNIQUE-MSBOT.md`.

## État des étapes

| Étape | Fichiers | Tests | Commit | Tag | Poussé |
|---|---|---|---|---|---|
| I1 — module réutilisable | `src/assistant/msbot.src.js`, `scripts/build-assistant-widget.mjs`, `public/assistant/msbot/msbot.js`, `tests/msbot-catalog.test.mjs` | `npm test` vert | I1+I2 commit unique | `msbot-i1` | oui |
| I2 — vraies réponses | `src/assistant/msec-assistant.src.js` | `npm test` vert | idem (même commit) | `msbot-i2` | oui |
| I3 — site M-SEC | composants Astro (`data-msbot`, `data-msbot-section`), observateur de sections | `npm test` vert | oui | `msbot-i3` | oui |
| I4 — portfolio | à faire | — | — | — | — |
| I5 — preuve visuelle | à faire | — | — | — | — |
| I6 — POS / Malaika | à faire | — | — | — | — |

## I1 — ce qui est fait

- Robot SVG complet (`markup`, `Bot`, 12 expressions) extrait sans redessin du prototype v6.
- Robot 3D (`Bot3D`, Three.js r128) extrait du prototype, chargé à la demande depuis cdnjs ; rendu Auto / 3D / Léger (`msbot-render`).
- Adaptation : pas de 3D si WebGL absent, moins de 4 cœurs, moins de 4 Go, 2G/3G, économie de données, animations réduites, Android 7/8 ; descente automatique en SVG après 3 s sous 40 images/s ; perte du contexte WebGL → SVG ; onglet caché déjà géré par `requestAnimationFrame`.
- Effets : vol, confettis, étincelles, onde de choc écran brisé (sobre), avion en papier, morse, téléportation.
- Dock/bulle + onglet « Rappeler MSBot » après 45 s + 30 s d'inactivité.
- Fenêtre « verre liquide » (`backdrop-filter`), mode sombre, attributs `bot-name`, `msbot-dark`, `msbot-accent`, `msbot-eye`, `msbot-emblem`, `msbot-render`.
- Catalogue : 220 comportements (165 littéraux + 11 champs × 5), identifiants uniques.
- Aucun laboratoire d'états, aucune bibliothèque/journal, aucun formulaire de démo, aucune réponse factice `answers`, aucune mention « Aperçu ».
- Module publié aussi seul : `public/assistant/msbot/msbot.js` (99 670 octets), en plus du bundle du widget.

## I2 — ce qui est fait

- `ask()` du prototype remplacé par l'appel Supabase existant (`post({ app, lang, messages })`) : mêmes paramètres, historique borné, 429 distingué, erreurs réseau gérées, Markdown assaini, capture de contact existante conservée.
- États MSBot : envoi → `scan`, frappe → `code`, réponse → `happy`, 429 → `sleep`, erreur fournisseur/réseau → `error` avec message clair.

## I3 — ce qui est fait

- Attributs posés : `call` (tel:), `mail` (mailto: en-tête de pied, cartes contact, secours du formulaire), `linkedin`, `whatsapp`, `blog` (menu), `quote` (boutons audit/devis), `services` (cartes), `data-msbot-section` sur chaque section de l'accueil.
- Les liens gardent leur comportement normal (aucun `preventDefault` dans le gestionnaire de clic, vérifié par test). Les réactions de champ du formulaire existaient déjà (M0-M5).
- Sections : contact, produits, services déclenchent une réaction une seule fois.
- Thème M-SEC : #0B2A4A / #E8A33D / #FFB547 / « MC ».

## Écarts assumés

- La 3D est rendue dans le lanceur (64 px bureau / 56 px téléphone) et non dans un grand plateau : le composant doit rester discret sur le site. Le module expose `mount(host, {render:'3d'})` si un grand plateau est souhaité plus tard.
- Le prototype `ask()` contenait des réponses factices (`answers`) : supprimées, remplacées par la vraie fonction Supabase.

## EN ATTENTE D'OSCAR

- Rien à ce stade.
