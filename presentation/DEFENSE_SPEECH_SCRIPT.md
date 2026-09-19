# M2 Thesis Defense: Complete Slide-by-Slide 30-Minute Speech Script
**Candidate:** Mumen Wehbe  
**Institution:** Conservatoire National des Arts et Métiers (Cnam Paris)  
**Laboratory:** LMSSC (Laboratoire de Mécanique des Structures et des Systèmes Couplés)  
**Supervisor:** Dr. Christophe Hoareau  
**Title:** *Real-Time Physics on the Web: Geometrical Parameters in Isogeometric Analysis & Reduced Order Modeling for Structural Dynamics*  
**Allocated Defense Time:** 30:00 Max (Calibrated to **27:30** speech + **2:30** buffer)  
**Presentation File:** `presentation/main.pdf` (Total: 45 Pages / 37 Numbered Content Slides)  

---

## ⏱️ Executive Timing & Demonstration Protocol

```
TOTAL TIME: 30:00 (27:30 speaking + 2:30 safety buffer)
PACE: ~130 words per minute (confident, articulate, deliberate)

LIVE DEMONSTRATION STRATEGY:
• Quick Geometry Demo (Page 19 / Slide 15): [00:35] Interactive B-Spline Curve (touching control points live)
• Grand Climax Demo   (Page 40 / Slide 34): [01:15] Real-Time Web Digital Twin (changing shape, 60 FPS solve)
```

---

## Full Slide-by-Slide Script (Pages 1 to 45)

---

### Page 1 | Title Slide (Plain Crimson Banner)
* **Target Time:** `00:00 - 00:40` (Duration: 40s)  
* **Action:** Stand center-stage. Look directly at the jury president and members. Take a steady breath.  
* **Spoken Words:**  
  > "Mr. President, esteemed members of the jury, dear colleagues and guests.  
  > 
  > Welcome to my Master 2 thesis defense in Computational Mechanics. Today, I am honored to present my research entitled:  
  > **'Real-Time Physics on the Web: Geometrical Parameters in Isogeometric Analysis and Reduced Order Modeling for Structural Dynamics'**.  
  > 
  > This work was conducted at the Conservatoire National des Arts et Métiers under the academic supervision of Dr. Christophe Hoareau. Our central goal is to combine exact CAD geometry and model order reduction to run millisecond-scale, interactive physical simulations directly inside a web browser."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 2 | Host Institution & Research Laboratory
* **Target Time:** `00:40 - 01:10` (Duration: 30s)  
* **Action:** Point briefly to the Cnam Saint-Martin portal photo and the LMSSC research axes.  
* **Spoken Words:**  
  > "This research was hosted at **LMSSC**—the Structural Mechanics and Coupled Systems Laboratory here at Cnam Paris.  
  > 
  > The laboratory is renowned for its contributions to structural dynamics, fluid-structure interaction, vibration mitigation, and acoustic systems. This thesis is situated within the DYSCOM research group, focusing on advanced numerical formulations and real-time computational demonstrators."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 3 | Supervision & Research Team
* **Target Time:** `01:10 - 01:35` (Duration: 25s)  
* **Action:** Acknowledge Dr. Hoareau and the lab staff with an open-hand gesture.  
* **Spoken Words:**  
  > "I would like to express my deepest gratitude to my advisor, Dr. Christophe Hoareau, for his scientific mentorship, continuous availability, and inspiring discussions throughout this internship.  
  > 
  > I also extend my sincere thanks to the professors, researchers, and administrative team at LMSSC for providing a stimulating and welcoming research environment."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 4 | Lecture Overview (Table of Contents)
* **Target Time:** `01:35 - 02:00` (Duration: 25s)  
* **Action:** Make a brief sweep of the agenda on screen.  
* **Spoken Words:**  
  > "Today's lecture is structured into six chapters:  
  > We begin with our motivation and state-of-the-art context. We then formulate the continuous problem with reference mapping, detail the IGA spatial discretization, present the Full Order Model dynamic solver, demonstrate our Reduced Order Model using POD and ECSW hyper-reduction, and conclude with key findings and future perspectives."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 5 | Splash: Chapter 1: Introduction & State of the Art
* **Target Time:** `02:00 - 02:10` (Duration: 10s)  
* **Action:** Pause for 2 seconds while the red chapter slide appears, announcing Chapter 1.  
* **Spoken Words:**  
  > "Let us begin with Chapter 1: Introduction and Motivation."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 6 | Slide 4: Introduction & Motivation
