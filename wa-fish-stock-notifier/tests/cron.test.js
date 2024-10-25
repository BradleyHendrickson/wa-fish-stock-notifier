// Import the function using ES module syntax
import { processSubscriptionsCron } from '../cron.js';

// Jest test suite
describe('processSubscriptionsCron', () => {
  it('should run the processSubscriptionsCron function without errors', async () => {
    // Call the function and await its result if it's async
    await expect(processSubscriptionsCron()).resolves.not.toThrow();
  });
});
