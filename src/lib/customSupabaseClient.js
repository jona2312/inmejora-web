import { createClient } from '@supabase/supabase-js';

// Anon key is a publishable key — safe to include as fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dkarmazdckwlpmftcoeh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXJtYXpkY2t3bHBtZnRjb2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMDA4MTcsImV4cCI6MjA3OTc3NjgxN30.9ASpPJSGUGxxfIxusj1ErPJFY5C9QMSmdyHCgQwty90';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
