# M2 Thesis Defense: Complete Slide-by-Slide Spoken Script
**Candidate:** Mumen Wehbe  
**Institution:** Conservatoire National des Arts et Métiers (Cnam Paris)  
**Laboratory:** LMSSC (Laboratoire de Mécanique des Structures et des Systèmes Couplés)  
**Supervisor:** Dr. Christophe Hoareau  
**Title:** *Real-Time Physics on the Web: Geometrical Parameters in Isogeometric Analysis & Reduced Order Modeling for Structural Dynamics*  
**Allocated Defense Time:** 30:00 Max (Calibrated to **28:00** speech + **2:00** safety buffer)  
**Presentation File:** `presentation/main.pdf` (Total: 45 Content Slides)  
**Handout PDF:** `presentation/defense_speech.pdf` (8-page reference booklet)

---

## ⏱️ Executive Timing & Demonstration Protocol

```
TOTAL TIME: 30:00 (28:00 speaking + 2:00 safety buffer)
PACE: ~130 words per minute (short sentences, deliberate pauses)

LIVE DEMONSTRATIONS:
• Live Demo 1 (Page 19): [00:30] Interactive B-Spline Curve (drag control points live)
• Grand Live Demo 2 (Page 40): [01:00] Real-Time Web Digital Twin (move sliders, 60 FPS solve)
```

---

## Complete Slide-by-Slide Script (Pages 1 to 45)

---

### Preamble (Slides 1 – 4)

#### Page 1 | Title Slide `[00:00 - 00:35 | 35s]`
* **Action:** Stand center-stage, make eye contact with jury.
* "Good morning, Mr. President, esteemed members of the jury."
* "Welcome to my Master 2 defense in Computational Mechanics."
* "My topic is: *Real-Time Physics on the Web: IGA and Reduced Order Modeling for Structural Dynamics*."
* "This research was supervised by Dr. Christophe Hoareau here at Cnam Paris."
* `[CLICK NEXT]`

#### Page 2 | Host Institution & Research Laboratory `[00:35 - 01:05 | 30s]`
* **Action:** Point to Saint-Martin portal photo.
* "This research was hosted at LMSSC, the Structural Mechanics and Coupled Systems Laboratory."
* "The laboratory specializes in structural dynamics, vibration mitigation, and fluid-structure interaction."
* "This work is part of the DYSCOM research group, focusing on interactive numerical methods."
* `[CLICK NEXT]`

#### Page 3 | Supervision & Research Team `[01:05 - 01:30 | 25s]`
* **Action:** Acknowledge advisor with open hand.
* "I want to warmly thank my supervisor, Dr. Christophe Hoareau."
* "His scientific guidance and continuous support were invaluable throughout this project."
* "I also extend my sincere thanks to the professors and research staff at LMSSC."
* `[CLICK NEXT]`

#### Page 4 | Lecture Overview (Table of Contents) `[01:30 - 02:00 | 30s]`
* **Action:** Sweep through the 6 chapters on screen.
* "Today's talk is organized into six parts."
* "We start with the motivation and continuum mechanics theory."
* "Then we detail the IGA discretization and our Full Order Model solver."
* "Next, we present Model Order Reduction with POD and ECSW hyper-reduction."
* "Finally, I will present a live web demonstration and conclude."
* `[CLICK NEXT]`

---

### Chapter 1: Introduction & State of the Art (Slides 5 – 7)

#### Page 5 | Chapter 1 Announcement `[02:00 - 02:10 | 10s]`
* "Let us begin with Chapter 1: Introduction and Motivation."
* `[CLICK NEXT]`

#### Page 6 | Introduction & Motivation `[02:10 - 03:15 | 1m 05s]`
* **Action:** Point to left blocks; mention web screenshot on the right as the target goal.
* "Our project has two clear goals:"
* "**Education**: an interactive physics visualizer directly in the browser with zero install."
* "Students can physically see wave propagation and vibrations live."
* "**Research**: solving the moving-geometry problem in real time."
* "Standard FEM is too slow and crashes on remeshing."
* "Our solution: exact CAD geometry with IGA, and extreme speed with ROM."
* `[CLICK NEXT]`

