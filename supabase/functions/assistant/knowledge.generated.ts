// Fichier généré par scripts/build-knowledge.mjs. Ne pas modifier à la main.
// Les connaissances sont embarquées dans le code de la fonction (import statique).

export interface KnowledgeSection {
  id: string;
  title: string;
  text: string;
  always?: boolean;
  keywords: string[];
}

export const KNOWLEDGE: { fr: string; en: string } = {
  "fr": "# Connaissances de l'assistant M-SEC — français\n\n> Fichier généré par `scripts/build-knowledge.mjs`. Ne pas modifier à la main : lancer `npm run build:knowledge`.\n> Version des sources : `a94da268196b`.\n> À relire par Oscar avant la mise en production.\n\n## 1. Identité et coordonnées\n\n- **Nom public** : Oscar Mulume (nom légal : MULUME IZUBA OSCAR).\n- **Rôle** : Infrastructure IT · Réseaux · Cybersécurité · Développement.\n- **Entreprise** : M-SEC Technology Consulting, aussi appelée **M-SEC** (pour Mulume Security). Cabinet d'ingénierie IT, réseaux et cybersécurité. Infrastructure, connectivité et sécurité au service des entreprises d'Afrique centrale.\n- **Site M-SEC** : https://oscarmulume.github.io/msec-technology-consulting/\n- **Portfolio** : https://oscarmulume.github.io/\n- **E-mail** : oscarmulume1612@gmail.com\n- **LinkedIn** : https://www.linkedin.com/in/oscar-mulume-95666b225/\n- **GitHub** : https://github.com/OscarMulume\n- **Basé à** : Kinshasa, RDC — Afrique Centrale.\n- **Zone d'intervention** : Kinshasa, Goma, Bukavu ; Afrique Centrale ; Remote / Sur site.\n- **Langues** : Français (natif/bilingue), Anglais (pro/technique), Swahili (pro), Lingala (intermédiaire).\n- **Disponibilité** : Disponible — Afrique Centrale.\n\n## 2. M-SEC en bref\n\n- L'infrastructure et la sécurité IT au service de la performance de votre entreprise.\n- Une interruption réseau ou une faille de sécurité peut coûter cher à une entreprise. Nous associons ingénierie réseau, développement et cybersécurité pour construire des environnements plus résilients, documentés et maintenables.\n- Nous appliquons le principe de « sécurité par conception ». Chaque câble posé, chaque antenne configurée et chaque base de données déployée intègre des règles de durcissement documentées, afin de réduire les risques et de faciliter la maintenance.\n- Nos architectures s'appuient sur des standards d'entreprise : Cisco, UniFi, FortiGate. Nous privilégions des choix vérifiables, un chiffrage clair et une documentation remise à chaque étape.\n- **Quatre piliers** : connectivité et infrastructure, cybersécurité et vidéosurveillance, IoT/traçage/MDM, innovation IA et systèmes autonomes.\n- **Engagements publiés** : réponse à un message sous 24 h ouvrées ; diagnostic d'audit sous 48 h après réception des informations ; intervention prioritaire selon le SLA du contrat.\n- **Tarifs** : aucun prix n'est publié. Un devis est établi après cadrage du besoin. Le mini-audit initial est gratuit et sans engagement ; le rapport complet dépend du périmètre convenu. Le programme pilote POS Pro est proposé sous réserve de disponibilité.\n- **SLA** : les objectifs de disponibilité sont fixés contrat par contrat. Aucune disponibilité 24/7 n'est promise sans contrat.\n\n## 3. Services M-SEC\n\n### Connectivité & infrastructure haute disponibilité\n\nLiaisons Starlink, réseaux UniFi, pare-feux FortiGate NGFW et téléphonie Yeastar : une architecture pensée pour réduire les interruptions et faciliter la reprise.\n\n**Prestations :**\n\n- **Liaisons Starlink** : Terminaux satellite haut débit avec bascule automatique lorsque la configuration du site le permet, pour les sites isolés ou les flottes mobiles.\n- **Réseaux UniFi à gestion centralisée** : Wi-Fi et commutateurs d'entreprise avec portail captif, VLAN et supervision unifiée.\n- **Pare-feux FortiGate NGFW** : Sécurité réseau de nouvelle génération intégrée à la couche connectivité.\n- **Téléphonie Yeastar** : Téléphonie IP professionnelle unifiée : appels, conférences et intégration aux outils métier.\n- **Liaisons redondantes** : Fibre, satellite et 4G/5G combinés selon le site, avec bascule automatique documentée et testée.\n\n**Bénéfice :** Une continuité d'activité renforcée : liaisons redondantes, supervision et procédures de bascule documentées.\n\n**Technologies :** Starlink Business, FortiGate, UniFi, Yeastar, Cisco\n\n### Cybersécurité & vidéosurveillance\n\nProtection de vos actifs numériques et physiques : sécurisation des réseaux, vidéosurveillance IP (Hikvision, Dahua) et tests d'intrusion encadrés.\n\n**Prestations :**\n\n- **Pare-feux FortiGate NGFW** : IPS, filtrage applicatif et VPN pour protéger votre périmètre.\n- **Vidéosurveillance IP Hikvision / Dahua** : Caméras haute définition avec détection assistée, vision nocturne et accès distant sécurisé.\n- **Tests d'intrusion encadrés** : Tests éthiques réalisés dans un périmètre contractuel pour identifier et corriger les failles.\n- **Durcissement** : Renforcement systématique des équipements et suppression des accès par défaut.\n- **Segmentation VLAN & plan de reprise** : Séparation des réseaux vidéo et métier, avec plan de reprise d'activité documenté.\n\n**Bénéfice :** Des actifs et des locaux mieux protégés, avec des flux vidéo privés et un réseau segmenté.\n\n**Technologies :** FortiGate, Hikvision, Dahua, NIST, ISO 27001, OWASP\n\n### IoT, traçage & MDM\n\nGéolocalisation de flottes, gestion des terminaux mobiles (MDM) et capteurs IoT : une visibilité en temps réel sur vos opérations.\n\n**Prestations :**\n\n- **Géolocalisation de flottes** : Traçage GPS de véhicules, historique, alertes de zone et rapports d'usage.\n- **Gestion de parc (MDM)** : Configuration, sécurisation et supervision à distance des smartphones et tablettes professionnels.\n- **Capteurs IoT** : Télémétrie, température et énergie : connectez et pilotez vos équipements physiques.\n- **Alertes & rapports** : Notifications configurables et rapports d'utilisation pour appuyer vos décisions.\n- **Intégration & API** : Interconnexion avec vos logiciels métier existants pour une donnée unique et fiable.\n\n**Bénéfice :** Une visibilité en temps réel sur vos flottes et vos terminaux, avec des alertes configurables.\n\n**Technologies :** GPS/GNSS, MDM, MQTT, API REST, LoRaWAN\n\n### Innovation IA & systèmes autonomes\n\nDéploiement local d'agents IA open-source (Hermes Agent, OpenCode AI) sous Linux pour automatiser vos opérations tout en gardant la maîtrise des données.\n\n**Prestations :**\n\n- **Agents IA open-source** : Déploiement local de Hermes Agent et OpenCode AI pour exécuter des tâches complexes en autonomie.\n- **Fine-tuning & modèles sur mesure** : Adaptation de modèles de langage aux spécificités de votre entreprise.\n- **Automatisation des opérations** : Scripts, pipelines et workflows auto-gérés, sans dépendance cloud systématique.\n- **Environnement Linux** : Infrastructure maîtrisée sous Linux : contrôle, sécurité et coûts documentés.\n- **Supervision & maintenance** : Monitoring des agents, versioning des modèles et rapports d'activité réguliers.\n\n**Bénéfice :** Une automatisation locale de vos processus, avec des données hébergées selon votre choix.\n\n**Technologies :** Hermes Agent, OpenCode AI, Linux, Python, Ollama\n\n## 4. Produits M-SEC\n\n- **POS Pro** (Caisse restaurant, Programme pilote ouvert) : Caisse hors-ligne pour restaurants : encaissement en CDF et USD, suivi des ventes et prise en charge du mobile money de la RDC (M-Pesa, Airtel Money, Orange Money, Afrimoney).\n- **Herbo** (Boutique en ligne, Bientôt) : Une boutique de médicaments traditionnels en préparation, avec fiches produits et traçabilité.\n- **MonImmo** (Immobilier, Bientôt) : Une plateforme immobilière en préparation pour présenter et gérer des biens.\n\n- **POS Pro n'est pas encore en ligne.** Le développement est en cours ; le programme pilote s'adresse aux restaurants de Kinshasa, sous réserve de disponibilité et après validation du besoin. Aucun prix n'est publié.\n- **Herbo** et **MonImmo** sont en préparation : ne pas les présenter comme lancés ou disponibles.\n\n## 5. Méthode, engagements et exemples de missions\n\n**Méthode en 4 phases :**\n\n1. **Audit & analyse** : Évaluation de vos vulnérabilités. Cartographie réseau, mesure de performance et identification des failles.\n2. **Proposition technique** : Conception sur mesure (Cisco, UniFi, FortiGate). Chiffrage transparent, planning et garanties contractuelles.\n3. **Déploiement sécurisé** : Installation physique et logique avec durcissement cyber. Tests de performance complets.\n4. **Supervision continue** : Monitoring selon le contrat, maintenance proactive, rapports et support technique dédié.\n\n**Engagements contractuels :**\n\n- **Réponse à un message** : Sous 24 h ouvrées. Pour toute demande envoyée via le formulaire ou par e-mail.\n- **Diagnostic d'audit** : Sous 48 h. Après réception des informations nécessaires. Le rapport complet dépend du périmètre convenu.\n- **Intervention prioritaire** : Selon le SLA du contrat. Délais définis et signés dans le contrat de support.\n\n**Exemples de missions :** les deux exemples ci-dessous sont présentés comme des exemples de missions. Ne pas affirmer qu'il s'agit de chantiers réalisés pour des clients précis ni citer de client.\n\n### Exemple de mission : Refonte du câblage et digitalisation de complexes immobiliers\n\n*Modernisation d'infrastructure*\n\n**Le défi :** Des complexes immobiliers majeurs dotés d'un réseau hétéroclite, lent et peu fiable, freinant les outils de gestion et les points de vente.\n\n**La solution déployée :** Refonte complète du câblage réseau sur près de 50 % des infrastructures, évaluation et déploiement de logiciels de gestion (type Okoya/Immosphere), et intégration de systèmes de point de vente (POS) synchronisés en temps réel.\n\n**L'impact opérationnel :** Des opérations accélérées, des ventes fiabilisées et une infrastructure enfin maintenable, documentée et prête à croître.\n\n### Exemple de mission : Architecture de connectivité pour véhicules d'intervention\n\n*Connectivité nomade*\n\n**Le défi :** Une flotte de véhicules d'intervention sans connexion fiable en zones reculées, incapable de transmettre ses données de mission en temps réel.\n\n**La solution déployée :** Conception technique et déploiement de terminaux satellites haut débit couplés à des stations d'énergie portables, afin de maintenir une liaison opérationnelle indépendamment de l'infrastructure locale.\n\n**L'impact opérationnel :** Une flotte mieux connectée, une télémétrie plus fiable et une capacité d'intervention renforcée sur le terrain.\n\n## 6. Oscar Mulume : parcours et formation\n\n- J'architecte, déploie et sécurise les infrastructures critiques d'entreprises en Afrique Centrale. De la fibre optique à la cybersécurité offensive, en passant par l'intégration d'IA — je conçois des systèmes pensés pour rester disponibles.\n- **En IT depuis** : 2021.\n- **Formation** : Licence Réseaux, Télécoms & Maintenance — ISIPA 2025.\n- **Diplôme** : Diplôme Sup. Informatique — ISIG Goma (2019-2025).\n\n**Postes actuels :**\n\n- **Responsable IT, Ingénierie & Technologies (Consultant IT)** (Févr. 2026 – Présent) — Malaïka Group — Kinshasa, RDC\n  - Pilotage de l'IT, de la cybersécurité et de l'ingénierie de 5 entités (Malaïka Group, Ranch, Travels, Le Gabriel, Chez Malaïka)\n  - Entré comme technicien réseau pour un audit d'urgence : pannes critiques rétablies, contrat groupe obtenu en un mois\n  - Durcissement des plateformes web après un incident de sécurité : scans de vulnérabilités, correctifs, pare-feu, antivirus\n  - Disponibilité de 99,9 % (Wi-Fi, PMS, contrôle d'accès), 99,5 % (POS), 99 % (Internet) ; incidents critiques traités en moins de 2 h\n  - Plan de reprise après sinistre (DRP) et sauvegardes testés ; rapports mensuels à la direction\n- **Fondateur & Consultant principal** (Mai 2026 – Présent) — M-SEC Technology Consulting — Kinshasa, RDC\n  - Évaluations de vulnérabilités, durcissement de systèmes et conseil en sécurité\n  - Applications web et mobiles sur mesure (Flutter/Dart, Supabase) avec paiement mobile\n\n- **Auparavant** : ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), et bénévolat à la Croix-Rouge RDC (2022–2024).\n\n**Compétences clés :**\n\n- Réseau et sécurité : Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, CCTV IP, Wi-Fi entreprise, durcissement, pare-feu/IDS, DRP/BCP.\n- Développement et données : Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, paiements M-Pesa, Orange Money et Flutterwave.\n- IA et cloud : AWS Bedrock, machine learning, IA générative, déploiement local d'agents open-source sous Linux.\n\n**Résultats publiés sur le portfolio :**\n\n- Chez Malaïka Group : 5 entités sécurisées, SLA de 99,9 % maintenu pour le Wi-Fi et le PMS, disponibilité POS de 99,5 %, disponibilité Internet de 99 %, incidents critiques traités en moins de 2 h.\n- Ces chiffres sont des résultats passés publiés sur le portfolio. Ils ne constituent pas une garantie universelle de M-SEC : les objectifs de disponibilité sont fixés contrat par contrat.\n\n## 7. Projets et pratique\n\n- **POS Pro** (En cours) — Caisse pour restaurant pensée pour fonctionner hors ligne, avec application web et déclinaisons bureau et mobile. Développement en cours, pas encore disponible en ligne.\n- **Malaika Ranch** (En ligne) — Boutique en ligne avec commande via WhatsApp. — https://malaika-ranch-web.vercel.app\n- **Site M-SEC Technology Consulting** (En ligne) — Site vitrine de M-SEC Technology Consulting : conseil IT, réseaux et cybersécurité à Kinshasa. — https://oscarmulume.github.io/msec-technology-consulting/\n- **Mosala** (En ligne) — Assistant open source de CV et de conversation pour les langues africaines, qui fonctionne hors ligne avec un modèle local (Ollama). — https://github.com/OscarMulume/nonchalant-cv ; https://dev.to/oscarmulume/mosala-a-cv-and-conversation-assistant-for-africas-languages-running-on-your-own-computer-2coc\n- **Machines Cohort & Orion** — Cohort : SSRF, accès initial puis élévation de privilèges via CVE. Orion : énumération web CraftCMS et contournement d'authentification Telnet local.\n- **Sherlocks Brutus & Investigate Web Attack** — Reconstitution de kill chains à partir de logs : brute force SSH (auth.log, wtmp, MITRE T1136), scan Nikto, brute force web et injection de commandes.\n- **Cloud privé Raspberry Pi** — Serveur de stockage personnel sur Raspberry Pi 5 avec Nextcloud, accessible à distance de façon sécurisée via Tailscale.\n\n- **Hack The Box** : pratique régulière en cybersécurité offensive ; le portfolio affiche le niveau 25.\n\n## 8. Badges Cisco Networking Academy\n\n**Important : ce sont des badges de formation, pas des certifications professionnelles. Ne jamais dire qu'Oscar est « certifié Cisco » ni présenter un badge comme une certification.**\n\nCinq badges Cisco Networking Academy, vérifiables sur Credly :\n\n- **Ethical Hacker** — 23 octobre 2026 — https://www.credly.com/badges/bc73a9b9-0b18-423f-b230-485a61ddfcc6/public_url\n- **Junior Cybersecurity Analyst Career Path** — 20 mars 2026 — https://www.credly.com/badges/28ac05ee-4d11-4114-9c58-15cbf86c4589/public_url\n- **Networking Devices and Initial Configuration** — 17 mars 2026 — https://www.credly.com/users/oscar-mulume\n- **Networking Basics** — 4 mars 2026 — https://www.credly.com/users/oscar-mulume\n- **Introduction to Cybersecurity** — 10 juillet 2022 — https://www.credly.com/users/oscar-mulume\n\n- **Profil Credly** : https://www.credly.com/users/oscar-mulume\n- **Formation complémentaire** : Grant AI Skills & Compute Africa (juillet 2026, fine-tuning de modèles et agents autonomes) et Data Science Africa Summer School (Université Makerere), selon le site M-SEC. Aucun lien de vérification n'est fourni pour ces deux formations.\n- **Diplôme** : Licence en Sciences Informatiques — ISIPA, selon le portfolio. Aucun lien de vérification n'est fourni.\n\n## 9. Ce que l'assistant ne doit jamais affirmer\n\n- Aucun prix, tarif, remise, délai de livraison, nombre de clients, témoignage ou résultat non listé dans ce fichier.\n- Aucune certification professionnelle, aucun partenariat officiel, aucune accréditation ISO. Les référentiels NIST, ISO 27001, CIS, OWASP et TIA/EIA-568 sont des standards utilisés, pas des certifications obtenues.\n- Aucune garantie de disponibilité 24/7 ou de SLA universel. Le SLA dépend du contrat.\n- Ne pas dire qu'un audit complet est gratuit : seul le mini-audit initial est gratuit ; le rapport complet dépend du périmètre.\n- Ne pas dire que POS Pro est disponible ou en ligne. Ne pas dire que Herbo ou MonImmo sont lancés.\n- Ne pas donner de conseil de sécurité personnalisé comme s'il valait audit. Proposer un audit ou un échange.\n- Ne pas demander de mot de passe, clé, secret, donnée bancaire ou information sensible.\n- Ne communiquer aucun numéro de téléphone : renvoyer vers le formulaire de contact et l'e-mail.\n- Si l'information n'est pas dans ce fichier : répondre « Je n'ai pas cette information » et orienter vers le formulaire ou l'e-mail.\n\n## 10. Réponses canoniques\n\n**Qui est Oscar Mulume ?**  \nOscar Mulume Izuba est consultant IT, architecte réseau et analyste en cybersécurité basé à Kinshasa, en RDC. Il a fondé M-SEC Technology Consulting et occupe le poste de Responsable IT, Ingénierie & Technologies chez Malaïka Group.\n\n**Que fait M-SEC ?**  \nM-SEC intervient sur quatre piliers : connectivité et infrastructure haute disponibilité, cybersécurité et vidéosurveillance, IoT/traçage/MDM, et innovation IA avec des systèmes autonomes.\n\n**Combien coûte un audit ?**  \nLe mini-audit initial est gratuit et sans engagement. Le rapport complet et les travaux sont chiffrés après définition du périmètre. Aucun prix n'est publié.\n\n**POS Pro est-il disponible ?**  \nPas encore. POS Pro est en développement et proposé via un programme pilote pour les restaurants, sous réserve de disponibilité. Il n'est pas disponible en ligne.\n\n**Oscar est-il certifié Cisco ?**  \nIl détient cinq badges Cisco Networking Academy vérifiables sur Credly. Ce sont des badges de formation, pas des certifications professionnelles : il ne faut pas le présenter comme « certifié Cisco ».\n\n**Où intervient Oscar ?**  \nIl est basé à Kinshasa et intervient à Kinshasa, Goma, Bukavu, en Afrique centrale et à distance, selon la mission.\n\n**Comment demander un devis ?**  \nUtiliser le formulaire de contact du site M-SEC, écrire à oscarmulume1612@gmail.com. L'assistant peut aussi recueillir un nom, un e-mail ou un numéro WhatsApp, et le besoin.\n\n**M-SEC garantit-il 99,9 % de disponibilité ?**  \nNon, aucune garantie universelle n'est publiée. Les objectifs de disponibilité sont définis contrat par contrat. Le chiffre de 99,9 % est un résultat passé chez Malaïka Group, pas une promesse générale de M-SEC.\n",
  "en": "# M-SEC assistant knowledge — English\n\n> Generated by `scripts/build-knowledge.mjs`. Do not edit by hand: run `npm run build:knowledge`.\n> Source version: `a94da268196b`.\n> To be reviewed by Oscar before production.\n\n## 1. Identity and contact details\n\n- **Public name**: Oscar Mulume (legal name: MULUME IZUBA OSCAR).\n- **Role**: IT infrastructure · Networks · Cybersecurity · Development.\n- **Company**: M-SEC Technology Consulting, also called **M-SEC** (for Mulume Security). IT, network and cybersecurity engineering firm. Infrastructure, connectivity and security for businesses in Central Africa.\n- **M-SEC website**: https://oscarmulume.github.io/msec-technology-consulting/\n- **Portfolio**: https://oscarmulume.github.io/\n- **Email**: oscarmulume1612@gmail.com\n- **LinkedIn**: https://www.linkedin.com/in/oscar-mulume-95666b225/\n- **GitHub**: https://github.com/OscarMulume\n- **Based in**: Kinshasa, DR Congo.\n- **Service area**: Kinshasa, Goma, Bukavu (DR Congo); Central Africa; Remote / on-site.\n- **Languages**: French (native/bilingual), English (professional/technical), Swahili (professional), Lingala (intermediate).\n- **Availability**: Available — Central Africa.\n\n## 2. M-SEC at a glance\n\n- IT infrastructure and security serving your company's performance.\n- A network outage or a security vulnerability can be costly for a business. We combine network engineering, software development and cybersecurity to build environments that are more resilient, documented and maintainable.\n- We apply the principle of security by design. Every cable installed, every access point configured and every database deployed includes documented hardening rules, to reduce risk and simplify maintenance.\n- Our architectures rely on enterprise standards: Cisco, UniFi, FortiGate. We favour verifiable choices, clear pricing and documentation delivered at every stage.\n- **Four pillars**: connectivity and infrastructure, cybersecurity and video surveillance, IoT/tracking/MDM, and AI innovation with autonomous systems.\n- **Published commitments**: reply to a message within 24 business hours; audit diagnosis within 48 hours after receiving the required information; priority response according to the contract SLA.\n- **Pricing**: no prices are published. A quote is prepared after scoping the need. The initial mini-audit is free and without commitment; the full report depends on the agreed scope. The POS Pro pilot is offered subject to availability.\n- **SLA**: availability targets are set contract by contract. No 24/7 availability is promised without a contract.\n\n## 3. M-SEC services\n\n### Connectivity & high-availability infrastructure\n\nStarlink links, UniFi networks, FortiGate NGFW firewalls and Yeastar telephony: an architecture designed to reduce downtime and simplify recovery.\n\n**What we deliver :**\n\n- **Starlink links** : High-speed satellite terminals with automatic failover where site configuration allows, for isolated sites or mobile fleets.\n- **Centrally managed UniFi networks** : Enterprise Wi-Fi and switches with captive portal, VLANs and unified supervision.\n- **FortiGate NGFW firewalls** : Next-generation network security integrated into the connectivity layer.\n- **Yeastar telephony** : Unified professional IP telephony: calls, conferences and integration with business tools.\n- **Redundant links** : Fibre, satellite and 4G/5G combined per site, with a documented and tested failover procedure.\n\n**Benefit :** Stronger business continuity: redundant links, supervision and documented failover procedures.\n\n**Technologies :** Starlink Business, FortiGate, UniFi, Yeastar, Cisco\n\n### Cybersecurity & video surveillance\n\nProtection for your digital and physical assets: network security, IP video surveillance (Hikvision, Dahua) and supervised penetration tests.\n\n**What we deliver :**\n\n- **FortiGate NGFW firewalls** : IPS, application filtering and VPN to protect your perimeter.\n- **Hikvision / Dahua IP video surveillance** : High-definition cameras with assisted detection, night vision and secure remote access.\n- **Supervised penetration tests** : Ethical tests carried out within a contractual scope to identify and fix vulnerabilities.\n- **Hardening** : Systematic hardening of equipment and removal of default access.\n- **VLAN segmentation & recovery plan** : Separation of video and business networks, with a documented business recovery plan.\n\n**Benefit :** Better-protected assets and premises, with private video streams and a segmented network.\n\n**Technologies :** FortiGate, Hikvision, Dahua, NIST, ISO 27001, OWASP\n\n### IoT, tracking & MDM\n\nFleet geolocation, mobile device management (MDM) and IoT sensors: real-time visibility over your operations.\n\n**What we deliver :**\n\n- **Fleet geolocation** : GPS vehicle tracking, history, geofence alerts and usage reports.\n- **Device management (MDM)** : Remote configuration, security and supervision of professional smartphones and tablets.\n- **IoT sensors** : Telemetry, temperature and energy: connect and manage your physical equipment.\n- **Alerts & reports** : Configurable notifications and usage reports to support your decisions.\n- **Integration & API** : Connection with your existing business software for a single, reliable source of data.\n\n**Benefit :** Real-time visibility over your fleets and devices, with configurable alerts.\n\n**Technologies :** GPS/GNSS, MDM, MQTT, REST API, LoRaWAN\n\n### AI innovation & autonomous systems\n\nLocal deployment of open-source AI agents (Hermes Agent, OpenCode AI) on Linux to automate your operations while keeping control of your data.\n\n**What we deliver :**\n\n- **Open-source AI agents** : Local deployment of Hermes Agent and OpenCode AI to run complex tasks autonomously.\n- **Fine-tuning & custom models** : Adaptation of language models to your company's specific needs.\n- **Operations automation** : Self-managed scripts, pipelines and workflows, without systematic cloud dependency.\n- **Linux environment** : Controlled Linux infrastructure: security, control and documented costs.\n- **Supervision & maintenance** : Agent monitoring, model versioning and regular activity reports.\n\n**Benefit :** Local automation of your processes, with data hosted according to your choice.\n\n**Technologies :** Hermes Agent, OpenCode AI, Linux, Python, Ollama\n\n## 4. M-SEC products\n\n- **POS Pro** (Restaurant point of sale, Pilot programme open): Offline point of sale for restaurants: CDF and USD payments, sales tracking and support for mobile money in DR Congo (M-Pesa, Airtel Money, Orange Money, Afrimoney).\n- **Herbo** (Online shop, Coming soon): An online shop for traditional medicines in preparation, with product pages and traceability.\n- **MonImmo** (Real estate, Coming soon): A real estate platform in preparation to present and manage properties.\n\n- **POS Pro is not online yet.** Development is ongoing; the pilot programme is aimed at restaurants in Kinshasa, subject to availability and after validating the need. No price is published.\n- **Herbo** and **MonImmo** are in preparation: do not present them as launched or available.\n\n## 5. Method, commitments and example missions\n\n**Four-phase method:**\n\n1. **Audit & analysis**: Assessment of your vulnerabilities. Network mapping, performance measurement and identification of weaknesses.\n2. **Technical proposal**: Custom design (Cisco, UniFi, FortiGate). Transparent pricing, schedule and contractual guarantees.\n3. **Secure deployment**: Physical and logical installation with cybersecurity hardening. Full performance testing.\n4. **Continuous supervision**: Monitoring according to the contract, proactive maintenance, reports and dedicated technical support.\n\n**Contractual commitments:**\n\n- **Reply to a message**: Within 24 business hours. For any request sent through the form or by email.\n- **Audit diagnosis**: Within 48 hours. After receiving the necessary information. The full report depends on the agreed scope.\n- **Priority response**: According to the contract SLA. Timelines defined and signed in the support contract.\n\n**Example missions:** the two examples below are presented as example missions. Do not claim they are completed projects for specific clients and never name a client.\n\n### Example mission : Rewiring and digitalisation of real estate complexes\n\n*Infrastructure modernisation*\n\n**The challenge :** Major real estate complexes with a heterogeneous, slow and unreliable network, holding back management tools and points of sale.\n\n**The solution :** Complete rewiring of nearly 50% of the network infrastructure, evaluation and deployment of management software (Okoya/Immosphere type), and integration of point-of-sale systems synchronised in real time.\n\n**Operational impact :** Faster operations, more reliable sales and infrastructure that is finally maintainable, documented and ready to grow.\n\n### Example mission : Connectivity architecture for response vehicles\n\n*Mobile connectivity*\n\n**The challenge :** A fleet of response vehicles without reliable connectivity in remote areas, unable to transmit mission data in real time.\n\n**The solution :** Technical design and deployment of high-speed satellite terminals combined with portable power stations, to maintain an operational link independently of local infrastructure.\n\n**Operational impact :** A better-connected fleet, more reliable telemetry and enhanced field response capacity.\n\n## 6. Oscar Mulume: background and education\n\n- I design, deploy and secure critical business infrastructure in Central Africa. From fibre optics to offensive cybersecurity and AI integration, I build systems designed to stay available.\n- **In IT since**: 2021.\n- **Education**: Bachelor’s degree in Networks, Telecommunications & Maintenance — ISIPA, 2025.\n- **Diploma**: Higher diploma in Computer Science — ISIG Goma, 2019–2025.\n\n**Current roles:**\n\n- **Head of IT, Engineering & Technology (IT Consultant)** (February 2026 – present) — Malaïka Group — Kinshasa, DR Congo\n  - Leads IT, cybersecurity and engineering for 5 entities (Malaïka Group, Ranch, Travels, Le Gabriel, Chez Malaïka).\n  - Hardened web platforms after a security incident: vulnerability scans, patches, firewall and antivirus.\n  - Maintained 99.9% availability for Wi-Fi, PMS and access control, 99.5% for POS and 99% for Internet; critical incidents handled in under 2 hours.\n  - Tested disaster recovery and backup plans; delivered monthly reports to management.\n- **Founder & Principal Consultant** (May 2026 – present) — M-SEC Technology Consulting — Kinshasa, DR Congo\n  - Vulnerability assessments, system hardening and security consulting.\n  - Custom web and mobile applications (Flutter/Dart, Supabase) with mobile money payments.\n\n- **Previously**: ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), and volunteer work with the Red Cross DRC (2022–2024).\n\n**Key skills:**\n\n- Network and security: Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, IP CCTV, enterprise Wi-Fi, hardening, firewall/IDS, DRP/BCP.\n- Development and data: Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, M-Pesa, Orange Money and Flutterwave payments.\n- AI and cloud: AWS Bedrock, machine learning, generative AI, local deployment of open-source agents on Linux.\n\n**Results published on the portfolio:**\n\n- At Malaïka Group: 5 entities secured, 99.9% SLA maintained for Wi-Fi and PMS, 99.5% POS availability, 99% Internet availability, critical incidents handled in under 2 hours.\n- The 99.9% SLA, 99.5% POS availability and 99% Internet availability are past results at Malaïka Group published on the portfolio. They are not a universal M-SEC guarantee; M-SEC availability targets are set contract by contract.\n\n## 7. Projects and practice\n\n- **POS Pro** (In progress) — Restaurant point-of-sale designed to work offline, with web, desktop and mobile versions. Development is ongoing and it is not yet available online.\n- **Malaika Ranch** (Online) — Online shop with ordering through WhatsApp. — https://malaika-ranch-web.vercel.app\n- **M-SEC Technology Consulting website** (Online) — M-SEC Technology Consulting website: IT consulting, networks and cybersecurity in Kinshasa. — https://oscarmulume.github.io/msec-technology-consulting/\n- **Mosala** (Online) — Open-source CV and conversation assistant for African languages. It works offline with a local model (Ollama). — https://github.com/OscarMulume/nonchalant-cv ; https://dev.to/oscarmulume/mosala-a-cv-and-conversation-assistant-for-africas-languages-running-on-your-own-computer-2coc\n- **Cohort & Orion machines** — Cohort: SSRF, initial access then privilege escalation through a CVE. Orion: CraftCMS web enumeration and local Telnet authentication bypass.\n- **Brutus & Investigate Web Attack Sherlocks** — Reconstructing kill chains from logs: SSH brute force (auth.log, wtmp, MITRE T1136), Nikto scanning, web brute force and command injection.\n- **Raspberry Pi private cloud** — Personal storage server on a Raspberry Pi 5 with Nextcloud, securely reachable remotely through Tailscale.\n\n- **Hack The Box**: regular offensive cybersecurity practice; the portfolio displays level 25.\n\n## 8. Cisco Networking Academy badges\n\n**Important: these are training badges, not professional certifications. Never say Oscar is “Cisco certified” or present a badge as a certification.**\n\nFive Cisco Networking Academy badges, verifiable on Credly:\n\n- **Ethical Hacker** — October 23, 2026 — https://www.credly.com/badges/bc73a9b9-0b18-423f-b230-485a61ddfcc6/public_url\n- **Junior Cybersecurity Analyst Career Path** — March 20, 2026 — https://www.credly.com/badges/28ac05ee-4d11-4114-9c58-15cbf86c4589/public_url\n- **Networking Devices and Initial Configuration** — March 17, 2026 — https://www.credly.com/users/oscar-mulume\n- **Networking Basics** — March 4, 2026 — https://www.credly.com/users/oscar-mulume\n- **Introduction to Cybersecurity** — July 10, 2022 — https://www.credly.com/users/oscar-mulume\n\n- **Credly profile**: https://www.credly.com/users/oscar-mulume\n- **Additional training**: Grant AI Skills & Compute Africa (July 2026, fine-tuning language models and autonomous agents) and the Data Science Africa Summer School (Makerere University), according to the M-SEC website. No verification link is provided for these two programmes.\n- **Degree**: Bachelor’s degree in Computer Science — ISIPA, according to the portfolio. No verification link is provided.\n\n## 9. What the assistant must never claim\n\n- No price, rate, discount, delivery time, client count, testimonial or result that is not listed in this file.\n- No professional certification, official partnership or ISO accreditation. NIST, ISO 27001, CIS, OWASP and TIA/EIA-568 are standards that may be used, not certifications obtained.\n- No guarantee of 24/7 availability or a universal SLA. The SLA depends on the contract.\n- Do not say a full audit is free: only the initial mini-audit is free; the full report depends on the scope.\n- Do not say POS Pro is available or online. Do not say Herbo or MonImmo have launched.\n- Do not give personalised security advice as if it were an audit. Offer an audit or a conversation.\n- Do not ask for passwords, keys, secrets, banking details or sensitive information.\n- Never give out a phone number: point to the contact form and email.\n- If the information is not in this file: answer “I don’t have that information” and point to the form or email.\n\n## 10. Canonical answers\n\n**Who is Oscar Mulume?**  \nOscar Mulume Izuba is an IT consultant, network architect and cybersecurity analyst based in Kinshasa, DR Congo. He founded M-SEC Technology Consulting and works as Head of IT, Engineering & Technology at Malaïka Group.\n\n**What does M-SEC do?**  \nM-SEC covers four areas: connectivity and high-availability infrastructure, cybersecurity and video surveillance, IoT/tracking/MDM, and AI innovation with autonomous systems.\n\n**How much does an audit cost?**  \nThe initial mini-audit is free and without commitment. The full report and any implementation work are quoted after defining the scope. No price is published.\n\n**Is POS Pro available?**  \nNot yet. POS Pro is in development and offered through a pilot programme for restaurants, subject to availability. It is not available online.\n\n**Is Oscar Cisco certified?**  \nHe holds five Cisco Networking Academy badges, verifiable on Credly. These are training badges, not professional certifications, so he should not be described as “Cisco certified”.\n\n**Where does Oscar work?**  \nHe is based in Kinshasa and works in Kinshasa, Goma, Bukavu, across Central Africa, and remotely, depending on the assignment.\n\n**How can I request a quote?**  \nUse the contact form on the M-SEC site or email oscarmulume1612@gmail.com. The assistant can also collect a name, an email or WhatsApp number, and the need.\n\n**Does M-SEC guarantee 99.9% availability?**  \nNo universal guarantee is published. Availability targets are defined contract by contract. The 99.9% figure is a past result at Malaïka Group, not a blanket M-SEC promise.\n"
};

