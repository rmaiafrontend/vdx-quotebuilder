/**
 * Auth service — POST /api/admin/auth/login
 */

import { apiClient } from '../apiClient';

export const authService = {
  async adminLogin({ email, senha }) {
    const response = await apiClient.post('/api/admin/auth/login', { email, senha }, { tokenScope: 'public' });
    if (response.token) {
      localStorage.setItem('admin_token', response.token);
    }
    return response;
  }
};
