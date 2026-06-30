# Thesis Feedback — Things to Fix

> Generated: 2026-06-16 | Thesis: *IGA and ROM for Parameterized Structural Dynamics*

---

## 🔴 Critical Issues

- [x] **Fabricated data in POD error plot** (Ch. 5, Fig. 5.1)
  - Values `(1.0, 0.45, 0.15, 0.05, ...)` are hardcoded approximations, not real simulation output.
  - Fix: replace with actual FOM/POD output, or add a caption note saying "schematic/representative".

- [x] **Inconsistent time interval** — Ch. 4 says t ∈ [0,10]s with 200 steps; Appendix B says T=2.0s, 400 steps, Δt=0.005s.
  - Fix: unify these numbers across all chapters.

- [x] **Parameter space dimension is undefined** — Ch. 2 defines μ ∈ R² (r, μ), but Sec. 3.5 uses μ ∈ R³ (r, μ, σ).
  - Fix: decide on 2 or 3 parameters and use consistently everywhere.

- [x] **"Phase X.X" numbering is confusing** — Sections labeled "Phase 5.2", "Phase 5.3", "Phase 5.3a" inside Chapter 5.
  - Fix: rename to Section 5.1, 5.2, 5.3 with descriptive titles.

---

## 🟠 Structural / Content Issues

- [x] **Abstract content** — Make sure the abstract states: problem, method, and key results (64.5× speedup, <0.1% error, real-time browser deployment).

- [x] **No actual data plots for FOM QoIs** (Ch. 4) — Tip deflection Uy(t) and Von Mises stress figures are pure TikZ schematics with no real numbers.
  - Fix: add at least one plot with actual simulation output data.

- [x] **Only 3 ECSW training snapshots** (Appendix B: M=3) — Extremely low. Add a justification or sensitivity discussion.

- [x] **Digital Twin chapter has no static screenshots** (Ch. 6) — `\animategraphics` only works in Adobe Acrobat. Most readers will see a blank figure.
  - Fix: add at least one static screenshot visible in all PDF viewers.

- [x] **Leftover "Phase 5.3b" references** — Check and remove any remaining stale section/phase labels from previous edits.

- [x] **No mesh convergence / refinement study** — The 80×40 mesh is used without justification. A brief h- or p-refinement test would support the IGA accuracy claim.

---

## 🟡 Writing & Clarity Issues

- [x] **Markdown bold syntax in LaTeX** (Ch. 5) — Lines like `**Energy-Conserving Sampling**`, `**coercivity**`, `**$64.5\times$ speedup**` use raw `**` markdown which will print literally in the PDF.
  - Fix: replace all `**text**` with `\textbf{text}`.

- [x] **Analogy section (Ch. 1.2) is too informal** — MP3/pixel analogies may come across as casual in an M2 thesis.
  - Fix: move to a "Remark" box or footnote, or rewrite in a more academic tone.

- [x] **The word "naive"** is used pejoratively throughout. Replace with "standard/classical physical-domain approach".

- [x] **Cross-reference fragility** — Ch. 3 references `\ref{eq:jacobian}` defined locally; verify it resolves correctly after all chapter splits.

- [x] **ROM variables missing from nomenclature** — r, q, Φ, w_e, Ω̂ are introduced ad-hoc. Add them to the nomenclature list.

---

## 🟢 Minor / Polish Issues

- [x] **"IGA Core Core"** (duplicated word) in Table 3.1 — fix to "IGA Core".

- [x] **Galerkin ROM speedup of 0.92×** is counterintuitive (slower than FOM). Add a sentence explaining this is due to projection overhead with full-dimensional assembly.

- [x] **Conclusion (Ch. 7) is too short** (~500 words). Add a paragraph explicitly connecting results back to the 4 research objectives listed in Ch. 1.

- [x] **Missing ECSW citation** in Ch. 5 — "proposed by Farhat et al." is mentioned in Ch. 1 but no `\cite{}` appears in the ROM chapter where ECSW is actually used.

- [x] **`\listofalgorithms`** in `main.tex` — verify this compiles correctly (non-standard command; may need a package or custom definition).
