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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      allowed_domains: {
        Row: {
          created_at: string | null
          created_by: string | null
          domain: string
          id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          domain: string
          id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          domain?: string
          id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          datetime_iso: string
          group_name: string | null
          id: string
          match_date: string
          match_time: string
          next_match_id: string | null
          next_match_position: string | null
          score_a: number | null
          score_b: number | null
          stage: Database["public"]["Enums"]["match_stage"]
          status: Database["public"]["Enums"]["match_status"]
          team_a_flag: string
          team_a_id: string
          team_a_is_placeholder: boolean
          team_a_name: string
          team_b_flag: string
          team_b_id: string
          team_b_is_placeholder: boolean
          team_b_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          datetime_iso: string
          group_name?: string | null
          id: string
          match_date: string
          match_time: string
          next_match_id?: string | null
          next_match_position?: string | null
          score_a?: number | null
          score_b?: number | null
          stage: Database["public"]["Enums"]["match_stage"]
          status?: Database["public"]["Enums"]["match_status"]
          team_a_flag?: string
          team_a_id: string
          team_a_is_placeholder?: boolean
          team_a_name: string
          team_b_flag?: string
          team_b_id: string
          team_b_is_placeholder?: boolean
          team_b_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          datetime_iso?: string
          group_name?: string | null
          id?: string
          match_date?: string
          match_time?: string
          next_match_id?: string | null
          next_match_position?: string | null
          score_a?: number | null
          score_b?: number | null
          stage?: Database["public"]["Enums"]["match_stage"]
          status?: Database["public"]["Enums"]["match_status"]
          team_a_flag?: string
          team_a_id?: string
          team_a_is_placeholder?: boolean
          team_a_name?: string
          team_b_flag?: string
          team_b_id?: string
          team_b_is_placeholder?: boolean
          team_b_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      predictions: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          points_earned: number
          predicted_score_a: number
          predicted_score_b: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          points_earned?: number
          predicted_score_a: number
          predicted_score_b: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          points_earned?: number
          predicted_score_a?: number
          predicted_score_b?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string
          created_at: string | null
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string
          created_at?: string | null
          id: string
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          flag: string
          group_name: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          flag: string
          group_name: string
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          flag?: string
          group_name?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar: string | null
          exact_matches: number | null
          name: string | null
          role: string | null
          total_correct: number | null
          total_points: number | null
          user_id: string | null
          winner_matches: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_group_standings: {
        Args: { p_group_name: string }
        Returns: {
          draws: number
          goal_difference: number
          goals_against: number
          goals_for: number
          losses: number
          played: number
          points: number
          team_flag: string
          team_id: string
          team_name: string
          wins: number
        }[]
      }
      reset_all_matches: { Args: never; Returns: undefined }
    }
    Enums: {
      match_stage: "FG" | "8vos" | "CF" | "SF" | "F"
      match_status: "Pending" | "Live" | "Finished"
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
    Enums: {
      match_stage: ["FG", "8vos", "CF", "SF", "F"],
      match_status: ["Pending", "Live", "Finished"],
    },
  },
} as const
