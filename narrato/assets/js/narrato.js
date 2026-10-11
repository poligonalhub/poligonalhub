// Camada de Armazenamento Resiliente a SecurityError (protocolos locais e abas restritas)
    function getStorage(key, fallback) {
      try {
        return localStorage.getItem(key) || fallback;
      } catch (e) {
        return fallback;
      }
    }

    function setStorage(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // Operação segura em memória
      }
    }

    const TOPICOS_DB = window.TOPICOS_DB || [];
    let topicoAtivo = null;

    const searchInput = document.getElementById('searchInput');
    const chapterBlocks = document.querySelectorAll('.chapter-block');
    const dockButtons = document.querySelectorAll('.dock-btn[data-target]');
    const dockActiveIcon = document.getElementById('dockActiveIcon');
    const dockActiveText = document.getElementById('dockActiveText');
    const scaffoldModal = document.getElementById('scaffoldModalBackdrop');
    const drawer = scaffoldModal;
    const backdrop = scaffoldModal;
    const toast = document.getElementById('toastPill');
    const brandLogo = document.getElementById('brandLogo');
    const headerActions = document.getElementById('headerActions');
    const headerSloganBadge = document.getElementById('headerSloganBadge');
    const sloganBarInner = document.getElementById('sloganBarInner');

    const drawerBody = document.getElementById('drawerBody');
    const drawerTopicId = document.getElementById('drawerTopicId');
    const drawerCapIcon = document.getElementById('drawerCapIcon');
    const drawerCapName = document.getElementById('drawerCapName');
    const drawerAxisBadge = document.getElementById('drawerAxisBadge');
    const drawerTitle = document.getElementById('drawerTitle');
    const drawerProse = document.getElementById('drawerProse');
    const drawerBiblio = document.getElementById('drawerBiblio');
    const drawerDiretriz = document.getElementById('drawerDiretriz');
    const drawerDiretrizBox = document.getElementById('drawerDiretrizBox');
    const drawerCounterText = document.getElementById('drawerCounterText');
    const drawerProgressBar = document.getElementById('drawerProgressBar');
    const drawerPrevBtn = document.getElementById('drawerPrevBtn');
    const drawerNextBtn = document.getElementById('drawerNextBtn');
    const drawerFootPrev = document.getElementById('drawerFootPrev');
    const drawerFootNext = document.getElementById('drawerFootNext');

    // Sistema de Filtros por Disciplina Dramatúrgica & Pesquisa Live
    let currentQuery = '';
    let activeEixo = 'all';

    function aplicarFiltroEixo(eixo) {
      if (activeEixo === eixo && eixo !== 'all') {
        activeEixo = 'all';
      } else {
        activeEixo = eixo;
      }

      // Atualiza estado visual das pills
      document.querySelectorAll('.filter-pill').forEach(pill => {
        if (pill.getAttribute('data-eixo') === activeEixo) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      filtrar();

      // Se o usuário clicar enquanto ainda visualiza o hero, rola suavemente para o conteúdo
      const track = document.getElementById('heroTrack');
      if (track && window.scrollY < track.offsetHeight * 0.8) {
        window.scrollTo({ top: track.offsetHeight, behavior: 'smooth' });
      }
    }

    function limparTodaBusca() {
      currentQuery = '';
      activeEixo = 'all';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      const searchClearBtn = document.getElementById('searchClearBtn');
      if (searchClearBtn) searchClearBtn.style.display = 'none';
      document.querySelectorAll('.filter-pill').forEach(pill => {
        if (pill.getAttribute('data-eixo') === 'all') pill.classList.add('active');
        else pill.classList.remove('active');
      });
      filtrar();
    }

    function filtrar() {
      let totalVisiveis = 0;

      // Alterna visibilidade do botão de limpeza de busca
      const searchClearBtn = document.getElementById('searchClearBtn');
      if (searchClearBtn) {
        searchClearBtn.style.display = currentQuery ? 'inline-flex' : 'none';
      }

      chapterBlocks.forEach(block => {
        let visibleInBlock = 0;
        const cards = block.querySelectorAll('.glass-card');

        cards.forEach(card => {
          const id = card.getAttribute('data-id').toLowerCase();
          const cardEixo = card.getAttribute('data-eixo') || '';
          const title = card.querySelector('.card-heading').textContent.toLowerCase();
          const prose = card.querySelector('.card-prose').textContent.toLowerCase();

          const matchQuery = (!currentQuery || id.includes(currentQuery) || title.includes(currentQuery) || prose.includes(currentQuery));
          const matchEixo = (activeEixo === 'all' || cardEixo === activeEixo);

          if (matchQuery && matchEixo) {
            card.style.display = 'flex';
            visibleInBlock++;
            totalVisiveis++;
          } else {
            card.style.display = 'none';
          }
        });

        block.style.display = visibleInBlock > 0 ? 'flex' : 'none';
      });

      // Estado de busca vazia (quando nenhum card corresponde)
      const emptyState = document.getElementById('emptySearchState');
      if (emptyState) {
        emptyState.style.display = totalVisiveis === 0 ? 'flex' : 'none';
      }

      // Feedback visual do filtro ativo
      const feedbackBar = document.getElementById('filterFeedbackBar');
      const feedbackMsg = document.getElementById('filterFeedbackMsg');
      if (feedbackBar && feedbackMsg) {
        if (activeEixo !== 'all' || currentQuery) {
          feedbackBar.style.display = 'flex';
          const nomesEixos = {
            'consenso': '⚖️ Consenso',
            'dissenso': '🥊 Dissenso',
            'metodos': '📐 Métodos',
            'reescrita': '🪚 Reescrita',
            'coletivo': '🤝 Coletivo'
          };
          let partes = [];
          if (activeEixo !== 'all') partes.push(`eixo <strong>${nomesEixos[activeEixo] || activeEixo}</strong>`);
          if (currentQuery) partes.push(`termo "<em>${currentQuery}</em>"`);
          feedbackMsg.innerHTML = `Exibindo <strong>${totalVisiveis}</strong> de 50 matérias (${partes.join(' + ')}).`;
        } else {
          feedbackBar.style.display = 'none';
        }
      }
    }

    function filtrarDoDrawer() {
      if (!topicoAtivo) return;
      const eixo = topicoAtivo.eixo_classe || 'all';
      fecharDrawer();
      aplicarFiltroEixo(eixo);
      showToast(`Filtrando matérias por ${topicoAtivo.eixo_icone || ''} ${topicoAtivo.eixo || ''}`);
    }

    // Navegação suave de volta ao topo (Início do Canteiro / Hero)
    function rolarParaTopo(e) {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch (err) {}
    }

    // Navegação suave a partir do prompt do Hero
    function rolarParaConteudo(e) {
      if (e) e.preventDefault();
      const track = document.getElementById('heroTrack');
      if (track) {
        window.scrollTo({ top: track.offsetHeight, behavior: 'smooth' });
      }
      dispararDestrocosHero(36);
    }

    // --- LÓGICA DE SCROLL PARALLAX DA HERO COM ENCAIXE MILIMÉTRICO NO MENU SUPERIOR ---
    let lastDebrisProgress = 0;

    const handleHeroScroll = () => {
      const track = document.getElementById('heroTrack');
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll <= 0) return;

      let progress = -rect.top / maxScroll;
      progress = Math.max(0, Math.min(progress, 1)); 

      const logoWrap = document.getElementById('heroLogoWrap');
      const logoColor = document.getElementById('heroLogoColor');
      const logoWhite = document.getElementById('heroLogoWhite');
      const text = document.getElementById('heroText');
      const sloganInner = document.getElementById('sloganBarInner');
      const heroBlock = document.getElementById('heroBlock');
      const prompt = document.getElementById('introScrollPrompt');
      const siteHeader = document.getElementById('siteHeader');
      const headerBrand = document.getElementById('headerBrandGroup');
      const brandLogo = document.getElementById('brandLogo');
      const headerSlogan = document.getElementById('headerSloganBadge');
      const headerActions = document.getElementById('headerActions');
      const toolbeltWrapper = document.getElementById('toolbeltWrapper');

      const isMobile = window.innerWidth < 768;
      const startMaxW = isMobile ? 320 : 680;
      const midMaxW = isMobile ? 260 : 500;

      // FASE 1 (0.00 -> 0.30): Dissolve de Cor para Branco
      const colorDissolve = Math.min(progress / 0.30, 1);
      if (logoWhite) logoWhite.style.opacity = colorDissolve;
      if (logoColor) logoColor.style.opacity = 1 - colorDissolve;

      // FASE 2 (0.12 -> 0.42): Abertura do Slogan Widescreen (Opção 5)
      const sloganProgress = Math.max(0, Math.min((progress - 0.12) / 0.30, 1));
      if (text) {
        text.style.maxHeight = (sloganProgress * 140) + 'px'; 
        text.style.marginTop = (sloganProgress * 1.8) + 'rem';
        text.style.opacity = sloganProgress;
      }

      // FASE 3: Encolhimento inicial do Logo (680px -> 500px)
      if (progress <= 0.42) {
        const p1 = progress / 0.42;
        const currentMaxW = startMaxW - (startMaxW - midMaxW) * p1;
        if (logoWrap) {
          logoWrap.style.maxWidth = currentMaxW + 'px';
          logoWrap.style.transform = 'none';
        }
        if (text) {
          text.style.transform = 'translateY(' + ((1 - sloganProgress) * 16) + 'px)';
        }
        if (sloganInner) {
          sloganInner.style.padding = '1.1rem 2rem';
          sloganInner.style.background = 'rgba(20, 20, 22, 0.82)';
        }
        if (siteHeader) {
          siteHeader.style.backgroundColor = 'transparent';
          siteHeader.style.borderBottomColor = 'transparent';
          siteHeader.style.backdropFilter = 'none';
          siteHeader.style.webkitBackdropFilter = 'none';
        }
        if (headerActions) {
          headerActions.style.opacity = '0';
          headerActions.style.pointerEvents = 'none';
        }
        if (heroBlock) {
          heroBlock.style.opacity = '1';
          heroBlock.style.visibility = 'visible';
        }
        if (headerBrand) {
          headerBrand.style.opacity = '0';
          headerBrand.classList.remove('visible');
        }
      } else {
        // FASE 4 (0.42 -> 0.96): VOO E ENCAIXE LITERAL DO LETREIRO E DO SUBTÍTULO NO MENU SUPERIOR
        const dockProgress = Math.min((progress - 0.42) / 0.54, 1);

        // Curva cúbica suave de aproximação e encaixe
        const ease = dockProgress < 0.5
          ? 2 * dockProgress * dockProgress
          : 1 - Math.pow(-2 * dockProgress + 2, 2) / 2;

        // Medição dinâmica dos alvos reais no menu superior
        const targetLogoRect = brandLogo ? brandLogo.getBoundingClientRect() : null;
        const targetBadgeRect = headerSlogan ? headerSlogan.getBoundingClientRect() : null;

        if (targetLogoRect && targetBadgeRect && logoWrap && text) {
          // Centros iniciais no hero sticky (100vh / 100vw centralizados)
          const heroSticky = document.getElementById('heroSticky');
          const stickyW = heroSticky ? heroSticky.offsetWidth : window.innerWidth;
          const stickyH = heroSticky ? heroSticky.offsetHeight : window.innerHeight;

          const baseCenterLogoX = stickyW / 2;
          const baseCenterLogoY = (stickyH / 2) - 40;

          const baseCenterTextX = stickyW / 2;
          const baseCenterTextY = (stickyH / 2) + 42;

          // Alvos no header
          const targetCenterLogoX = targetLogoRect.left + targetLogoRect.width / 2;
          const targetCenterLogoY = targetLogoRect.top + targetLogoRect.height / 2;

          const targetCenterTextX = targetBadgeRect.left + targetBadgeRect.width / 2;
          const targetCenterTextY = targetBadgeRect.top + targetBadgeRect.height / 2;

          // Vetores de transladação
          const deltaLogoX = targetCenterLogoX - baseCenterLogoX;
          const deltaLogoY = targetCenterLogoY - baseCenterLogoY;
          const scaleLogo = targetLogoRect.width / midMaxW;

          const initialTextW = isMobile ? Math.min(stickyW * 0.92, 420) : Math.min(stickyW * 0.85, 780);
          const deltaTextX = targetCenterTextX - baseCenterTextX;
          const deltaTextY = targetCenterTextY - baseCenterTextY;
          const scaleText = targetBadgeRect.width / initialTextW;

          // Interpolação suave em direção aos slots exatos
          const curLogoX = deltaLogoX * ease;
          const curLogoY = deltaLogoY * ease;
          const curLogoScale = 1 - (1 - scaleLogo) * ease;
          logoWrap.style.transform = 'translate3d(' + curLogoX + 'px, ' + curLogoY + 'px, 0) scale(' + curLogoScale + ')';

          const curTextX = deltaTextX * ease;
          const curTextY = deltaTextY * ease;
          const curTextScale = 1 - (1 - scaleText) * ease;
          text.style.transform = 'translate3d(' + curTextX + 'px, ' + curTextY + 'px, 0) scale(' + curTextScale + ')';

          // Transição gradual da barra de slogan (padding e fundo) para a estética do badge
          if (sloganInner) {
            const padV = 1.1 - (1.1 - 0.35) * ease;
            const padH = 2.0 - (2.0 - 0.75) * ease;
            sloganInner.style.padding = padV + 'rem ' + padH + 'rem';
            sloganInner.style.background = 'rgba(20, 20, 22, ' + (0.82 - (0.82 - 0.16) * ease) + ')';
          }
        }

        // FASE 5: Materialização suave do vidro do menu superior e dos controles
        const headerMaterialize = Math.max(0, Math.min((dockProgress - 0.20) / 0.75, 1));
        if (siteHeader) {
          siteHeader.style.backgroundColor = 'rgba(20, 20, 22, ' + (0.96 * headerMaterialize) + ')';
          siteHeader.style.borderBottomColor = 'rgba(255, 255, 255, ' + (0.18 * headerMaterialize) + ')';
          siteHeader.style.backdropFilter = 'blur(' + (18 * headerMaterialize) + 'px)';
          siteHeader.style.webkitBackdropFilter = 'blur(' + (18 * headerMaterialize) + 'px)';
        }

        if (headerActions) {
          const actProgress = Math.max(0, Math.min((dockProgress - 0.60) / 0.36, 1));
          headerActions.style.opacity = actProgress;
          headerActions.style.transform = 'translateY(' + ((1 - actProgress) * -8) + 'px)';
          headerActions.style.pointerEvents = actProgress > 0.8 ? 'auto' : 'none';
        }

        // FASE 6: Encaixe Final / Transição de Custódia para o Header
        if (dockProgress >= 0.96) {
          if (siteHeader) siteHeader.classList.add('docked');
          if (headerBrand) {
            headerBrand.style.opacity = '1';
            headerBrand.classList.add('visible');
          }
          if (heroBlock) {
            heroBlock.style.opacity = '0';
            heroBlock.style.visibility = 'hidden';
          }
        } else {
          if (siteHeader) siteHeader.classList.remove('docked');
          if (headerBrand) {
            headerBrand.style.opacity = '0';
            headerBrand.classList.remove('visible');
          }
          if (heroBlock) {
            heroBlock.style.opacity = '1';
            heroBlock.style.visibility = 'visible';
          }
        }
      }

      // FASE 7: Fade Out do Prompt de Entrada
      if (prompt) {
        if (progress > 0.35) {
          const promptFade = Math.max(0, 1 - (progress - 0.35) / 0.25);
          prompt.style.opacity = promptFade;
          prompt.style.pointerEvents = promptFade > 0.1 ? 'auto' : 'none';
        } else {
          prompt.style.opacity = 1;
          prompt.style.pointerEvents = 'auto';
        }
      }

      // TOOLBELT & PERSISTÊNCIA APÓS SAÍDA DO TRACK HERO
      if (window.scrollY >= track.offsetHeight - 80) {
        if (siteHeader) siteHeader.classList.add('docked');
        if (headerBrand) {
          headerBrand.style.opacity = '1';
          headerBrand.classList.add('visible');
        }
        if (heroBlock) {
          heroBlock.style.opacity = '0';
          heroBlock.style.visibility = 'hidden';
        }
        if (toolbeltWrapper) {
          toolbeltWrapper.style.opacity = '1';
          toolbeltWrapper.style.visibility = 'visible';
          toolbeltWrapper.style.pointerEvents = 'auto';
          toolbeltWrapper.style.transform = 'translateX(-50%) translateY(0)';
        }
      } else if (progress <= 0.42) {
        if (toolbeltWrapper) {
          toolbeltWrapper.style.opacity = '0';
          toolbeltWrapper.style.visibility = 'hidden';
          toolbeltWrapper.style.pointerEvents = 'none';
          toolbeltWrapper.style.transform = 'translateX(-50%) translateY(24px)';
        }
      }

      // DESTROÇOS DE CANTEIRO ACIONADOS PELO ATRITO DO SCROLL
      if (Math.abs(progress - lastDebrisProgress) > 0.05 && progress < 0.95) {
        dispararDestrocosHero(2);
        lastDebrisProgress = progress;
      }
    };

    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    window.addEventListener('resize', handleHeroScroll);
    handleHeroScroll();

    // ==========================================================================
    // FÍSICA LEVE DE DESTROÇOS (CANTEIRO) NO CANVAS DO HERO
    // ==========================================================================
    const heroCanvas = document.getElementById('heroDebrisCanvas');
    let heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
    let heroParticles = [];
    let isDebrisRunning = false;

    function resizeHeroCanvas() {
      const heroSticky = document.getElementById('heroSticky');
      if (!heroCanvas || !heroSticky) return;
      heroCanvas.width = heroSticky.offsetWidth;
      heroCanvas.height = heroSticky.offsetHeight;
    }
    window.addEventListener('resize', resizeHeroCanvas);
    resizeHeroCanvas();

    const DEBRIS_COLORS = ['#E2583E', '#C0392B', '#FFB201', '#D35400', '#A0A0A6'];

    function dispararDestrocosHero(qtd = 28) {
      if (!heroCanvas) return;
      const cx = heroCanvas.width / 2;
      const cy = heroCanvas.height / 2 + 30;

      for (let i = 0; i < qtd; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
        const speed = Math.random() * 7 + 2.5;
        heroParticles.push({
          x: cx + (Math.random() - 0.5) * 260,
          y: cy + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 6 + 3,
          color: DEBRIS_COLORS[Math.floor(Math.random() * DEBRIS_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.015,
          gravity: 0.22
        });
      }

      if (!isDebrisRunning) {
        isDebrisRunning = true;
        requestAnimationFrame(updateHeroDebris);
      }
    }

    function updateHeroDebris() {
      if (!heroCtx || !heroCanvas) return;
      heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      for (let i = heroParticles.length - 1; i >= 0; i--) {
        const p = heroParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          heroParticles.splice(i, 1);
          continue;
        }

        heroCtx.save();
        heroCtx.globalAlpha = Math.max(0, p.life);
        heroCtx.translate(p.x, p.y);
        heroCtx.rotate(p.rotation);
        heroCtx.fillStyle = p.color;
        heroCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        heroCtx.restore();
      }

      if (heroParticles.length > 0) {
        requestAnimationFrame(updateHeroDebris);
      } else {
        isDebrisRunning = false;
      }
    }

    // Emissão de destroços leve no primeiro scroll para fora do hero
    let hasEmittedOnScroll = false;
    window.addEventListener('scroll', () => {
      if (!hasEmittedOnScroll && window.scrollY > 40 && window.scrollY < 300) {
        hasEmittedOnScroll = true;
        dispararDestrocosHero(24);
      } else if (window.scrollY < 20) {
        hasEmittedOnScroll = false;
      }
    }, { passive: true });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentQuery = e.target.value.toLowerCase().trim();
        filtrar();
      });
    }

    window.addEventListener('keydown', (e) => {
      const isDrawerOpen = drawer && drawer.classList.contains('active');

      if (e.key === 'Escape') {
        if (isDrawerOpen) {
          fecharDrawer();
        } else if (document.activeElement === searchInput) {
          limparTodaBusca();
          searchInput.blur();
        }
      } else if (isDrawerOpen && e.key === 'ArrowLeft') {
        e.preventDefault();
        navegarDrawer(-1);
      } else if (isDrawerOpen && e.key === 'ArrowRight') {
        e.preventDefault();
        navegarDrawer(1);
      } else if (e.key === '/' && !isDrawerOpen && document.activeElement !== searchInput) {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      } else if (!isDrawerOpen && document.activeElement !== searchInput) {
        // Navegação de teclado por setas entre os cards visíveis
        const visibleCards = Array.from(document.querySelectorAll('.glass-card')).filter(c => c.style.display !== 'none');
        if (visibleCards.length > 0) {
          const currentIndex = visibleCards.indexOf(document.activeElement);
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = currentIndex === -1 ? 0 : (currentIndex + 1) % visibleCards.length;
            visibleCards[nextIdx].focus();
            visibleCards[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = currentIndex === -1 ? 0 : (currentIndex - 1 + visibleCards.length) % visibleCards.length;
            visibleCards[prevIdx].focus();
            visibleCards[prevIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else if ((e.key === 'Enter' || e.key === ' ') && currentIndex !== -1) {
            e.preventDefault();
            const topicId = visibleCards[currentIndex].getAttribute('data-id');
            if (topicId) abrirDrawer(topicId);
          }
        }
      }
    });

    // ScrollSpy Dinâmico com Atualização do Banner Flutuante
    window.addEventListener('scroll', () => {
      let currentCapSlug = '';
      let currentCapName = '';
      let currentCapIcon = '';
      let currentCapNum = '';

      chapterBlocks.forEach(block => {
        const rect = block.getBoundingClientRect();
        if (rect.top <= 260 && rect.bottom >= 160) {
          currentCapSlug = block.getAttribute('id');
          currentCapName = block.getAttribute('data-cap-name');
          currentCapIcon = block.getAttribute('data-cap-icon');
          currentCapNum = block.getAttribute('data-cap');
        }
      });

      if (currentCapSlug) {
        dockButtons.forEach(btn => {
          if (btn.getAttribute('data-target') === currentCapSlug) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        if (dockActiveText && currentCapName) {
          dockActiveIcon.textContent = currentCapIcon;
          dockActiveText.textContent = `Capítulo ${currentCapNum} • ${currentCapName}`;
        }
      }
    }, { passive: true });

    // Modal Logic & Renderização
    function renderBiblioItems(livros) {
      if (!livros || livros.length === 0) {
        return '<p class="biblio-detail">Bibliografia oficial em catalogação sob as diretrizes do Caderno de Encargos.</p>';
      }
      return livros.map(l => `
        <div class="biblio-item">
          <div class="biblio-header-row">
            <span class="biblio-author">${l.autor}</span>
            <a href="${l.link}" target="_blank" rel="noopener noreferrer" class="biblio-amazon-btn" title="Comprar obra na Amazon">
              <span>Comprar ↗</span>
            </a>
          </div>
          <a href="${l.link}" target="_blank" rel="noopener noreferrer" class="biblio-book-title-link" title="Comprar obra na Amazon">
            <div class="biblio-book">"${l.obra}"</div>
          </a>
          <div class="biblio-detail">${l.foco}</div>
        </div>
      `).join('');
    }

    function abrirDrawer(id) {
      const index = TOPICOS_DB.findIndex(t => t.id === id);
      if (index === -1) return;

      const item = TOPICOS_DB[index];
      topicoAtivo = item;

      // Micro-transição suave no corpo
      if (drawerBody) {
        drawerBody.style.opacity = '0.5';
        setTimeout(() => { drawerBody.style.opacity = '1'; }, 100);
      }

      drawerTopicId.textContent = `TÓPICO ${item.numero.toString().padStart(2, '0')} • CAP. ${item.capitulo_num}`;
      drawerCapIcon.textContent = item.capitulo_icone;
      drawerCapName.textContent = `Capítulo ${item.capitulo_num} • ${item.capitulo_nome}`;
      drawerTitle.textContent = item.titulo;
      drawerProse.textContent = item.assunto;

      const badgeClass = item.eixo_classe || 'consenso';
      const badgeIcon = item.eixo_icone || '⚖️';
      const badgeName = item.eixo || 'Consenso';
      drawerAxisBadge.className = `axis-badge ${badgeClass}`;
      drawerAxisBadge.textContent = `${badgeIcon} ${badgeName}`;

      if (drawerBiblio) {
        drawerBiblio.innerHTML = renderBiblioItems(item.bibliografia);
      }

      if (drawerDiretriz) {
        drawerDiretriz.textContent = item.diretriz || "Aplique a metodologia com atenção à coerência dramática e integridade do canteiro.";
      }

      const slug = item.slug || ('t' + item.numero.toString().padStart(2, '0'));
      const drawerMemorialLink = document.getElementById('drawerMemorialLink');
      if (drawerMemorialLink) {
        drawerMemorialLink.href = `topicos/${slug}.html`;
      }
      const drawerMemorialTopLink = document.getElementById('drawerMemorialTopLink');
      if (drawerMemorialTopLink) {
        drawerMemorialTopLink.href = `topicos/${slug}.html`;
      }

      // Atualização dos controles de navegação
      const total = TOPICOS_DB.length;
      const numDisplay = item.numero.toString().padStart(2, '0');
      if (drawerCounterText) drawerCounterText.textContent = `${numDisplay} / ${total}`;
      if (drawerProgressBar) drawerProgressBar.style.width = `${(item.numero / total) * 100}%`;

      const isFirst = index === 0;
      const isLast = index === total - 1;

      if (drawerPrevBtn) drawerPrevBtn.disabled = isFirst;
      if (drawerNextBtn) drawerNextBtn.disabled = isLast;
      if (drawerFootPrev) drawerFootPrev.disabled = isFirst;
      if (drawerFootNext) drawerFootNext.disabled = isLast;

      if (scaffoldModal) {
        scaffoldModal.classList.add('active');
        scaffoldModal.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';

      // Sincronização segura de URL sem salto de scroll
      try {
        history.replaceState(null, '', '#' + item.id.toLowerCase());
      } catch (e) {}
    }

    function navegarDrawer(delta) {
      if (!topicoAtivo) return;
      const currentIndex = TOPICOS_DB.findIndex(t => t.id === topicoAtivo.id);
      if (currentIndex === -1) return;

      const targetIndex = currentIndex + delta;
      if (targetIndex >= 0 && targetIndex < TOPICOS_DB.length) {
        abrirDrawer(TOPICOS_DB[targetIndex].id);
      }
    }

    function fecharDrawer(e) {
      if (e && e.target && e.target.closest && e.target.closest('#scaffoldFrame')) {
        return; // Clique dentro do frame do andaime não fecha
      }
      if (scaffoldModal) {
        scaffoldModal.classList.remove('active');
        scaffoldModal.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
      topicoAtivo = null;
    }

    // Suporte a Touch Swipe Mobile no Drawer
    let touchStartX = 0;
    let touchEndX = 0;

    if (drawer) {
      drawer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      drawer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 60) {
          if (diffX < 0) {
            // Deslizou para a esquerda -> próximo
            navegarDrawer(1);
          } else {
            // Deslizou para a direita -> anterior
            navegarDrawer(-1);
          }
        }
      }, { passive: true });
    }

    function showToast(msg) {
      const toastMsg = document.getElementById('toastMsg');
      if (toastMsg) toastMsg.textContent = msg;
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2400);
      }
    }



    // Alternância Dinâmica de Tipografia (OpenDyslexicMono vs JetBrains Mono)
    const fontToggleBtn = document.getElementById('fontToggleBtn');
    const fontToggleIcon = document.getElementById('fontToggleIcon');

    function applyFontVariant(variant) {
      if (variant === 'technical') {
        document.documentElement.setAttribute('data-font', 'technical');
        if (fontToggleIcon) fontToggleIcon.textContent = '📐';
        if (fontToggleBtn) {
          fontToggleBtn.setAttribute('title', 'Tipografia Técnica ativa (JetBrains Mono). Clique para OpenDyslexic.');
          fontToggleBtn.setAttribute('aria-label', 'Tipografia Técnica ativa (JetBrains Mono). Clique para OpenDyslexic.');
        }
      } else {
        document.documentElement.removeAttribute('data-font');
        if (fontToggleIcon) fontToggleIcon.textContent = '🔤';
        if (fontToggleBtn) {
          fontToggleBtn.setAttribute('title', 'Tipografia Oficial ativa (OpenDyslexic). Clique para JetBrains Mono.');
          fontToggleBtn.setAttribute('aria-label', 'Tipografia Oficial ativa (OpenDyslexic). Clique para JetBrains Mono.');
        }
      }
    }

    function initFont() {
      const savedFont = getStorage('narrato-font', 'dyslexic');
      applyFontVariant(savedFont);
    }

    if (fontToggleBtn) {
      fontToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-font') === 'technical' ? 'technical' : 'dyslexic';
        const next = current === 'technical' ? 'dyslexic' : 'technical';
        setStorage('narrato-font', next);
        applyFontVariant(next);
        showToast(next === 'technical' ? 'Tipografia Técnica: JetBrains Mono ativada 📐' : 'Tipografia Oficial: OpenDyslexicMono ativada 🔤');
      });
    }
    initFont();

    // Verificação de deep-link na inicialização
    window.addEventListener('DOMContentLoaded', () => {
      const hash = window.location.hash.replace('#', '').toUpperCase();
      if (hash && hash.startsWith('T') && TOPICOS_DB.some(t => t.id === hash)) {
        setTimeout(() => { abrirDrawer(hash); }, 300);
      }
    });

