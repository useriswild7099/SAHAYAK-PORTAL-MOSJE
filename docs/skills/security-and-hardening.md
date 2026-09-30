# Security and Hardening

## Overview
Security-first development constraints on every line of code touching user data, authentication, storage, or external integrations. Treat external input as untrusted, secrets as sacred, and authorization checks as mandatory.

## Active Rules in this Codebase:
1. **Boundary Validation & Defensive Type Clamping**:
   - All numerical inputs (e.g., distress scores, pagination indices, call durations) must be strictly validated, NaN-checked, and clamped to safe intervals [0, 100].
   - All string inputs (e.g., transcripts, journal entries, caseworker notes) are sanitized and length-capped.
2. **Data Minimization & Statutory Privacy (DPDP Act 2023 / Article 21)**:
   - Zero raw PII exposure in logs, telemetries, or client-side exports.
   - Pseudonymized identifiers (`BEN-xxxx-xx`) for survivor privacy.
   - Raw diary and journaling contents remain strictly local on the victim's device/PC; only calibrated risk metrics and validated safety indicators enter the state store.
3. **No Secrets in Code or Storage**:
   - Environment variables via server proxies. No hardcoded credentials.
