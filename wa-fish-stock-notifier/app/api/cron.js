import { ProcessSubscriptionsServer } from './subscriptions';

export default async function handler(req, res) {
    console.log('Processing Subscriptions Server');
    ProcessSubscriptionsServer();
    res.status(200).json({ message: 'Process Subscriptions Server' });
}