// =============================================================================
// UNIVERSAL OMNI-SEARCH ENGINE (CLIENT-SIDE PESQUISA CENTRALIZADA)
// =============================================================================
let currentOmniFilter = 'todos';

function getPathPrefix() {
  const p = window.location.pathname;
  if (p.includes('/topicos/') || p.includes('/fontes/') || p.includes('/glossario/')) {
    return '../';
  }
  return '';
}

function handleOmniFocus() {
  const input = document.getElementById('omniSearchInput');
  if (input && input.value.trim().length > 0) {
    const dropdown = document.getElementById('omniDropdown');
    if (dropdown) dropdown.classList.add('active');
  }
}

function closeOmniDropdown() {
  const dropdown = document.getElementById('omniDropdown');
  if (dropdown) dropdown.classList.remove('active');
}

function clearOmniSearch() {
  const input = document.getElementById('omniSearchInput');
  const clearBtn = document.getElementById('omniClearBtn');
  if (input) {
    input.value = '';
    input.focus();
  }
  if (clearBtn) clearBtn.style.display = 'none';
  closeOmniDropdown();
}

function setOmniFilter(filterType) {
  currentOmniFilter = filterType;
  document.querySelectorAll('.omni-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('onclick') && t.getAttribute('onclick').includes(filterType));
  });
  const input = document.getElementById('omniSearchInput');
  if (input) handleOmniSearch(input.value);
}

