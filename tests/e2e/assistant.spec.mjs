import { expect, test } from '@playwright/test';

// La fonction Supabase est simulée : aucun appel réseau réel, aucune clé.
const ENDPOINT = '**/functions/v1/assistant';

const json = (body, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(body) });

async function openAssistant(page, path = '') {
  await page.goto(path);
  await page.locator('#launcher').click();
  await expect(page.locator('#panel')).toBeVisible();
}

test('l\'assistant s\'ouvre, prend le focus et se ferme avec Échap en rendant le focus au bouton', async ({ page }) => {
  await page.goto('');
  const launcher = page.locator('#launcher');
  await expect(launcher).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#panel')).toBeHidden();

  await launcher.click();
  await expect(launcher).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#panel')).toHaveAttribute('role', 'dialog');
  await expect(page.locator('#input')).toBeFocused();
  await expect(page.locator('.msg.assistant').first()).toContainText('Bonjour');

  await page.keyboard.press('Escape');
  await expect(page.locator('#panel')).toBeHidden();
  await expect(launcher).toBeFocused();
  await expect(launcher).toHaveAttribute('aria-expanded', 'false');
});

test('une question affiche l\'indicateur de réflexion puis la réponse avec des liens sûrs', async ({ page }) => {
  let body = null;
  await page.route(ENDPOINT, async (route) => {
    body = route.request().postDataJSON();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill(json({ reply: 'Voici [le profil Credly](https://www.credly.com/users/oscar-mulume) et https://oscarmulume.github.io/ .', found: true }));
  });

  await openAssistant(page);
  await page.locator('#input').fill('Quels sont les badges d\'Oscar ?');
  await page.locator('#send').click();

  await expect(page.locator('.msg.user')).toContainText('Quels sont les badges');
  await expect(page.locator('#thinking')).toBeVisible();
  await expect(page.locator('#send')).toBeDisabled();

  const reply = page.locator('.msg.assistant').last();
  await expect(reply).toContainText('Voici le profil Credly');
  await expect(page.locator('#thinking')).toHaveCount(0);

  const link = reply.locator('a').first();
  await expect(link).toHaveAttribute('href', 'https://www.credly.com/users/oscar-mulume');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);

  expect(body.lang).toBe('fr');
  expect(body.messages.at(-1)).toEqual({ role: 'user', content: 'Quels sont les badges d\'Oscar ?' });
  expect(JSON.stringify(body)).not.toMatch(/system/);
});

test('une suggestion envoie la question et les suggestions disparaissent', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill(json({ reply: 'POS Pro est en développement.' })));
  await openAssistant(page);
  await page.locator('.chip').first().click();
  await expect(page.locator('.msg.assistant').last()).toContainText('POS Pro');
  await expect(page.locator('#chips')).toHaveCount(0);
});

test('le HTML renvoyé par le serveur n\'est jamais interprété', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill(json({ reply: '<img src=x onerror="window.__pwned=1"><script>window.__pwned=1</script>[x](javascript:alert(1))' })));
  await openAssistant(page);
  await page.locator('#input').fill('test');
  await page.locator('#send').click();

  const reply = page.locator('.msg.assistant').last();
  await expect(reply).toContainText('<img src=x');
  await expect(reply.locator('img, script')).toHaveCount(0);
  await expect(reply.locator('a')).toHaveCount(0);
  expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
});

test('limite atteinte : le message du serveur est affiché, sans fausse réponse', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill(json({ error: 'rate_limited', message: 'Vous avez atteint la limite de 20 messages par heure.' }, 429)));
  await openAssistant(page);
  await page.locator('#input').fill('encore une');
  await page.locator('#send').click();
  await expect(page.locator('.msg.error')).toContainText('20 messages par heure');
  await expect(page.locator('#send')).toBeEnabled();
});

test('serveur injoignable : message d\'indisponibilité avec l\'e-mail', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.abort('failed'));
  await openAssistant(page);
  await page.locator('#input').fill('Bonjour');
  await page.locator('#send').click();
  await expect(page.locator('.msg.error')).toContainText('oscarmulume1612@gmail.com');
});

