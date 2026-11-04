/**
 * Poligonal Hub - Componente Radar Interativo de Jogos Correlatos
 * Suporte a animação elástica de entrada, legendas interativas e
 * painel de análise comparativa ("Como se compara" e "Como se difere")
 * ao clicar no nome de qualquer jogo correlato.
 */

const POLIGONAL_DEFAULT_COMPARISONS = {
    // --- OCUPAR E RESISTIR ---
    'Orcs Must Die': {
        similar: 'Posicionamento estratégico de defesas físicas e armadilhas para conter ondas sucessivas de invasores em rotas de entrada.',
        differs: 'Substitui a fantasia medieval cômica pela luta por moradia real no Nordeste brasileiro, integrando ciclo agrícola diurno de agroecologia inexistente em OMD.'
    },
    'Stardew Valley': {
        similar: 'Ciclos diários de plantio, colheita, manejo solidário da terra e construção de laços afetivos com companheiros de causa.',
        differs: 'O cultivo não é uma fuga bucólica passiva: a produção de alimentos e ervas medicinais é o combustível direto para sustentar barricadas contra a repressão policial.'
    },
    'Atomicrops': {
        similar: 'Fusão frenética entre colheita de recursos agrícolas sob a luz do sol e defesa armada implacável à noite contra ameaças.',
        differs: 'Abordagem tática e comunitária em assentamento popular organizado, com tom político assertivo e sátira social ao invés de roguelite bullet-hell individual.'
    },
    'Tonight We Riot': {
        similar: 'Perspectiva declarada da classe trabalhadora organizada e revolta popular direta contra a opressão oligárquica.',
        differs: 'Jogabilidade de gerenciamento contínuo de espaço, agroecologia e tower defense estratégico em vez de um brawler beat\'em up linear de tela curta.'
    },
    'Punhos de Repúdio': {
        similar: 'Crítica social afiada, humor ácido e denúncia aberta do reacionarismo contemporâneo brasileiro com estética autoral.',
        differs: 'Construção perene de assentamento e ciclo completo de desenvolvimento comunitário (Paiol, Escola, Ateliê) versus pancadaria rápida de arcade.'
    },

    // --- PARANOIDE ---
    'Portal': {
        similar: 'Presença opressiva e onipresente de uma inteligência artificial sarcástica que monitora, humilha e manipula o ambiente de testes laboratoriais.',
        differs: 'Ao invés de puzzles 3D em primeira pessoa com física de portais, o foco é na velocidade frenética e precisão de rebatimento arcade em circuitos elétricos reais.'
    },
    'Arkanoid': {
        similar: 'A fundação clássica de física de rebatimento: controle de palheta, ângulo de ricochete do disco e eliminação de blocos em grade.',
        differs: 'Subverte o clássico com sabotagens ativas da IA (inversão de comandos, telas apagadas e física adulterada), transformando reflexos em duelo psicológico contínuo.'
    },

    // --- PROFANADORES ---
    'SOTN': {
        similar: 'Estrutura labiríntica não-linear de mapa, progressão por destravamento de habilidades e atmosfera gótica decadente.',
        differs: 'Substitui a iconografia transilvânica por entidades dos mangues e casarões coloniais paraibanos, com sistema cooperativo entre dois heróis complementares.'
    },
    'Symphony of the Night': {
        similar: 'Estrutura labiríntica não-linear de mapa, progressão por destravamento de habilidades e atmosfera gótica decadente.',
        differs: 'Substitui a iconografia transilvânica por entidades dos mangues e casarões coloniais paraibanos, com sistema cooperativo entre dois heróis complementares.'
    },
    'Castlevania: Symphony of the Night': {
        similar: 'Estrutura labiríntica não-linear de mapa, progressão por destravamento de habilidades e atmosfera gótica decadente.',
        differs: 'Substitui a iconografia transilvânica por entidades dos mangues e casarões coloniais paraibanos, com sistema cooperativo entre dois heróis complementares.'
    },
    'Hollow Knight': {
        similar: 'Narrativa ambiental sutil, precisão cirúrgica de combate corpo-a-corpo e sensação palpável de desolação e ruína.',
        differs: 'Estética artesanal inspirada no ciclo da cana-de-açúcar e no Nordesteampunk, com mecânicas de quebra-cabeças simbióticos em dupla.'
    },
    'Blasphemous': {
        similar: 'Religiosidade fervorosa, simbolismo de culpa, penitência e arte visual sombria de alto impacto emocional.',
        differs: 'Em vez do catolicismo barroco andaluz espanhol, explora o misticismo e as lendas do Nordeste brasileiro (visagens, engenhos amaldiçoados e mangues).'
    },
    'Dead Cells': {
        similar: 'Fluidez no combate, esquivas precisas e grande variedade de sinergias ofensivas e secundárias.',
        differs: 'Construção de mundo interconectada e progressão guiada por mapa único e narrativa histórica, ao invés de geração puramente procedural de roguelite.'
    },

    // --- CARCARAH! ---
    'Returnal': {
        similar: 'Ritmo implacável de combate em 3ª pessoa, atmosfera alucinatória e ciclos de mortes integrados ao trauma psicológico.',
        differs: 'Ambientação sertaneja pós-apocalíptica brasileira, armas artesanais forjadas em ferro bruto e combate coreografado de curta distância.'
    },
    'Hellblade': {
        similar: 'Exploração psicológica de psicose, vozes internas perturbadoras e colapso de fronteiras entre delírio e realidade.',
        differs: 'Foco em ação ágil estilo roguelike, combate dinâmico em arenas e sistemas de progressão procedural em Unreal Engine 5.'
    },
    'Hellblade: Senua\'s Sacrifice': {
        similar: 'Exploração psicológica de psicose, vozes internas perturbadoras e colapso de fronteiras entre delírio e realidade.',
        differs: 'Foco em ação ágil estilo roguelike, combate dinâmico em arenas e sistemas de progressão procedural em Unreal Engine 5.'
    },
    'Hyper Light Drifter': {
        similar: 'Contraste vibrante de cores hipnóticas em um mundo quebrado, combate milimétrico e atmosfera melancólica e misteriosa.',
        differs: 'Perspectiva de ação 3D completa com câmera sobre o ombro na UE5 e narrativa inspirada no cangaço pós-apocalíptico.'
    }
};

