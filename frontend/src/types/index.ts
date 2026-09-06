export interface Source {
  id: number;
  title: string;
  organization: string;
  author?: string;
  source_type: string;
  url: string;
  description?: string;
  verification_status: string;
  accessed_at: string;
}

export interface TraditionSummary {
  id: number;
  name: string;
  slug: string;
  region: string;
  state: string;
  community?: string;
  category: string;
  short_description: string;
  experience_type: string;
  hero_image: string;
  thumbnail: string;
  status: string;
}

export interface ExperienceItem {
  id: number;
  experience_id: number;
  title: string;
  order_index: number;
  category_or_style?: string;
  description: string;
  cultural_context?: string;
  regional_perspective?: string;
  image_url?: string;
  tool_or_material?: string;
  source?: Source;
}

export interface Experience {
  id: number;
  tradition_id: number;
  type: string;
  title: string;
  description?: string;
  items: ExperienceItem[];
}

export interface ARHotspot {
  id: number;
  ar_experience_id: number;
  name: string;
  x: number;
  y: number;
  content: string;
  cultural_context?: string;
  regional_perspective?: string;
  audio_url?: string;
  animation_type: string;
  source?: Source;
}

export interface ARExperience {
  id: number;
  tradition_id: number;
  target_image: string;
  target_descriptor?: string;
  instructions: string;
  status: string;
  hotspots: ARHotspot[];
}

export interface TraditionDetail extends TraditionSummary {
  description: string;
  historical_context?: string;
  cultural_significance?: string;
  preservation_context?: string;
  sources: Source[];
  experiences: Experience[];
  ar_experience?: ARExperience;
  approved_contributions?: Contribution[];
  has_quiz: boolean;
}

export interface QuizOption {
  id: number;
  option_text: string;
  order_index: number;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  order_index: number;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  tradition_id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizQuestionResult {
  question_id: number;
  question_text: string;
  selected_option_id?: number;
  correct_option_id: number;
  is_correct: boolean;
  explanation: string;
  source?: Source;
}

export interface QuizSubmitResponse {
  quiz_id: number;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  results: QuizQuestionResult[];
}

export interface Contribution {
  id: number;
  contributor_name: string;
  email: string;
  tradition_id?: number;
  tradition_name: string;
  region: string;
  location: string;
  description: string;
  cultural_significance?: string;
  media_url?: string;
  source_reference?: string;
  consent_given: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewer_notes?: string;
  created_at: string;
}

export interface ContributionCreate {
  contributor_name: string;
  email: string;
  tradition_id?: number;
  tradition_name: string;
  region: string;
  location: string;
  description: string;
  cultural_significance?: string;
  media_url?: string;
  source_reference?: string;
  consent_given: boolean;
}

export interface AdminStats {
  total_traditions: number;
  pending_contributions: number;
  approved_contributions: number;
  rejected_contributions: number;
  total_sources: number;
}

export interface AdminTradition extends TraditionSummary {
  hotspots_count: number;
  quiz_count: number;
  contributions_count: number;
  sources_count: number;
}

export interface TraditionCreateInput {
  name: string;
  slug: string;
  region: string;
  state: string;
  community?: string;
  category: string;
  short_description: string;
  description: string;
  historical_context?: string;
  cultural_significance?: string;
  preservation_context?: string;
  experience_type: string;
  hero_image: string;
  thumbnail: string;
  status: string;
}

export interface TraditionUpdateInput {
  name?: string;
  slug?: string;
  region?: string;
  state?: string;
  community?: string;
  category?: string;
  short_description?: string;
  description?: string;
  historical_context?: string;
  cultural_significance?: string;
  preservation_context?: string;
  experience_type?: string;
  hero_image?: string;
  thumbnail?: string;
  status?: string;
}

export interface SourceCreateInput {
  title: string;
  organization: string;
  author?: string;
  source_type: string;
  url: string;
  description?: string;
  verification_status: string;
}

export interface SourceUpdateInput {
  title?: string;
  organization?: string;
  author?: string;
  source_type?: string;
  url?: string;
  description?: string;
  verification_status?: string;
}

export interface AdminAuditData {
  database_status: string;
  server_timestamp: string;
  metrics: {
    traditions: number;
    published_traditions: number;
    sources: number;
    verified_sources: number;
    contributions_total: number;
    contributions_pending: number;
    contributions_approved: number;
    users: number;
    ar_hotspots: number;
    quiz_questions: number;
  };
  narration_voice_engines: {
    english: string;
    hindi: string;
    marathi: string;
    cache_status: string;
  };
  heritage_assets_verified: string[];
}

