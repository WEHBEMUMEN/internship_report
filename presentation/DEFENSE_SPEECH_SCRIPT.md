# M2 Thesis Defense: Complete 30-Minute Oral Speech Script
**Candidate:** Mumen Wehbe  
**Institution:** Conservatoire National des Arts et Métiers (Cnam Paris)  
**Laboratory:** LMSSC (Laboratoire de Mécanique des Structures et des Systèmes Couplés)  
**Supervisor:** Christophe Hoareau  
**Title:** *Real-Time Physics on the Web: Geometrical Parameters in Isogeometric Analysis & Reduced Order Modeling for Structural Dynamics*  
**Allocated Time:** Exactly 30 minutes (Target speaking time: 27:30 + 2:30 buffer)  
**Average Speaking Rate:** ~125–135 words per minute  

---

## ⏱️ Master 30-Minute Timing Dashboard

| Chapter / Block | Slide Numbers | Cumulative Time | Allocated Duration | Key Goal / Milestone |
| :--- | :---: | :---: | :---: | :--- |
| **Preamble & Organization** | 1 – 4 | **00:00 – 02:00** | 2 min 00 s | Welcome jury, set professional tone, state agenda |
| **Ch. 1: Introduction & Motivation** | 5 – 6 | **02:00 – 04:30** | 2 min 30 s | Define dual scope (pedagogy + research), compression analogies |
| **Ch. 2: Theory & Pullback Mapping** | 7 – 11 | **04:30 – 09:00** | 4 min 30 s | Continuum formulation, parameter space $\boldsymbol{\mu}$, reference domain $\hat{\Omega}$ |
| **Ch. 3: Isogeometric Analysis (IGA)** | 12 – 22 | **09:00 – 16:00** | 7 min 00 s | NURBS foundations, $h/p/k$-refinements, exact CAD boundary |
| **Ch. 4: Full Order Model (FOM)** | 23 – 28 | **16:00 – 20:30** | 4 min 30 s | Dynamic Newmark-$\beta$ solver, verification & mesh convergence |
| **Ch. 5: ROM & Hyper-Reduction** | 29 – 36 | **20:30 – 26:00** | 5 min 30 s | POD basis, ECSW 28 cells, $64.5\times$ speedup, live web demo |
| **Ch. 6: Conclusions & Perspectives** | 37 – 39 | **26:00 – 28:00** | 2 min 00 s | Summary of metrics, future research paths, open Q&A |
| **Buffer Margin** | — | **28:00 – 30:00** | 2 min 00 s | Breathing room for pauses, device transitions, jury handover |

---

## Slide-by-Slide Spoken Script

```
LEGEND:
[ACTION]       = Physical gestures, laser pointer cues, slide advancing
[TIME]         = Target elapsed clock time
[DELIVERY TIP] = Tone, emphasis, or pacing guidance
```

---

### PREAMBLE: Context & Team (Slides 1 – 4)

#### Slide 1: Title Slide (Plain Crimson Banner)
* **Time:** `[00:00 - 00:45]` (Duration: 45s)
* **Action:** Stand upright, look directly at the jury president and members. Do not rush.
* **Speech:**
  > "Dear members of the jury, Mr. President, and attendees.  
  > 
  > Welcome to my Master 2 thesis defense in Computational Mechanics. Today, I am proud to present my research titled: **'Real-Time Physics on the Web: Geometrical Parameters in Isogeometric Analysis and Reduced Order Modeling for Structural Dynamics'**.  
  > 
  > This work was conducted at the Conservatoire National des Arts et Métiers under the supervision of Dr. Christophe Hoareau. Our objective is to bridge rigorous continuum mechanics with modern web technologies to achieve millisecond-scale, interactive dynamic simulations of parameterized structures."

---

#### Slide 2: Host Institution & Research Laboratory
* **Time:** `[00:45 - 01:15]` (Duration: 30s)
* **Action:** Gesture toward the CNAM portal and LMSSC research axes.
* **Speech:**
  > "This investigation was carried out within the **LMSSC**—the Structural Mechanics and Coupled Systems Laboratory at CNAM Paris.  
  > 
  > The laboratory specializes in structural dynamics, multiphysics coupling, fluid-structure interaction, and vibration control. This project directly contributes to the DYSCOM research group, focusing on advanced numerical formulations and lightweight digital twin demonstrators."