test('demande de devis : enregistrée seulement si le serveur confirme', async ({ page }) => {
  let body = null;
  await page.route(ENDPOINT, (route) => {
    body = route.request().postDataJSON();
    return route.fulfill(json({ ok: true }));
  });
  await openAssistant(page);
  await page.locator('#quote').click();
  await expect(page.locator('#lead')).toBeVisible();

  await page.locator('#lead-submit').click();
  await expect(page.locator('#lead-status')).toContainText('trois champs');
  expect(body).toBeNull();

  await page.locator('#lead-name').fill('Marie Kabila');
  await page.locator('#lead-contact').fill('marie@example.cd');
  await page.locator('#lead-need').fill('Audit du réseau Wi-Fi');
  await page.locator('#lead-submit').click();

  await expect(page.locator('#lead-status')).toContainText('bien été enregistrée');
  expect(body.action).toBe('lead');
  expect(body.lang).toBe('fr');
  expect(body.lead).toMatchObject({ name: 'Marie Kabila', contact: 'marie@example.cd', need: 'Audit du réseau Wi-Fi' });
  await expect(page.locator('#lead-name')).toHaveValue('');
});

test('demande de devis : en cas d\'échec du serveur, jamais de message de succès', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill(json({ error: 'lead_failed', message: 'Votre demande n\'a PAS pu être enregistrée.' }, 502)));
  await openAssistant(page);
  await page.locator('#quote').click();
  await page.locator('#lead-name').fill('Marie Kabila');
  await page.locator('#lead-contact').fill('marie@example.cd');
  await page.locator('#lead-need').fill('Audit');
  await page.locator('#lead-submit').click();

  const status = page.locator('#lead-status');
  await expect(status).toContainText('PAS pu être enregistrée');
  await expect(status).toHaveClass(/error/);
  await expect(status).not.toContainText('bien été enregistrée');
  await expect(page.locator('#lead-name')).toHaveValue('Marie Kabila');

  await page.route(ENDPOINT, (route) => route.abort('failed'));
  await page.locator('#lead-submit').click();
  await expect(status).toContainText('PAS pu');
  await expect(status).toHaveClass(/error/);
});

test('version anglaise : textes et langue de la requête', async ({ page }) => {
  let body = null;
  await page.route(ENDPOINT, (route) => {
    body = route.request().postDataJSON();
    return route.fulfill(json({ reply: 'Oscar is an IT consultant based in Kinshasa.' }));
  });
  await openAssistant(page, 'en/');
  await expect(page.locator('#title')).toHaveText('M-SEC assistant');
  await expect(page.locator('#launcher')).toHaveAttribute('aria-label', 'Open the M-SEC assistant');
  await expect(page.locator('#quote')).toHaveText('Request a quote');

  await page.locator('#input').fill('Who is Oscar?');
  await page.locator('#send').click();
  await expect(page.locator('.msg.assistant').last()).toContainText('IT consultant');
  expect(body.lang).toBe('en');
});