* **Target Time:** `02:10 - 03:15` (Duration: 1m 05s)  
* **Action:** Point to the two left blocks. *Note: Do NOT click the 'Open Web Simulation' button yet! Introduce it as the vision; the live demo will happen in Chapter 5.*  
* **Spoken Words:**  
  > "Our project was motivated by a **Dual Scope**:  
  > 
  > First, a **pedagogical ambition**: structural dynamics is traditionally taught through static formulas or pre-computed animations. We envisioned an accessible, zero-install web visualizer where students and engineers can physically interact with wave propagation and vibration modes in real time.  
  > 
  > Second, this raised a major **scientific problem**: in parametric design, modifying the geometry in standard Finite Element Analysis requires repeated, expensive remeshing. Furthermore, solving thousands of equations per time step cannot run at interactive frame rates.  
  > 
  > Our solution combines **Isogeometric Analysis (IGA)** for exact CAD geometry with **Reduced Order Modeling (ROM)** and **ECSW hyper-reduction**, targeting real-time client-side performance."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 7 | Slide 5: Conceptual Parallels to Data Compression
* **Target Time:** `03:15 - 04:20` (Duration: 1m 05s)  
* **Action:** Point sequentially to Hughes (left), Quarteroni (center), and Farhat (right).  
* **Spoken Words:**  
  > "To build an intuitive picture of our framework, we can draw direct parallels to data compression:  
  > 
  > 1. **Isogeometric Analysis (Hughes, 2005)** is like **vector graphics versus rasterized pixels**. Classical FEM approximates smooth curves with faceted linear segments. IGA preserves the exact CAD spline geometry without geometric error.  
  > 
  > 2. **Reduced Order Modeling (Quarteroni, 2016)** acts like **spectral audio compression**. Rather than tracking every spatial degree of freedom, we project the dynamic state onto dominant modal subspaces.  
  > 
  > 3. **Hyper-Reduction via ECSW (Farhat, 2014)** is like **optimal sensor placement**. When geometry changes, standard projection still requires integrating over the entire mesh. ECSW samples a minimal set of elements to assemble reduced matrices in microseconds."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 8 | Splash: Chapter 2: Theory: Problem Definition
* **Target Time:** `04:20 - 04:30` (Duration: 10s)  
* **Action:** Announce the theoretical formulation.  
* **Spoken Words:**  
  > "This brings us to Chapter 2: Problem Definition and Continuum Theory."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 9 | Slide 6: Geometry Configurations
* **Target Time:** `04:30 - 05:25` (Duration: 55s)  
* **Action:** Point to the notched beam schematic, indicating notch depth $r$ and location $x_c$.  
* **Spoken Words:**  
  > "We consider a 2D cantilever beam clamped on the left wall and subjected to dynamic tip loading.  
  > 
  > The geometry features symmetric smooth notches parameterized by a two-dimensional parameter vector $\boldsymbol{\mu} = (r, x_c)^T \in \mathcal{D}$:  
  > Here, $r$ defines the notch depth, and $x_c$ defines the axial notch position.  
  > 
  > Notice the crucial challenge: changing $\boldsymbol{\mu}$ deforms the physical domain $\Omega(\boldsymbol{\mu})$. As the geometry alters, the underlying function space changes, which prevents standard reduced basis projection."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 10 | Slide 7: Governing Equations & Assumptions
* **Target Time:** `05:25 - 06:10` (Duration: 45s)  
* **Action:** Point to the linear momentum balance equation.  
* **Spoken Words:**  
  > "We operate under the assumptions of linear elasticity, small strains, and 2D plane stress.  
  > 
  > The dynamic response is governed by the balance of linear momentum:  
  > $\rho \ddot{\mathbf{u}} - \nabla \cdot \boldsymbol{\sigma} = \mathbf{b}$ in $\Omega(\boldsymbol{\mu})$.  
  > 
  > Stress and strain follow Hooke's constitutive law, with zero displacement Dirichlet conditions at the clamped root and dynamic traction on the free boundary."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 11 | Slide 8: Classical Weak Form on $\Omega(\boldsymbol{\mu})$
