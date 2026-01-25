---
description: Scaffold a new Antigravity web project with standard tech stack and configuration
---

# New Project Setup Workflow

This workflow initializes a new web project following the standards in `README.md`.

## 1. Project Initialization
Ask the user for the **Project Name** and **Framework Preference** (Next.js vs Vite).

### Option A: Vite (React)
```bash
npm create vite@latest [project-name] -- --template react-ts
cd [project-name]
npm install
```

### Option B: Next.js
```bash
npx create-next-app@latest [project-name] --typescript --tailwind --eslint
cd [project-name]
```

## 2. Install Dependencies
// turbo
```bash
# Testing
npm install -D vitest @testing-library/react @testing-library/dom jsdom

# Styling & UI
npm install clsx tailwind-merge lucide-react framer-motion

# State & Data
npm install @tanstack/react-query zustand
```

## 3. Configure Testing (Vitest)
Create `vitest.config.ts`:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

## 4. Setup Project Structure & Design System
1.  **Directories**: Create the feature-based structure.
    ```bash
    mkdir -p src/features src/components/ui src/lib src/hooks src/assets
    ```
2.  **Tailwind**: Initialize if not done.
3.  **Global CSS**: Ensure `src/index.css` (or `globals.css`) has standard reset and variables.
4.  **Utils**: Create `src/lib/utils.ts` for `cn` helper:
    ```typescript
    import { type ClassValue, clsx } from "clsx"
    import { twMerge } from "tailwind-merge"

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }
    ```

## 5. Import Standards (The "Soul" of the Project)
Download the latest engineering standards and AI instructions from the `antigravity-standards` repo.
```bash
# Fetch .cursorrules for AI behavior
curl -o .cursorrules https://raw.githubusercontent.com/zendaleebz/antigravity-standards/main/.cursorrules

# Fetch specific Claude instructions if needed
curl -o claude.md https://raw.githubusercontent.com/zendaleebz/antigravity-standards/main/claude.md
```

## 6. Artifact Initialization
Create the following empty artifacts in the brain directory:
-   `task.md`
-   `implementation_plan.md` (filled with the initial plan)

## 7. Verification
Run the dev server and test suite to ensure the scaffold is healthy.
```bash
npm run dev
npm run test
```
