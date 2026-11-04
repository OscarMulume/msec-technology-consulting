import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'supabase', 'functions', 'assistant');
const PORTFOLIO_PROFILE = process.env.PORTFOLIO_PROFILE
  ? path.resolve(process.env.PORTFOLIO_PROFILE)
  : path.resolve(ROOT, '..', 'OscarMulume.github.io', 'src', 'data', 'profile.json');

const SOURCES = {
  fr: 'src/i18n/fr.json',
  en: 'src/i18n/en.json',
  servicesFr: 'src/content/services.fr.json',
  servicesEn: 'src/content/services.en.json',
  profile: 'portfolio/src/data/profile.json',
};

function fail(message) {
  throw new Error(message);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(`${label} : attendu « ${expected} », trouvé « ${actual} »`);
  }
}

function assertIncludes(value, expected, label) {
  if (!String(value).includes(expected)) {
    fail(`${label} : « ${expected} » introuvable dans « ${value} »`);
  }
}

function assertNonEmpty(value, label) {
  if (!value || String(value).trim() === '') fail(`${label} est vide`);
}

async function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  return JSON.parse(await readFile(fullPath, 'utf8'));
}

async function readPortfolioProfile() {
  try {
    return JSON.parse(await readFile(PORTFOLIO_PROFILE, 'utf8'));
  } catch (error) {
    fail(
      `Profil du portfolio introuvable ou illisible : ${PORTFOLIO_PROFILE}. ` +
        'Définir PORTFOLIO_PROFILE vers OscarMulume.github.io/src/data/profile.json.',
    );
    throw error;
  }
}

function formatDate(dateTime, locale) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateTime}T00:00:00Z`));
}

function bullets(items, indent = '') {
  return items.map((item) => `${indent}- ${item}`).join('\n');
}

function renderService(service, lang) {
  const labels = lang === 'fr'
    ? { services: 'Prestations', benefit: 'Bénéfice', technologies: 'Technologies' }
    : { services: 'What we deliver', benefit: 'Benefit', technologies: 'Technologies' };

  return [
    `### ${service.title}`,
    '',
    service.summary,
    '',
    `**${labels.services} :**`,
    '',
    bullets(service.features.map((feature) => `**${feature.title}** : ${feature.description}`)),
    '',
    `**${labels.benefit} :** ${service.benefit}`,
    '',
    `**${labels.technologies} :** ${service.standards.join(', ')}`,
  ].join('\n');
}

function projectLink(project) {
  if (project.href) return ` — ${project.href}`;
  if (Array.isArray(project.links) && project.links.length > 0) {
    return ` — ${project.links.map((link) => link.href ?? link).join(' ; ')}`;
  }
  return '';
}

function renderCaseStudy(item, lang) {
  const prefix = lang === 'fr' ? 'Exemple de mission' : 'Example mission';
  const lines = [`### ${prefix} : ${item.title}`, '', `*${item.tag}*`, ''];
  for (const segment of item.segments) {
    lines.push(`**${segment.label} :** ${segment.text}`, '');
  }
  return lines.join('\n').trimEnd();
}

