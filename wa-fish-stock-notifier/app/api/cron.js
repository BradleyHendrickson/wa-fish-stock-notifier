import { ProcessSubscriptionsServer } from './subscriptions';

export default async function handler(req, res) {
    ProcessSubscriptionsServer();
    res.status(200).json({ message: 'Process Subscriptions Server' });
}