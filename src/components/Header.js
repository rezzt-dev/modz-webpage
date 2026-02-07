import { t, setLanguage, getCurrentLang, subscribe } from '../data/locales.js';
import LoginModal from './LoginModal.js';

export default function Header() {
  const header = document.createElement('header');
  header.className = 'border-b border-border mb-12 sticky top-0 bg-background/95 backdrop-blur z-50';

  // Instantiate Modal once
  const loginModal = LoginModal();
  document.body.appendChild(loginModal); // Append to body to overlay everything

  const render = () => {
    const lang = getCurrentLang();
    const isMobileMenuOpen = header.classList.contains('mobile-menu-open');

    header.innerHTML = `
        <div class="container mx-auto px-6 h-16 flex justify-between items-center relative z-50 bg-background/95 backdrop-blur">
          <div class="flex items-center gap-8">
            <a href="#/" class="text-sm font-bold tracking-widest hover:text-white transition-colors flex items-center gap-3">
              <div class="w-3 h-3 bg-white"></div>
              modz.dev
            </a>
            
            <nav class="hidden md:flex gap-6 text-xs tracking-wider text-secondary">
              <a href="#/" class="hover:text-primary transition-colors">${t('header.browse')}</a>
              <a href="#" class="hover:text-primary transition-colors">${t('header.publishers')}</a>
              <a href="#" class="hover:text-primary transition-colors">${t('header.docs')}</a>
            </nav>
          </div>

          <div class="flex items-center gap-6">
            <div class="hidden md:block text-xs text-secondary font-mono tracking-widest">
              ${t('header.status')}
            </div>
            
            <button id="lang-toggle" class="text-xs font-mono font-bold text-secondary hover:text-white transition-colors uppercase hidden md:block">
                [${lang.toUpperCase()}]
            </button>

             <button id="login-btn" class="hidden md:block text-xs border border-border px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase">
              ${t('header.login')}
            </button>

            <!-- Mobile Menu Button -->
            <button id="mobile-menu-btn" class="md:hidden text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${isMobileMenuOpen ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' : '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>'}
                </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Overlay -->
        <div class="${isMobileMenuOpen ? 'flex' : 'hidden'} md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur z-40 flex-col p-6 gap-8 text-center animate-fade-in border-t border-white/10">
             <nav class="flex flex-col gap-6 text-sm tracking-widest text-secondary font-bold uppercase">
              <a href="#/" class="hover:text-white py-4 border-b border-white/5">${t('header.browse')}</a>
              <a href="#" class="hover:text-white py-4 border-b border-white/5">${t('header.publishers')}</a>
              <a href="#" class="hover:text-white py-4 border-b border-white/5">${t('header.docs')}</a>
            </nav>

            <div class="flex flex-col gap-6 mt-auto mb-12">
                 <button id="mobile-lang-toggle" class="text-xs font-mono font-bold text-secondary hover:text-white uppercase py-4 border border-white/10">
                    LANGUAGE: [${lang.toUpperCase()}]
                </button>
                <button id="mobile-login-btn" class="text-xs font-bold bg-white text-black py-4 uppercase hover:bg-white/90">
                    ${t('header.login')}
                </button>
                <div class="text-[10px] text-secondary font-mono tracking-widest mt-4">
                  ${t('header.status')}
                </div>
            </div>
        </div>
      `;

    header.querySelector('#lang-toggle')?.addEventListener('click', () => setLanguage(lang === 'en' ? 'es' : 'en'));
    header.querySelector('#mobile-lang-toggle')?.addEventListener('click', () => setLanguage(lang === 'en' ? 'es' : 'en'));

    header.querySelector('#login-btn')?.addEventListener('click', (e) => { e.preventDefault(); loginModal.open(); });
    header.querySelector('#mobile-login-btn')?.addEventListener('click', (e) => { e.preventDefault(); loginModal.open(); });

    header.querySelector('#mobile-menu-btn').addEventListener('click', () => {
      header.classList.toggle('mobile-menu-open');
      render(); // Re-render to update icon and visibility
    });
  };

  subscribe(render);
  render();

  return header;
}
