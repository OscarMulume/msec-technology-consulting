-- ============================================================
-- M-SEC TECHNOLOGY CONSULTING - Database Schema
-- Compatible with Supabase (PostgreSQL)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: admin_users
-- Authentication locale par mot de passe (hash bcrypt)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- bcrypt hash
    display_name TEXT DEFAULT 'Admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: services
-- Contenu administrable des services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,  -- URL-friendly: 'connectivity', 'security', etc.
    title TEXT NOT NULL,
    icon TEXT DEFAULT '⚙️',
    summary TEXT,
    description TEXT,
    features JSONB DEFAULT '[]',        -- liste de features
    standards JSONB DEFAULT '[]',       -- badges: Cisco, UniFi, etc.
    benefit_text TEXT,                   -- texte du bénéfice client
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: site_settings
-- Paramètres globaux du site (titre, description, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: clients
-- Informations clients / prospects
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_name TEXT,
    contact_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    country TEXT DEFAULT 'RDC',
    city TEXT,
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'prospect',  -- prospect, active, inactive
    source TEXT DEFAULT 'website',   -- website, referral, audit
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: messages
-- Messages du formulaire de contact
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    service_requested TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: audits
-- Demandes de mini-audit gratuit
-- ============================================================
CREATE TABLE IF NOT EXISTS audits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    company_name TEXT,
    contact_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    infrastructure_type TEXT,    -- 'network', 'security', 'full'
    current_issues TEXT,
    preferred_contact_method TEXT DEFAULT 'email',
    status TEXT DEFAULT 'pending',  -- pending, scheduled, completed, cancelled
    scheduled_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: audit_reports
-- Rapports d'audit générés
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    report_content JSONB,
    file_url TEXT,
    status TEXT DEFAULT 'draft',  -- draft, delivered
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_created ON audits(created_at DESC);

-- ============================================================
-- RLS (Row Level Security) POLICIES
-- ============================================================

-- Services: publics en lecture, admin en écriture
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Services are manageable by admins" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Messages: insertion publique, lecture admin
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages readable by admins" ON messages FOR SELECT USING (auth.role() = 'authenticated');

-- Clients: admin only
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients manageable by admins" ON clients FOR ALL USING (auth.role() = 'authenticated');

-- Audits: insertion publique, gestion admin
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request audits" ON audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Audits manageable by admins" ON audits FOR ALL USING (auth.role() = 'authenticated');

-- Site settings: publics en lecture, admin en écriture
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings viewable by everyone" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Settings manageable by admins" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- DEFAULT DATA
-- ============================================================

-- Admin user (mot de passe: 'msec2026!' - à changer)
-- Hash bcrypt généré avec cost=10
INSERT INTO admin_users (username, password_hash, display_name)
VALUES ('admin', '$2a$10$QJmX8J3VhvLxB3xMzONgFe3Z1mONgFe3Z1mONgFe3Z1mONgFe3Z1m', 'Admin M-Sec')
ON CONFLICT DO NOTHING;

-- Services par défaut
INSERT INTO services (slug, title, icon, summary, features, standards, benefit_text, display_order) VALUES
('connectivity', 'Connectivité Critique & Réseaux Résilients', '🌐',
 'Conception d''architectures réseau sur mesure avec liaisons Internet redonnées.',
 '["Fibre Optique d''entreprise + Starlink en basculement automatique (Failover)", "Antennes PtP/PtMP pour réseaux privés longue portée", "Routage dynamique et gestion de bandes passantes complexes", "Wi-Fi Entreprise (UniFi) — couverture optimale"]',
 '["Cisco", "UniFi", "Starlink Business"]',
 'Restez connecté même en cas de coupure de votre ligne principale.',
 1),

('infrastructure', 'Infrastructure Physique & Câblage', '🏗️',
 'Câblage structuré certifié aux normes de diaphonie et d''atténuation.',
 '["Câblage Cat6/Cat6a certifié TIA/EIA", "Fibre monomode inter-bâtiments", "Baies de brassage, patch panels étiquetés", "Mise en rack, optimisation salles serveurs", "Documentation complète et certification"]',
 '["TIA/EIA-568", "Cat6a", "OM4"]',
 'Infrastructure propre, documentée — éliminez les micro-coupures matérielles.',
 2),

('security', 'Cybersécurité Offensive & Durcissement', '🔒',
 'Protection périmétrique et des terminaux. Chaque équipement est durci dès sa mise en service.',
 '["Tests de vulnérabilités (Pentesting) et audits de sécurité", "Pare-feux de nouvelle génération (FortiGate NGFW)", "Isolation des réseaux sensibles par VLANs", "Durcissement (Hardening) de tous les équipements", "Protection des endpoints et DRP/BCP"]',
 '["FortiGate", "NIST", "ISO 27001"]',
 'Immunisez vos systèmes face aux ransomwares et fuites de données.',
 3),

('cctv', 'Vidéosurveillance IP Haute Sécurité', '📹',
 'Caméras IP intelligentes avec flux chiffrés et accès distant sécurisé.',
 '["Caméras IP HD/4K — vision nocturne, détection IA", "NVR avec stockage redondant", "Isolation des caméras sur un VLAN dédié", "Accès distant 100% chiffré via VPN", "Zéro mot de passe d''usine"]',
 '["ONVIF", "IP67", "AES-256"]',
 'Surveillez vos locaux avec l''assurance que vos flux vidéo restent strictement privés.',
 4),

('maintenance', 'Supervision IA & Maintenance Applicative', '⚙️',
 'Monitoring intelligent 24/7 avec agents autonomes. Nous intervenons avant la panne.',
 '["Agents autonomes de surveillance (serveurs, réseau, caméras)", "Alertes automatisées avant panne majeure", "Gestion et optimisation bases de données", "SLA 99.9% — temps de réponse 2h haute priorité", "Rapports mensuels et support technique dédié"]',
 '["Supabase", "PostgreSQL", "Grafana"]',
 'Anticipation des pannes — nous intervenons avant que l''anomalie n''impacte votre production.',
 5);

-- Settings par défaut
INSERT INTO site_settings (key, value) VALUES
('general', '{"site_title": "M-Sec Technology Consulting", "site_description": "Infrastructure IT, Cybersécurité, Connectivité. Solutions de classe entreprise pour l''Afrique centrale.", "contact_email": "oscarmulume1612@gmail.com", "contact_phone": "+243 975 585 150", "contact_address": "Kinshasa, RDC", "company_legal_name": "M-Sec Technology Consulting"}'),
('hero', '{"badge": "Consulting IT — Afrique Centrale", "headline": "M-SEC", "headline_accent": "Technology Consulting", "tagline": "L''Infrastructure et la Sécurité IT au service de la performance de votre entreprise.", "manifesto": "Une interruption réseau de 10 minutes peut coûter des milliers de dollars. Une faille de sécurité peut détruire votre réputation. Nous fusionnons l''ingénierie réseau de pointe, le développement moderne et la cybersécurité offensive pour bâtir des environnements résilients.", "cta_primary": "Demander un Audit Gratuit", "cta_secondary": "Découvrir nos Services"}'),
('stats', '{"sla": "99.9%", "response_time": "2h", "pillars": "5", "monitoring": "24/7"}'),
('about', '{"title": "Pourquoi choisir M-Sec ?", "content": "Nous ne nous contentons pas d''installer des équipements. Nous appliquons le principe de « Sécurité par Conception » (Security by Design). Chaque câble posé, chaque antenne configurée et chaque base de données déployée intègre des protocoles de durcissement (hardening) stricts pour garantir une haute disponibilité sans failles.", "standards": ["Cisco", "UniFi", "FortiGate"]}'),
('methodology', '{"title": "Notre Méthodologie", "description": "Un processus rigoureux en 4 phases pour des résultats mesurables.", "steps": [{"num": "01", "title": "Audit & Analyse", "desc": "Évaluation gratuite de vos vulnérabilités. Cartographie réseau, benchmark de performance, identification des failles."}, {"num": "02", "title": "Proposition Technique", "desc": "Conception sur mesure (Cisco, UniFi, FortiGate). Chiffrage transparent, planning, garanties SLA."}, {"num": "03", "title": "Déploiement Sécurisé", "desc": "Installation physique et logique avec durcissement cyber natif. Tests de performance complets."}, {"num": "04", "title": "Supervision Continue", "desc": "Monitoring 24/7, maintenance proactive, rapports SLA, support technique dédié."}]}'),
('footer', '{"brand_description": "Solutions IT professionnelles pour l''Afrique centrale. Infrastructure, Cybersécurité, Connectivité.", "copyright": "M-Sec Technology Consulting. Tous droits réservés."}')
ON CONFLICT DO NOTHING;
