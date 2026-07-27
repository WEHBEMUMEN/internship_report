# 04. Proper Orthogonal Decomposition (POD), Galerkin ROM, and ECSW Hyper-Reduction

This document details the reduced order modeling formulas, Singular Value Decomposition (SVD) basis truncation, Galerkin subspace projection, and Energy-Conserving Sampling and Weighting (ECSW) hyper-reduction used to achieve a 39x computational speedup.

---

## 1. Snapshot Collection Matrix $\mathbf{S}$

### Formula
Full order model (FOM) displacement solutions are generated off-line across different parameter samples $\boldsymbol{\mu}_k \in \mathcal{D}$ and time instances $t_j \in [0, T]$, forming the snapshot matrix:

$$\mathbf{S} = \begin{bmatrix} \mathbf{u}(\boldsymbol{\mu}_1, t_1) & \mathbf{u}(\boldsymbol{\mu}_1, t_2) & \dots & \mathbf{u}(\boldsymbol{\mu}_{n_p}, t_{n_t}) \end{bmatrix} \in \mathbb{R}^{N \times n_s}$$

Where $N$ is the number of FOM degrees of freedom, and $n_s = n_p \times n_t$ is the total number of snapshots collected in reference space $\mathcal{V}_0(\hat{\Omega})$.

---

## 2. Thin Singular Value Decomposition (SVD) & Optimal Subspace

### Formula
The SVD of the snapshot matrix $\mathbf{S}$ is:

$$\mathbf{S} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^T = \sum_{i=1}^{\min(N, n_s)} \sigma_i \mathbf{\phi}_i \mathbf{v}_i^T$$

Where:
- $\mathbf{U} = [\mathbf{\phi}_1, \mathbf{\phi}_2, \dots, \mathbf{\phi}_N] \in \mathbb{R}^{N \times N}$ is the orthogonal matrix of left singular vectors (POD modes).
- $\boldsymbol{\Sigma} = \text{diag}(\sigma_1, \sigma_2, \dots, \sigma_R) \in \mathbb{R}^{N \times n_s}$ contains singular values sorted in descending order: $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_R \ge 0$.
- $\mathbf{V} \in \mathbb{R}^{n_s \times n_s}$ is the orthogonal matrix of right singular vectors (temporal dynamics).

---

## 3. POD Basis Truncation & Energy Ratio $\eta(r)$

### Formula
The reduced basis matrix $\boldsymbol{\Phi} \in \mathbb{R}^{N \times r}$ ($r \ll N$) is formed by selecting the first $r$ columns of $\mathbf{U}$:

$$\boldsymbol{\Phi} = \begin{bmatrix} \mathbf{\phi}_1 & \mathbf{\phi}_2 & \dots & \mathbf{\phi}_r \end{bmatrix}$$

The optimal truncation dimension $r$ is chosen based on the cumulative singular value energy threshold $\eta(r)$:

$$\eta(r) = \frac{\sum_{i=1}^r \sigma_i^2}{\sum_{j=1}^{n_s} \sigma_j^2} \ge 1 - \varepsilon_{\text{POD}}$$

Where typical truncation tolerance is set to $\varepsilon_{\text{POD}} = 10^{-4}$ (or $99.99\%$ energy capture).

---

### Mathematical Explanation & Why It Looks Like So
- **Eckart-Young-Mirsky Theorem**: The rank-$r$ SVD approximation $\mathbf{S}_r = \boldsymbol{\Phi} \boldsymbol{\Sigma}_r \mathbf{V}_r^T$ minimizes the Frobenius norm reconstruction error $\|\mathbf{S} - \tilde{\mathbf{S}}\|_F$ over all possible rank-$r$ matrices.
- **Physical Interpretation**: $\sigma_i^2$ represents the kinetic/strain energy captured by mode $i$. Rapid exponential decay of singular values indicates that high-dimensional dynamics collapse onto a low-dimensional manifold.

---

## 4. Galerkin Subspace Projection (POD-ROM System)

### Formula
Subspace projection approximates full displacement $\mathbf{u}(t) \in \mathbb{R}^N$ by a linear combination of POD basis vectors:

$$\mathbf{u}(t) \approx \boldsymbol{\Phi} \mathbf{q}(t)$$

Where $\mathbf{q}(t) = [q_1(t), q_2(t), \dots, q_r(t)]^T \in \mathbb{R}^r$ is the vector of reduced generalized coordinates.

Inserting this approximation into the semi-discrete equations of motion and pre-multiplying by $\boldsymbol{\Phi}^T$ (Galerkin orthogonality condition: $\mathbf{r}(t) \perp \text{range}(\boldsymbol{\Phi})$) yields the Reduced Order Model (ROM):

$$\mathbf{M}_r \ddot{\mathbf{q}}(t) + \mathbf{C}_r \dot{\mathbf{q}}(t) + \mathbf{K}_r(\boldsymbol{\mu}) \mathbf{q}(t) = \mathbf{F}_r(t)$$

Where the reduced operators are:

$$\mathbf{M}_r = \boldsymbol{\Phi}^T \mathbf{M} \boldsymbol{\Phi} \in \mathbb{R}^{r \times r}$$

$$\mathbf{C}_r = \boldsymbol{\Phi}^T \mathbf{C} \boldsymbol{\Phi} \in \mathbb{R}^{r \times r}$$

