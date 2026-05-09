# V1 Validation Notes

updated_at: 2026-05-09

## Automated Validation

Command:

```bash
node scripts/validate-v1.js
```

Coverage:

- Config IDs for statuses, life modules and themes.
- Draft generation with user sentence, no life modules and small spend module.
- Stable `syncStatus = local_only`.
- Receipt layout dynamic height and Chinese wrapping.
- Receipt renderer draw path for all three themes.
- Local repository save, query, date/month grouping, delete and clear.
- Same-day multi-record archive grouping.
- Image export success path with a mocked WeChat runtime.
- Receipt layout guardrails against accounting words such as total, budget, payment and cashier.

## Manual WeChat DevTools Checklist

This machine does not currently have WeChat Developer Tools installed under `/Applications`, so the following checks still need to be run in WeChat Developer Tools before calling V1 fully QA-passed:

- Open `project.config.json` in WeChat Developer Tools and confirm the default route opens 今日生成页.
- Complete the shortest path: select status, generate, preview, save image, store locally.
- Test album permission allowed, denied, and retry from settings.
- Test long Chinese text in the main sentence and proof fields.
- Test no life modules, one life module, and multiple life modules.
- Test small spend does not show total, budget, category, payment or cashier wording.
- Create multiple records on the same day and confirm archive stacking.
- Open detail, save image again, delete record, and confirm archive refresh.
- Clear local data from settings and confirm archive empty state.