function navigateToOmniItem(type, id, slug) {
  const prefix = getPathPrefix();
  closeOmniDropdown();

  if (type === 'topico') {
    window.location.href = prefix + 'topicos/' + slug + '.html';
  } else if (type === 'livro') {
    if (window.location.pathname.includes('/fontes/')) {
      if (typeof abrirModalFonte === 'function') {
        abrirModalFonte(id);
        return;
      }
    }
    window.location.href = prefix + 'fontes/index.html#' + id;
  } else if (type === 'verbete') {
    if (window.location.pathname.includes('/glossario/')) {
      if (typeof abrirModalVerbete === 'function') {
        abrirModalVerbete(id);
        return;
      }
    }
    window.location.href = prefix + 'glossario/index.html#' + id;
  }
}

function handleOmniSearch(query) {
  const q = (query || '').trim().toLowerCase();
  const clearBtn = document.getElementById('omniClearBtn');
  const dropdown = document.getElementById('omniDropdown');
  const resultsBody = document.getElementById('omniResultsBody');

  if (!dropdown || !resultsBody) return;

  if (!q) {
    if (clearBtn) clearBtn.style.display = 'none';
    closeOmniDropdown();
    return;
  }

  if (clearBtn) clearBtn.style.display = 'block';
  dropdown.classList.add('active');

  const index = window.OMNI_INDEX || [];
  let matches = index.filter(item => (item.keywords || '').includes(q));

  const totalMat = matches.filter(m => m.type === 'topico').length;
  const totalLiv = matches.filter(m => m.type === 'livro').length;
  const totalVer = matches.filter(m => m.type === 'verbete').length;

  const countTodos = document.getElementById('countTodos');
  const countTopicos = document.getElementById('countTopicos');
  const countLivros = document.getElementById('countLivros');
  const countVerbetes = document.getElementById('countVerbetes');

  if (countTodos) countTodos.innerText = matches.length;
  if (countTopicos) countTopicos.innerText = totalMat;
  if (countLivros) countLivros.innerText = totalLiv;
  if (countVerbetes) countVerbetes.innerText = totalVer;

  if (currentOmniFilter !== 'todos') {
    matches = matches.filter(m => m.type === currentOmniFilter);
  }

  if (matches.length === 0) {
    resultsBody.innerHTML = `<div class="omni-empty">Nenhum tijolo ou termo encontrado para "${query}".</div>`;
    return;
  }

  let html = '';
  const topicosList = matches.filter(m => m.type === 'topico');
  const livrosList = matches.filter(m => m.type === 'livro');
  const verbetesList = matches.filter(m => m.type === 'verbete');

  if (topicosList.length > 0 && (currentOmniFilter === 'todos' || currentOmniFilter === 'topico')) {
    html += `<div class="omni-group-title">🏗️ Matérias do Caderno (${topicosList.length})</div>`;
    topicosList.slice(0, 5).forEach(item => {
      html += `
        <div class="omni-item" onclick="navigateToOmniItem('topico', '${item.id}', '${item.slug}')">
          <span class="omni-item-badge badge-mat">${item.id}</span>
          <div class="omni-item-content">
            <div class="omni-item-title">${item.title}</div>
            <div class="omni-item-sub">${item.sub}</div>
            <div class="omni-item-desc">${item.desc}</div>
          </div>
        </div>
      `;
    });
  }

  if (livrosList.length > 0 && (currentOmniFilter === 'todos' || currentOmniFilter === 'livro')) {
    html += `<div class="omni-group-title">📚 Obras & Bibliografia (${livrosList.length})</div>`;
    livrosList.slice(0, 5).forEach(item => {
      html += `
        <div class="omni-item" onclick="navigateToOmniItem('livro', '${item.id}', '${item.slug}')">
          <span class="omni-item-badge badge-liv">Livro</span>
          <div class="omni-item-content">
            <div class="omni-item-title">${item.title}</div>
            <div class="omni-item-sub">${item.sub}</div>
            <div class="omni-item-desc">${item.desc}</div>
          </div>
        </div>
      `;
    });
  }

  if (verbetesList.length > 0 && (currentOmniFilter === 'todos' || currentOmniFilter === 'verbete')) {
    html += `<div class="omni-group-title">📖 Glossário & Tags (${verbetesList.length})</div>`;
    verbetesList.slice(0, 5).forEach(item => {
      const rawSlug = item.ancora || (item.title.split('•')[0].replace('#', '').trim());
      html += `
        <div class="omni-item" onclick="navigateToOmniItem('verbete', '${rawSlug}', '${rawSlug}')">
          <span class="omni-item-badge badge-ver">Verbete</span>
          <div class="omni-item-content">
            <div class="omni-item-title">${item.title}</div>
            <div class="omni-item-sub">${item.sub}</div>
            <div class="omni-item-desc">${item.desc}</div>
          </div>
        </div>
      `;
    });
  }

  resultsBody.innerHTML = html;
}

