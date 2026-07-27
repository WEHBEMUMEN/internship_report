# 02. IGA Continuum Mechanics, Discretization, and Pullback Mapping

This document detail the continuum elasticity formulas, strain-displacement operators, stiffness/mass element matrix assembly, Gauss quadrature transformations, and the diffeomorphic reference pullback mapping $\hat{\Omega}$ used to resolve spatial remeshing issues.

---

## 1. Linear Elasticity Constitutive Matrix $\mathbf{D}$ (Hooke's Law)

### Formulas

#### 2D Plane Stress (Thin Plates / Cantilever Beams in $x-y$ Plane)
In 2D plane stress ($\sigma_z = 0, \tau_{xz} = 0, \tau_{yz} = 0$), the stress-strain relation $\boldsymbol{\sigma} = \mathbf{D} \boldsymbol{\varepsilon}$ is governed by:

$$\mathbf{D}_{\text{plane stress}} = \frac{E}{1 - \nu^2} \begin{bmatrix} 1 & \nu & 0 \\ \nu & 1 & 0 \\ 0 & 0 & \frac{1 - \nu}{2} \end{bmatrix}$$

#### 2D Plane Strain (Thick Structures in $z$-direction, $\varepsilon_z = 0$)
$$\mathbf{D}_{\text{plane strain}} = \frac{E}{(1 + \nu)(1 - 2\nu)} \begin{bmatrix} 1 - \nu & \nu & 0 \\ \nu & 1 - \nu & 0 \\ 0 & 0 & \frac{1 - 2\nu}{2} \end{bmatrix}$$

---

### Mathematical Explanation & Why It Looks Like So
- **Physical Quantities**:
  - $E$: Young's Modulus (stiffness of material, measured in MPa or Pa).
  - $\nu$: Poisson's ratio (ratio of transverse contraction strain to longitudinal expansion strain, typically $0.25 - 0.35$ for metals).
- **Matrix Symmetry**: $\mathbf{D} = \mathbf{D}^T$ ensures energy conservation (existence of a strain energy density function $W = \frac{1}{2} \boldsymbol{\varepsilon}^T \mathbf{D} \boldsymbol{\varepsilon}$).
- **Shear Modulus Connection**: The bottom-right entry $\frac{E (1-\nu)}{2(1-\nu^2)} = \frac{E}{2(1+\nu)} = G$, which is the shear modulus linking shear stress $\tau_{xy}$ to engineering shear strain $\gamma_{xy}$.

---