* **Target Time:** `06:10 - 06:55` (Duration: 45s)  
* **Action:** Emphasize the integral subscript $\Omega(\boldsymbol{\mu})$.  
* **Spoken Words:**  
  > "Multiplying by kinematically admissible test functions $\mathbf{v}$ gives the standard variational weak form.  
  > 
  > We seek $\mathbf{u} \in \mathcal{V}$ such that the inertial form, internal bilinear form, and external load balance for all test functions.  
  > 
  > But look at the integration domain: it depends explicitly on $\boldsymbol{\mu}$. If we computed snapshots here, each snapshot would live on a different mesh with different spatial coordinates, making basis extraction mathematically inconsistent."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 12 | Slide 9: Pullback Mapping to Reference Configuration
* **Target Time:** `06:55 - 08:00` (Duration: 1m 05s)  
* **Action:** Trace the arrow $\boldsymbol{\Psi}(\hat{\mathbf{x}}; \boldsymbol{\mu})$ from the static reference rectangle $\hat{\Omega}$ to the physical domain $\Omega(\boldsymbol{\mu})$.  
* **Spoken Words:**  
  > "To resolve this vector-space incompatibility, we introduce a **diffeomorphic pullback mapping** $\boldsymbol{\Psi}$.  
  > 
  > Instead of formulating the problem on the varying physical domain $\Omega(\boldsymbol{\mu})$, we map the governing equations back to an invariant, parameter-independent reference configuration $\hat{\Omega}$—a simple rectangle.  
  > 
  > Any physical coordinate is defined as $\mathbf{x} = \boldsymbol{\Psi}(\hat{\mathbf{x}}; \boldsymbol{\mu})$. Using the transformation Jacobian $\mathbf{F} = \nabla_{\hat{\mathbf{x}}} \boldsymbol{\Psi}$ and its determinant $J = \det(\mathbf{F})$, all spatial gradients and integration measures are mapped onto $\hat{\Omega}$."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 13 | Slide 10: Pulled-Back Weak Form on $\hat{\Omega}$
* **Target Time:** `08:00 - 09:00` (Duration: 1m 00s)  
* **Action:** Point to the pulled-back constitutive tensor $\hat{\mathcal{C}}(\hat{\mathbf{x}}; \boldsymbol{\mu})$.  
* **Spoken Words:**  
  > "Here is the resulting pulled-back weak form on $\hat{\Omega}$.  
  > 
  > Notice the profound mathematical advantage:  
  > The geometry parameter $\boldsymbol{\mu}$ has been completely transferred from the integration boundary into the algebraic coefficients of the differential operator.  
  > 
  > Because the domain of integration $\hat{\Omega}$ is now completely fixed, all displacement fields belong to the exact same Hilbert space $H^1(\hat{\Omega})$, allowing us to build a globally valid reduced basis."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 14 | Splash: Chapter 3: Discretization: Isogeometric Analysis
* **Target Time:** `09:00 - 09:10` (Duration: 10s)  
* **Action:** Announce the IGA discretization chapter.  
* **Spoken Words:**  
  > "We now turn to Chapter 3: Spatial Discretization using Isogeometric Analysis."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 15 | Slide 11: Curve Representations in Geometry
* **Target Time:** `09:10 - 09:45` (Duration: 35s)  
* **Action:** Contrast faceted polygonal meshes with smooth mathematical curves.  
* **Spoken Words:**  
  > "In classical engineering, CAD geometries are translated into piecewise linear finite elements.  
  > 
  > This tessellation degrades curved boundaries, introduces artificial stress singularities, and forces engineers to re-mesh every time a dimension changes. CAD and FEA remain disconnected worlds."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 16 | Slide 12: Why IGA?
* **Target Time:** `09:45 - 10:20` (Duration: 35s)  
* **Action:** Emphasize the phrase: *Exact CAD geometry directly as the analysis basis*.  
* **Spoken Words:**  
  > "Isogeometric Analysis, pioneered by Hughes, unifies CAD and numerical simulation.  
  > 
  > By adopting the exact spline basis functions from CAD—such as B-Splines and NURBS—as the finite element shape functions, the geometric boundary is exact at all discretization scales, and high-order continuity across elements is achieved natively."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 17 | Slide 13: The Core Ingredients of IGA
* **Target Time:** `10:20 - 10:55` (Duration: 35s)  
* **Action:** Point to the 3 blocks: Knot vectors, Control points, Basis functions.  
* **Spoken Words:**  
  > "The IGA framework is built upon three components:  
  > 1. A non-decreasing **Knot Vector** $\Xi$, which partitions the parametric space into elements.  
  > 2. A set of **Control Points** $\mathbf{P}_i$ in space, defining the control net.  
  > 3. Univariate **B-spline basis functions** that interpolate smoothly across the elements."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 18 | Slide 14: B-Spline Basis Functions