---

#### Slide 3: Supervision & Research Team
* **Time:** `[01:15 - 01:40]` (Duration: 25s)
* **Action:** Acknowledge your supervisor and the laboratory staff with a nod.
* **Speech:**
  > "I would like to express my sincere gratitude to my supervisor, Dr. Christophe Hoareau, for his continuous guidance, insightful feedback, and scientific support throughout this internship.  
  > 
  > I also warmly thank the professors, researchers, and administrative team at LMSSC for providing an outstanding research environment."

---

#### Slide 4: Lecture Overview (Table of Contents)
* **Time:** `[01:40 - 02:00]` (Duration: 20s)
* **Action:** Briefly sweep over the 6 chapters on the screen.
* **Speech:**
  > "Our presentation is structured into six chapters. We will begin with the motivation and state of the art, formulate the continuous boundary value problem with reference mapping, detail the IGA spatial discretization, present the Full Order Model dynamic simulation, and then demonstrate our Reduced Order Model using POD and ECSW hyper-reduction, before concluding with future research perspectives."

---

### CHAPTER 1: Introduction & Motivation (Slides 5 – 6)

#### Slide 5: Introduction & Motivation (Dual Scope)
* **Time:** `[02:00 - 03:15]` (Duration: 1m 15s)
* **Action:** Point to the two blocks on the left, then gesture toward the web interface screenshot on the right. *Do NOT click the web link yet.*
* **Speech:**
  > "To understand the motivation behind this work, we must consider its **Dual Scope**.  
  > 
  > On one hand, there is a strong **pedagogical need**: standard structural mechanics is often taught using static formulas or pre-baked plots. We wanted to build an intuitive, zero-install web visualizer that allows students and engineers to interact with wave propagation and vibration modes in real time.  
  > 
  > On the other hand, this required solving a severe **scientific challenge**: in parametric design, if you modify the shape of a structure, standard Finite Element Methods require expensive remeshing, and solving thousands of degrees of freedom cannot maintain interactive frame rates.  
  > 
  > To solve this bottleneck, our framework couples **Isogeometric Analysis (IGA)** for exact geometry representation with **Reduced Order Modeling (ROM)** and **ECSW hyper-reduction**, targeting client-side execution in the browser at over 60 frames per second."

---

#### Slide 6: Conceptual Parallels to Data Compression
* **Time:** `[03:15 - 04:30]` (Duration: 1m 15s)
* **Action:** Point sequentially to the three landmark cards: Hughes, Quarteroni, and Farhat.
* **Speech:**
  > "Before diving into the equations, it is insightful to draw analogies between our numerical pipeline and classical data compression:  
  > 
  > First, **Isogeometric Analysis**—introduced by Hughes and Cottrell in 2005—is analogous to **vector graphics versus rasterized pixels**. Classical FEM approximates curved boundaries with piecewise flat facets. IGA preserves the exact CAD spline geometry, avoiding geometric discretization errors.  
  > 
  > Second, **Reduced Order Modeling**—synthesized by Quarteroni and colleagues—acts like **spectral audio compression**. Instead of tracking thousands of spatial degrees of freedom, we project the dynamic state onto dominant energy-carrying spatial modes.  
  > 
  > Finally, **Hyper-Reduction via ECSW**—introduced by Farhat et al.—is analogous to **optimal sensor placement**. When the geometry changes, standard projection still requires integrating over the entire mesh. ECSW identifies a sparse set of critical elements to compute the reduced matrices in microseconds."

---

### CHAPTER 2: Theory & Pullback Mapping (Slides 7 – 11)

#### Slide 7: Geometry Configurations
* **Time:** `[04:30 - 05:30]` (Duration: 1m 00s)
* **Action:** Point to the notched beam schematic, highlighting $r$ and $x_c$.
* **Speech:**
  > "Let us examine our physical benchmark problem. We consider a 2D cantilever beam clamped at the left boundary and subjected to a transient dynamic tip load.  
  > 
  > The geometry features symmetric circular notches parameterized by a two-dimensional parameter vector $\boldsymbol{\mu} = (r, x_c)^T$:  
  > $r$ represents the notch depth, and $x_c$ denotes the axial position of the notch along the beam.  
  > 
  > The parameter domain $\mathcal{D}$ is compact. Notice that varying $\boldsymbol{\mu}$ directly changes the physical boundary $\Omega(\boldsymbol{\mu})$. This causes a fundamental vector space incompatibility that we must address."

