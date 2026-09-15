// ============================================================
// SideShift - Paiement en crypto pour M-Sec
// ------------------------------------------------------------
// SideShift AI convertit de multiples actifs (BTC, ETH, USDT,
// SOL...) vers les coins reçus (ex: XRP) en mode "shift" sans
// KYC. Ici : création d'un ordre de shift via l'API (côté
// serveur), puis suivi du statut et attribution au client.
//
// Docs: https://sideshift.ai/api
// ============================================================

// --- Secrets (jamais exposés au navigateur) ---
const SIDESHIFT_API_KEY = import.meta.env.SIDESHIFT_API_KEY || '';

// --- Ids des coins / settle (configuration publique) ---
export const SIDESHIFT_SETTLE_COIN = import.meta.env.PUBLIC_SIDESHIFT_SETTLE_COIN || 'xrp';
export const SIDESHIFT_NETWORK = import.meta.env.PUBLIC_SIDESHIFT_NETWORK || 'ripple';
export const SIDESHIFT_SUCCESS_URL = import.meta.env.PUBLIC_SIDESHIFT_SUCCESS_URL || '/merci';

// --- Types ---
export interface ShiftOrderRequest {
    depositCoin: string;        // ex: 'btc', 'eth', 'usdt'
    settleCoin: string;         // coin reçu (ex: 'xrp')
    depositNetwork?: string;
    settleNetwork?: string;
    refundAddress?: string;     // adresse de remboursement (requise côté client)
    amount?: number;            // montant à échanger (optionnel)
}

export interface ShiftOrder {
    id: string;
    status: 'awaiting_deposit' | 'signed' | 'pending' | 'processing' | 'complete' | 'failed';
    depositAddress: string;
    depositCoin: string;
    settleCoin: string;
    depositAmount?: number;
    settleAmount?: number;
    createdAt: string;
    timeoutAt?: string;
}

export interface ShiftOrderStatus {
    status: ShiftOrder['status'];
    txid?: string;
    txUrl?: string;
    settleAmount?: number;
}

// --- Créer un ordre de shift ---
export async function createShiftOrder(req: ShiftOrderRequest): Promise<ShiftOrder> {
    if (!SIDESHIFT_API_KEY) {
        throw new Error('SIDESHIFT_API_KEY absente (secret non configuré)');
    }

    const body = {
        depositCoin: req.depositCoin,
        settleCoin: req.settleCoin,
        depositNetwork: req.depositNetwork || '',
        settleNetwork: req.settleNetwork || '',
        refundAddress: req.refundAddress || '',
        amount: req.amount,
    };

    const res = await fetch('https://api.sideshift.ai/v1/orders', {
        method: 'POST',
        headers: {
            'x-api-key': SIDESHIFT_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`SideShift error ${res.status}: ${err}`);
    }
    return (await res.json()) as ShiftOrder;
}

// --- Récupérer le statut d'un ordre ---
export async function getOrderStatus(orderId: string): Promise<ShiftOrderStatus> {
    const res = await fetch(`https://api.sideshift.ai/v1/orders/${orderId}/status`, {
        headers: { 'x-api-key': SIDESHIFT_API_KEY },
    });
    if (!res.ok) throw new Error(`SideShift status error ${res.status}`);
    return (await res.json()) as ShiftOrderStatus;
}

// --- Liste des coins dépositables (pour l'UI) ---
export async function getSupportedCoins(): Promise<{ coin: string; network: string }[]> {
    const res = await fetch('https://api.sideshift.ai/v1/coins');
    if (!res.ok) throw new Error('SideShift coins error');
    const coins = (await res.json()) as any[];
    return coins
        .filter((c) => c.deposit)
        .map((c) => ({ coin: c.coin, network: c.network }));
}

// --- Suivi client : marquer un client/comande comme payé ---
export async function markOrderCompleted(email: string, orderId: string, metadata?: Record<string, string>) {
    // Appelle l'admin Supabase (ou une Edge Function) pour créer le
    // client "payé" après confirmation du shift.
    // NOTE: implémentation côté Edge Function / API Astro en prod.
    console.info(`SideShift complet: ${orderId} pour ${email}`, metadata);
}