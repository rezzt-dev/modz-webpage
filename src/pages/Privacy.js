import { t, subscribe } from '../data/locales.js';

export default function Privacy() {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-6 py-20 max-w-4xl';

  const render = () => {
    container.innerHTML = `
        <div class="mb-12 border-b border-white/10 pb-8">
            <h1 class="text-4xl font-bold uppercase tracking-tight text-white mb-4">${t('privacy.title')}</h1>
            <p class="text-xs font-mono text-secondary uppercase tracking-widest">${t('privacy.lastUpdated')}</p>
        </div>

        <div class="space-y-12 text-sm leading-relaxed text-secondary font-mono">
            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('privacy.s1_title')}</h2>
                <p>
                    ${t('privacy.s1_desc')}
                </p>
            </section>

            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('privacy.s2_title')}</h2>
                <p>
                    ${t('privacy.s2_desc')}
                </p>
            </section>

            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('privacy.s3_title')}</h2>
                <p>
                    ${t('privacy.s3_desc')}
                </p>
            </section>

            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('privacy.s4_title')}</h2>
                <p>
                    ${t('privacy.s4_desc')}
                </p>
            </section>
        </div>
      `;
  }

  subscribe(render);
  render();

  return container;
}