* **Target Time:** `10:55 - 11:35` (Duration: 40s)  
* **Action:** Mention Cox-de Boor recursion and partition of unity.  
* **Spoken Words:**  
  > "Basis functions are computed recursively via the **Cox-de Boor recurrence relation**, starting from piecewise constants of degree zero up to polynomial degree $p$.  
  > 
  > They satisfy partition of unity, strict non-negativity, and compact local support. This guarantees that rigid body modes and constant strain states are captured exactly."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 19 | Slide 15: B-Spline Curve Concept & Interactive Demo 1
* **Target Time:** `11:35 - 12:35` (Duration: 1m 00s)  
* **Action & Interactive Demo:**  
  1. *[00:15]* Explain the curve formula $\mathbf{C}(\xi) = \sum N_{i,p}(\xi) \mathbf{P}_i$.  
  2. *[00:20]* Click the button: `\beamerbutton{Interactive IGA Curve Web App}`.  
  3. *[00:25]* Switch to the browser window.  
  4. *[00:45]* **In Browser**: Click and drag a control point. Show that the curve deforms smoothly and locally while element knots remain fixed.  
  5. *[00:55]* Switch back to the presentation (`Alt+Tab`).  
* **Spoken Words:**  
  > "A B-spline curve is a linear combination of basis functions weighted by control points.  
  > 
  > Let us quickly view this in our interactive web demonstrator:  
  > *[Click button $\to$ Switch to browser]*  
  > Notice that when I displace this control point, the geometry deforms smoothly in a localized region without modifying the knot vector or the mesh topology. This property is what makes IGA ideal for shape parameterization."  
  > *[Switch back to slides]*  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 20 | Slide 16: 2D Bivariate Basis Functions
* **Target Time:** `12:35 - 13:10` (Duration: 35s)  
* **Action:** Point to the 2D surface grid and the tensor product formula $N_{i,j}(\xi, \eta) = N_i(\xi) M_j(\eta)$.  
* **Spoken Words:**  
  > "To extend this to 2D continua, we take the tensor product of univariate basis functions along directions $\xi$ and $\eta$.  
  > 
  > This generates bivariate basis functions over a structured parametric grid, delivering smooth representation and localized support across the 2D domain."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 21 | Slide 17: Parametric to Physical Domain Mapping
* **Target Time:** `13:10 - 13:50` (Duration: 40s)  
* **Action:** Point to the mapping from the $[0,1]^2$ square to the notched beam.  
* **Spoken Words:**  
  > "Here we observe the elegant bridge between IGA and our pullback theory:  
  > The parent parametric square $[0, 1]^2$ serves natively as our invariant reference configuration $\hat{\Omega}$!  
  > 
  > The mapping to the notched physical geometry is defined directly by the 2D control point positions. All numerical quadrature is performed once on this standard parametric domain."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 22 | Slide 18: $h$-Refinement (Knot Insertion)
* **Target Time:** `13:50 - 14:25` (Duration: 35s)  
* **Action:** Highlight that knot insertion enriches the basis without altering the geometry.  
* **Spoken Words:**  
  > "In traditional FEM, refining the mesh alters the geometry.  
  > In IGA, **$h$-refinement** is performed by inserting new knots into the knot vector. This subdivides elements and adds degrees of freedom while preserving the exact CAD geometry down to machine precision."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 23 | Slide 19: $p$-Refinement (Degree Elevation)
* **Target Time:** `14:25 - 15:00` (Duration: 35s)  
* **Action:** Contrast polynomial degree elevation with standard high-order Lagrange elements.  
* **Spoken Words:**  
  > "Similarly, **$p$-refinement** elevates the polynomial degree of the spline basis functions. Unlike standard high-order Lagrange elements that suffer from Runge's phenomenon, B-spline elevation remains strictly stable and non-oscillatory."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 24 | Slide 20: $k$-Refinement & Exact Geometry
