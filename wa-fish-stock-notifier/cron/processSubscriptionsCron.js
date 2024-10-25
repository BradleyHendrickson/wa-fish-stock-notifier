import { createClient } from '@/utils/supabase/server';

import processSubscriptionsCronJob from "./processSubscriptionsCronJob";

export default async function processSubscriptionsCron() {
    const supabase = createClient();

    await processSubscriptionsCronJob(supabase);
}