export const KNOWLEDGE_SECTIONS: { fr: KnowledgeSection[]; en: KnowledgeSection[] } = {
  "fr": [
    {
      "id": "1",
      "title": "1. Identité et coordonnées",
      "text": "## 1. Identité et coordonnées\n\n- **Nom public** : Oscar Mulume (nom légal : MULUME IZUBA OSCAR).\n- **Rôle** : Infrastructure IT · Réseaux · Cybersécurité · Développement.\n- **Entreprise** : M-SEC Technology Consulting, aussi appelée **M-SEC** (pour Mulume Security). Cabinet d'ingénierie IT, réseaux et cybersécurité. Infrastructure, connectivité et sécurité au service des entreprises d'Afrique centrale.\n- **Site M-SEC** : https://oscarmulume.github.io/msec-technology-consulting/\n- **Portfolio** : https://oscarmulume.github.io/\n- **E-mail** : oscarmulume1612@gmail.com\n- **LinkedIn** : https://www.linkedin.com/in/oscar-mulume-95666b225/\n- **GitHub** : https://github.com/OscarMulume\n- **Basé à** : Kinshasa, RDC — Afrique Centrale.\n- **Zone d'intervention** : Kinshasa, Goma, Bukavu ; Afrique Centrale ; Remote / Sur site.\n- **Langues** : Français (natif/bilingue), Anglais (pro/technique), Swahili (pro), Lingala (intermédiaire).\n- **Disponibilité** : Disponible — Afrique Centrale.",
      "always": true,
      "keywords": []
    },
    {
      "id": "2",
      "title": "2. M-SEC en bref",
      "text": "## 2. M-SEC en bref\n\n- L'infrastructure et la sécurité IT au service de la performance de votre entreprise.\n- Une interruption réseau ou une faille de sécurité peut coûter cher à une entreprise. Nous associons ingénierie réseau, développement et cybersécurité pour construire des environnements plus résilients, documentés et maintenables.\n- Nous appliquons le principe de « sécurité par conception ». Chaque câble posé, chaque antenne configurée et chaque base de données déployée intègre des règles de durcissement documentées, afin de réduire les risques et de faciliter la maintenance.\n- Nos architectures s'appuient sur des standards d'entreprise : Cisco, UniFi, FortiGate. Nous privilégions des choix vérifiables, un chiffrage clair et une documentation remise à chaque étape.\n- **Quatre piliers** : connectivité et infrastructure, cybersécurité et vidéosurveillance, IoT/traçage/MDM, innovation IA et systèmes autonomes.\n- **Engagements publiés** : réponse à un message sous 24 h ouvrées ; diagnostic d'audit sous 48 h après réception des informations ; intervention prioritaire selon le SLA du contrat.\n- **Tarifs** : aucun prix n'est publié. Un devis est établi après cadrage du besoin. Le mini-audit initial est gratuit et sans engagement ; le rapport complet dépend du périmètre convenu. Le programme pilote POS Pro est proposé sous réserve de disponibilité.\n- **SLA** : les objectifs de disponibilité sont fixés contrat par contrat. Aucune disponibilité 24/7 n'est promise sans contrat.",
      "keywords": [
        "m-sec",
        "msec",
        "entreprise",
        "cabinet",
        "pilier",
        "piliers",
        "tarif",
        "tarifs",
        "prix",
        "cout",
        "coute",
        "sla",
        "disponibilite",
        "engagement",
        "engagements",
        "garantie",
        "garanties",
        "24/7",
        "devis",
        "audit",
        "diagnostic"
      ]
    },
    {
      "id": "3",
      "title": "3. Services M-SEC",
      "text": "## 3. Services M-SEC\n\n### Connectivité & infrastructure haute disponibilité\n\nLiaisons Starlink, réseaux UniFi, pare-feux FortiGate NGFW et téléphonie Yeastar : une architecture pensée pour réduire les interruptions et faciliter la reprise.\n\n**Prestations :**\n\n- **Liaisons Starlink** : Terminaux satellite haut débit avec bascule automatique lorsque la configuration du site le permet, pour les sites isolés ou les flottes mobiles.\n- **Réseaux UniFi à gestion centralisée** : Wi-Fi et commutateurs d'entreprise avec portail captif, VLAN et supervision unifiée.\n- **Pare-feux FortiGate NGFW** : Sécurité réseau de nouvelle génération intégrée à la couche connectivité.\n- **Téléphonie Yeastar** : Téléphonie IP professionnelle unifiée : appels, conférences et intégration aux outils métier.\n- **Liaisons redondantes** : Fibre, satellite et 4G/5G combinés selon le site, avec bascule automatique documentée et testée.\n\n**Bénéfice :** Une continuité d'activité renforcée : liaisons redondantes, supervision et procédures de bascule documentées.\n\n**Technologies :** Starlink Business, FortiGate, UniFi, Yeastar, Cisco\n\n### Cybersécurité & vidéosurveillance\n\nProtection de vos actifs numériques et physiques : sécurisation des réseaux, vidéosurveillance IP (Hikvision, Dahua) et tests d'intrusion encadrés.\n\n**Prestations :**\n\n- **Pare-feux FortiGate NGFW** : IPS, filtrage applicatif et VPN pour protéger votre périmètre.\n- **Vidéosurveillance IP Hikvision / Dahua** : Caméras haute définition avec détection assistée, vision nocturne et accès distant sécurisé.\n- **Tests d'intrusion encadrés** : Tests éthiques réalisés dans un périmètre contractuel pour identifier et corriger les failles.\n- **Durcissement** : Renforcement systématique des équipements et suppression des accès par défaut.\n- **Segmentation VLAN & plan de reprise** : Séparation des réseaux vidéo et métier, avec plan de reprise d'activité documenté.\n\n**Bénéfice :** Des actifs et des locaux mieux protégés, avec des flux vidéo privés et un réseau segmenté.\n\n**Technologies :** FortiGate, Hikvision, Dahua, NIST, ISO 27001, OWASP\n\n### IoT, traçage & MDM\n\nGéolocalisation de flottes, gestion des terminaux mobiles (MDM) et capteurs IoT : une visibilité en temps réel sur vos opérations.\n\n**Prestations :**\n\n- **Géolocalisation de flottes** : Traçage GPS de véhicules, historique, alertes de zone et rapports d'usage.\n- **Gestion de parc (MDM)** : Configuration, sécurisation et supervision à distance des smartphones et tablettes professionnels.\n- **Capteurs IoT** : Télémétrie, température et énergie : connectez et pilotez vos équipements physiques.\n- **Alertes & rapports** : Notifications configurables et rapports d'utilisation pour appuyer vos décisions.\n- **Intégration & API** : Interconnexion avec vos logiciels métier existants pour une donnée unique et fiable.\n\n**Bénéfice :** Une visibilité en temps réel sur vos flottes et vos terminaux, avec des alertes configurables.\n\n**Technologies :** GPS/GNSS, MDM, MQTT, API REST, LoRaWAN\n\n### Innovation IA & systèmes autonomes\n\nDéploiement local d'agents IA open-source (Hermes Agent, OpenCode AI) sous Linux pour automatiser vos opérations tout en gardant la maîtrise des données.\n\n**Prestations :**\n\n- **Agents IA open-source** : Déploiement local de Hermes Agent et OpenCode AI pour exécuter des tâches complexes en autonomie.\n- **Fine-tuning & modèles sur mesure** : Adaptation de modèles de langage aux spécificités de votre entreprise.\n- **Automatisation des opérations** : Scripts, pipelines et workflows auto-gérés, sans dépendance cloud systématique.\n- **Environnement Linux** : Infrastructure maîtrisée sous Linux : contrôle, sécurité et coûts documentés.\n- **Supervision & maintenance** : Monitoring des agents, versioning des modèles et rapports d'activité réguliers.\n\n**Bénéfice :** Une automatisation locale de vos processus, avec des données hébergées selon votre choix.\n\n**Technologies :** Hermes Agent, OpenCode AI, Linux, Python, Ollama",
      "keywords": [
        "service",
        "services",
        "offre",
        "offrez",
        "connectivite",
        "reseau",
        "reseaux",
        "wifi",
        "wi-fi",
        "starlink",
        "unifi",
        "fortigate",
        "pare-feu",
        "firewall",
        "telephonie",
        "yeastar",
        "cybersecurite",
        "securite",
        "videosurveillance",
        "camera",
        "cameras",
        "hikvision",
        "dahua",
        "pentest",
        "intrusion",
        "iot",
        "tracage",
        "mdm",
        "geolocalisation",
        "flotte",
        "flottes",
        "agent",
        "agents",
        "ia",
        "intelligence",
        "automatisation",
        "linux",
        "hermes",
        "opencode"
      ]
    },
    {
      "id": "4",
      "title": "4. Produits M-SEC",
      "text": "## 4. Produits M-SEC\n\n- **POS Pro** (Caisse restaurant, Programme pilote ouvert) : Caisse hors-ligne pour restaurants : encaissement en CDF et USD, suivi des ventes et prise en charge du mobile money de la RDC (M-Pesa, Airtel Money, Orange Money, Afrimoney).\n- **Herbo** (Boutique en ligne, Bientôt) : Une boutique de médicaments traditionnels en préparation, avec fiches produits et traçabilité.\n- **MonImmo** (Immobilier, Bientôt) : Une plateforme immobilière en préparation pour présenter et gérer des biens.\n\n- **POS Pro n'est pas encore en ligne.** Le développement est en cours ; le programme pilote s'adresse aux restaurants de Kinshasa, sous réserve de disponibilité et après validation du besoin. Aucun prix n'est publié.\n- **Herbo** et **MonImmo** sont en préparation : ne pas les présenter comme lancés ou disponibles.",
      "keywords": [
        "produit",
        "produits",
        "pos",
        "pos pro",
        "caisse",
        "restaurant",
        "restaurants",
        "herbo",
        "monimmo",
        "boutique",
        "immobilier",
        "pilote"
      ]
    },
    {
      "id": "5",
      "title": "5. Méthode, engagements et exemples de missions",
      "text": "## 5. Méthode, engagements et exemples de missions\n\n**Méthode en 4 phases :**\n\n1. **Audit & analyse** : Évaluation de vos vulnérabilités. Cartographie réseau, mesure de performance et identification des failles.\n2. **Proposition technique** : Conception sur mesure (Cisco, UniFi, FortiGate). Chiffrage transparent, planning et garanties contractuelles.\n3. **Déploiement sécurisé** : Installation physique et logique avec durcissement cyber. Tests de performance complets.\n4. **Supervision continue** : Monitoring selon le contrat, maintenance proactive, rapports et support technique dédié.\n\n**Engagements contractuels :**\n\n- **Réponse à un message** : Sous 24 h ouvrées. Pour toute demande envoyée via le formulaire ou par e-mail.\n- **Diagnostic d'audit** : Sous 48 h. Après réception des informations nécessaires. Le rapport complet dépend du périmètre convenu.\n- **Intervention prioritaire** : Selon le SLA du contrat. Délais définis et signés dans le contrat de support.\n\n**Exemples de missions :** les deux exemples ci-dessous sont présentés comme des exemples de missions. Ne pas affirmer qu'il s'agit de chantiers réalisés pour des clients précis ni citer de client.\n\n### Exemple de mission : Refonte du câblage et digitalisation de complexes immobiliers\n\n*Modernisation d'infrastructure*\n\n**Le défi :** Des complexes immobiliers majeurs dotés d'un réseau hétéroclite, lent et peu fiable, freinant les outils de gestion et les points de vente.\n\n**La solution déployée :** Refonte complète du câblage réseau sur près de 50 % des infrastructures, évaluation et déploiement de logiciels de gestion (type Okoya/Immosphere), et intégration de systèmes de point de vente (POS) synchronisés en temps réel.\n\n**L'impact opérationnel :** Des opérations accélérées, des ventes fiabilisées et une infrastructure enfin maintenable, documentée et prête à croître.\n\n### Exemple de mission : Architecture de connectivité pour véhicules d'intervention\n\n*Connectivité nomade*\n\n**Le défi :** Une flotte de véhicules d'intervention sans connexion fiable en zones reculées, incapable de transmettre ses données de mission en temps réel.\n\n**La solution déployée :** Conception technique et déploiement de terminaux satellites haut débit couplés à des stations d'énergie portables, afin de maintenir une liaison opérationnelle indépendamment de l'infrastructure locale.\n\n**L'impact opérationnel :** Une flotte mieux connectée, une télémétrie plus fiable et une capacité d'intervention renforcée sur le terrain.",
      "keywords": [
        "methode",
        "phases",
        "phase",
        "audit",
        "diagnostic",
        "deploiement",
        "supervision",
        "mission",
        "missions",
        "exemple",
        "exemples",
        "cas",
        "delai",
        "delais",
        "engagement",
        "engagements"
      ]
    },
    {
      "id": "6",
      "title": "6. Oscar Mulume : parcours et formation",
      "text": "## 6. Oscar Mulume : parcours et formation\n\n- J'architecte, déploie et sécurise les infrastructures critiques d'entreprises en Afrique Centrale. De la fibre optique à la cybersécurité offensive, en passant par l'intégration d'IA — je conçois des systèmes pensés pour rester disponibles.\n- **En IT depuis** : 2021.\n- **Formation** : Licence Réseaux, Télécoms & Maintenance — ISIPA 2025.\n- **Diplôme** : Diplôme Sup. Informatique — ISIG Goma (2019-2025).\n\n**Postes actuels :**\n\n- **Responsable IT, Ingénierie & Technologies (Consultant IT)** (Févr. 2026 – Présent) — Malaïka Group — Kinshasa, RDC\n  - Pilotage de l'IT, de la cybersécurité et de l'ingénierie de 5 entités (Malaïka Group, Ranch, Travels, Le Gabriel, Chez Malaïka)\n  - Entré comme technicien réseau pour un audit d'urgence : pannes critiques rétablies, contrat groupe obtenu en un mois\n  - Durcissement des plateformes web après un incident de sécurité : scans de vulnérabilités, correctifs, pare-feu, antivirus\n  - Disponibilité de 99,9 % (Wi-Fi, PMS, contrôle d'accès), 99,5 % (POS), 99 % (Internet) ; incidents critiques traités en moins de 2 h\n  - Plan de reprise après sinistre (DRP) et sauvegardes testés ; rapports mensuels à la direction\n- **Fondateur & Consultant principal** (Mai 2026 – Présent) — M-SEC Technology Consulting — Kinshasa, RDC\n  - Évaluations de vulnérabilités, durcissement de systèmes et conseil en sécurité\n  - Applications web et mobiles sur mesure (Flutter/Dart, Supabase) avec paiement mobile\n\n- **Auparavant** : ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), et bénévolat à la Croix-Rouge RDC (2022–2024).\n\n**Compétences clés :**\n\n- Réseau et sécurité : Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, CCTV IP, Wi-Fi entreprise, durcissement, pare-feu/IDS, DRP/BCP.\n- Développement et données : Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, paiements M-Pesa, Orange Money et Flutterwave.\n- IA et cloud : AWS Bedrock, machine learning, IA générative, déploiement local d'agents open-source sous Linux.\n\n**Résultats publiés sur le portfolio :**\n\n- Chez Malaïka Group : 5 entités sécurisées, SLA de 99,9 % maintenu pour le Wi-Fi et le PMS, disponibilité POS de 99,5 %, disponibilité Internet de 99 %, incidents critiques traités en moins de 2 h.\n- Ces chiffres sont des résultats passés publiés sur le portfolio. Ils ne constituent pas une garantie universelle de M-SEC : les objectifs de disponibilité sont fixés contrat par contrat.",
      "keywords": [
        "oscar",
        "mulume",
        "parcours",
        "formation",
        "diplome",
        "experience",
        "poste",
        "postes",
        "malaika",
        "competence",
        "competences",
        "cv",
        "resultat",
        "resultats",
        "99,9",
        "99.9"
      ]
    },
    {
      "id": "7",
      "title": "7. Projets et pratique",
      "text": "## 7. Projets et pratique\n\n- **POS Pro** (En cours) — Caisse pour restaurant pensée pour fonctionner hors ligne, avec application web et déclinaisons bureau et mobile. Développement en cours, pas encore disponible en ligne.\n- **Malaika Ranch** (En ligne) — Boutique en ligne avec commande via WhatsApp. — https://malaika-ranch-web.vercel.app\n- **Site M-SEC Technology Consulting** (En ligne) — Site vitrine de M-SEC Technology Consulting : conseil IT, réseaux et cybersécurité à Kinshasa. — https://oscarmulume.github.io/msec-technology-consulting/\n- **Mosala** (En ligne) — Assistant open source de CV et de conversation pour les langues africaines, qui fonctionne hors ligne avec un modèle local (Ollama). — https://github.com/OscarMulume/nonchalant-cv ; https://dev.to/oscarmulume/mosala-a-cv-and-conversation-assistant-for-africas-languages-running-on-your-own-computer-2coc\n- **Machines Cohort & Orion** — Cohort : SSRF, accès initial puis élévation de privilèges via CVE. Orion : énumération web CraftCMS et contournement d'authentification Telnet local.\n- **Sherlocks Brutus & Investigate Web Attack** — Reconstitution de kill chains à partir de logs : brute force SSH (auth.log, wtmp, MITRE T1136), scan Nikto, brute force web et injection de commandes.\n- **Cloud privé Raspberry Pi** — Serveur de stockage personnel sur Raspberry Pi 5 avec Nextcloud, accessible à distance de façon sécurisée via Tailscale.\n\n- **Hack The Box** : pratique régulière en cybersécurité offensive ; le portfolio affiche le niveau 25.",
      "keywords": [
        "projet",
        "projets",
        "portfolio",
        "malaika",
        "mosala",
        "hack",
        "box",
        "raspberry",
        "cloud",
        "orion",
        "cohort",
        "sherlock",
        "brutus",
        "pratique",
        "niveau"
      ]
    },
    {
      "id": "8",
      "title": "8. Badges Cisco Networking Academy",
      "text": "## 8. Badges Cisco Networking Academy\n\n**Important : ce sont des badges de formation, pas des certifications professionnelles. Ne jamais dire qu'Oscar est « certifié Cisco » ni présenter un badge comme une certification.**\n\nCinq badges Cisco Networking Academy, vérifiables sur Credly :\n\n- **Ethical Hacker** — 23 octobre 2026 — https://www.credly.com/badges/bc73a9b9-0b18-423f-b230-485a61ddfcc6/public_url\n- **Junior Cybersecurity Analyst Career Path** — 20 mars 2026 — https://www.credly.com/badges/28ac05ee-4d11-4114-9c58-15cbf86c4589/public_url\n- **Networking Devices and Initial Configuration** — 17 mars 2026 — https://www.credly.com/users/oscar-mulume\n- **Networking Basics** — 4 mars 2026 — https://www.credly.com/users/oscar-mulume\n- **Introduction to Cybersecurity** — 10 juillet 2022 — https://www.credly.com/users/oscar-mulume\n\n- **Profil Credly** : https://www.credly.com/users/oscar-mulume\n- **Formation complémentaire** : Grant AI Skills & Compute Africa (juillet 2026, fine-tuning de modèles et agents autonomes) et Data Science Africa Summer School (Université Makerere), selon le site M-SEC. Aucun lien de vérification n'est fourni pour ces deux formations.\n- **Diplôme** : Licence en Sciences Informatiques — ISIPA, selon le portfolio. Aucun lien de vérification n'est fourni.",
      "keywords": [
        "badge",
        "badges",
        "cisco",
        "credly",
        "certification",
        "certifications",
        "certifie",
        "ethical",
        "hacker",
        "networking",
        "cybersecurity",
        "analyst",
        "formation"
      ]
    },
    {
      "id": "9",
      "title": "9. Ce que l'assistant ne doit jamais affirmer",
      "text": "## 9. Ce que l'assistant ne doit jamais affirmer\n\n- Aucun prix, tarif, remise, délai de livraison, nombre de clients, témoignage ou résultat non listé dans ce fichier.\n- Aucune certification professionnelle, aucun partenariat officiel, aucune accréditation ISO. Les référentiels NIST, ISO 27001, CIS, OWASP et TIA/EIA-568 sont des standards utilisés, pas des certifications obtenues.\n- Aucune garantie de disponibilité 24/7 ou de SLA universel. Le SLA dépend du contrat.\n- Ne pas dire qu'un audit complet est gratuit : seul le mini-audit initial est gratuit ; le rapport complet dépend du périmètre.\n- Ne pas dire que POS Pro est disponible ou en ligne. Ne pas dire que Herbo ou MonImmo sont lancés.\n- Ne pas donner de conseil de sécurité personnalisé comme s'il valait audit. Proposer un audit ou un échange.\n- Ne pas demander de mot de passe, clé, secret, donnée bancaire ou information sensible.\n- Ne communiquer aucun numéro de téléphone : renvoyer vers le formulaire de contact et l'e-mail.\n- Si l'information n'est pas dans ce fichier : répondre « Je n'ai pas cette information » et orienter vers le formulaire ou l'e-mail.",
      "keywords": [
        "inventer",
        "invention",
        "promesse",
        "promettre",
        "garantir",
        "garantie",
        "certification",
        "certifie",
        "prix",
        "tarif",
        "secret",
        "mot de passe",
        "telephone",
        "numero"
      ]
    },
    {
      "id": "10",
      "title": "10. Réponses canoniques",
      "text": "## 10. Réponses canoniques\n\n**Qui est Oscar Mulume ?**  \nOscar Mulume Izuba est consultant IT, architecte réseau et analyste en cybersécurité basé à Kinshasa, en RDC. Il a fondé M-SEC Technology Consulting et occupe le poste de Responsable IT, Ingénierie & Technologies chez Malaïka Group.\n\n**Que fait M-SEC ?**  \nM-SEC intervient sur quatre piliers : connectivité et infrastructure haute disponibilité, cybersécurité et vidéosurveillance, IoT/traçage/MDM, et innovation IA avec des systèmes autonomes.\n\n**Combien coûte un audit ?**  \nLe mini-audit initial est gratuit et sans engagement. Le rapport complet et les travaux sont chiffrés après définition du périmètre. Aucun prix n'est publié.\n\n**POS Pro est-il disponible ?**  \nPas encore. POS Pro est en développement et proposé via un programme pilote pour les restaurants, sous réserve de disponibilité. Il n'est pas disponible en ligne.\n\n**Oscar est-il certifié Cisco ?**  \nIl détient cinq badges Cisco Networking Academy vérifiables sur Credly. Ce sont des badges de formation, pas des certifications professionnelles : il ne faut pas le présenter comme « certifié Cisco ».\n\n**Où intervient Oscar ?**  \nIl est basé à Kinshasa et intervient à Kinshasa, Goma, Bukavu, en Afrique centrale et à distance, selon la mission.\n\n**Comment demander un devis ?**  \nUtiliser le formulaire de contact du site M-SEC, écrire à oscarmulume1612@gmail.com. L'assistant peut aussi recueillir un nom, un e-mail ou un numéro WhatsApp, et le besoin.\n\n**M-SEC garantit-il 99,9 % de disponibilité ?**  \nNon, aucune garantie universelle n'est publiée. Les objectifs de disponibilité sont définis contrat par contrat. Le chiffre de 99,9 % est un résultat passé chez Malaïka Group, pas une promesse générale de M-SEC.",
      "keywords": [
        "qui",
        "quoi",
        "combien",
        "disponible",
        "devis",
        "capitale",
        "intervient",
        "garantit",
        "coute",
        "fait"
      ]
    }
  ],
  "en": [
    {
      "id": "1",
      "title": "1. Identity and contact details",
      "text": "## 1. Identity and contact details\n\n- **Public name**: Oscar Mulume (legal name: MULUME IZUBA OSCAR).\n- **Role**: IT infrastructure · Networks · Cybersecurity · Development.\n- **Company**: M-SEC Technology Consulting, also called **M-SEC** (for Mulume Security). IT, network and cybersecurity engineering firm. Infrastructure, connectivity and security for businesses in Central Africa.\n- **M-SEC website**: https://oscarmulume.github.io/msec-technology-consulting/\n- **Portfolio**: https://oscarmulume.github.io/\n- **Email**: oscarmulume1612@gmail.com\n- **LinkedIn**: https://www.linkedin.com/in/oscar-mulume-95666b225/\n- **GitHub**: https://github.com/OscarMulume\n- **Based in**: Kinshasa, DR Congo.\n- **Service area**: Kinshasa, Goma, Bukavu (DR Congo); Central Africa; Remote / on-site.\n- **Languages**: French (native/bilingual), English (professional/technical), Swahili (professional), Lingala (intermediate).\n- **Availability**: Available — Central Africa.",
      "always": true,
      "keywords": []
    },
    {
      "id": "2",
      "title": "2. M-SEC at a glance",
      "text": "## 2. M-SEC at a glance\n\n- IT infrastructure and security serving your company's performance.\n- A network outage or a security vulnerability can be costly for a business. We combine network engineering, software development and cybersecurity to build environments that are more resilient, documented and maintainable.\n- We apply the principle of security by design. Every cable installed, every access point configured and every database deployed includes documented hardening rules, to reduce risk and simplify maintenance.\n- Our architectures rely on enterprise standards: Cisco, UniFi, FortiGate. We favour verifiable choices, clear pricing and documentation delivered at every stage.\n- **Four pillars**: connectivity and infrastructure, cybersecurity and video surveillance, IoT/tracking/MDM, and AI innovation with autonomous systems.\n- **Published commitments**: reply to a message within 24 business hours; audit diagnosis within 48 hours after receiving the required information; priority response according to the contract SLA.\n- **Pricing**: no prices are published. A quote is prepared after scoping the need. The initial mini-audit is free and without commitment; the full report depends on the agreed scope. The POS Pro pilot is offered subject to availability.\n- **SLA**: availability targets are set contract by contract. No 24/7 availability is promised without a contract.",
      "keywords": [
        "m-sec",
        "msec",
        "company",
        "business",
        "pillar",
        "pillars",
        "pricing",
        "price",
        "prices",
        "cost",
        "sla",
        "availability",
        "commitment",
        "commitments",
        "guarantee",
        "quote",
        "audit",
        "diagnosis"
      ]
    },
    {
      "id": "3",
      "title": "3. M-SEC services",
      "text": "## 3. M-SEC services\n\n### Connectivity & high-availability infrastructure\n\nStarlink links, UniFi networks, FortiGate NGFW firewalls and Yeastar telephony: an architecture designed to reduce downtime and simplify recovery.\n\n**What we deliver :**\n\n- **Starlink links** : High-speed satellite terminals with automatic failover where site configuration allows, for isolated sites or mobile fleets.\n- **Centrally managed UniFi networks** : Enterprise Wi-Fi and switches with captive portal, VLANs and unified supervision.\n- **FortiGate NGFW firewalls** : Next-generation network security integrated into the connectivity layer.\n- **Yeastar telephony** : Unified professional IP telephony: calls, conferences and integration with business tools.\n- **Redundant links** : Fibre, satellite and 4G/5G combined per site, with a documented and tested failover procedure.\n\n**Benefit :** Stronger business continuity: redundant links, supervision and documented failover procedures.\n\n**Technologies :** Starlink Business, FortiGate, UniFi, Yeastar, Cisco\n\n### Cybersecurity & video surveillance\n\nProtection for your digital and physical assets: network security, IP video surveillance (Hikvision, Dahua) and supervised penetration tests.\n\n**What we deliver :**\n\n- **FortiGate NGFW firewalls** : IPS, application filtering and VPN to protect your perimeter.\n- **Hikvision / Dahua IP video surveillance** : High-definition cameras with assisted detection, night vision and secure remote access.\n- **Supervised penetration tests** : Ethical tests carried out within a contractual scope to identify and fix vulnerabilities.\n- **Hardening** : Systematic hardening of equipment and removal of default access.\n- **VLAN segmentation & recovery plan** : Separation of video and business networks, with a documented business recovery plan.\n\n**Benefit :** Better-protected assets and premises, with private video streams and a segmented network.\n\n**Technologies :** FortiGate, Hikvision, Dahua, NIST, ISO 27001, OWASP\n\n### IoT, tracking & MDM\n\nFleet geolocation, mobile device management (MDM) and IoT sensors: real-time visibility over your operations.\n\n**What we deliver :**\n\n- **Fleet geolocation** : GPS vehicle tracking, history, geofence alerts and usage reports.\n- **Device management (MDM)** : Remote configuration, security and supervision of professional smartphones and tablets.\n- **IoT sensors** : Telemetry, temperature and energy: connect and manage your physical equipment.\n- **Alerts & reports** : Configurable notifications and usage reports to support your decisions.\n- **Integration & API** : Connection with your existing business software for a single, reliable source of data.\n\n**Benefit :** Real-time visibility over your fleets and devices, with configurable alerts.\n\n**Technologies :** GPS/GNSS, MDM, MQTT, REST API, LoRaWAN\n\n### AI innovation & autonomous systems\n\nLocal deployment of open-source AI agents (Hermes Agent, OpenCode AI) on Linux to automate your operations while keeping control of your data.\n\n**What we deliver :**\n\n- **Open-source AI agents** : Local deployment of Hermes Agent and OpenCode AI to run complex tasks autonomously.\n- **Fine-tuning & custom models** : Adaptation of language models to your company's specific needs.\n- **Operations automation** : Self-managed scripts, pipelines and workflows, without systematic cloud dependency.\n- **Linux environment** : Controlled Linux infrastructure: security, control and documented costs.\n- **Supervision & maintenance** : Agent monitoring, model versioning and regular activity reports.\n\n**Benefit :** Local automation of your processes, with data hosted according to your choice.\n\n**Technologies :** Hermes Agent, OpenCode AI, Linux, Python, Ollama",
      "keywords": [
        "service",
        "services",
        "offer",
        "connectivity",
        "network",
        "networks",
        "wifi",
        "wi-fi",
        "starlink",
        "unifi",
        "fortigate",
        "firewall",
        "telephony",
        "yeastar",
        "cybersecurity",
        "security",
        "video",
        "surveillance",
        "camera",
        "cameras",
        "hikvision",
        "dahua",
        "pentest",
        "penetration",
        "intrusion",
        "iot",
        "tracking",
        "mdm",
        "geolocation",
        "fleet",
        "fleets",
        "agent",
        "agents",
        "ai",
        "automation",
        "linux",
        "hermes",
        "opencode"
      ]
    },
    {
      "id": "4",
      "title": "4. M-SEC products",
      "text": "## 4. M-SEC products\n\n- **POS Pro** (Restaurant point of sale, Pilot programme open): Offline point of sale for restaurants: CDF and USD payments, sales tracking and support for mobile money in DR Congo (M-Pesa, Airtel Money, Orange Money, Afrimoney).\n- **Herbo** (Online shop, Coming soon): An online shop for traditional medicines in preparation, with product pages and traceability.\n- **MonImmo** (Real estate, Coming soon): A real estate platform in preparation to present and manage properties.\n\n- **POS Pro is not online yet.** Development is ongoing; the pilot programme is aimed at restaurants in Kinshasa, subject to availability and after validating the need. No price is published.\n- **Herbo** and **MonImmo** are in preparation: do not present them as launched or available.",
      "keywords": [
        "product",
        "products",
        "pos",
        "pos pro",
        "cash",
        "register",
        "restaurant",
        "restaurants",
        "herbo",
        "monimmo",
        "shop",
        "real estate",
        "pilot"
      ]
    },
    {
      "id": "5",
      "title": "5. Method, commitments and example missions",
      "text": "## 5. Method, commitments and example missions\n\n**Four-phase method:**\n\n1. **Audit & analysis**: Assessment of your vulnerabilities. Network mapping, performance measurement and identification of weaknesses.\n2. **Technical proposal**: Custom design (Cisco, UniFi, FortiGate). Transparent pricing, schedule and contractual guarantees.\n3. **Secure deployment**: Physical and logical installation with cybersecurity hardening. Full performance testing.\n4. **Continuous supervision**: Monitoring according to the contract, proactive maintenance, reports and dedicated technical support.\n\n**Contractual commitments:**\n\n- **Reply to a message**: Within 24 business hours. For any request sent through the form or by email.\n- **Audit diagnosis**: Within 48 hours. After receiving the necessary information. The full report depends on the agreed scope.\n- **Priority response**: According to the contract SLA. Timelines defined and signed in the support contract.\n\n**Example missions:** the two examples below are presented as example missions. Do not claim they are completed projects for specific clients and never name a client.\n\n### Example mission : Rewiring and digitalisation of real estate complexes\n\n*Infrastructure modernisation*\n\n**The challenge :** Major real estate complexes with a heterogeneous, slow and unreliable network, holding back management tools and points of sale.\n\n**The solution :** Complete rewiring of nearly 50% of the network infrastructure, evaluation and deployment of management software (Okoya/Immosphere type), and integration of point-of-sale systems synchronised in real time.\n\n**Operational impact :** Faster operations, more reliable sales and infrastructure that is finally maintainable, documented and ready to grow.\n\n### Example mission : Connectivity architecture for response vehicles\n\n*Mobile connectivity*\n\n**The challenge :** A fleet of response vehicles without reliable connectivity in remote areas, unable to transmit mission data in real time.\n\n**The solution :** Technical design and deployment of high-speed satellite terminals combined with portable power stations, to maintain an operational link independently of local infrastructure.\n\n**Operational impact :** A better-connected fleet, more reliable telemetry and enhanced field response capacity.",
      "keywords": [
        "method",
        "phase",
        "phases",
        "audit",
        "diagnosis",
        "deployment",
        "monitoring",
        "mission",
        "missions",
        "example",
        "examples",
        "case",
        "deadline",
        "commitment",
        "commitments"
      ]
    },
    {
      "id": "6",
      "title": "6. Oscar Mulume: background and education",
      "text": "## 6. Oscar Mulume: background and education\n\n- I design, deploy and secure critical business infrastructure in Central Africa. From fibre optics to offensive cybersecurity and AI integration, I build systems designed to stay available.\n- **In IT since**: 2021.\n- **Education**: Bachelor’s degree in Networks, Telecommunications & Maintenance — ISIPA, 2025.\n- **Diploma**: Higher diploma in Computer Science — ISIG Goma, 2019–2025.\n\n**Current roles:**\n\n- **Head of IT, Engineering & Technology (IT Consultant)** (February 2026 – present) — Malaïka Group — Kinshasa, DR Congo\n  - Leads IT, cybersecurity and engineering for 5 entities (Malaïka Group, Ranch, Travels, Le Gabriel, Chez Malaïka).\n  - Hardened web platforms after a security incident: vulnerability scans, patches, firewall and antivirus.\n  - Maintained 99.9% availability for Wi-Fi, PMS and access control, 99.5% for POS and 99% for Internet; critical incidents handled in under 2 hours.\n  - Tested disaster recovery and backup plans; delivered monthly reports to management.\n- **Founder & Principal Consultant** (May 2026 – present) — M-SEC Technology Consulting — Kinshasa, DR Congo\n  - Vulnerability assessments, system hardening and security consulting.\n  - Custom web and mobile applications (Flutter/Dart, Supabase) with mobile money payments.\n\n- **Previously**: ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), and volunteer work with the Red Cross DRC (2022–2024).\n\n**Key skills:**\n\n- Network and security: Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, IP CCTV, enterprise Wi-Fi, hardening, firewall/IDS, DRP/BCP.\n- Development and data: Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, M-Pesa, Orange Money and Flutterwave payments.\n- AI and cloud: AWS Bedrock, machine learning, generative AI, local deployment of open-source agents on Linux.\n\n**Results published on the portfolio:**\n\n- At Malaïka Group: 5 entities secured, 99.9% SLA maintained for Wi-Fi and PMS, 99.5% POS availability, 99% Internet availability, critical incidents handled in under 2 hours.\n- The 99.9% SLA, 99.5% POS availability and 99% Internet availability are past results at Malaïka Group published on the portfolio. They are not a universal M-SEC guarantee; M-SEC availability targets are set contract by contract.",
      "keywords": [
        "oscar",
        "mulume",
        "background",
        "education",
        "degree",
        "diploma",
        "experience",
        "role",
        "roles",
        "malaika",
        "skills",
        "cv",
        "result",
        "results",
        "99.9"
      ]
    },
    {
      "id": "7",
      "title": "7. Projects and practice",
      "text": "## 7. Projects and practice\n\n- **POS Pro** (In progress) — Restaurant point-of-sale designed to work offline, with web, desktop and mobile versions. Development is ongoing and it is not yet available online.\n- **Malaika Ranch** (Online) — Online shop with ordering through WhatsApp. — https://malaika-ranch-web.vercel.app\n- **M-SEC Technology Consulting website** (Online) — M-SEC Technology Consulting website: IT consulting, networks and cybersecurity in Kinshasa. — https://oscarmulume.github.io/msec-technology-consulting/\n- **Mosala** (Online) — Open-source CV and conversation assistant for African languages. It works offline with a local model (Ollama). — https://github.com/OscarMulume/nonchalant-cv ; https://dev.to/oscarmulume/mosala-a-cv-and-conversation-assistant-for-africas-languages-running-on-your-own-computer-2coc\n- **Cohort & Orion machines** — Cohort: SSRF, initial access then privilege escalation through a CVE. Orion: CraftCMS web enumeration and local Telnet authentication bypass.\n- **Brutus & Investigate Web Attack Sherlocks** — Reconstructing kill chains from logs: SSH brute force (auth.log, wtmp, MITRE T1136), Nikto scanning, web brute force and command injection.\n- **Raspberry Pi private cloud** — Personal storage server on a Raspberry Pi 5 with Nextcloud, securely reachable remotely through Tailscale.\n\n- **Hack The Box**: regular offensive cybersecurity practice; the portfolio displays level 25.",
      "keywords": [
        "project",
        "projects",
        "portfolio",
        "malaika",
        "mosala",
        "hack",
        "box",
        "raspberry",
        "cloud",
        "orion",
        "cohort",
        "sherlock",
        "brutus",
        "practice",
        "level"
      ]
    },
    {
      "id": "8",
      "title": "8. Cisco Networking Academy badges",
      "text": "## 8. Cisco Networking Academy badges\n\n**Important: these are training badges, not professional certifications. Never say Oscar is “Cisco certified” or present a badge as a certification.**\n\nFive Cisco Networking Academy badges, verifiable on Credly:\n\n- **Ethical Hacker** — October 23, 2026 — https://www.credly.com/badges/bc73a9b9-0b18-423f-b230-485a61ddfcc6/public_url\n- **Junior Cybersecurity Analyst Career Path** — March 20, 2026 — https://www.credly.com/badges/28ac05ee-4d11-4114-9c58-15cbf86c4589/public_url\n- **Networking Devices and Initial Configuration** — March 17, 2026 — https://www.credly.com/users/oscar-mulume\n- **Networking Basics** — March 4, 2026 — https://www.credly.com/users/oscar-mulume\n- **Introduction to Cybersecurity** — July 10, 2022 — https://www.credly.com/users/oscar-mulume\n\n- **Credly profile**: https://www.credly.com/users/oscar-mulume\n- **Additional training**: Grant AI Skills & Compute Africa (July 2026, fine-tuning language models and autonomous agents) and the Data Science Africa Summer School (Makerere University), according to the M-SEC website. No verification link is provided for these two programmes.\n- **Degree**: Bachelor’s degree in Computer Science — ISIPA, according to the portfolio. No verification link is provided.",
      "keywords": [
        "badge",
        "badges",
        "cisco",
        "credly",
        "certification",
        "certifications",
        "certified",
        "ethical",
        "hacker",
        "networking",
        "cybersecurity",
        "analyst",
        "training"
      ]
    },
    {
      "id": "9",
      "title": "9. What the assistant must never claim",
      "text": "## 9. What the assistant must never claim\n\n- No price, rate, discount, delivery time, client count, testimonial or result that is not listed in this file.\n- No professional certification, official partnership or ISO accreditation. NIST, ISO 27001, CIS, OWASP and TIA/EIA-568 are standards that may be used, not certifications obtained.\n- No guarantee of 24/7 availability or a universal SLA. The SLA depends on the contract.\n- Do not say a full audit is free: only the initial mini-audit is free; the full report depends on the scope.\n- Do not say POS Pro is available or online. Do not say Herbo or MonImmo have launched.\n- Do not give personalised security advice as if it were an audit. Offer an audit or a conversation.\n- Do not ask for passwords, keys, secrets, banking details or sensitive information.\n- Never give out a phone number: point to the contact form and email.\n- If the information is not in this file: answer “I don’t have that information” and point to the form or email.",
      "keywords": [
        "invent",
        "invention",
        "promise",
        "guarantee",
        "certification",
        "certified",
        "price",
        "pricing",
        "secret",
        "password",
        "phone",
        "number"
      ]
    },
    {
      "id": "10",
      "title": "10. Canonical answers",
      "text": "## 10. Canonical answers\n\n**Who is Oscar Mulume?**  \nOscar Mulume Izuba is an IT consultant, network architect and cybersecurity analyst based in Kinshasa, DR Congo. He founded M-SEC Technology Consulting and works as Head of IT, Engineering & Technology at Malaïka Group.\n\n**What does M-SEC do?**  \nM-SEC covers four areas: connectivity and high-availability infrastructure, cybersecurity and video surveillance, IoT/tracking/MDM, and AI innovation with autonomous systems.\n\n**How much does an audit cost?**  \nThe initial mini-audit is free and without commitment. The full report and any implementation work are quoted after defining the scope. No price is published.\n\n**Is POS Pro available?**  \nNot yet. POS Pro is in development and offered through a pilot programme for restaurants, subject to availability. It is not available online.\n\n**Is Oscar Cisco certified?**  \nHe holds five Cisco Networking Academy badges, verifiable on Credly. These are training badges, not professional certifications, so he should not be described as “Cisco certified”.\n\n**Where does Oscar work?**  \nHe is based in Kinshasa and works in Kinshasa, Goma, Bukavu, across Central Africa, and remotely, depending on the assignment.\n\n**How can I request a quote?**  \nUse the contact form on the M-SEC site or email oscarmulume1612@gmail.com. The assistant can also collect a name, an email or WhatsApp number, and the need.\n\n**Does M-SEC guarantee 99.9% availability?**  \nNo universal guarantee is published. Availability targets are defined contract by contract. The 99.9% figure is a past result at Malaïka Group, not a blanket M-SEC promise.",
      "keywords": [
        "who",
        "what",
        "how",
        "much",
        "available",
        "quote",
        "capital",
        "work",
        "guarantee",
        "cost"
      ]
    }
  ]
};

