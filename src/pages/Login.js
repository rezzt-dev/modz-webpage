import { AuthService } from '../services/AuthService.js';
import { t } from '../data/locales.js';

export default function Login() {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-6 h-[calc(100vh-200px)] flex items-center justify-center';

  container.innerHTML = `
    <div class="w-full max-w-md bg-black border border-white/20 p-8 shadow-2xl relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/40"></div>
        
        <h2 class="text-2xl font-bold uppercase tracking-widest text-white mb-2">Identify</h2>
        <p class="text-xs text-secondary font-mono mb-8 opacity-70">
            SECURE_TERMINAL_ACCESS // V3.1
        </p>

        <form id="login-form" class="space-y-6">
            <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-widest text-secondary">Username</label>
                <input type="text" id="username" class="w-full bg-surface/50 border border-white/10 p-3 text-xs text-white focus:border-white/50 focus:outline-none transition-colors font-mono" placeholder="ENTER_ID...">
            </div>
            
            <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-widest text-secondary">Password</label>
                <input type="password" id="password" class="w-full bg-surface/50 border border-white/10 p-3 text-xs text-white focus:border-white/50 focus:outline-none transition-colors font-mono" placeholder="••••••••">
            </div>

            <div id="error-msg" class="text-red-500 text-xs font-mono hidden">
                ACCESS_DENIED // INVALID_CREDENTIALS
            </div>

            <button type="submit" class="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors mt-4">
                Authenticate
            </button>
        </form>
    </div>
  `;

  container.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = container.querySelector('#username').value;
    const pass = container.querySelector('#password').value;
    const errorMsg = container.querySelector('#error-msg');

    if (AuthService.login(user, pass)) {
      window.location.hash = '#/admin';
    } else {
      errorMsg.classList.remove('hidden');
      // Shake effect
      container.querySelector('div').classList.add('animate-pulse');
      setTimeout(() => container.querySelector('div').classList.remove('animate-pulse'), 500);
    }
  });

  return container;
}
