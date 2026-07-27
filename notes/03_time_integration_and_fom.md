# 03. Dynamic Time Integration & Full Order Model (FOM) Formulas

This document details the governing semi-discrete equations of structural dynamics, Rayleigh damping models, and the Generalized-$\alpha$ dynamic time integration algorithm used for stable, second-order accurate transient simulations.

---

## 1. Semi-Discrete Equations of Motion

### Formula
Applying spatial discretization via Isogeometric Analysis yields a system of second-order ordinary differential equations (ODEs):

$$\mathbf{M} \ddot{\mathbf{u}}(t) + \mathbf{C} \dot{\mathbf{u}}(t) + \mathbf{K}(\boldsymbol{\mu}) \mathbf{u}(t) = \mathbf{F}(t)$$

Where:
- $\mathbf{u}(t), \dot{\mathbf{u}}(t), \ddot{\mathbf{u}}(t) \in \mathbb{R}^N$ are global displacement, velocity, and acceleration vectors.
- $N$ is the number of unconstrained physical degrees of freedom ($N = 2 \times n_u \times n_v - N_{\text{BC}}$).
- $\mathbf{M} \in \mathbb{R}^{N \times N}$ is the symmetric positive-definite mass matrix.
- $\mathbf{C} \in \mathbb{R}^{N \times N}$ is the viscous damping matrix.
- $\mathbf{K}(\boldsymbol{\mu}) \in \mathbb{R}^{N \times N}$ is the parameter-dependent stiffness matrix.
- $\mathbf{F}(t) \in \mathbb{R}^N$ is the external force load vector.

---

## 2. Rayleigh Damping Formulation

### Formula
The global damping matrix $\mathbf{C}$ is constructed as a linear combination of mass and stiffness matrices:

$$\mathbf{C} = \alpha_m \mathbf{M} + \beta_k \mathbf{K}$$

Where $\alpha_m \ge 0$ is the mass proportional damping coefficient ($\text{s}^{-1}$) and $\beta_k \ge 0$ is the stiffness proportional damping coefficient ($\text{s}$).

### Modal Damping Ratio Connection
For natural frequency $\omega_i$, the damping ratio $\zeta_i$ is:

$$\zeta_i = \frac{\alpha_m}{2 \omega_i} + \frac{\beta_k \omega_i}{2}$$

---

### Mathematical Explanation & Why It Looks Like So
- **Computational Efficiency**: Rayleigh damping diagonalizes in the modal basis (orthogonal to natural mode shapes), allowing efficient time stepping without full non-proportional damping matrix inversion.
- **Physical Interpretation**:
  - $\alpha_m \mathbf{M}$ damps low-frequency rigid body / global beam modes (air resistance / body forces).
  - $\beta_k \mathbf{K}$ damps high-frequency spatial modes (internal material friction / inter-element numerical noise).

---

## 3. Generalized-$\alpha$ Dynamic Time Integration Scheme

### Governing Interpolation Formulas
Generalized-$\alpha$ evaluates the equations of motion at intermediate time levels $t_{n+1-\alpha_f}$ and $t_{n+1-\alpha_m}$:

$$\mathbf{M} \ddot{\mathbf{u}}_{n+1-\alpha_m} + \mathbf{C} \dot{\mathbf{u}}_{n+1-\alpha_f} + \mathbf{K} \mathbf{u}_{n+1-\alpha_f} = \mathbf{F}(t_{n+1-\alpha_f})$$

Where intermediate state vectors are defined by convex combinations:

$$\mathbf{u}_{n+1-\alpha_f} = (1 - \alpha_f) \mathbf{u}_{n+1} + \alpha_f \mathbf{u}_n$$

$$\dot{\mathbf{u}}_{n+1-\alpha_f} = (1 - \alpha_f) \dot{\mathbf{u}}_{n+1} + \alpha_f \dot{\mathbf{u}}_n$$

$$\ddot{\mathbf{u}}_{n+1-\alpha_m} = (1 - \alpha_m) \ddot{\mathbf{u}}_{n+1} + \alpha_m \ddot{\mathbf{u}}_n$$

---

### Newmark-Beta Kinematic Update Relations
Displacement and velocity at $t_{n+1}$ are updated via Newmark integrations:

$$\mathbf{u}_{n+1} = \mathbf{u}_n + \Delta t \dot{\mathbf{u}}_n + \Delta t^2 \left[ \left(\frac{1}{2} - \beta\right) \ddot{\mathbf{u}}_n + \beta \ddot{\mathbf{u}}_{n+1} \right]$$