const EN_PROFILE = {
  role: 'IT infrastructure · Networks · Cybersecurity · Development',
  availability: 'Available — Central Africa',
  description:
    'I design, deploy and secure critical business infrastructure in Central Africa. From fibre optics to offensive cybersecurity and AI integration, I build systems designed to stay available.',
  stats: [
    ['2021', 'In IT since'],
    ['5', 'Entities secured at Malaïka'],
    ['5', 'Verified Cisco badges'],
    ['99.9%', 'SLA maintained'],
  ],
  languages: ['French (native/bilingual)', 'English (professional/technical)', 'Swahili (professional)', 'Lingala (intermediate)'],
  education: [
    'Bachelor’s degree in Networks, Telecommunications & Maintenance — ISIPA, 2025',
    'Higher diploma in Computer Science — ISIG Goma, 2019–2025',
  ],
  experience: [
    {
      title: 'Head of IT, Engineering & Technology (IT Consultant)',
      period: 'February 2026 – present',
      company: 'Malaïka Group — Kinshasa, DR Congo',
      bullets: [
        'Leads IT, cybersecurity and engineering for 5 entities (Malaïka Group, Ranch, Travels, Le Gabriel, Chez Malaïka).',
        'Hardened web platforms after a security incident: vulnerability scans, patches, firewall and antivirus.',
        'Maintained 99.9% availability for Wi-Fi, PMS and access control, 99.5% for POS and 99% for Internet; critical incidents handled in under 2 hours.',
        'Tested disaster recovery and backup plans; delivered monthly reports to management.',
      ],
    },
    {
      title: 'Founder & Principal Consultant',
      period: 'May 2026 – present',
      company: 'M-SEC Technology Consulting — Kinshasa, DR Congo',
      bullets: [
        'Vulnerability assessments, system hardening and security consulting.',
        'Custom web and mobile applications (Flutter/Dart, Supabase) with mobile money payments.',
      ],
    },
  ],
  previousRoles:
    'ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), and volunteer work with the Red Cross DRC (2022–2024).',
  projects: [
    {
      title: 'POS Pro',
      tag: 'M-SEC product',
      status: 'In progress',
      description:
        'Restaurant point-of-sale designed to work offline, with web, desktop and mobile versions. Development is ongoing and it is not yet available online.',
    },
    {
      title: 'Malaika Ranch',
      tag: 'Online shop',
      status: 'Online',
      description: 'Online shop with ordering through WhatsApp.',
      href: 'https://malaika-ranch-web.vercel.app',
    },
    {
      title: 'M-SEC Technology Consulting website',
      tag: 'Company website',
      status: 'Online',
      description: 'M-SEC Technology Consulting website: IT consulting, networks and cybersecurity in Kinshasa.',
      href: 'https://oscarmulume.github.io/msec-technology-consulting/',
    },
    {
      title: 'Mosala',
      tag: 'Open source · local AI',
      status: 'Online',
      description:
        'Open-source CV and conversation assistant for African languages. It works offline with a local model (Ollama).',
      links: [
        'https://github.com/OscarMulume/nonchalant-cv',
        'https://dev.to/oscarmulume/mosala-a-cv-and-conversation-assistant-for-africas-languages-running-on-your-own-computer-2coc',
      ],
    },
    {
      title: 'Cohort & Orion machines',
      tag: 'Pentest · Hack The Box',
      description:
        'Cohort: SSRF, initial access then privilege escalation through a CVE. Orion: CraftCMS web enumeration and local Telnet authentication bypass.',
    },
    {
      title: 'Brutus & Investigate Web Attack Sherlocks',
      tag: 'DFIR · Blue Team',
      description:
        'Reconstructing kill chains from logs: SSH brute force (auth.log, wtmp, MITRE T1136), Nikto scanning, web brute force and command injection.',
    },
    {
      title: 'Raspberry Pi private cloud',
      tag: 'Infrastructure',
      description:
        'Personal storage server on a Raspberry Pi 5 with Nextcloud, securely reachable remotely through Tailscale.',
    },
  ],
  availabilityNote:
    'The 99.9% SLA, 99.5% POS availability and 99% Internet availability are past results at Malaïka Group published on the portfolio. They are not a universal M-SEC guarantee; M-SEC availability targets are set contract by contract.',
  servicesNote:
    'M-SEC combines network engineering, software development and cybersecurity. Its work is based on documented hardening, verifiable choices and clear pricing.',
  pricing:
    'No prices are published. A quote is prepared after scoping the need. The initial mini-audit is free and without commitment; the full report depends on the agreed scope. The POS Pro pilot is offered subject to availability.',
  answers: [
    ['Who is Oscar Mulume?', 'Oscar Mulume Izuba is an IT consultant, network architect and cybersecurity analyst based in Kinshasa, DR Congo. He founded M-SEC Technology Consulting and works as Head of IT, Engineering & Technology at Malaïka Group.'],
    ['What does M-SEC do?', 'M-SEC covers four areas: connectivity and high-availability infrastructure, cybersecurity and video surveillance, IoT/tracking/MDM, and AI innovation with autonomous systems.'],
    ['How much does an audit cost?', 'The initial mini-audit is free and without commitment. The full report and any implementation work are quoted after defining the scope. No price is published.'],
    ['Is POS Pro available?', 'Not yet. POS Pro is in development and offered through a pilot programme for restaurants, subject to availability. It is not available online.'],
    ['Is Oscar Cisco certified?', 'He holds five Cisco Networking Academy badges, verifiable on Credly. These are training badges, not professional certifications, so he should not be described as “Cisco certified”.'],
    ['Where does Oscar work?', 'He is based in Kinshasa and works in Kinshasa, Goma, Bukavu, across Central Africa, and remotely, depending on the assignment.'],
    ['How can I request a quote?', 'Use the contact form on the M-SEC site or email oscarmulume1612@gmail.com. The assistant can also collect a name, an email or WhatsApp number, and the need.'],
    ['Does M-SEC guarantee 99.9% availability?', 'No universal guarantee is published. Availability targets are defined contract by contract. The 99.9% figure is a past result at Malaïka Group, not a blanket M-SEC promise.'],
  ],
};

