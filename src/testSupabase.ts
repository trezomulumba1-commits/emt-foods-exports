import { supabase } from './lib/supabaseClient';

async function test() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('DATA:', data);
  console.log('ERROR:', error);
}

test();
