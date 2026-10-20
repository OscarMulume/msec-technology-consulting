# AGENTS.md — Contexte permanent M-SEC

OpenCode lit ce fichier automatiquement. Il décrit qui nous sommes, ce qui existe, et les règles de travail.
Toute mission doit respecter ce contexte. En cas de doute : ne pas deviner, poser la question ou l'écrire dans le rapport.

## 1. Identité

- Marque officielle : **M-SEC Technology Consulting** (« M-SEC » = Mulume Security). Toujours écrit `M-SEC`
  dans les textes visibles (jamais « M-Sec », « MSEC », « MM-SEC », « MCP »). Identifiants techniques en minuscules : `msec`.
- Fondateur et éditeur : **Mulume Izuba Oscar**, Kinshasa, République démocratique du Congo.
- Statut visé : un studio-startup. M-SEC (conseil IT, réseaux, cybersécurité) finance des produits SaaS.
  Produit phare : **POS Pro**. Produits suivants : **Herbo**, **MonImmo**.
- Copyright : « © 2026 M-SEC Technology Consulting — Mulume Izuba Oscar. Tous droits réservés. »

## 2. Produits et dépôts

| Produit | Dépôt GitHub | Dossier local | Rôle | État au 20/10/2026 |
|---|---|---|---|---|
| Site M-SEC | OscarMulume/msec-technology-consulting (public) | C:\pos-system\repos\msec-technology-consulting | Vitrine, prospects, blog | En ligne sur GitHub Pages ; formulaires NON branchés (perdent les demandes) |
| POS Pro | OscarMulume/pos_msec (privé) | C:\pos-system | Caisse restaurant : Laravel + caisse hors-ligne pos-shared + .exe (Tauri) + .apk (Capacitor) | Phase 1 + sprint 0 faits, CI verte ; pas encore en ligne |
| Herbo | OscarMulume/herbo (public) | C:\pos-system\repos\herbo | Boutique de médicaments traditionnels (Next.js + Supabase) | Jamais lancé ; à relancer proprement |
| MonImmo | OscarMulume/mon-immmo-app (public) | C:\pos-system\repos\mon-immmo-app | Immobilier | En pause |
| Plateforme M-SEC | (local, C:\herbo-monorepo) | C:\herbo-monorepo | Messagerie, devis/factures QR | En pause ; ce n'est PAS Herbo |

## 3. Infrastructure (décidée)

- Bases : Supabase organisation « M-SEC TECHNOLOGY CONSULTING » (offre gratuite = 2 projets actifs) :
  `pos-pro` (Francfort, réservé au serveur Laravel de POS Pro, fermé à l'API publique) et
  `pos-pro-msec` (à renommer `msec-apps` : site M-SEC, Herbo, MonImmo, chacun dans son propre schéma).
  Bases supplémentaires si besoin : Neon (gratuit).
- Hébergement : serveur POS Pro sur Render (gratuit, s'endort après 15 min) ; sites statiques sur GitHub Pages puis
  Cloudflare Pages. **Pas de Vercel Hobby** pour un usage commercial (interdit par ses conditions).
- Jamais de domaine inventé : l'adresse d'API de POS Pro est https://pos-pro-msec.onrender.com tant qu'Oscar n'a pas
  acheté de domaine.

## 4. Contexte RDC (à respecter dans tout le code)

- Devises ISO 4217 : **CDF** et **USD** uniquement en base et dans le code ; l'affichage peut écrire « FC ».
- Mobile money en RDC : **M-Pesa (Vodacom), Airtel Money, Orange Money, Afrimoney (Africell)**.
  MTN MoMo et Moov Money N'EXISTENT PAS en RDC (vestige d'un modèle ivoirien : à supprimer partout).
- Connexion internet faible ou coupée fréquemment : hors-ligne d'abord, pages légères, images optimisées.
- Langues : français (principal), anglais ; plus tard lingala et swahili. Tous les textes visibles passent par des
  fichiers de traduction, jamais écrits en dur.
- Beaucoup de téléphones Android d'entrée de gamme : les effets visuels lourds se désactivent sur appareil lent.

## 5. Design (M-SEC Design System)

- Direction : style Apple iOS 26 « Liquid Glass » : surfaces translucides (backdrop-filter), barres et panneaux flottants,
  coins arrondis, typographie nette, mode clair et sombre.
- Le verre est réservé à la navigation, aux barres d'outils et aux panneaux flottants ; le contenu reste sur fond opaque
  pour la lisibilité. Respecter `prefers-reduced-transparency`, `prefers-reduced-motion` et `prefers-color-scheme`.
- Accessibilité : contraste AA minimum, cibles tactiles de 44 px minimum, navigation clavier, textes alternatifs.
- Une seule source de jetons (couleurs, rayons, ombres, flous, espacements) réutilisée par tous les produits.

## 6. Règles de travail (non négociables)

1. Un sujet = un commit + un tag. Messages de commit en français. Pas de push sans demande explicite dans la mission.
2. Avant chaque commit : lint, typecheck et tests du dépôt. Rien n'est « fait » tant que la CI n'est pas verte.
3. Ne jamais afficher, écrire ou committer un secret (.env, clés, jetons). Seulement des `.env.example` sans valeurs.
   La clé publique Supabase (publishable/anon) n'est pas un secret mais passe quand même par une variable d'environnement.
4. Ne jamais inventer : un domaine, un opérateur, un prix, un client, un chiffre, une certification, un témoignage.
   Une information manquante = un TODO visible + une question dans le rapport.
5. Ne jamais afficher « envoyé avec succès » si l'envoi n'a pas réellement réussi.
6. Pas d'affirmations absolues dans les textes commerciaux (« ne tombe jamais en panne », « zéro faille ») :
   formulations vérifiables uniquement.
7. Chaque mission se termine par un rapport `docs/RAPPORT-<mission>-<AAAA-MM-JJ>.md` : tableau étape | fichiers | tests | résultat,
   ce qui n'a pas pu être fait et pourquoi, questions pour Oscar. Puis S'ARRÊTER.
8. Les vérifications indépendantes sont faites par Claude ; signaler dans le rapport tout ce qui n'a pas pu être testé
   localement (ex. PostgreSQL, build Android).
