export interface Product {
  id: string;
  created_at?: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number; 
  qualityGrade: string;
  moisturePercent?: number;
  batchNumber: string;
  warehouse: string;
  inspectionNotes?: string;
  harvestDate: string;
  supplier: string;
  expiryDate?: string;
}

export interface ProductTranslation {
  id: string;
  product_id: string;
  language_code: string;
  name: string;
  description: string;
  created_at?: string;
}

export interface QuoteRequest {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  product_name?: string;
  requested_quantity?: number;
  destination_country?: string;
  message?: string;
  status?: string;
}

export interface ExportStatusUpdate {
  id: string;
  created_at: string;
  export_order_id: string;
  status: string;
  remarks?: string;
  updated_by?: string;
}

export interface ExportOrder {
  id: string;
  created_at: string;
  order_reference: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  destination_country: string;
  export_status: 'Pending' | 'Preparing Products' | 'Quality Inspection' | 'Documentation' | 'Ready for Export' | 'Handed to Carrier' | 'Completed' | 'Cancelled';
  carrier_name?: string;
  carrier_tracking_number?: string;
  expected_delivery?: string;
  notes?: string;
  product_name?: string;
}

export interface ContactMessage {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type UserRole =
  | 'guest'
  | 'customer'
  | 'supplier'
  | 'support_admin'
  | 'content_admin'
  | 'operations_admin'
  | 'finance_admin'
  | 'super_admin';

export const ADMIN_ROLES: UserRole[] = [
  'support_admin',
  'content_admin',
  'operations_admin',
  'finance_admin',
  'super_admin',
];

export const CONTENT_ROLES: UserRole[] = ['content_admin', 'super_admin'];
export const OPERATIONS_ROLES: UserRole[] = ['operations_admin', 'super_admin'];
export const FINANCE_ROLES: UserRole[] = ['finance_admin', 'super_admin'];
export const SUPPORT_ROLES: UserRole[] = ['support_admin', 'super_admin'];

export function hasRole(profile: UserProfile | null, allowed: UserRole[]): boolean {
  if (!profile?.role) return false;
  return allowed.includes(profile.role as UserRole);
}

export interface UserProfile {
  id: string;
  created_at?: string;
  full_name?: string;
  company_name?: string;
  phone_number?: string;
  shipping_address?: string;
  role?: UserRole;
}