---

#### Slide 8: Governing Equations & Assumptions
* **Time:** `[05:30 - 06:15]` (Duration: 45s)
* **Action:** Quickly recap the linear momentum balance.
* **Speech:**
  > "Under the assumptions of linear elasticity, small strains, and 2D plane stress, the dynamic behavior is governed by the balance of linear momentum:  
  > $\rho \ddot{\mathbf{u}} - \nabla \cdot \boldsymbol{\sigma} = \mathbf{b}$ in $\Omega(\boldsymbol{\mu})$.  
  > 
  > The stress tensor obeys Hooke's law with isotropic elasticity tensors, clamped Dirichlet conditions on the left wall, and time-dependent traction on the right tip."

---

#### Slide 9: Classical Weak Form on $\Omega(\boldsymbol{\mu})$
* **Time:** `[06:15 - 07:00]` (Duration: 45s)
* **Action:** Highlight the parameter dependence in the integration domain $\Omega(\boldsymbol{\mu})$.
* **Speech:**
  > "Multiplying by kinematically admissible test functions $\mathbf{v}$ yields the standard weak formulation: find $\mathbf{u} \in \mathcal{V}$ such that the inertial form, internal bilinear form, and external load balance for all $\mathbf{v}$.  
  > 
  > But observe the core mathematical issue: the integration domain itself depends on $\boldsymbol{\mu}$. If the physical domain changes with every parameter choice, the function spaces differ, preventing the direct extraction of a global reduced basis."

---

#### Slide 10: Pullback Mapping to Reference Configuration
* **Time:** `[07:00 - 08:00]` (Duration: 1m 00s)
* **Action:** Trace the arrow $\boldsymbol{\Psi}(\hat{\mathbf{x}}; \boldsymbol{\mu})$ connecting the reference domain $\hat{\Omega}$ to the physical domain $\Omega(\boldsymbol{\mu})$.
* **Speech:**
  > "To resolve this incompatibility, we introduce a diffeomorphic pullback mapping $\boldsymbol{\Psi}$.  
  > 
  > Instead of solving on the varying physical domain $\Omega(\boldsymbol{\mu})$, we map the problem onto an invariant, parameter-independent reference configuration $\hat{\Omega}$—which in our case is a regular rectangle.  
  > 
  > Any point $\mathbf{x}$ in the physical domain is expressed as $\boldsymbol{\Psi}(\hat{\mathbf{x}}; \boldsymbol{\mu})$. Using the transformation Jacobian $\mathbf{F} = \nabla_{\hat{\mathbf{x}}} \boldsymbol{\Psi}$ and its determinant $J$, all spatial gradients and volume differentials are mapped back onto $\hat{\Omega}$."

---

#### Slide 11: Pulled-Back Weak Form on $\hat{\Omega}$
* **Time:** `[08:00 - 09:00]` (Duration: 1m 00s)
* **Action:** Point to the pulled-back constitutive tensor $\hat{\mathcal{C}}(\boldsymbol{\mu})$.
* **Speech:**
  > "Here is the resulting pulled-back weak form evaluated on the static domain $\hat{\Omega}$.  
  > 
  > Notice the critical mathematical consequence: the geometry variations have been transferred completely from the domain boundary into the algebraic coefficients of the differential operators.  
  > 
  > All test and trial functions now belong to a fixed Hilbert space $H^1(\hat{\Omega})$. This enables consistent snapshot collection and reduced basis projection across the entire parameter space."

---

### CHAPTER 3: Isogeometric Analysis (IGA) (Slides 12 – 22)

#### Slide 12: Curve Representations in Geometry
* **Time:** `[09:00 - 09:30]` (Duration: 30s)
* **Action:** Contrast polygonal facets with smooth parametric curves.
* **Speech:**
  > "Now, how do we discretize this formulation? In classical engineering pipelines, CAD models are converted into faceted linear finite element meshes.  
  > 
  > Every time you alter a geometric parameter, the mesh must be regenerated, leading to discretization errors, stress artifacts at boundaries, and heavy communication overhead between CAD and FEA solvers."

