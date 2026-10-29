/**
 * =============================================================================
 * NarrATO • Módulo Oficial de Estado, Progresso e Persistência (progresso.js)
 * -----------------------------------------------------------------------------
 * Fonte única da verdade para retenção de leitura e estados do canteiro didático.
 * 
 * ÍNDICE DE SEÇÕES:
 * 1. [ARMAZENAMENTO RESILIENTE] ................... #storage-resiliente
 * 2. [MODELO DE DADOS & LÓGICA BIDIRECIONAL] ..... #modelo-dados
 * 3. [ATUALIZAÇÃO DE INTERFACE (DOM)] ............. #atualizacao-ui
 * 4. [EXPORTAÇÃO, IMPORTAÇÃO & RESET] ............. #backup-dados
 * 5. [DELEGAÇÃO DE EVENTOS & INICIALIZAÇÃO] ....... #eventos-inits
 * =============================================================================
 */

(function (window, document) {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. ARMAZENAMENTO RESILIENTE (#storage-resiliente)
  // ---------------------------------------------------------------------------
  var KEY_TOPICOS = 'narrato_read_topicos';
  var KEY_CAPS_LIDOS = 'narrato_capitulos_lidos';
  var KEY_CAPS_ABERTOS = 'narrato_capitulos_abertos';

  var memoriaFallback = {};

  function safeGet(key, fallback) {
    try {
      var item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : fallback;
    } catch (e) {
      return memoriaFallback[key] !== undefined ? memoriaFallback[key] : fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      memoriaFallback[key] = value;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete memoriaFallback[key];
    }
  }

  // ---------------------------------------------------------------------------
  // 2. MODELO DE DADOS & LÓGICA BIDIRECIONAL (#modelo-dados)
  // ---------------------------------------------------------------------------
  function getTopicosLidos() {
    var raw = safeGet(KEY_TOPICOS, []);
    return Array.isArray(raw) ? raw.map(Number).filter(function (n) { return !isNaN(n) && n > 0; }) : [];
  }

  function getCapitulosLidos() {
    var raw = safeGet(KEY_CAPS_LIDOS, []);
    return Array.isArray(raw) ? raw.map(Number).filter(function (n) { return !isNaN(n) && n > 0; }) : [];
  }

  function getCapitulosAbertos() {
    var raw = safeGet(KEY_CAPS_ABERTOS, []);
    return Array.isArray(raw) ? raw.map(Number).filter(function (n) { return !isNaN(n) && n > 0; }) : [];
  }

  function topicosDoCapitulo(capNum) {
    var inicio = (capNum - 1) * 5 + 1;
    return [inicio, inicio + 1, inicio + 2, inicio + 3, inicio + 4];
  }

  function capituloDoTopico(topicoNum) {
    return Math.ceil(topicoNum / 5);
  }

  function isTopicoLido(num) {
    return getTopicosLidos().indexOf(Number(num)) > -1;
  }

  function isCapituloLido(num) {
    return getCapitulosLidos().indexOf(Number(num)) > -1;
  }

  function isCapituloAberto(num) {
    return getCapitulosAbertos().indexOf(Number(num)) > -1;
  }

  /**
   * Alterna a leitura de um tópico individual com sincronia bidirecional:
   * Se os 5 tópicos do capítulo ficarem lidos, o capítulo é marcado automaticamente.
   * Se qualquer um dos 5 for desmarcado, o capítulo é desmarcado.
   */
  function toggleTopico(topicoNum) {
    var num = Number(topicoNum);
    if (isNaN(num) || num < 1 || num > 50) return;

    var topicos = getTopicosLidos();
    var idx = topicos.indexOf(num);
    var adicionou = false;

    if (idx > -1) {
      topicos.splice(idx, 1);
    } else {
      topicos.push(num);
      adicionou = true;
    }
    safeSet(KEY_TOPICOS, topicos);

    // Sincronia bidirecional com o capítulo
    var cap = capituloDoTopico(num);
    var capTopicos = topicosDoCapitulo(cap);
    var todosLidos = capTopicos.every(function (t) { return topicos.indexOf(t) > -1; });
    var capsLidos = getCapitulosLidos();
    var capIdx = capsLidos.indexOf(cap);

    if (todosLidos && capIdx === -1) {
      capsLidos.push(cap);
      safeSet(KEY_CAPS_LIDOS, capsLidos);
    } else if (!todosLidos && capIdx > -1) {
      capsLidos.splice(capIdx, 1);
      safeSet(KEY_CAPS_LIDOS, capsLidos);
    }

    atualizarTudo();
    return adicionou;
  }

  /**
   * Alterna a leitura de um capítulo inteiro:
   * Marcar o capítulo marca todos os seus 5 tópicos de uma vez.
   * Desmarcar o capítulo desmarca todos os seus 5 tópicos.
   */
  function toggleCapituloLido(capNum) {
    var cap = Number(capNum);
    if (isNaN(cap) || cap < 1 || cap > 10) return;

    var capsLidos = getCapitulosLidos();
    var topicos = getTopicosLidos();
    var capTopicos = topicosDoCapitulo(cap);
    var capIdx = capsLidos.indexOf(cap);

    if (capIdx > -1) {
      // Desmarca o capítulo e remove todos os seus tópicos
      capsLidos.splice(capIdx, 1);
      topicos = topicos.filter(function (t) { return capTopicos.indexOf(t) === -1; });
    } else {
      // Marca o capítulo e adiciona todos os seus tópicos
      capsLidos.push(cap);
      capTopicos.forEach(function (t) {
        if (topicos.indexOf(t) === -1) topicos.push(t);
      });
    }

    safeSet(KEY_CAPS_LIDOS, capsLidos);
    safeSet(KEY_TOPICOS, topicos);
    atualizarTudo();
  }

  /**
   * Alterna expansão/recolhimento de um capítulo na home.
   */
  function toggleCapituloAberto(capNum) {
    var cap = Number(capNum);
    if (isNaN(cap)) return;

    var abertos = getCapitulosAbertos();
    var idx = abertos.indexOf(cap);
    if (idx > -1) {
      abertos.splice(idx, 1);
    } else {
      abertos.push(cap);
    }
    safeSet(KEY_CAPS_ABERTOS, abertos);
    atualizarAccordionCapitulos();
  }

  function abrirCapitulo(capNum) {
    var cap = Number(capNum);
    var abertos = getCapitulosAbertos();
    if (abertos.indexOf(cap) === -1) {
      abertos.push(cap);
      safeSet(KEY_CAPS_ABERTOS, abertos);
    }
    atualizarAccordionCapitulos();
    var el = document.getElementById('capitulo-' + String(cap).padStart(2, '0'));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------------------------------------------------------------------------
  // 3. ATUALIZAÇÃO DE INTERFACE (DOM) (#atualizacao-ui)
  // ---------------------------------------------------------------------------
  function atualizarModalProgresso() {
    var topicosLidos = getTopicosLidos();
    var capsLidos = getCapitulosLidos();
    var elMat = document.getElementById('modalProgressoMateriasCount');
    var elCap = document.getElementById('modalProgressoCapitulosCount');
    if (elMat) elMat.textContent = topicosLidos.length + ' / 50';
    if (elCap) elCap.textContent = capsLidos.length + ' / 10';
  }

  function atualizarTudo() {
    atualizarSumarioLateral();
    atualizarCardsHome();
    atualizarBotoesLidoGerais();
    atualizarAccordionCapitulos();
    atualizarModalProgresso();
  }

  window.abrirModalProgresso = function () {
    var cfg = document.querySelector('details.configuracoes');
    if (cfg) cfg.removeAttribute('open');
    var m = document.getElementById('modalProgressoBackdrop');
    if (!m) return;
    atualizarModalProgresso();
    m.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.fecharModalProgresso = function (e) {
    if (e && e.target && e.target.closest && e.target.closest('.modal-scaffold-frame')) return;
    var m = document.getElementById('modalProgressoBackdrop');
    if (m) m.classList.remove('active');
    document.body.style.overflow = '';
  };

  function atualizarSumarioLateral() {
    var capsLidos = getCapitulosLidos();
    var topicos = getTopicosLidos();
    var totalCaps = 10;
    var concluidos = capsLidos.length;

    // Rótulo principal "0 de 10" no topo do sumário
    var rotulos = document.querySelectorAll('[data-progresso-capitulos-rotulo], [data-sumario-abrir-rotulo]');
    rotulos.forEach(function (el) {
      el.textContent = concluidos + ' de ' + totalCaps;
    });

    // Subtítulo do progresso
    var textoProgresso = document.querySelector('[data-progresso-texto]');
    if (textoProgresso) {
      textoProgresso.textContent = concluidos + ' de ' + totalCaps + ' capítulos concluídos';
    }

    // Barra de trilho do sumário (0% a 100%, 10% por capítulo)
    var trilho = document.querySelector('[data-progresso-barra]');
    if (trilho) {
      trilho.style.width = Math.round((concluidos / totalCaps) * 100) + '%';
    }

    // Atualiza links e contagens internas de cada capítulo no sumário
    document.querySelectorAll('.sumario-cap[data-cap]').forEach(function (capEl) {
      var cap = Number(capEl.getAttribute('data-cap'));
      var capTopicos = topicosDoCapitulo(cap);
      var feitos = capTopicos.filter(function (t) { return topicos.indexOf(t) > -1; }).length;

      var contaEl = capEl.querySelector('[data-conta-cap]');
      if (contaEl) {
        contaEl.textContent = feitos + '/5';
      }
      capEl.classList.toggle('completo', feitos === 5);

      // Marca individualmente os links dos tópicos dentro do sumário
      capEl.querySelectorAll('[data-topico]').forEach(function (linkEl) {
        var tNum = Number(linkEl.getAttribute('data-topico'));
        linkEl.classList.toggle('lido', topicos.indexOf(tNum) > -1);
      });
    });
  }

  function atualizarCardsHome() {
    var topicos = getTopicosLidos();
    var capsLidos = getCapitulosLidos();

    // Atualiza caixas de seleção de capítulo na faixa do Caderno
    document.querySelectorAll('.btn-cap-read[data-cap]').forEach(function (btn) {
      var cap = Number(btn.getAttribute('data-cap'));
      var lido = capsLidos.indexOf(cap) > -1;
      btn.setAttribute('aria-pressed', String(lido));
      btn.classList.toggle('read-active', lido);
    });

    // Atualiza cartões de tópicos na home
    document.querySelectorAll('.materia-card[data-global-num], .topic-card[data-global-num]').forEach(function (card) {
      var num = Number(card.getAttribute('data-global-num'));
      var lido = topicos.indexOf(num) > -1;
      card.classList.toggle('materia-lida', lido);
      card.classList.toggle('topic-lido', lido);
      var ind = card.querySelector('.materia-check-indicator, .topic-check-indicator');
      if (ind) ind.classList.toggle('checked', lido);
    });
  }

  function atualizarAccordionCapitulos() {
    var abertos = getCapitulosAbertos();
    document.querySelectorAll('.chapter-block[data-cap]').forEach(function (block) {
      var cap = Number(block.getAttribute('data-cap'));
      var aberto = abertos.indexOf(cap) > -1;
      var body = document.getElementById('cap-body-' + cap);
      var toggleBtn = block.querySelector('.btn-cap-toggle');

      if (body) body.hidden = !aberto;
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', String(aberto));
        toggleBtn.setAttribute('aria-label', (aberto ? 'Recolher' : 'Abrir') + ' capítulo ' + cap);
      }
      block.classList.toggle('capitulo-aberto', aberto);
    });
  }

  function atualizarBotoesLidoGerais() {
    var topicos = getTopicosLidos();
    document.querySelectorAll('[data-marcar-lido]').forEach(function (btn) {
      var num = Number(btn.getAttribute('data-marcar-lido'));
      var lido = topicos.indexOf(num) > -1;
      btn.setAttribute('aria-pressed', String(lido));
      btn.classList.toggle('read-active', lido);
      var txt = btn.querySelector('[data-marcar-texto]');
      if (txt) {
        txt.textContent = lido ? 'Matéria lida' : 'Marcar como lida';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 4. EXPORTAÇÃO, IMPORTAÇÃO & RESET (#backup-dados)
  // ---------------------------------------------------------------------------
  function exportarProgresso() {
    var dados = {
      sistema: 'NarrATOsys',
      versao: '1.0',
      exportado_em: new Date().toISOString(),
      narrato_read_topicos: getTopicosLidos(),
      narrato_capitulos_lidos: getCapitulosLidos(),
      narrato_capitulos_abertos: getCapitulosAbertos(),
      narrato_tema: localStorage.getItem('narrato-tema') || 'escuro',
      narrato_font: localStorage.getItem('narrato-font') || 'dislexica',
      narrato_font_size: localStorage.getItem('narrato-font-size') || '100',
      narrato_acessibilidade_aberta: localStorage.getItem('narrato-acessibilidade-aberta') || '0',
      narrato_sumario_recolhido: localStorage.getItem('narrato_sumario_recolhido') || '0'
    };

    var blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var dataStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = 'narrato-progresso-' + dataStr + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importarProgresso(jsonTexto) {
    try {
      var dados = JSON.parse(jsonTexto);
      if (!dados || typeof dados !== 'object') throw new Error('Arquivo inválido.');

      if (Array.isArray(dados.narrato_read_topicos)) {
        safeSet(KEY_TOPICOS, dados.narrato_read_topicos);
      }
      if (Array.isArray(dados.narrato_capitulos_lidos)) {
        safeSet(KEY_CAPS_LIDOS, dados.narrato_capitulos_lidos);
      }
      if (Array.isArray(dados.narrato_capitulos_abertos)) {
        safeSet(KEY_CAPS_ABERTOS, dados.narrato_capitulos_abertos);
      }
      if (dados.narrato_tema) {
        localStorage.setItem('narrato-tema', dados.narrato_tema);
        document.documentElement.setAttribute('data-theme', dados.narrato_tema);
      }
      if (dados.narrato_font) {
        localStorage.setItem('narrato-font', dados.narrato_font);
        if (dados.narrato_font === 'pesada') {
          document.documentElement.setAttribute('data-font', 'pesada');
        } else {
          document.documentElement.removeAttribute('data-font');
        }
      }
      if (dados.narrato_font_size) {
        localStorage.setItem('narrato-font-size', String(dados.narrato_font_size));
        document.documentElement.style.fontSize = dados.narrato_font_size + '%';
      }
      if (dados.narrato_acessibilidade_aberta !== undefined) {
        localStorage.setItem('narrato-acessibilidade-aberta', String(dados.narrato_acessibilidade_aberta));
        if (typeof window.toggleBarraAcessibilidade === 'function') {
          window.toggleBarraAcessibilidade(dados.narrato_acessibilidade_aberta === '1');
        }
      }
      if (dados.narrato_sumario_recolhido !== undefined) {
        localStorage.setItem('narrato_sumario_recolhido', String(dados.narrato_sumario_recolhido));
      }

      if (typeof window.sincronizarBotoesTema === 'function') {
        window.sincronizarBotoesTema();
      }

      atualizarTudo();
      alert('Progresso e preferências restaurados com sucesso!');
    } catch (err) {
      alert('Erro ao importar arquivo: ' + err.message);
    }
  }

  function resetarProgresso() {
    var confirma = window.confirm('Deseja realmente resetar todo o seu progresso de leitura no NarrATO?');
    if (!confirma) return;

    safeRemove(KEY_TOPICOS);
    safeRemove(KEY_CAPS_LIDOS);
    safeRemove(KEY_CAPS_ABERTOS);
    atualizarTudo();
    alert('Progresso resetado com sucesso.');
  }

  // ---------------------------------------------------------------------------
  // 5. DELEGAÇÃO DE EVENTOS & INICIALIZAÇÃO (#eventos-inits)
  // ---------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    var alvo = e.target.closest ? e.target : null;
    if (!alvo) return;

    // Botão de marcar matéria como lida (no cartão, no fullscreen ou na página isolada)
    var btnLido = alvo.closest('[data-marcar-lido]');
    if (btnLido) {
      e.preventDefault();
      e.stopPropagation();
      var num = Number(btnLido.getAttribute('data-marcar-lido'));
      toggleTopico(num);
      return;
    }

    // Botão de marcar capítulo como lido (na faixa do capítulo)
    var btnCapRead = alvo.closest('.btn-cap-read[data-cap]');
    if (btnCapRead) {
      e.preventDefault();
      e.stopPropagation();
      var cap = Number(btnCapRead.getAttribute('data-cap'));
      toggleCapituloLido(cap);
      return;
    }

    // Botão toggle do acordeão do capítulo
    var btnCapToggle = alvo.closest('.btn-cap-toggle[data-cap]');
    if (btnCapToggle) {
      e.preventDefault();
      e.stopPropagation();
      var capNum = Number(btnCapToggle.getAttribute('data-cap'));
      toggleCapituloAberto(capNum);
      return;
    }

    // Clique na barra/faixa do capítulo inteira (exceto no botão de lido)
    var faixa = alvo.closest('.chapter-block .faixa');
    if (faixa && !alvo.closest('.btn-cap-read') && !alvo.closest('a')) {
      e.preventDefault();
      var capBloco = faixa.closest('.chapter-block[data-cap]');
      if (capBloco) {
        var c = Number(capBloco.getAttribute('data-cap'));
        toggleCapituloAberto(c);
      }
      return;
    }

    // Botões de Ação de Backup e Reset
    if (alvo.closest('[data-exportar-progresso]')) {
      e.preventDefault();
      exportarProgresso();
      return;
    }
    if (alvo.closest('[data-importar-progresso]')) {
      e.preventDefault();
      var inp = document.getElementById('inputImportarBackup');
      if (inp) inp.click();
      return;
    }
    if (alvo.closest('[data-resetar-progresso]')) {
      e.preventDefault();
      resetarProgresso();
      return;
    }
  });

  // Listener para upload de arquivo JSON de backup
  document.addEventListener('DOMContentLoaded', function () {
    var inp = document.getElementById('inputImportarBackup');
    if (inp) {
      inp.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (evt) {
          importarProgresso(evt.target.result);
          inp.value = '';
        };
        reader.readAsText(file);
      });
    }

    atualizarTudo();
  });

  // Interface Pública Global
  window.NarratoProgresso = {
    getMateriasLidas: getTopicosLidos,
    getTopicosLidos: getTopicosLidos,
    getCapitulosLidos: getCapitulosLidos,
    getCapitulosAbertos: getCapitulosAbertos,
    isMateriaLida: isTopicoLido,
    isTopicoLido: isTopicoLido,
    isCapituloLido: isCapituloLido,
    isCapituloAberto: isCapituloAberto,
    toggleMateria: toggleTopico,
    toggleTopico: toggleTopico,
    toggleCapituloLido: toggleCapituloLido,
    toggleCapituloAberto: toggleCapituloAberto,
    abrirCapitulo: abrirCapitulo,
    atualizarTudo: atualizarTudo,
    exportarProgresso: exportarProgresso,
    importarProgresso: importarProgresso,
    resetarProgresso: resetarProgresso
  };

})(window, document);
