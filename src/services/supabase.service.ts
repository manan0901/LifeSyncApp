import { createClient } from '@supabase/supabase-js';

// Load environment variables
// In a real app, these would be loaded from .env file
// For development, we'll use placeholder values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

// Database functions
export const getDataFromTable = async (table: string) => {
  return await supabase.from(table).select('*');
};

export const insertDataIntoTable = async (table: string, data: any) => {
  return await supabase.from(table).insert(data);
};

export const updateDataInTable = async (table: string, data: any, match: any) => {
  return await supabase.from(table).update(data).match(match);
};

export const deleteDataFromTable = async (table: string, match: any) => {
  return await supabase.from(table).delete().match(match);
};

export default {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getDataFromTable,
  insertDataIntoTable,
  updateDataInTable,
  deleteDataFromTable,
};