$$\dot{\mathbf{u}}_{n+1} = \dot{\mathbf{u}}_n + \Delta t \left[ (1 - \gamma) \ddot{\mathbf{u}}_n + \gamma \ddot{\mathbf{u}}_{n+1} \right]$$

---

### Algorithmic Parameter Relations via High-Frequency Spectral Radius $\rho_\infty$

To control high-frequency numerical dissipation while maintaining unconditional stability and second-order accuracy, all parameters $(\alpha_m, \alpha_f, \beta, \gamma)$ are uniquely determined by a single user parameter, the high-frequency spectral radius $\rho_\infty \in [0, 1]$:

$$\alpha_m = \frac{2\rho_\infty - 1}{\rho_\infty + 1}, \quad \alpha_f = \frac{\rho_\infty}{\rho_\infty + 1}$$

$$\beta = \frac{1}{4} (1 + \alpha_f - \alpha_m)^2 = \frac{1}{(1 + \rho_\infty)^2}$$

$$\gamma = \frac{1}{2} + \alpha_f - \alpha_m = \frac{1}{2} + \frac{1 - \rho_\infty}{1 + \rho_\infty}$$

---

### Mathematical Explanation & Why It Looks Like So
- **$\rho_\infty = 1.0$ (No Dissipation / Midpoint Rule)**:
  - Gives $\alpha_m = 0.5, \alpha_f = 0.5, \beta = 0.25, \gamma = 0.5$. Preserves total mechanical energy exactly (symplectic-like for linear systems).
- **$\rho_\infty < 1.0$ (Controlled High-Frequency Damping)**:
  - Filters out unphysical high-frequency numerical oscillations caused by fine spatial mesh discretization, without introducing excessive numerical damping in lower physical modes (unlike standard HHT-$\alpha$ or WBZ-$\alpha$).
- **Unconditional Stability**: Standard requirement $\alpha_m \le \alpha_f \le \frac{1}{2}$ and $\beta \ge \frac{1}{4} + \frac{1}{2}(\alpha_f - \alpha_m)$ is automatically satisfied for all $\rho_\infty \in [0, 1]$.

---

## 4. Effective Tangent Matrix $\mathbf{K}_{\text{eff}}$ & Linear System Solution

### Formula
Substituting kinematic relations into the intermediate equilibrium equation yields a single linear system for the unknown acceleration vector $\ddot{\mathbf{u}}_{n+1}$:

$$\mathbf{K}_{\text{eff}} \ddot{\mathbf{u}}_{n+1} = \mathbf{F}_{\text{eff}}$$

Where the Effective Tangent Matrix $\mathbf{K}_{\text{eff}}$ is:

$$\mathbf{K}_{\text{eff}} = (1 - \alpha_m) \mathbf{M} + (1 - \alpha_f) \gamma \Delta t \mathbf{C} + (1 - \alpha_f) \beta \Delta t^2 \mathbf{K}$$

And the Effective Force Vector $\mathbf{F}_{\text{eff}}$ is:

$$\mathbf{F}_{\text{eff}} = \mathbf{F}(t_{n+1-\alpha_f}) - \mathbf{C} \left( \dot{\mathbf{u}}_n + (1 - \alpha_f)(1 - \gamma)\Delta t \ddot{\mathbf{u}}_n \right) - \mathbf{K} \left( \mathbf{u}_n + (1 - \alpha_f)\Delta t \dot{\mathbf{u}}_n + (1 - \alpha_f)\left(\frac{1}{2} - \beta\right)\Delta t^2 \ddot{\mathbf{u}}_n \right) - \alpha_m \mathbf{M} \ddot{\mathbf{u}}_n$$

---

### App & Code Alignment
In `app/shared/fom-solver.js`:
```js
// Generalized-alpha parameter calculation in fom-solver.js
const rhoInf = 0.8;
const alphaM = (2 * rhoInf - 1) / (rhoInf + 1);
const alphaF = rhoInf / (rhoInf + 1);
const gamma  = 0.5 + alphaF - alphaM;
const beta   = 0.25 * (1 + alphaF - alphaM) * (1 + alphaF - alphaM);

// Effective matrix coefficient assembly
const cM = (1 - alphaM);
const cC = (1 - alphaF) * gamma * dt;
const cK = (1 - alphaF) * beta * dt * dt;
```
