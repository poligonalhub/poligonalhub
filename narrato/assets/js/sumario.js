/**
 * =============================================================================
 * NarrATO • Sumário do Caderno (sumario.js)
 * -----------------------------------------------------------------------------
 * Controla a navegação lateral, capítulo ativo no scroll e gaveta mobile.
 * O estado de leitura e progresso é gerenciado pelo módulo oficial progresso.js.
 * =============================================================================
 */

(function (window, document) {
  'use strict';

  var html = document.documentElement;

  function atualizarSumario() {
    if (window.NarratoProgresso && typeof window.NarratoProgresso.atualizarTudo === 'function') {
      window.NarratoProgresso.atualizarTudo();
    }
  }
  window.atualizarSumario = atualizarSumario;

  // Capítulo atual: abre o grupo dele no sumário e dá nome à barra do mobile.
  function marcarCapitulo(num) {
    document.querySelectorAll('.sumario-cap').forEach(function (cap) {
      var atual = Number(cap.getAttribute('data-cap')) === num;
      cap.classList.toggle('aberto', atual);
      var link = cap.querySelector('.sumario-cap-link');
      if (link) {
        if (atual) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
      if (atual) {
        var rotulo = document.querySelector('[data-cap-atual-rotulo]');
        var nomeEl = cap.querySelector('.sumario-cap-nome');
        if (rotulo && nomeEl) {
          rotulo.textContent = 'Cap. ' + String(num).padStart(2, '0') + ' · ' + nomeEl.textContent;
        }
      }
    });
  }

  function acompanharLeitura() {
    var fixo = document.body.getAttribute('data-cap-atual');
    if (fixo) {
      marcarCapitulo(Number(fixo));
      return;
    }
    var blocos = document.querySelectorAll('.chapter-block[data-cap]');
    if (!blocos.length) return;

    var agendado = false;
    var ultimo = 0;
    var cabecalho = document.querySelector('.narrato-header');
    var barraMovel = document.querySelector('.sumario-barra-movel');

    function medir() {
      agendado = false;
      var topo = cabecalho ? cabecalho.getBoundingClientRect().bottom : 0;
      if (barraMovel && barraMovel.offsetHeight) {
        topo = Math.max(topo, barraMovel.getBoundingClientRect().bottom);
      }
      var linha = topo + 96;
      var atual = 1;
      blocos.forEach(function (b) {
        if (b.getBoundingClientRect().top <= linha) {
          atual = Number(b.getAttribute('data-cap'));
        }
      });
      if (atual !== ultimo) {
        ultimo = atual;
        marcarCapitulo(atual);
      }
    }

    window.addEventListener('scroll', function () {
      if (!agendado) {
        agendado = true;
        requestAnimationFrame(medir);
      }
    }, { passive: true });
    medir();
  }

  function abrirGaveta(aberta) {
    html.classList.toggle('sumario-aberto', aberta);
    var botao = document.querySelector('[data-sumario-abrir]');
    if (botao) botao.setAttribute('aria-expanded', String(aberta));
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    if (e.target.closest('[data-sumario-abrir]')) {
      abrirGaveta(!html.classList.contains('sumario-aberto'));
    } else if (e.target.closest('[data-sumario-fechar]') || e.target.closest('.sumario a')) {
      abrirGaveta(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') abrirGaveta(false);
  });

  function iniciar() {
    atualizarSumario();
    acompanharLeitura();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

})(window, document);
