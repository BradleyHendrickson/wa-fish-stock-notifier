//import { createClient } from '@/utils/supabase/server';
import { createClient } from '@/utils/supabase/client';

export default async function processSubscriptions() {
    const supabase = createClient();
    const { data, error } = await supabase.from('subscription').select('*');
    console.log(data);

}