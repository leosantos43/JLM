
export enum UserRole {
  ADMIN = 'admin',
  SYNDIC = 'syndic',
  PROFESSIONAL = 'professional',
  RESIDENT = 'resident'
}

export enum RequestStatus {
  PENDING_APPROVAL = 'Aguardando Aprovação', 
  OPEN = 'Aberto',
  WAITING_PAYMENT = 'Aguardando Pagamento', // Novo status
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluído',
  CANCELED = 'Cancelado'
}

export enum Priority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta'
}

export enum TestimonialStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  condo_name?: string; 
  block?: string; 
  apartment?: string; 
  push_enabled?: boolean;
}

export interface Condominium {
  id: string;
  name: string;
  address: string;
  syndic_id?: string;
  syndic_name?: string;
  towers: number;
  residents_count: number;
  created_at: string;
}

export interface Professional {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  active: boolean;
}

export interface ServiceRequest {
  id: string;
  protocol: string;
  type: string;
  description: string;
  priority: Priority;
  status: RequestStatus;
  syndic_id: string; 
  syndic_name: string;
  
  requester_id?: string; 
  requester_name?: string; 
  is_private: boolean; 
  unit_info?: string; 

  condo_name: string;
  professional_id?: string;
  professional_name?: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string; 
  public_notes?: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  request_id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
  role: UserRole;
}

export interface Testimonial {
  id: string;
  author_name: string;
  condo_name: string;
  message: string;
  rating: number;
  status: TestimonialStatus;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export interface MockPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
