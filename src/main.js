import '/src/styles/style.css';
import { initRouter } from '/src/router/index.js';
import Header from '/src/components/Header.js';
import Footer from '/src/components/Footer.js';

import { projectManager } from '/src/services/ProjectManager.js';

const app = document.querySelector('#app');

// Initial Loading State
app.innerHTML = `
  <div class="min-h-screen flex flex-col items-center justify-center font-mono text-primary bg-background">
    <div class="flex flex-col items-center gap-4 animate-pulse">
        <div class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div class="text-xs tracking-widest uppercase">INITIALIZING_CORE...</div>
    </div>
  </div>
`;

async function init() {
  // 1. Initialize logic (fetch data, auth check, etc)
  await projectManager.initialize();

  // 2. Render Layout
  app.innerHTML = `
      <div class="min-h-screen flex flex-col font-mono text-primary bg-background selection:bg-white selection:text-black">
        <div id="header-container"></div>
        <main id="content" class="flex-grow"></main>
        <div id="footer-container"></div>
      </div>
    `;

  document.querySelector('#header-container').appendChild(Header());
  document.querySelector('#footer-container').appendChild(Footer());

  // 3. Start Router
  initRouter('#content');
}

init();
