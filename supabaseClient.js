import { createClient } from '@supabase/supabase-js';

// Replace these with your real values from Supabase > Project > Settings > API
const supabaseUrl = 'https://pklapdragjgmrwrzkbeh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbGFwZHJhZ2pnbXJ3cnprYmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNjQwODMsImV4cCI6MjA3MDk0MDA4M30.Z_BOMRNzzumiCRN166McpfaHoxHGmfYJUQK83BReuEc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);