function buildFr(fr, services, profile) {
  const site = profile.site;
  const hero = profile.hero;
  const contact = profile.sections.contact;
  const cv = profile.sections.cv;
  const credentials = profile.sections.credentials;
  const projects = profile.sections.projects.items;
  const experience = profile.sections.experience.items;
  const languages = profile.sections.skills.groups.find((group) => group.title === 'Langues')?.tags ?? [];

  const email = contact.cards.find((card) => card.label === 'Email')?.value;
  const linkedin = contact.cards.find((card) => card.label === 'LinkedIn')?.href;
  const github = contact.cards.find((card) => card.label === 'GitHub')?.href;
  const zone = contact.zone.lines.map((line) => line.replace(/^[^\p{L}]+/u, '').trim());

  const productLines = fr.home.products.items.map((item, index) => {
    const status = index === 0 ? fr.home.products.statusPilot : fr.home.products.statusSoon;
    return `- **${item.name}** (${item.tag}, ${status}) : ${item.description}`;
  });

  const projectLines = projects.map((project) => {
    const link = projectLink(project);
    const status = project.status ? ` (${project.status})` : '';
    return `- **${project.title}**${status} — ${project.description}${link}`;
  });

  const badgeLines = credentials.items.map((badge) => {
    return `- **${badge.name}** — ${formatDate(badge.dateTime, 'fr-FR')} — ${badge.url}`;
  });
  const otherBadgeLines = credentials.others.map((badge) => {
    return `- **${badge.name}** — ${formatDate(badge.dateTime, 'fr-FR')} — ${credentials.profileUrl}`;
  });

  const currentRoles = experience.filter((item) => item.current);
  const currentRoleLines = currentRoles.flatMap((item) => {
    const header = `- **${item.title}** (${item.period.replace(/^[^\p{L}\p{N}]+/u, '')}) — ${item.company}`;
    const details = item.bullets.map((bullet) => `  - ${bullet}`);
    return [header, ...details];
  });

  const methodLines = fr.home.method.steps.map((step, index) => `${index + 1}. **${step.title}** : ${step.text}`);
  const engagementLines = fr.home.engagements.rows.map((row) => {
    return `- **${row.commitment}** : ${row.target}. ${row.detail}`;
  });

  return `# Connaissances de l'assistant M-SEC — français

> Fichier généré par \`scripts/build-knowledge.mjs\`. Ne pas modifier à la main : lancer \`npm run build:knowledge\`.
> Version des sources : \`${SOURCE_HASH}\`.
> À relire par Oscar avant la mise en production.

## 1. Identité et coordonnées

- **Nom public** : ${site.brand.fullName} (nom légal : ${site.brand.legalName}).
- **Rôle** : ${hero.role}.
- **Entreprise** : ${site.company.name}, aussi appelée **M-SEC** (pour Mulume Security). ${fr.footer.tagline}
- **Site M-SEC** : https://oscarmulume.github.io/msec-technology-consulting/
- **Portfolio** : ${site.url}/
- **E-mail** : ${email}
- **LinkedIn** : ${linkedin}
- **GitHub** : ${github}
- **Basé à** : ${site.location}.
- **Zone d'intervention** : ${zone.join(' ; ')}.
- **Langues** : ${languages.map((language) => language.replace(/^[^\p{L}]+/u, '').trim()).join(', ')}.
- **Disponibilité** : ${hero.availability}.

## 2. M-SEC en bref

- ${fr.home.hero.tagline}
- ${fr.home.hero.manifesto}
- ${fr.home.why.p1}
- ${fr.home.why.p2}
- **Quatre piliers** : connectivité et infrastructure, cybersécurité et vidéosurveillance, IoT/traçage/MDM, innovation IA et systèmes autonomes.
- **Engagements publiés** : réponse à un message sous 24 h ouvrées ; diagnostic d'audit sous 48 h après réception des informations ; intervention prioritaire selon le SLA du contrat.
- **Tarifs** : aucun prix n'est publié. Un devis est établi après cadrage du besoin. Le mini-audit initial est gratuit et sans engagement ; le rapport complet dépend du périmètre convenu. Le programme pilote POS Pro est proposé sous réserve de disponibilité.
- **SLA** : les objectifs de disponibilité sont fixés contrat par contrat. Aucune disponibilité 24/7 n'est promise sans contrat.

## 3. Services M-SEC

${services.map((service) => renderService(service, 'fr')).join('\n\n')}

## 4. Produits M-SEC

${productLines.join('\n')}

- **POS Pro n'est pas encore en ligne.** Le développement est en cours ; le programme pilote s'adresse aux restaurants de Kinshasa, sous réserve de disponibilité et après validation du besoin. Aucun prix n'est publié.
- **Herbo** et **MonImmo** sont en préparation : ne pas les présenter comme lancés ou disponibles.

## 5. Méthode, engagements et exemples de missions

**Méthode en 4 phases :**

${methodLines.join('\n')}

**Engagements contractuels :**

${engagementLines.join('\n')}

**Exemples de missions :** les deux exemples ci-dessous sont présentés comme des exemples de missions. Ne pas affirmer qu'il s'agit de chantiers réalisés pour des clients précis ni citer de client.

${fr.home.cases.items.map((item) => renderCaseStudy(item, 'fr')).join('\n\n')}

## 6. Oscar Mulume : parcours et formation

- ${hero.description}
- **En IT depuis** : ${hero.stats.find((stat) => stat.label === 'En IT depuis')?.value ?? '2021'}.
- **Formation** : ${cv.fields.find((field) => field.label === 'Formation')?.value}.
- **Diplôme** : ${cv.fields.find((field) => field.label === 'Diplôme')?.value}.

**Postes actuels :**

${currentRoleLines.join('\n')}

- **Auparavant** : ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), et bénévolat à la Croix-Rouge RDC (2022–2024).

**Compétences clés :**

- Réseau et sécurité : Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, CCTV IP, Wi-Fi entreprise, durcissement, pare-feu/IDS, DRP/BCP.
- Développement et données : Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, paiements M-Pesa, Orange Money et Flutterwave.
- IA et cloud : AWS Bedrock, machine learning, IA générative, déploiement local d'agents open-source sous Linux.

**Résultats publiés sur le portfolio :**

- Chez Malaïka Group : 5 entités sécurisées, SLA de 99,9 % maintenu pour le Wi-Fi et le PMS, disponibilité POS de 99,5 %, disponibilité Internet de 99 %, incidents critiques traités en moins de 2 h.
- Ces chiffres sont des résultats passés publiés sur le portfolio. Ils ne constituent pas une garantie universelle de M-SEC : les objectifs de disponibilité sont fixés contrat par contrat.

## 7. Projets et pratique

${projectLines.join('\n')}

- **Hack The Box** : pratique régulière en cybersécurité offensive ; le portfolio affiche le niveau 25.

## 8. Badges Cisco Networking Academy

**Important : ce sont des badges de formation, pas des certifications professionnelles. Ne jamais dire qu'Oscar est « certifié Cisco » ni présenter un badge comme une certification.**

Cinq badges Cisco Networking Academy, vérifiables sur Credly :

${badgeLines.join('\n')}
${otherBadgeLines.join('\n')}

- **Profil Credly** : ${credentials.profileUrl}
- **Formation complémentaire** : Grant AI Skills & Compute Africa (juillet 2026, fine-tuning de modèles et agents autonomes) et Data Science Africa Summer School (Université Makerere), selon le site M-SEC. Aucun lien de vérification n'est fourni pour ces deux formations.
- **Diplôme** : Licence en Sciences Informatiques — ISIPA, selon le portfolio. Aucun lien de vérification n'est fourni.

## 9. Ce que l'assistant ne doit jamais affirmer

- Aucun prix, tarif, remise, délai de livraison, nombre de clients, témoignage ou résultat non listé dans ce fichier.
- Aucune certification professionnelle, aucun partenariat officiel, aucune accréditation ISO. Les référentiels NIST, ISO 27001, CIS, OWASP et TIA/EIA-568 sont des standards utilisés, pas des certifications obtenues.
- Aucune garantie de disponibilité 24/7 ou de SLA universel. Le SLA dépend du contrat.
- Ne pas dire qu'un audit complet est gratuit : seul le mini-audit initial est gratuit ; le rapport complet dépend du périmètre.
- Ne pas dire que POS Pro est disponible ou en ligne. Ne pas dire que Herbo ou MonImmo sont lancés.
- Ne pas donner de conseil de sécurité personnalisé comme s'il valait audit. Proposer un audit ou un échange.
- Ne pas demander de mot de passe, clé, secret, donnée bancaire ou information sensible.
- Ne communiquer aucun numéro de téléphone : renvoyer vers le formulaire de contact et l'e-mail.
- Si l'information n'est pas dans ce fichier : répondre « Je n'ai pas cette information » et orienter vers le formulaire ou l'e-mail.

## 10. Réponses canoniques

**Qui est Oscar Mulume ?**  
Oscar Mulume Izuba est consultant IT, architecte réseau et analyste en cybersécurité basé à Kinshasa, en RDC. Il a fondé M-SEC Technology Consulting et occupe le poste de Responsable IT, Ingénierie & Technologies chez Malaïka Group.

**Que fait M-SEC ?**  
M-SEC intervient sur quatre piliers : connectivité et infrastructure haute disponibilité, cybersécurité et vidéosurveillance, IoT/traçage/MDM, et innovation IA avec des systèmes autonomes.

**Combien coûte un audit ?**  
Le mini-audit initial est gratuit et sans engagement. Le rapport complet et les travaux sont chiffrés après définition du périmètre. Aucun prix n'est publié.

**POS Pro est-il disponible ?**  
Pas encore. POS Pro est en développement et proposé via un programme pilote pour les restaurants, sous réserve de disponibilité. Il n'est pas disponible en ligne.

**Oscar est-il certifié Cisco ?**  
Il détient cinq badges Cisco Networking Academy vérifiables sur Credly. Ce sont des badges de formation, pas des certifications professionnelles : il ne faut pas le présenter comme « certifié Cisco ».

**Où intervient Oscar ?**  
Il est basé à Kinshasa et intervient à Kinshasa, Goma, Bukavu, en Afrique centrale et à distance, selon la mission.

**Comment demander un devis ?**  
Utiliser le formulaire de contact du site M-SEC, écrire à ${email}. L'assistant peut aussi recueillir un nom, un e-mail ou un numéro WhatsApp, et le besoin.

**M-SEC garantit-il 99,9 % de disponibilité ?**  
Non, aucune garantie universelle n'est publiée. Les objectifs de disponibilité sont définis contrat par contrat. Le chiffre de 99,9 % est un résultat passé chez Malaïka Group, pas une promesse générale de M-SEC.
`;
}

