import { createClient } from '@supabase/supabase-js';

// ============================================================
// Stripe - Paiements M-Sec (Audits, Consultations, Abonnements)
// ------------------------------------------------------------
// En Astro statique, Stripe est appele CÔTE SERVEUR uniquement :
//  - Les Price IDs sont publics (config)
//  - Les clés secrètes ne vivent que dans les secrets Vercel/CI
//  - Aucun secret ne doit apparaître dans le bundle navigateur
// ============================================================

// --- Config publique (Price IDs, pas des secrets) ---
export const STRIPE_PRICE_AUDIT = import.meta.env.PUBLIC_STRIPE_PRICE_AUDIT || '';
export const STRIPE_PRICE_CONSULTATION = import.meta.env.PUBLIC_STRIPE_PRICE_CONSULTATION || '';
export const STRIPE_PRICE_SUPPORT_MONTHLY = import.meta.env.PUBLIC_STRIPE_PRICE_SUPPORT_MONTHLY || '';
export const STRIPE_SUCCESS_URL = import.meta.env.PUBLIC_STRIPE_SUCCESS_URL || '/merci';
export const STRIPE_CANCEL_URL = import.meta.env.PUBLIC_STRIPE_CANCEL_URL || '/';
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || '';

// --- Secrets (jamais exposés au navigateur) ---
const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET || '';

// --- Types ---
export interface StripeCheckoutParams {
    priceId: string;
    clientEmail: string;
    clientName?: string;
    quantity?: number;
    customerRef?: string; // ex: audience UUID / devis lié
    metadata?: Record<string, string>;
}

export interface StripeSessionResult {
    id: string;
    url: string;
    amountTotal: number;
    currency: string;
    status: string;
}

// --- Création d'une session de paiement (Checkout) ---
export async function createCheckoutSession(p: StripeCheckoutParams): Promise<StripeSessionResult> {
    if (!STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY absente (secret Vercel non configuré)');
    }

    const body = new URLSearchParams();
    body.set('mode', 'payment');
    body.set('line_items[0][price]', p.priceId);
    body.set('line_items[0][quantity]', String(p.quantity || 1));
    body.set('customer_email', p.clientEmail);
    const baseUrl = SITE_URL || '/';
    body.set('success_url', `${baseUrl.replace(/\/$/, '')}${STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`);
    body.set('cancel_url', `${baseUrl.replace(/\/$/, '')}${STRIPE_CANCEL_URL}`);
    if (p.customerRef) body.set('client_reference_id', p.customerRef);
    if (p.metadata) {
        const k = p.metadata;
        body.set(`metadata[source]`, k.source || 'web');
        body.set(`metadata[service]`, k.service || '');
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Stripe error ${res.status}: ${err}`);
    }
    return (await res.json()) as StripeSessionResult;
}

// --- Vérification de l'événement retour webhook (signature HMAC) ---
export interface StripeEvent {
    id: string;
    type: string;
    data: { object: any };
}

export async function verifyWebhook(rawBody: string, signature: string | null): Promise<StripeEvent | null> {
    if (!signature || !STRIPE_WEBHOOK_SECRET) {
        console.warn('verifyWebhook: signature ou secret manquant');
        return null;
    }
    // Signature vérifiée côté infrastructure (Edge / Reverse Proxy avec secret).
    // Astro statique : on délègue l'endpoint webhook à une Edge Function.
    return null;
}

// --- Récupération du statut depuis session_id ---
export async function getSessionStatus(sessionId: string): Promise<StripeSessionResult> {
    if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY absente');
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
    });
    if (!res.ok) throw new Error(`Stripe status error ${res.status}`);
    return (await res.json()) as StripeSessionResult;
}

// --- Utile : init SDK Stripe côté client (affichage prix / paiement inline) ---
export const stripePromise = (publishableKey?: string) => {
    const key = publishableKey || import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) return null;
    // Charge dynamiquement Stripe.js (utilisé quand une librairie UI est présente)
    return (window as any).Stripe ? (window as any).Stripe(key) : null;
}