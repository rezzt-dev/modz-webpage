import { projects as initialData } from '../data/projects.js';

class ProjectManager {
  constructor() {
    this.storageKey = 'modz_projects_v1';
    this.projects = this._load();
    this._migrate();
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  async initialize() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/rezzt-dev/modz-webpage/main/database/projects.json');
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      if (Array.isArray(data)) {
        console.log('Remote data fetched successfully', data.length);
        this.projects = data;
        this._migrate(); // Ensure new data format is correct
        this._persist(); // Update local storage
        this.notify();
        return true;
      }
    } catch (error) {
      console.warn('Failed to fetch remote projects, using local backup:', error);
      // Fallback is already loaded in constructor
      return false;
    }
  }

  _migrate() {
    let changed = false;
    this.projects = this.projects.map(p => {
      let newIcon = p.icon;
      // Map legacy names to Material Icons
      if (p.icon === 'wrench') newIcon = 'build';
      if (p.icon === 'message-square') newIcon = 'chat';
      if (p.icon === 'box') newIcon = 'inventory_2';
      if (p.icon === 'skull') newIcon = 'face';

      // Fix potential broken image paths from old experiments
      // If it's a path but not a valid one (e.g. blobs that expired), revert to default
      if (p.icon && p.icon.startsWith('blob:')) {
        newIcon = 'extension';
      }

      if (newIcon !== p.icon) {
        p.icon = newIcon;
        changed = true;
      }
      return p;
    });

    if (changed) this._persist();
  }

  _load() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse projects from storage', e);
      }
    }
    // Fallback to static data if no local changes
    return [...initialData];
  }

  _persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
  }

  getAll() {
    return this.projects;
  }

  getById(id) {
    return this.projects.find(p => p.id === id);
  }

  save(project) {
    if (project.id) {
      // Update
      const index = this.projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...project };
      }
    } else {
      // Create
      project.id = Date.now().toString(); // Simple ID generation
      this.projects.push(project);
    }
    this._persist();
  }

  delete(id) {
    this.projects = this.projects.filter(p => p.id !== id);
    this._persist();
  }

  exportJSON() {
    return JSON.stringify(this.projects, null, 2);
  }

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        this.projects = data;
        this._persist();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  resetToDefault() {
    localStorage.removeItem(this.storageKey);
    this.projects = [...initialData];
  }
}

export const projectManager = new ProjectManager();