---

#### Slide 13: Why IGA?
* **Time:** `[09:30 - 10:00]` (Duration: 30s)
* **Action:** Highlight the IGA core philosophy.
* **Speech:**
  > "Isogeometric Analysis resolves this dichotomy by employing the exact same basis functions for numerical analysis as those used in CAD to describe geometry—namely, B-Splines and Non-Uniform Rational B-Splines (NURBS).  
  > 
  > As a result, geometric fidelity is exact from the very beginning, and continuity across element boundaries can be made arbitrarily smooth ($C^{p-1}$)."

---

#### Slide 14: The Core Ingredients of IGA
* **Time:** `[10:00 - 10:35]` (Duration: 35s)
* **Action:** Point to the three components: Knot vectors, Control points, Basis functions.
* **Speech:**
  > "The architecture of IGA rests on three fundamental components:  
  > 1. A non-decreasing **Knot Vector** $\Xi$, which partitions the parametric space into elements.  
  > 2. A set of **Control Points** $\mathbf{P}_i$ in Cartesian space, forming a control polygon.  
  > 3. Univariate and bivariate **B-spline basis functions** that interpolate between these control points."

---

#### Slide 15: B-Spline Basis Functions (Cox-de Boor)
* **Time:** `[10:35 - 11:15]` (Duration: 40s)
* **Action:** Mention the Cox-de Boor recursion and partition of unity.
* **Speech:**
  > "Basis functions are defined recursively via the **Cox-de Boor formula**, starting from piecewise constants of degree zero up to polynomial degree $p$.  
  > 
  > They possess key mathematical properties: compact local support, strict non-negativity, and partition of unity, ensuring that rigid body modes and constant strain states are represented exactly."

---

#### Slide 16: B-Spline Curve Concept
* **Time:** `[11:15 - 11:50]` (Duration: 35s)
* **Action:** Trace how control points guide the physical curve without lying on it.
* **Speech:**
  > "A B-spline curve is simply a linear combination of these basis functions weighted by control points $\mathbf{P}_i$.  
  > 
  > Crucially, moving a control point perturbs the curve smoothly in a localized region without requiring any remeshing. The mesh connectivity and knot topology remain completely invariant."

---

#### Slide 17: 2D Bivariate Basis Functions (Tensor Product)
* **Time:** `[11:50 - 12:30]` (Duration: 40s)
* **Action:** Point to the 2D surface grid and the tensor product formula $N_{i,j}(\xi, \eta) = N_i(\xi) M_j(\eta)$.
* **Speech:**
  > "To model our 2D continuum, we take the tensor product of univariate basis functions along two parametric coordinates, $\xi$ and $\eta$.  
  > 
  > This constructs smooth 2D shape functions over a structured parametric element grid, combining high inter-element regularity with compact stencil support."

---

#### Slide 18: Parametric to Physical Domain Mapping
* **Time:** `[12:30 - 13:10]` (Duration: 40s)
* **Action:** Point to the parent domain $[0,1]^2$ mapping to the notched physical beam.
* **Speech:**
  > "Here we observe the elegance of IGA for our specific problem: the parent parametric domain $\hat{\Omega}_{\text{param}} = [0, 1]^2$ serves natively as our reference configuration!  
  > 
  > Moving from the reference square to the notched physical geometry simply requires positioning the physical control points. All numerical quadratures are performed once on the invariant reference space."

---

#### Slide 19, 20 & 21: Refinements: $h$, $p$, and $k$-Refinement
* **Time:** `[13:10 - 14:40]` (Duration: 1m 30s)
* **Action:** Group these three slides into a single narrative on refinement power.
* **Speech:**
  > "In traditional FEM, mesh refinement ($h$-refinement) or polynomial elevation ($p$-refinement) alters the geometric boundary approximation.  
  > 
  > In IGA, knot insertion allows us to refine the mesh ($h$-refinement) while leaving the physical CAD geometry 100% untouched.  
  > 
  > Furthermore, IGA introduces **$k$-refinement**: by elevating the polynomial degree first and then inserting knots, we obtain high-order basis functions with continuous inter-element derivatives ($C^{p-1}$). This eliminates inter-element stress discontinuities common to classical $C^0$ elements."

