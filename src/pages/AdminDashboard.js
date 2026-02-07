import { AuthService } from '../services/AuthService.js';
import { projectManager } from '../services/ProjectManager.js';

export default function AdminDashboard() {
  // Guard
  if (!AuthService.isAuthenticated()) {
    window.location.hash = '#/login';
    return document.createElement('div');
  }

  const container = document.createElement('div');
  container.className = 'container mx-auto px-6 pb-20';
  const projects = projectManager.getAll();

  container.innerHTML = `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-6">
        <div>
            <h1 class="text-3xl font-bold uppercase tracking-tight text-white mb-2">Admin Console</h1>
            <p class="text-xs text-secondary font-mono">
                MANAGE_RESOURCES // ${projects.length}_ENTRIES
            </p>
        </div>
        
        <div class="flex gap-4">
             <button id="download-json" class="px-6 py-2 border border-white/20 text-xs text-white hover:bg-white hover:text-black transition-colors uppercase tracking-wider">
                EXPORT_JSON
            </button>
             <button id="import-btn" class="px-6 py-2 border border-white/20 text-xs text-white hover:bg-white hover:text-black transition-colors uppercase tracking-wider">
                IMPORT_JSON
            </button>
            <input type="file" id="import-input" accept=".json" class="hidden">

             <a href="#/admin/create" class="px-6 py-2 bg-white text-black text-xs font-bold hover:bg-white/90 transition-colors uppercase tracking-wider flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Entry
            </a>
        </div>
    </div>

    <!-- Table / List -->
    <div class="border border-white/10 bg-surface/20">
        <div class="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-[10px] uppercase tracking-widest text-secondary font-bold">
            <div class="col-span-1">ID</div>
            <div class="col-span-5">TITLE</div>
            <div class="col-span-2">TYPE</div>
            <div class="col-span-2">VERSION</div>
            <div class="col-span-2 text-right">ACTIONS</div>
        </div>
        
        <div id="project-list">
             ${projects.length === 0 ? '<div class="p-8 text-center text-secondary text-xs">NO_DATA</div>' : ''}
             ${projects.map(p => `
                <div class="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border-b border-white/5 items-start md:items-center hover:bg-white/5 transition-colors text-xs font-mono relative group">
                    <!-- Mobile Actions Positioned Absolute Top Right -->
                    <div class="absolute top-4 right-4 md:hidden flex gap-3">
                         <a href="#/admin/edit/${p.id}" class="text-white hover:underline decoration-white/30">EDIT</a>
                         <button data-id="${p.id}" class="delete-btn text-red-500 hover:text-red-400">DEL</button>
                    </div>

                    <div class="w-full md:col-span-1 text-secondary opacity-50 text-[10px] truncate flex justify-between md:block">
                        <span class="md:hidden uppercase tracking-widest">ID:</span>
                        ${p.id}
                    </div>
                    
                    <div class="w-full md:col-span-5 text-white font-bold flex items-center gap-2 mb-2 md:mb-0">
                         ${(p.icon && (p.icon.includes('/') || p.icon.includes('.')))
      ? `<img src="${p.icon}" class="w-4 h-4 object-contain inline-block" alt="icon" onerror="this.outerHTML='<i class=\\'material-icons text-sm text-white/70\\'>broken_image</i>'" />`
      : `<i class="material-icons text-sm text-white/70 mr-1">${p.icon || 'star'}</i>`}
                        <span class="text-sm">${p.title}</span>
                    </div>
                    
                    <div class="w-full md:col-span-2 text-secondary uppercase text-[10px] flex justify-between md:block border-b border-white/5 md:border-none pb-2 md:pb-0 mb-2 md:mb-0">
                        <span class="md:hidden font-bold">TYPE:</span>
                        ${p.type}
                    </div>
                    
                    <div class="w-full md:col-span-2 text-secondary flex justify-between md:block border-b border-white/5 md:border-none pb-2 md:pb-0 mb-2 md:mb-0">
                        <span class="md:hidden font-bold text-[10px] uppercase tracking-widest">VERSION:</span>
                        ${p.version}
                    </div>
                    
                    <div class="md:col-span-2 hidden md:flex justify-end gap-3">
                        <a href="#/admin/edit/${p.id}" class="text-white hover:underline decoration-white/30">EDIT</a>
                        <button data-id="${p.id}" class="delete-btn text-red-500 hover:text-red-400">DEL</button>
                    </div>
                </div>
             `).join('')}
        </div>
    </div>
    
    <div class="mt-4 flex justify-end">
        <button id="download-template" class="text-[10px] text-secondary hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            DOWNLOAD_JSON_TEMPLATE
        </button>
    </div>
  `;

  // Actions
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      if (confirm('CONFIRM_DELETION?')) {
        projectManager.delete(e.target.dataset.id);
        // Rerender (simple way is reload hash)
        window.location.reload();
      }
    }
  });

  container.querySelector('#download-json').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(projectManager.exportJSON());
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "projects.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

  container.querySelector('#download-template').addEventListener('click', () => {
    const template = [
      {
        "id": "unique-id-here",
        "title": "Project Title",
        "type": "mod",
        "launcher": "fabric",
        "version": "1.0.0",
        "description": "Short description of the project.",
        "problem": "What problem does this solve?",
        "solution": "How does it solve it?",
        "specs": "Requirements e.g. Fabric API",
        "icon": "star",
        "dependency": "None",
        "environment": "Client + Server",
        "downloadUrl": "https://example.com/download"
      }
    ];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "template.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

  const importBtn = container.querySelector('#import-btn');
  const importInput = container.querySelector('#import-input');

  importBtn.addEventListener('click', () => importInput.click());

  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (projectManager.importJSON(content)) {
        alert('IMPORT_SUCCESS');
        window.location.reload();
      } else {
        alert('IMPORT_FAILED: INVALID_JSON');
      }
    };
    reader.readAsText(file);
  });

  return container;
}
