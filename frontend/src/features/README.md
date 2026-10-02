# Adding a new feature/screen

    src/features/<name>/
      screens/        <thing>-screen.tsx        (the full screen)
      components/     pieces used only by this feature
      constants/      copy, static data
      utils/ hooks/   feature-only helpers (add when needed)
      index.ts        export only what routes need

Steps
1. Create the folder above and build the screen from `@/components/ui`, `@/theme`, `@/constants/assets`.
2. Add its images to `src/constants/assets.ts` and a row to `assets/ASSETS_TODO.md`.
3. Add the route constant in `src/constants/routes.ts`.
4. Add a one-line route file in `src/app/...`:  `export { XScreen as default } from '@/features/<name>';`
5. Only move a component to `src/components/ui` when a second feature needs it.
