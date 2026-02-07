import { materialIcons } from '../data/materialIcons.js';

export default function MaterialIconPicker({ onSelect, currentIcon }) {
  const container = document.createElement('div');
  container.className = 'border border-white/10 bg-black p-4 rounded-sm space-y-4';

  let activeCategory = Object.keys(materialIcons)[0];
  let currentPage = 0;
  const iconsPerPage = 20;

  const render = () => {
    container.innerHTML = '';

    // 1. Categories Nav
    const nav = document.createElement('div');
    nav.className = 'flex gap-2 overflow-x-auto pb-2 scrollbar-thin';

    Object.keys(materialIcons).forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button'; // prevent form submit
      btn.className = `text-[10px] uppercase tracking-wider px-3 py-1 border transition-colors whitespace-nowrap ${activeCategory === cat
        ? 'bg-white text-black border-white font-bold'
        : 'bg-transparent text-secondary border-white/20 hover:text-white'
        }`;
      btn.textContent = cat;
      btn.onclick = () => {
        activeCategory = cat;
        currentPage = 0;
        render();
      };
      nav.appendChild(btn);
    });
    container.appendChild(nav);

    // 2. Icon Grid
    const allIcons = materialIcons[activeCategory];
    const totalPages = Math.ceil(allIcons.length / iconsPerPage);
    const start = currentPage * iconsPerPage;
    const end = start + iconsPerPage;
    const currentIcons = allIcons.slice(start, end);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-5 md:grid-cols-8 gap-2 h-32 content-start';

    currentIcons.forEach(icon => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = icon === currentIcon;
      btn.className = `p-2 flex items-center justify-center rounded transition-all hover:bg-white/10 ${isActive ? 'bg-white/20 text-white ring-1 ring-white' : 'text-secondary'}`;
      btn.title = icon;
      btn.innerHTML = `<i class="material-icons text-xl">${icon}</i>`;

      btn.onclick = () => {
        currentIcon = icon;
        onSelect(icon);
        render();
      };
      grid.appendChild(btn);
    });
    container.appendChild(grid);

    // 3. Pagination
    if (totalPages > 1) {
      const pagination = document.createElement('div');
      pagination.className = 'flex justify-between items-center text-[10px] font-mono text-secondary pt-2 border-t border-white/10';

      const prev = document.createElement('button');
      prev.type = 'button';
      prev.textContent = '<< PREV';
      prev.disabled = currentPage === 0;
      prev.className = `hover:text-white ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : ''}`;
      prev.onclick = () => {
        if (currentPage > 0) {
          currentPage--;
          render();
        }
      };

      const next = document.createElement('button');
      next.type = 'button';
      next.textContent = 'NEXT >>';
      next.disabled = currentPage >= totalPages - 1;
      next.className = `hover:text-white ${currentPage >= totalPages - 1 ? 'opacity-30 cursor-not-allowed' : ''}`;
      next.onclick = () => {
        if (currentPage < totalPages - 1) {
          currentPage++;
          render();
        }
      };

      const info = document.createElement('span');
      info.textContent = `${currentPage + 1} / ${totalPages}`;

      pagination.appendChild(prev);
      pagination.appendChild(info);
      pagination.appendChild(next);
      container.appendChild(pagination);
    }
  };

  render();
  return container;
}
