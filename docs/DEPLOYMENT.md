# Hosting the field guide

`npm run build` produces a static application in `dist/`. No backend, API key, or secrets are required.

## Download a verified production build

Successful **Quality checks** runs on GitHub save a `pokedex-production` artifact for 30 days. Open the latest successful run in **Actions → Quality checks**, then download it from the **Artifacts** section. Unzip it to obtain the production site's `index.html`, bundled assets, and public files.

The workflow runs the browser suite against `vite preview`, testing the compiled production files before uploading them. For the same local check, build first, then set `PLAYWRIGHT_PRODUCTION=1` when running `npm run test:e2e`.

This artifact uses the default root base `/`. It is ready for a root-domain static host with an SPA fallback to `index.html`. It is not the `/Pokedex/` project-Pages build; use the publish workflow below for that. Uploading a build artifact does not deploy the website. Generated `dist/` files remain excluded from Git history.

## GitHub project Pages

This repository includes a **manual** publish workflow. A push to `main` runs quality checks but does not publish a website automatically.

1. Open the repository's **Settings → Pages** and select **GitHub Actions** as the source.
2. Open **Actions → Publish GitHub Pages → Run workflow**, select `main`, and run it.
3. After the deployment succeeds, GitHub supplies the live site URL. For this repository it will normally be `https://prabhmannat.github.io/Pokedex/`.

The workflow builds with `VITE_BASE_PATH=/Pokedex/`. The router and local images use the same base. A custom `404.html` redirects direct Pokémon links to the index and restores their path before React mounts, so refreshing a detail link works on project Pages.

If you rename or fork the repository, change the workflow's base path to match the new project name. The fallback assumes a project site, not a root `username.github.io` repository.

## Root-domain static hosting

Build with the default base `/`. Configure your host to serve `index.html` for unknown paths, preserving the path for React Router. Do not use the project-Pages fallback on root hosting; use the host's SPA rewrite support instead.

Optional configuration is shown in `.env.example`. The only API setting is a public PokéAPI base URL. Never put secrets in `VITE_` variables; they are bundled into browser JavaScript.

## Before sharing

Confirm the production build, deep-link refresh, artwork, type filters, saved collection, mobile layout, and both themes. Update README links only after the deployment is verified. The README currently shows real local screenshots and does not claim an already-published demo.
