export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  generation_count_today: number;
  last_generation_date: string;
  created_at: string;
  updated_at: string;
}

export interface Design {
  id: string;
  user_id: string;
  jewelry_type: string;
  design_style: string;
  metal: string;
  emerald_type: string;
  complementary_stones: string | null;
  engraving: boolean;
  additional_notes: string | null;
  image_url: string | null;
  image_persisted: boolean;
  status: "generated" | "quote_requested" | "contacted" | "completed";
  created_at: string;
  updated_at: string;
  quote_requests?: QuoteRequest[];
}

export interface QuoteRequest {
  id: string;
  user_id: string;
  design_id: string;
  contact_preference: string | null;
  advisor_notes: string | null;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface ContactRequest {
  full_name: string;
  email: string;
  phone: string;
  request_type: "showroom" | "cotizacion" | "asesoria_virtual" | "contacto_general";
  message?: string;
}

export interface DesignerState {
  currentStep: number;
  jewelryType: string | null;
  designStyle: string | null;
  metal: string | null;
  emeraldType: string | null;
  complementaryStones: string | null;
  engraving: boolean;
  additionalNotes: string;
  generatedImageUrl: string | null;
  designId: string | null;
  isGenerating: boolean;
  error: string | null;
  generationsRemaining: number;
}

export interface GenerateDesignResponse {
  designId: string;
  imageUrl: string;
  generationsRemaining: number;
}
