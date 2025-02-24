import NodeCache from 'node-cache';

// Simple in-memory cache
export const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 60 // Check for expired keys every minute
});

export const invalidateBookCache = (bookId: number) => {
  cache.del(`book:${bookId}`);
}; 