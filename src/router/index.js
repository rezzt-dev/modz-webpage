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
  '/view': ProjectDetail,
  '/admin': AdminDashboard,
  '/admin/create': AdminEditor,
  '/privacy': Privacy,
  '/terms': Terms
};

export function initRouter(containerId) {
  const container = document.querySelector(containerId);

  async function handleRoute() {
    try {
      const hash = window.location.hash || '#/';
      const path = hash.slice(1);
      console.log('Navigating to:', path);

      // Auth Guard
      if (path.startsWith('/admin') && !AuthService.isAuthenticated()) {
        console.log('Redirecting to login');
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
        console.log('Editing project ID:', id);
        component = AdminEditor;
        params = { id };
      } else {
        component = routes[path] || routes['/'];
      }

      if (!component) {
        console.error('No component found for path:', path);
        return;
      }

      // Clear and render
      container.innerHTML = '';
      const element = await component(params);

      if (element instanceof Node) {
        container.appendChild(element);
      } else {
        console.error('Component did not return a DOM Node:', element);
        container.innerHTML = '<div class="text-red-500">Render Error</div>';
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Router Error:', error);
      container.innerHTML = `<div class="text-red-500 p-4">Application Error: ${error.message}</div>`;
    }
  }

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);

  // Initialize immediately since window.load might have already happened
  handleRoute();
}
