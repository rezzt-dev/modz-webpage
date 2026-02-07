export const AuthService = {
  login(username, password) {
    const validUser = import.meta.env.VITE_ADMIN_USER;
    const validPass = import.meta.env.VITE_ADMIN_PASS;

    if (username === validUser && password === validPass) {
      sessionStorage.setItem('auth_token', 'valid_session');
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem('auth_token');
  },

  isAuthenticated() {
    return sessionStorage.getItem('auth_token') === 'valid_session';
  }
};
