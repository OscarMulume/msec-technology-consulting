---
title: "Taking payments in CDF and USD without errors"
description: "Simple controls that reduce cashier errors when a business accepts Congolese francs and US dollars."
date: 2026-10-20
author: "Mulume Izuba Oscar"
locale: "en"
draft: true
tags: ["point of sale", "CDF", "USD", "internal control"]
---

A business that accepts CDF and USD manages two currencies, but also two ways of counting, giving change and reconciling the till. Errors do not only come from the exchange rate: they often come from unclear rules and rushed entries.

## 1. Separate both currencies in the till

The cash drawer must clearly distinguish CDF and USD notes and coins. In the software, every payment must be recorded with its ISO currency: `CDF` or `USD`. Avoid free-text fields such as “dollars”, “USD”, “$” or “FC” in the database.

The display may say “FC” for the public, but storage must remain consistent. This separation simplifies cash reconciliation and prevents mixing two amounts that cannot simply be added together.

## 2. Define a written conversion rule

If the business accepts conversion between the two currencies, the rule must be written and applied in the same way by every cashier:

- who sets the rate or conversion price;
- when it is updated;
- how it is shown to the customer;
- how rounding is calculated;
- how the conversion is kept in the transaction.

An unwritten rule becomes a personal decision, and therefore a source of discrepancies.

## 3. Show the price in the expected currency

To avoid misunderstandings, the main price must be clearly identified. If a price is shown in USD but paid in CDF, the CDF amount and the conversion rule must appear on the receipt or payment screen. The customer must be able to check what they are paying.

## 4. Count the till by currency

At the end of a shift, count CDF and USD cash separately, then reconcile each total against sales recorded in the same currency. Do not add both currencies into one total without a documented conversion: this hides discrepancies instead of revealing them.

Reconciliation must also include mobile money payments, which are not cash. Each payment method deserves its own line.

## 5. Manage roles and corrections

Discounts, cancellations and price corrections should be limited to identified people. Every correction must leave a trace: who made it, when, on which sale and why. Without that trace, it is impossible to distinguish an honest mistake from misappropriation.

## 6. Check mobile money payments

For the mobile money used in DR Congo — M-Pesa, Airtel Money, Orange Money and Afrimoney — the point of sale must record a transaction reference and a status. A payment announced by the customer is not a confirmed payment. Confirmation must come from a verifiable source, then be linked to the sale.

## 7. Train and observe

The best control is a team trained in the same procedure. Run a short exercise: a CDF payment, a USD payment, a mixed payment if the business allows it, then a till reconciliation. Note any hesitation and correct the procedure.

## What to remember

A reliable dual-currency till relies on simple rules: separate currencies, a written conversion, readable receipts, reconciliation by payment method and traceable corrections. Technology helps, but the clarity of the procedure remains decisive.
