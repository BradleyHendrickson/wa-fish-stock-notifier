
import processSubscriptions from "./processSubscriptions";
import { createClient } from '@/utils/supabase/client';

export default async function processSubscriptionsClient() {
    const supabase = createClient();

    await processSubscriptions(supabase);
}