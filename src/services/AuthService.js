export const AuthService = {
  login(username, password) {
    const validUser = import.meta.env.VITE_ADMIN_USER;
    const validPass = import.meta.env.VITE_ADMIN_PASS;

    if (username === validUser && password === validPass) {
      // Store the actual password to send it as an authentication token
      // In a full implementation, this should be a session token returned by the server
      sessionStorage.setItem('auth_token', password);
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem('auth_token');
  },

  isAuthenticated() {
    const token = sessionStorage.getItem('auth_token');
    return token && token.length > 0;
  }
};
