import { createClient } from '@supabase/supabase-js';
import { REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY } from '@env';

// Get the environment variables from the @env package
const supabaseUrl = REACT_APP_SUPABASE_URL;
const supabaseAnonKey = REACT_APP_SUPABASE_ANON_KEY;

// Initialize the Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;
