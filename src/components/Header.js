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
    header.innerHTML = `
        <div class="container mx-auto px-6 h-16 flex justify-between items-center">
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
            
            <button id="lang-toggle" class="text-xs font-mono font-bold text-secondary hover:text-white transition-colors uppercase">
                [${lang.toUpperCase()}]
            </button>

            <button id="login-btn" class="text-xs border border-border px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase">
              ${t('header.login')}
            </button>
          </div>
        </div>
      `;

    header.querySelector('#lang-toggle').addEventListener('click', () => {
      setLanguage(lang === 'en' ? 'es' : 'en');
    });

    header.querySelector('#login-btn').addEventListener('click', (e) => {
      e.preventDefault();
      // If already on admin page, maybe logout? For now just open login modal logic or redirect
      // But user asked for login modal access.
      loginModal.open();
    });
  };

  subscribe(render);
  render();

  return header;
}