---

#### Slide 22: Isoparametric Concept & Field Approximation
* **Time:** `[14:40 - 16:00]` (Duration: 1m 20s)
* **Action:** Point to the displacement field equation $\mathbf{u}_h = \sum R_i \mathbf{d}_i$.
* **Speech:**
  > "Finally, following the isoparametric concept, the unknown displacement field $\mathbf{u}_h$ is approximated using the exact same NURBS basis functions that represent the beam geometry.  
  > 
  > This ensures that rigid-body motions produce zero strain energy, and completes the continuous-to-discrete IGA discretization of our structural continuum."

---

### CHAPTER 4: Full Order Model (FOM) Simulation (Slides 23 – 28)

#### Slide 23: From IGA to the Full Order Model
* **Time:** `[16:00 - 16:45]` (Duration: 45s)
* **Action:** Highlight the semi-discrete system $\mathbf{M} \ddot{\mathbf{u}} + \mathbf{K} \mathbf{u} = \mathbf{f}$.
* **Speech:**
  > "By inserting the IGA field approximations into the pulled-back weak form, we assemble the semi-discrete equations of motion:  
  > $\mathbf{M} \ddot{\mathbf{u}}(t) + \mathbf{K}(\boldsymbol{\mu}) \mathbf{u}(t) = \mathbf{F}(t)$.  
  > 
  > For our refined beam model, this system contains $N = 6{,}564$ degrees of freedom. While the mass matrix is constant, the stiffness matrix $\mathbf{K}(\boldsymbol{\mu})$ depends directly on our shape parameters."

---

#### Slide 24: Simulation Path & Solver Workflow
* **Time:** `[16:45 - 17:30]` (Duration: 45s)
* **Action:** Trace the time-stepping workflow.
* **Speech:**
  > "To integrate in time, we deploy the implicit **Newmark-$\beta$** time integration scheme with average acceleration ($\beta = 1/4$, $\gamma = 1/2$), which guarantees unconditional numerical stability without introducing artificial numerical damping.  
  > 
  > At each time step $\Delta t = 0.05\text{ s}$, an effective linear system must be solved."

---

#### Slide 25 & 26: Displacement Field & Von Mises Stress
* **Time:** `[17:30 - 18:45]` (Duration: 1m 15s)
* **Action:** Point to the TikZ mesh visualizations and stress concentration around the notch.
* **Speech:**
  > "These slides show the computed physical response under dynamic tip excitation.  
  > 
  > On Slide 25, we visualize the smooth bending displacement field.  
  > 
  > On Slide 26, we examine the Von Mises stress distribution. Notice how the stress cleanly concentrates at the notch root. Thanks to the higher-order continuity of IGA, the stress field across elements is smooth and continuous without requiring artificial nodal averaging."

---

#### Slide 27: Physical vs. Reference Mapped Path: Validation
* **Time:** `[18:45 - 19:40]` (Duration: 55s)
* **Action:** Point to the relative error curve $< 10^{-12}$.
* **Speech:**
  > "A crucial validation step in this research was proving that solving on the pulled-back reference domain $\hat{\Omega}$ yields the exact same physics as solving on the deformed physical domain $\Omega(\boldsymbol{\mu})$.  
  > 
  > We implemented both paths independently in Python. As shown on the comparison plot, the difference between the two solutions is on the order of machine precision ($< 10^{-12}$), mathematically validating our pullback Jacobian formulation."

---

#### Slide 28: Mesh Convergence Study
* **Time:** `[19:40 - 20:30]` (Duration: 50s)
* **Action:** Point to the energy error convergence slope.
* **Speech:**
  > "We also performed an $h$-convergence study across multiple mesh densities.  
  > 
  > As the element size $h$ decreases, the relative error in the energy norm converges with the optimal theoretical rate $O(h^{p})$, confirming both the spatial accuracy of our IGA implementation and the reliability of our full-order baseline."

---

### CHAPTER 5: Reduced Order Modeling (ROM) & Hyper-Reduction (Slides 29 – 36)