export const APP_KNOWLEDGE: Partial<Record<string, { fr: KnowledgeSection[]; en: KnowledgeSection[] }>> = {
  "portfolio": {
    "fr": [
      {
        "id": "1",
        "title": "1. Identité et coordonnées",
        "text": "## 1. Identité et coordonnées\n\n- **Nom public** : Oscar Mulume (nom légal : MULUME IZUBA OSCAR).\n- **Rôle** : Infrastructure IT · Réseaux · Cybersécurité · Développement.\n- **Entreprise** : M-SEC Technology Consulting, aussi appelée **M-SEC** (pour Mulume Security). Cabinet d'ingénierie IT, réseaux et cybersécurité. Infrastructure, connectivité et sécurité au service des entreprises d'Afrique centrale.\n- **Site M-SEC** : https://oscarmulume.github.io/msec-technology-consulting/\n- **Portfolio** : https://oscarmulume.github.io/\n- **E-mail** : oscarmulume1612@gmail.com\n- **LinkedIn** : https://www.linkedin.com/in/oscar-mulume-95666b225/\n- **GitHub** : https://github.com/OscarMulume\n- **Basé à** : Kinshasa, RDC — Afrique Centrale.\n- **Zone d'intervention** : Kinshasa, Goma, Bukavu ; Afrique Centrale ; Remote / Sur site.\n- **Langues** : Français (natif/bilingue), Anglais (pro/technique), Swahili (pro), Lingala (intermédiaire).\n- **Disponibilité** : Disponible — Afrique Centrale.",
        "keywords": [],
        "always": true
      },
      {
        "id": "6",
        "title": "6. Oscar Mulume : parcours et formation",
        "text": "## 6. Oscar Mulume : parcours et formation\n\n- J'architecte, déploie et sécurise les infrastructures critiques d'entreprises en Afrique Centrale. De la fibre optique à la cybersécurité offensive, en passant par l'intégration d'IA — je conçois des systèmes pensés pour rester disponibles.\n- **En IT depuis** : 2021.\n- **Formation** : Licence Réseaux, Télécoms & Maintenance — ISIPA 2025.\n- **Diplôme** : Diplôme Sup. Informatique — ISIG Goma (2019-2025).\n\n**Postes actuels :**\n\n- **Responsable IT, Ingénierie & Technologies (Consultant IT)** (Févr. 2026 – Présent) — Malaïka Group — Kinshasa, RDC\n  - Pilotage de l'IT, de la cybersécurité et de l'ingénierie de 5 entités (Malaïka Group, Ranch, Travels, Le Gabriel, Chez Malaïka)\n  - Entré comme technicien réseau pour un audit d'urgence : pannes critiques rétablies, contrat groupe obtenu en un mois\n  - Durcissement des plateformes web après un incident de sécurité : scans de vulnérabilités, correctifs, pare-feu, antivirus\n  - Disponibilité de 99,9 % (Wi-Fi, PMS, contrôle d'accès), 99,5 % (POS), 99 % (Internet) ; incidents critiques traités en moins de 2 h\n  - Plan de reprise après sinistre (DRP) et sauvegardes testés ; rapports mensuels à la direction\n- **Fondateur & Consultant principal** (Mai 2026 – Présent) — M-SEC Technology Consulting — Kinshasa, RDC\n  - Évaluations de vulnérabilités, durcissement de systèmes et conseil en sécurité\n  - Applications web et mobiles sur mesure (Flutter/Dart, Supabase) avec paiement mobile\n\n- **Auparavant** : ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), et bénévolat à la Croix-Rouge RDC (2022–2024).\n\n**Compétences clés :**\n\n- Réseau et sécurité : Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, CCTV IP, Wi-Fi entreprise, durcissement, pare-feu/IDS, DRP/BCP.\n- Développement et données : Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, paiements M-Pesa, Orange Money et Flutterwave.\n- IA et cloud : AWS Bedrock, machine learning, IA générative, déploiement local d'agents open-source sous Linux.\n\n**Résultats publiés sur le portfolio :**\n\n- Chez Malaïka Group : 5 entités sécurisées, SLA de 99,9 % maintenu pour le Wi-Fi et le PMS, disponibilité POS de 99,5 %, disponibilité Internet de 99 %, incidents critiques traités en moins de 2 h.\n- Ces chiffres sont des résultats passés publiés sur le portfolio. Ils ne constituent pas une garantie universelle de M-SEC : les objectifs de disponibilité sont fixés contrat par contrat.",
        "keywords": [
          "oscar",
          "mulume",
          "parcours",
          "formation",
          "diplome",
          "experience",
          "poste",
          "postes",
          "malaika",
          "competence",
          "competences",
          "cv",
          "resultat",
          "resultats",
          "99,9",
          "99.9"
        ]
      },
      {
        "id": "7",
        "title": "7. Projets et pratique",
        "text": "## 7. Projets et pratique\n\n- **POS Pro** (En cours) — Caisse pour restaurant pensée pour fonctionner hors ligne, avec application web et déclinaisons bureau et mobile. Développement en cours, pas encore disponible en ligne.\n- **Malaika Ranch** (En ligne) — Boutique en ligne avec commande via WhatsApp. — https://malaika-ranch-web.vercel.app\n- **Site M-SEC Technology Consulting** (En ligne) — Site vitrine de M-SEC Technology Consulting : conseil IT, réseaux et cybersécurité à Kinshasa. — https://oscarmulume.github.io/msec-technology-consulting/\n- **Mosala** (En ligne) — Assistant open source de CV et de conversation pour les langues africaines, qui fonctionne hors ligne avec un modèle local (Ollama). — https://github.com/OscarMulume/nonchalant-cv ; https://dev.to/oscarmulume/mosala-a-cv-and-conversation-assistant-for-africas-languages-running-on-your-own-computer-2coc\n- **Machines Cohort & Orion** — Cohort : SSRF, accès initial puis élévation de privilèges via CVE. Orion : énumération web CraftCMS et contournement d'authentification Telnet local.\n- **Sherlocks Brutus & Investigate Web Attack** — Reconstitution de kill chains à partir de logs : brute force SSH (auth.log, wtmp, MITRE T1136), scan Nikto, brute force web et injection de commandes.\n- **Cloud privé Raspberry Pi** — Serveur de stockage personnel sur Raspberry Pi 5 avec Nextcloud, accessible à distance de façon sécurisée via Tailscale.\n\n- **Hack The Box** : pratique régulière en cybersécurité offensive ; le portfolio affiche le niveau 25.",
        "keywords": [
          "projet",
          "projets",
          "portfolio",
          "malaika",
          "mosala",
          "hack",
          "box",
          "raspberry",
          "cloud",
          "orion",
          "cohort",
          "sherlock",
          "brutus",
          "pratique",
          "niveau"
        ]
      },
      {
        "id": "8",
        "title": "8. Badges Cisco Networking Academy",
        "text": "## 8. Badges Cisco Networking Academy\n\n**Important : ce sont des badges de formation, pas des certifications professionnelles. Ne jamais dire qu'Oscar est « certifié Cisco » ni présenter un badge comme une certification.**\n\nCinq badges Cisco Networking Academy, vérifiables sur Credly :\n\n- **Ethical Hacker** — 23 octobre 2026 — https://www.credly.com/badges/bc73a9b9-0b18-423f-b230-485a61ddfcc6/public_url\n- **Junior Cybersecurity Analyst Career Path** — 20 mars 2026 — https://www.credly.com/badges/28ac05ee-4d11-4114-9c58-15cbf86c4589/public_url\n- **Networking Devices and Initial Configuration** — 17 mars 2026 — https://www.credly.com/users/oscar-mulume\n- **Networking Basics** — 4 mars 2026 — https://www.credly.com/users/oscar-mulume\n- **Introduction to Cybersecurity** — 10 juillet 2022 — https://www.credly.com/users/oscar-mulume\n\n- **Profil Credly** : https://www.credly.com/users/oscar-mulume\n- **Formation complémentaire** : Grant AI Skills & Compute Africa (juillet 2026, fine-tuning de modèles et agents autonomes) et Data Science Africa Summer School (Université Makerere), selon le site M-SEC. Aucun lien de vérification n'est fourni pour ces deux formations.\n- **Diplôme** : Licence en Sciences Informatiques — ISIPA, selon le portfolio. Aucun lien de vérification n'est fourni.",
        "keywords": [
          "badge",
          "badges",
          "cisco",
          "credly",
          "certification",
          "certifications",
          "certifie",
          "ethical",
          "hacker",
          "networking",
          "cybersecurity",
          "analyst",
          "formation"
        ]
      },
      {
        "id": "9",
        "title": "9. Ce que l'assistant ne doit jamais affirmer",
        "text": "## 9. Ce que l'assistant ne doit jamais affirmer\n\n- Aucun prix, tarif, remise, délai de livraison, nombre de clients, témoignage ou résultat non listé dans ce fichier.\n- Aucune certification professionnelle, aucun partenariat officiel, aucune accréditation ISO. Les référentiels NIST, ISO 27001, CIS, OWASP et TIA/EIA-568 sont des standards utilisés, pas des certifications obtenues.\n- Aucune garantie de disponibilité 24/7 ou de SLA universel. Le SLA dépend du contrat.\n- Ne pas dire qu'un audit complet est gratuit : seul le mini-audit initial est gratuit ; le rapport complet dépend du périmètre.\n- Ne pas dire que POS Pro est disponible ou en ligne. Ne pas dire que Herbo ou MonImmo sont lancés.\n- Ne pas donner de conseil de sécurité personnalisé comme s'il valait audit. Proposer un audit ou un échange.\n- Ne pas demander de mot de passe, clé, secret, donnée bancaire ou information sensible.\n- Ne communiquer aucun numéro de téléphone : renvoyer vers le formulaire de contact et l'e-mail.\n- Si l'information n'est pas dans ce fichier : répondre « Je n'ai pas cette information » et orienter vers le formulaire ou l'e-mail.",
        "keywords": [
          "inventer",
          "invention",
          "promesse",
          "promettre",
          "garantir",
          "garantie",
          "certification",
          "certifie",
          "prix",
          "tarif",
          "secret",
          "mot de passe",
          "telephone",
          "numero"
        ]
      }
    ],
    "en": [
      {
        "id": "1",
        "title": "1. Identity and contact details",
        "text": "## 1. Identity and contact details\n\n- **Public name**: Oscar Mulume (legal name: MULUME IZUBA OSCAR).\n- **Role**: IT infrastructure · Networks · Cybersecurity · Development.\n- **Company**: M-SEC Technology Consulting, also called **M-SEC** (for Mulume Security). IT, network and cybersecurity engineering firm. Infrastructure, connectivity and security for businesses in Central Africa.\n- **M-SEC website**: https://oscarmulume.github.io/msec-technology-consulting/\n- **Portfolio**: https://oscarmulume.github.io/\n- **Email**: oscarmulume1612@gmail.com\n- **LinkedIn**: https://www.linkedin.com/in/oscar-mulume-95666b225/\n- **GitHub**: https://github.com/OscarMulume\n- **Based in**: Kinshasa, DR Congo.\n- **Service area**: Kinshasa, Goma, Bukavu (DR Congo); Central Africa; Remote / on-site.\n- **Languages**: French (native/bilingual), English (professional/technical), Swahili (professional), Lingala (intermediate).\n- **Availability**: Available — Central Africa.",
        "keywords": [],
        "always": true
      },
      {
        "id": "6",
        "title": "6. Oscar Mulume: background and education",
        "text": "## 6. Oscar Mulume: background and education\n\n- I design, deploy and secure critical business infrastructure in Central Africa. From fibre optics to offensive cybersecurity and AI integration, I build systems designed to stay available.\n- **In IT since**: 2021.\n- **Education**: Bachelor’s degree in Networks, Telecommunications & Maintenance — ISIPA, 2025.\n- **Diploma**: Higher diploma in Computer Science — ISIG Goma, 2019–2025.\n\n**Current roles:**\n\n- **Head of IT, Engineering & Technology (IT Consultant)** (February 2026 – present) — Malaïka Group — Kinshasa, DR Congo\n  - Leads IT, cybersecurity and engineering for 5 entities (Malaïka Group, Ranch, Travels, Le Gabriel, Chez Malaïka).\n  - Hardened web platforms after a security incident: vulnerability scans, patches, firewall and antivirus.\n  - Maintained 99.9% availability for Wi-Fi, PMS and access control, 99.5% for POS and 99% for Internet; critical incidents handled in under 2 hours.\n  - Tested disaster recovery and backup plans; delivered monthly reports to management.\n- **Founder & Principal Consultant** (May 2026 – present) — M-SEC Technology Consulting — Kinshasa, DR Congo\n  - Vulnerability assessments, system hardening and security consulting.\n  - Custom web and mobile applications (Flutter/Dart, Supabase) with mobile money payments.\n\n- **Previously**: ALOM Services (2024–2025), Genocost (2024), Canalbox / Group Vivendi Africa (2022), Hima Cement / LafargeHolcim (2021), and volunteer work with the Red Cross DRC (2022–2024).\n\n**Key skills:**\n\n- Network and security: Cisco IOS, fibre FTTH, Starlink Business, UniFi, FortiGate, IP CCTV, enterprise Wi-Fi, hardening, firewall/IDS, DRP/BCP.\n- Development and data: Flutter/Dart, Python, JavaScript, Supabase, PostgreSQL, MySQL, MongoDB, M-Pesa, Orange Money and Flutterwave payments.\n- AI and cloud: AWS Bedrock, machine learning, generative AI, local deployment of open-source agents on Linux.\n\n**Results published on the portfolio:**\n\n- At Malaïka Group: 5 entities secured, 99.9% SLA maintained for Wi-Fi and PMS, 99.5% POS availability, 99% Internet availability, critical incidents handled in under 2 hours.\n- The 99.9% SLA, 99.5% POS availability and 99% Internet availability are past results at Malaïka Group published on the portfolio. They are not a universal M-SEC guarantee; M-SEC availability targets are set contract by contract.",
        "keywords": [
          "oscar",
          "mulume",
          "background",
          "education",
          "degree",
          "diploma",
          "experience",
          "role",
          "roles",
          "malaika",
          "skills",
          "cv",
          "result",
          "results",
          "99.9"
        ]
      },
      {
        "id": "7",
        "title": "7. Projects and practice",
        "text": "## 7. Projects and practice\n\n- **POS Pro** (In progress) — Restaurant point-of-sale designed to work offline, with web, desktop and mobile versions. Development is ongoing and it is not yet available online.\n- **Malaika Ranch** (Online) — Online shop with ordering through WhatsApp. — https://malaika-ranch-web.vercel.app\n- **M-SEC Technology Consulting website** (Online) — M-SEC Technology Consulting website: IT consulting, networks and cybersecurity in Kinshasa. — https://oscarmulume.github.io/msec-technology-consulting/\n- **Mosala** (Online) — Open-source CV and conversation assistant for African languages. It works offline with a local model (Ollama). — https://github.com/OscarMulume/nonchalant-cv ; https://dev.to/oscarmulume/mosala-a-cv-and-conversation-assistant-for-africas-languages-running-on-your-own-computer-2coc\n- **Cohort & Orion machines** — Cohort: SSRF, initial access then privilege escalation through a CVE. Orion: CraftCMS web enumeration and local Telnet authentication bypass.\n- **Brutus & Investigate Web Attack Sherlocks** — Reconstructing kill chains from logs: SSH brute force (auth.log, wtmp, MITRE T1136), Nikto scanning, web brute force and command injection.\n- **Raspberry Pi private cloud** — Personal storage server on a Raspberry Pi 5 with Nextcloud, securely reachable remotely through Tailscale.\n\n- **Hack The Box**: regular offensive cybersecurity practice; the portfolio displays level 25.",
        "keywords": [
          "project",
          "projects",
          "portfolio",
          "malaika",
          "mosala",
          "hack",
          "box",
          "raspberry",
          "cloud",
          "orion",
          "cohort",
          "sherlock",
          "brutus",
          "practice",
          "level"
        ]
      },
      {
        "id": "8",
        "title": "8. Cisco Networking Academy badges",
        "text": "## 8. Cisco Networking Academy badges\n\n**Important: these are training badges, not professional certifications. Never say Oscar is “Cisco certified” or present a badge as a certification.**\n\nFive Cisco Networking Academy badges, verifiable on Credly:\n\n- **Ethical Hacker** — October 23, 2026 — https://www.credly.com/badges/bc73a9b9-0b18-423f-b230-485a61ddfcc6/public_url\n- **Junior Cybersecurity Analyst Career Path** — March 20, 2026 — https://www.credly.com/badges/28ac05ee-4d11-4114-9c58-15cbf86c4589/public_url\n- **Networking Devices and Initial Configuration** — March 17, 2026 — https://www.credly.com/users/oscar-mulume\n- **Networking Basics** — March 4, 2026 — https://www.credly.com/users/oscar-mulume\n- **Introduction to Cybersecurity** — July 10, 2022 — https://www.credly.com/users/oscar-mulume\n\n- **Credly profile**: https://www.credly.com/users/oscar-mulume\n- **Additional training**: Grant AI Skills & Compute Africa (July 2026, fine-tuning language models and autonomous agents) and the Data Science Africa Summer School (Makerere University), according to the M-SEC website. No verification link is provided for these two programmes.\n- **Degree**: Bachelor’s degree in Computer Science — ISIPA, according to the portfolio. No verification link is provided.",
        "keywords": [
          "badge",
          "badges",
          "cisco",
          "credly",
          "certification",
          "certifications",
          "certified",
          "ethical",
          "hacker",
          "networking",
          "cybersecurity",
          "analyst",
          "training"
        ]
      },
      {
        "id": "9",
        "title": "9. What the assistant must never claim",
        "text": "## 9. What the assistant must never claim\n\n- No price, rate, discount, delivery time, client count, testimonial or result that is not listed in this file.\n- No professional certification, official partnership or ISO accreditation. NIST, ISO 27001, CIS, OWASP and TIA/EIA-568 are standards that may be used, not certifications obtained.\n- No guarantee of 24/7 availability or a universal SLA. The SLA depends on the contract.\n- Do not say a full audit is free: only the initial mini-audit is free; the full report depends on the scope.\n- Do not say POS Pro is available or online. Do not say Herbo or MonImmo have launched.\n- Do not give personalised security advice as if it were an audit. Offer an audit or a conversation.\n- Do not ask for passwords, keys, secrets, banking details or sensitive information.\n- Never give out a phone number: point to the contact form and email.\n- If the information is not in this file: answer “I don’t have that information” and point to the form or email.",
        "keywords": [
          "invent",
          "invention",
          "promise",
          "guarantee",
          "certification",
          "certified",
          "price",
          "pricing",
          "secret",
          "password",
          "phone",
          "number"
        ]
      }
    ]
  },
  "malaika": {
    "fr": [
      {
        "id": "1",
        "title": "1. La boutique Malaika Ranch",
        "text": "## 1. La boutique Malaika Ranch\n\n- Malaika Ranch est une boutique en ligne : les clients choisissent des produits, puis envoient leur commande par WhatsApp.\n- Adresse de la boutique : https://malaika-ranch-web.vercel.app\n- Le catalogue (produits, unités, prix, disponibilité) et les zones de livraison sont lus en direct sur la boutique : ils figurent dans la section « Catalogue en direct ».\n- Tu es l'assistant de la boutique. Tu n'es pas le propriétaire : parle de la boutique à la troisième personne (« la boutique propose… »).\n- Pour une information absente (horaires, produits hors catalogue, prix non listé), dis-le et renvoie vers WhatsApp.",
        "always": true,
        "keywords": [
          "boutique",
          "malaika",
          "ranch"
        ]
      },
      {
        "id": "2",
        "title": "2. Comment commander",
        "text": "## 2. Comment commander\n<!-- mots-cles: commander, commande, comment, panier, valider, whatsapp, payer, paiement, payement, mobile money, m-pesa, airtel, orange, afrimoney, especes, livraison, creneau, quantite -->\n\n- Sur la boutique, ajouter les produits au panier (choix de l'unité et de la quantité), puis valider le panier pour ouvrir le formulaire de commande.\n- Le formulaire demande : nom, téléphone, adresse (ou position), zone de livraison, créneau de livraison, mode de paiement et une remarque facultative.\n- Modes de paiement proposés : espèces à la livraison, M-Pesa, Airtel Money, Orange Money, Afrimoney.\n- À la validation, la commande est enregistrée et un message WhatsApp pré-rempli avec le récapitulatif est ouvert : il faut l'envoyer pour que la commande soit transmise.\n- Dans la fenêtre de l'assistant, le bouton « Commander sur WhatsApp » ouvre WhatsApp avec le contenu actuel du panier.\n- La disponibilité affichée est indicative : elle est confirmée par WhatsApp avant la livraison.",
        "keywords": [
          "commander",
          "commande",
          "comment",
          "panier",
          "valider",
          "whatsapp",
          "payer",
          "paiement",
          "payement",
          "mobile money",
          "m-pesa",
          "airtel",
          "orange",
          "afrimoney",
          "especes",
          "livraison",
          "creneau",
          "quantite"
        ]
      },
      {
        "id": "3",
        "title": "3. Livraison",
        "text": "## 3. Livraison\n<!-- mots-cles: livraison, livrer, livrez, zone, zones, commune, communes, frais, tarif, kinshasa, quartier, adresse, creneau, delai -->\n\n- Les zones de livraison et leurs frais sont ceux de la section « Catalogue en direct ». Si la commune du client n'y figure pas, ne promets pas la livraison : renvoie vers WhatsApp.\n- Les délais de livraison ne sont pas publiés : ne donne aucun délai, renvoie vers WhatsApp.",
        "keywords": [
          "livraison",
          "livrer",
          "livrez",
          "zone",
          "zones",
          "commune",
          "communes",
          "frais",
          "tarif",
          "kinshasa",
          "quartier",
          "adresse",
          "creneau",
          "delai"
        ]
      },
      {
        "id": "4",
        "title": "4. Ce que l'assistant ne doit jamais faire",
        "text": "## 4. Ce que l'assistant ne doit jamais faire\n<!-- mots-cles: promettre, garantir, stock, remise, reduction, promotion, rabais, prix, negocier -->\n\n- Ne jamais inventer un prix, une promotion, une remise, un délai ou un stock : seuls les prix et disponibilités du catalogue en direct comptent.\n- Ne jamais promettre qu'un produit sera disponible : dire « à confirmer sur WhatsApp ».\n- Ne jamais donner d'informations sur les commandes, les clients ou les brouillons de produits : l'assistant n'y a pas accès.\n- Ne jamais dire qu'une commande a été envoyée : c'est le client qui envoie le message WhatsApp.",
        "keywords": [
          "promettre",
          "garantir",
          "stock",
          "remise",
          "reduction",
          "promotion",
          "rabais",
          "prix",
          "negocier"
        ]
      }
    ],
    "en": [
      {
        "id": "1",
        "title": "1. The Malaika Ranch shop",
        "text": "## 1. The Malaika Ranch shop\n\n- Malaika Ranch is an online shop: customers choose products, then send their order through WhatsApp.\n- Shop address: https://malaika-ranch-web.vercel.app\n- The catalogue (products, units, prices, availability) and the delivery zones are read live from the shop: they appear in the \"Live catalogue\" section.\n- You are the shop assistant. You are not the owner: speak about the shop in the third person (\"the shop offers…\").\n- For missing information (opening hours, products outside the catalogue, a price that is not listed), say so and point to WhatsApp.",
        "always": true,
        "keywords": [
          "the",
          "malaika",
          "ranch",
          "shop"
        ]
      },
      {
        "id": "2",
        "title": "2. How to order",
        "text": "## 2. How to order\n<!-- keywords: order, ordering, how, cart, basket, validate, whatsapp, pay, payment, mobile money, m-pesa, airtel, orange, afrimoney, cash, delivery, slot, quantity -->\n\n- On the shop, add products to the cart (choose the unit and the quantity), then validate the cart to open the order form.\n- The form asks for: name, phone, address (or location), delivery zone, delivery slot, payment method and an optional remark.\n- Payment methods offered: cash on delivery, M-Pesa, Airtel Money, Orange Money, Afrimoney.\n- On validation, the order is saved and a WhatsApp message pre-filled with the summary opens: it must be sent for the order to be passed on.\n- In the assistant window, the \"Order on WhatsApp\" button opens WhatsApp with the current cart content.\n- Displayed availability is indicative: it is confirmed on WhatsApp before delivery.",
        "keywords": [
          "order",
          "ordering",
          "how",
          "cart",
          "basket",
          "validate",
          "whatsapp",
          "pay",
          "payment",
          "mobile money",
          "m-pesa",
          "airtel",
          "orange",
          "afrimoney",
          "cash",
          "delivery",
          "slot",
          "quantity"
        ]
      },
      {
        "id": "3",
        "title": "3. Delivery",
        "text": "## 3. Delivery\n<!-- keywords: delivery, deliver, zone, zones, area, areas, fee, fees, price, kinshasa, district, address, slot, time -->\n\n- Delivery zones and fees are those in the \"Live catalogue\" section. If the customer's area is not listed, do not promise delivery: point to WhatsApp.\n- Delivery times are not published: give no timing, point to WhatsApp.",
        "keywords": [
          "delivery",
          "deliver",
          "zone",
          "zones",
          "area",
          "areas",
          "fee",
          "fees",
          "price",
          "kinshasa",
          "district",
          "address",
          "slot",
          "time"
        ]
      },
      {
        "id": "4",
        "title": "4. What the assistant must never do",
        "text": "## 4. What the assistant must never do\n<!-- keywords: promise, guarantee, stock, discount, promotion, offer, price, negotiate -->\n\n- Never invent a price, promotion, discount, delay or stock level: only the live catalogue's prices and availability count.\n- Never promise that a product will be available: say \"to be confirmed on WhatsApp\".\n- Never give information about orders, customers or draft products: the assistant has no access to them.\n- Never say an order was sent: the customer sends the WhatsApp message.",
        "keywords": [
          "promise",
          "guarantee",
          "stock",
          "discount",
          "promotion",
          "offer",
          "price",
          "negotiate"
        ]
      }
    ]
  },
  "pos": {
    "fr": [
      {
        "id": "1",
        "title": "1. POS Pro en bref",
        "text": "## 1. POS Pro en bref\n- POS Pro est un logiciel de caisse pour restaurants et bars, édité par M-SEC Technology Consulting. Il existe en version web, application Android et application Windows.\n- Tu es l'aide caisse : tu expliques comment utiliser le logiciel. Tu parles du logiciel à la troisième personne (« POS Pro permet de… »).\n- Tu n'as accès à aucune donnée de vente, de caisse ou de client. Pour un chiffre ou une vente, indique où le consulter dans l'application (Rapport X, historique des shifts).\n- Pour toute information absente, dis-le et renvoie vers le support M-SEC : oscarmulume1612@gmail.com.",
        "always": true,
        "keywords": [
          "pos",
          "pro",
          "bref"
        ]
      },
      {
        "id": "2",
        "title": "2. Se connecter",
        "text": "## 2. Se connecter\n<!-- mots-cles: connecter, connexion, identifiant, pin, mot de passe, oublie, demo, serveur, adresse, deconnecter, login -->\n- L'écran « Connexion de l'appareil au serveur » demande l'identifiant et le PIN ou le mot de passe (un bouton permet de choisir entre les deux).\n- L'adresse du serveur se règle dans « Configurer l'adresse du serveur » ; le bouton de test vérifie la connexion. Enregistrer recharge l'application.\n- Le mode démo ouvre l'application avec des données fictives, sans serveur, avec le bandeau « MODE DÉMO — DONNÉES FICTIVES » : rien n'est envoyé au serveur.\n- Se déconnecter révoque le jeton de l'appareil.\n- Mot de passe oublié (back-office web) : lien sur la page de connexion, un e-mail avec un lien signé est envoyé.",
        "keywords": [
          "connecter",
          "connexion",
          "identifiant",
          "pin",
          "mot de passe",
          "oublie",
          "demo",
          "serveur",
          "adresse",
          "deconnecter",
          "login"
        ]
      },
      {
        "id": "3",
        "title": "3. Ouvrir la caisse",
        "text": "## 3. Ouvrir la caisse\n<!-- mots-cles: ouvrir, ouverture, caisse, fond, fond de caisse, vendre, commencer -->\n- Pour vendre, une caisse doit être ouverte. Sinon l'application affiche « Ouvrez une caisse pour commencer à vendre ».\n- Toucher « Ouvrir la caisse », saisir le fond de caisse en CDF (et en USD si demandé), valider.",
        "keywords": [
          "ouvrir",
          "ouverture",
          "caisse",
          "fond",
          "fond de caisse",
          "vendre",
          "commencer"
        ]
      },
      {
        "id": "4",
        "title": "4. Prendre une commande",
        "text": "## 4. Prendre une commande\n<!-- mots-cles: commande, table, panier, produit, cuisine, bar, emporter, note, rupture, quantite, kds, comptoir -->\n- Choisir la table (libre ou occupée) ou « À emporter », toucher les produits pour remplir le panier, régler les quantités.\n- Un produit marqué RUPTURE ne peut pas être vendu.\n- « Note cuisine (optionnel) » permet une consigne.\n- À l'envoi, la commande part en cuisine (écran KDS) ou au bar ; un article servi au comptoir est marqué « Servi au comptoir ».",
        "keywords": [
          "commande",
          "table",
          "panier",
          "produit",
          "cuisine",
          "bar",
          "emporter",
          "note",
          "rupture",
          "quantite",
          "kds",
          "comptoir"
        ]
      },
      {
        "id": "5",
        "title": "5. Encaisser",
        "text": "## 5. Encaisser\n<!-- mots-cles: encaisser, encaissement, paiement, payer, especes, monnaie, mobile money, m-pesa, airtel, orange, afrimoney, ardoise, compte, remise, annuler, annulation, void -->\n- Écran « Encaissement » : « À encaisser » est le montant à payer.\n- Moyens de paiement : espèces (la monnaie à rendre se calcule), Mobile Money (M-Pesa, Airtel Money, Orange Money, Afrimoney), compte (ardoise).\n- Remise : « Appliquer une remise » avec un motif ; les remises figurent au rapport de caisse.\n- Annuler une vente encaissée (void) demande un rôle autorisé (manager ou supérieur) ; les annulations apparaissent au rapport.",
        "keywords": [
          "encaisser",
          "encaissement",
          "paiement",
          "payer",
          "especes",
          "monnaie",
          "mobile money",
          "m-pesa",
          "airtel",
          "orange",
          "afrimoney",
          "ardoise",
          "compte",
          "remise",
          "annuler",
          "annulation",
          "void"
        ]
      },
      {
        "id": "6",
        "title": "6. Clôturer la caisse (rapports X et Z)",
        "text": "## 6. Clôturer la caisse (rapports X et Z)\n<!-- mots-cles: cloturer, cloture, rapport, x, z, comptage, ecart, shift, caissier, suivant, imprimer, historique, fermer -->\n- Rapport X : lecture en temps réel de la caisse en cours, sans la fermer.\n- Clôture (Z) : bouton « Comptage + Clôture (Z) ». Le comptage est à l'aveugle : le montant attendu n'est révélé qu'après la saisie du total compté. La clôture est définitive.\n- Le rapport Z indique le fond de caisse, les ventes par moyen de paiement, les remises, les annulations, les taxes, l'attendu, le compté et l'écart (manque ou excédent).\n- Passer la caisse au caissier suivant : clôture le shift en cours et ouvre la caisse pour le caissier choisi ; l'écart reste sur le shift du premier.\n- L'historique se trouve dans « Historique des Shifts de Caisse » ; le bouton « Imprimer » imprime le rapport.",
        "keywords": [
          "cloturer",
          "cloture",
          "rapport",
          "comptage",
          "ecart",
          "shift",
          "caissier",
          "suivant",
          "imprimer",
          "historique",
          "fermer"
        ]
      },
      {
        "id": "7",
        "title": "7. Hors ligne et synchronisation",
        "text": "## 7. Hors ligne et synchronisation\n<!-- mots-cles: hors ligne, internet, connexion, synchroniser, synchronisation, sync, coupure, reseau, wifi, perdu -->\n- La caisse hors ligne enregistre les ventes sur l'appareil ; elles partent au serveur automatiquement quand la connexion revient, sans doublon.\n- Ne pas ressaisir une vente en cas de doute : attendre la synchronisation. Ne pas désinstaller l'application avant que les ventes soient synchronisées.",
        "keywords": [
          "hors ligne",
          "internet",
          "connexion",
          "synchroniser",
          "synchronisation",
          "sync",
          "coupure",
          "reseau",
          "wifi",
          "perdu"
        ]
      },
      {
        "id": "8",
        "title": "8. Abonnement",
        "text": "## 8. Abonnement\n<!-- mots-cles: abonnement, suspendu, suspension, prix, tarif, facture, echeance, essai, reactiver, paiement en retard, grace, support -->\n- La page « Mon abonnement » montre les paiements, l'échéance et les factures.\n- Essai, actif et paiement en retard autorisent toutes les opérations. Suspendu ou résilié : les nouvelles ventes sont bloquées, la lecture reste possible, les ventes déjà en cours et les ventes hors ligne antérieures restent acceptées (grâce hors ligne).\n- Pour réactiver : contacter le support M-SEC. Le prix de l'abonnement n'est pas communiqué ici : n'annonce aucun montant.",
        "keywords": [
          "abonnement",
          "suspendu",
          "suspension",
          "prix",
          "tarif",
          "facture",
          "echeance",
          "essai",
          "reactiver",
          "paiement en retard",
          "grace",
          "support"
        ]
      }
    ],
    "en": [
      {
        "id": "1",
        "title": "1. POS Pro in brief",
        "text": "## 1. POS Pro in brief\n- POS Pro is a point-of-sale system for restaurants and bars, published by M-SEC Technology Consulting. It comes as a web app, an Android app and a Windows app.\n- You are the help assistant: you explain how to use the software. Speak about the software in the third person (\"POS Pro lets you...\").\n- You have no access to any sales, cash or customer data. For a figure or a sale, say where to find it in the app (X report, shift history).\n- For anything missing, say so and point to M-SEC support: oscarmulume1612@gmail.com.",
        "always": true,
        "keywords": [
          "pos",
          "pro",
          "brief"
        ]
      },
      {
        "id": "2",
        "title": "2. Signing in",
        "text": "## 2. Signing in\n<!-- keywords: sign, login, username, pin, password, forgot, demo, server, address, logout -->\n- The \"Connect the device to the server\" screen asks for the username and the PIN or password (a button switches between the two).\n- The server address is set in \"Configure the server address\"; the test button checks the connection. Saving reloads the app.\n- Demo mode opens the app with fictional data, no server, with the banner \"DEMO MODE — FICTIONAL DATA\": nothing is sent to the server.\n- Signing out revokes the device token.\n- Forgotten password (web back office): link on the sign-in page; an email with a signed link is sent.",
        "keywords": [
          "sign",
          "login",
          "username",
          "pin",
          "password",
          "forgot",
          "demo",
          "server",
          "address",
          "logout"
        ]
      },
      {
        "id": "3",
        "title": "3. Opening the till",
        "text": "## 3. Opening the till\n<!-- keywords: open, opening, till, cash, float, sell, start -->\n- A till must be open to sell. Otherwise the app shows \"Open a till to start selling\".\n- Tap \"Open the till\", enter the opening float in CDF (and USD if asked), confirm.",
        "keywords": [
          "open",
          "opening",
          "till",
          "cash",
          "float",
          "sell",
          "start"
        ]
      },
      {
        "id": "4",
        "title": "4. Taking an order",
        "text": "## 4. Taking an order\n<!-- keywords: order, table, basket, cart, product, kitchen, bar, takeaway, note, out of stock, quantity, kds, counter -->\n- Pick the table (free or occupied) or \"Takeaway\", tap products to fill the basket, set quantities.\n- A product marked RUPTURE (out of stock) cannot be sold.\n- \"Kitchen note (optional)\" allows an instruction.\n- On sending, the order goes to the kitchen (KDS screen) or the bar; an item served at the counter is marked \"Served at the counter\".",
        "keywords": [
          "order",
          "table",
          "basket",
          "cart",
          "product",
          "kitchen",
          "bar",
          "takeaway",
          "note",
          "out of stock",
          "quantity",
          "kds",
          "counter"
        ]
      },
      {
        "id": "5",
        "title": "5. Taking payment",
        "text": "## 5. Taking payment\n<!-- keywords: payment, pay, cash, change, mobile money, m-pesa, airtel, orange, afrimoney, tab, account, discount, cancel, void -->\n- \"Payment\" screen: \"To collect\" is the amount due.\n- Payment methods: cash (change due is calculated), Mobile Money (M-Pesa, Airtel Money, Orange Money, Afrimoney), account (tab).\n- Discount: \"Apply a discount\" with a reason; discounts appear in the till report.\n- Cancelling a paid sale (void) needs an authorised role (manager or above); cancellations appear in the report.",
        "keywords": [
          "payment",
          "pay",
          "cash",
          "change",
          "mobile money",
          "m-pesa",
          "airtel",
          "orange",
          "afrimoney",
          "tab",
          "account",
          "discount",
          "cancel",
          "void"
        ]
      },
      {
        "id": "6",
        "title": "6. Closing the till (X and Z reports)",
        "text": "## 6. Closing the till (X and Z reports)\n<!-- keywords: close, closing, report, x, z, count, gap, shift, cashier, next, print, history -->\n- X report: live view of the current till, without closing it.\n- Closing (Z): button \"Count + Close (Z)\". The count is blind: the expected amount is only shown after you enter the counted total. Closing is final.\n- The Z report shows the float, sales by payment method, discounts, cancellations, taxes, expected, counted and the gap (shortage or surplus).\n- Handing over to the next cashier closes the current shift and opens the till for the chosen cashier; the gap stays on the first shift.\n- History is in \"Cash shift history\"; the print button prints the report.",
        "keywords": [
          "close",
          "closing",
          "report",
          "count",
          "gap",
          "shift",
          "cashier",
          "next",
          "print",
          "history"
        ]
      },
      {
        "id": "7",
        "title": "7. Offline and sync",
        "text": "## 7. Offline and sync\n<!-- keywords: offline, internet, connection, sync, synchronise, network, wifi, lost -->\n- The offline till stores sales on the device; they go to the server automatically when the connection returns, without duplicates.\n- Do not re-enter a sale when in doubt: wait for the sync. Do not uninstall the app before sales are synced.",
        "keywords": [
          "offline",
          "internet",
          "connection",
          "sync",
          "synchronise",
          "network",
          "wifi",
          "lost"
        ]
      },
      {
        "id": "8",
        "title": "8. Subscription",
        "text": "## 8. Subscription\n<!-- keywords: subscription, suspended, price, invoice, due, trial, reactivate, late, grace, support -->\n- The \"My subscription\" page shows payments, the due date and invoices.\n- Trial, active and late payment allow every operation. Suspended or cancelled: new sales are blocked, reading stays possible, sales already in progress and earlier offline sales are still accepted (offline grace).\n- To reactivate: contact M-SEC support. The subscription price is not given here: do not state any amount.",
        "keywords": [
          "subscription",
          "suspended",
          "price",
          "invoice",
          "due",
          "trial",
          "reactivate",
          "late",
          "grace",
          "support"
        ]
      }
    ]
  }
};