* **Target Time:** `15:00 - 15:40` (Duration: 40s)  
* **Action:** Point to the higher-order continuity $C^{p-1}$.  
* **Spoken Words:**  
  > "IGA introduces a unique capability called **$k$-refinement**:  
  > By elevating the degree first and then inserting knots, we obtain high-order basis functions with continuous inter-element derivatives—$C^{p-1}$ continuity.  
  > 
  > This eliminates artificial inter-element stress discontinuities, providing far superior accuracy per degree of freedom compared to classical $C^0$ elements."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 25 | Slide 21: Isoparametric Concept & Field Approximation
* **Target Time:** `15:40 - 16:15` (Duration: 35s)  
* **Action:** Point to the displacement approximation $\mathbf{u}_h = \sum R_i \mathbf{d}_i$.  
* **Spoken Words:**  
  > "Finally, following the isoparametric principle, the unknown dynamic displacement field $\mathbf{u}_h$ is approximated using the exact same NURBS functions that define the geometry.  
  > 
  > This guarantees exact representation of rigid-body modes and completes our spatial discretization."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 26 | Splash: Chapter 4: Simulation: Full Order Model
* **Target Time:** `16:15 - 16:25` (Duration: 10s)  
* **Action:** Announce the Full Order Model simulation chapter.  
* **Spoken Words:**  
  > "We now move to Chapter 4: Full Order Model Simulation and Validation."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 27 | Slide 22: From IGA to the Full Order Model (FOM)
* **Target Time:** `16:25 - 17:05` (Duration: 40s)  
* **Action:** Point to the semi-discrete system $\mathbf{M} \ddot{\mathbf{u}} + \mathbf{K}(\boldsymbol{\mu}) \mathbf{u} = \mathbf{F}$.  
* **Spoken Words:**  
  > "Assembling the weak form with our IGA basis yields the semi-discrete system of equations:  
  > $\mathbf{M} \ddot{\mathbf{u}}(t) + \mathbf{K}(\boldsymbol{\mu}) \mathbf{u}(t) = \mathbf{F}(t)$.  
  > 
  > For our refined beam model, this represents $N = 6{,}564$ degrees of freedom. While the mass matrix is constant, the stiffness matrix $\mathbf{K}(\boldsymbol{\mu})$ depends directly on our geometric parameters."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 28 | Slide 23: Simulation Path & Solver Workflow
* **Target Time:** `17:05 - 17:45` (Duration: 40s)  
* **Action:** Point to the Newmark parameters $\beta = 1/4, \gamma = 1/2$.  
* **Spoken Words:**  
  > "For temporal discretization, we deploy the implicit **Newmark-$\beta$** time-stepping algorithm with average acceleration.  
  > 
  > This scheme is unconditionally stable and introduces zero artificial numerical damping, preserving true physical oscillations across our time step $\Delta t = 0.05\text{ s}$."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 29 | Slide 24: Model Displacement Field
* **Target Time:** `17:45 - 18:20` (Duration: 35s)  
* **Action:** Gesture to the bending displacement profile on screen.  
* **Spoken Words:**  
  > "Slide 24 visualizes the dynamic bending response under tip excitation.  
  > The displacement profile demonstrates smooth flexural wave propagation, fully capturing structural compliance without shear-locking artifacts."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 30 | Slide 25: Model Stress & Von Mises Definition
* **Target Time:** `18:20 - 19:00` (Duration: 40s)  
* **Action:** Point to the stress concentration around the notch root.  
* **Spoken Words:**  
  > "Here we display the Von Mises stress distribution.  
  > Notice how the stress cleanly concentrates at the notch root. Because of the $C^1$ continuity of our quadratic NURBS basis, the stress field across element boundaries is smooth and continuous without requiring artificial post-processing smoothing."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 31 | Slide 26: Physical vs. Reference Mapped Path: Validation
* **Target Time:** `19:00 - 19:45` (Duration: 45s)  
* **Action:** Point to the machine-precision relative error ($< 10^{-12}$).  
* **Spoken Words:**  
  > "A fundamental milestone in this work was rigorous validation:  
  > Does solving on the pulled-back reference domain $\hat{\Omega}$ give the exact same physics as solving directly on the physical domain $\Omega(\boldsymbol{\mu})$?  
  > 
  > We implemented both pipelines independently in Python. As shown on the comparison graph, the maximum relative discrepancy is below $10^{-12}$—confirming mathematical equivalence down to floating-point precision."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 32 | Slide 27: Mesh Convergence Study
