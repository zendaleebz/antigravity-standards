export const standards = {
  name: "Antigravity Engineering Standards",
  version: "1.0.0",
  stack: {
    frameworks: ["Next.js", "Vite"],
    styling: "Tailwind CSS",
    language: "TypeScript",
    state: ["TanStack Query", "Zustand"]
  },
  theme: {
    fonts: {
      sans: "Inter, sans-serif",
    },
    // Standard Antigravity Animations
    animations: {
      hover: "transition-all duration-200 ease-out hover:scale-105",
      click: "active:scale-95",
    }
  }
};

// Config exports would go here in a real monorepo setup
export const configs = {
  eslint: "./configs/eslint",
  prettier: "./configs/prettier",
  tsconfig: "./configs/tsconfig.json",
};
