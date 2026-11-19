# Contributing to Zezha Tools

Thank you for your interest in contributing to **Zezha Tools**!

## Ways to Contribute

- **Report bugs:** Open an issue with clear reproduction steps and screenshots if applicable.
- **Suggest new tools or datasets:** Propose calculators, developer utilities, or verified dataset updates.
- **Submit pull requests:** Fix bugs, improve accessibility/responsiveness, optimize bundle size, or add new tools.

## Local Setup

```bash
git clone https://github.com/rajeshkanna-s/zezha-tools.git
cd zezha-tools
npm install
npm run dev
```

The app runs on `http://localhost:8083`.

## Pull Request Guidelines

1. Fork the repository and create a branch from `main` (e.g. `feat/my-tool` or `fix/calc-rounding`).
2. Keep changes focused and modular. Register any new tools consistently in `src/tools/ToolsSidebar.tsx`, `src/tools/ToolsPortal.tsx`, and `src/tools/dashboardData.ts`.
3. Follow Conventional Commits where possible (e.g. `feat(dev-toolkit): ...`, `fix(calculator): ...`).
4. Before submitting, verify that the production build succeeds and check your modified files with ESLint:
   ```bash
   npm run build
   npx eslint <modified-files>
   ```
5. Do not commit `.env` files, personal tokens, or debug screenshots.

## Code of Conduct

Be respectful, constructive, and collaborative in all issues, discussions, and pull requests.