#### Slide 29: Why ROM? (Motivation)
* **Time:** `[20:30 - 21:15]` (Duration: 45s)
* **Action:** Point to the interactive budget box: $< 1.5\text{ ms}$.
* **Speech:**
  > "Now we arrive at the central research question of this thesis: **Why do we need Reduced Order Modeling?**  
  > 
  > Our Full Order Model has over 6,500 DOFs. Solving it takes approximately 142 milliseconds per time step. For a web browser running at 60 FPS, our entire computational budget per frame is under 16 milliseconds—and for the physics solver alone, we need **less than 1.5 milliseconds**!  
  > 
  > Moreover, if the user moves a slider to change the notch shape, reassembling the full stiffness matrix would completely freeze the browser."

---

#### Slide 30: What Do We Need to Achieve It? (The Steps)
* **Time:** `[21:15 - 22:00]` (Duration: 45s)
* **Action:** Trace the offline/online divider on the diagram.
* **Speech:**
  > "To overcome this, we design a two-stage offline/online strategy:  
  > In the **Offline Phase**, we generate transient snapshots across the parameter space $\mathcal{D}$, extract an optimal low-dimensional basis $\boldsymbol{\Phi}$ via SVD, and train an ECSW sparse element mesh.  
  > 
  > In the **Online Phase**, the browser receives this compact basis. When parameters change, it performs a lightweight solve in reduced space ($r \ll N$) without touching the full mesh."

---

#### Slide 31, 32 & 33: Pullback, Snapshots & POD Basis Construction
* **Time:** `[22:00 - 23:15]` (Duration: 1m 15s)
* **Action:** Point to the singular value decay curve showing rapid modal energy capture.
* **Speech:**
  > "Using our reference pullback, snapshots across diverse values of notch depth $r$ and location $x_c$ are assembled into a global snapshot matrix $\mathbf{S}$.  
  > 
  > Computing the Singular Value Decomposition (SVD) of $\mathbf{S}$ yields the Proper Orthogonal Decomposition (POD) basis modes $\boldsymbol{\Phi}$.  
  > 
  > The singular values decay exponentially: just $r = 8$ to $12$ modes capture over 99.99% of the total kinetic and strain energy of the dynamic response."

---

#### Slide 34: Galerkin Projection vs. ECSW Hyper-reduction
* **Time:** `[23:15 - 24:15]` (Duration: 1m 00s)
* **Action:** Emphasize the matrix dimension illustration and the 28 active elements.
* **Speech:**
  > "However, standard Galerkin projection alone is not enough!  
  > 
  > Projecting the stiffness matrix $\mathbf{K}_r = \boldsymbol{\Phi}^T \mathbf{K}(\boldsymbol{\mu}) \boldsymbol{\Phi}$ reduces the solve to an $r \times r$ system, but computing $\mathbf{K}(\boldsymbol{\mu})$ still scales with the full dimension $N$. In fact, standard Galerkin ROM is actually *slower* online due to projection overhead!  
  > 
  > This is where **Energy-Conserving Sampling and Weighting (ECSW)** comes in. ECSW solves a non-negative least squares problem offline to select a minimal subset of just **28 elements** out of 3,200, assigning them positive weights.  
  > 
  > Because ECSW operates at the element integration level, it strictly preserves symmetry and positive definiteness, avoiding the numerical instabilities of DEIM."

---

#### Slide 35: Real-Time Solver Benchmarks
* **Time:** `[24:15 - 25:15]` (Duration: 1m 00s)
* **Action:** Point to the table numbers: $64.5\times$ speedup and $0.054\%$ error.
* **Speech:**
  > "The benchmark results on Slide 35 demonstrate the dramatic success of this approach:  
  > 
  > The Full Order Model takes **142.1 ms** per step.  
  > Standard Galerkin ROM takes **154.5 ms** because it still visits every element.  
  > 
  > Our **ECSW Hyper-ROM** evaluates only 28 cells and solves the dynamics in just **2.2 milliseconds**—achieving a **64.5 times speedup** while maintaining a tiny relative error of **0.054%**!  
  > 
  > On the right, the tip displacement curves of the FOM and ECSW ROM overlap almost indistinguishably."

---