#### Page 7 | Conceptual Parallels to Data Compression `[03:15 - 04:15 | 1m 00s]`
* **Action:** Point to Hughes (left), Quarteroni (center), and Farhat (right).
* "We can understand our pipeline through direct parallels to data compression:"
* "1. **IGA (Hughes, 2005)** is like vector graphics: CAD curves are exact, never pixelated into chords."
* "2. **ROM (Quarteroni, 2016)** is like MP3 audio compression: we retain only dominant dynamic modes."
* "3. **Hyper-Reduction (Farhat, 2014)** is like smart sensor placement: we compute on just a few elements."
* `[CLICK NEXT]`

---

### Chapter 2: Theory: Problem Definition (Slides 8 – 13)

#### Page 8 | Chapter 2 Announcement `[04:15 - 04:25 | 10s]`
* "Now we move to Chapter 2: Theoretical Formulation and Continuum Mechanics."
* `[CLICK NEXT]`

#### Page 9 | Geometry Configurations `[04:25 - 05:15 | 50s]`
* **Action:** Point to cantilever beam schematic, indicating $r$ and $x_c$.
* "We study a 2D clamped cantilever beam with symmetric smooth notches."
* "The geometry depends on two parameters: notch depth $r$ and notch position $x_c$."
* "When these parameters change, the physical domain deforms."
* "In standard FEM, this requires remeshing for every single parameter change."
* `[CLICK NEXT]`

#### Page 10 | Governing Equations & Assumptions `[05:15 - 06:00 | 45s]`
* **Action:** Point to linear momentum equation.
* "We assume linear elasticity, small deformations, and 2D plane stress."
* "The motion is governed by the elastodynamic momentum balance equation."
* "The left boundary is fully clamped, and a dynamic traction acts at the tip."
* `[CLICK NEXT]`

#### Page 11 | Classical Weak Form on $\Omega(\boldsymbol{\mu})$ `[06:00 - 06:50 | 50s]`
* **Action:** Highlight the moving domain subscript $\Omega(\boldsymbol{\mu})$.
* "Here is the classical weak form on the physical domain."
* "Notice the integration domain $\Omega(\boldsymbol{\mu})$ moves with the parameter."
* "This is the central bottleneck: snapshots belong to incompatible function spaces."
* "We cannot build a global reduced basis directly from these meshes."
* `[CLICK NEXT]`

#### Page 12 | Pullback Mapping to Reference Configuration `[06:50 - 07:40 | 50s]`
* **Action:** Trace mapping arrow from $\hat{\Omega}$ down to $\Omega(\boldsymbol{\mu})$.
* "To fix this, we map the moving domain to a fixed reference rectangle $\hat{\Omega}$."
* "This is the reference pullback mapping $\boldsymbol{\Psi}$."
* "All coordinate changes are captured by the mapping Jacobian matrix."
* "Now, all integrations take place on a static, parameter-independent space."
* `[CLICK NEXT]`

#### Page 13 | Pulled-Back Weak Form on $\hat{\Omega}$ `[07:40 - 08:30 | 50s]`
* **Action:** Point to Jacobian terms in stiffness and mass forms.
* "This gives our pulled-back weak form on $\hat{\Omega}$."
* "Notice that the integration bounds are completely fixed."
* "All parameter dependence is isolated inside the Jacobian mapping tensors."
* "Degrees of freedom now share a unified algebraic vector space, ideal for ROM."
* `[CLICK NEXT]`

---

### Chapter 3: Discretization: Isogeometric Analysis (Slides 14 – 25)

#### Page 14 | Chapter 3 Announcement `[08:30 - 08:40 | 10s]`
* "Chapter 3 introduces the spatial discretization using Isogeometric Analysis."
* `[CLICK NEXT]`

#### Page 15 | Curve Representations in Geometry `[08:40 - 09:20 | 40s]`
* **Action:** Compare Explicit, Implicit, and Parametric plots.
* "Let us compare how curves are described in geometry."
* "Explicit curves cannot describe vertical lines or closed circles."
* "Implicit curves are computationally expensive to parameterize."
* "Parametric curves are the CAD standard: flexible, robust, and exact."
* `[CLICK NEXT]`

#### Page 16 | Why IGA? `[09:20 - 10:05 | 45s]`
* **Action:** Point to the three vertical blocks.
* "IGA unifies CAD geometry and numerical simulation:"
* "**CAD Splines**: uses native spline functions, bypassing separate meshing steps."
* "**Exact Geometry**: preserves curved boundaries exactly at all scales without error."
* "**High Regularity**: $C^{p-1}$ continuity provides smooth stresses and higher accuracy per DOF."
* `[CLICK NEXT]`

