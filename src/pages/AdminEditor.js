import MaterialIconPicker from '../components/MaterialIconPicker.js';
import { AuthService } from '../services/AuthService.js';
import { projectManager } from '../services/ProjectManager.js';

export default function AdminEditor({ id }) {
    // ... existing code ...
    if (!AuthService.isAuthenticated()) {
        window.location.hash = '#/login';
        return document.createElement('div');
    }

    const isEdit = !!id;
    const project = isEdit ? projectManager.getById(id) : {};

    if (isEdit && !project) {
        return document.createElement('div').innerHTML = "ERROR_NOT_FOUND";
    }

    const container = document.createElement('div');
    container.className = 'container mx-auto px-6 pb-20';

    container.innerHTML = `
    <div class="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
            <div class="text-xs text-secondary font-mono mb-2 uppercase tracking-widest">ROOT / ${isEdit ? 'EDIT_ENTRY' : 'NEW_ENTRY'}</div>
            <h1 class="text-4xl font-bold text-white">Create Content</h1>
        </div>
        <div>
            <a href="#/admin" class="text-xs text-secondary hover:text-white uppercase tracking-widest">Create Cancel</a>
        </div>
    </div>

    <p class="text-sm text-secondary font-mono max-w-2xl mb-12 opacity-70">
        Populate the fields below to deploy a new resource to the repository.
        Ensure all technical specifications match the target environment.
    </p>

    <form id="editor-form" class="space-y-16 max-w-4xl mx-auto">
        
        <!-- Section 01 -->
        <div class="space-y-8">
            <h3 class="text-xs font-mono text-secondary uppercase tracking-widest border-b border-white/10 pb-2 w-32">01 / IDENTITY</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="space-y-2 group">
                    <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">PROJECT TITLE</label>
                    <input name="title" type="text" value="${project.title || ''}" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors" placeholder="mod_name_v1">
                </div>
                
                 <div class="space-y-2 group">
                    <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">CATEGORY</label>
                    <select name="type" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors appearance-none">
                        <option value="mod" ${project.type === 'mod' ? 'selected' : ''}>Mod</option>
                        <option value="plugin" ${project.type === 'plugin' ? 'selected' : ''}>Plugin</option>
                        <option value="datapack" ${project.type === 'datapack' ? 'selected' : ''}>Datapack</option>
                    </select>
                </div>
            </div>

            <div class="space-y-2 group">
                 <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">SHORT DESCRIPTION</label>
                 <input name="description" type="text" value="${project.description || ''}" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors" placeholder="brief technical summary...">
            </div>
             <div class="space-y-4 group">
                 <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">ICON SELECTOR</label>
                 
                 <div id="picker-container"></div>
                 
                 <input name="icon" type="hidden" value="${project.icon || 'star'}">
                 <div class="flex items-center gap-4 mt-4 p-4 border border-white/10 bg-white/5 rounded">
                    <span class="text-[10px] text-secondary uppercase">Selected:</span>
                    <i class="material-icons text-6xl text-white" id="icon-preview">${project.icon || 'star'}</i>
                    <span class="font-mono text-xs text-secondary" id="icon-name">${project.icon || 'star'}</span>
                 </div>
            </div>
        </div>

        <!-- Section 02 -->
        <div class="space-y-8">
            <h3 class="text-xs font-mono text-secondary uppercase tracking-widest border-b border-white/10 pb-2 w-48">02 / DOCUMENTATION</h3>
            
             <div class="space-y-2 group">
                 <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">PROBLEM STATEMENT</label>
                 <textarea name="problem" rows="3" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors resize-none" placeholder="describe the deficiency this solves...">${project.problem || ''}</textarea>
            </div>
            
            <div class="space-y-2 group">
                 <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">PROPOSED SOLUTION</label>
                 <textarea name="solution" rows="3" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors resize-none" placeholder="explain the implementation logic...">${project.solution || ''}</textarea>
            </div>
        </div>

        <!-- Section 03 -->
        <div class="space-y-8">
            <h3 class="text-xs font-mono text-secondary uppercase tracking-widest border-b border-white/10 pb-2 w-40">03 / PARAMETERS</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div class="space-y-2 group">
                    <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">LAUNCHER TYPE</label>
                    <select name="launcher" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors appearance-none">
                        <option value="forge" ${project.launcher === 'forge' ? 'selected' : ''}>Forge</option>
                        <option value="fabric" ${project.launcher === 'fabric' ? 'selected' : ''}>Fabric</option>
                        <option value="neoforge" ${project.launcher === 'neoforge' ? 'selected' : ''}>NeoForge</option>
                         <option value="" ${!project.launcher ? 'selected' : ''}>Universal</option>
                    </select>
                </div>

                <div class="space-y-2 group">
                    <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">VERSION</label>
                    <input name="version" type="text" value="${project.version || ''}" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors" placeholder="1.20.x">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                <div class="space-y-2 group">
                     <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">ENVIRONMENT</label>
                     <select name="environment" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors appearance-none">
                        <option value="Client + Server" ${project.environment === 'Client + Server' ? 'selected' : ''}>Client + Server</option>
                        <option value="Client Side" ${project.environment === 'Client Side' ? 'selected' : ''}>Client Side</option>
                        <option value="Server Side" ${project.environment === 'Server Side' ? 'selected' : ''}>Server Side</option>
                     </select>
                </div>

                <div class="space-y-2 group">
                     <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">DEPENDENCY</label>
                     <input name="dependency" type="text" value="${project.dependency || ''}" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors" placeholder="e.g. Fabric API">
                </div>
            </div>
            
            <div class="space-y-2 group mt-8">
                 <label class="block text-[10px] uppercase tracking-widest text-secondary group-focus-within:text-white transition-colors">FILE PATH / DOWNLOAD URL</label>
                 <input name="downloadUrl" type="text" value="${project.downloadUrl || ''}" class="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono focus:outline-none focus:border-white transition-colors" placeholder="/downloads/mod-file.jar">
                 <p class="text-[10px] text-secondary/50 pt-1">Relative path to public folder (e.g. /my-mod.jar) or external link. Supports .jar, .zip</p>
            </div>
        </div>

        <div class="pt-12 border-t border-white/10 flex justify-end gap-6">
            <a href="#/admin" class="px-8 py-3 text-secondary hover:text-white text-xs uppercase tracking-widest transition-colors">Cancel</a>
            <button type="submit" class="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-colors">
                ${isEdit ? 'UPDATE_RESOURCE' : 'DEPLOY_RESOURCE'}
            </button>
        </div>
    </form>
  `;

    // Init Icon Picker
    const pickerContainer = container.querySelector('#picker-container');
    const iconInput = container.querySelector('input[name="icon"]');
    const iconPreview = container.querySelector('#icon-preview');
    const iconName = container.querySelector('#icon-name');

    const handleIconSelect = (icon) => {
        iconInput.value = icon;
        iconPreview.textContent = icon;
        iconName.textContent = icon;
    };

    if (pickerContainer) {
        pickerContainer.appendChild(MaterialIconPicker({
            onSelect: handleIconSelect,
            currentIcon: project.icon || 'star'
        }));
    }

    container.querySelector('#editor-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (isEdit) data.id = project.id;

        projectManager.save(data);
        window.location.hash = '#/admin';
    });

    return container;
}
