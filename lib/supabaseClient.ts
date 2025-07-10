// Mock data solution - Supabase removed
// Bu dosya artık sadece mock veri sağlıyor

export const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null })
      })
    }),
    insert: () => Promise.resolve({ data: null, error: null })
  })
}

// Eski Supabase client'ı kaldırıldı
export const supabase = mockSupabase 