#### Page 17 | The Core Ingredients of IGA `[10:05 - 10:50 | 45s]`
* **Action:** Point to the 4 ingredient blocks.
* "The IGA framework relies on four ingredients:"
* "1. A knot vector $\Xi$ partitioning the parametric domain into elements."
* "2. B-spline basis functions computed by the Cox-de Boor recurrence."
* "3. Weights that generalize B-splines to NURBS for exact conics."
* "4. Control points defining the physical shape in Cartesian space."
* `[CLICK NEXT]`

#### Page 18 | B-Spline Basis Functions `[10:50 - 11:35 | 45s]`
* **Action:** Show basis curves and Cox-de Boor formula.
* "B-spline basis functions have ideal mathematical properties:"
* "They form a partition of unity and are strictly non-negative."
* "They have compact local support, ensuring sparse system matrices."
* "They provide $C^{p-1}$ inter-element continuity across internal knots."
* `[CLICK NEXT]`

#### Page 19 | B-Spline Curve Concept & LIVE DEMO 1 `[11:35 - 12:35 | 1m 00s]`
* **Action:** Click button, switch to browser for 20 seconds, drag control point live.
* "A B-spline curve is a linear sum of basis functions multiplied by control points."
* *[Live Interaction]*: "Notice as I drag this control point: the curve deforms smoothly and locally."
* "The knot topology never breaks, and no remeshing is needed."
* "This makes splines exceptionally suited for geometric parameterization."
* `[CLICK NEXT]`

#### Page 20 | 2D Bivariate Basis Functions `[12:35 - 13:15 | 40s]`
* **Action:** Show 2D surface patch.
* "For 2D continua, we take tensor products of 1D B-splines."
* "Each basis function is a simple product: $R_{i,j}(\xi, \eta) = N_i(\xi) M_j(\eta)$."
* "Control points form a structured 2D bidirectional net."
* `[CLICK NEXT]`

#### Page 21 | Parametric to Physical Domain Mapping `[13:15 - 13:55 | 40s]`
* **Action:** Trace mapping from unit square to physical notched beam.
* "This geometric mapping transforms the unit square $[0,1]^2$ into our beam."
* "Parametric knot spans map directly into physical elements."
* "Crucially, this parent square $[0,1]^2$ is our invariant reference domain $\hat{\Omega}$."
* `[CLICK NEXT]`

#### Page 22 | $h$-Refinement (Knot Insertion) `[13:55 - 14:30 | 35s]`
* **Action:** Show knot insertion plot.
* "To refine the mesh, we insert new knot values."
* "This splits elements into smaller elements, just like $h$-refinement in FEM."
* "Most importantly: inserting knots does not change the physical geometry at all."
* `[CLICK NEXT]`

#### Page 23 | $p$-Refinement (Degree Elevation) `[14:30 - 15:00 | 30s]`
* **Action:** Show degree elevation plot.
* "We can also elevate the polynomial degree $p$."
* "This enriches the approximation space without adding new elements."
* "Once again, the exact CAD geometry is strictly preserved."
* `[CLICK NEXT]`

#### Page 24 | $k$-Refinement & Exact Geometry `[15:00 - 15:35 | 35s]`
* **Action:** Point to comparison table: $h \to p$ vs. $k$-ref.
* "This brings us to $k$-refinement, unique to IGA."
* "If we insert knots first, then elevate degree ($h \to p$), continuity drops to $C^0$."
* "In $k$-refinement, we elevate degree first, then insert knots: keeping $C^{p-1}$ continuity."
* "This gives maximum accuracy per DOF and eliminates artificial stress jumps."
* `[CLICK NEXT]`

#### Page 25 | Isoparametric Concept & Field Approximation `[15:35 - 16:05 | 30s]`
* **Action:** Point to equation of displacement field.
* "We follow the isoparametric concept."
* "The unknown displacement field $\mathbf{u}_h$ is interpolated using the exact same spline basis."
* "Geometry and physics share the identical mathematical representation."
* `[CLICK NEXT]`

---

### Chapter 4: Simulation: Full Order Model (Slides 26 – 32)

#### Page 26 | Chapter 4 Announcement `[16:05 - 16:15 | 10s]`
* "Chapter 4 covers the Full Order Model dynamic simulation."
* `[CLICK NEXT]`

