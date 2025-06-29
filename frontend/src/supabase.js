import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rasbfgnfgoqlrbyjxypx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhc2JmZ25mZ29xbHJieWp4eXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDc3MzksImV4cCI6MjA2Njc4MzczOX0.KyHSYJxedh1dMwHKHYwa99BDvGPHQu6SMXFuf_sx4P4'

export const supabase = createClient(supabaseUrl, supabaseKey)
