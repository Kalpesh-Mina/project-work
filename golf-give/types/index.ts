export type UserRole = 'subscriber' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing'
export type SubscriptionPlan = 'monthly' | 'yearly'

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  charity_percentage: number
  selected_charity_id: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  score_date: string
  created_at: string
  updated_at: string
}

export interface Charity {
  id: string
  name: string
  description: string | null
  long_description: string | null
  image_url: string | null
  website_url: string | null
  is_featured: boolean
  is_active: boolean
  events: CharityEvent[]
  created_at: string
  updated_at: string
}

export interface CharityEvent {
  name: string
  date: string
  location: string
  description: string
}

export type DrawStatus = 'pending' | 'simulation' | 'published' | 'completed'
export type AlgorithmType = 'random' | 'algorithmic'

export interface Draw {
  id: string
  month: number
  year: number
  status: DrawStatus
  draw_numbers: number[]
  algorithm_type: AlgorithmType
  jackpot_amount: number
  jackpot_carried_forward: boolean
  simulation_results: unknown | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface DrawEntry {
  id: string
  draw_id: string
  user_id: string
  scores_snapshot: { score: number; date: string }[]
  entered_at: string
}

export interface PrizePool {
  id: string
  draw_id: string
  total_pool: number
  five_match_pool: number
  four_match_pool: number
  three_match_pool: number
  jackpot_rollover: number
  active_subscriber_count: number
  created_at: string
  updated_at: string
}

export type PaymentStatus = 'pending' | 'verified' | 'paid' | 'rejected'

export interface DrawResult {
  id: string
  draw_id: string
  user_id: string
  match_type: 3 | 4 | 5
  matched_numbers: number[]
  prize_amount: number
  payment_status: PaymentStatus
  created_at: string
  updated_at: string
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export interface WinnerVerification {
  id: string
  draw_result_id: string
  user_id: string
  screenshot_url: string
  status: VerificationStatus
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  submitted_at: string
}