#### Page 27 | From IGA to the Full Order Model (FOM) `[16:15 - 17:00 | 45s]`
* **Action:** Point to semi-discrete matrix equation.
* "Applying Galerkin projection yields the semi-discrete equation of motion: $\mathbf{M}\ddot{\mathbf{u}} + \mathbf{K}\mathbf{u} = \mathbf{F}$."
* "System matrices are assembled using Gaussian quadrature over knot spans."
* "Our full-order model has $N = 6{,}564$ degrees of freedom."
* `[CLICK NEXT]`

#### Page 28 | Simulation Path & Solver Workflow `[17:00 - 17:45 | 45s]`
* **Action:** Trace time integration flow.
* "We integrate in time using the implicit Newmark-$\beta$ method."
* "It is unconditionally stable with parameters $\beta = 1/4$ and $\gamma = 1/2$."
* "We apply a dynamic harmonic tip load and compute transient deflections."
* `[CLICK NEXT]`

#### Page 29 | Model Displacement Field `[17:45 - 18:25 | 40s]`
* **Action:** Show deformed beam mesh.
* "Here is the dynamic displacement response of the notched cantilever beam."
* "Bending waves propagate cleanly through the structure."
* "Clamped boundary conditions on the left wall are strictly enforced."
* `[CLICK NEXT]`

#### Page 30 | Model Stress & Von Mises Definition `[18:25 - 19:05 | 40s]`
* **Action:** Point to stress concentration at the notch.
* "From displacement derivatives, we compute Cauchy stresses and Von Mises fields."
* "Stress smoothly concentrates around the notch roots."
* "Because IGA basis functions have $C^1$ continuity, stresses are smooth across elements."
* "No artificial post-processing smoothing is required."
* `[CLICK NEXT]`

#### Page 31 | Physical vs. Reference Mapped Path: Validation `[19:05 - 19:45 | 40s]`
* **Action:** Highlight $< 10^{-12}$ difference.
* "We validated our reference pullback solver against the physical solver."
* "The numerical difference between both paths is under $10^{-12}$, pure machine precision."
* "This proves the mathematical exactness of our pullback implementation."
* `[CLICK NEXT]`

#### Page 32 | Mesh Convergence Study `[19:45 - 20:20 | 35s]`
* **Action:** Show log-log convergence plot.
* "We conducted a rigorous mesh convergence study."
* "The asymptotic error matches the theoretical optimal rate $O(h^{p+1})$."
* "$k$-refined IGA converges significantly faster than classical quadratic FEM."
* `[CLICK NEXT]`

---

### Chapter 5: Reduced Order Modeling & Hyper-Reduction (Slides 33 – 41)

#### Page 33 | Chapter 5 Announcement `[20:20 - 20:30 | 10s]`
* "Now we enter Chapter 5: Model Order Reduction and Hyper-Reduction."
* `[CLICK NEXT]`

#### Page 34 | Why ROM? (Motivation) `[20:30 - 21:15 | 45s]`
* **Action:** Contrast 142 ms FOM vs. 16 ms budget.
* "Solving the Full Order Model takes 142 milliseconds per time step."
* "To run at 60 FPS in a web browser, we need each step under 16 milliseconds."
* "The FOM is nearly 10 times too slow for real-time web deployment."
* "This is why we must build a Reduced Order Model."
* `[CLICK NEXT]`

#### Page 35 | What Do We Need to Achieve It? (The 5 Steps) `[21:15 - 21:55 | 40s]`
* **Action:** Walk through the 5 steps.
* "We reach real-time performance through five structured steps:"
* "1. Reference pullback to fix the domain."
* "2. Offline snapshot collection across parameters."
* "3. POD basis construction via SVD."
* "4. ECSW hyper-reduction for fast assembly."
* "5. Client-side real-time solver in WebGL."
* `[CLICK NEXT]`

#### Page 36 | Step 1: Reference Pullback Mapping `[21:55 - 22:30 | 35s]`
* **Action:** Reiterate the fixed reference domain role.
* "Step 1 is the foundation: all geometries map to the same reference domain $\hat{\Omega}$."
* "Every snapshot shares the exact same algebraic degree-of-freedom indices."
* "This allows direct snapshot aggregation across the entire parameter space."
* `[CLICK NEXT]`

