
import { createClient } from '@supabase/supabase-js';
import { User, UserRole, ServiceRequest, RequestStatus, Priority, Professional, Testimonial, TestimonialStatus, Notification, TimelineEvent, ChatMessage, Condominium } from '../types';

// Configuration
const SUPABASE_URL = 'https://afjntpnjxdqmnnkbskws.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmam50cG5qeGRxbW5ua2Jza3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDU0NTQsImV4cCI6MjA4MDUyMTQ1NH0.vUZ7sBJ3ZniI_HRenmEdm1etQomX5NVcOAOcM_uX5RA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to clean objects for Supabase (remove empty strings for UUID/Int columns)
const cleanPayload = (data: any) => {
  const clean: any = {};
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value === '' || value === undefined) {
      clean[key] = null;
    } else {
      clean[key] = value;
    }
  });
  return clean;
};

// Push Service
class PushNotificationService {
  isSubscribed(userId: string): boolean {
    return localStorage.getItem(`push_${userId}`) === 'true';
  }

  async subscribeUser(userId: string): Promise<boolean> {
    if (!('Notification' in window)) return false;
    const permission = await window.Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(`push_${userId}`, 'true');
      return true;
    }
    return false;
  }

  async unsubscribeUser(userId: string): Promise<boolean> {
    localStorage.removeItem(`push_${userId}`);
    return true;
  }

  async sendPush(userId: string, title: string, body: string, url?: string) {
    console.log(`[PUSH to ${userId}] ${title}: ${body}`);
    if (window.Notification && window.Notification.permission === 'granted') {
       const n = new window.Notification(title, { body });
       if(url) n.onclick = () => window.location.hash = url;
    }
  }
}

export const pushService = new PushNotificationService();

// Real Supabase Implementation
class SupabaseService {
  
  // Auth & Users
  async login(email: string, password?: string): Promise<{ user: User | null, error: string | null }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return { user: null, error: 'Usuário não encontrado.' };
    if (data.password !== password) return { user: null, error: 'Senha incorreta.' };

    const user: User = {
       id: data.id,
       name: data.name,
       email: data.email,
       role: data.role as UserRole,
       condo_name: data.condo_name,
       block: data.block,
       apartment: data.apartment,
       push_enabled: data.push_enabled
    };

