import { projectManager } from '../services/ProjectManager.js';
import { t, subscribe } from '../data/locales.js';
import ProjectCard from '../components/ProjectCard.js';

export default async function Home() {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-6 pb-20';

  // State
  let activeType = 'all';
  let activeLauncher = 'all';
  let searchQuery = '';
  let projects = [];

  const render = () => {
    // Refresh data on every render to ensure latest state
    projects = projectManager.getAll();
    container.innerHTML = '';

    // Hero / Title Section
    const hero = document.createElement('div');
    hero.className = 'mb-12 md:mb-16 border-b border-white/10 pb-8';
    hero.innerHTML = `
        <h1 class="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white uppercase break-all md:break-normal">
          modz.dev
        </h1>
        <p class="text-secondary tracking-widest text-xs uppercase max-w-2xl leading-relaxed">
           ${t('home.subtitle')}
        </p>
      `;

    // Search/Filter Bar
    const toolbar = document.createElement('div');
    toolbar.className = 'flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-12 border border-white/10 p-4 bg-surface/20 backdrop-blur-sm';

    toolbar.innerHTML = `
        <div class="flex-1 w-full lg:w-auto relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input type="text" id="search-input" value="${searchQuery}" placeholder="${t('home.searchPlaceholder')}" class="w-full bg-transparent border-b border-white/10 text-xs py-2 pl-10 pr-4 text-white focus:outline-none focus:border-white transition-colors uppercase tracking-wider placeholder:text-secondary/50">
        </div>

        <div class="flex flex-wrap gap-6 items-center w-full lg:w-auto">
            <div class="flex flex-wrap items-center gap-4">
                <span class="text-[10px] text-secondary uppercase tracking-widest hidden sm:inline-block">${t('home.filters')}</span>
                
                <div class="flex flex-wrap gap-2" id="type-filters">
                   <!-- Populated via JS helper -->
                </div>
                
                 <div class="h-4 w-px bg-white/10 mx-2 hidden sm:block"></div>

                 <div class="flex flex-wrap gap-2" id="launcher-filters">
                   <!-- Populated via JS helper -->
                </div>
            </div>
        </div>
      `;

    // Grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-px md:bg-white/10 md:border border-white/10';

    // Helper to render filter buttons
    const createFilterButton = (text, value, group, isActive) => {
      const btn = document.createElement('button');
      btn.dataset.value = value;
      btn.dataset.group = group;
      btn.className = `text-[10px] uppercase tracking-wider border px-3 py-1 transition-all ${isActive
        ? 'border-white text-background bg-white font-bold'
        : 'border-white/20 text-secondary hover:text-white hover:border-white/50 bg-black'
        }`;
      btn.textContent = text;
      return btn;
    };

    // Filters Populator
    const typeContainer = toolbar.querySelector('#type-filters');
    const launcherContainer = toolbar.querySelector('#launcher-filters');

    const types = [
      { label: t('home.all'), value: 'all' },
      { label: t('home.mods'), value: 'mod' },
      { label: t('home.plugins'), value: 'plugin' },
      { label: t('home.datapacks'), value: 'datapack' }
    ];
    types.forEach(item => typeContainer.appendChild(createFilterButton(item.label, item.value, 'type', activeType === item.value)));

    const launchers = [
      { label: t('home.all'), value: 'all' },
      { label: 'FORGE', value: 'forge' },
      { label: 'FABRIC', value: 'fabric' },
      { label: 'NEO', value: 'neoforge' }
    ];
    launchers.forEach(item => launcherContainer.appendChild(createFilterButton(item.label, item.value, 'launcher', activeLauncher === item.value)));

    // Logic: Filter Projects
    const filtered = projects.filter(p => {
      const typeMatch = activeType === 'all' || p.type === activeType;
      const launcherMatch = activeLauncher === 'all' || p.launcher === activeLauncher || (!p.launcher && activeLauncher === 'all');

      // Search Logic
      const query = searchQuery.toLowerCase();
      const searchMatch = !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.launcher && p.launcher.toLowerCase().includes(query));

      return typeMatch && launcherMatch && searchMatch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="col-span-full py-32 text-center text-secondary uppercase tracking-widest text-xs border border-transparent bg-black">${t('home.noResults')}</div>`;
    } else {
      filtered.forEach(project => {
        grid.appendChild(ProjectCard(project));
      });
    }

    // Event Listeners
    const searchInput = toolbar.querySelector('#search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
      // Re-focus after render (simple approach)
      setTimeout(() => {
        const newInput = document.getElementById('search-input');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(newInput.value.length, newInput.value.length);
        }
      }, 0);
    });

    toolbar.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const val = e.target.dataset.value;
        const group = e.target.dataset.group;

        if (group === 'type') activeType = val;
        if (group === 'launcher') activeLauncher = val;

        render();
      }
    });

    container.appendChild(hero);
    container.appendChild(toolbar);
    container.appendChild(grid);

    // Bottom bar
    const bottomBar = document.createElement('div');
    bottomBar.className = 'mt-12 flex justify-center';
    bottomBar.innerHTML = `
        <button class="border border-white/20 px-8 py-3 text-xs uppercase tracking-widest text-secondary hover:text-white hover:border-white transition-all bg-black">
            ${t('home.loadMore')}
        </button>
      `;
    container.appendChild(bottomBar);
  }

  // Subscribe to changes
  subscribe(render); // Locales
  projectManager.subscribe(render); // Data changes
  render();

  return container;
}
