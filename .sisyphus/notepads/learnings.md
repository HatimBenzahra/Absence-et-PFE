
## JustificatifsValidationComponent (2026-03-01)
- NotificationService import path: `../../shared/services/notification.service`
- `Map<number, string>` works with `[ngModel]="getComment(id)" (ngModelChange)="setComment(id, $event)"` pattern in mat-table cells
- `darken()` in SCSS generates only warnings (acceptable), not errors
- Angular cache (`/.angular/cache`) can cause false "template not found" errors — `rm -rf .angular/cache` resolves them
- `styleUrl` (singular) is the Angular 21 pattern; `styleUrls` (plural array) also still works
- Per-row action tracking needs both `processingId` and `processingAction` for precise spinner display per button
- `subscriptSizing="dynamic"` on mat-form-field removes extra subscript space inside table cells
