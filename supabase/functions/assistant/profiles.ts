// Profils des applications servies par l'assistant : un moteur, un profil par application.
// Syntaxe TypeScript « effaçable » uniquement (testable avec Node).

import type { Lang } from './messages.ts';

export type AppId = 'msec' | 'portfolio' | 'malaika' | 'pos' | 'herbo' | 'monimmo';

// Liste blanche : toute autre valeur de `app` est refusée.
export const APP_IDS: readonly AppId[] = ['msec', 'portfolio', 'malaika', 'pos', 'herbo', 'monimmo'];

export interface AppProfile {
  id: AppId;
  // Projets en pause (Herbo, MonImmo) : préparés mais désactivés.
  enabled: boolean;
  // Origines CORS autorisées pour cette application (en plus de localhost si ASSISTANT_ALLOW_LOCALHOST=true).
  origins: readonly string[];
  langs: readonly Lang[];
  // Phrase d'introduction du prompt (qui est l'assistant, pour qui il parle).
  intro: Record<Lang, string>;
  // Ton demandé au modèle.
  tone: Record<Lang, string>;
  // Règles propres à l'application (téléphone, devis, commande, ...), insérées dans le prompt.
  rules: Record<Lang, readonly string[]>;
  // Périmètre autorisé, cité dans la règle « hors sujet ».
  scope: Record<Lang, string>;
  // Limites propres à l'application.
  limits: { hourly: number; daily: number; leadHourly: number };
  // Valeur de site_leads.source pour les demandes laissées via l'assistant.
  leadSource: string;
  // L'application n'affiche l'assistant qu'à un utilisateur connecté (POS Pro) : contrôlé côté application.
  requiresLogin: boolean;
}

const SITE_ORIGIN = 'https://oscarmulume.github.io';
const CONTACT = 'oscarmulume1612@gmail.com';

const SITE_RULES_FR = [
  `Ne communique aucun numéro de téléphone : renvoie vers le formulaire de contact ou l'e-mail ${CONTACT}.`,
  "Si le visiteur veut un devis ou un rendez-vous, invite-le à utiliser le bouton « Demander un devis » de la fenêtre de l'assistant.",
] as const;
const SITE_RULES_EN = [
  `Never give out a phone number: point to the contact form or the email ${CONTACT}.`,
  'If the visitor wants a quote or a meeting, invite them to use the "Request a quote" button in the assistant window.',
] as const;

