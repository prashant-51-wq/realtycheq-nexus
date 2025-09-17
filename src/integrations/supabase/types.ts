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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          kyc_status: string
          membership: Database["public"]["Enums"]["membership_tier"]
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          kyc_status?: string
          membership?: Database["public"]["Enums"]["membership_tier"]
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          kyc_status?: string
          membership?: Database["public"]["Enums"]["membership_tier"]
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          area: number
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string
          description: string | null
          features: Json | null
          id: string
          images: string[] | null
          is_choice: boolean
          latitude: number | null
          locality: string | null
          longitude: number | null
          micro_market: string | null
          pincode: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          saves: number
          seller_id: string
          state: string
          status: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at: string
          verified: boolean
          views: number
          year_built: number | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          area: number
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          is_choice?: boolean
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          micro_market?: string | null
          pincode: string
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          saves?: number
          seller_id: string
          state: string
          status?: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at?: string
          verified?: boolean
          views?: number
          year_built?: number | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          area?: number
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          is_choice?: boolean
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          micro_market?: string | null
          pincode?: string
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          saves?: number
          seller_id?: string
          state?: string
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
          updated_at?: string
          verified?: boolean
          views?: number
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_queries: {
        Row: {
          additional_notes: string | null
          bedrooms: number | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          email: string
          id: string
          location_preference: string | null
          name: string
          phone: string | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          query_type: string
          requirements: string | null
          status: Database["public"]["Enums"]["query_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          additional_notes?: string | null
          bedrooms?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          email: string
          id?: string
          location_preference?: string | null
          name: string
          phone?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          query_type: string
          requirements?: string | null
          status?: Database["public"]["Enums"]["query_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          additional_notes?: string | null
          bedrooms?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          email?: string
          id?: string
          location_preference?: string | null
          name?: string
          phone?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          query_type?: string
          requirements?: string | null
          status?: Database["public"]["Enums"]["query_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      membership_tier: "basic" | "standard" | "premium"
      property_status: "active" | "sold" | "off-market" | "draft"
      property_type:
        | "apartment"
        | "villa"
        | "house"
        | "plot"
        | "commercial"
        | "office"
      query_status: "pending" | "in-progress" | "completed" | "closed"
      user_role: "buyer" | "seller" | "admin" | "broker" | "owner"
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
      membership_tier: ["basic", "standard", "premium"],
      property_status: ["active", "sold", "off-market", "draft"],
      property_type: [
        "apartment",
        "villa",
        "house",
        "plot",
        "commercial",
        "office",
      ],
      query_status: ["pending", "in-progress", "completed", "closed"],
      user_role: ["buyer", "seller", "admin", "broker", "owner"],
    },
  },
} as const
