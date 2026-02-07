import { t, subscribe } from '../data/locales.js';

export default function Footer() {
    const footer = document.createElement('footer');
    footer.className = 'border-t border-border mt-20 py-12 bg-surface/30';

    const render = () => {
        footer.innerHTML = `
        <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 text-xs text-secondary uppercase tracking-wider">
        <div>
            <div class="flex items-center gap-2 mb-4 text-primary font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            modz.dev v2.0.4
            </div>
            <p class="max-w-md leading-relaxed opacity-60">
             ${t('footer.desc')}
            </p>
            <p class="mt-8 opacity-40">
            &copy; ${new Date().getFullYear()} ${t('footer.rights')}
            </p>
        </div>
        
        <div class="flex flex-col md:items-end justify-between gap-8">
            <div class="flex gap-8">
                <a href="#" class="hover:text-primary">Github</a>
                <a href="#/terms" class="hover:text-primary">${t('footer.terms')}</a>
                <a href="#/privacy" class="hover:text-primary">${t('footer.privacy')}</a>
            </div>
            <div class="text-[10px] opacity-30">
                ${t('footer.latency')}
            </div>
        </div>
        </div>
    `;
    };

    subscribe(render);
    render();
    return footer;
}
