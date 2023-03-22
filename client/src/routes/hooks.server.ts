import * as SentryNode from '@sentry/node';
import '@sentry/tracing';
import type { HandleServerError } from '@sveltejs/kit';

SentryNode.init({
  dsn: 'https://4954237dfa3c4c2596251f8dce5c018f@o4504879295627264.ingest.sentry.io/4504879296610304',
  tracesSampleRate: 1.0,
  // Add the Http integration for tracing
  integrations: [new SentryNode.Integrations.Http()]
});

SentryNode.setTag('svelteKit', 'client-server');

// use handleError to report errors during server-side data loading
export const handleError = (({ error, event }) => {
  SentryNode.captureException(error, { contexts: { sveltekit: { event } } });

  return {
    message: error.message,
  };
}) satisfies HandleServerError;