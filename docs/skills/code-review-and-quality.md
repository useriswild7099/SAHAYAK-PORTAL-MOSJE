# Code Review and Quality

## Five-Axis Review Gates:
1. **Correctness**: Verify edge cases (null, empty strings, boundary inputs), error handling, and state synchronizations.
2. **Readability & Simplicity**: Descriptive names, linear control flows, avoiding nested ternaries, avoiding gratuitous wrappers.
3. **Architecture**: Clean module boundaries, no circular dependencies, proper separation between administrative desks and beneficiary portals.
4. **Security**: Validate inputs at trust boundaries, sanitize external inputs (such as local PC companion scores), protect survivor confidentiality.
5. **Performance**: Prevent unnecessary re-renders, use efficient memoization, and eliminate unbounded loops or memory leaks.

## Rules:
- Decompose oversized files and components (> 300 lines).
- Remove dead code, orphan variables, and unused abstractions.
- No bolted-on ad-hoc conditionals where a clean dispatcher or typed model belongs.
