# Antigravity Engineering Standards

This document is the **Single Source of Truth** for all Antigravity engineering projects. It codifies our technology choices, coding standards, and design philosophy.

## 1. Core Philosophy

**"It's not done until it wows."**

We build software that feels *premium*, *alive*, and *robust*. We prioritize interaction design just as highly as code quality.

## 2. Technology Stack

### Essentials
-   **Runtime**: Node.js (LTS).
-   **Language**: TypeScript (Strict Mode). **No `any`**, ever.
-   **Package Manager**: `npm`.
-   **Frameworks**:
    -   **Web Apps**: Next.js (App Router).
    -   **Marketing/Landing**: Vite + React or Astro.

### Styling & UI
-   **Tailwind CSS**: Mandatory. Utilize `clsx` and `tailwind-merge` for conditional classes.
-   **Icons**: `lucide-react`.
-   **Animation**: `framer-motion` for complex interactions; CSS transitions for simple states.
-   **Components**: Build composed, headless logic where possible.

### State & Data
-   **Server State**: TanStack Query (React Query) or SWR. Avoid `useEffect` for data fetching.
-   **Client State**: Zustand (preferred) or React Context for simple dependency injection. **Avoid Redux**.

### Testing
-   **Unit**: Vitest.
-   **E2E**: Playwright.
-   **Philosophy**: "Test behavior, not implementation details."

## 3. Coding Standards

### TypeScript
-   **Explicit Return Types**: All functions must have explicit return types.
-   **Interfaces over Types**: Use `interface` for object definitions (better error messages/performance).
-   **No Enums**: Use `const` assertions (`as const`) instead.
    ```typescript
    // DO THIS
    export const Status = {
      Active: 'active',
      Inactive: 'inactive',
    } as const;
    export type Status = typeof Status[keyof typeof Status];
    ```

### React Patterns
-   **Functional Components**: Arrow functions preferred.
-   **Hooks**: Extract complex logic into custom hooks (`useValidation`, `useAuth`).
-   **Composition**: Use `children` prop to solve prop drilling.
-   **Event Handlers**: Prefix with `handle` (e.g., `handleSubmit`, `handleClick`).
-   **Props**: Prefix with `on` (e.g., `onSubmit`, `onClick`).

### CSS / Styling
-   **Mobile First**: Write mobile styles by default, use `md:`, `lg:` for larger screens.
-   **Tokens**: Use CSS variables for colors to support theming (Dark Mode).

## 4. Project Structure (Feature-Based)

Structure applications by **feature**, not technical layer.

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── dashboard/
├── components/          # Shared/Global components (Button, Input)
├── lib/                 # Shared utilities (axios, cn)
└── app/                 # Next.js App Router (pages only)
```

## 5. Design Guidelines

### The "Antigravity" Aesthetic
1.  **Glassmorphism**: Subtle, multi-layered blurs/transparency.
2.  **Typography**: Inter or similar variable sans-serif. Tight tracking (-0.02em approx).
3.  **Interaction**:
    -   All interactive elements must have `:hover`, `:active`, and `:focus-visible` states.
    -   Transitions should be `duration-200 ease-out`.

## 6. Git & Workflow

-   **Commits**: Conventional Commits (e.g., `feat: add login`, `fix: resolve crash`).
-   **PRs**: Small, focused chunks (< 400 lines).
-   **Main**: Always deployable.

## 7. Performance Checklist
-   [ ] Images optimization (Next/Image or WEBP).
-   [ ] Lazy load heavy components (`React.lazy`, `dynamic()`).
-   [ ] Core Web Vitals (LCP, CLS, FID) in green zone.

---

## 8. Usage as an NPM Package

You can install these standards directly into any project to use the shared constants and configs.

### Installation
```bash
npm install @zendaleebz/antigravity-standards@github:zendaleebz/antigravity-standards
```

### Usage
```javascript
import { standards } from '@zendaleebz/antigravity-standards'

console.log(standards.theme.fonts.sans)
```

### Extending Configs
In your local `tailwind.config.js`:
```javascript
import baseConfig from '@zendaleebz/antigravity-standards/configs/tailwind.config.js'

export default {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
}
```
