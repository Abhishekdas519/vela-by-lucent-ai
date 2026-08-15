export type UserRole = 'visitor' | 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName: string;
  clientId?: string;
  avatarUrl?: string;
}

export interface ClientProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
  status: 'active' | 'trial' | 'suspended';
  vapiAssistantId: string;
  vapiVoiceId: string;
  vapiVoiceName: string;
  twilioPhoneNumber: string;
  twilioAccountSid?: string;
  systemPrompt: string;
  firstMessage: string;
  talktimeMinutesTotal: number;
  talktimeMinutesUsed: number;
  activeLines: number;
  callingHoursStart: string; // e.g. "09:00"
  callingHoursEnd: string;   // e.g. "18:00"
  timezone: string;
  autoFollowupEnabled: boolean;
  followupDelayHours: number; // e.g. 12
  subscriptionPlan?: string;
  stripeCustomerId?: string;
  createdAt: string;
}

export interface CallTranscriptMessage {
  speaker: 'agent' | 'lead';
  text: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  title?: string;
  notes?: string;
  status: 'pending' | 'calling' | 'completed' | 'failed' | 'followup_queued';
  callDurationSeconds?: number;
  callStartedAt?: string;
  callEndedAt?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  conversionChance?: number; // 0 - 100 percentage
  aiConclusion?: string;
  keyObjections?: string[];
  followupScheduledAt?: string;
  followupSent?: boolean;
  followupDraft?: {
    channel: 'email' | 'sms';
    subject?: string;
    body: string;
  };
  transcript?: CallTranscriptMessage[];
  recordingUrl?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  competitorPrice: number; // For highlighting 10% lower pricing
  includedMinutes: number;
  overageRatePerMinute: number;
  popular?: boolean;
  features: string[];
}

export interface MinutePackage {
  id: string;
  name: string;
  minutes: number;
  price: number;
  pricePerMinute: number;
  discountPercentage: number;
  badge?: string;
}

export interface CallCenterComparison {
  metric: string;
  humanCallCenter: string;
  velaAiAgent: string;
  savings: string;
}

export interface CaseStudyProof {
  company: string;
  logoText: string;
  industry: string;
  representative: string;
  role: string;
  headline: string;
  dialsPerDay: string;
  conversionRate: string;
  monthlySavings: string;
  quote: string;
}

export interface AdminNotification {
  id: string;
  type: 'signup' | 'purchase_request' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
