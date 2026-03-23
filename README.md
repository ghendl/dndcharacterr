# Forge of Fates — patched build

This package is a cleaned-up, deployment-oriented version of your uploaded project.

## What was patched

- React 18 now matches `@types/react` 18.
- Tailwind config uses typed `export default`, which is safer in strict TS projects.
- Core App Router structure was completed so Vercel can compile the project end to end.
- Supabase helpers, middleware, API routes, hooks, styles, and SQL files were reorganized into a standard Next.js layout.
- A compact responsive shell was added so the project is less cramped on mobile.

## Important

You still need to set these Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Local test

```bash
npm install
npm run build
```

If your original repo contains more pages/components than the files you uploaded here, merge those back in gradually after confirming this patched baseline builds correctly.
