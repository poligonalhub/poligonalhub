/* =========================================================================
   NarrATOsys • Caderno de Encargos (caderno.js)
   -------------------------------------------------------------------------
   Lógica da página principal do Caderno de Encargos.
   Coordena o Fullscreen Overlay de tópicos didáticos, modais de referência
   (fontes, verbetes, onboarding), omni-search e navegação por teclado/hash.
   O estado de progresso é gerenciado pelo módulo isolado progresso.js.

   =========================================================================
   ÍNDICE GERAL DE NAVEGAÇÃO (@anchor: #top)
   -------------------------------------------------------------------------
   - #01-estado-global          : Variáveis de estado e helpers de modais
   - #02-fullscreen-overlay     : Estudo de Tópico Didático (modofullscreen.jpg)
   - #03-modais-flutuantes      : Modais de Fontes, Verbetes e Onboarding
   - #04-roteamento-hash        : Deeplinking e detecção de rotas hash
   - #05-omni-search            : Sistema de busca centralizada cliente
   - #06-eventos-teclado        : Atalhos globais (Esc, setas, Ctrl+K)
   - #07-inicializacao          : Bootstrapping no carregamento da página
   ========================================================================= */

(function () {
  'use strict';

  /* =========================================================================
     [@anchor: #01-estado-global] [Voltar: #top]
     ESTADO GLOBAL E CONTROLE DE SOBREPOSIÇÕES
     ========================================================================= */
  let materiaAtivaIdx = 0;

  function fecharTodosModais() {
    // Fecha modais flutuantes (fontes, verbetes, onboarding)
    document.querySelectorAll('.modal-scaffold-backdrop').forEach(m => m.classList.remove('active'));

    document.body.style.overflow = '';

    try {
      if (window.location.hash && !window.location.hash.startsWith('#capitulo-') && !window.location.hash.startsWith('#c')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {}
  }


  /* =========================================================================
     [@anchor: #02-leitura-materia] [Voltar: #top]
     VISÃO DE LEITURA DA MATÉRIA DIDÁTICA (TEMPLATE OFICIAL TOPICO.HTML IN-PLACE)
     Header superior e sumário lateral permanecem sempre visíveis e operacionais.
     ========================================================================= */

  /**
   * Abre a leitura da matéria didática no miolo da página sem recarregar o navegador.
   * @param {number} globalNum - Número de 1 a 50 da matéria
   */
  window.abrirMateriaLeitura = function (globalNum) {
    if (!(window.MATERIAS_DB || window.TOPICOS_DB) || !Array.isArray((window.MATERIAS_DB || window.TOPICOS_DB))) return;

    const idx = (window.MATERIAS_DB || window.TOPICOS_DB).findIndex(t => t.numero === globalNum);
    if (idx === -1) return;

    materiaAtivaIdx = idx;
    const t = (window.MATERIAS_DB || window.TOPICOS_DB)[idx];
    const capNum = t.capitulo_num;
    const num02 = String(t.numero).padStart(2, '0');
    const cap02 = String(capNum).padStart(2, '0');
    const matCode = `C${cap02}M${num02}`;
    const hashStr = `c${cap02}m${num02}`;

    // Fecha modais flutuantes se houver algum aberto
    document.querySelectorAll('.modal-scaffold-backdrop').forEach(m => m.classList.remove('active'));

    // 1. Migalha (Breadcrumb)
    const elBreadCap = document.getElementById('materiaBreadcrumbCap');
    const elBreadMateria = document.getElementById('materiaBreadcrumbMateria');
    if (elBreadCap) elBreadCap.textContent = `Capítulo ${cap02} · ${t.capitulo_nome || ''}`;
    if (elBreadMateria) elBreadMateria.textContent = `${matCode} · ${t.titulo}`;

    // 2. Cabeçalho da Matéria
    const elBadge = document.getElementById('materiaNumBadge');
    const elTitle = document.getElementById('materiaPageTitle');
    const elSubtitle = document.getElementById('materiaPageSubtitle');
    if (elBadge) elBadge.textContent = `Matéria ${num02} · Capítulo ${cap02}`;
    if (elTitle) elTitle.textContent = t.titulo;
    if (elSubtitle) elSubtitle.textContent = t.subtitulo || t.fundamento || '';

    // 3. Artigo Didático (HTML completo pré-compilado das fontes oficiais)
    const elBody = document.getElementById('materiaBody');
    if (elBody) {
      elBody.innerHTML = t.html || `<p>${t.subtitulo || ''}</p>`;
    }

    // 4. Sidebar Técnica: Resumo, Aplicação e Menções
    const elFundamento = document.getElementById('materiaFundamento');
    const elDiretriz = document.getElementById('materiaDiretriz');
    const elMencoes = document.getElementById('materiaMencoes');

    if (elFundamento) elFundamento.textContent = t.fundamento || t.subtitulo || 'Diretriz da matriz curricular.';
    if (elDiretriz) elDiretriz.textContent = t.diretriz || 'Aplicação prática no canteiro narratológico.';
    if (elMencoes) {
      if (t.mencoes_html) {
        elMencoes.innerHTML = t.mencoes_html;
      } else if (t.livros && t.livros.length > 0) {
        elMencoes.innerHTML = t.livros.map(b => `
          <div class="mencao-card">
            <div class="mencao-info">
              <div class="mencao-title">"${b.obra}"</div>
              <div class="mencao-author">${b.autor}</div>
            </div>
          </div>
        `).join('');
      } else {
        elMencoes.innerHTML = '<p style="font-size:0.85rem; color:var(--tinta-suave);">Consulte as obras da Bibliografia do Canteiro.</p>';
      }
    }

    // 5. Botões de Navegação Anterior / Próximo no Rodapé
    const btnPrev = document.getElementById('materiaNavPrev');
    const titlePrev = document.getElementById('materiaNavPrevTitle');
    const btnNext = document.getElementById('materiaNavNext');
    const titleNext = document.getElementById('materiaNavNextTitle');

    if (btnPrev && titlePrev) {
      if (idx > 0) {
        const prevT = (window.MATERIAS_DB || window.TOPICOS_DB)[idx - 1];
        const prevCap02 = String(prevT.capitulo_num || 1).padStart(2, '0');
        const prevNum02 = String(prevT.numero).padStart(2, '0');
        btnPrev.style.visibility = 'visible';
        btnPrev.disabled = false;
        titlePrev.textContent = `C${prevCap02}M${prevNum02} · ${prevT.titulo}`;
      } else {
        btnPrev.style.visibility = 'hidden';
        btnPrev.disabled = true;
      }
    }

    if (btnNext && titleNext) {
      if (idx < (window.MATERIAS_DB || window.TOPICOS_DB).length - 1) {
        const nextT = (window.MATERIAS_DB || window.TOPICOS_DB)[idx + 1];
        const nextCap02 = String(nextT.capitulo_num || 1).padStart(2, '0');
        const nextNum02 = String(nextT.numero).padStart(2, '0');
        btnNext.style.visibility = 'visible';
        btnNext.disabled = false;
        titleNext.textContent = `C${nextCap02}M${nextNum02} · ${nextT.titulo}`;
      } else {
        btnNext.style.visibility = 'hidden';
        btnNext.disabled = true;
      }
    }

    // 6. Atualiza o estado do botão "Marcar como lida"
    atualizarEstadoLidoMateria(t.numero);

    // 7. Alterna a visualização no miolo: oculta a lista de capítulos e exibe a matéria
    const viewCaderno = document.getElementById('conteudo');
    const viewMateria = document.getElementById('viewMateria');
    if (viewCaderno) viewCaderno.hidden = true;
    if (viewMateria) {
      viewMateria.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 8. Destaque ativo no Sumário Lateral
    document.querySelectorAll('.sumario-topicos a[data-topico], .sumario-materias a[data-materia], .sumario a[data-materia]').forEach(a => {
      const num = Number(a.getAttribute('data-materia') || a.getAttribute('data-topico'));
      a.classList.toggle('topico-ativo', num === globalNum);
      a.classList.toggle('materia-ativa', num === globalNum);
    });

    // 9. Atualiza a URL sem recarregar a página
    try {
      history.replaceState(null, '', '#' + hashStr);
    } catch (e) {}
  };

  /**
   * Fecha a matéria didática e restaura a lista de capítulos do Caderno de Encargos.
   */
  window.fecharMateriaLeitura = function () {
    const viewCaderno = document.getElementById('conteudo');
    const viewMateria = document.getElementById('viewMateria');
    if (viewMateria) viewMateria.hidden = true;
    if (viewCaderno) viewCaderno.hidden = false;

    // Remove destaque do sumário
    document.querySelectorAll('.sumario-topicos a[data-topico], .sumario-materias a[data-materia], .sumario a[data-materia]').forEach(a => {
      a.classList.remove('topico-ativo');
      a.classList.remove('materia-ativa');
    });

    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (e) {}
  };

  /**
   * Navega para a matéria anterior ou seguinte.
   * @param {number} delta - (-1 para anterior, 1 para próximo)
   */
  window.navegarMateriaLeitura = function (delta) {
    const nextIdx = materiaAtivaIdx + delta;
    if (nextIdx >= 0 && nextIdx < (window.MATERIAS_DB || window.TOPICOS_DB).length) {
      window.abrirMateriaLeitura((window.MATERIAS_DB || window.TOPICOS_DB)[nextIdx].numero);
    }
  };

  /**
   * Alterna a marcação de lida da matéria ativa através do módulo progresso.js.
   */
  window.toggleMateriaLidaAtiva = function () {
    if (!(window.MATERIAS_DB || window.TOPICOS_DB) || materiaAtivaIdx < 0 || materiaAtivaIdx >= (window.MATERIAS_DB || window.TOPICOS_DB).length) return;
    const t = (window.MATERIAS_DB || window.TOPICOS_DB)[materiaAtivaIdx];
    const num = t.numero;

    if (window.NarratoProgresso && typeof window.NarratoProgresso.toggleTopico === 'function') {
      window.NarratoProgresso.toggleTopico(num);
    }
    atualizarEstadoLidoMateria(num);
  };

  /**
   * Atualiza visualmente o botão "Marcar como lida" na visão de matéria.
   */
  function atualizarEstadoLidoMateria(num) {
    const isLido = window.NarratoProgresso ? window.NarratoProgresso.isTopicoLido(num) : false;
    const btn = document.getElementById('materiaMarcarLidoBtn');
    const txt = document.getElementById('materiaMarcarLidoTexto');
    if (!btn || !txt) return;

    btn.setAttribute('aria-pressed', String(isLido));
    if (isLido) {
      btn.classList.add('lido');
      txt.textContent = 'Matéria lida';
    } else {
      btn.classList.remove('lido');
      txt.textContent = 'Marcar como lida';
    }
  }

  // Aliases de retrocompatibilidade
  window.abrirFullscreenTopico = window.abrirMateriaLeitura;
  window.fecharFullscreenTopico = window.fecharMateriaLeitura;
  window.navegarFullscreenTopico = window.navegarMateriaLeitura;
  window.abrirModalAssunto = window.abrirMateriaLeitura;
  window.fecharModalAssunto = window.fecharMateriaLeitura;
  window.navegarAssuntoModal = window.navegarMateriaLeitura;


  /* =========================================================================
     [@anchor: #03-modais-flutuantes] [Voltar: #top]
     MODAIS FLUTUANTES: FONTES (#F-{slug}), VOCABULÁRIO (#V-{slug}) E ONBOARDING
     ========================================================================= */

  window.abrirModalFonte = function (slug) {
    if (!window.FONTES_DB) return;
    const b = window.FONTES_DB[slug];
    if (!b) return;

    const elBread = document.getElementById('mFonteBreadcrumb');
    const elBadge = document.getElementById('mFonteCatBadge');
    const elAno = document.getElementById('mFonteAno');
    const elTitle = document.getElementById('mFonteTitle');
    const elAutor = document.getElementById('mFonteAutor');
    const elBuyBtn = document.getElementById('mFonteBuyBtn');
    const elImg = document.getElementById('mFonteCoverImg');
    const elDesc = document.getElementById('mFonteDesc');
    const elConsenso = document.getElementById('mFonteConsenso');
    const elDissenso = document.getElementById('mFonteDissenso');
    const elAssuntosList = document.getElementById('mFonteAssuntosList');
    const elTagsList = document.getElementById('mFonteTagsList');

    if (elBread) elBread.textContent = `${b.obra} • ${b.autor}`;
    if (elBadge) elBadge.textContent = (b.catNome || b.categoria || 'CADERNO').toUpperCase();
    if (elAno) elAno.textContent = b.ano || '';
    if (elTitle) elTitle.textContent = b.obra;
    if (elAutor) elAutor.textContent = b.autor;
    if (elBuyBtn) elBuyBtn.href = b.link || '#';

    if (elImg) {
      if (b.cover) {
        elImg.src = b.cover;
        elImg.style.display = 'block';
      } else {
        elImg.style.display = 'none';
      }
    }

    if (elDesc) elDesc.textContent = b.foco || b.sinopse || "Obra de fundamentação da matriz curricular do NarrATO.";
    if (elConsenso) elConsenso.textContent = b.consenso || "Adoção técnica rigorosa da anatomia dramática e recusa a clichês superficiais.";
    if (elDissenso) elDissenso.textContent = b.dissenso || "Tensionamento contra fórmulas mercadológicas pré-fabricadas.";

    if (elAssuntosList) {
      elAssuntosList.innerHTML = '';
      const citadosEm = b.mencionada_em || [1, 2, 3];
      citadosEm.forEach(num => {
        if (!(window.MATERIAS_DB || window.TOPICOS_DB)) return;
        const top = (window.MATERIAS_DB || window.TOPICOS_DB).find(t => t.numero === num);
        if (top) {
          const capN = top.capitulo_num;
          const assN = ((top.numero - 1) % 5) + 1;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'tag-chip';
          btn.textContent = `Matéria ${String(top.numero).padStart(2, '0')} (Cap. ${String(capN).padStart(2, '0')})`;
          btn.insertAdjacentHTML('beforeend', '<span class="icone-banco icone-banco--seta icone-banco--depois" aria-hidden="true"></span>');
          btn.onclick = () => window.abrirMateriaLeitura(num);
          elAssuntosList.appendChild(btn);
        }
      });
    }

    if (elTagsList) {
      elTagsList.innerHTML = '';
      (b.tags || ['narratologia', 'roteiro']).forEach(tg => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.textContent = tg;
        chip.insertAdjacentHTML('afterbegin', '<span class="icone-banco icone-banco--tags icone-banco--antes" aria-hidden="true"></span>');
        chip.onclick = () => window.abrirModalVerbete(tg);
        elTagsList.appendChild(chip);
      });
    }

    document.querySelectorAll('.modal-scaffold-backdrop').forEach(m => m.classList.remove('active'));
    const modalBackdrop = document.getElementById('modalFonteBackdrop');
    if (modalBackdrop) modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
      history.replaceState(null, '', '#F-' + slug);
    } catch (e) {}
  };

  window.fecharModalFonte = function (e) {
    if (e && e.target && e.target.closest && e.target.closest('.modal-scaffold-frame')) return;
    fecharTodosModais();
  };

  window.abrirModalVerbete = function (slug) {
    if (!window.VOCAB_DB) return;
    const v = window.VOCAB_DB[slug] || {
      slug: slug,
      termo: slug,
      dominioNome: "Canteiro",
      definicao: "Conceito estrutural da práxis do canteiro. Consulte as especificações do Caderno de Encargos para ver sua aplicação técnica.",
      tags: ["canteiro", "narrato"]
    };

    const elBread = document.getElementById('mVerbeteBreadcrumb');
    const elTitle = document.getElementById('mVerbeteTitle');
    const elBadge = document.getElementById('mVerbeteDominioBadge');
    const elDef = document.getElementById('mVerbeteDef');
    const elTags = document.getElementById('mVerbeteTagsList');

    if (elBread) elBread.textContent = `#${v.slug}`;
    if (elTitle) elTitle.textContent = `#${v.slug}`;
    if (elBadge) elBadge.textContent = (v.dominioNome || 'NARRATO').toUpperCase();
    if (elDef) elDef.textContent = v.definicao;

    if (elTags) {
      elTags.innerHTML = '';
      (v.tags || ['canteiro']).forEach(tg => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.textContent = tg;
        chip.insertAdjacentHTML('afterbegin', '<span class="icone-banco icone-banco--tags icone-banco--antes" aria-hidden="true"></span>');
        chip.onclick = () => window.abrirModalVerbete(tg);
        elTags.appendChild(chip);
      });
    }

    document.querySelectorAll('.modal-scaffold-backdrop').forEach(m => m.classList.remove('active'));
    const modalBackdrop = document.getElementById('modalVerbeteBackdrop');
    if (modalBackdrop) modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
      history.replaceState(null, '', '#V-' + slug);
    } catch (e) {}
  };

  window.fecharModalVerbete = function (e) {
    if (e && e.target && e.target.closest && e.target.closest('.modal-scaffold-frame')) return;
    fecharTodosModais();
  };

  window.abrirModalOnboarding = function () {
    document.querySelectorAll('.modal-scaffold-backdrop').forEach(m => m.classList.remove('active'));
    const modalBackdrop = document.getElementById('modalOnboardingBackdrop');
    if (modalBackdrop) modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    try {
      history.replaceState(null, '', '#entenda');
    } catch (e) {}
  };

  window.fecharModalOnboarding = function (e) {
    if (e && e.target && e.target.closest && e.target.closest('.modal-scaffold-frame')) return;
    fecharTodosModais();
  };

  // Intercepta clique no botão Entenda (?) quando estiver na página do Caderno
  document.addEventListener('click', function (e) {
    const btnAjuda = e.target.closest && e.target.closest('.header-ajuda');
    if (btnAjuda && document.getElementById('modalOnboardingBackdrop')) {
      e.preventDefault();
      window.abrirModalOnboarding();
    }
  });

  window.abrirModalProgresso = function () {
    fecharTodosModais();
    const cfg = document.querySelector('details.configuracoes');
    if (cfg) cfg.removeAttribute('open');

    const m = document.getElementById('modalProgressoBackdrop');
    if (!m) return;

    if (window.NarratoProgresso) {
      const topicosLidos = window.NarratoProgresso.getTopicosLidos ? window.NarratoProgresso.getTopicosLidos() : [];
      const capsLidos = window.NarratoProgresso.getCapitulosLidos ? window.NarratoProgresso.getCapitulosLidos() : [];
      const elMat = document.getElementById('modalProgressoMateriasCount');
      const elCap = document.getElementById('modalProgressoCapitulosCount');
      if (elMat) elMat.textContent = `${topicosLidos.length} / 50`;
      if (elCap) elCap.textContent = `${capsLidos.length} / 10`;
    }

    m.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.fecharModalProgresso = function (e) {
    if (e && e.target && e.target.closest && e.target.closest('.modal-scaffold-frame')) return;
    fecharTodosModais();
  };


  /* =========================================================================
     [@anchor: #04-roteamento-hash] [Voltar: #top]
     ROTEAMENTO DE DEEPLINKS VIA HASH NA URL
     ========================================================================= */

  function handleHashChange() {
    const hash = window.location.hash;
    const viewMateria = document.getElementById('viewMateria');

    if (!hash) {
      if (viewMateria && !viewMateria.hidden) {
        window.fecharMateriaLeitura();
      }
      fecharTodosModais();
      return;
    }

    // Matérias no padrão c01m46, c10m46 ou c01m01
    const mCM = hash.match(/^#c(\d{1,2})[mtMT](\d{1,2})$/i);
    if (mCM) {
      const c = parseInt(mCM[1], 10);
      const m = parseInt(mCM[2], 10);
      const globalNum = m > 5 ? m : (c - 1) * 5 + m;
      window.abrirMateriaLeitura(globalNum);
      return;
    }

    // Tópicos com código legado: #A01C01 -> Global Num
    const mAC = hash.match(/^#A(\d{2})C(\d{2})$/i);
    if (mAC) {
      const a = parseInt(mAC[1], 10);
      const c = parseInt(mAC[2], 10);
      const globalNum = (c - 1) * 5 + a;
      window.abrirMateriaLeitura(globalNum);
      return;
    }

    // Hash numérico ou direto: #m01, #t01, #1
    const mM = hash.match(/^#([mtMT])?(\d{1,2})$/);
    if (mM && parseInt(mM[2], 10) >= 1 && parseInt(mM[2], 10) <= 50) {
      window.abrirMateriaLeitura(parseInt(mM[2], 10));
      return;
    }

    // Fontes bibliográficas: #F-story-robert-mckee
    if (hash.startsWith('#F-') || hash.startsWith('#f-')) {
      window.abrirModalFonte(hash.substring(3));
      return;
    }

    // Verbetes do vocabulário: #V-operari
    if (hash.startsWith('#V-') || hash.startsWith('#v-')) {
      window.abrirModalVerbete(hash.substring(3));
      return;
    }

    // Onboarding
    if (hash === '#entenda' || hash === '#entenda-o-narrato' || hash === '#onboarding') {
      window.abrirModalOnboarding();
      return;
    }

    const cleanH = hash.replace('#', '').toLowerCase();

    // Roteamento para páginas de seção
    const secoes = { argamassa: 'argamassa/', bibliografia: 'fontes/', fontes: 'fontes/', vocab: 'vocab/', vocabulario: 'vocab/', glossario: 'vocab/', entenda: 'entenda/' };
    if (secoes[cleanH]) {
      location.replace(secoes[cleanH] + 'index.html');
      return;
    }

    // Introdução do capítulo via variável intro00 (#intro00, #intro00-cap-01, #intro-01)
    const mIntro = cleanH.match(/^intro(00)?(-cap)?-?(\d{1,2})?/);
    if (mIntro) {
      const capNum = parseInt(mIntro[3] || '1', 10);
      if (viewMateria && !viewMateria.hidden) {
        window.fecharMateriaLeitura();
      }
      if (window.NarratoProgresso && typeof window.NarratoProgresso.abrirCapitulo === 'function') {
        window.NarratoProgresso.abrirCapitulo(capNum);
      }
      const el = document.getElementById(`intro00-cap-${String(capNum).padStart(2, '0')}`) || document.getElementById(`capitulo-${String(capNum).padStart(2, '0')}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // #capitulo-03: abre e rola até o capítulo via progresso.js
    const mCap = cleanH.match(/^capitulo-(\d{1,2})/);
    if (mCap) {
      const capNum = parseInt(mCap[1], 10);
      if (viewMateria && !viewMateria.hidden) {
        window.fecharMateriaLeitura();
      }
      if (window.NarratoProgresso && typeof window.NarratoProgresso.abrirCapitulo === 'function') {
        window.NarratoProgresso.abrirCapitulo(capNum);
      }
      return;
    }

    if (window.FONTES_DB && window.FONTES_DB[cleanH]) {
      window.abrirModalFonte(cleanH);
      return;
    }

    if (window.VOCAB_DB && window.VOCAB_DB[cleanH]) {
      window.abrirModalVerbete(cleanH);
      return;
    }
  }

  window.addEventListener('hashchange', handleHashChange);


  /* =========================================================================
     [@anchor: #05-omni-search] [Voltar: #top]
     UNIVERSAL OMNI-SEARCH ENGINE (CLIENT-SIDE PESQUISA CENTRALIZADA)
     ========================================================================= */
  let currentOmniFilter = 'todos';

  window.handleOmniFocus = function () {
    const input = document.getElementById('omniSearchInput');
    if (input && input.value.trim().length > 0) {
      const dropdown = document.getElementById('omniDropdown');
      if (dropdown) dropdown.classList.add('active');
    }
  };

  window.closeOmniDropdown = function () {
    const dropdown = document.getElementById('omniDropdown');
    if (dropdown) dropdown.classList.remove('active');
  };

  window.clearOmniSearch = function () {
    const input = document.getElementById('omniSearchInput');
    const clearBtn = document.getElementById('omniClearBtn');
    if (input) {
      input.value = '';
      input.focus();
    }
    if (clearBtn) clearBtn.style.display = 'none';
    window.closeOmniDropdown();
  };

  window.setOmniFilter = function (filterType) {
    currentOmniFilter = filterType;
    document.querySelectorAll('.omni-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-filter') === filterType);
    });
    const input = document.getElementById('omniSearchInput');
    if (input) window.handleOmniSearch(input.value);
  };

  window.handleOmniSearch = function (query) {
    const q = (query || '').trim().toLowerCase();
    const clearBtn = document.getElementById('omniClearBtn');
    const dropdown = document.getElementById('omniDropdown');
    const resultsBody = document.getElementById('omniResultsBody');

    if (!dropdown || !resultsBody) return;

    if (!q) {
      if (clearBtn) clearBtn.style.display = 'none';
      window.closeOmniDropdown();
      return;
    }

    if (clearBtn) clearBtn.style.display = 'block';
    dropdown.classList.add('active');

    const index = window.OMNI_INDEX || [];
    const matches = index.filter(item => {
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const subMatch = (item.sub || '').toLowerCase().includes(q);
      const descMatch = (item.desc || '').toLowerCase().includes(q);
      const idMatch = (item.id || '').toLowerCase().includes(q);
      const kwMatch = typeof item.keywords === 'string' ? item.keywords.toLowerCase().includes(q) : false;
      return titleMatch || subMatch || descMatch || idMatch || kwMatch;
    });

    const totalMat = matches.filter(m => m.type === 'materia' || m.type === 'topico').length;
    const totalLiv = matches.filter(m => m.type === 'livro').length;
    const totalVer = matches.filter(m => m.type === 'verbete').length;

    const countTodos = document.getElementById('countTodos');
    const countTopicos = document.getElementById('countTopicos');
    const countMaterias = document.getElementById('countMaterias');
    const countLivros = document.getElementById('countLivros');
    const countVerbetes = document.getElementById('countVerbetes');
    if (countTodos) countTodos.innerText = matches.length;
    if (countTopicos) countTopicos.innerText = totalMat;
    if (countMaterias) countMaterias.innerText = totalMat;
    if (countLivros) countLivros.innerText = totalLiv;
    if (countVerbetes) countVerbetes.innerText = totalVer;

    let displayMatches = matches;
    if (currentOmniFilter !== 'todos') {
      displayMatches = matches.filter(m => m.type === currentOmniFilter || (currentOmniFilter === 'materia' && m.type === 'topico') || (currentOmniFilter === 'topico' && m.type === 'materia'));
    }

    if (displayMatches.length === 0) {
      resultsBody.innerHTML = `<div class="omni-empty">Nenhum tijolo ou termo encontrado para "${query}".</div>`;
      return;
    }

    let html = '';
    const topicosList = displayMatches.filter(m => m.type === 'materia' || m.type === 'topico');
    const livrosList = displayMatches.filter(m => m.type === 'livro');
    const verbetesList = displayMatches.filter(m => m.type === 'verbete');

    if (topicosList.length > 0 && (currentOmniFilter === 'todos' || currentOmniFilter === 'topico' || currentOmniFilter === 'materia')) {
      html += `<div class="omni-group-title"><span class="icone-banco icone-banco--materia icone-banco--antes" aria-hidden="true"></span>Matérias do Caderno (${topicosList.length})</div>`;
      topicosList.slice(0, 6).forEach(item => {
        const num = item.numero || (parseInt(item.id.replace(/[^0-9]/g, ''), 10) || 1);
        html += `
          <div class="omni-item" onclick="abrirMateriaLeitura(${num}); closeOmniDropdown();">
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
      html += `<div class="omni-group-title"><span class="icone-banco icone-banco--livro icone-banco--antes" aria-hidden="true"></span>Obras & Bibliografia (${livrosList.length})</div>`;
      livrosList.slice(0, 6).forEach(item => {
        html += `
          <div class="omni-item" onclick="abrirModalFonte('${item.slug}'); closeOmniDropdown();">
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
      html += `<div class="omni-group-title"><span class="icone-banco icone-banco--vocab icone-banco--antes" aria-hidden="true"></span>Vocabulário & Jargão (${verbetesList.length})</div>`;
      verbetesList.slice(0, 6).forEach(item => {
        const rawSlug = item.ancora || item.slug || (item.title.split('•')[0].replace('#', '').trim());
        html += `
          <div class="omni-item" onclick="abrirModalVerbete('${rawSlug}'); closeOmniDropdown();">
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
  };

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-omni-search]')) {
      window.closeOmniDropdown();
    }
  });


  /* =========================================================================
     [@anchor: #06-eventos-teclado] [Voltar: #top]
     ATALHOS GLOBAIS DE TECLADO (Esc, ←, →, Ctrl+K) E SUMÁRIO SPA
     ========================================================================= */

  // Intercepta cliques nos links do Sumário Lateral para abrir no miolo (SPA)
  document.addEventListener('click', function (e) {
    const link = e.target.closest('.sumario-topicos a[data-topico]');
    if (link && document.getElementById('viewMateria')) {
      e.preventDefault();
      const num = parseInt(link.getAttribute('data-topico'), 10);
      if (!isNaN(num) && num > 0) {
        window.abrirMateriaLeitura(num);
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    const viewMateria = document.getElementById('viewMateria');
    const isMateriaActive = viewMateria && !viewMateria.hidden;
    const activeModal = document.querySelector('.modal-scaffold-backdrop.active');
    const omniDropdown = document.getElementById('omniDropdown');

    // Ctrl+K / Cmd+K para abrir campo de busca
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const inp = document.getElementById('omniSearchInput');
      if (inp) {
        inp.focus();
        inp.select();
      }
      return;
    }

    // Tecla Escape: fecha modal ou volta da matéria para os capítulos
    if (e.key === 'Escape') {
      if (omniDropdown && omniDropdown.classList.contains('active')) {
        window.closeOmniDropdown();
      } else if (activeModal) {
        fecharTodosModais();
      } else if (isMateriaActive) {
        window.fecharMateriaLeitura();
      } else {
        const inp = document.getElementById('omniSearchInput');
        if (inp && document.activeElement === inp) inp.blur();
      }
      return;
    }

    // Setas esquerda / direita: navegação sequencial entre matérias
    if (isMateriaActive && !activeModal) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        window.navegarMateriaLeitura(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        window.navegarMateriaLeitura(1);
      }
    }
  });


  /* =========================================================================
     [@anchor: #07-inicializacao] [Voltar: #top]
     BOOTSTRAP DA PÁGINA
     ========================================================================= */

  document.addEventListener('DOMContentLoaded', function () {
    handleHashChange();

    // Scroll chaining contínuo e suave entre o sumário lateral e o restante da página
    const sumarioEl = document.getElementById('sumario');
    if (sumarioEl) {
      sumarioEl.addEventListener('wheel', function (e) {
        const delta = e.deltaY;
        const atTop = sumarioEl.scrollTop <= 0;
        const atBottom = sumarioEl.scrollTop + sumarioEl.clientHeight >= sumarioEl.scrollHeight - 1;

        if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
          window.scrollBy({
            top: delta,
            behavior: 'smooth'
          });
        }
      }, { passive: true });
    }

    // Recupera preferência de recolhimento do sumário (Modo Foco)
    try {
      if (localStorage.getItem('narrato_sumario_recolhido') === '1' && window.innerWidth > 1024) {
        window.toggleSumarioDesktop();
      }
    } catch(e) {}
  });

  window.toggleSumarioDesktop = function () {
    const container = document.querySelector('.com-sumario');
    const btn = document.getElementById('btnRecolherSumario');
    if (!container) return;
    const recolhido = container.classList.toggle('sumario-recolhido');
    if (btn) {
      const seta = btn.querySelector('.icone-banco');
      if (seta) seta.classList.toggle('icone-banco--voltar', !recolhido);
      btn.title = recolhido ? 'Expandir Sumário' : 'Recolher Sumário (Modo Foco)';
    }
    try {
      localStorage.setItem('narrato_sumario_recolhido', recolhido ? '1' : '0');
    } catch (e) {}
  };

})();