#### Slide 36: Project Workflow & Live Demonstration
* **Time:** `[25:15 - 26:00]` (Duration: 45s)
* **Action:** [OPTIONAL 45s LIVE DEMO] Show the web application interface or open the live browser tab. Move the notch slider smoothly.
* **Speech:**
  > "To translate this into practice, we packaged the reduced solver into a client-side JavaScript engine running in WebGL.  
  > 
  > *[Pointing to browser or screen]*  
  > As you can see, when I move the notch depth and location sliders, the geometry updates instantaneously, and the physical dynamic wave response computes live at 60 frames per second without any backend server. The entire simulation runs locally on this laptop's web browser."

---

### CHAPTER 6: Conclusions & Perspectives (Slides 37 – 39)

#### Slide 37: Summary of Achievements & Implemented Methods
* **Time:** `[26:00 - 27:00]` (Duration: 1m 00s)
* **Action:** Summarize the three pillars: IGA solver, ECSW reduction, Web Digital Twin.
* **Speech:**
  > "To summarize our primary achievements:  
  > 1. We built a high-fidelity 2D Isogeometric Analysis solver for elastodynamics based on exact CAD spline geometry.  
  > 2. We formulated an invariant reference pullback that resolved vector-space incompatibility for parameterized geometries.  
  > 3. We successfully implemented POD and ECSW hyper-reduction, condensing 3,200 elements down to 28 active cells, achieving a $64.5\times$ speedup with under $0.06\%$ error.  
  > 4. We delivered a functional, interactive web-based digital twin demonstrator running in real time."

---

#### Slide 38: Alternatives & Future Perspectives
* **Time:** `[27:00 - 27:45]` (Duration: 45s)
* **Action:** Outline scientific extensions to demonstrate breadth of research vision.
* **Speech:**
  > "Looking to future work, several promising research avenues emerge:  
  > - **Geometric nonlinearities**: Extending the formulation to large displacements using Green-Lagrange strain tensors directly within the reduced subspace.  
  > - **3D Multi-Patch Splines**: Scaling from 2D plane stress to 3D solid structures using trivariate B-splines.  
  > - **Online Adaptive Bases**: Implementing localized on-the-fly basis enrichment when parameters enter unseen regimes."

---

#### Slide 39: Thank You / Questions & Discussion
* **Time:** `[27:45 - 28:00]` (Duration: 15s)
* **Action:** Smile, make eye contact with the jury, and formally open the floor.
* **Speech:**
  > "Thank you very much for your attention and interest. I am now delighted to answer your questions and open the discussion."

---

## 🎯 Defense Q&A Strategy: The Top 4 Trap Questions

When the jury begins questions, use these concise, bullet-proof responses:

### 1. "Why did you choose ECSW rather than DEIM or MDEIM?"
> **Your Answer:**  
> *"DEIM uses point collocation to interpolate vector fields. In elastodynamics, collocation does not guarantee that the reduced stiffness matrix remains symmetric or positive-definite, which frequently introduces artificial numerical dissipation or instability in time-stepping. In contrast, ECSW acts directly on the energy quadrature level. Because the weights are constrained to be strictly non-negative, symmetry, coercivity, and energy conservation are preserved by construction."*

### 2. "Is the offline computational cost justified for a real-time web app?"
> **Your Answer:**  
> *"Yes, because the offline cost is a one-time investment performed on a high-performance workstation. Once the basis and active elements are extracted, the resulting payload is just a few kilobytes of JSON and binary arrays. This allows thousands of end-users or field engineers to run interactive simulations on lightweight mobile devices or browsers with zero backend server costs."*

### 3. "Why assume linear elasticity instead of large nonlinear deformations?"
> **Your Answer:**  
> *"Our primary research goal was establishing the mathematical and algorithmic proof-of-concept for reference pullback in IGA coupled with hyper-reduction on the web. Linear elastodynamics with moving geometric parameters is already non-affine and presents substantial reduction challenges. With this reference mapping validated, extending to nonlinear strain tensors is our direct next step."*

### 4. "How sensitive is the ECSW element selection to parameter changes outside the training domain?"
> **Your Answer:**  
> *"The ECSW training snapshot set was sampled across the entire compact parameter space $\mathcal{D}$ using Latin Hypercube Sampling. As long as parameters remain within $\mathcal{D}$, the active cells cover the critical high-strain regions (such as the notch roots and clamped boundary). If we extrapolate beyond $\mathcal{D}$, local basis enrichment or adaptive sampling would be required."*

---
*(End of Speech Script)*