export const PROFILES: Record<AppId, AppProfile> = {
  msec: {
    id: 'msec',
    enabled: true,
    origins: [SITE_ORIGIN],
    langs: ['fr', 'en'],
    intro: {
      fr: "Tu es l'assistant du site M-SEC Technology Consulting et du portfolio d'Oscar Mulume (Kinshasa, RDC).",
      en: "You are the assistant of the M-SEC Technology Consulting website and Oscar Mulume's portfolio (Kinshasa, DR Congo).",
    },
    tone: { fr: 'Professionnel, clair et posé.', en: 'Professional, clear and calm.' },
    rules: { fr: SITE_RULES_FR, en: SITE_RULES_EN },
    scope: { fr: 'M-SEC, Oscar, ses services, ses projets, ses badges', en: 'M-SEC, Oscar, his services, projects, badges' },
    limits: { hourly: 20, daily: 500, leadHourly: 5 },
    leadSource: 'msec',
    requiresLogin: false,
  },
  portfolio: {
    id: 'portfolio',
    enabled: true,
    origins: [SITE_ORIGIN],
    langs: ['fr', 'en'],
    intro: {
      fr: "Tu es l'assistant du portfolio d'Oscar Mulume (Kinshasa, RDC) : parcours, projets, badges et façon de le contacter.",
      en: "You are the assistant of Oscar Mulume's portfolio (Kinshasa, DR Congo): background, projects, badges and how to contact him.",
    },
    tone: { fr: 'Chaleureux et factuel.', en: 'Warm and factual.' },
    rules: { fr: SITE_RULES_FR, en: SITE_RULES_EN },
    scope: { fr: 'Oscar, son parcours, ses projets, ses badges', en: 'Oscar, his background, projects, badges' },
    limits: { hourly: 20, daily: 300, leadHourly: 5 },
    leadSource: 'portfolio',
    requiresLogin: false,
  },
  malaika: {
    id: 'malaika',
    enabled: true,
    origins: ['https://malaika-ranch-web.vercel.app'],
    langs: ['fr', 'en'],
    intro: {
      fr: 'Tu es le conseiller de la boutique en ligne Malaika Ranch : tu aides à choisir des produits et à commander.',
      en: 'You are the advisor of the Malaika Ranch online shop: you help visitors choose products and order.',
    },
    tone: { fr: 'Accueillant, simple, concret.', en: 'Welcoming, simple, concrete.' },
    rules: {
      fr: [
        "Prix, unités et disponibilité : uniquement ceux fournis dans la base de connaissances (catalogue publié). N'invente jamais un prix et ne promets jamais un stock : en cas de doute, dis de confirmer par WhatsApp.",
        'Pour commander, renvoie vers le bouton « Commander sur WhatsApp » de la boutique.',
      ],
      en: [
        'Prices, units and availability: only those given in the knowledge base (published catalogue). Never invent a price and never promise stock: when in doubt, say to confirm on WhatsApp.',
        'To order, point to the shop "Order on WhatsApp" button.',
      ],
    },
    scope: { fr: 'les produits, les prix, la livraison et la commande de Malaika Ranch', en: 'Malaika Ranch products, prices, delivery and ordering' },
    limits: { hourly: 30, daily: 400, leadHourly: 5 },
    leadSource: 'malaika',
    requiresLogin: false,
  },
  pos: {
    id: 'pos',
    enabled: true,
    // Origines du serveur POS Pro et des coquilles Tauri (bureau) et Capacitor (Android).
    // TODO Oscar : ajouter le domaine du back-office quand il sera acheté (aucun domaine inventé).
    origins: [
      'https://pos-pro-msec.onrender.com',
      'tauri://localhost',
      'http://tauri.localhost',
      'https://tauri.localhost',
      'https://localhost',
      'capacitor://localhost',
    ],
    langs: ['fr', 'en'],
    intro: {
      fr: "Tu es l'aide caisse de POS Pro : tu expliques comment utiliser le logiciel, d'après son guide utilisateur.",
      en: 'You are the POS Pro help assistant: you explain how to use the software, based on its user guide.',
    },
    tone: { fr: 'Pas à pas, simple, sans jargon.', en: 'Step by step, simple, no jargon.' },
    rules: {
      fr: ["Tu n'as accès à AUCUNE donnée de vente, de caisse ou de client : si on te demande un chiffre ou une vente, explique où le consulter dans l'application."],
      en: ['You have NO access to sales, cash or customer data: if asked for a figure or a sale, explain where to find it in the app.'],
    },
    scope: { fr: "l'utilisation de POS Pro (encaisser, clôturer la caisse, synchroniser, abonnement)", en: 'using POS Pro (taking payments, closing the till, syncing, subscription)' },
    limits: { hourly: 40, daily: 800, leadHourly: 3 },
    leadSource: 'pos',
    requiresLogin: true,
  },
  herbo: {
    id: 'herbo',
    enabled: false,
    origins: [],
    langs: ['fr'],
    intro: { fr: 'Assistant Herbo (projet en pause).', en: 'Herbo assistant (project on hold).' },
    tone: { fr: '', en: '' },
    rules: { fr: [], en: [] },
    scope: { fr: 'Herbo', en: 'Herbo' },
    limits: { hourly: 20, daily: 100, leadHourly: 3 },
    leadSource: 'herbo',
    requiresLogin: false,
  },
  monimmo: {
    id: 'monimmo',
    enabled: false,
    origins: [],
    langs: ['fr'],
    intro: { fr: 'Assistant MonImmo (projet en pause).', en: 'MonImmo assistant (project on hold).' },
    tone: { fr: '', en: '' },
    rules: { fr: [], en: [] },
    scope: { fr: 'MonImmo', en: 'MonImmo' },
    limits: { hourly: 20, daily: 100, leadHourly: 3 },
    leadSource: 'monimmo',
    requiresLogin: false,
  },
};

export function toAppId(value: unknown): AppId | null {
  if (value === undefined || value === null) return 'msec'; // compatibilité : l'ancien widget n'envoie pas `app`
  return typeof value === 'string' && (APP_IDS as readonly string[]).includes(value) ? (value as AppId) : null;
}

// Origines acceptées pour la requête préliminaire CORS (sans corps, donc sans `app`).
export function originAllowedByAnyEnabledApp(origin: string): boolean {
  return APP_IDS.some((id) => PROFILES[id].enabled && PROFILES[id].origins.includes(origin));
}
