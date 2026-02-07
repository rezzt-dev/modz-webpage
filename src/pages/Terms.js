import { t, subscribe } from '../data/locales.js';

export default function Terms() {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-6 py-20 max-w-4xl';

  const render = () => {
    container.innerHTML = `
        <div class="mb-12 border-b border-white/10 pb-8">
            <h1 class="text-4xl font-bold uppercase tracking-tight text-white mb-4">${t('terms.title')}</h1>
            <p class="text-xs font-mono text-secondary uppercase tracking-widest">${t('terms.effectiveDate')}</p>
        </div>

        <div class="space-y-12 text-sm leading-relaxed text-secondary font-mono">
            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('terms.s1_title')}</h2>
                <p>
                    ${t('terms.s1_desc')}
                </p>
            </section>

            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('terms.s2_title')}</h2>
                <p>
                    ${t('terms.s2_desc')}
                    <br><br>
                    <ul class="list-disc list-inside mt-2 space-y-1 opacity-80">
                        <li>${t('terms.s2_list1')}</li>
                        <li>${t('terms.s2_list2')}</li>
                        <li>${t('terms.s2_list3')}</li>
                    </ul>
                </p>
            </section>

            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('terms.s3_title')}</h2>
                <p>
                    ${t('terms.s3_desc')}
                </p>
            </section>

            <section>
                <h2 class="text-white text-lg font-bold uppercase mb-4">${t('terms.s4_title')}</h2>
                <p>
                    ${t('terms.s4_desc')}
                </p>
            </section>
        </div>
      `;
  }

  subscribe(render);
  render();

  return container;
}
