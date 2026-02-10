import Home from '../pages/Home.js';
import ProjectDetail from '../pages/ProjectDetail.js';
import Login from '../pages/Login.js';
import AdminDashboard from '../pages/AdminDashboard.js';
import AdminEditor from '../pages/AdminEditor.js';
import Privacy from '../pages/Privacy.js';
import Terms from '../pages/Terms.js';
import { AuthService } from '../services/AuthService.js';

const routes = {
  '/': Home,
  '/login': Login,
  '/admin': AdminDashboard,
  '/admin/create': AdminEditor,
  '/privacy': Privacy,
  '/terms': Terms
};

export function initRouter(containerId) {
  const container = document.querySelector(containerId);

  async function handleRoute() {
    const hash = window.location.hash || '#/';
    const path = hash.slice(1);

    // Auth Guard
    if (path.startsWith('/admin') && !AuthService.isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    // Dynamic Route Matching
    let component = routes['/'];
    let params = {};

    if (path.startsWith('/mod/')) {
      const id = path.split('/')[2];
      component = ProjectDetail;
      params = { id };
    } else if (path.startsWith('/admin/edit/')) {
      const id = path.split('/').pop();
      component = AdminEditor;
      params = { id };
    } else {
      component = routes[path] || routes['/'];
    }

    // Clear and render
    container.innerHTML = '';
    const element = await component(params);
    container.appendChild(element);

    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);

  // Initialize immediately since window.load might have already happened
  handleRoute();
}
