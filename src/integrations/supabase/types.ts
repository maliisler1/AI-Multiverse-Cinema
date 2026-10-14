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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      episode_titles: {
        Row: {
          episode_id: string
          lang: string
          title: string
        }
        Insert: {
          episode_id: string
          lang: string
          title: string
        }
        Update: {
          episode_id?: string
          lang?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "episode_titles_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          duration_sec: number | null
          id: string
          minutes: number
          n: number
          series_id: string
          status: string
          video_url: string | null
        }
        Insert: {
          duration_sec?: number | null
          id?: string
          minutes?: number
          n: number
          series_id: string
          status?: string
          video_url?: string | null
        }
        Update: {
          duration_sec?: number | null
          id?: string
          minutes?: number
          n?: number
          series_id?: string
          status?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          audio_lang: string
          created_at: string
          display_name: string
          email: string | null
          lang_chosen: boolean
          photo_url: string | null
          sub_lang: string
          tokens: number
          ui_lang: string
          user_id: string
        }
        Insert: {
          audio_lang?: string
          created_at?: string
          display_name?: string
          email?: string | null
          lang_chosen?: boolean
          photo_url?: string | null
          sub_lang?: string
          tokens?: number
          ui_lang?: string
          user_id: string
        }
        Update: {
          audio_lang?: string
          created_at?: string
          display_name?: string
          email?: string | null
          lang_chosen?: boolean
          photo_url?: string | null
          sub_lang?: string
          tokens?: number
          ui_lang?: string
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: string
          created_at: string
          id: string
          pack_id: string
          status: string
          tokens: number
          user_id: string
        }
        Insert: {
          amount: string
          created_at?: string
          id?: string
          pack_id: string
          status?: string
          tokens: number
          user_id: string
        }
        Update: {
          amount?: string
          created_at?: string
          id?: string
          pack_id?: string
          status?: string
          tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          category: string
          id: string
          poster_url: string | null
          slug: string
          sort: number
          status: string
          title: string
        }
        Insert: {
          category: string
          id?: string
          poster_url?: string | null
          slug: string
          sort?: number
          status?: string
          title: string
        }
        Update: {
          category?: string
          id?: string
          poster_url?: string | null
          slug?: string
          sort?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      series_text: {
        Row: {
          description: string | null
          lang: string
          series_id: string
          tagline: string | null
        }
        Insert: {
          description?: string | null
          lang: string
          series_id: string
          tagline?: string | null
        }
        Update: {
          description?: string | null
          lang?: string
          series_id?: string
          tagline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "series_text_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          episode_id: string
          id: string
          kind: string
          lang: string
          status: string
          url: string | null
        }
        Insert: {
          episode_id: string
          id?: string
          kind: string
          lang: string
          status?: string
          url?: string | null
        }
        Update: {
          episode_id?: string
          id?: string
          kind?: string
          lang?: string
          status?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      unlocked_episodes: {
        Row: {
          created_at: string
          episode_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          episode_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          episode_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_episodes_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean
          episode_id: string
          position_sec: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          episode_id: string
          position_sec?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          episode_id?: string
          position_sec?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buy_pack: {
        Args: { p_amount: string; p_pack_id: string; p_tokens: number }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      unlock_episode: {
        Args: { p_cost: number; p_episode_id: string }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
