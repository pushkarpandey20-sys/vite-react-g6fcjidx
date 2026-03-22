const IS_PROD = process.env.NODE_ENV === 'production';

export const logger = {
  info: (msg, data = {}) => {
    if (!IS_PROD) console.log(`[INFO] 🕉️ ${msg}`, data);
    // In real prod: push to LogRocket/Datadog/etc.
  },
  warn: (msg, data = {}) => {
    if (!IS_PROD) console.warn(`[WARN] ⚠️ ${msg}`, data);
  },
  error: (msg, error = {}) => {
    console.error(`[ERROR] ❌ ${msg}`, error);
    // Remote error reporter (e.g. Sentry)
    // Sentry.captureException(error);
  },
  ritual: (msg, meta = {}) => {
    // Custom ritual lifecycle logging
    if (!IS_PROD) console.info(`[RITUAL] 📿 ${msg}`, meta);
  }
};
