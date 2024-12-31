export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cult_activities: {
        Row: {
          actor_id: string | null
          cult_id: string
          description: string
          id: string
          metadata: Json | null
          timestamp: string
          type: string
        }
        Insert: {
          actor_id?: string | null
          cult_id: string
          description: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          type: string
        }
        Update: {
          actor_id?: string | null
          cult_id?: string
          description?: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cult_activities_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cult_activities_cult_id_fkey"
            columns: ["cult_id"]
            isOneToOne: false
            referencedRelation: "cults"
            referencedColumns: ["id"]
          },
        ]
      }
      cult_agents: {
        Row: {
          capabilities: Json | null
          created_at: string
          cult_id: string | null
          description: string | null
          id: string
          is_active: boolean | null
          knowledge: Json | null
          name: string
          personality: string | null
          updated_at: string
        }
        Insert: {
          capabilities?: Json | null
          created_at?: string
          cult_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          knowledge?: Json | null
          name: string
          personality?: string | null
          updated_at?: string
        }
        Update: {
          capabilities?: Json | null
          created_at?: string
          cult_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          knowledge?: Json | null
          name?: string
          personality?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cult_agents_cult_id_fkey"
            columns: ["cult_id"]
            isOneToOne: false
            referencedRelation: "cults"
            referencedColumns: ["id"]
          },
        ]
      }
      cult_invites: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          cult_id: string
          current_uses: number | null
          expires_at: string | null
          id: string
          max_uses: number | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          cult_id: string
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          cult_id?: string
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cult_invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cult_invites_cult_id_fkey"
            columns: ["cult_id"]
            isOneToOne: false
            referencedRelation: "cults"
            referencedColumns: ["id"]
          },
        ]
      }
      cult_members: {
        Row: {
          cult_id: string
          invite_id: string | null
          joined_at: string
          profile_id: string
          role: string
        }
        Insert: {
          cult_id: string
          invite_id?: string | null
          joined_at?: string
          profile_id: string
          role?: string
        }
        Update: {
          cult_id?: string
          invite_id?: string | null
          joined_at?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "cult_members_cult_id_fkey"
            columns: ["cult_id"]
            isOneToOne: false
            referencedRelation: "cults"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cult_members_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "cult_invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cult_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cults: {
        Row: {
          banner_url: string | null
          created_at: string
          cult_type: string
          description: string | null
          founder_id: string | null
          id: string
          linked_agents_count: number | null
          logo_url: string | null
          name: string
          parent_cult_id: string | null
          theme_color: string | null
          twitter_handle: string | null
          updated_at: string
          visibility: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          cult_type?: string
          description?: string | null
          founder_id?: string | null
          id?: string
          linked_agents_count?: number | null
          logo_url?: string | null
          name: string
          parent_cult_id?: string | null
          theme_color?: string | null
          twitter_handle?: string | null
          updated_at?: string
          visibility?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          cult_type?: string
          description?: string | null
          founder_id?: string | null
          id?: string
          linked_agents_count?: number | null
          logo_url?: string | null
          name?: string
          parent_cult_id?: string | null
          theme_color?: string | null
          twitter_handle?: string | null
          updated_at?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cults_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cults_parent_cult_id_fkey"
            columns: ["parent_cult_id"]
            isOneToOne: false
            referencedRelation: "cults"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          banner_image_url: string | null
          created_at: string
          id: string
          profile_image_url: string | null
          sacred_name: string
          updated_at: string
          worthiness_score: number | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string
          id: string
          profile_image_url?: string | null
          sacred_name: string
          updated_at?: string
          worthiness_score?: number | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string
          id?: string
          profile_image_url?: string | null
          sacred_name?: string
          updated_at?: string
          worthiness_score?: number | null
        }
        Relationships: []
      }
      ritual_participants: {
        Row: {
          id: string
          joined_at: string
          points_earned: number | null
          profile_id: string
          ritual_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          points_earned?: number | null
          profile_id: string
          ritual_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          points_earned?: number | null
          profile_id?: string
          ritual_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raid_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ritual_participants_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "rituals"
            referencedColumns: ["id"]
          },
        ]
      }
      rituals: {
        Row: {
          created_at: string
          cult_id: string
          ended_at: string | null
          id: string
          participants_count: number | null
          points_pool: number | null
          status: string
          target_url: string
        }
        Insert: {
          created_at?: string
          cult_id: string
          ended_at?: string | null
          id?: string
          participants_count?: number | null
          points_pool?: number | null
          status?: string
          target_url: string
        }
        Update: {
          created_at?: string
          cult_id?: string
          ended_at?: string | null
          id?: string
          participants_count?: number | null
          points_pool?: number | null
          status?: string
          target_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "raids_cult_id_fkey"
            columns: ["cult_id"]
            isOneToOne: false
            referencedRelation: "cults"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_worthiness_score: {
        Args: {
          profile_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
