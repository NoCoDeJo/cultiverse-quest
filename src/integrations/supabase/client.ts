// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mdczcmmiwujhrrggddfb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY3pjbW1pd3VqaHJyZ2dkZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTg3NDYsImV4cCI6MjA1MTIzNDc0Nn0.S5yCg72FZFuiEaNZ3y3oVkLRNevKEEeKWwCUf8aL7Us";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);