// Preuve en ligne MSBot : HTTP 200, script charge, aucune erreur console, captures par appareil avec une vraie reponse.
// Usage : node scripts/capture-msbot.mjs   (sites publics, aucune cle, aucun champ rempli sauf la question posee)
import { chromium, devices } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const SITES = [
  { id: 'msec', url: 'https://oscarmulume.github.io/msec-technology-consulting/', question: 'Quels services propose M-SEC ?' },
  { id: 'portfolio', url: 'https://oscarmulume.github.io/', question: 'Quels sont les principaux projets d\'Oscar ?' },
];
const APPAREILS = [
  { id: 'ordinateur', opts: { viewport: { width: 1280, height: 800 } } },
  { id: 'iphone13', opts: devices['iPhone 13'] },
  { id: 'pixel5', opts: devices['Pixel 5'] },
];
const OUT = 'docs/captures';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const resultats = [];
for (const site of SITES) {
  for (const app of APPAREILS) {
    const ctx = await browser.newContext({ ...app.opts, locale: 'fr-FR' });
    const page = await ctx.newPage();
    const erreurs = []; let script = false;
    page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => erreurs.push('pageerror: ' + String(e.message).slice(0, 160)));
    page.on('response', (r) => { if (/msec-assistant\.js/.test(r.url()) && r.status() === 200) script = true; });
    const rep = await page.goto(site.url, { waitUntil: 'networkidle' });
    const ligne = { site: site.id, appareil: app.id, http: rep.status(), script: false, erreurs, reponse: '' };
    try {
      await page.locator('#launcher').waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${OUT}/${site.id}-${app.id}-1-arrivee.png` });
      await page.locator('#launcher').click({ force: true });
      await page.locator('#input').fill(site.question);
      await page.locator('#send').click();
      const reponses = page.locator('.msg.assistant');
      await page.waitForFunction(() => {
        const host = document.querySelector('msec-assistant');
        const n = host && host.shadowRoot ? host.shadowRoot.querySelectorAll('.msg.assistant').length : 0;
        return n >= 2 && !host.shadowRoot.querySelector('#thinking');
      }, null, { timeout: 60000 });
      ligne.reponse = (await reponses.last().innerText()).replace(/\s+/g, ' ').slice(0, 220);
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/${site.id}-${app.id}-2-reponse.png` });
    } catch (e) { ligne.erreurs.push('capture: ' + String(e.message).split('\n')[0]); }
    ligne.script = script;
    resultats.push(ligne);
    console.log(JSON.stringify(ligne));
    await ctx.close();
  }
}
await browser.close();
writeFileSync(`${OUT}/resultats.json`, JSON.stringify(resultats, null, 1));
process.exit(resultats.every((r) => r.http === 200 && r.script && r.erreurs.length === 0 && r.reponse) ? 0 : 1);