// Atalho global Ctrl+K e Escape
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const input = document.getElementById('omniSearchInput');
    if (input) {
      input.focus();
      input.select();
    }
  } else if (e.key === 'Escape') {
    closeOmniDropdown();
  }
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', e => {
  if (!e.target.closest('[data-omni-search]') && !e.target.closest('.omni-search-wrapper')) {
    closeOmniDropdown();
  }
});

// =========================================================================
// GESTÃO DE ESTADO DO CADERNO DE ENCARGOS: LIDO & RECOLHIDO (LOCALSTORAGE)
// =========================================================================
function getCapitulosLidos() {
  try {
    return JSON.parse(localStorage.getItem('narrato_capitulos_lidos')) || [];
  } catch (e) {
    return [];
  }
}

function setCapitulosLidos(arr) {
  try {
    localStorage.setItem('narrato_capitulos_lidos', JSON.stringify(arr));
  } catch (e) {}
}

function getCapitulosColapsados() {
  try {
    return JSON.parse(localStorage.getItem('narrato_capitulos_colapsados')) || [];
  } catch (e) {
    return [];
  }
}

function setCapitulosColapsados(arr) {
  try {
    localStorage.setItem('narrato_capitulos_colapsados', JSON.stringify(arr));
  } catch (e) {}
}