function buildEn(en, services, profile) {
  const site = profile.site;
  const contact = profile.sections.contact;
  const credentials = profile.sections.credentials;

  const email = contact.cards.find((card) => card.label === 'Email')?.value;
  const linkedin = contact.cards.find((card) => card.label === 'LinkedIn')?.href;
  const github = contact.cards.find((card) => card.label === 'GitHub')?.href;
  const zone = ['Kinshasa, Goma, Bukavu (DR Congo)', 'Central Africa', 'Remote / on-site'];

  const productLines = en.home.products.items.map((item, index) => {
    const status = index === 0 ? en.home.products.statusPilot : en.home.products.statusSoon;
    return `- **${item.name}** (${item.tag}, ${status}): ${item.description}`;
  });

  const badgeLines = credentials.items.map((badge) => {
    return `- **${badge.name}** — ${formatDate(badge.dateTime, 'en-US')} — ${badge.url}`;
  });
  const otherBadgeLines = credentials.others.map((badge) => {
    return `- **${badge.name}** — ${formatDate(badge.dateTime, 'en-US')} — ${credentials.profileUrl}`;
  });

  const projectLines = EN_PROFILE.projects.map((project) => {
    const link = projectLink(project);
    const status = project.status ? ` (${project.status})` : '';
    return `- **${project.title}**${status} — ${project.description}${link}`;
  });

  const currentRoleLines = EN_PROFILE.experience.flatMap((item) => {
    const header = `- **${item.title}** (${item.period}) — ${item.company}`;
    const details = item.bullets.map((bullet) => `  - ${bullet}`);
    return [header, ...details];
  });

  const methodLines = en.home.method.steps.map((step, index) => `${index + 1}. **${step.title}**: ${step.text}`);
  const engagementLines = en.home.engagements.rows.map((row) => {
    return `- **${row.commitment}**: ${row.target}. ${row.detail}`;
  });

  return `# M-SEC assistant knowledge — English

> Generated by \`scripts/build-knowledge.mjs\`. Do not edit by hand: run \`npm run build:knowledge\`.
> Source version: \`${SOURCE_HASH}\`.
> To be reviewed by Oscar before production.

## 1. Identity and contact details

- **Public name**: ${site.brand.fullName} (legal name: ${site.brand.legalName}).
- **Role**: ${EN_PROFILE.role}.
- **Company**: ${site.company.name}, also called **M-SEC** (for Mulume Security). ${en.footer.tagline}
- **M-SEC website**: https://oscarmulume.github.io/msec-technology-consulting/
- **Portfolio**: ${site.url}/
- **Email**: ${email}
- **LinkedIn**: ${linkedin}
- **GitHub**: ${github}
- **Based in**: Kinshasa, DR Congo.
- **Service area**: ${zone.join('; ')}.
- **Languages**: ${EN_PROFILE.languages.join(', ')}.
- **Availability**: ${EN_PROFILE.availability}.

## 2. M-SEC at a glance

- ${en.home.hero.tagline}
- ${en.home.hero.manifesto}
- ${en.home.why.p1}
- ${en.home.why.p2}
- **Four pillars**: connectivity and infrastructure, cybersecurity and video surveillance, IoT/tracking/MDM, and AI innovation with autonomous systems.
- **Published commitments**: reply to a message within 24 business hours; audit diagnosis within 48 hours after receiving the required information; priority response according to the contract SLA.
- **Pricing**: no prices are published. A quote is prepared after scoping the need. The initial mini-audit is free and without commitment; the full report depends on the agreed scope. The POS Pro pilot is offered subject to availability.
- **SLA**: availability targets are set contract by contract. No 24/7 availability is promised without a contract.

## 3. M-SEC services

${services.map((service) => renderService(service, 'en')).join('\n\n')}

## 4. M-SEC products

${productLines.join('\n')}

- **POS Pro is not online yet.** Development is ongoing; the pilot programme is aimed at restaurants in Kinshasa, subject to availability and after validating the need. No price is published.
- **Herbo** and **MonImmo** are in preparation: do not present them as launched or available.

## 5. Method, commitments and example missions

**Four-phase method:**

${methodLines.join('\n')}

**Contractual commitments:**

${engagementLines.join('\n')}

**Example missions:** the two examples below are presented as example missions. Do not claim they are completed projects for specific clients and never name a client.

${en.home.cases.items.map((item) => renderCaseStudy(item, 'en')).join('\n\n')}

## 6. Oscar Mulume: background and education

- ${EN_PROFILE.description}
- **In IT since**: 2021.
- **Education**: ${EN_PROFILE.education[0]}.
- **Diploma**: ${EN_PROFILE.education[1]}.

**Current roles:**

${currentRoleLines.join('\n')}

- **Previously**: ${EN_PROFILE.previousRoles}

**Key skills:**

- Network and security: Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, IP CCTV, enterprise Wi-Fi, hardening, firewall/IDS, DRP/BCP.
- Development and data: Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, M-Pesa, Orange Money and Flutterwave payments.
- AI and cloud: AWS Bedrock, machine learning, generative AI, local deployment of open-source agents on Linux.

**Results published on the portfolio:**

- At Malaïka Group: 5 entities secured, 99.9% SLA maintained for Wi-Fi and PMS, 99.5% POS availability, 99% Internet availability, critical incidents handled in under 2 hours.
- ${EN_PROFILE.availabilityNote}

## 7. Projects and practice

${projectLines.join('\n')}

- **Hack The Box**: regular offensive cybersecurity practice; the portfolio displays level 25.

## 8. Cisco Networking Academy badges

**Important: these are training badges, not professional certifications. Never say Oscar is “Cisco certified” or present a badge as a certification.**

Five Cisco Networking Academy badges, verifiable on Credly:

${badgeLines.join('\n')}
${otherBadgeLines.join('\n')}

- **Credly profile**: ${credentials.profileUrl}
- **Additional training**: Grant AI Skills & Compute Africa (July 2026, fine-tuning language models and autonomous agents) and the Data Science Africa Summer School (Makerere University), according to the M-SEC website. No verification link is provided for these two programmes.
- **Degree**: Bachelor’s degree in Computer Science — ISIPA, according to the portfolio. No verification link is provided.

## 9. What the assistant must never claim

- No price, rate, discount, delivery time, client count, testimonial or result that is not listed in this file.
- No professional certification, official partnership or ISO accreditation. NIST, ISO 27001, CIS, OWASP and TIA/EIA-568 are standards that may be used, not certifications obtained.
- No guarantee of 24/7 availability or a universal SLA. The SLA depends on the contract.
- Do not say a full audit is free: only the initial mini-audit is free; the full report depends on the scope.
- Do not say POS Pro is available or online. Do not say Herbo or MonImmo have launched.
- Do not give personalised security advice as if it were an audit. Offer an audit or a conversation.
- Do not ask for passwords, keys, secrets, banking details or sensitive information.
- Never give out a phone number: point to the contact form and email.
- If the information is not in this file: answer “I don’t have that information” and point to the form or email.

## 10. Canonical answers

${EN_PROFILE.answers.map(([question, answer]) => `**${question}**  \n${answer}`).join('\n\n')}
`;
}

