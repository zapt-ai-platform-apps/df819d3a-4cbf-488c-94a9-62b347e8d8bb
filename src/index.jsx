import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import App from './App';
import './index.css';

// Sentry error logging
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  environment: import.meta.env.VITE_PUBLIC_APP_ENV,
  integrations: [Sentry.browserTracingIntegration()],
  initialScope: {
    tags: {
      type: 'frontend',
      projectId: import.meta.env.VITE_PUBLIC_APP_ID
    }
  }
});

// Umami stats tracking
if (!window.location.hostname.includes('vercel.app')) {
  const umamiScript = document.createElement('script');
  umamiScript.setAttribute('src', 'https://cloud.umami.is/script.js');
  umamiScript.setAttribute('data-website-id', import.meta.env.VITE_PUBLIC_UMAMI_WEBSITE_ID);
  umamiScript.setAttribute('defer', 'true');
  document.head.appendChild(umamiScript);
}

render(() => (
  <Router>
    <App />
  </Router>
), document.getElementById('root'));