### Variable Dependencies
1. **$E$ (Young's Modulus)**:
   - *Why it depends on it*: Scales all stress components linearly. Higher $E$ means larger resistance to deformation.
2. **$\nu$ (Poisson's Ratio)**:
   - *Why it depends on it*: Controls lateral expansion/contraction coupling (Poisson effect). As $\nu \to 0.5$ (incompressible elasticity like rubber), plane strain denominator $(1 - 2\nu) \to 0$, causing numerical volumetric locking.

---

### App & Code Alignment
In `app/shared/fom-solver.js` and `visualizer/mesh_convergence.py`:
```js
// Plane Stress D matrix calculation in fom-solver.js
const factor = E / (1 - nu * nu);
const D = [
  factor,        factor * nu,   0,
  factor * nu,   factor,        0,
  0,             0,             factor * (1 - nu) / 2
];
```

---

## 2. Strain-Displacement Matrix $\mathbf{B}_a$

### Formula
For a 2D elastic domain, strain vector $\boldsymbol{\varepsilon} = [\varepsilon_{xx}, \varepsilon_{yy}, \gamma_{xy}]^T$ at any point is related to control point displacement degrees of freedom $\mathbf{d} = [u_1, v_1, u_2, v_2, \dots]^T$ via:

$$\boldsymbol{\varepsilon}(u, v) = \sum_{a=1}^{(p+1)(q+1)} \mathbf{B}_a(u, v) \mathbf{d}_a$$

Where the $3 \times 2$ block matrix $\mathbf{B}_a$ for basis function $R_a$ is:

$$\mathbf{B}_a(u, v) = \begin{bmatrix} \dfrac{\partial R_a}{\partial x} & 0 \\[8pt] 0 & \dfrac{\partial R_a}{\partial y} \\[8pt] \dfrac{\partial R_a}{\partial y} & \dfrac{\partial R_a}{\partial x} \end{bmatrix}$$

---

### Mathematical Explanation & Why It Looks Like So
- **Kinematic Definition of Small Strain**:
  $$\varepsilon_{xx} = \frac{\partial u_x}{\partial x}, \quad \varepsilon_{yy} = \frac{\partial u_y}{\partial y}, \quad \gamma_{xy} = \frac{\partial u_x}{\partial y} + \frac{\partial u_y}{\partial x}$$
- Substituting displacement approximations $u_x(x,y) = \sum R_a(x,y) u_{x,a}$ and $u_y(x,y) = \sum R_a(x,y) u_{y,a}$ directly yields row 1 ($\partial_x R_a$ for $u_x$), row 2 ($\partial_y R_a$ for $u_y$), and row 3 ($\partial_y R_a$ for $u_x$, $\partial_x R_a$ for $u_y$).

---

## 3. Element Stiffness Matrix $\mathbf{K}_e$

### Formula
The element stiffness matrix $\mathbf{K}_e \in \mathbb{R}^{2N_e \times 2N_e}$ ($N_e = (p+1)(q+1)$) for active element $e$ is:

$$\mathbf{K}_e = t_h \iint_{\Omega_e} \mathbf{B}^T \mathbf{D} \mathbf{B} \, dx \, dy = t_h \int_{u_i}^{u_{i+1}} \int_{v_j}^{v_{j+1}} \mathbf{B}^T \mathbf{D} \mathbf{B} \, |\det \mathbf{J}| \, du \, dv$$

Using Gauss-Legendre quadrature mapping parametric knot span $[u_i, u_{i+1}] \times [v_j, v_{j+1}]$ to reference Gauss parent domain $[-1, 1] \times [-1, 1]$:

$$\mathbf{K}_e = t_h \sum_{g_u=1}^{N_g} \sum_{g_v=1}^{N_g} \mathbf{B}(\bar{\xi}_{g_u}, \bar{\eta}_{g_v})^T \mathbf{D} \mathbf{B}(\bar{\xi}_{g_u}, \bar{\eta}_{g_v}) \, |\det \mathbf{J}| \, \frac{\Delta u_i}{2} \frac{\Delta v_j}{2} w_{g_u} w_{g_v}$$

Where:
- $t_h$ is the structural thickness.
- $\Delta u_i = u_{i+1} - u_i$ and $\Delta v_j = v_{j+1} - v_j$ are knot span lengths.
- $w_{g_u}, w_{g_v}$ are standard Gauss quadrature weights.

---

### Mathematical Explanation & Why It Looks Like So
- **Principle of Virtual Work / Strain Energy Minimization**:
  $$U_{\text{internal}} = \frac{1}{2} \int_{\Omega} \boldsymbol{\varepsilon}^T \boldsymbol{\sigma} \, d\Omega = \frac{1}{2} \mathbf{d}^T \left[ \int_{\Omega} \mathbf{B}^T \mathbf{D} \mathbf{B} \, d\Omega \right] \mathbf{d} = \frac{1}{2} \mathbf{d}^T \mathbf{K} \mathbf{d}$$
- **Role of Gauss Quadrature**: Polynomial degree of integrand $\mathbf{B}^T \mathbf{D} \mathbf{B}$ is up to $2p-2$ in $u$ and $2q-2$ in $v$. Evaluating at $N_g = p+1$ Gauss points per direction guarantees exact integration without under- or over-integration.

---

## 4. Element Mass Matrix $\mathbf{M}_e$

### Formula
The consistent element mass matrix $\mathbf{M}_e$ is:

$$\mathbf{M}_e = \rho t_h \iint_{\Omega_e} \mathbf{R}^T \mathbf{R} \, dx \, dy = \rho t_h \int_{u_i}^{u_{i+1}} \int_{v_j}^{v_{j+1}} \mathbf{R}^T \mathbf{R} \, |\det \mathbf{J}| \, du \, dv$$

Where $\mathbf{R}_a = \begin{bmatrix} R_a & 0 \\ 0 & R_a \end{bmatrix}$ is the shape function matrix and $\rho$ is material mass density ($\text{kg/m}^3$).

---

### Mathematical Explanation & Why It Looks Like So
- Derived directly from kinetic energy $T = \frac{1}{2} \int_{\Omega} \rho \|\dot{\mathbf{u}}\|^2 d\Omega = \frac{1}{2} \dot{\mathbf{d}}^T \mathbf{M} \dot{\mathbf{d}}$.
- Consistent mass matrix ensures energy conservation and accurate natural frequency spectrum calculations without non-physical mass-lumping errors.

---

## 5. Parameter-Dependent Pullback Mapping $\boldsymbol{\Psi}(\boldsymbol{\xi}; \boldsymbol{\mu})$

### The Structural Problem: Vector Space Incompatibility
When structural parameters $\boldsymbol{\mu} = (r, x_c)^T$ change (e.g., notch radius or notch position), physical domain $\Omega(\boldsymbol{\mu})$ changes. Collecting physical displacement snapshots $\mathbf{u}(\mathbf{x}; \boldsymbol{\mu})$ across different geometries results in snapshots evaluated at different spatial locations, making standard SVD/POD mathematically invalid!

### Formula (Diffeomorphic Mapping to Static Reference Domain $\hat{\Omega}$)
We introduce a smooth mapping $\boldsymbol{\Psi}: \hat{\Omega} \to \Omega(\boldsymbol{\mu})$ such that:

$$\mathbf{x}(\boldsymbol{\xi}; \boldsymbol{\mu}) = \hat{\mathbf{x}}(\boldsymbol{\xi}) + \mathbf{v}_{\text{map}}(\boldsymbol{\xi}; \boldsymbol{\mu})$$

Where:
- $\hat{\Omega}$ is a fixed reference domain ($\boldsymbol{\mu} = \boldsymbol{\mu}_0$).
- $\mathbf{v}_{\text{map}}(\boldsymbol{\xi}; \boldsymbol{\mu}) = \sum R_a(\boldsymbol{\xi}) \Delta \mathbf{P}_a(\boldsymbol{\mu})$ is the smooth control point displacement field mapping reference points $\hat{\mathbf{x}}$ to physical points $\mathbf{x}(\boldsymbol{\mu})$.

---

### Shifted Coordinate Jacobian Formula
The total mapping Jacobian $\mathbf{J}(\boldsymbol{\xi}; \boldsymbol{\mu})$ becomes:

$$\mathbf{J}(\boldsymbol{\xi}; \boldsymbol{\mu}) = \mathbf{J}_0(\boldsymbol{\xi}) + \nabla_{\boldsymbol{\xi}} \mathbf{v}_{\text{map}}(\boldsymbol{\xi}; \boldsymbol{\mu})$$

Where $\mathbf{J}_0(\boldsymbol{\xi})$ is the constant reference Jacobian.

### Key Theoretical Consequence
Because reference basis functions $\hat{R}_a(\boldsymbol{\xi})$ and reference mesh topology on $\hat{\Omega}$ are **static**:
- All snapshot vectors $\mathbf{u}(\boldsymbol{\xi}; \boldsymbol{\mu}) \in \mathcal{V}_0(\hat{\Omega})$ reside in the **SAME unified linear vector space**!
- Singular Value Decomposition (SVD) and POD subspace extraction become mathematically rigorous and exact!

---

### App & Code Alignment
In `app/shared/fom-solver.js` and `visualizer/mesh_convergence.py`:
- `fom-solver.js` uses a static reference control mesh and applies geometry updates via control point displacement offsets $\Delta \mathbf{P}(\boldsymbol{\mu})$, evaluating stiffness matrices over the static reference mesh using pulled-back Jacobians.
