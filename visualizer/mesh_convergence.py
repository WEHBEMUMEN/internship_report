import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

def find_span(n, p, u, U):
    if u >= U[n+1]:
        return n
    if u <= U[p]:
        return p
    low = p
    high = n + 1
    mid = (low + high) // 2
    while u < U[mid] or u >= U[mid+1]:
        if u < U[mid]:
            high = mid
        else:
            low = mid
        mid = (low + high) // 2
    return mid

def basis_funs(i, u, p, U):
    N = np.zeros(p + 1)
    N[0] = 1.0
    left = np.zeros(p + 1)
    right = np.zeros(p + 1)
    for j in range(1, p + 1):
        left[j] = u - U[i + 1 - j]
        right[j] = U[i + j] - u
        saved = 0.0
        for r in range(j):
            temp = N[r] / (right[r + 1] + left[j - r])
            N[r] = saved + right[r + 1] * temp
            saved = left[j - r] * temp
        N[j] = saved
    return N

def ders_basis_funs(i, u, p, U, n_derivs=1):
    # Returns basis values and derivatives
    ndu = np.zeros((p + 1, p + 1))
    ndu[0, 0] = 1.0
    left = np.zeros(p + 1)
    right = np.zeros(p + 1)
    for j in range(1, p + 1):
        left[j] = u - U[i + 1 - j]
        right[j] = U[i + j] - u
        saved = 0.0
        for r in range(j):
            ndu[j, r] = right[r + 1] + left[j - r]
            temp = ndu[r, j - 1] / ndu[j, r]
            ndu[r, j] = saved + right[r + 1] * temp
            saved = left[j - r] * temp
        ndu[j, j] = saved
    
    ders = np.zeros((n_derivs + 1, p + 1))
    for r in range(p + 1):
        ders[0, r] = ndu[r, p]
        
    a = np.zeros((2, p + 1))
    for r in range(p + 1):
        s1 = 0
        s2 = 1
        a[0, 0] = 1.0
        for k in range(1, n_derivs + 1):
            d = 0.0
            rk = r - k
            pk = p - k
            if r >= k:
                a[s2, 0] = a[s1, 0] / ndu[pk + 1, rk]
                d = a[s2, 0] * ndu[rk, pk]
            for j in range(1, k):
                if r - j >= k - j:
                    a[s2, j] = (a[s1, j] - a[s1, j - 1]) / ndu[pk + 1, r - j]
                    d += a[s2, j] * ndu[r - j, pk]
                else:
                    a[s2, j] = -a[s1, j - 1] / ndu[pk + 1, r - j]
                    d += a[s2, j] * ndu[r - j, pk]
            if r <= pk:
                a[s2, k] = -a[s1, k - 1] / ndu[pk + 1, r]
                d += a[s2, k] * ndu[r, pk]
            ders[k, r] = d
            j = s1
            s1 = s2
            s2 = j
            
    # Multiply by factors
    r = p
    for k in range(1, n_derivs + 1):
        for j in range(p + 1):
            ders[k, j] *= r
        r *= (p - k)
        
    return ders

def get_gauss_quadrature(n_points):
    if n_points == 2:
        return np.array([-1.0/np.sqrt(3), 1.0/np.sqrt(3)]), np.array([1.0, 1.0])
    elif n_points == 3:
        return np.array([-np.sqrt(0.6), 0.0, np.sqrt(0.6)]), np.array([5.0/9.0, 8.0/9.0, 5.0/9.0])
    elif n_points == 4:
        p1 = np.sqrt((3.0 - 2.0 * np.sqrt(1.2)) / 7.0)
        p2 = np.sqrt((3.0 + 2.0 * np.sqrt(1.2)) / 7.0)
        w1 = (18.0 + np.sqrt(30.0)) / 36.0
        w2 = (18.0 - np.sqrt(30.0)) / 36.0
        return np.array([-p2, -p1, p1, p2]), np.array([w2, w1, w1, w2])

