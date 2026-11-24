# Rapport — M-SEC : plateforme d'accompagnement + certifications

**Date :** 2026-11-24

## Objet

Deux demandes d'Oscar :
1. Repositionner M-SEC en **plateforme d'accompagnement de projets innovants** (aider les entrepreneurs à
   développer, publier, partager leur projet et à préparer la mise en relation avec des investisseurs).
2. Ajouter les **certifications pertinentes** du fondateur sur le site.

## Ce qui a été fait

| Étape | Fichiers | Tests | Poussé |
|---|---|---|---|
| Section « Studio / Accompagnement de projets » (6 offres + note honnête + CTA) | `HomePage.astro`, `i18n/fr.json`, `i18n/en.json` | build + typecheck + html-validate verts | oui |
| Certifications étendues (ISOC 15 parcours, Liquid/UNHCR/CTF) dans la grille | `i18n/fr.json`, `i18n/en.json` | idem | oui |
| `check:credentials` rendu résilient au réseau (erreur réseau = avertissement) | `scripts/check-credentials.mjs` | exit 0 | oui |

## Cadrage honnête (AGENTS.md §4, §6)

- La note de la section Studio précise : **pas de garantie de financement** — M-SEC aide à présenter le projet,
  pas à promettre de l'argent.
- Certifications : ISOC/Liquid/UNHCR/CTF décrites telles quelles, sans survente ; badges Cisco inchangés.

## Attribution des commits (demande d'Oscar, 24/11/2026)

- À partir de ce commit, les commits sont signés **au seul nom d'Oscar Mulume**
  (`oscarmulume1612@gmail.com`), **sans** ligne `Co-Authored-By: Claude`. Projets présentés comme personnels.
- Les commits antérieurs déjà poussés conservent l'ancienne mention : non réécrits (réécriture de `main` risquée),
  à faire seulement sur demande explicite.

## Non fait / à valider

- Le lien de navigation vers la section « Accompagnement » n'a pas encore été ajouté au menu (Header) — à faire
  si Oscar valide le positionnement.
- Liens ISOC/Credly non re-testés en direct (proxy de l'environnement) ; la CI les teste au déploiement.

## Question pour Oscar

- Veux-tu un **lien « Accompagnement » dans le menu principal** et un visuel dédié pour cette section ?