window.POLIGONAL_DEFAULT_COMPARISONS = POLIGONAL_DEFAULT_COMPARISONS;

window.createPoligonalRadar = function(options) {
    const {
        canvasId,
        labels = ['Combate / Ação', 'Narrativa', 'Estética / Arte', 'Inovação / Sistemas', 'Rejogabilidade'],
        datasets = [],
        gridColor = 'rgba(255, 255, 255, 0.12)',
        angleLineColor = 'rgba(255, 255, 255, 0.15)',
        pointLabelColor = '#cbd5e1',
        fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        bodyFontFamily = "var(--theme-font-body, 'Inter', system-ui, -apple-system, sans-serif)",
        pointLabelFontSize = window.innerWidth < 640 ? 11 : 12,
        legendFontSize = 12,
        legendPosition = 'bottom',
        showTicks = false,
        tickColor = 'rgba(200, 200, 200, 0.5)',
        max = 10,
        min = 0,
        stepSize = 2
    } = options;

    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn("[PoligonalRadar] Canvas com id #" + canvasId + " não encontrado.");
        return null;
    }

    if (typeof Chart === 'undefined') {
        console.error('[PoligonalRadar] Chart.js não foi carregado na página.');
        return null;
    }

    // Backup dos estilos originais e vinculação de comparações padrão (exclusivo para jogos correlatos)
    datasets.forEach((ds, idx) => {
        ds._origBorderWidth = ds.borderWidth || 3;
        ds._origBackgroundColor = ds.backgroundColor;
        ds._origBorderColor = ds.borderColor;
        ds._origPointRadius = ds.pointRadius || 4;

        if (idx > 0 && !ds.comparison && POLIGONAL_DEFAULT_COMPARISONS[ds.label]) {
            ds.comparison = POLIGONAL_DEFAULT_COMPARISONS[ds.label];
        }
    });

    const ctx = canvas.getContext('2d');

    const chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            },
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: { borderWidth: 3 },
                point: { radius: 4, hoverRadius: 8 }
            },
            scales: {
                r: {
                    angleLines: { color: angleLineColor },
                    grid: { color: gridColor },
                    pointLabels: {
                        color: pointLabelColor,
                        font: {
                            family: fontFamily,
                            size: pointLabelFontSize,
                            weight: '600'
                        }
                    },
                    ticks: {
                        display: showTicks,
                        color: tickColor,
                        backdropColor: 'transparent',
                        stepSize: stepSize,
                        max: max,
                        min: min
                    },
                    suggestedMin: min,
                    suggestedMax: max
                }
            },
            plugins: {
                legend: {
                    display: false // Oculta a legenda nativa para usar a customizada
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 14, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 6,
                    usePointStyle: true,
                    callbacks: {
                        title: function(tooltipItems) {
                            if (!tooltipItems || !tooltipItems.length) return '';
                            const item = tooltipItems[0];
                            const label = item.chart.data.labels[item.dataIndex];
                            return Array.isArray(label) ? label.join(' ') : label;
                        }
                    }
                }
            }
        }
    });

    // 1. Entrance Animation via IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chartInstance.options.animation = { duration: 1200, easing: 'easeOutQuart' };
                chartInstance.update();
                observer.unobserve(canvas);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(canvas);

    // Helper: Ajustar opacidade de uma cor (hex ou rgba)
    function setAlpha(color, alpha) {
        if (!color) return 'rgba(0,0,0,0)';
        if (color.startsWith('#')) {
            let r, g, b;
            if (color.length === 4) {
                r = parseInt(color[1] + color[1], 16);
                g = parseInt(color[2] + color[2], 16);
                b = parseInt(color[3] + color[3], 16);
            } else {
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            }
            return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
        } else if (color.startsWith('rgb')) {
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
            }
        }
        return color;
    }

    // Identifica o wrapper do canvas para garantir que a legenda e o painel de comparação
    // sejam inseridos FORA do container de altura restrita do Chart.js
    const chartWrapper = canvas.parentNode;
    const isDedicatedWrapper = chartWrapper && 
        chartWrapper !== document.body && 
        !['SECTION', 'MAIN', 'ARTICLE', 'BODY'].includes(chartWrapper.tagName.toUpperCase());

    const insertTarget = isDedicatedWrapper ? chartWrapper : canvas;

    // 2. Custom Interactive HTML Legend
    let legendContainer = document.getElementById(canvasId + '-legend');
    if (!legendContainer) {
        legendContainer = document.createElement('div');
        legendContainer.id = canvasId + '-legend';
        legendContainer.style.display = 'flex';
        legendContainer.style.flexWrap = 'wrap';
        legendContainer.style.justifyContent = 'center';
        legendContainer.style.gap = '0.75rem';
        legendContainer.style.marginTop = '1.25rem';
        legendContainer.style.fontSize = '0.75rem';
        legendContainer.style.fontWeight = '600';
        legendContainer.style.fontFamily = fontFamily;
        legendContainer.style.maxWidth = '700px';
        legendContainer.style.marginLeft = 'auto';
        legendContainer.style.marginRight = 'auto';
        legendContainer.style.width = '100%';
        legendContainer.style.boxSizing = 'border-box';
        legendContainer.style.position = 'relative';
        legendContainer.style.zIndex = '5';
        insertTarget.parentNode.insertBefore(legendContainer, insertTarget.nextSibling);
    }

    // 3. Comparison Panel
    let comparisonPanel = document.getElementById(canvasId + '-comparison');
    if (!comparisonPanel) {
        comparisonPanel = document.createElement('div');
        comparisonPanel.id = canvasId + '-comparison';
        comparisonPanel.style.marginTop = '0px';
        comparisonPanel.style.overflow = 'hidden';
        comparisonPanel.style.maxHeight = '0px';
        comparisonPanel.style.opacity = '0';
        comparisonPanel.style.transition = 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, margin-top 0.3s ease';
        comparisonPanel.style.fontFamily = bodyFontFamily;
        comparisonPanel.style.backgroundColor = 'rgba(10, 10, 14, 0.95)';
        comparisonPanel.style.borderRadius = '8px';
        comparisonPanel.style.border = '1px solid rgba(255, 255, 255, 0.12)';
        comparisonPanel.style.borderLeft = '4px solid transparent';
        comparisonPanel.style.position = 'relative';
        comparisonPanel.style.zIndex = '5';
        comparisonPanel.style.color = pointLabelColor;
        comparisonPanel.style.maxWidth = '700px';
        comparisonPanel.style.marginLeft = 'auto';
        comparisonPanel.style.marginRight = 'auto';
        comparisonPanel.style.boxSizing = 'border-box';
        comparisonPanel.style.width = '100%';
        comparisonPanel.style.backdropFilter = 'blur(12px)';
        comparisonPanel.style.webkitBackdropFilter = 'blur(12px)';
        comparisonPanel.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('aria-label', 'Fechar análise de posicionamento');
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '12px';
        closeBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        closeBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        closeBtn.style.borderRadius = '6px';
        closeBtn.style.color = pointLabelColor;
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '12px';
        closeBtn.style.lineHeight = '1';
        closeBtn.style.padding = '5px 9px';
        closeBtn.style.transition = 'all 0.2s ease';
        closeBtn.onmouseenter = () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.15)';
            closeBtn.style.color = '#ffffff';
        };
        closeBtn.onmouseleave = () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.05)';
            closeBtn.style.color = pointLabelColor;
        };
        closeBtn.onclick = resetState;
        
        const contentDiv = document.createElement('div');
        contentDiv.id = canvasId + '-comparison-content';
        contentDiv.style.padding = '1.25rem 1.5rem 1.25rem 1.25rem';
        
        comparisonPanel.appendChild(closeBtn);
        comparisonPanel.appendChild(contentDiv);
        
        legendContainer.parentNode.insertBefore(comparisonPanel, legendContainer.nextSibling);
    }

    let activeDatasetIndex = -1;

    function resetState() {
        activeDatasetIndex = -1;
        
        // Reseta o gráfico
        chartInstance.data.datasets.forEach(ds => {
            ds.borderWidth = ds._origBorderWidth;
            ds.backgroundColor = ds._origBackgroundColor;
            ds.borderColor = ds._origBorderColor;
            ds.pointRadius = ds._origPointRadius;
        });
        chartInstance.update();
        
        // Reseta o painel de comparação
        comparisonPanel.style.maxHeight = '0px';
        comparisonPanel.style.opacity = '0';
        comparisonPanel.style.marginTop = '0px';
        comparisonPanel.style.borderLeftColor = 'transparent';
        
        // Reseta a legenda
        updateLegendUI();
    }

    function updateLegendUI() {
        Array.from(legendContainer.children).forEach((pill, idx) => {
            if (activeDatasetIndex === -1) {
                pill.style.opacity = '1';
                pill.style.transform = 'scale(1)';
                pill.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                pill.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            } else {
                if (idx === activeDatasetIndex) {
                    pill.style.opacity = '1';
                    pill.style.transform = 'scale(1.05)';
                    pill.style.borderColor = datasets[idx]._origBorderColor;
                    pill.style.backgroundColor = setAlpha(datasets[idx]._origBorderColor, 0.25);
                } else {
                    pill.style.opacity = '0.35';
                    pill.style.transform = 'scale(0.95)';
                    pill.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    pill.style.backgroundColor = 'transparent';
                }
            }
        });
    }

    // Criar as pills da legenda
    chartInstance.data.datasets.forEach((ds, index) => {
        const pill = document.createElement('div');
        pill.style.display = 'inline-flex';
        pill.style.alignItems = 'center';
        pill.style.gap = '8px';
        pill.style.padding = '6px 14px';
        pill.style.borderRadius = '9999px';
        pill.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        pill.style.border = '1px solid rgba(255, 255, 255, 0.12)';
        pill.style.cursor = 'pointer';
        pill.style.color = pointLabelColor;
        pill.style.fontSize = '0.75rem';
        pill.style.fontWeight = 'bold';
        pill.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
        pill.style.userSelect = 'none';

        pill.onmouseenter = () => {
            if (activeDatasetIndex !== index) {
                pill.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }
        };
        pill.onmouseleave = () => {
            if (activeDatasetIndex !== index) {
                pill.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }
        };

        const dot = document.createElement('span');
        dot.style.display = 'inline-block';
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = ds._origBorderColor;
        dot.style.boxShadow = '0 0 8px ' + ds._origBorderColor;
        
        const text = document.createElement('span');
        text.innerText = ds.label;

        pill.title = index === 0 ? `${ds.label} (Jogo de referência)` : `Análise comparativa: ${ds.label}`;

        pill.appendChild(dot);
        pill.appendChild(text);

        pill.onclick = () => {
            if (activeDatasetIndex === index) {
                resetState();
            } else {
                activeDatasetIndex = index;
                
                // Atualiza o gráfico: destaca o clicado e ofusca os outros
                chartInstance.data.datasets.forEach((d, i) => {
                    if (i === index) {
                        d.borderWidth = (d._origBorderWidth || 3) + 2.5;
                        d.backgroundColor = setAlpha(d._origBorderColor, 0.5);
                        d.borderColor = d._origBorderColor;
                        d.pointRadius = 7;
                    } else {
                        d.borderWidth = 1;
                        d.backgroundColor = setAlpha(d._origBackgroundColor, 0.05);
                        d.borderColor = setAlpha(d._origBorderColor, 0.15);
                        d.pointRadius = 2;
                    }
                });
                chartInstance.update();
                updateLegendUI();

                // O jogo base (índice 0) é a referência e não se compara consigo mesmo.
                // O painel comparativo é exibido exclusivamente para os jogos correlatos (índice > 0).
                const isReferenceGame = index === 0 || ds.isReferenceGame === true || ds.isMain === true || ds.comparison === false;
                let comp = !isReferenceGame && (ds.comparison || POLIGONAL_DEFAULT_COMPARISONS[ds.label]);
                if (comp) {
                    comparisonPanel.style.borderLeftColor = ds._origBorderColor;
                    const contentDiv = document.getElementById(canvasId + '-comparison-content');
                    
                    let similarText = '';
                    let differsText = '';
                    if (typeof comp === 'string') {
                        similarText = comp;
                        const defaultEntry = POLIGONAL_DEFAULT_COMPARISONS[ds.label];
                        if (defaultEntry && typeof defaultEntry === 'object' && defaultEntry.differs) {
                            differsText = defaultEntry.differs;
                        }
                    } else if (typeof comp === 'object') {
                        similarText = comp.similar || '';
                        differsText = comp.differs || '';
                    }

                    contentDiv.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.85rem; padding-bottom: 0.5rem; padding-right: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${ds._origBorderColor}; box-shadow: 0 0 10px ${ds._origBorderColor};"></span>
                                <span style="font-family: ${fontFamily}; font-weight: 900; font-size: 0.95rem; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">${ds.label}</span>
                            </div>
                            <span style="font-size: 0.65rem; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Análise de Posicionamento</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem; font-size: 0.875rem; line-height: 1.6;">
                            <div style="padding: 0.85rem 1rem; border-radius: 8px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); font-family: ${bodyFontFamily};">
                                <span style="font-family: ${bodyFontFamily}; font-weight: 700; font-size: 0.8rem; color: #34d399; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem; letter-spacing: 0.02em;">⚖️ Como se Compara:</span>
                                <p style="margin: 0; color: var(--text-light, #e2e8f0); font-family: ${bodyFontFamily}; font-size: 0.875rem; line-height: 1.6; opacity: 0.85;">${similarText}</p>
                            </div>
                            ${differsText ? `
                            <div style="padding: 0.85rem 1rem; border-radius: 8px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); font-family: ${bodyFontFamily};">
                                <span style="font-family: ${bodyFontFamily}; font-weight: 700; font-size: 0.8rem; color: #fb923c; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem; letter-spacing: 0.02em;">⚡ Como se Difere:</span>
                                <p style="margin: 0; color: var(--text-light, #e2e8f0); font-family: ${bodyFontFamily}; font-size: 0.875rem; line-height: 1.6; opacity: 0.85;">${differsText}</p>
                            </div>
                            ` : ''}
                        </div>
                    `;
                    comparisonPanel.style.marginTop = '1.25rem';
                    comparisonPanel.style.opacity = '1';
                    comparisonPanel.style.maxHeight = '800px';
                } else {
                    comparisonPanel.style.maxHeight = '0px';
                    comparisonPanel.style.opacity = '0';
                    comparisonPanel.style.marginTop = '0px';
                }
            }
        };

        legendContainer.appendChild(pill);
    });

    return chartInstance;
};
