/**
 * Poligonal Hub - Global Hub Bar Component
 * Injeta uma barra superior universal, responsiva e elegante com navegação para todos os projetos.
 */
(function() {
    // Configuração dos projetos Poligonal
    const PROJECTS = [
        { name: "Ocupar e Resistir", url: "/ocupareresistir/", category: "Jogo / GDD", icon: "🌱", tag: "Destaque" },
        { name: "Carcarah!", url: "/carcarah/", category: "Jogo / GDD", icon: "🦅", tag: "UE5" },
        { name: "PARANOIDE", url: "/paranoide/", category: "Jogo / GDD", icon: "🤖", tag: "Cyber" },
        { name: "OUSH Nordeste 2076", url: "/oush/", category: "Jogo / GDD", icon: "⚡", tag: "GDD" },
        { name: "Profanadores", url: "/profanadores/", category: "Jogo / GDD", icon: "⚔️", tag: "GDD" },
        { name: "MABeTe", url: "/mabetedoc/", category: "Documentação", icon: "📜", tag: "Docs" },
        { name: "Unrealingo", url: "/unrealingo/", category: "Educacional", icon: "🎓", tag: "App" },
        { name: "Blueprint Editor", url: "/bp/", category: "Ferramenta", icon: "🔷", tag: "Tool" },
        { name: "Unreal FIKDIKs", url: "/bpfikdik.html", category: "Dicas Dev", icon: "💡", tag: "Guia" },
        { name: "Mail Editor", url: "/maileditor.html", category: "Ferramenta", icon: "✉️", tag: "Interno" },
        { name: "Newsletter Fluxo", url: "/fluxo/", category: "Conteúdo", icon: "✍️", tag: "Substack" },
        { name: "Comunidade UE JP", url: "/unrealjp/", category: "Comunidade", icon: "🎮", tag: "Epic" }
    ];

    // Detectar projeto atual a partir do pathname
    const currentPath = window.location.pathname.toLowerCase();
    let currentProject = PROJECTS.find(p => currentPath.includes(p.url.replace(/\//g, '')));
    
    // Obter caminho relativo base para a raiz caso esteja rodando via file:// ou subpastas
    const getRootPath = () => {
        if (window.location.protocol === 'file:') {
            const depth = (window.location.pathname.split('/').length - 1) - (window.location.pathname.split('poligonalhub')[1]?.split('/').length || 1);
            return depth > 0 ? '../'.repeat(depth) : './';
        }
        return '/';
    };

    const rootPath = getRootPath();

    // Estilos isolados para a Hub Bar
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        #poligonal-hub-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 48px;
            background: rgba(10, 10, 14, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.25rem;
            box-sizing: border-box;
            z-index: 99999;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            color: #e2e8f0;
            transition: transform 0.3s ease;
        }

        #poligonal-hub-bar a {
            text-decoration: none;
            color: inherit;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s ease;
        }

        #poligonal-hub-bar a:hover {
            color: #ffffff;
        }

        .hub-bar-brand {
            font-weight: 800;
            letter-spacing: 0.04em;
            color: #ffffff !important;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .hub-bar-brand-badge {
            background: linear-gradient(135deg, #FF6127, #C7009C);
            color: #fff;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }

        .hub-bar-breadcrumb {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .hub-bar-divider {
            color: rgba(255, 255, 255, 0.25);
            font-size: 12px;
        }

        .hub-bar-current-name {
            font-weight: 600;
            color: #cbd5e1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 220px;
        }

        .hub-bar-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .hub-bar-dropdown-trigger {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #e2e8f0;
            padding: 5px 12px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .hub-bar-dropdown-trigger:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.25);
            color: #ffffff;
        }

        .hub-bar-dropdown-menu {
            position: absolute;
            top: 54px;
            right: 1.25rem;
            width: 320px;
            max-height: 440px;
            overflow-y: auto;
            background: #0f1015;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
            padding: 8px;
            display: none;
            flex-direction: column;
            gap: 4px;
            z-index: 100000;
        }

        .hub-bar-dropdown-menu.is-open {
            display: flex;
            animation: hubBarFadeIn 0.2s ease-out;
        }

        @keyframes hubBarFadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hub-bar-project-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            border-radius: 6px;
            color: #94a3b8 !important;
            transition: background 0.15s ease, color 0.15s ease;
        }

        .hub-bar-project-item:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #ffffff !important;
        }

        .hub-bar-project-item.is-active {
            background: rgba(255, 97, 39, 0.15);
            color: #FF8F6B !important;
            border: 1px solid rgba(255, 97, 39, 0.3);
        }

        .hub-bar-tag {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.06);
            color: #94a3b8;
        }

        .hub-bar-home-btn {
            color: #94a3b8;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .hub-bar-home-btn:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.05);
        }

        /* Ajuste do topo do body para não sobrepor */
        body.has-hub-bar {
            padding-top: 48px !important;
        }

        @media (max-width: 640px) {
            .hub-bar-breadcrumb .hub-bar-divider,
            .hub-bar-current-name {
                display: none;
            }
            .hub-bar-dropdown-menu {
                width: calc(100vw - 2.5rem);
                right: 1.25rem;
            }
        }
    `;

    document.head.appendChild(styleEl);

    // Criação do elemento da barra
    const barEl = document.createElement('header');
    barEl.id = 'poligonal-hub-bar';

    // Determinar o nome do projeto passado ou autodetectado
    const customProjectName = document.querySelector('meta[name="poligonal-project-name"]')?.getAttribute('content');
    const projectName = customProjectName || (currentProject ? currentProject.name : 'Projeto');

    barEl.innerHTML = `
        <div class="hub-bar-breadcrumb">
            <a href="${rootPath}" class="hub-bar-brand" title="Ir para a página principal do Poligonal Hub">
                <span class="hub-bar-brand-badge">POLIGONAL</span>
                <span>HUB</span>
            </a>
            <span class="hub-bar-divider">/</span>
            <span class="hub-bar-current-name">${projectName}</span>
        </div>

        <div class="hub-bar-actions">
            <a href="${rootPath}" class="hub-bar-home-btn">← Início</a>
            
            <button class="hub-bar-dropdown-trigger" id="hub-bar-projects-toggle" aria-expanded="false" aria-label="Ver todos os projetos da Poligonal">
                <span>📁 Todos os Projetos</span>
                <span style="font-size: 10px;">▼</span>
            </button>

            <div class="hub-bar-dropdown-menu" id="hub-bar-projects-menu">
                <div style="padding: 4px 8px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 4px;">
                    Catálogo de Projetos & Ferramentas
                </div>
                ${PROJECTS.map(p => {
                    const isActive = currentProject && currentProject.url === p.url;
                    const projectUrl = window.location.protocol === 'file:' ? `${rootPath}${p.url.replace(/^\//, '')}` : p.url;
                    return `
                        <a href="${projectUrl}" class="hub-bar-project-item ${isActive ? 'is-active' : ''}">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>${p.icon}</span>
                                <div>
                                    <div style="font-weight: 600; font-size: 12px; color: inherit;">${p.name}</div>
                                    <div style="font-size: 10px; color: #64748b;">${p.category}</div>
                                </div>
                            </div>
                            <span class="hub-bar-tag">${p.tag}</span>
                        </a>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // Inserir a Hub Bar no topo do DOM assim que o body estiver pronto
    const injectBar = () => {
        document.body.prepend(barEl);
        document.body.classList.add('has-hub-bar');

        const toggleBtn = document.getElementById('hub-bar-projects-toggle');
        const menu = document.getElementById('hub-bar-projects-menu');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.toggle('is-open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!barEl.contains(e.target)) {
                menu.classList.remove('is-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectBar);
    } else {
        injectBar();
    }
})();