function toggleCapLido(capNum) {
  const lidos = getCapitulosLidos();
  const idx = lidos.indexOf(capNum);
  const block = document.querySelector(`.chapter-block[data-cap="${capNum}"]`);
  const btn = document.querySelector(`.btn-cap-read[data-cap="${capNum}"]`);

  if (idx > -1) {
    lidos.splice(idx, 1);
    if (block) block.classList.remove('cap-lido');
    if (btn) btn.classList.remove('active');
    if (typeof mostrarToast === 'function') mostrarToast(`Capítulo ${capNum} desmarcado como lido.`);
  } else {
    lidos.push(capNum);
    if (block) block.classList.add('cap-lido');
    if (btn) btn.classList.add('active');
    if (typeof mostrarToast === 'function') mostrarToast(`✓ Capítulo ${capNum} marcado como lido!`);
  }
  setCapitulosLidos(lidos);
}

function toggleCapColapso(capNum) {
  const colapsados = getCapitulosColapsados();
  const idx = colapsados.indexOf(capNum);
  const body = document.getElementById(`cap-body-${capNum}`);
  const btn = document.querySelector(`.btn-cap-toggle[data-cap="${capNum}"]`);
  const toggleIcon = btn ? btn.querySelector('.toggle-icon') : null;

  if (idx > -1) {
    // Está colapsado -> expandir
    colapsados.splice(idx, 1);
    if (body) body.style.display = '';
    if (btn) btn.classList.remove('collapsed');
    if (toggleIcon) toggleIcon.textContent = '−';
  } else {
    // Está expandido -> colapsar
    colapsados.push(capNum);
    if (body) body.style.display = 'none';
    if (btn) btn.classList.add('collapsed');
    if (toggleIcon) toggleIcon.textContent = '+';
  }
  setCapitulosColapsados(colapsados);
}

