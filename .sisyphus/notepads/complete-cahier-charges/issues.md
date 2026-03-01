# Issues — complete-cahier-charges

## [2026-03-01] Known issues going in

### CRITICAL (must fix in Wave 0)
1. **presence.service.ts**: `getMyPresences()` uses `/me` (wrong — should be `/mes-presences`)
2. **presence.service.ts**: `pointer()` sends `{ qrToken }` (wrong — backend expects `{ tokenQR }`)
3. **presence.service.ts**: `justifier()` method uses FormData + non-existent endpoint — REMOVE entirely
4. **seance.service.ts**: `getMySeances()` uses `/me` (wrong — should be `/mes-seances`)
5. **seance.service.ts**: `generateQrCode()` uses `/{id}/qrcode` (wrong — should be `/{id}/qr`)
6. **candidature.service.ts**: `getMyCandidatures()` uses `/me` (wrong — should be `/mes-candidatures`)
7. **presence.model.ts**: Wrong field names — `seanceId`, `etudiantId`, `datePointage` don't exist in PresenceDTO
8. **presence.model.ts**: `PointageRequest` has `qrToken` field (wrong — PointageQRDTO has `tokenQR`)
9. **seance.model.ts**: Wrong field names — `type` (should be `typeSeance`), `dateDebut`/`dateFin` (should be `dateHeureDebut`/`dateHeureFin`)
10. **All 5 services**: Hardcoded `localhost:8080` — no environment.ts
11. **No roleGuard**: authGuard only checks authentication, not role

### PDF Export Risk
- Backend has `GET /api/statistiques/export/pdf` but no PDF library in pom.xml
- If it returns 500, that's a backend issue — out of scope for this sprint
