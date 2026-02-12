import { projectManager } from '../services/ProjectManager.js';
import { t, subscribe } from '../data/locales.js';
import { AuthService } from '../services/AuthService.js';

export default function ProjectDetail() {
  const project = projectManager.getCurrentProject();

  const container = document.createElement('div');
  container.className = 'container mx-auto px-6 pb-20';

  // Unified Error Screen:
  // 1. Project doesn't exist (e.g. refresh on /view without state)
  // 2. Project is hidden AND user is not admin
  const isHiddenAndUnauthorized = project?.hidden && !AuthService.isAuthenticated();

  if (!project || isHiddenAndUnauthorized) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-red-500 uppercase glitch-text">
          MOD NO ACCESIBLE
        </h1>
        <p class="text-secondary tracking-widest text-xs uppercase max-w-md">
          This content is currently hidden, in development, or does not exist.
        </p>
        <div class="mt-8">
            <a href="#/" class="px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-widest">
                Return Home
            </a>
        </div>
      </div>
    `;
    return container;
  }

  const render = () => {
    container.innerHTML = `
        <!-- Top Nav / Breadcrumb -->
        <div class="mb-12 flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-secondary">
          <a href="#/" class="hover:text-white flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             ${t('project.back')}
          </a>
          <span class="opacity-20">/</span>
          <span class="text-white">${project.title}</span>
        </div>
    
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row gap-8 items-start mb-16 border-b border-white/10 pb-12">
          <div class="w-48 h-48 border border-white/20 bg-white/5 flex items-center justify-center text-4xl shrink-0 overflow-hidden">
             ${(project.icon && (project.icon.includes('/') || project.icon.includes('.')))
        ? `<img src="${project.icon}" class="w-24 h-24 object-contain" alt="icon" onerror="this.outerHTML='<i class=\\'material-icons text-8xl text-white\\'>broken_image</i>'" />`
        : `<i class="material-icons text-8xl text-white">${project.icon || 'star'}</i>`}
          </div>
          
          <div class="flex-1">
            <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <h1 class="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-2">
                        ${project.title}
                    </h1>
                    <p class="text-sm font-mono text-secondary max-w-2xl leading-relaxed">
                        ${project.description}
                    </p>
                </div>
                
                <a href="${project.downloadUrl || '#'}" ${project.downloadUrl ? 'download' : ''} class="px-8 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-white/90 transition-colors flex items-center gap-3">
                    ${t('project.download')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </a>
            </div>
    
            <div class="flex gap-12 mt-8 text-[10px] uppercase tracking-widest text-secondary">
                 <div>
                    <span class="block opacity-40 mb-1">${t('project.releaseDate')}</span>
                    <span class="text-white">2024.10.12</span>
                 </div>
                  <div>
                    <span class="block opacity-40 mb-1">${t('project.version')}</span>
                    <span class="text-white">${project.version}</span>
                 </div>
                 <div>
                    <span class="block opacity-40 mb-1">${t('project.license')}</span>
                    <span class="text-white">MIT_LICENSE</span>
                 </div>
            </div>
          </div>
        </div>
    
    
        <!-- Main Grid Layout -->
        <div class="grid md:grid-cols-12 gap-12">
          
          <!-- Left Column: Manifest & Links -->
          <div class="md:col-span-4 space-y-12">
            <div class="space-y-4">
                <h3 class="text-xs uppercase tracking-widest text-secondary mb-6 border-b border-white/10 pb-2">${t('project.manifest')}</h3>
                
                <div class="grid grid-cols-2 gap-4 text-xs">
                    <span class="text-secondary">${t('project.launcher')}</span>
                    <span class="text-white font-bold">${project.launcher || 'UNIVERSAL'}</span>
                    
                    <span class="text-secondary">${t('project.environment')}</span>
                    <span class="text-white">${project.environment || 'CLIENT + SERVER'}</span>
                    
                    <span class="text-secondary">${t('project.dependency')}</span>
                    <span class="text-white underline decoration-white/30 underline-offset-4">${project.dependency || 'NONE'}</span>
                </div>
            </div>
    
            <div class="space-y-2">
                <h3 class="text-xs uppercase tracking-widest text-secondary mb-6 border-b border-white/10 pb-2">${t('project.sourceLinks')}</h3>
                
                <a href="#" class="block text-xs text-white hover:text-white/70 transition-colors underline decoration-white/30 underline-offset-4">
                    ${t('project.repo')}
                </a>
                <a href="#" class="block text-xs text-white hover:text-white/70 transition-colors underline decoration-white/30 underline-offset-4">
                    ${t('project.issues')}
                </a>
                 <a href="#" class="block text-xs text-white hover:text-white/70 transition-colors underline decoration-white/30 underline-offset-4">
                    ${t('project.techDocs')}
                </a>
            </div>
          </div>
    
          <!-- Right Column: Documentation -->
          <div class="md:col-span-8 space-y-16">
            
            <section>
                <h3 class="flex items-center gap-3 text-xs uppercase tracking-widest text-secondary mb-6">
                    <span class="w-2 h-2 bg-white/50"></span>
                    ${t('project.problem')}
                </h3>
                <div class="border-l border-white/10 pl-6 py-2">
                    <p class="text-sm leading-7 text-white/90 font-mono">
                        ${project.problem}
                    </p>
                </div>
            </section>
    
            <section>
                <h3 class="flex items-center gap-3 text-xs uppercase tracking-widest text-secondary mb-6">
                    <span class="w-2 h-2 bg-white/50"></span>
                    ${t('project.solution')}
                </h3>
                <div class="border-l border-white/10 pl-6 py-2 space-y-4">
                    <p class="text-sm leading-7 text-white/90 font-mono">
                        ${project.solution}
                    </p>
                    
                    ${project.specs ? `
                    <div class="mt-6 space-y-3">
                        <div class="flex gap-4 text-xs font-mono opacity-70">
                            <span class="text-white/40">SPECS</span>
                            <span>${project.specs}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </section>
    
          </div>
        </div>
      `;
  }

  subscribe(render);
  render();

  return container;
}