* **Target Time:** `19:45 - 20:30` (Duration: 45s)  
* **Action:** Point to the convergence slopes on the log-log plot.  
* **Spoken Words:**  
  > "We also verified spatial convergence through an $h$-refinement study.  
  > 
  > As the mesh size decreases, the relative error in the energy norm decreases with the optimal theoretical slope $O(h^p)$, confirming both the correctness of our solver and the reliability of our full-order baseline."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 33 | Splash: Chapter 5: Reduced Order Modeling & Hyper-Reduction
* **Target Time:** `20:30 - 20:40` (Duration: 10s)  
* **Action:** Announce the core contribution: ROM and Hyper-Reduction.  
* **Spoken Words:**  
  > "We now arrive at Chapter 5: Reduced Order Modeling and Hyper-Reduction."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 34 | Slide 28: Why ROM? (Motivation)
* **Target Time:** `20:40 - 21:25` (Duration: 45s)  
* **Action:** Point to the budget box: $< 1.5\text{ ms}$ solve time.  
* **Spoken Words:**  
  > "Why is Reduced Order Modeling essential?  
  > 
  > Our Full Order Model requires **142 milliseconds** per time step. For a web browser running at 60 FPS, the total frame time is 16 milliseconds, and our physics budget is **less than 1.5 milliseconds**!  
  > 
  > Furthermore, every time a user moves a slider, rebuilding the full stiffness matrix would freeze the browser entirely. We need instant solves with zero full-mesh assembly."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 35 | Slide 29: What Do We Need to Achieve It? (The Steps)
* **Target Time:** `21:25 - 22:10` (Duration: 45s)  
* **Action:** Trace the Offline vs. Online division on the diagram.  
* **Spoken Words:**  
  > "To achieve real-time interactivity, we partition the workflow into two phases:  
  > In the **Offline Phase**, on a workstation, we map the domain via pullback, collect dynamic snapshots across the parameter space, extract an optimal POD basis via SVD, and train an ECSW sparse element mesh.  
  > 
  > In the **Online Phase**, the browser receives this lightweight basis and solves the reduced system in milliseconds."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 36 | Slide 30: Step 1: Reference Pullback Mapping
* **Target Time:** `22:10 - 22:45` (Duration: 35s)  
* **Action:** Point to the invariant control net.  
* **Spoken Words:**  
  > "Step 1 fixes the reference mesh. Because the reference configuration $\hat{\Omega}$ is static, the degrees of freedom remain indexed identically regardless of notch shape, ensuring consistent snapshot rows."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 37 | Slide 31: Step 2: Snapshot Collection (Data Generation)
* **Target Time:** `22:45 - 23:25` (Duration: 40s)  
* **Action:** Point to the snapshot matrix $\mathbf{S} = [\mathbf{u}_1, \dots, \mathbf{u}_{N_s}]$.  
* **Spoken Words:**  
  > "In Step 2, we sample parameter pairs $(r, x_c)$ across the parameter space $\mathcal{D}$ using Latin Hypercube Sampling.  
  > 
  > For each parameter, we run the transient FOM solver and record the displacement state vectors into a comprehensive snapshot matrix $\mathbf{S}$."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 38 | Slide 32: Step 3: SVD / POD Basis Construction
* **Target Time:** `23:25 - 24:05` (Duration: 40s)  
* **Action:** Point to the rapid singular value decay.  
* **Spoken Words:**  
  > "In Step 3, we compute the Singular Value Decomposition of $\mathbf{S}$.  
  > 
  > The singular values drop exponentially: just **$r = 8$ to $12$ modes** capture more than **99.99%** of the total dynamic strain and kinetic energy, compressing the system dimension from 6,564 down to just 10 DOFs!"  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 39 | Slide 33: Step 4: Galerkin Projection vs. ECSW Hyper-reduction
* **Target Time:** `24:05 - 24:55` (Duration: 50s)  
* **Action:** Point to the matrix dimension diagram $\mathbf{K}_r = \boldsymbol{\Phi}^T \mathbf{K} \boldsymbol{\Phi}$ and contrast it with ECSW sparse cells.  
* **Spoken Words:**  
  > "However, standard Galerkin projection alone fails online!  
  > Projecting $\mathbf{K}_r = \boldsymbol{\Phi}^T \mathbf{K}(\boldsymbol{\mu}) \boldsymbol{\Phi}$ reduces the solve to a $10 \times 10$ system, but assembling $\mathbf{K}(\boldsymbol{\mu})$ still visits all 3,200 elements. In fact, standard Galerkin is actually *slower* online due to projection overhead!  
  > 
  > To break this bottleneck, we implement **Energy-Conserving Sampling and Weighting (ECSW)**. ECSW solves a non-negative least squares problem to select a sparse subset of just **28 active elements**, strictly preserving symmetry, coercivity, and energy stability."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 40 | Slide 34: Step 5: Real-Time Solver Benchmarks & LIVE DEMO
