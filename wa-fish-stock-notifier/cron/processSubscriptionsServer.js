
import processSubscriptions from "./processSubscriptions";
import { createClient } from '@/utils/supabase/server';

export default async function processSubscriptionsServer() {
    const supabase = createClient();

    await processSubscriptions(supabase);
}