test('mobile : le panneau tient dans l\'écran et les cibles font au moins 44 px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 740 });
  await openAssistant(page);

  const panel = await page.locator('#panel').boundingBox();
  expect(panel.x).toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(390);
  expect(panel.y).toBeGreaterThanOrEqual(0);
  expect(panel.y + panel.height).toBeLessThanOrEqual(740);

  for (const selector of ['#launcher', '#close', '#send', '#quote', '.chip']) {
    const box = await page.locator(selector).first().boundingBox();
    expect(box.height, selector).toBeGreaterThanOrEqual(44);
    expect(box.width, selector).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('le mode sombre du site est suivi par le composant', async ({ page }) => {
  await page.goto('');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await expect(page.locator('msec-assistant')).toHaveAttribute('data-theme', 'dark');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await expect(page.locator('msec-assistant')).toHaveAttribute('data-theme', 'light');
});

// --- P2 : widget unique et thémable ------------------------------------------------------------

async function addWidget(page, attributes) {
  await page.goto('');
  await page.evaluate((attrs) => {
    const node = document.createElement('msec-assistant');
    node.id = 'test-widget';
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    document.body.append(node);
  }, attributes);
}

test('app="malaika" : thème, accueil, suggestions propres, pas de bouton devis, app envoyée au serveur', async ({ page }) => {
  let body = null;
  await page.route(ENDPOINT, (route) => { body = route.request().postDataJSON(); return route.fulfill(json({ reply: 'Voir la boutique.' })); });
  await addWidget(page, { app: 'malaika', lang: 'fr' });
  const widget = page.locator('#test-widget');
  await widget.locator('#launcher').click();
  await expect(widget.locator('#title')).toHaveText('Conseiller Malaika Ranch');
  await expect(widget.locator('.msg.assistant').first()).toContainText('Malaika Ranch');
  await expect(widget.locator('#quote')).toHaveCount(0);
  await expect(widget.locator('.chip').first()).toHaveText('Quels produits sont disponibles ?');
  await widget.locator('.chip').first().click();
  await expect(widget.locator('.msg.assistant').last()).toContainText('boutique');
  expect(body.app).toBe('malaika');
});

test('accent personnalisé : le contraste du bouton reste au moins AA (4,5:1), en clair comme en sombre', async ({ page }) => {
  await addWidget(page, { app: 'msec', accent: '#ffe066' }); // jaune très clair : doit être assombri
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.evaluate((theme) => document.documentElement.setAttribute('data-theme', theme), scheme);
    const ratio = await page.evaluate(() => {
      const host = document.getElementById('test-widget');
      const cs = getComputedStyle(host);
      const parse = (v) => { const m = /^#([0-9a-f]{6})$/i.exec(v.trim()); return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)); };
      const lum = (rgb) => { const l = rgb.map((c) => { const x = c / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
      const a = lum(parse(host.style.getPropertyValue('--a-accent')));
      const t = lum(parse(host.style.getPropertyValue('--a-accent-contrast')));
      return (Math.max(a, t) + 0.05) / (Math.min(a, t) + 0.05);
    });
    expect(ratio, scheme).toBeGreaterThanOrEqual(4.5);
  }
});

test('action de commande fournie par l\'application hôte : lien https généré au clic', async ({ page }) => {
  await addWidget(page, { app: 'malaika' });
  await page.evaluate(() => {
    document.getElementById('test-widget').orderAction = { label: { fr: 'Commander sur WhatsApp', en: 'Order on WhatsApp' }, href: () => 'https://wa.me/?text=Bonjour' };
  });
  const widget = page.locator('#test-widget');
  await widget.locator('#launcher').click();
  const order = widget.locator('#order-action');
  await expect(order).toHaveText('Commander sur WhatsApp');
  await order.evaluate((a) => a.addEventListener('click', (e) => e.preventDefault()));
  await order.click();
  await expect(order).toHaveAttribute('href', 'https://wa.me/?text=Bonjour');
});

test('hors ligne avec FAQ intégrée : réponse sans IA et message clair, aucun appel réseau', async ({ page, context }) => {
  let calls = 0;
  await page.route(ENDPOINT, (route) => { calls += 1; return route.fulfill(json({ reply: 'x' })); });
  await addWidget(page, { app: 'pos' });
  await page.evaluate(() => {
    document.getElementById('test-widget').faq = [{ keywords: ['encaisser', 'vente'], answer: { fr: 'Ouvrez Caisse puis Encaisser.', en: 'Open Till then Pay.' } }];
  });
  await context.setOffline(true);
  const widget = page.locator('#test-widget');
  await widget.locator('#launcher').click();
  await widget.locator('#input').fill('Comment encaisser une vente ?');
  await widget.locator('#send').click();
  await expect(widget.locator('.msg.assistant').last()).toContainText('hors ligne');
  await expect(widget.locator('.msg.assistant').last()).toContainText('Ouvrez Caisse puis Encaisser.');
  expect(calls).toBe(0);
});
