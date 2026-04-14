import { logger } from './logger';

export const handleGlobalError = (error, context = 'App') => {
  logger.error(`Critical Failure in ${context}`, error);
  // Post to error portal (e.g. Sentry/Rollbar)
  
  if (error.status === 401) {
    // Session expired: Clear local storage and redir
    localStorage.removeItem('devsetu_user');
    window.location.href = '/?error=session_expired';
  }

  if (error.code === '23505') return "You already have a similar ritual booked!";
  if (error.message?.includes("Failed to fetch")) return "Poor connectivity detected. Retrying sacred connection...";
  
  return "An unexpected disruption occurred in our spiritual network. Please try again or contact support at support@bhaktigo.com.";
};

export const withRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      logger.warn(`Operation failed, retrying (${i + 1}/${retries})...`, err);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};
