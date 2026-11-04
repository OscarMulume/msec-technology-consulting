/*
 * <msec-assistant lang="fr"> : assistant M-SEC (Web Component, sans dépendance).
 * Chargé par le site M-SEC et par le portfolio. Aucune clé ici : le navigateur parle uniquement à la
 * fonction Supabase « assistant », qui garde les secrets côté serveur.
 * Attributs : lang (fr | en), endpoint (URL de la fonction, optionnel).
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

  const STYLE = `
    :host {
      --a-bg: #ffffff; --a-bg-soft: #eef2f5; --a-text: #10161d; --a-muted: #4c5a68;
      --a-border: rgba(16,22,29,.18); --a-accent: #07727f; --a-accent-contrast: #ffffff;
      --a-user: #07727f; --a-user-text: #ffffff; --a-danger: #b42318; --a-ok: #087a55;
      --a-shadow: 0 18px 50px rgba(16,35,45,.22);
      all: initial; position: fixed; z-index: 2147483000;
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
      min-width: 3.25rem; min-height: 3.25rem; padding: 0 1rem; border-radius: 999px; border: 1px solid var(--a-border);
      background: var(--a-accent); color: var(--a-accent-contrast); font-weight: 600; box-shadow: var(--a-shadow);
    }
    .launcher svg { width: 1.4rem; height: 1.4rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .panel {
      position: absolute; right: 0; bottom: 4rem; width: min(24rem, calc(100vw - 2rem));
      height: min(34rem, calc(100dvh - 9rem)); display: flex; flex-direction: column; overflow: hidden;
      background: var(--a-bg); border: 1px solid var(--a-border); border-radius: 1.25rem; box-shadow: var(--a-shadow);
    }
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
      this.t = I18N[this.lang];
      this.endpoint = this.getAttribute('endpoint') || DEFAULT_ENDPOINT;
      this.root = this.attachShadow({ mode: 'open' });
      this.build();
      this.syncTheme();
      new MutationObserver(() => this.syncTheme()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      if (document.querySelector('.whatsapp-float')) this.style.setProperty('--msec-assistant-bottom', '5.25rem');
    }

    syncTheme() {
      const theme = document.documentElement.getAttribute('data-theme');
      this.setAttribute('data-theme', theme === 'dark' || theme === 'high-contrast' ? 'dark' : 'light');
    }

    build() {
      const t = this.t;
      const style = el('style');
      style.textContent = STYLE;

      this.launcher = el('button', { class: 'launcher', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'panel', 'aria-label': t.open, id: 'launcher' });
      this.launcher.innerHTML = BUBBLE_ICON;
      this.launcher.append(el('span', { text: 'Assistant' }));
      this.launcher.addEventListener('click', () => this.toggle());

      this.closeBtn = el('button', { class: 'icon-btn', type: 'button', 'aria-label': t.close, id: 'close', text: '×' });
      this.closeBtn.addEventListener('click', () => this.setOpen(false));

      const header = el('header', {}, [
        el('div', {}, [el('h2', { text: t.title, id: 'title' }), el('p', { text: t.subtitle })]),
        this.closeBtn,
      ]);

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
      this.footer = el('footer', {}, [el('div', { class: 'row' }, [this.input, this.sendBtn]), this.quoteBtn]);

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

      this.root.append(style, this.panel, this.launcher);
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

    toggle() {
      this.setOpen(this.panel.hidden);
    }

    setOpen(open) {
      this.panel.hidden = !open;
      this.launcher.setAttribute('aria-expanded', String(open));
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
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        let data = null;
        try {
          data = await response.json();
        } catch {
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
      this.history.push({ role: 'user', content: text.slice(0, MAX_CHARS) });
      this.history = this.history.slice(-MAX_HISTORY);
      this.setThinking(true);
      try {
        const result = await this.post({ lang: this.lang, messages: this.history });
        this.setThinking(false);
        if (result.ok && result.data && typeof result.data.reply === 'string') {
          this.addMessage('assistant', result.data.reply);
          this.history.push({ role: 'assistant', content: result.data.reply.slice(0, MAX_CHARS) });
          this.history = this.history.slice(-MAX_HISTORY);
        } else {
          const message = result.data && typeof result.data.message === 'string' ? result.data.message : this.t.networkError;
          this.addMessage('assistant', message, true);
          this.history.pop();
        }
      } catch {
        this.setThinking(false);
        this.addMessage('assistant', this.t.networkError, true);
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
        const result = await this.post({ action: 'lead', lang: this.lang, lead: { name, contact, need, page: location.href } });
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
      } catch {
        this.setLeadStatus(this.t.leadError, 'error');
      } finally {
        this.leadSubmit.disabled = false;
      }
    }
  }

  customElements.define('msec-assistant', MsecAssistant);
})();