function validate(fr, en, servicesFr, servicesEn, profile) {
  const site = profile.site;
  assertEqual(site.company.url, 'https://oscarmulume.github.io/msec-technology-consulting/', 'URL M-SEC');
  assertEqual(site.url, 'https://oscarmulume.github.io', 'URL portfolio');
  assertEqual(site.brand.fullName, 'Oscar Mulume', 'Nom public');
  assertEqual(site.brand.legalName, 'MULUME IZUBA OSCAR', 'Nom légal');
  assertIncludes(site.location, 'Kinshasa', 'Localisation');
  assertEqual(site.company.name, 'M-SEC Technology Consulting', 'Nom entreprise');

  const contact = profile.sections.contact;
  assertEqual(contact.cards.find((card) => card.label === 'Email')?.value, 'oscarmulume1612@gmail.com', 'E-mail');
  assertEqual(contact.cards.find((card) => card.label === 'Téléphone')?.value, '+243 975 585 150', 'Téléphone');

  const servicesExpected = ['connectivity', 'security', 'iot-tracking', 'ai-automation'];
  assertEqual(Object.keys(servicesFr).join(','), servicesExpected.join(','), 'Clés services FR');
  assertEqual(Object.keys(servicesEn).join(','), servicesExpected.join(','), 'Clés services EN');

  for (const key of servicesExpected) {
    assertNonEmpty(servicesFr[key].summary, `services.fr.${key}.summary`);
    assertNonEmpty(servicesEn[key].summary, `services.en.${key}.summary`);
    assertEqual(servicesFr[key].features.length, 5, `services.fr.${key}.features`);
    assertEqual(servicesEn[key].features.length, 5, `services.en.${key}.features`);
  }

  assertNonEmpty(fr.home.products.items.find((item) => item.name === 'POS Pro')?.description, 'Produit POS Pro');
  assertNonEmpty(en.home.products.items.find((item) => item.name === 'POS Pro')?.description, 'Product POS Pro');
  assertNonEmpty(fr.home.cases.items[0]?.segments?.[0]?.text, 'Étude de cas FR');
  assertNonEmpty(en.home.cases.items[0]?.segments?.[0]?.text, 'Case study EN');

  const projects = profile.sections.projects.items.map((item) => item.title);
  for (const expected of ['POS Pro', 'Malaika Ranch', 'Site M-SEC Technology Consulting', 'Mosala', 'Machines Cohort & Orion']) {
    if (!projects.includes(expected)) fail(`Projet manquant : ${expected}`);
  }

  const credentials = profile.sections.credentials;
  assertEqual(credentials.items.length, 2, 'Badges directs');
  assertEqual(credentials.others.length, 3, 'Autres badges');
  assertIncludes(credentials.items[0].url, 'credly.com/badges/', 'Lien Ethical Hacker');
  assertIncludes(credentials.items[1].url, 'credly.com/badges/', 'Lien Junior Cybersecurity Analyst');
  assertEqual(credentials.profileUrl, 'https://www.credly.com/users/oscar-mulume', 'Profil Credly');

  const cvFields = profile.sections.cv.fields;
  assertIncludes(cvFields.find((field) => field.label === 'Formation')?.value, 'ISIPA', 'Formation ISIPA');
  assertIncludes(cvFields.find((field) => field.label === 'Diplôme')?.value, 'ISIG Goma', 'Diplôme ISIG');
}

