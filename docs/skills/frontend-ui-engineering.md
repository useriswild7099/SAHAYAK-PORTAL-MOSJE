# Frontend UI Engineering

## Guidelines:
1. **Production-Quality Visual Craft & Zero AI Aesthetic**:
   - Strictly follow the statutory Government of India / MoSJE design system (Ashoka emblem, Navy `#0B2545`, Amber accents, Slate neutrals).
   - No generic purple/indigo AI slop, no oversized pill buttons, no decorative gradients that reduce readability.
2. **Accessibility Standards (WCAG 2.1 AA & GIGW 3.0)**:
   - Complete keyboard accessibility: Tab navigation, explicit focus outlines, logical tab order.
   - Screen reader readiness with semantic HTML (`<header>`, `<main>`, `<nav>`, `<section>`, `role="status"`), meaningful ARIA attributes, skip-to-main link.
   - High contrast mode and font-rescaling support (A-, A, A+).
3. **Component Architecture & Responsiveness**:
   - Separation of presentation from data stores and state services.
   - Mobile-first responsive layouts across 320px, 768px, 1024px, 1440px.
   - Purpose-driven empty states, loading skeletons, and clear feedback states.
