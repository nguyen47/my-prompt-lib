// Configuration for authentication
export const authConfig = {
  // Get credentials from environment variables
  email: process.env.AUTH_EMAIL || 'admin@promptlib.com',
  password: process.env.AUTH_PASSWORD || 'promptlib123'
};

// Validate that environment variables are set in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_EMAIL || !process.env.AUTH_PASSWORD) {
    throw new Error('AUTH_EMAIL and AUTH_PASSWORD environment variables must be set in production');
  }
}
