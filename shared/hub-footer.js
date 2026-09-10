/**
 * Poligonal Hub - Componente e Include Universal de Rodapé
 * Injeta o layout semântico e as informações unificadas do C.C.C. Poligonal.
 * Deixa a estética 100% personalizável por página via variáveis CSS (--footer-accent, --theme-accent, --theme-font, etc.)
 * ou via seletores CSS (.poligonal-footer, .poligonal-footer-title, etc.) sem estilos inline rígidos.
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
            const depth = (window.location.pathname.split('/').length - 1) - (window.location.pathname.split('poligonalhub')[1]?.split('/').length || 1);
            return depth > 0 ? '../'.repeat(depth) : './';
        }
        return '/';
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

    // 3. Template HTML unificado do rodapé (sem estilos inline invasivos)
    const generateFooterMarkup = () => `
        <div class="poligonal-footer-container">
            <div class="poligonal-footer-top">
                <div class="poligonal-footer-brand-col">
                    <h3 class="poligonal-footer-title">Centro Comunitário-Criativo Poligonal</h3>
                    <p class="poligonal-footer-desc">
                        Vários ângulos, todos anti-imperialistas. <p>Desenvolvedores de audiovisual, jogos e soluções web.</p>
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

    // 4. Injeção nos elementos marcados com [data-poligonal-footer]
    const renderFooters = () => {
        const mounts = document.querySelectorAll('[data-poligonal-footer]:not([data-poligonal-rendered])');
        mounts.forEach(el => {
            el.classList.add('poligonal-footer');
            el.setAttribute('data-poligonal-rendered', 'true');
            el.innerHTML = generateFooterMarkup();
        });
    };

    // 5. Suporte a Web Component nativo (<poligonal-footer>)
    if (typeof customElements !== 'undefined' && !customElements.get('poligonal-footer')) {
        class PoligonalFooterElement extends HTMLElement {
            connectedCallback() {
                this.classList.add('poligonal-footer');
                this.setAttribute('data-poligonal-rendered', 'true');
                this.innerHTML = generateFooterMarkup();
            }
        }
        customElements.define('poligonal-footer', PoligonalFooterElement);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFooters);
    } else {
        renderFooters();
    }
})();
