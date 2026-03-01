# Decisions — complete-cahier-charges

## [2026-03-01] Wave 0 — Pre-execution decisions

- **BF9 scope**: Minimum viable — Soutenance entity + CRUD controller + frontend scheduling page. No jury entity, no email, no room booking.
- **No tests this sprint**: Focus on shipping pages. QA via Playwright.
- **No file upload**: Backend accepts `urlFichier: String`. Frontend uses text input throughout.
- **Simple QR scanner**: Text input for `tokenQR` (no camera), matching `PointageQRDTO`.
- **2 separate pages**: statistiques and exports are separate routes even though they share a backend controller.
- **Worktree**: Working directly in main dir (git blocked by Xcode license).