const [fr, en, servicesFr, servicesEn, profile] = await Promise.all([
  readJson(SOURCES.fr),
  readJson(SOURCES.en),
  readJson(SOURCES.servicesFr),
  readJson(SOURCES.servicesEn),
  readPortfolioProfile(),
]);

validate(fr, en, servicesFr, servicesEn, profile);

const sourceHash = createHash('sha256')
  .update(JSON.stringify({ fr, en, servicesFr, servicesEn, profile }))
  .digest('hex')
  .slice(0, 12);
const SOURCE_HASH = sourceHash;

function applyDecisions(text, lang) {
  let result = text;
  if (lang === 'fr') {
    result = result.replace('après une cyberattaque majeure', 'après un incident de sécurité');
  }
  for (const forbidden of ['cyberattaque majeure', 'major cyberattack', '975 585 150', '+243']) {
    if (result.includes(forbidden)) fail(`Formulation interdite dans les connaissances (${lang}) : ${forbidden}`);
  }
  return result;
}

const knowledgeFr = applyDecisions(buildFr(fr, Object.values(servicesFr), profile), 'fr');
const knowledgeEn = applyDecisions(buildEn(en, Object.values(servicesEn), profile), 'en');

const clean = (text) => text.replace(/\r\n/g, '\n').replace(/\bM-Sec\b/g, 'M-SEC');