def solve_iga_cantilever(n_el_x, n_el_y, p):
    L = 10.0
    H = 2.0
    E = 200000.0  # MPa
    nu = 0.3
    t_h = 1.0
    q = p
    
    # 1. Knot vectors
    U = [0.0]*(p+1)
    for i in range(1, n_el_x):
        U.append(i / n_el_x)
    U.extend([1.0]*(p+1))
    U = np.array(U)
    
    V = [0.0]*(q+1)
    for i in range(1, n_el_y):
        V.append(i / n_el_y)
    V.extend([1.0]*(q+1))
    V = np.array(V)
    
    n_U = n_el_x + p
    n_V = n_el_y + q
    n_dofs = n_U * n_V * 2
    
    # 2. Control Points coordinates (flat patch)
    control_points = np.zeros((n_U, n_V, 2))
    for i in range(n_U):
        # We spacing X control points uniformly in [0, L]
        # In IGA, greed spacing is typical for flat rectangles
        x = (i / (n_U - 1)) * L
        for j in range(n_V):
            y = (j / (n_V - 1) - 0.5) * H
            control_points[i, j] = [x, y]
            
    # Plane Stress constitutive matrix D
    factor = E / (1.0 - nu**2)
    D = np.array([
        [factor, factor * nu, 0.0],
        [factor * nu, factor, 0.0],
        [0.0, 0.0, factor * (1.0 - nu) / 2.0]
    ])
    
    # Gauss points
    g_points_u, g_weights_u = get_gauss_quadrature(p + 1)
    g_points_v, g_weights_v = get_gauss_quadrature(q + 1)
    
    # 3. Stiffness Matrix Assembly (using coordinate list representation for speed)
    rows = []
    cols = []
    vals = []
    
    unique_U = np.unique(U)
    unique_V = np.unique(V)
    
    for i in range(len(unique_U) - 1):
        u_min, u_max = unique_U[i], unique_U[i+1]
        if u_max - u_min < 1e-10:
            continue
        for j in range(len(unique_V) - 1):
            v_min, v_max = unique_V[j], unique_V[j+1]
            if v_max - v_min < 1e-10:
                continue
                
            # Loop over Gauss quadrature
            for gu_idx, gu in enumerate(g_points_u):
                u_val = ((u_max - u_min) * gu + (u_max + u_min)) / 2.0
                wu = g_weights_u[gu_idx] * (u_max - u_min) / 2.0
                
                for gv_idx, gv in enumerate(g_points_v):
                    v_val = ((v_max - v_min) * gv + (v_max + v_min)) / 2.0
                    wv = g_weights_v[gv_idx] * (v_max - v_min) / 2.0
                    
                    span_u = find_span(n_U - 1, p, u_val, U)
                    span_v = find_span(n_V - 1, q, v_val, V)
                    
                    ders_u = ders_basis_funs(span_u, u_val, p, U, 1)
                    ders_v = ders_basis_funs(span_v, v_val, q, V, 1)
                    
                    # Compute mapping Jacobian
                    # x_xi = sum_i sum_j dN_i/dxi * M_j * x_ij
                    dx_du, dy_du = 0.0, 0.0
                    dx_dv, dy_dv = 0.0, 0.0
                    
                    for iu in range(p + 1):
                        cp_u = span_u - p + iu
                        N_val = ders_u[0, iu]
                        dN_du = ders_u[1, iu]
                        for jv in range(q + 1):
                            cp_v = span_v - q + jv
                            M_val = ders_v[0, jv]
                            dM_dv = ders_v[1, jv]
                            
                            pt = control_points[cp_u, cp_v]
                            
                            dx_du += dN_du * M_val * pt[0]
                            dy_du += dN_du * M_val * pt[1]
                            
                            dx_dv += N_val * dM_dv * pt[0]
                            dy_dv += N_val * dM_dv * pt[1]
                            
                    # Jacobian matrix J
                    J = np.array([
                        [dx_du, dy_du],
                        [dx_dv, dy_dv]
                    ])
                    det_J = J[0, 0] * J[1, 1] - J[0, 1] * J[1, 0]
                    if abs(det_J) < 1e-12:
                        det_J = 1e-12 if det_J >= 0 else -1e-12
                        
                    J_inv = np.array([
                        [J[1, 1] / det_J, -J[0, 1] / det_J],
                        [-J[1, 0] / det_J, J[0, 0] / det_J]
                    ])
                    
                    # Assemble element stiffness contribution
                    active_dofs = []
                    B_list = []
                    for iu in range(p + 1):
                        cp_u = span_u - p + iu
                        N_val = ders_u[0, iu]
                        dN_du = ders_u[1, iu]
                        for jv in range(q + 1):
                            cp_v = span_v - q + jv
                            M_val = ders_v[0, jv]
                            dM_dv = ders_v[1, jv]
                            
                            # Physical gradients
                            dR_du = dN_du * M_val
                            dR_dv = N_val * dM_dv
                            
                            dR_dx = J_inv[0, 0] * dR_du + J_inv[1, 0] * dR_dv
                            dR_dy = J_inv[0, 1] * dR_du + J_inv[1, 1] * dR_dv
                            
                            B_cp = np.array([
                                [dR_dx, 0.0],
                                [0.0, dR_dy],
                                [dR_dy, dR_dx]
                            ])
                            B_list.append(B_cp)
                            
                            # DOF indices
                            global_cp_idx = cp_u * n_V + cp_v
                            active_dofs.append(global_cp_idx * 2)
                            active_dofs.append(global_cp_idx * 2 + 1)
                            
                    # Local matrix contribution
                    n_active = len(active_dofs)
                    Ke = np.zeros((n_active, n_active))
                    factor_quad = det_J * wu * wv * t_h
                    
                    for a in range(n_active // 2):
                        Ba = B_list[a]
                        for b in range(n_active // 2):
                            Bb = B_list[b]
                            for dof_i in range(2):
                                for dof_j in range(2):
                                    # Ba^T * D * Bb
                                    kab = 0.0
                                    for r in range(3):
                                        for c in range(3):
                                            kab += Ba[r, dof_i] * D[r, c] * Bb[c, dof_j]
                                    Ke[a * 2 + dof_i, b * 2 + dof_j] = kab * factor_quad
                                    
                    # Accumulate in coordinate lists
                    for a in range(n_active):
                        row_g = active_dofs[a]
                        for b in range(n_active):
                            col_g = active_dofs[b]
                            rows.append(row_g)
                            cols.append(col_g)
                            vals.append(Ke[a, b])
                            
    K = sp.coo_matrix((vals, (rows, cols)), shape=(n_dofs, n_dofs)).tocsr()
    
    # 4. Boundary Conditions (Clamped at x = 0)
    # The first p+1 control point columns along U are fixed
    fixed_dofs = []
    for i in range(p): # Clamping first p columns for perfect rigid fixing in quadratic splines
        for j in range(n_V):
            idx = (i * n_V + j) * 2
            fixed_dofs.extend([idx, idx + 1])
            
    # Apply penalty constraints to tie degenerate boundaries if any (none needed here for flat rectangular patch)
    
    # 5. External Load (vertical tip load of -150 N distributed on rightmost boundary)
    F = np.zeros(n_dofs)
    total_force = -150.0
    for j in range(n_V):
        idx = ((n_U - 1) * n_V + j) * 2 + 1
        F[idx] = total_force / n_V
        
    # Solve system using elimination of fixed DOFs
    free_dofs = np.setdiff1d(np.arange(n_dofs), fixed_dofs)
    
    K_free = K[free_dofs, :][:, free_dofs]
    F_free = F[free_dofs]
    
    u_free = spla.spsolve(K_free, F_free)
    
    u_full = np.zeros(n_dofs)
    u_full[free_dofs] = u_free
    
    # Extract tip displacement at the center
    tip_center_j = n_V // 2
    tip_idx = ((n_U - 1) * n_V + tip_center_j) * 2 + 1
    disp = u_full[tip_idx]
    
    return disp

if __name__ == "__main__":
    for p_val in [1, 2, 3]:
        print(f"\n==================================================")
        print(f"Mesh Convergence Study for Degree p = {p_val}")
        print(f"==================================================")
        print(f"{'Resolution':<12} | {'Elements':<8} | {'DoFs':<8} | {'Tip Displacement (mm)':<22}")
        print("-" * 60)
        
        # Limit the maximum resolution for p=3 to avoid long solve times
        resolutions = [(10, 5), (20, 10), (40, 20), (80, 40)]
        if p_val < 3:
            resolutions.append((160, 80))
            
        for nx, ny in resolutions:
            # Degrees of Freedom
            n_U = nx + p_val
            n_V = ny + p_val
            dofs = n_U * n_V * 2
            
            disp = solve_iga_cantilever(nx, ny, p_val)
            # Convert to mm
            disp_mm = abs(disp) * 1000.0
            print(f"{f'{nx}x{ny}':<12} | {nx*ny:<8} | {dofs:<8} | {disp_mm:<22.6f}")