* **Target Time:** `24:55 - 26:15` (Duration: 1m 20s)  
* **Action & MAIN LIVE DEMONSTRATION:**  
  1. *[00:15]* Point to the benchmark table: Full Order (142 ms) vs. ECSW ROM (2.2 ms, $64.5\times$ speedup, $0.054\%$ error).  
  2. *[00:25]* Click the live web button / switch to the browser window (`/app/playground#5.3a`).  
  3. *[00:35]* **In Browser**:  
     - Drag the **notch depth slider $r$** (watch geometry update).  
     - Drag the **notch location slider $x_c$** (watch stress field shift).  
     - Point out the **real-time 60 FPS counter** and the live tip deflection curve.  
  4. *[01:10]* Switch back to the presentation (`Alt+Tab`).  
* **Spoken Words:**  
  > "The quantitative benchmarks confirm the breakthrough:  
  > While FOM takes 142 ms, our **ECSW ROM solves in just 2.2 milliseconds**—a **$64.5\times$ speedup** with a tiny relative error of **0.054%**!  
  > 
  > Let us witness this live in the web browser:  
  > *[Switch to Web Simulation Browser Tab]*  
  > As you can see, when I alter the notch depth or translate the notch along the beam, the mesh updates instantly, and the full dynamic wave response is computed locally in JavaScript at a smooth 60 frames per second. No server calls, no lag."  
  > *[Switch back to presentation]*  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 41 | Slide 35: Project Workflow: Completing the Puzzle
* **Target Time:** `26:15 - 26:45` (Duration: 30s)  
* **Action:** Trace the complete puzzle diagram connecting theory, IGA, Python, and the Web.  
* **Spoken Words:**  
  > "Slide 35 illustrates how all pieces of this engineering puzzle connect: from continuum mechanics and IGA formulation, to Python snapshot generation and ECSW optimization, culminating in a client-side JavaScript engine."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 42 | Splash: Chapter 6: Conclusion & Future Perspectives
* **Target Time:** `26:45 - 26:55` (Duration: 10s)  
* **Action:** Announce the conclusion.  
* **Spoken Words:**  
  > "We now conclude with Chapter 6: Summary and Perspectives."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 43 | Slide 36: Summary of Achievements & Implemented Methods
* **Target Time:** `26:55 - 27:30` (Duration: 35s)  
* **Action:** Deliver the 4 key achievements with pride and conviction.  
* **Spoken Words:**  
  > "In summary, this research achieved four key milestones:  
  > 1. Developed an exact-geometry 2D IGA elastodynamics solver.  
  > 2. Formulated a reference pullback mapping resolving parameter incompatibilities.  
  > 3. Implemented POD and ECSW hyper-reduction, shrinking 3,200 elements to 28 cells with a $64.5\times$ speedup.  
  > 4. Delivered an interactive web-based Digital Twin running at 60 FPS on standard consumer hardware."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 44 | Slide 37: Alternatives & Future Perspectives
* **Target Time:** `27:30 - 28:05` (Duration: 35s)  
* **Action:** Outline future research vectors to show scientific maturity.  
* **Spoken Words:**  
  > "For future work, three direct avenues open:  
  > - Incorporating geometric nonlinearities with Green-Lagrange strain directly in reduced space.  
  > - Extending from 2D plane stress to 3D solid structures using trivariate splines.  
  > - Developing adaptive on-the-fly basis enrichment when parameters explore extreme regimes."  
* **Transition:** `[CLICK NEXT SLIDE]`

---

### Page 45 | Thank You / Questions & Discussion
* **Target Time:** `28:05 - 28:20` (Duration: 15s)  
* **Action:** Stand upright, smile, make eye contact with each jury member, and bow slightly.  
* **Spoken Words:**  
  > "Thank you very much for your kind attention and interest. I am now delighted to open the discussion and answer the questions of the jury."  
* **Finished at:** **28:20** (Leaving **1 minute 40 seconds** of safety buffer before the 30:00 limit).

---
*(End of Complete Slide-by-Slide Script)*
