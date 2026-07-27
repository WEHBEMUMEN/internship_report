# 01. Cox-de Boor Recursion, B-Splines, and NURBS Formulas

This document details the foundational mathematical formulas for B-Splines, Non-Uniform Rational B-Splines (NURBS), derivative calculations, and parametric-to-physical domain mappings used in Isogeometric Analysis (IGA) and in the Digital Twin web application.

---

## 1. Cox-de Boor Recursion Formula (B-Spline Basis Functions)

### Formula
The $i$-th B-spline basis function of polynomial degree $p$ evaluated at parametric coordinate $u \in \mathbb{R}$ is defined recursively by the Cox-de Boor formula:

$$N_{i,0}(u) = \begin{cases} 1 & \text{if } u_i \le u < u_{i+1} \\ 0 & \text{otherwise} \end{cases}$$

$$N_{i,p}(u) = \frac{u - u_i}{u_{i+p} - u_i} N_{i,p-1}(u) + \frac{u_{i+p+1} - u}{u_{i+p+1} - u_{i+1}} N_{i+1,p-1}(u)$$

With the convention that $\frac{0}{0} = 0$.

---

### Mathematical Explanation & Why It Looks Like So
- **Recursive Structure**: Lower-degree ($p-1$) basis functions are blended linearly to form degree-$p$ basis functions. This triangular evaluation structure guarantees that $N_{i,p}(u)$ is piecewise polynomial of degree $p$.
- **Partition of Unity**: $\sum_{i=1}^n N_{i,p}(u) = 1$ for all $u$ inside the active parametric domain $[u_p, u_{n+1}]$.
- **Non-negativity**: $N_{i,p}(u) \ge 0$ everywhere, ensuring geometric convex-hull properties.
- **Local Support**: $N_{i,p}(u) > 0$ strictly within the interval $[u_i, u_{i+p+1})$. Outside this interval, it is identically zero.
- **Continuity**: Across a knot $u_k$ of multiplicity $k_m$, the basis function is $C^{p - k_m}$ continuous. For open knot vectors (where end knots repeat $p+1$ times), basis functions are interpolatory ($N = 1$) at the domain boundaries.

---

### Variable Dependencies
1. **$u$ (Parametric Coordinate)**:
   - *Why it depends on it*: $u$ specifies the location along the 1D parameter domain $[0, 1]$. Changing $u$ moves along the curve/mesh.
2. **$p$ (Polynomial Degree)**:
   - *Why it depends on it*: Determines the degree of polynomials, smoothness ($C^{p-1}$ across simple knots), and the support width (covers $p+1$ knot spans).
3. **$\Xi = \{u_0, u_1, \dots, u_{m}\}$ (Knot Vector)**:
   - *Why it depends on it*: Sets the element boundaries and local continuity. Repeating a knot reduces continuity by 1 order per repetition.
4. **$i$ (Basis Index / Control Point Index)**:
   - *Why it depends on it*: Positions the support window $[u_i, u_{i+p+1})$ along the knot vector.

---

### App & Code Alignment
In `app/shared/nurbs-core.js` and `visualizer/mesh_convergence.py`:
- `basisFuns(i, u, p, U)` implements the linear combination loop equivalent to Cox-de Boor using memory-efficient algorithm (Piegl & Tiller, Algorithm A2.2):
```js
// nurbs-core.js snippet
function basisFuns(i, u, p, U) {
  const N = new Float64Array(p + 1);
  N[0] = 1.0;
  const left = new Float64Array(p + 1);
  const right = new Float64Array(p + 1);
  for (let j = 1; j <= p; j++) {
    left[j] = u - U[i + 1 - j];
    right[j] = U[i + j] - u;
    let saved = 0.0;
    for (let r = 0; r < j; r++) {
      const temp = N[r] / (right[r + 1] + left[j - r]);
      N[r] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }
    N[j] = saved;
  }
  return N;
}
```

---

## 2. B-Spline First Derivative Formula

### Formula
The derivative of a degree-$p$ B-spline basis function $N_{i,p}(u)$ with respect to $u$ is expressed in terms of degree-$(p-1)$ basis functions:

$$N'_{i,p}(u) = \frac{p}{u_{i+p} - u_i} N_{i,p-1}(u) - \frac{p}{u_{i+p+1} - u_{i+1}} N_{i+1,p-1}(u)$$

---