const outputs = {
  'knowledge.fr.md': knowledgeFr,
  'knowledge.en.md': knowledgeEn,
  'knowledge.generated.ts': [
    '// Fichier généré par scripts/build-knowledge.mjs. Ne pas modifier à la main.',
    '// Les connaissances sont embarquées dans le code de la fonction (import statique).',
    `export const KNOWLEDGE: { fr: string; en: string } = ${JSON.stringify({ fr: clean(knowledgeFr), en: clean(knowledgeEn) }, null, 2)};`,
    '',
  ].join('\n'),
};

const checkOnly = process.argv.includes('--check');
let changes = 0;

for (const [filename, content] of Object.entries(outputs)) {
  const target = path.join(OUT_DIR, filename);
  const normalized = clean(content);
  if (checkOnly) {
    let current = '';
    try {
      current = await readFile(target, 'utf8');
    } catch {
      fail(`${filename} est absent. Lancer npm run build:knowledge.`);
    }
    if (current.replace(/\r\n/g, '\n') !== normalized) {
      fail(`${filename} n'est pas à jour. Lancer npm run build:knowledge.`);
    }
  } else {
    await writeFile(target, normalized, 'utf8');
    changes += 1;
    console.log(`écrit ${path.relative(ROOT, target)} (${Buffer.byteLength(normalized, 'utf8')} octets)`);
  }
}

if (checkOnly) console.log(`connaissances à jour (${Object.keys(outputs).length} fichiers, sources ${SOURCE_HASH})`);
else console.log(`${changes} fichiers générés depuis les sources ${SOURCE_HASH}`);