#### Page 37 | Step 2: Snapshot Collection (Data Generation) `[22:30 - 23:05 | 35s]`
* **Action:** Point to snapshot matrix structure.
* "In Step 2, we simulate training cases across the parameter space $\mathcal{D}$."
* "Displacement fields at each time step are stored as columns of snapshot matrix $\mathbf{S}$."
* "This captures the dominant dynamic deformation modes."
* `[CLICK NEXT]`

#### Page 38 | Step 3: SVD / POD Basis Construction `[23:05 - 23:45 | 40s]`
* **Action:** Point to singular value decay plot.
* "In Step 3, we compute the Singular Value Decomposition: $\mathbf{S} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^T$."
* "Singular values decay exponentially."
* "Just $r = 15$ POD modes capture over 99.99\% of total kinetic and strain energy."
* "We truncate the basis from 6,564 DOFs down to just 15."
* `[CLICK NEXT]`

#### Page 39 | Step 4: Galerkin Projection vs. ECSW Hyper-reduction `[23:45 - 24:35 | 50s]`
* **Action:** Explain the non-affine bottleneck.
* "Standard Galerkin projection shrinks matrix size, but still integrates over all 3,200 elements."
* "Online assembly still takes 150 milliseconds: no real speedup!"
* "To fix this, we apply ECSW hyper-reduction: selecting a sparse subset of elements."
* "Using non-negative least squares, ECSW reduces 3,200 elements to just **28 active elements**."
* "Positive weights guarantee numerical stability, symmetry, and energy conservation."
* `[CLICK NEXT]`

#### Page 40 | Step 5: Real-Time Solver & GRAND LIVE DEMO 2 `[24:35 - 25:45 | 1m 10s]`
* **Action:** Point to benchmark table, then switch to browser for 35 seconds.
* "Here are the results: solve time drops from 142 milliseconds to **1.3 milliseconds**."
* "That is a **64.5 times speedup**, with relative error below 0.1\%!"
* *[Switch to browser]*: "Here is our live Digital Twin running in the browser."
* "When I move notch depth $r$, the geometry and mesh update instantly."
* "When I move notch position $x_c$, dynamic stresses concentrate live at 60 FPS."
* "The entire solve runs client-side in WebGL with zero cloud latency."
* *[Switch back to slides]*
* `[CLICK NEXT]`

#### Page 41 | Project Workflow: Completing the Puzzle `[25:45 - 26:15 | 30s]`
* **Action:** Trace the 5 roadmap boxes.
* "This diagram shows the complete roadmap from the bottleneck to victory:"
* "We took the best theory from Hughes, Quarteroni, and Farhat, paired with modern tools, and crushed the runtime down to 1.3 milliseconds."
* "The bottom line: high-fidelity mechanics running interactively at 60 FPS in the browser."
* `[CLICK NEXT]`

---

### Chapter 6: Conclusion & Future Perspectives (Slides 42 – 45)

#### Page 42 | Chapter 6 Announcement `[26:15 - 26:25 | 10s]`
* "We now conclude with Chapter 6: Summary and Perspectives."
* `[CLICK NEXT]`

#### Page 43 | Summary of Achievements & Implemented Methods `[26:25 - 27:05 | 40s]`
* **Action:** Recap the 4 achievements with pride.
* "In summary, this research achieved four major milestones:"
* "1. Developed an exact-geometry IGA dynamic elastodynamics solver."
* "2. Resolved the moving-boundary issue using reference pullback mapping."
* "3. Implemented POD and ECSW hyper-reduction, achieving a 64.5 times speedup on 28 elements."
* "4. Built a real-time web Digital Twin running at 60 FPS on standard devices."
* `[CLICK NEXT]`

#### Page 44 | Alternatives & Future Perspectives `[27:05 - 27:45 | 40s]`
* **Action:** Present future research vectors.
* "For future research, three direct paths open:"
* "First, extending to large geometric deformations with Green-Lagrange strain."
* "Second, advancing from 2D plane stress to 3D solid structures using trivariate splines."
* "Third, exploring neural networks to predict reduced coordinates for rapid design sweeps."
* `[CLICK NEXT]`

#### Page 45 | Thank You / Questions & Discussion `[27:45 - 28:00 | 15s]`
* **Action:** Stand upright, smile, make eye contact, bow slightly.
* "Thank you very much for your kind attention."
* "I am now pleased to answer any questions from the jury."

---
*Finished at 28:00 (leaving 2 minutes safety buffer before the 30:00 limit).*