$$\mathbf{K}_r(\boldsymbol{\mu}) = \boldsymbol{\Phi}^T \mathbf{K}(\boldsymbol{\mu}) \boldsymbol{\Phi} \in \mathbb{R}^{r \times r}$$

$$\mathbf{F}_r(t) = \boldsymbol{\Phi}^T \mathbf{F}(t) \in \mathbb{R}^r$$

---

### Mathematical Explanation & Why It Looks Like So
- **Dimensionality Reduction**: Shrinks the dynamic system size from $N \approx 500 - 10000$ down to $r \approx 5 - 20$, turning an expensive $O(N^3)$ matrix solve into an instant $O(r^3)$ solve.
- **The Parameter Bottleneck**: While $\mathbf{M}_r$ and $\mathbf{C}_r$ can be pre-computed offline if constant, $\mathbf{K}_r(\boldsymbol{\mu}) = \boldsymbol{\Phi}^T \mathbf{K}(\boldsymbol{\mu}) \boldsymbol{\Phi}$ depends on geometry parameters $\boldsymbol{\mu}$. Computing $\mathbf{K}(\boldsymbol{\mu})$ full assembly still costs $O(N)$ operations ($35.10\text{ ms}$)! This bottleneck requires **hyper-reduction**.

---

## 5. Energy-Conserving Sampling and Weighting (ECSW) Hyper-Reduction

### Formula
Instead of assembling element stiffness matrices over all $E$ elements in the full mesh, ECSW approximates the reduced stiffness matrix $\mathbf{K}_r(\boldsymbol{\mu})$ by a weighted sum over a small subset of active elements $\Omega_{\text{ECSW}} \subset \hat{\Omega}$:

$$\mathbf{K}_{r,\text{ECSW}}(\boldsymbol{\mu}) = \sum_{e \in \Omega_{\text{ECSW}}} w_e \, \boldsymbol{\Phi}_e^T \mathbf{K}_e(\boldsymbol{\mu}) \boldsymbol{\Phi}_e$$

Where:
- $\mathbf{K}_e(\boldsymbol{\mu})$ is the $2N_e \times 2N_e$ element stiffness matrix.
- $\boldsymbol{\Phi}_e \in \mathbb{R}^{2N_e \times r}$ is the sub-matrix of POD modes corresponding to element $e$'s degrees of freedom.
- $w_e > 0$ are positive element weights determined during offline training.
- $E_{\text{ECSW}} = |\Omega_{\text{ECSW}}| \ll E$ is the sparse number of active sub-mesh elements (typically $< 10\%$ of full mesh).

---

### Sparse Weights Optimization via Non-Negative Least Squares (NNLS)

To find optimal weights $\mathbf{w} = [w_1, w_2, \dots, w_E]^T$, ECSW minimizes the error in internal virtual work force vectors across all training snapshots $k \in \{1, \dots, n_s\}$:

$$\min_{\mathbf{w} \ge 0} \left\| \mathbf{G} \mathbf{w} - \mathbf{b} \right\|_2^2 \quad \text{subject to } \|\mathbf{w}\|_0 \le E_{\text{ECSW}}$$

Where:
- Column $e$ of training matrix $\mathbf{G}$ contains vectorized reduced force contributions for element $e$:
  $$\mathbf{G}_{:, e} = \begin{bmatrix} \text{vech}(\boldsymbol{\Phi}_e^T \mathbf{K}_{e, 1} \boldsymbol{\Phi}_e) \\ \text{vech}(\boldsymbol{\Phi}_e^T \mathbf{K}_{e, 2} \boldsymbol{\Phi}_e) \\ \vdots \end{bmatrix}$$
- Vector $\mathbf{b}$ contains the exact full-mesh reduced forces:
  $$\mathbf{b} = \begin{bmatrix} \text{vech}(\mathbf{K}_{r, 1}) \\ \text{vech}(\mathbf{K}_{r, 2}) \\ \vdots \end{bmatrix}$$

---

### Mathematical & Physical Advantages of ECSW
1. **Structure & Energy Conservation**: Because weights $w_e > 0$ are strictly non-negative, $\mathbf{K}_{r,\text{ECSW}}$ is guaranteed to be **symmetric positive-definite (SPD)**! Unlike DEIM or Petrov-Galerkin schemes, ECSW preserves exact stability, physical energy conservation, and natural frequency spectra.
2. **Speedup**: Reduces online matrix assembly time from **$35.10\text{ ms}$** down to **$0.90\text{ ms}$** (**$39\times$ speedup**), meeting the real-time Digital Twin budget ($20\text{ FPS}$).

---

### App & Code Alignment
In `visualizer/get_pod_singular_values.py` and `visualizer/mesh_convergence.py`:
- SVD basis calculation and cumulative variance calculation:
```python
# get_pod_singular_values.py snippet
total_var = sum(si * si for si in s)
cum_var = 0.0
for i, si in enumerate(s):
    cum_var += si * si
    eta = cum_var / total_var
```
- ECSW weight solver using `scipy.optimize.nnls`:
```python
# NNLS optimization for ECSW weights
w, residual = scipy.optimize.nnls(G, b)
active_elements = np.where(w > 1e-6)[0]
```
