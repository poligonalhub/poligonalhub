/**
 * Poligonal Hub - Componente e Include Universal de Rodapé
 * Carrega dinamicamente o HTML de shared/footer.html para refletir alterações em tempo real.
 * Mantém fallback embutido resiliente para execução local via file:// e conexões offline.
 */
(function() {
    const currentYear = new Date().getFullYear();

    // 1. Obter caminho relativo seguro para a raiz do repositório
    const getRootPath = () => {
        const currentScript = document.currentScript;
        if (currentScript) {
            const src = currentScript.getAttribute('src') || '';
            if (src.startsWith('../')) {
                const matches = src.match(/\.\.\//g);
                return matches ? '../'.repeat(matches.length) : './';
            }
            if (src.startsWith('shared/')) return './';
        }
        if (window.location.protocol === 'file:') {
            const pathname = window.location.pathname.replace(/\\/g, '/');
            const parts = pathname.split('poligonalhub');
            if (parts.length > 1) {
                const subPath = parts[1].replace(/^\//, '');
                const depth = subPath.split('/').length - 1;
                return depth > 0 ? '../'.repeat(depth) : './';
            }
        }
        return './';
    };

    const rootPath = getRootPath();

    // 2. Carrega automaticamente a folha de layout base se ainda não carregada
    const cssId = 'poligonal-footer-base-css';
    if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = `${rootPath}shared/footer.css`;
        document.head.appendChild(link);
    }

    // 3. Template HTML de fallback integrado (sincronizado com shared/footer.html)
    const getFallbackMarkup = () => `
        <div class="poligonal-footer-container">
            <div class="poligonal-footer-top">
                <div class="poligonal-footer-brand-col">
                    <h3 class="poligonal-footer-title">Centro Comunitário-Criativo Poligonal</h3>
                    <p class="poligonal-footer-desc">
                        Vários ângulos, todos anti-imperialistas.<br>
                        Desenvolvedores de audiovisual, jogos e soluções web.
                    </p>
                    <a href="mailto:poligonalhub@gmail.com" class="poligonal-footer-email">
                        poligonalhub@gmail.com ↗
                    </a>
                </div>

                <div class="poligonal-footer-links-group">
                    <div class="poligonal-footer-col">
                        <h4 class="poligonal-footer-heading">Navegação</h4>
                        <ul class="poligonal-footer-nav">
                            <li><a href="${rootPath}">Home</a></li>
                            <li><a href="${rootPath}#servicos">Serviços</a></li>
                            <li><a href="${rootPath}narrato/">NarrATO (Caderno de Encargos)</a></li>
                            <li><a href="https://poligonal.substack.com/" target="_blank" rel="noopener noreferrer">Substack (Fluxo) ↗</a></li>
                            <li><a href="${rootPath}contato.html">Contato &amp; Parcerias</a></li>
                        </ul>
                    </div>

                    <div class="poligonal-footer-col">
                        <h4 class="poligonal-footer-heading">Comunidade</h4>
                        <ul class="poligonal-footer-nav">
                            <li><a href="https://apoia.se/poligonal" target="_blank" rel="noopener noreferrer" class="poligonal-footer-accent">Apoia-se ↗</a></li>
                            <li><a href="https://discord.gg/kSCNNdFaQE" target="_blank" rel="noopener noreferrer">Discord ↗</a></li>
                            <li><a href="https://www.youtube.com/@poligonalhub" target="_blank" rel="noopener noreferrer">YouTube ↗</a></li>
                            <li><a href="https://www.instagram.com/poligonalhub" target="_blank" rel="noopener noreferrer">Instagram ↗</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="poligonal-footer-bottom">
                <span class="poligonal-footer-copy">
                    &copy; ${currentYear} Centro Comunitário-Criativo Poligonal. Todos os direitos reservados.
                </span>
                <span class="poligonal-footer-origin">
                    Nordestinamente orgulhosos 🌵
                </span>
            </div>
        </div>
    `;

    // Processa o HTML bruto de shared/footer.html ajustando links e tags
    const processIncludeHTML = (rawHtml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');
        const container = doc.querySelector('.poligonal-footer-container');
        if (!container) return null;

        // Ajusta links com data-root-link para o caminho relativo correto
        container.querySelectorAll('[data-root-link]').forEach(a => {
            const rel = a.getAttribute('data-root-link') || '';
            if (rel === '/' || rel === '') {
                a.setAttribute('href', rootPath);
            } else if (rel.startsWith('#')) {
                a.setAttribute('href', `${rootPath}${rel}`);
            } else {
                a.setAttribute('href', `${rootPath}${rel}`);
            }
        });

        // Atualiza o ano de copyright dinamicamente
        container.querySelectorAll('[data-poligonal-year]').forEach(span => {
            span.textContent = currentYear;
        });

        return container.outerHTML;
    };

    // Aplica o HTML nos pontos de montagem
    const applyToMounts = (contentHtml) => {
        const mounts = document.querySelectorAll('[data-poligonal-footer], poligonal-footer');
        mounts.forEach(el => {
            el.classList.add('poligonal-footer');
            el.setAttribute('data-poligonal-rendered', 'true');
            el.innerHTML = contentHtml;
        });
    };

    // 4. Renderização imediata com fallback (sem flash/layout shift)
    let hasLoadedRemote = false;
    const initialRender = () => {
        if (!hasLoadedRemote) {
            applyToMounts(getFallbackMarkup());
        }
    };

    // 5. Busca dinâmica do arquivo shared/footer.html ("o original") com cache-busting
    const fetchOriginalInclude = () => {
        const includeUrl = `${rootPath}shared/footer.html?v=${Date.now()}`;
        fetch(includeUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(html => {
                const processed = processIncludeHTML(html);
                if (processed) {
                    hasLoadedRemote = true;
                    applyToMounts(processed);
                }
            })
            .catch(() => {
                // Em caso de restrição local de fetch (ex.: protocolo file:/// no Chrome),
                // o fallback integrado síncrono permanece ativo.
            });
    };

    // 6. Suporte a Web Component nativo (<poligonal-footer>)
    if (typeof customElements !== 'undefined' && !customElements.get('poligonal-footer')) {
        class PoligonalFooterElement extends HTMLElement {
            connectedCallback() {
                this.classList.add('poligonal-footer');
                this.setAttribute('data-poligonal-rendered', 'true');
                if (!this.innerHTML.trim()) {
                    this.innerHTML = getFallbackMarkup();
                }
            }
        }
        customElements.define('poligonal-footer', PoligonalFooterElement);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initialRender();
            fetchOriginalInclude();
        });
    } else {
        initialRender();
        fetchOriginalInclude();
    }
})();
