import express, { json as bodyParser, staticMiddleware } from './micro-express.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { Agent as HttpsAgent } from 'https';

// factory to create the express application so tests can instantiate it
export function createApp(fetchImpl = fetch) {
  const app = express();

  // Resolve directory of this file in ES module context
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Serve static files from ../src which contains the PWA assets
  app.use(staticMiddleware(path.join(__dirname, '../src')));

  app.use(bodyParser());

  const UNRAID_HOST = process.env.UNRAID_HOST;
  if (!UNRAID_HOST) {
    throw new Error('UNRAID_HOST environment variable is required');
  }
  const UNRAID_TOKEN = process.env.UNRAID_TOKEN || '';
  const ALLOW_SELF_SIGNED = process.env.ALLOW_SELF_SIGNED === 'true';
  const httpsAgent = ALLOW_SELF_SIGNED && UNRAID_HOST.startsWith('https')
    ? new HttpsAgent({ rejectUnauthorized: false })
    : undefined;

  let cookies = '';
  let csrfToken = '';

  // Retrieve CSRF token and session cookie from the Unraid server
  async function ensureCsrf() {
    if (csrfToken) return;
    const headers = { 'Content-Type': 'application/json' };
    if (UNRAID_TOKEN) headers['Authorization'] = `Bearer ${UNRAID_TOKEN}`;
    const res = await fetchImpl(`${UNRAID_HOST}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: 'query { csrfToken }' }),
      agent: httpsAgent
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) cookies = setCookie;
    const data = await res.json();
    csrfToken = data.data && data.data.csrfToken;
  }

  // Proxy incoming GraphQL requests to the Unraid server
  app.post('/graphql', async (req, res) => {
    try {
      await ensureCsrf();
      const headers = {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-CSRF-TOKEN': csrfToken
      };
      // forward Authorization header from client or use default token
      if (req.headers.authorization || UNRAID_TOKEN) {
        headers['Authorization'] = req.headers.authorization || `Bearer ${UNRAID_TOKEN}`;
      }
      const upstream = await fetchImpl(`${UNRAID_HOST}/graphql`, {
        method: 'POST',
        headers,
        body: JSON.stringify(req.body),
        agent: httpsAgent
      });
      const newCookie = upstream.headers.get('set-cookie');
      if (newCookie) cookies = newCookie;
      res.status(upstream.status);
      res.set('Content-Type', 'application/json');
      res.send(await upstream.text());
    } catch (err) {
      console.error('Proxy error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}
