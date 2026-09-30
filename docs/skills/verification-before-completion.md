---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always.
---

# Verification Before Completion

## The Iron Law
```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

## The Gate Function
1. **IDENTIFY**: What command proves this claim? (e.g. `npm run lint`, `npm run build`, `compile_applet`)
2. **RUN**: Execute the FULL command fresh.
3. **READ**: Full output, check exit code, verify zero failures.
4. **VERIFY**: Does output confirm the claim?
5. **ONLY THEN**: State claim WITH concrete evidence.
