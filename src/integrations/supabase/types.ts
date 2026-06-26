export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidate_resumes: {
        Row: {
          candidate_id: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_primary: boolean | null
          parsed_text: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          candidate_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_primary?: boolean | null
          parsed_text?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          candidate_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_primary?: boolean | null
          parsed_text?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_resumes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          ats_grade: string | null
          ats_score: number | null
          created_at: string | null
          created_by: string
          current_company: string | null
          current_ctc: number | null
          current_location: string | null
          current_title: string | null
          education_summary: string | null
          email: string | null
          expected_ctc: number | null
          first_name: string
          id: string
          last_name: string | null
          linkedin_url: string | null
          notes: string | null
          notice_period_days: number | null
          phone: string | null
          resume_text: string | null
          skills: string[] | null
          source: string | null
          source_detail: string | null
          status: string | null
          tags: string[] | null
          total_experience_years: number | null
          updated_at: string | null
        }
        Insert: {
          ats_grade?: string | null
          ats_score?: number | null
          created_at?: string | null
          created_by: string
          current_company?: string | null
          current_ctc?: number | null
          current_location?: string | null
          current_title?: string | null
          education_summary?: string | null
          email?: string | null
          expected_ctc?: number | null
          first_name: string
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          notes?: string | null
          notice_period_days?: number | null
          phone?: string | null
          resume_text?: string | null
          skills?: string[] | null
          source?: string | null
          source_detail?: string | null
          status?: string | null
          tags?: string[] | null
          total_experience_years?: number | null
          updated_at?: string | null
        }
        Update: {
          ats_grade?: string | null
          ats_score?: number | null
          created_at?: string | null
          created_by?: string
          current_company?: string | null
          current_ctc?: number | null
          current_location?: string | null
          current_title?: string | null
          education_summary?: string | null
          email?: string | null
          expected_ctc?: number | null
          first_name?: string
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          notes?: string | null
          notice_period_days?: number | null
          phone?: string | null
          resume_text?: string | null
          skills?: string[] | null
          source?: string | null
          source_detail?: string | null
          status?: string | null
          tags?: string[] | null
          total_experience_years?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      communication_logs: {
        Row: {
          application_id: string | null
          body: string | null
          candidate_id: string
          direction: string | null
          id: string
          sent_at: string | null
          sent_by: string | null
          subject: string | null
          type: string
        }
        Insert: {
          application_id?: string | null
          body?: string | null
          candidate_id: string
          direction?: string | null
          id?: string
          sent_at?: string | null
          sent_by?: string | null
          subject?: string | null
          type: string
        }
        Update: {
          application_id?: string | null
          body?: string | null
          candidate_id?: string
          direction?: string | null
          id?: string
          sent_at?: string | null
          sent_by?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_logs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_codes: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          discount_percent: number
          expires_at: string | null
          id: string
          influencer_name: string
          max_uses: number | null
          times_used: number | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          discount_percent: number
          expires_at?: string | null
          id?: string
          influencer_name: string
          max_uses?: number | null
          times_used?: number | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          discount_percent?: number
          expires_at?: string | null
          id?: string
          influencer_name?: string
          max_uses?: number | null
          times_used?: number | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          category: string
          created_at: string | null
          created_by: string
          id: string
          is_default: boolean | null
          name: string
          subject: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          body: string
          category: string
          created_at?: string | null
          created_by: string
          id?: string
          is_default?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          body?: string
          category?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_default?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
      }
      file_upload_usage: {
        Row: {
          bank_statement: number
          business_intelligence: number
          category_reports: number
          created_at: string
          last_reset_month: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_statement?: number
          business_intelligence?: number
          category_reports?: number
          created_at?: string
          last_reset_month?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_statement?: number
          business_intelligence?: number
          category_reports?: number
          created_at?: string
          last_reset_month?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_feedback: {
        Row: {
          application_id: string
          attitude_rating: number | null
          comments: string | null
          communication_rating: number | null
          culture_fit_rating: number | null
          id: string
          interview_id: string
          overall_rating: number | null
          recommendation: string | null
          strengths: string | null
          submitted_at: string | null
          submitted_by: string | null
          technical_rating: number | null
          weaknesses: string | null
        }
        Insert: {
          application_id: string
          attitude_rating?: number | null
          comments?: string | null
          communication_rating?: number | null
          culture_fit_rating?: number | null
          id?: string
          interview_id: string
          overall_rating?: number | null
          recommendation?: string | null
          strengths?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          technical_rating?: number | null
          weaknesses?: string | null
        }
        Update: {
          application_id?: string
          attitude_rating?: number | null
          comments?: string | null
          communication_rating?: number | null
          culture_fit_rating?: number | null
          id?: string
          interview_id?: string
          overall_rating?: number | null
          recommendation?: string | null
          strengths?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          technical_rating?: number | null
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_feedback_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_feedback_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          id: string
          interviewer_email: string | null
          interviewer_name: string | null
          location: string | null
          meeting_link: string | null
          mode: string | null
          notes: string | null
          scheduled_at: string
          stage_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          interviewer_email?: string | null
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          mode?: string | null
          notes?: string | null
          scheduled_at: string
          stage_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          interviewer_email?: string | null
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          mode?: string | null
          notes?: string | null
          scheduled_at?: string
          stage_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_date: string | null
          ats_grade: string | null
          ats_score: number | null
          candidate_id: string
          created_at: string | null
          current_stage_id: string | null
          experience_match: boolean | null
          id: string
          job_id: string
          matched_skills: string[] | null
          missing_skills: string[] | null
          moved_by: string | null
          rejection_reason: string | null
          skill_match_percent: number | null
          status: string | null
          updated_at: string | null
          verdict: string | null
          verdict_reason: string | null
        }
        Insert: {
          applied_date?: string | null
          ats_grade?: string | null
          ats_score?: number | null
          candidate_id: string
          created_at?: string | null
          current_stage_id?: string | null
          experience_match?: boolean | null
          id?: string
          job_id: string
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          moved_by?: string | null
          rejection_reason?: string | null
          skill_match_percent?: number | null
          status?: string | null
          updated_at?: string | null
          verdict?: string | null
          verdict_reason?: string | null
        }
        Update: {
          applied_date?: string | null
          ats_grade?: string | null
          ats_score?: number | null
          candidate_id?: string
          created_at?: string | null
          current_stage_id?: string | null
          experience_match?: boolean | null
          id?: string
          job_id?: string
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          moved_by?: string | null
          rejection_reason?: string | null
          skill_match_percent?: number | null
          status?: string | null
          updated_at?: string | null
          verdict?: string | null
          verdict_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          created_by: string
          department: string | null
          description: string | null
          experience_max: number | null
          experience_min: number | null
          filled: number | null
          id: string
          job_type: string | null
          location: string | null
          openings: number | null
          preferred_qualifications: string | null
          priority: string | null
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          tags: string[] | null
          target_hire_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          department?: string | null
          description?: string | null
          experience_max?: number | null
          experience_min?: number | null
          filled?: number | null
          id?: string
          job_type?: string | null
          location?: string | null
          openings?: number | null
          preferred_qualifications?: string | null
          priority?: string | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          tags?: string[] | null
          target_hire_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          department?: string | null
          description?: string | null
          experience_max?: number | null
          experience_min?: number | null
          filled?: number | null
          id?: string
          job_type?: string | null
          location?: string | null
          openings?: number | null
          preferred_qualifications?: string | null
          priority?: string | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          tags?: string[] | null
          target_hire_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      login_sessions: {
        Row: {
          created_at: string
          device_info: string | null
          id: string
          is_active: boolean
          logged_out_at: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          id?: string
          is_active?: boolean
          logged_out_at?: string | null
          session_token?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: string | null
          id?: string
          is_active?: boolean
          logged_out_at?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          actual_joining_date: string | null
          application_id: string
          approval_status: string | null
          approved_by: string | null
          candidate_id: string
          created_at: string | null
          created_by: string | null
          id: string
          joining_date: string | null
          notes: string | null
          offer_valid_until: string | null
          offered_ctc: number | null
          offered_title: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_joining_date?: string | null
          application_id: string
          approval_status?: string | null
          approved_by?: string | null
          candidate_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          joining_date?: string | null
          notes?: string | null
          offer_valid_until?: string | null
          offered_ctc?: number | null
          offered_title?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_joining_date?: string | null
          application_id?: string
          approval_status?: string | null
          approved_by?: string | null
          candidate_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          joining_date?: string | null
          notes?: string | null
          offer_valid_until?: string | null
          offered_ctc?: number | null
          offered_title?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          attempts: number
          created_at: string
          email: string
          expires_at: string
          id: string
          otp_code: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp_code: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          verified?: boolean
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount_inr: number
          coupon_code: string | null
          created_at: string | null
          currency: string | null
          discount_percent: number | null
          failure_reason: string | null
          id: string
          original_amount_inr: number | null
          payment_captured_at: string | null
          plan_name: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_inr: number
          coupon_code?: string | null
          created_at?: string | null
          currency?: string | null
          discount_percent?: number | null
          failure_reason?: string | null
          id?: string
          original_amount_inr?: number | null
          payment_captured_at?: string | null
          plan_name: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_inr?: number
          coupon_code?: string | null
          created_at?: string | null
          currency?: string | null
          discount_percent?: number | null
          failure_reason?: string | null
          id?: string
          original_amount_inr?: number | null
          payment_captured_at?: string | null
          plan_name?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_terminal: boolean | null
          job_id: string
          name: string
          stage_order: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_terminal?: boolean | null
          job_id: string
          name: string
          stage_order: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_terminal?: boolean | null
          job_id?: string
          name?: string
          stage_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          description: string
          display_price: string
          duration_days: number | null
          features: Json
          id: string
          label: string
          per_period: string
          popular: boolean
          price_inr: number
          sort_order: number
          updated_at: string
          upload_limit: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          display_price: string
          duration_days?: number | null
          features?: Json
          id: string
          label: string
          per_period: string
          popular?: boolean
          price_inr: number
          sort_order?: number
          updated_at?: string
          upload_limit?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          display_price?: string
          duration_days?: number | null
          features?: Json
          id?: string
          label?: string
          per_period?: string
          popular?: boolean
          price_inr?: number
          sort_order?: number
          updated_at?: string
          upload_limit?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_address: string | null
          company_name: string | null
          created_at: string | null
          email: string
          email_verified: boolean
          full_name: string | null
          gdrive_backup_meta: Json | null
          id: string
          mobile_number: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_address?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean
          full_name?: string | null
          gdrive_backup_meta?: Json | null
          id: string
          mobile_number?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_address?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean
          full_name?: string | null
          gdrive_backup_meta?: Json | null
          id?: string
          mobile_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      stage_transitions: {
        Row: {
          action: string
          application_id: string
          created_at: string | null
          from_stage_id: string | null
          id: string
          performed_by: string | null
          reason: string | null
          to_stage_id: string | null
        }
        Insert: {
          action: string
          application_id: string
          created_at?: string | null
          from_stage_id?: string | null
          id?: string
          performed_by?: string | null
          reason?: string | null
          to_stage_id?: string | null
        }
        Update: {
          action?: string
          application_id?: string
          created_at?: string | null
          from_stage_id?: string | null
          id?: string
          performed_by?: string | null
          reason?: string | null
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_transitions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_transitions_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_transitions_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          discount_percent: number | null
          expires_at: string | null
          id: string
          payment_method: string | null
          plan_duration_days: number | null
          plan_name: string
          price_inr: number
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          razorpay_subscription_id: string | null
          started_at: string | null
          status: string
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan_duration_days?: number | null
          plan_name: string
          price_inr: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          razorpay_subscription_id?: string | null
          started_at?: string | null
          status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan_duration_days?: number | null
          plan_name?: string
          price_inr?: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          razorpay_subscription_id?: string | null
          started_at?: string | null
          status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_email_exists: { Args: { input_email: string }; Returns: boolean }
      cleanup_expired_otps: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

