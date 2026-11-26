import { defineConfig, loadEnv } from 'vite';
import { timingSafeEqual } from 'node:crypto';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      middlewareMode: false,
    },
    plugins: [{
      name: 'portfolio-admin-auth',
      configureServer(server) {
        server.middlewares.use('/api/admin/verify', (req, res, next) => {
          if (req.method !== 'POST') return next();
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            let submitted = '';
            try { submitted = JSON.parse(body).password || ''; } catch {}
            const expected = Buffer.from(env.ADMIN_PASSWORD || '');
            const attempt = Buffer.from(submitted);
            const valid = expected.length > 0 && expected.length === attempt.length && timingSafeEqual(expected, attempt);
            res.statusCode = valid ? 200 : 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ valid }));
          });
        });
      },
    }],
  };
});
