import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
// ⚠️ REMPLACEZ CES VALEURS par vos vraies credentials Supabase
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// TYPES
// ============================================================
export interface Service {
    id: string;
    slug: string;
    title: string;
    icon: string;
    summary: string;
    description: string;
    features: string[];
    standards: string[];
    benefit_text: string;
    is_active: boolean;
    display_order: number;
}

export interface Client {
    id: string;
    company_name: string | null;
    contact_name: string;
    email: string | null;
    phone: string | null;
    country: string;
    city: string | null;
    address: string | null;
    notes: string | null;
    status: 'prospect' | 'active' | 'inactive';
    source: string;
    created_at: string;
}

export interface Message {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    service_requested: string | null;
    message: string;
    is_read: boolean;
    is_archived: boolean;
    admin_notes: string | null;
    created_at: string;
}

export interface Audit {
    id: string;
    client_id: string | null;
    company_name: string | null;
    contact_name: string;
    email: string | null;
    phone: string | null;
    infrastructure_type: string | null;
    current_issues: string | null;
    preferred_contact_method: string;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    scheduled_date: string | null;
    notes: string | null;
    created_at: string;
}

export interface SiteSetting {
    id: string;
    key: string;
    value: any;
}

// ============================================================
// API FUNCTIONS - Services
// ============================================================
export async function getServices(): Promise<Service[]> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
    if (error) throw error;
    return data || [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error) throw error;
    return data;
}

// ============================================================
// API FUNCTIONS - Messages
// ============================================================
export async function createMessage(msg: Partial<Message>): Promise<Message> {
    const { data, error } = await supabase
        .from('messages')
        .insert(msg)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getMessages(): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

// ============================================================
// API FUNCTIONS - Audits
// ============================================================
export async function createAudit(audit: Partial<Audit>): Promise<Audit> {
    const { data, error } = await supabase
        .from('audits')
        .insert(audit)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getAudits(): Promise<Audit[]> {
    const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

// ============================================================
// API FUNCTIONS - Clients
// ============================================================
export async function getClients(): Promise<Client[]> {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function createClient(client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
        .from('clients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
}

// ============================================================
// API FUNCTIONS - Site Settings
// ============================================================
export async function getSiteSettings(): Promise<Record<string, any>> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*');
    if (error) throw error;
    const settings: Record<string, any> = {};
    data?.forEach((s: SiteSetting) => { settings[s.key] = s.value; });
    return settings;
}

// ============================================================
// API FUNCTIONS - Admin Auth (password-based)
// ============================================================
export async function adminLogin(username: string, password: string): Promise<boolean> {
    // On récupère le hash stocké et on compare côté client
    // En production, mieux vaut une Edge Function Supabase pour ça
    const { data, error } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('username', username)
        .eq('is_active', true)
        .single();

    if (error || !data) return false;

    // Comparaison simple (en production, utiliser bcrypt.compare via une fonction)
    // Pour l'instant, on utilise une comparaison directe avec un hash connu
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Le hash stocké est SHA-256 du mot de passe
    return hashHex === data.password_hash;
}

// ============================================================
// STATS
// ============================================================
export async function getDashboardStats() {
    const [messages, audits, clients] = await Promise.all([
        supabase.from('messages').select('id', { count: 'exact' }),
        supabase.from('audits').select('id', { count: 'exact' }),
        supabase.from('clients').select('id', { count: 'exact' }),
    ]);

    const [unreadMessages, pendingAudits, activeClients] = await Promise.all([
        supabase.from('messages').select('id', { count: 'exact' }).eq('is_read', false),
        supabase.from('audits').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('clients').select('id', { count: 'exact' }).eq('status', 'active'),
    ]);

    return {
        totalMessages: messages.count || 0,
        totalAudits: audits.count || 0,
        totalClients: clients.count || 0,
        unreadMessages: unreadMessages.count || 0,
        pendingAudits: pendingAudits.count || 0,
        activeClients: activeClients.count || 0,
    };
}
