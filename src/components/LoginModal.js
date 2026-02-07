import { AuthService } from '../services/AuthService.js';
import { t } from '../data/locales.js';

export default function LoginModal() {
  const modal = document.createElement('div');
  modal.id = 'login-modal';
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] hidden flex items-center justify-center opacity-0 transition-opacity duration-200';

  modal.innerHTML = `
    <div class="relative w-full max-w-md bg-black border border-white/20 p-8 shadow-2xl transform scale-95 transition-transform duration-200">
        <!-- Close Button -->
        <button id="close-modal" class="absolute top-4 right-4 text-secondary hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Decoration -->
        <div class="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/40"></div>
        
        <h2 class="text-2xl font-bold uppercase tracking-widest text-white mb-2">Identify</h2>
        <p class="text-xs text-secondary font-mono mb-8 opacity-70">
            SECURE_TERMINAL_ACCESS // V3.1
        </p>

        <form id="modal-login-form" class="space-y-6">
            <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-widest text-secondary">Username</label>
                <input type="text" id="modal-username" class="w-full bg-surface/50 border border-white/10 p-3 text-xs text-white focus:border-white/50 focus:outline-none transition-colors font-mono" placeholder="ENTER_ID...">
            </div>
            
            <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-widest text-secondary">Password</label>
                <input type="password" id="modal-password" class="w-full bg-surface/50 border border-white/10 p-3 text-xs text-white focus:border-white/50 focus:outline-none transition-colors font-mono" placeholder="••••••••">
            </div>

            <div id="modal-error-msg" class="text-red-500 text-xs font-mono hidden">
                ACCESS_DENIED // INVALID_CREDENTIALS
            </div>

            <button type="submit" class="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors mt-4">
                Authenticate
            </button>
        </form>
    </div>
  `;

  // Logic
  const closeBtn = modal.querySelector('#close-modal');
  const form = modal.querySelector('#modal-login-form');
  const errorMsg = modal.querySelector('#modal-error-msg');
  const content = modal.querySelector('div');

  const open = () => {
    modal.classList.remove('hidden');
    // Small timeout for transition
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      content.classList.remove('scale-95');
      content.classList.add('scale-100');
    }, 10);
  };

  const close = () => {
    modal.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      errorMsg.classList.add('hidden');
      form.reset();
    }, 200);
  };

  closeBtn.addEventListener('click', close);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = modal.querySelector('#modal-username').value;
    const pass = modal.querySelector('#modal-password').value;

    if (AuthService.login(user, pass)) {
      close();
      window.location.hash = '#/admin';
    } else {
      errorMsg.classList.remove('hidden');
      content.classList.add('animate-pulse');
      setTimeout(() => content.classList.remove('animate-pulse'), 500);
    }
  });

  // Attach methods to element for easy calling
  modal.open = open;
  modal.close = close;

  return modal;
}