### Mathematical Explanation & Why It Looks Like So
- **Degree Reduction**: Differentiating a polynomial of degree $p$ yields a polynomial of degree $p-1$. The factor $p$ comes directly from the power rule $\frac{d}{dx}(x^p) = p x^{p-1}$.
- **Difference Operator**: The negative sign on the second term reflects the finite-difference nature of B-spline derivatives, enforcing that the integral of $N'_{i,p}(u)$ over its support equals zero (since $N_{i,p}$ vanishes at boundaries).

---

### Variable Dependencies
1. **$p$ (Degree)**: Scales the derivative magnitude linearly.
2. **Knot Spans $(u_{i+p} - u_i)$**: Inverse knot span lengths act as parametric element sizes $h$. Narrow knot spans produce larger derivatives (steeper gradients).

---

### App & Code Alignment
In `app/shared/nurbs-core.js` and `visualizer/mesh_convergence.py`:
- `dersBasisFuns(i, u, p, U, nDerivs)` (Piegl & Tiller Algorithm A2.3) evaluates both $N_{i,p}(u)$ and $N'_{i,p}(u)$ in a single pass.

---

## 3. 2D Tensor-Product B-Spline Basis Functions

### Formula
For a bivariate surface defined on the parametric domain $(u, v) \in [0, 1] \times [0, 1]$, the tensor-product B-spline shape function associated with control point $(i, j)$ is:

$$N_{i,j}^{p,q}(u, v) = N_{i,p}(u) \cdot M_{j,q}(v)$$

Where $N_{i,p}(u)$ is the degree-$p$ univariate basis in $u$, and $M_{j,q}(v)$ is the degree-$q$ univariate basis in $v$.

---

### Mathematical Explanation & Why It Looks Like So
- **Separation of Variables**: The 2D domain is formed by the Cartesian product of two 1D knot vectors $\Xi$ and $H$. Taking the product $N_{i,p}(u) M_{j,q}(v)$ creates a rectangular parametric patch element $\hat{\Omega}_e = [u_i, u_{i+1}] \times [v_j, v_{j+1}]$.
- **Knot Span Connectivity**: $p+1$ basis functions in $u$ and $q+1$ basis functions in $v$ overlap on each element, giving $(p+1)(q+1)$ active shape functions per 2D element.

---

## 4. Non-Uniform Rational B-Splines (NURBS) Basis Functions

### Formula
NURBS shape functions introduce scalar weights $w_{i,j} > 0$ for each control point to exactly represent conic sections (circles, ellipses, hyperbolas):

$$R_{i,j}^{p,q}(u, v) = \frac{N_{i,p}(u) M_{j,q}(v) w_{i,j}}{W(u, v)}$$

Where $W(u, v)$ is the weight weighting function (denominator):

$$W(u, v) = \sum_{k=1}^{n_u} \sum_{l=1}^{n_v} N_{k,p}(u) M_{l,q}(v) w_{k,l}$$

---

### Mathematical Explanation & Why It Looks Like So
- **Projective Geometry**: Rational functions arise from projecting a 3D non-rational B-spline curve/surface in homogeneous coordinates $(w x, w y, w z, w)$ onto the 2D physical hyperplane $w = 1$.
- **Exact Circles & Curved Geometries**: Polynomials alone cannot represent circular arcs exactly. Rational functions (ratios of polynomials) can. For example, a quarter circle uses degree $p=2$ with control point weight $w_1 = \frac{1}{\sqrt{2}} \approx 0.7071$.
- **Property Preservations**: Like B-splines, NURBS basis functions satisfy $\sum_{i,j} R_{i,j}^{p,q}(u, v) = 1$ and $R_{i,j} \ge 0$.

---

### Variable Dependencies
1. **$w_{i,j}$ (Control Point Weight)**:
   - *Why it depends on it*: Increasing $w_{i,j}$ pulls the surface closer to control point $\vect{P}_{i,j}$. When all weights are equal ($w_{i,j} = w_0$), $W(u,v)$ cancels out and NURBS reduces back to standard B-splines.

---

## 5. Parametric-to-Physical Geometric Mapping $\vect{x}(u, v)$

### Formula
Any point $\vect{x} = (x, y)^T$ in the physical domain $\Omega$ is mapped from parametric coordinates $(u, v)$ via:

