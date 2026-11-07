/*
 * <msec-assistant app="malaika" lang="fr" accent="#8a4b12"> : assistant M-SEC, un seul widget pour toutes les
 * applications (Web Component, sans dépendance). Aucune clé ici : le navigateur parle uniquement à la fonction
 * Supabase « assistant », qui garde les secrets côté serveur.
 * Attributs : app (msec | portfolio | malaika | pos, défaut msec), lang (fr | en), accent (#rrggbb),
 *   logo (URL https d'une image), endpoint (URL de la fonction), title, welcome.
 * Propriétés (code de l'application hôte) : orderAction = { label: {fr, en}, href: () => url } (bouton de commande),
 *   faq = [{ keywords: [..], answer: {fr, en} }] (réponses hors ligne, sans IA),
 *   tokenProvider = () => Promise<string> (jeton de connexion pour les applications qui exigent un utilisateur connecté, envoyé dans X-Assistant-Token).
 * Cible : ES2017 (WebView Android 7) — compilé par scripts/build-assistant-widget.mjs.
 */
(() => {
  'use strict';
  if (customElements.get('msec-assistant')) return;

  const DEFAULT_ENDPOINT = 'https://cinzlzdfddvcjhmvnbtp.supabase.co/functions/v1/assistant';
  const CONTACT_EMAIL = 'oscarmulume1612@gmail.com';
  const MAX_CHARS = 1500;
  const MAX_HISTORY = 20;
  const REQUEST_TIMEOUT_MS = 30000;

  // Textes visibles, par langue (un seul endroit à traduire).
  const I18N = {
    fr: {
      open: "Ouvrir l'assistant M-SEC",
      recall: 'Rappeler MSBot',
      close: "Fermer l'assistant",
      title: 'Assistant M-SEC',
      subtitle: "Réponses à partir des informations publiées sur M-SEC et Oscar Mulume. Un assistant IA peut se tromper.",
      welcome: "Bonjour ! Je peux vous renseigner sur M-SEC, les services d'Oscar Mulume, ses projets et ses badges. Que souhaitez-vous savoir ?",
      suggestions: ['Quels services propose M-SEC ?', "Quels sont les badges d'Oscar ?", 'Où en est POS Pro ?'],
      placeholder: 'Votre question…',
      send: 'Envoyer',
      thinking: "L'assistant réfléchit…",
      quote: 'Demander un devis',
      quoteTitle: 'Demande de contact',
      quoteIntro: 'Laissez vos coordonnées : Oscar vous répondra. Rien n’est envoyé tant que vous n’appuyez pas sur « Envoyer la demande ».',
      name: 'Votre nom',
      contact: 'E-mail ou numéro WhatsApp',
      need: 'Votre besoin',
      submit: 'Envoyer la demande',
      cancel: 'Retour au chat',
      sending: 'Envoi en cours…',
      leadOk: 'Votre demande a bien été enregistrée. Oscar vous répondra.',
      leadError: `Votre demande n’a PAS pu être enregistrée. Écrivez à ${CONTACT_EMAIL}.`,
      fieldsRequired: 'Merci de remplir les trois champs.',
      networkError: `L’assistant est momentanément indisponible. Écrivez à ${CONTACT_EMAIL} ou utilisez le formulaire de contact du site.`,
      you: 'Vous',
      assistant: 'Assistant',
    },
    en: {
      open: 'Open the M-SEC assistant',
      recall: 'Call MSBot back',
      close: 'Close the assistant',
      title: 'M-SEC assistant',
      subtitle: 'Answers come from the information published about M-SEC and Oscar Mulume. An AI assistant can make mistakes.',
      welcome: "Hello! I can tell you about M-SEC, Oscar Mulume's services, projects and badges. What would you like to know?",
      suggestions: ['What services does M-SEC offer?', "What are Oscar's badges?", 'Where is POS Pro at?'],
      placeholder: 'Your question…',
      send: 'Send',
      thinking: 'The assistant is thinking…',
      quote: 'Request a quote',
      quoteTitle: 'Contact request',
      quoteIntro: 'Leave your details and Oscar will reply. Nothing is sent until you press “Send request”.',
      name: 'Your name',
      contact: 'Email or WhatsApp number',
      need: 'Your need',
      submit: 'Send request',
      cancel: 'Back to chat',
      sending: 'Sending…',
      leadOk: 'Your request has been saved. Oscar will reply.',
      leadError: `Your request could NOT be saved. Email ${CONTACT_EMAIL}.`,
      fieldsRequired: 'Please fill in all three fields.',
      networkError: `The assistant is temporarily unavailable. Email ${CONTACT_EMAIL} or use the contact form on the site.`,
      you: 'You',
      assistant: 'Assistant',
    },
  };

  // Profils d'application : thème, accueil, suggestions. L'attribut accent="#rrggbb" prime sur l'accent du profil.
  const APPS = {
    msec: {
      accent: '#07727f',
      quote: true,
      title: { fr: 'Assistant M-SEC', en: 'M-SEC assistant' },
      subtitle: null,
      welcome: null,
      suggestions: null,
    },
    portfolio: {
      accent: '#3b4cca',
      quote: true,
      title: { fr: 'Assistant du portfolio', en: 'Portfolio assistant' },
      subtitle: { fr: 'Réponses à partir des informations publiées sur Oscar Mulume. Un assistant IA peut se tromper.', en: 'Answers come from the information published about Oscar Mulume. An AI assistant can make mistakes.' },
      welcome: { fr: "Bonjour ! Je peux vous parler du parcours d'Oscar Mulume, de ses projets et de ses badges. Que souhaitez-vous savoir ?", en: "Hello! I can tell you about Oscar Mulume's background, projects and badges. What would you like to know?" },
      suggestions: { fr: ['Qui est Oscar Mulume ?', 'Quels sont ses projets ?', 'Quels badges a-t-il ?'], en: ['Who is Oscar Mulume?', 'What are his projects?', 'What badges does he have?'] },
    },
    malaika: {
      accent: '#8a4b12',
      quote: false,
      title: { fr: 'Conseiller Malaika Ranch', en: 'Malaika Ranch advisor' },
      subtitle: { fr: 'Produits, prix et disponibilité lus sur la boutique. Un assistant IA peut se tromper : confirmez sur WhatsApp.', en: 'Products, prices and availability come from the shop. An AI assistant can make mistakes: confirm on WhatsApp.' },
      welcome: { fr: 'Bonjour ! Je peux vous aider à choisir des produits de Malaika Ranch et à passer commande. Que cherchez-vous ?', en: 'Hello! I can help you choose Malaika Ranch products and place an order. What are you looking for?' },
      suggestions: { fr: ['Quels produits sont disponibles ?', 'Comment commander ?', 'Quelles zones livrez-vous ?'], en: ['Which products are available?', 'How do I order?', 'Which areas do you deliver to?'] },
    },
    pos: {
      accent: '#0b5ed7',
      quote: false,
      title: { fr: 'Aide caisse POS Pro', en: 'POS Pro help' },
      subtitle: { fr: "Aide à l'utilisation de POS Pro. L'assistant ne voit aucune donnée de vente. Un assistant IA peut se tromper.", en: 'Help for using POS Pro. The assistant sees no sales data. An AI assistant can make mistakes.' },
      welcome: { fr: 'Bonjour ! Je peux vous expliquer comment utiliser POS Pro : encaisser, clôturer la caisse, synchroniser, abonnement.', en: 'Hello! I can explain how to use POS Pro: taking payments, closing the till, syncing, subscription.' },
      suggestions: { fr: ['Comment encaisser une vente ?', 'Comment clôturer la caisse ?', 'Comment synchroniser ?'], en: ['How do I take a payment?', 'How do I close the till?', 'How do I sync?'] },
    },
  };
  const OFFLINE_TEXT = {
    fr: 'Vous êtes hors ligne : je réponds avec la FAQ intégrée (sans IA). Reconnectez-vous pour poser une question libre.',
    en: 'You are offline: I answer from the built-in FAQ (no AI). Reconnect to ask a free-form question.',
  };
  const OFFLINE_NO_MATCH = {
    fr: "Hors ligne : je n'ai pas de réponse intégrée à cette question. Reconnectez-vous et réessayez.",
    en: 'Offline: I have no built-in answer to this question. Reconnect and try again.',
  };

  // --- Couleurs : contraste AA garanti pour l'accent choisi --------------------------------
  function parseHex(value) {
    const m = /^#([0-9a-f]{6})$/i.exec(String(value || '').trim());
    return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : null;
  }
  function toHex(rgb) {
    return '#' + rgb.map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
  }
  function luminance(rgb) {
    const lin = rgb.map((c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  }
  function contrast(a, b) {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function mix(rgb, target, amount) {
    return rgb.map((c, i) => c + (target[i] - c) * amount);
  }
  // Rapproche l'accent du noir (fond clair) ou du blanc (fond sombre) jusqu'à atteindre le contraste demandé.
  function ensureContrast(rgb, background, minimum, towards) {
    let color = rgb;
    for (let step = 0; step < 20 && contrast(color, background) < minimum; step += 1) color = mix(color, towards, 0.08);
    return color;
  }
  function themeVars(accentHex, dark) {
    const base = parseHex(accentHex) || parseHex('#07727f');
    const bg = dark ? [16, 28, 34] : [255, 255, 255];
    const accent = dark ? ensureContrast(base, bg, 4.5, [255, 255, 255]) : ensureContrast(base, bg, 4.5, [0, 0, 0]);
    const text = contrast(accent, [255, 255, 255]) >= contrast(accent, [0, 0, 0]) ? [255, 255, 255] : [0, 0, 0];
    return { accent: toHex(accent), contrast: toHex(text) };
  }

  const STYLE = `
    :host {
      --a-bg: #ffffff; --a-bg-soft: #eef2f5; --a-text: #10161d; --a-muted: #4c5a68;
      --a-border: rgba(16,22,29,.18); --a-accent: #07727f; --a-accent-contrast: #ffffff;
      --a-user: #07727f; --a-user-text: #ffffff; --a-danger: #b42318; --a-ok: #087a55;
      --a-shadow: 0 18px 50px rgba(16,35,45,.22);
      all: initial; position: fixed; z-index: 2147483000;
      right: 1rem;
      bottom: var(--msec-assistant-bottom, 1rem);
      right: max(1rem, env(safe-area-inset-right));
      bottom: calc(var(--msec-assistant-bottom, 1rem) + env(safe-area-inset-bottom, 0px));
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 15px; line-height: 1.45; color: var(--a-text);
    }
    :host([data-theme="dark"]) {
      --a-bg: #101c22; --a-bg-soft: #0b151a; --a-text: #f1f6f7; --a-muted: #b5c2c7;
      --a-border: rgba(229,244,247,.28); --a-accent: #4fd1c5; --a-accent-contrast: #042024;
      --a-user: #4fd1c5; --a-user-text: #042024; --a-danger: #ff9b90; --a-ok: #57d6a4;
      --a-shadow: 0 22px 60px rgba(0,0,0,.5);
    }
    *, *::before, *::after { box-sizing: border-box; }
    [hidden] { display: none !important; }
    button, input, textarea { font: inherit; color: inherit; }
    button { cursor: pointer; }
    :focus-visible { outline: 3px solid var(--a-accent); outline-offset: 2px; }
    .launcher {
      display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      min-width: 3.25rem; min-height: 3.25rem; padding: .25rem .9rem .25rem .3rem; border-radius: 999px; border: 1px solid var(--a-border);
      background: var(--a-accent); color: var(--a-accent-contrast); font-weight: 600; box-shadow: var(--a-shadow);
      transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
    }
    .launcher:hover { transform: translateY(-2px) scale(1.03); }
    .launcher svg { width: 1.4rem; height: 1.4rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .msbot-stage { display: block; width: 4rem; height: 4rem; flex: none; }
    .msbot-stage svg { width: 100%; height: 100%; }
    .launcher .msbot-label { font-size: .85rem; letter-spacing: .01em; }
    @media (prefers-reduced-motion: reduce) { .launcher, .launcher:hover { transition: none; transform: none; } }
    .launcher.away { display: none; }
    .recall { position: absolute; right: 0; bottom: 0; min-height: 2.75rem; padding: 0 1rem; border-radius: 999px; border: 1px solid var(--a-border); background: var(--a-bg); color: var(--a-text); box-shadow: var(--a-shadow); font-weight: 600; -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); }
    :host([data-theme="dark"]) .panel { background: rgba(16,28,34,.86); }
    @media (max-width: 520px) { .msbot-stage { width: 3.5rem; height: 3.5rem; } .launcher { min-height: 4rem; } }
    .panel {
      position: absolute; right: 0; bottom: 4rem; width: 20rem; max-width: calc(100vw - 2rem);
      height: 30rem; max-height: calc(100vh - 9rem); display: flex; flex-direction: column; overflow: hidden;
      background: var(--a-bg); border: 1px solid var(--a-border); border-radius: 1.5rem; box-shadow: var(--a-shadow);
      background: rgba(255,255,255,.82); -webkit-backdrop-filter: blur(20px) saturate(160%); backdrop-filter: blur(20px) saturate(160%);
    }
    @supports (width: min(1px, 2px)) { .panel { width: min(24rem, calc(100vw - 2rem)); height: min(34rem, calc(100vh - 9rem)); } }
    @supports (height: 1dvh) { .panel { max-height: calc(100dvh - 9rem); } }
    .logo { width: 2rem; height: 2rem; flex: none; border-radius: .5rem; object-fit: contain; }
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
    a.order { display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0 1rem; border-radius: .75rem; background: var(--a-accent); color: var(--a-accent-contrast); font-weight: 600; text-decoration: none; }
    header { display: flex; align-items: flex-start; gap: .5rem; padding: .85rem 1rem; border-bottom: 1px solid var(--a-border); }
    header div { flex: 1; min-width: 0; }
    header h2 { margin: 0; font-size: 1rem; }
    header p { margin: .15rem 0 0; font-size: .75rem; color: var(--a-muted); }
    .icon-btn { width: 2.75rem; height: 2.75rem; flex: none; border: 0; border-radius: .75rem; background: transparent; font-size: 1.4rem; line-height: 1; }
    .icon-btn:hover { background: var(--a-bg-soft); }
    .log { flex: 1; overflow-y: auto; padding: .85rem 1rem; display: flex; flex-direction: column; gap: .6rem; }
    .msg { max-width: 92%; padding: .55rem .8rem; border-radius: 1rem; background: var(--a-bg-soft); white-space: pre-wrap; overflow-wrap: anywhere; }
    .msg.user { align-self: flex-end; background: var(--a-user); color: var(--a-user-text); }
    .msg.error { border: 1px solid var(--a-danger); }
    .msg a { color: inherit; text-decoration: underline; }
    .msg .who { display: block; font-size: .7rem; opacity: .75; margin-bottom: .1rem; }
    .chips { display: flex; flex-wrap: wrap; gap: .4rem; }
    .chip { min-height: 2.75rem; padding: 0 .85rem; border: 1px solid var(--a-border); border-radius: 999px; background: var(--a-bg); }
    .chip:hover { background: var(--a-bg-soft); }
    .thinking { align-self: flex-start; display: inline-flex; align-items: center; gap: .35rem; padding: .55rem .8rem; border-radius: 1rem; background: var(--a-bg-soft); color: var(--a-muted); font-size: .85rem; }
    .dots { display: inline-flex; gap: .2rem; }
    .dots i { width: .45rem; height: .45rem; border-radius: 50%; background: var(--a-accent); animation: bounce 1.1s infinite ease-in-out; }
    .dots i:nth-child(2) { animation-delay: .15s; } .dots i:nth-child(3) { animation-delay: .3s; }
    @keyframes bounce { 0%, 80%, 100% { transform: scale(.55); opacity: .45; } 40% { transform: scale(1); opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .dots i { animation: none; opacity: .8; } }
    footer { padding: .6rem .75rem .75rem; border-top: 1px solid var(--a-border); display: flex; flex-direction: column; gap: .5rem; }
    .row { display: flex; gap: .5rem; align-items: flex-end; }
    textarea, input { width: 100%; padding: .6rem .7rem; border: 1px solid var(--a-border); border-radius: .75rem; background: var(--a-bg); min-height: 2.75rem; }
    textarea { resize: none; max-height: 6rem; }
    .primary { min-height: 2.75rem; padding: 0 1rem; border: 0; border-radius: .75rem; background: var(--a-accent); color: var(--a-accent-contrast); font-weight: 600; }
    .primary:disabled { opacity: .55; cursor: default; }
    .link-btn { align-self: flex-start; min-height: 2.75rem; padding: 0 .25rem; border: 0; background: transparent; color: var(--a-accent); font-weight: 600; text-decoration: underline; }
    form.lead { display: flex; flex-direction: column; gap: .6rem; padding: .85rem 1rem; overflow-y: auto; flex: 1; }
    form.lead p { margin: 0; font-size: .85rem; color: var(--a-muted); }
    form.lead label { display: flex; flex-direction: column; gap: .2rem; font-size: .85rem; font-weight: 600; }
    form.lead textarea { max-height: none; min-height: 5rem; }
    .status { min-height: 1.2rem; font-size: .85rem; }
    .status.error { color: var(--a-danger); } .status.ok { color: var(--a-ok); }
    .vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  `;

  const BUBBLE_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12Z"/><path d="M9 11h6M9 14h4"/></svg>';

  /** Texte brut -> nœuds DOM : liens https cliquables uniquement, jamais d'HTML injecté. */
  function appendRich(parent, text) {
    const pattern = /\[([^\]]{1,120})\]\((https:\/\/[^\s)]+)\)|(https:\/\/[^\s<>)\]]+[^\s<>)\].,;:!?])/g;
    let last = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > last) parent.append(text.slice(last, match.index));
      const link = document.createElement('a');
      link.href = match[2] || match[3];
      link.textContent = match[1] || match[3];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      parent.append(link);
      last = pattern.lastIndex;
    }
    if (last < text.length) parent.append(text.slice(last));
  }

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (key === 'text') node.textContent = value;
      else if (key === 'class') node.className = value;
      else node.setAttribute(key, value);
    }
    for (const child of children) node.append(child);
    return node;
  }

  class MsecAssistant extends HTMLElement {
    constructor() {
      super();
      this.history = [];
      this.busy = false;
      this.built = false;
    }

    connectedCallback() {
      if (this.built) return;
      this.built = true;
      this.lang = (this.getAttribute('lang') || document.documentElement.lang || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr';
      this.t = Object.assign({}, I18N[this.lang]);
      const appName = (this.getAttribute('app') || 'msec').toLowerCase();
      this.app = APPS[appName] ? appName : 'msec';
      const profile = APPS[this.app];
      if (profile.title) this.t.title = profile.title[this.lang];
      if (profile.subtitle) this.t.subtitle = profile.subtitle[this.lang];
      if (profile.welcome) this.t.welcome = profile.welcome[this.lang];
      if (profile.suggestions) this.t.suggestions = profile.suggestions[this.lang];
      if (this.getAttribute('title')) this.t.title = this.getAttribute('title').slice(0, 60);
      if (this.getAttribute('welcome')) this.t.welcome = this.getAttribute('welcome').slice(0, 300);
      if (this.app !== 'msec' || this.getAttribute('title')) this.t.open = (this.lang === 'en' ? 'Open: ' : 'Ouvrir : ') + this.t.title;
      this.accentValue = parseHex(this.getAttribute('accent')) ? this.getAttribute('accent') : profile.accent;
      this.showQuote = profile.quote;
      this.endpoint = this.getAttribute('endpoint') || DEFAULT_ENDPOINT;
      this.root = this.attachShadow({ mode: 'open' });
      this.build();
      this.syncTheme();
      this.mountMsbot();
      this.wireMsbot();
      new MutationObserver(() => this.syncTheme()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      if (window.matchMedia) {
        const query = window.matchMedia('(prefers-color-scheme: dark)');
        if (query.addEventListener) query.addEventListener('change', () => this.syncTheme());
      }
      if (document.querySelector('.whatsapp-float')) this.style.setProperty('--msec-assistant-bottom', '5.25rem');
    }

    syncTheme() {
      const theme = document.documentElement.getAttribute('data-theme');
      let dark = theme === 'dark' || theme === 'high-contrast';
      if (!theme && window.matchMedia) dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setAttribute('data-theme', dark ? 'dark' : 'light');
      const vars = themeVars(this.accentValue, dark);
      this.style.setProperty('--a-accent', vars.accent);
      this.style.setProperty('--a-accent-contrast', vars.contrast);
      this.style.setProperty('--a-user', vars.accent);
      this.style.setProperty('--a-user-text', vars.contrast);
      if (window.MSBot && this.lastDark !== dark) {
        const first = this.lastDark === undefined;
        this.lastDark = dark;
        if (!first) window.MSBot.emit(dark ? 'env.theme.dark' : 'env.theme.light', { force: true });
      }
    }

    // MSBot remplace l'icône du lanceur (PROMPT-6, M0-M5). Le module reste facultatif :
    // sans lui, le widget fonctionne comme avant (repli).
    mountMsbot() {
      const api = window.MSBot;
      if (!api || !this.botStage) return;
      const name = (this.getAttribute('bot-name') || 'MSBot').slice(0, 16);
      if (api.setPalette && (this.getAttribute('msbot-dark') || this.getAttribute('msbot-accent') || this.getAttribute('msbot-eye') || this.getAttribute('msbot-emblem'))) {
        api.setPalette({
          dark: this.getAttribute('msbot-dark') || undefined,
          accent: this.getAttribute('msbot-accent') || undefined,
          eye: this.getAttribute('msbot-eye') || undefined,
          emblem: this.getAttribute('msbot-emblem') || undefined,
        });
      }
      const mode = this.getAttribute('msbot-render') || 'auto';
      this.bot = api.mount(this.botStage, { theme: this.app, name, range: 300, render: mode });
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) api.emit('env.mobile', { force: true });
    }

    // « Rappeler MSBot » : après une longue inactivité, le lanceur s'efface et un onglet discret le rappelle.
    armIdle() {
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        if (!this.panel.hidden || !window.MSBot) return;
        window.MSBot.emit('idle.invite', { force: true });
        this.idleTimer = setTimeout(() => {
          if (!this.panel.hidden) return;
          this.launcher.classList.add('away');
          this.recall.hidden = false;
        }, 30000);
      }, 45000);
    }

    showDock() {
      clearTimeout(this.idleTimer);
      this.launcher.classList.remove('away');
      this.recall.hidden = true;
      this.armIdle();
      if (window.MSBot) window.MSBot.emit('idle.wake', { force: true });
    }

    /** Branche les comportements détectés automatiquement (aucun contenu de champ n'est lu ni envoyé). */
    wireMsbot() {
      const api = window.MSBot;
      if (!api) return;
      this.errorCount = 0;
      this.lastError = { el: null, at: 0 };
      let hoverTimer = 0;

      this.launcher.addEventListener('pointerenter', () => {
        api.emit('pointer.hover');
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => api.emit('pointer.hover.long'), 3000);
      });
      this.launcher.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
      this.launcher.addEventListener('click', () => api.emit('pointer.click'));

      const fieldType = (node) => {
        if (!node || !node.matches) return '';
        const tag = node.tagName.toLowerCase();
        if (tag === 'textarea') return 'textarea';
        if (tag === 'select') return 'select';
        const type = (node.getAttribute('type') || 'text').toLowerCase();
        return ['email', 'tel', 'url', 'number', 'date', 'checkbox', 'file', 'password'].includes(type) ? type : 'text';
      };
      const countError = (el) => {
        const at = Date.now();
        if (this.lastError.el === el && at - this.lastError.at < 1500) return;
        this.lastError = { el, at };
        this.errorCount += 1;
        const type = fieldType(el);
        if (type) api.emit('field.' + type + '.format', { el, force: true });
        if (this.errorCount >= 3) {
          this.errorCount = 0;
          api.emit('moment.form.errors3', { el, force: true });
          this.flyTo(el);
        }
      };
      document.addEventListener('invalid', (event) => {
        const el = event.target;
        if (el && el.matches && el.matches('input,textarea,select')) countError(el);
      }, true);
      document.addEventListener('blur', (event) => {
        const el = event.target;
        if (!el || !el.matches || !el.matches('input,textarea,select')) return;
        if (el.hasAttribute('required') && !el.checkValidity()) countError(el);
      }, true);
      document.addEventListener('focusin', (event) => {
        const el = event.target;
        const type = fieldType(el);
        if (type) api.emit('field.' + type + '.focus');
      });

      document.addEventListener('click', (event) => {
        const node = event.target && event.target.closest ? event.target : null;
        const el = node && node.closest('a[href^="tel:"],a[href^="mailto:"],a[href*="linkedin.com"],a[href*="wa.me"],a[href*="whatsapp"],[data-msbot]');
        if (!el) return;
        const href = el.getAttribute('href') || '';
        const key = el.getAttribute('data-msbot') || (href.indexOf('tel:') === 0 ? 'call' : href.indexOf('mailto:') === 0 ? 'mail' : href.indexOf('linkedin.com') > -1 ? 'linkedin' : 'whatsapp');
        const map = {
          quote: 'intent.quote', services: 'intent.services', blog: 'nav.blog', call: 'contact.call',
          mail: 'contact.mail', linkedin: 'contact.linkedin', whatsapp: 'contact.whatsapp',
        };
        if (map[key]) api.emit(map[key], { force: true });
      }, true);
      if (window.IntersectionObserver) {
        const sectionMap = { contact: 'nav.section.formulaire', products: 'nav.section.boutique', services: 'nav.section.bibliotheque', projets: 'nav.section.bibliotheque', realisations: 'nav.section.bibliotheque' };
        const seen = {};
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const name = entry.target.getAttribute('data-msbot-section') || entry.target.id;
            if (!entry.isIntersecting || seen[name] || !sectionMap[name]) return;
            seen[name] = true;
            api.emit(sectionMap[name]);
          });
        }, { threshold: 0.45 });
        document.querySelectorAll('[data-msbot-section],main section[id]').forEach((node) => io.observe(node));
      }
      document.addEventListener('pointerenter', (event) => {
        const el = event.target;
        if (!el || !el.getAttribute) return;
        const tip = el.getAttribute('data-msbot-tip');
        if (tip && api.say) api.say(tip, 3000);
      }, true);
      document.addEventListener('copy', () => api.emit('pointer.copy'));
      document.addEventListener('paste', () => api.emit('pointer.paste'));
      document.addEventListener('keydown', (event) => {
        if (event.altKey && !event.ctrlKey && !event.metaKey && String(event.key).toLowerCase() === 'm') {
          event.preventDefault();
          this.setOpen(this.panel.hidden);
        }
      });
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) api.emit('env.reducedmotion', { force: true });
    }

    /** Trois erreurs de saisie : MSBot vole vers le champ fautif puis revient. */
    flyTo(el) {
      if (!el || !el.getBoundingClientRect || !window.matchMedia) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const target = el.getBoundingClientRect();
      const self = this.getBoundingClientRect();
      const dx = Math.round(target.left - self.left - 8);
      const dy = Math.round(target.top - self.top - 8);
      this.style.transition = 'transform .65s cubic-bezier(.45,0,.2,1)';
      this.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      clearTimeout(this.flyTimer);
      this.flyTimer = setTimeout(() => { this.style.transform = ''; }, 5200);
    }

    build() {
      const t = this.t;
      const style = el('style');
      style.textContent = STYLE;

      this.launcher = el('button', { class: 'launcher', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'panel', 'aria-label': t.open, id: 'launcher' });
      const botName = (this.getAttribute('bot-name') || 'MSBot').slice(0, 16);
      this.botStage = el('span', { class: 'msbot-stage', id: 'msbot' });
      this.launcher.append(this.botStage, el('span', { class: 'msbot-label', text: botName }));
      this.launcher.addEventListener('click', () => this.toggle());

      this.closeBtn = el('button', { class: 'icon-btn', type: 'button', 'aria-label': t.close, id: 'close', text: '×' });
      this.closeBtn.addEventListener('click', () => this.setOpen(false));

      const headerItems = [];
      const logoUrl = this.getAttribute('logo');
      if (logoUrl && /^https:\/\//.test(logoUrl)) headerItems.push(el('img', { class: 'logo', src: logoUrl, alt: '', width: '32', height: '32' }));
      headerItems.push(el('div', {}, [el('h2', { text: t.title, id: 'title' }), el('p', { text: t.subtitle })]), this.closeBtn);
      const header = el('header', {}, headerItems);

      this.log = el('div', { class: 'log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions', id: 'log' });
      this.addMessage('assistant', t.welcome);
      this.chips = el('div', { class: 'chips', id: 'chips' });
      for (const text of t.suggestions) {
        const chip = el('button', { class: 'chip', type: 'button', text });
        chip.addEventListener('click', () => this.send(text));
        this.chips.append(chip);
      }
      this.log.append(this.chips);

      this.input = el('textarea', { rows: '1', maxlength: String(MAX_CHARS), placeholder: t.placeholder, 'aria-label': t.placeholder, id: 'input' });
      this.input.addEventListener('input', () => {
        if (window.MSBot && this.input.value.trim()) window.MSBot.emit('chat.coding');
      });
      this.input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.send(this.input.value);
        }
      });
      this.sendBtn = el('button', { class: 'primary', type: 'button', text: t.send, id: 'send' });
      this.sendBtn.addEventListener('click', () => this.send(this.input.value));
      this.quoteBtn = el('button', { class: 'link-btn', type: 'button', text: t.quote, id: 'quote' });
      this.quoteBtn.addEventListener('click', () => this.showLead(true));
      this.actions = el('div', { class: 'actions', id: 'actions' });
      if (this.showQuote) this.actions.append(this.quoteBtn);
      this.footer = el('footer', {}, [el('div', { class: 'row' }, [this.input, this.sendBtn]), this.actions]);
      this.refreshOrderAction();

      this.leadForm = this.buildLeadForm();
      this.leadForm.hidden = true;

      this.panel = el('section', { class: 'panel', id: 'panel', role: 'dialog', 'aria-labelledby': 'title', 'aria-modal': 'false' }, [header, this.log, this.footer, this.leadForm]);
      this.panel.hidden = true;
      this.panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          this.setOpen(false);
        }
      });

      this.recall = el('button', { class: 'recall', type: 'button', text: t.recall, id: 'recall' });
      this.recall.hidden = true;
      this.recall.addEventListener('click', () => this.showDock());
      this.root.append(style, this.panel, this.launcher, this.recall);
      this.armIdle();
    }

    buildLeadForm() {
      const t = this.t;
      const field = (id, label, node) => el('label', { for: id }, [el('span', { text: label }), node]);
      this.leadName = el('input', { id: 'lead-name', type: 'text', autocomplete: 'name', maxlength: '120', required: '' });
      this.leadContact = el('input', { id: 'lead-contact', type: 'text', autocomplete: 'email', maxlength: '254', required: '' });
      this.leadNeed = el('textarea', { id: 'lead-need', maxlength: String(MAX_CHARS), required: '' });
      this.leadStatus = el('div', { class: 'status', role: 'status', 'aria-live': 'polite', id: 'lead-status' });
      this.leadSubmit = el('button', { class: 'primary', type: 'submit', id: 'lead-submit', text: t.submit });
      const back = el('button', { class: 'link-btn', type: 'button', id: 'lead-cancel', text: t.cancel });
      back.addEventListener('click', () => this.showLead(false));

      const form = el('form', { class: 'lead', id: 'lead', novalidate: '' }, [
        el('h3', { text: t.quoteTitle }),
        el('p', { text: t.quoteIntro }),
        field('lead-name', t.name, this.leadName),
        field('lead-contact', t.contact, this.leadContact),
        field('lead-need', t.need, this.leadNeed),
        this.leadStatus,
        this.leadSubmit,
        back,
      ]);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.submitLead();
      });
      return form;
    }

    // Bouton fourni par l'application hôte (ex. « Commander sur WhatsApp » de Malaika) : lien généré au clic.
    refreshOrderAction() {
      if (!this.actions) return;
      const old = this.actions.querySelector('a.order');
      if (old) old.remove();
      const action = this._orderAction;
      if (!action || typeof action.href !== 'function') return;
      const link = el('a', { class: 'order', id: 'order-action', target: '_blank', rel: 'noopener noreferrer', href: '#', text: (action.label && action.label[this.lang]) || '' });
      link.addEventListener('click', () => {
        let url = '';
        try { url = String(action.href() || ''); } catch (e) { url = ''; }
        if (/^https:\/\//.test(url)) link.href = url;
        else link.removeAttribute('href');
      });
      this.actions.prepend(link);
    }

    set orderAction(value) { this._orderAction = value; this.refreshOrderAction(); }
    get orderAction() { return this._orderAction; }

    // Réponse hors ligne : FAQ intégrée de l'application hôte (sans IA), sinon message clair.
    faqAnswer(text) {
      const fold = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const words = fold(text);
      let best = null;
      let bestScore = 0;
      for (const entry of this.faq || []) {
        let score = 0;
        for (const keyword of entry.keywords || []) {
          const k = fold(keyword);
          if (k && words.indexOf(k) !== -1) score += 1;
        }
        if (score > bestScore) { best = entry; bestScore = score; }
      }
      const answer = best && best.answer && best.answer[this.lang];
      return answer ? OFFLINE_TEXT[this.lang] + '\n\n' + answer : OFFLINE_NO_MATCH[this.lang];
    }

    toggle() {
      this.setOpen(this.panel.hidden);
    }

    setOpen(open) {
      this.panel.hidden = !open;
      this.launcher.setAttribute('aria-expanded', String(open));
      if (window.MSBot) window.MSBot.emit(open ? (this.openedOnce ? 'chat.reopen' : 'chat.open') : 'chat.close', { force: true });
      if (open) this.openedOnce = true;
      if (open) {
        (this.leadForm.hidden ? this.input : this.leadName).focus();
      } else {
        this.launcher.focus();
      }
    }

    showLead(show) {
      this.leadForm.hidden = !show;
      this.log.hidden = show;
      this.footer.hidden = show;
      (show ? this.leadName : this.input).focus();
    }

    addMessage(role, text, isError = false) {
      const bubble = el('div', { class: `msg ${role}${isError ? ' error' : ''}` });
      bubble.append(el('span', { class: 'who', text: role === 'user' ? this.t.you : this.t.assistant }));
      appendRich(bubble, text);
      if (this.chips && this.chips.parentNode === this.log) this.log.insertBefore(bubble, this.chips);
      else this.log.append(bubble);
      this.log.scrollTop = this.log.scrollHeight;
      return bubble;
    }

    setThinking(on) {
      if (on) {
        this.thinkingNode = el('div', { class: 'thinking', id: 'thinking' }, [
          el('span', { class: 'dots', 'aria-hidden': 'true' }, [el('i'), el('i'), el('i')]),
          el('span', { text: this.t.thinking }),
        ]);
        this.log.append(this.thinkingNode);
        this.log.scrollTop = this.log.scrollHeight;
      } else if (this.thinkingNode) {
        this.thinkingNode.remove();
        this.thinkingNode = null;
      }
    }

    async post(payload) {
      const controller = typeof AbortController === 'function' ? new AbortController() : null;
      const timer = setTimeout(() => { if (controller) controller.abort(); }, REQUEST_TIMEOUT_MS);
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (typeof this.tokenProvider === 'function') {
          let token = null;
          try {
            token = await this.tokenProvider();
          } catch (e) {
            token = null;
          }
          if (token) headers['X-Assistant-Token'] = String(token);
        }
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller ? controller.signal : undefined,
        });
        let data = null;
        try {
          data = await response.json();
        } catch (e) {
          data = null;
        }
        return { ok: response.ok, status: response.status, data };
      } finally {
        clearTimeout(timer);
      }
    }

    async send(raw) {
      const text = String(raw || '').trim();
      if (!text || this.busy) return;
      if (this.chips) {
        this.chips.remove();
        this.chips = null;
      }
      this.busy = true;
      this.sendBtn.disabled = true;
      this.input.value = '';
      this.addMessage('user', text);
      if (window.MSBot) window.MSBot.emit('chat.send', { force: true });
      this.history.push({ role: 'user', content: text.slice(0, MAX_CHARS) });
      this.history = this.history.slice(-MAX_HISTORY);
      this.setThinking(true);
      if (this.faq && typeof navigator !== 'undefined' && navigator.onLine === false) {
        this.setThinking(false);
        this.addMessage('assistant', this.faqAnswer(text));
        this.history.pop();
        this.busy = false;
        this.sendBtn.disabled = false;
        this.input.focus();
        return;
      }
      try {
        const result = await this.post({ app: this.app, lang: this.lang, messages: this.history });
        this.setThinking(false);
        if (result.ok && result.data && typeof result.data.reply === 'string') {
          if (window.MSBot) window.MSBot.emit('chat.answer', { force: true });
          this.addMessage('assistant', result.data.reply);
          this.history.push({ role: 'assistant', content: result.data.reply.slice(0, MAX_CHARS) });
          this.history = this.history.slice(-MAX_HISTORY);
        } else {
          if (window.MSBot) window.MSBot.emit(result.status === 429 ? 'chat.ratelimit' : 'chat.provider.error', { force: true });
          const message = result.data && typeof result.data.message === 'string' ? result.data.message : this.t.networkError;
          this.addMessage('assistant', message, true);
          this.history.pop();
        }
      } catch (e) {
        this.setThinking(false);
        if (window.MSBot) window.MSBot.emit('chat.provider.error', { force: true });
        // Réseau coupé en cours de route : FAQ intégrée si l'application en fournit une.
        this.addMessage('assistant', this.faq ? this.faqAnswer(text) : this.t.networkError, !this.faq);
        this.history.pop();
      } finally {
        this.busy = false;
        this.sendBtn.disabled = false;
        this.input.focus();
      }
    }

    setLeadStatus(text, kind) {
      this.leadStatus.textContent = text;
      this.leadStatus.className = `status ${kind || ''}`;
    }

    async submitLead() {
      const name = this.leadName.value.trim();
      const contact = this.leadContact.value.trim();
      const need = this.leadNeed.value.trim();
      if (!name || !contact || !need) {
        this.setLeadStatus(this.t.fieldsRequired, 'error');
        return;
      }
      this.leadSubmit.disabled = true;
      this.setLeadStatus(this.t.sending, '');
      try {
        const result = await this.post({ action: 'lead', app: this.app, lang: this.lang, lead: { name, contact, need, page: location.href } });
        // « Enregistré » uniquement si le serveur le confirme explicitement.
        if (result.ok && result.data && result.data.ok === true) {
          this.setLeadStatus(this.t.leadOk, 'ok');
          this.leadName.value = '';
          this.leadContact.value = '';
          this.leadNeed.value = '';
        } else {
          const message = result.data && typeof result.data.message === 'string' ? result.data.message : this.t.leadError;
          this.setLeadStatus(message, 'error');
        }
      } catch (e) {
        this.setLeadStatus(this.t.leadError, 'error');
      } finally {
        this.leadSubmit.disabled = false;
      }
    }
  }

  customElements.define('msec-assistant', MsecAssistant);
})();
