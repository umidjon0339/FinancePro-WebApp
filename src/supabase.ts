import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR ACTUAL KEYS FROM SUPABASE DASHBOARD
const supabaseUrl = 'https://xgervcxmcyruajidextr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZXJ2Y3htY3lydWFqaWRleHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODYxODYsImV4cCI6MjA4NDA2MjE4Nn0.tgHlepHhrAvz9RiGc5uiI5zDRoBLpfRepixsGHIr7a8';

export const supabase = createClient(supabaseUrl, supabaseKey);