    return { user, error: null };
  }

  async getResidentByEmail(email: string): Promise<{ user: User | null, error: string | null }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .eq('role', 'resident')
      .single();

    if (error || !data) return { user: null, error: 'E-mail de morador não encontrado.' };
    return { user: data as User, error: null };
  }

  async getUsers(): Promise<User[]> {
    const { data } = await supabase.from('profiles').select('*').order('name');
    return (data || []) as User[];
  }

  async createUser(userData: any): Promise<User> {
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', userData.email).maybeSingle();
    if(existing) throw new Error('Este e-mail já está cadastrado.');

    const payload = cleanPayload({
        name: userData.name,
        email: userData.email,
        password: userData.password || '123',
        role: userData.role,
        condo_name: userData.condo_name,
        block: userData.block,
        apartment: userData.apartment
    });

    const { data, error } = await supabase
      .from('profiles')
      .insert([payload])
      .select()
      .single();

    if(error) throw new Error(error.message);
    return data as User;
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if(error) throw new Error(error.message);
  }

  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const { error } = await supabase.from('profiles').update({ password: newPassword }).eq('id', userId);
    return !error;
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Senha alterada.' };
  }

  async updateUserPushPreference(userId: string, enabled: boolean): Promise<User | null> {
    const { data } = await supabase.from('profiles').update({ push_enabled: enabled }).eq('id', userId).select().single();
    if(enabled) pushService.subscribeUser(userId);
    return data as User;
  }

  // Condominiums
  async getCondominiums(): Promise<Condominium[]> {
    const { data } = await supabase.from('condominiums').select('*').order('name');
    return (data || []) as Condominium[];
  }

  async createCondominium(data: Partial<Condominium>): Promise<Condominium> {
    const payload = cleanPayload(data);
    const { data: created, error } = await supabase.from('condominiums').insert([payload]).select().single();
    if(error) throw new Error(error.message);
    return created as Condominium;
  }

  async deleteCondominium(id: string): Promise<void> {
    const { error } = await supabase.from('condominiums').delete().eq('id', id);
    if(error) throw new Error(error.message);
  }

  // Service Requests
  async getServiceRequests(userId?: string, role?: UserRole): Promise<ServiceRequest[]> {
    let query = supabase.from('service_requests').select(`
      *,
      timeline:request_timeline(*)
    `).order('created_at', { ascending: false });

    if (role === UserRole.RESIDENT && userId) {
      query = query.eq('requester_id', userId);
    } else if (role === UserRole.SYNDIC && userId) {
      const { data: user } = await supabase.from('profiles').select('condo_name').eq('id', userId).single();
      if(user?.condo_name) {
        query = query.eq('condo_name', user.condo_name);
      }
    }

    const { data, error } = await query;
    if(error) return [];
    
    return (data || []).map((r: any) => ({
        ...r,
        timeline: r.timeline ? r.timeline.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : []
    })) as ServiceRequest[];
  }

  async createServiceRequest(data: Partial<ServiceRequest>, user: User): Promise<ServiceRequest> {
    const protocol = `JLM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let initialStatus = RequestStatus.OPEN;
    if (user.role === UserRole.RESIDENT && data.is_private === false) {
       initialStatus = RequestStatus.PENDING_APPROVAL;
    }

    let syndicId = data.syndic_id;
    let syndicName = data.syndic_name;
    
    if(!syndicId && user.condo_name) {
       const { data: condo } = await supabase.from('condominiums').select('syndic_id, syndic_name').eq('name', user.condo_name).single();
       if(condo) {
         syndicId = condo.syndic_id;
         syndicName = condo.syndic_name;
       }
    }

    const payload = cleanPayload({
      protocol,
      type: data.type,
      description: data.description,
      priority: data.priority,
      status: initialStatus,
      syndic_id: syndicId,
      syndic_name: syndicName,
      requester_id: user.id,
      requester_name: user.name,
      is_private: data.is_private,
      unit_info: user.role === UserRole.RESIDENT ? `Bl. ${user.block} - Apt ${user.apartment}` : undefined,
      condo_name: user.condo_name,
      created_at: new Date().toISOString()
    });

    const { data: req, error } = await supabase.from('service_requests').insert([payload]).select().single();
    if(error) throw new Error(error.message);

    await this.addTimelineEvent(req.id, 'Chamado Aberto', initialStatus === RequestStatus.PENDING_APPROVAL ? 'Aguardando Aprovação do Síndico' : 'Solicitação criada com sucesso');
    return req as ServiceRequest;
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<void> {
    const { timeline, ...cleanUpdates } = updates;
    const payload = cleanPayload(cleanUpdates);
    const { error } = await supabase.from('service_requests').update(payload).eq('id', id);
    if(error) throw new Error(error.message);
  }

  async assignProfessional(requestId: string, professionalId: string): Promise<void> {
    const { data: prof } = await supabase.from('professionals').select('*').eq('id', professionalId).single();
    if(prof) {
      await this.updateServiceRequest(requestId, {
        professional_id: prof.id,
        professional_name: prof.name,
        status: RequestStatus.IN_PROGRESS
      });
      await this.addTimelineEvent(requestId, 'Profissional Atribuído', `${prof.name} designado para o serviço.`);
    }
  }

  async addTimelineEvent(requestId: string, title: string, description: string): Promise<void> {
    await supabase.from('request_timeline').insert([{
      request_id: requestId,
      title,
      description,
      timestamp: new Date().toISOString()
    }]);
  }

  async getRequestMessages(requestId: string): Promise<ChatMessage[]> {
    const { data } = await supabase.from('chat_messages').select('*').eq('request_id', requestId).order('created_at', { ascending: true });
    return (data || []) as ChatMessage[];
  }

  async sendRequestMessage(requestId: string, user: User, message: string): Promise<ChatMessage> {
    const { data, error } = await supabase.from('chat_messages').insert([{
      request_id: requestId,
      user_id: user.id,
      user_name: user.name,
      role: user.role,
      message
    }]).select().single();
    if(error) throw new Error(error.message);
    return data as ChatMessage;
  }

  async getProfessionals(): Promise<Professional[]> {
    const { data } = await supabase.from('professionals').select('*').order('name');
    return (data || []) as Professional[];
  }

  async saveProfessional(prof: any): Promise<void> {
    const payload = cleanPayload(prof);
    if(prof.id) {
       const { error } = await supabase.from('professionals').update(payload).eq('id', prof.id);
       if(error) throw new Error(error.message);
    } else {
       const { id, ...newProf } = payload;
       const { error } = await supabase.from('professionals').insert([newProf]);
       if(error) throw new Error(error.message);
    }
  }

  async getTestimonials(onlyApproved = false): Promise<Testimonial[]> {
    let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if(onlyApproved) query = query.eq('status', TestimonialStatus.APPROVED);
    const { data } = await query;
    return (data || []) as Testimonial[];
  }

  async updateTestimonialStatus(id: string, status: TestimonialStatus): Promise<void> {
    await supabase.from('testimonials').update({ status }).eq('id', id);
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return (data || []) as Notification[];
  }

  async createNotification(userId: string, message: string, link?: string): Promise<void> {
    await supabase.from('notifications').insert([{ user_id: userId, message, link }]);
  }

  async markNotificationRead(id: string): Promise<void> {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  }
}

export const db = new SupabaseService();
