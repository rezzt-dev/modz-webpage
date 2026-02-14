import initialData from '../data/projects.json';
import { AuthService } from './AuthService.js';

class ProjectManager {
  constructor() {
    this.projects = [];
    this.listeners = [];
    this.currentProject = null;
    this.apiUrl = '/api/projects.php';
    this.initialized = false;
  }

  setCurrentProject(id) {
    this.currentProject = this.getById(id);
    this._persistCurrent();
  }

  getCurrentProject() {
    if (!this.currentProject) {
      this._loadCurrent();
    }
    return this.currentProject;
  }

  _persistCurrent() {
    if (this.currentProject) {
      sessionStorage.setItem('modz_current_project_id', this.currentProject.id);
    } else {
      sessionStorage.removeItem('modz_current_project_id');
    }
  }

  _loadCurrent() {
    const id = sessionStorage.getItem('modz_current_project_id');
    if (id) {
      this.currentProject = this.getById(id);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  async initialize() {
    if (this.initialized) return true;

    // 1. Try fetching from PHP API (Production)
    try {
      const response = await fetch(this.apiUrl);
      const contentType = response.headers.get("content-type");

      if (response.ok && contentType && contentType.includes("application/json")) {
        this.projects = await response.json();
        this.initialized = true;
        this.notify();
        return true;
      }
    } catch (error) {
      // Ignore network errors in dev
    }

    // 2. Fallback to Local Data (Development / Fallback)
    console.warn('Backend API not available. Using local fallback data.');
    this.projects = [...initialData]; // Using the imported JSON
    this.initialized = true;
    this.notify();
    return true;
  }

  getAll() {
    if (AuthService.isAuthenticated()) {
      return this.projects;
    }
    return this.projects.filter(p => !p.hidden);
  }

  getById(id) {
    return this.projects.find(p => p.id === id);
  }

  async save(project) {
    if (project.id) {
      // Update
      const index = this.projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...project };
      }
    } else {
      // Create
      const maxId = this.projects.reduce((max, p) => {
        const id = parseInt(p.id);
        return !isNaN(id) && id > max ? id : max;
      }, 0);
      project.id = (maxId + 1).toString();

      this.projects.push(project);
    }

    await this._persistToServer();
    this.notify();
  }

  async delete(id) {
    this.projects = this.projects.filter(p => p.id !== id);
    await this._persistToServer();
    this.notify();
  }

  async _persistToServer() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': sessionStorage.getItem('auth_token')
        },
        body: JSON.stringify(this.projects)
      });

      if (!response.ok) {
        // If in Dev mode (fallback), direct the user
        // We detect "dev mode" roughly by checking if we failed to connect to API or got 404/etc
        if (response.status === 404 || response.status === 405 || !this.apiUrl) {
          alert('DEV MODE: Changes saved in memory. Export JSON to persist.');
        } else {
          console.error('Failed to save data to server');
          alert('ERROR: Could not save changes to server (Check console/Auth).');
        }
      }
    } catch (e) {
      // Dev mode likely
      console.warn('Network error saving data. You might be in Dev mode.', e);
      alert('DEV MODE: Changes saved in memory only. Export JSON to persist.');
    }
  }

  exportJSON() {
    return JSON.stringify(this.projects, null, 2);
  }

  async importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        this.projects = data;
        await this._persistToServer();
        this.notify();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}

export const projectManager = new ProjectManager();
