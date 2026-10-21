---
title: "Encaisser en CDF et en USD sans erreur"
description: "Les contrôles simples qui limitent les erreurs de caisse lorsqu'un commerce encaisse en francs congolais et en dollars américains."
date: 2026-10-20
author: "Mulume Izuba Oscar"
locale: "fr"
draft: true
tags: ["caisse", "CDF", "USD", "contrôle interne"]
---

Un commerce qui encaisse en CDF et en USD doit gérer deux monnaies, mais aussi deux façons de compter, de rendre la monnaie et de contrôler la caisse. Les erreurs ne viennent pas seulement du taux de change : elles viennent souvent de règles floues et de saisies faites à la hâte.

## 1. Séparer les deux devises dans la caisse

Le tiroir-caisse doit permettre de distinguer clairement les billets et les pièces en CDF et en USD. Dans le logiciel, chaque paiement doit être enregistré avec sa devise ISO : `CDF` ou `USD`. Évitez les champs libres du type « dollars », « USD », « $ » ou « FC » dans la base de données.

L'affichage peut écrire « FC » pour le public, mais l'enregistrement doit rester cohérent. Cette séparation simplifie le rapprochement de caisse et évite de mélanger deux montants qui ne s'additionnent pas.

## 2. Définir une règle de conversion écrite

Si le commerce accepte une conversion entre les deux devises, la règle doit être écrite et appliquée de la même manière par tous les caissiers :

- qui fixe le taux ou le prix de conversion ;
- à quel moment il est mis à jour ;
- comment il est affiché au client ;
- comment l'arrondi est calculé ;
- comment la conversion est conservée dans la transaction.

Une règle non écrite devient une décision personnelle, donc une source d'écarts.

## 3. Afficher le prix dans la devise attendue

Pour éviter les malentendus, le prix principal doit être clairement identifié. Si un prix est affiché en USD mais payé en CDF, le montant en CDF et la règle de conversion doivent apparaître sur le reçu ou sur l'écran de paiement. Le client doit pouvoir vérifier ce qu'il paie.

## 4. Compter la caisse par devise

En fin de service, comptez séparément les espèces en CDF et en USD, puis rapprochez chaque total des ventes enregistrées dans la même devise. N'additionnez pas les deux monnaies dans un seul total sans conversion documentée : cela masque les écarts au lieu de les révéler.

Le rapprochement doit aussi tenir compte des paiements mobile money, qui ne sont pas des espèces. Chaque moyen de paiement mérite sa propre ligne.

## 5. Gérer les rôles et les corrections

Les remises, annulations et corrections de prix doivent être limitées à des personnes identifiées. Chaque correction doit laisser une trace : qui l'a faite, quand, sur quelle vente et pourquoi. Sans cette trace, il est impossible de distinguer une erreur honnête d'un détournement.

## 6. Vérifier les paiements mobile money

Pour le mobile money utilisé en RDC — M-Pesa, Airtel Money, Orange Money et Afrimoney —, la caisse doit enregistrer une référence de transaction et un statut. Un paiement annoncé par le client n'est pas un paiement confirmé. La confirmation doit venir d'une source vérifiable, puis être rattachée à la vente.

## 7. Former et observer

Le meilleur contrôle est une équipe formée à la même procédure. Faites un exercice court : un paiement en CDF, un paiement en USD, un paiement mixte si le commerce l'autorise, puis un rapprochement de caisse. Notez les hésitations et corrigez la procédure.

## Ce qu'il faut retenir

Une caisse bi-devise fiable repose sur des règles simples : deux devises séparées, une conversion écrite, des reçus lisibles, un rapprochement par moyen de paiement et des corrections traçables. La technique aide, mais la clarté de la procédure reste déterminante.
