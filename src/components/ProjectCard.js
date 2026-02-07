export default function ProjectCard(project) {
  const card = document.createElement('a');
  card.href = `#/mod/${project.id}`;
  card.className = 'block border border-border bg-surface/50 hover:bg-surface hover:border-white/30 transition-all duration-300 group relative overflow-hidden';

  // Icon logic
  const iconMap = {
    'wrench': '🔧',
    'message-square': '💬',
    'skull': '💀'
  };

  card.innerHTML = `
    <div class="flex h-full">
        <!-- Icon Section -->
        <div class="w-16 md:w-20 border-r border-border flex items-center justify-center bg-black/20 group-hover:bg-white/5 transition-colors">
            <div class="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all flex items-center justify-center">
                ${(project.icon && (project.icon.includes('/') || project.icon.includes('.')))
      ? `<img src="${project.icon}" class="w-16 h-16 object-contain inverted-icon" alt="icon" onerror="this.outerHTML='<i class=\\'material-icons text-6xl text-white\\'>broken_image</i>'" />`
      : `<i class="material-icons text-6xl text-white">${project.icon || 'star'}</i>`}
            </div>
        </div>

        <!-- Content Section -->
        <div class="flex-1 p-4 flex flex-col justify-between relative">
             <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
             </div>

             <div>
                <h3 class="font-bold tracking-tight text-white mb-1 group-hover:text-white transition-colors">
                  ${project.title}
                </h3>
                <div class="flex gap-2 mb-3">
                   <span class="text-[10px] uppercase tracking-wider text-secondary">
                        #${project.type}
                   </span>
                   ${project.launcher ? `
                   <span class="text-[10px] uppercase tracking-wider text-secondary">
                        #${project.launcher}
                   </span>
                   ` : ''}
                </div>
             </div>

             <div class="text-xs text-secondary line-clamp-2 leading-relaxed mb-2">
                ${project.description}
             </div>
        </div>
    </div>
  `;

  return card;
}