function restaurarProgressoCapitulos() {
  const lidos = getCapitulosLidos();
  lidos.forEach(num => {
    const block = document.querySelector(`.chapter-block[data-cap="${num}"]`);
    const btn = document.querySelector(`.btn-cap-read[data-cap="${num}"]`);
    if (block) block.classList.add('cap-lido');
    if (btn) btn.classList.add('active');
  });

  const colapsados = getCapitulosColapsados();
  colapsados.forEach(num => {
    const body = document.getElementById(`cap-body-${num}`);
    const btn = document.querySelector(`.btn-cap-toggle[data-cap="${num}"]`);
    const toggleIcon = btn ? btn.querySelector('.toggle-icon') : null;
    if (body) body.style.display = 'none';
    if (btn) btn.classList.add('collapsed');
    if (toggleIcon) toggleIcon.textContent = '+';
  });
}

function resetarProgressoUsuario() {
  if (confirm("Deseja realmente resetar o progresso de leitura e dados locais do NarrATO?")) {
    try {
      localStorage.removeItem('narrato_capitulos_lidos');
      localStorage.removeItem('narrato_capitulos_colapsados');
      localStorage.removeItem('narrato_onboarding_dismissed');
    } catch (e) {}

    document.querySelectorAll('.chapter-block').forEach(b => b.classList.remove('cap-lido'));
    document.querySelectorAll('.btn-cap-read').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.chapter-content-body').forEach(b => b.style.display = '');
    document.querySelectorAll('.btn-cap-toggle').forEach(b => {
      b.classList.remove('collapsed');
      const icon = b.querySelector('.toggle-icon');
      if (icon) icon.textContent = '−';
    });

    if (typeof mostrarToast === 'function') mostrarToast("🔄 Dados locais e progresso resetados com sucesso.");
  }
}

// Onboarding Navigation
function abrirOnboarding() {
  window.location.href = 'entenda/index.html';
}

// Inicializar restauração ao carregar página
document.addEventListener('DOMContentLoaded', function() {
  restaurarProgressoCapitulos();
});