$$\vect{x}(u, v) = \sum_{i=1}^{n_u} \sum_{j=1}^{n_v} R_{i,j}^{p,q}(u, v) \mathbf{P}_{i,j}$$

Where $\mathbf{P}_{i,j} = (x_{i,j}, y_{i,j})^T$ are the coordinates of control point $(i, j)$.

---

## 6. Mapping Jacobian Matrix $\mathbf{J}$ and Determinant $J$

### Formula
The coordinate transformation Jacobian matrix $\mathbf{J}$ maps derivatives from physical coordinates $(x, y)$ to parametric coordinates $(u, v)$:

$$\mathbf{J}(u, v) = \frac{\partial (x, y)}{\partial (u, v)} = \begin{bmatrix} \dfrac{\partial x}{\partial u} & \dfrac{\partial y}{\partial u} \\[8pt] \dfrac{\partial x}{\partial v} & \dfrac{\partial y}{\partial v} \end{bmatrix}$$

Explicitly evaluated using shape function derivatives:

$$\frac{\partial x}{\partial u} = \sum_{a=1}^{(p+1)(q+1)} \frac{\partial R_a}{\partial u} x_a, \quad \frac{\partial y}{\partial u} = \sum_{a=1}^{(p+1)(q+1)} \frac{\partial R_a}{\partial u} y_a$$

$$\frac{\partial x}{\partial v} = \sum_{a=1}^{(p+1)(q+1)} \frac{\partial R_a}{\partial v} x_a, \quad \frac{\partial y}{\partial v} = \sum_{a=1}^{(p+1)(q+1)} \frac{\partial R_a}{\partial v} y_a$$

The Jacobian determinant $J$ (scale factor of area mapping) is:

$$J = \det(\mathbf{J}) = \frac{\partial x}{\partial u} \frac{\partial y}{\partial v} - \frac{\partial x}{\partial v} \frac{\partial y}{\partial u}$$

---

### Mathematical Explanation & Why It Looks Like So
- **Tangential Vectors**: Row 1 of $\mathbf{J}$ is the parametric tangent vector along the $u$-direction $(\frac{\partial x}{\partial u}, \frac{\partial y}{\partial u})$. Row 2 is the tangent vector along $v$.
- **Area Scaling ($J = \det \mathbf{J}$)**: Represents the ratio of physical area $d\Omega = dx \, dy$ to parametric area $d\hat{\Omega} = du \, dv$.
  $$dx \, dy = |\det \mathbf{J}| \, du \, dv$$
- **Invertibility Constraint**: $J > 0$ strictly throughout the domain to prevent element self-intersection or folded geometry.

---

### Inverse Jacobian Matrix $\mathbf{J}^{-1}$ and Physical Derivatives

### Formula
To compute physical gradients $\begin{bmatrix} \frac{\partial R_a}{\partial x} \\ \frac{\partial R_a}{\partial y} \end{bmatrix}$, we invert $\mathbf{J}$:

$$\begin{bmatrix} \frac{\partial R_a}{\partial x} \\[6pt] \frac{\partial R_a}{\partial y} \end{bmatrix} = \mathbf{J}^{-1} \begin{bmatrix} \frac{\partial R_a}{\partial u} \\[6pt] \frac{\partial R_a}{\partial v} \end{bmatrix}$$

Where the 2D inverse matrix is:

$$\mathbf{J}^{-1} = \frac{1}{J} \begin{bmatrix} \frac{\partial y}{\partial v} & -\frac{\partial y}{\partial u} \\[6pt] -\frac{\partial x}{\partial v} & \frac{\partial x}{\partial u} \end{bmatrix}$$

---

### App & Code Alignment
In `app/shared/nurbs-core.js` and `visualizer/mesh_convergence.py`:
```js
// Computing Jacobian and physical derivatives in iga-sim solver / nurbs-core
const dx_du = dN_du * M_val * P_x;
const dy_du = dN_du * M_val * P_y;
const dx_dv = N_val * dM_dv * P_x;
const dy_dv = N_val * dM_dv * P_y;

const detJ = dx_du * dy_dv - dx_dv * dy_du;
const invJ00 =  dy_dv / detJ;
const invJ01 = -dy_du / detJ;
const invJ10 = -dx_dv / detJ;
const invJ11 =  dx_du / detJ;

const dR_dx = invJ00 * dR_du + invJ10 * dR_dv;
const dR_dy = invJ01 * dR_du + invJ11 * dR_dv;
```
