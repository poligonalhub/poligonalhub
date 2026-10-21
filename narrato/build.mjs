/* =========================================================
   NarrATO — Build do livro digital
   ---------------------------------------------------------
   Fonte única: Argamassa.md, na raiz do repositório.
   Saída: um HTML autocontido, com CSS, fontes e imagens
   embutidos, que abre sem servidor e se compartilha como
   arquivo único.
   ========================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const DIST = path.join(AQUI, 'dist');

/* ---------- Configuração da amostra ---------- */
const CAPITULO_ALVO = 'Capítulo 1';
const FONTES = [
  { arquivo: 'OpenDyslexic-Regular.otf', peso: 400 },
  { arquivo: 'OpenDyslexic-Bold.otf', peso: 700 },
];
const PASTA_FONTES = path.join(
  process.env.LOCALAPPDATA || '',
  'Microsoft', 'Windows', 'Fonts'
);
const IMAGEM_DEMO = 'D:/POLIGONAL/Produção/Projetos/ESCRITA/NARRATO/PROJETO/Brand/1x/Nto_Martelo_Icon.png';

/* ---------- Utilidades ---------- */

// Slug em ASCII puro, minúsculas, sem acento e sem emoji.
function slug(texto) {
  return texto
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function base64(arquivo) {
  return fs.readFileSync(arquivo).toString('base64');
}

/* ---------- 1. Extrair o capítulo da fonte única ---------- */

function extrairCapitulo(markdown, alvo) {
  const linhas = markdown.split(/\r?\n/);
  const inicio = linhas.findIndex(l => /^### /.test(l) && l.includes(alvo));
  if (inicio === -1) throw new Error(`Capítulo não encontrado: ${alvo}`);

  let fim = linhas.length;
  for (let i = inicio + 1; i < linhas.length; i++) {
    if (/^#{1,3} /.test(linhas[i])) { fim = i; break; }
  }

  return linhas
    .slice(inicio, fim)
    // remove o rodapé de retorno ao sumário do documento monolítico
    .filter(l => !/^\[Sumário/.test(l.trim()))
    .join('\n')
    .replace(/\n---\s*\n\s*$/, '\n')
    .trim();
}

/* ---------- 1b. Normalizar parágrafos ----------
   No Argamassa cada parágrafo ocupa uma linha, sem linha em
   branco entre eles. O Markdown padrão funde linhas vizinhas
   num único bloco, e o resultado é um paredão de texto que
   contraria a regra de 4 a 5 linhas por parágrafo da direção
   de arte. Esta normalização separa o que a fonte já tratava
   como parágrafos distintos.

   É correção de leitura, não de conteúdo: o arquivo de origem
   permanece intacto. A correção definitiva é na fonte. */

function normalizarParagrafos(md) {
  const especial = l => l.trim() === '' || /^(#{1,6} |[-*+] |\d+\. |> |\||---|```|<)/.test(l.trim());
  const linhas = md.split('\n');
  const saida = [];
  let emBloco = false;

  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    if (/^```/.test(l.trim())) emBloco = !emBloco;
    const anterior = saida[saida.length - 1];
    if (!emBloco && anterior !== undefined && !especial(l) && !especial(anterior)) {
      saida.push('');
    }
    saida.push(l);
  }
  return saida.join('\n');
}

/* ---------- 1c. Higiene de glifos ----------
   A OpenDyslexic não cobre o marcador U+2022, que sai como
   caixa vazia no PDF. Travessão está no conjunto e cumpre o
   mesmo papel de separador em título. */

function higienizarGlifos(md) {
  return md.replace(/^(#{1,6} .*)$/gm, t => t.replace(/\s+•\s+/g, ' — '));
}

/* ---------- 2. Promover a hierarquia de títulos ----------
   No Argamassa o capítulo é h3. Numa página própria ele
   precisa ser h1, para que a árvore semântica do HTML e a
   marcação do PDF fiquem corretas. */

function promoverTitulos(md) {
  return md.replace(/^(#{3,6}) /gm, (_, sustenidos) =>
    '#'.repeat(Math.max(1, sustenidos.length - 2)) + ' '
  );
}

/* ---------- 3. Renderizar ---------- */

const md = new MarkdownIt({ html: true, typographer: false, breaks: false });

// Âncora estável em cada título, e coleta para o sumário.
function comAncoras(html) {
  const indice = [];
  const saida = html.replace(
    /<h([1-3])>([\s\S]*?)<\/h\1>/g,
    (todo, nivel, interno) => {
      const texto = interno.replace(/<[^>]+>/g, '').trim();
      const id = slug(texto);
      if (nivel !== '1') indice.push({ nivel: Number(nivel), texto, id });
      return `<h${nivel} id="${id}">${interno}</h${nivel}>`;
    }
  );
  return { html: saida, indice };
}

/* ---------- Movimentos do capítulo ----------
   Consenso e Dissenso são os dois tempos da curadoria
   dialética. Cada um vira uma seção própria, com sinal
   desenhado e filete distinto, para que a diferença não
   dependa de cor. O rótulo escrito é o próprio título já
   existente no texto: nada de palavra inventada aqui. */

const MOVIMENTOS = ['consenso', 'dissenso'];

function agruparMovimentos(html) {
  for (const nome of MOVIMENTOS) {
    const abre = new RegExp(`<h2 id="${nome}">([\\s\\S]*?)</h2>`);
    const encontrado = html.match(abre);
    if (!encontrado) continue;

    const inicio = encontrado.index;
    const depoisDoTitulo = inicio + encontrado[0].length;

    // A seção vai até o próximo h2 ou até o fim do capítulo.
    const resto = html.slice(depoisDoTitulo);
    const proximo = resto.search(/<h2[ >]/);
    const fim = proximo === -1 ? html.length : depoisDoTitulo + proximo;

    const corpo = html.slice(depoisDoTitulo, fim);
    const sinal = '<span class="sinal" aria-hidden="true"><i></i><i></i></span>';

    const secao =
      `<section class="movimento movimento--${nome}" aria-labelledby="${nome}">\n` +
      `  <div class="abertura">${sinal}${encontrado[0]}</div>\n` +
      `  <div class="corpo">${corpo}</div>\n` +
      `</section>\n`;

    html = html.slice(0, inicio) + secao + html.slice(fim);
  }
  return html;
}

/* ---------- Menu lateral ---------- */

function montarNavegacao(indice) {
  if (!indice.length) return '';
  const itens = indice.map(i =>
    `      <li class="nivel-${i.nivel}"><a href="#${i.id}">${i.texto}</a></li>`
  ).join('\n');
  return [
    '<aside class="navegacao">',
    '  <nav aria-label="Tópicos do capítulo">',
    '    <h2>Neste capítulo</h2>',
    '    <ol>',
    itens,
    '    </ol>',
    '  </nav>',
    '</aside>',
  ].join('\n');
}

/* ---------- Marcador de progresso ----------
   Posição indicada por preenchimento, altura e rótulo escrito.
   Nunca só por cor. */

function montarProgresso(atual, total) {
  const etapas = Array.from({ length: total }, (_, i) => {
    const n = i + 1;
    const estado = n < atual ? 'concluida' : n === atual ? 'atual' : 'pendente';
    return `<span class="etapa" data-estado="${estado}"></span>`;
  }).join('');
  return `<div class="progresso">
      <span class="trilho" role="img" aria-label="Capítulo ${atual} de ${total}">${etapas}</span>
      <span class="contagem">Capítulo ${atual} de ${total}</span>
    </div>`;
}

function montarSumario(indice) {
  if (!indice.length) return '';
  const itens = indice.map(i =>
    `      <li class="nivel-${i.nivel}"><a href="#${i.id}">${i.texto}</a></li>`
  ).join('\n');
  return [
    '  <nav class="sumario" aria-labelledby="titulo-sumario">',
    '    <h2 id="titulo-sumario">Neste capítulo</h2>',
    '    <ol>',
    itens,
    '    </ol>',
    '  </nav>',
  ].join('\n');
}

/* ---------- 4. Demonstração de componentes ----------
   O Capítulo 1 não contém as três caixas nem figura.
   Este bloco existe para que o protótipo valide esses
   componentes na conversão em PDF. É andaime, não conteúdo. */

function blocoDemonstracao(imagemDataUri) {
  const figura = imagemDataUri
    ? `  <figure>
    <img src="${imagemDataUri}"
         alt="Ícone da marreta do NarrATO, com cabeça retangular e cabo pontiagudo, em vinho sobre fundo creme.">
    <figcaption>Figura 1 &middot; Teste de figura com texto alternativo embutido.</figcaption>
  </figure>`
    : '';

  return `
<hr>

<h2 id="demonstracao-de-componentes">Demonstração de componentes</h2>

<p>Este trecho não pertence ao Capítulo 1.
Ele existe para verificar se as caixas nomeadas, a figura e o texto alternativo
sobrevivem à conversão em PDF sem perder marcação.</p>

<div class="caixa caixa--aviso" role="note">
  <span class="caixa-titulo">&#9888;&#65039; Aviso do Mestre de Obras</span>
  <p>Filete espesso à esquerda, além do ícone e da cor.
  Impressa em escala de cinza, esta caixa continua distinguível das outras duas.</p>
</div>

<div class="caixa caixa--ferramenta" role="note">
  <span class="caixa-titulo">&#128736;&#65039; Ferramenta</span>
  <p>Filete tracejado à esquerda.
  A diferenciação nunca depende apenas da cor, conforme o RQ6.</p>
</div>

<div class="caixa caixa--teoria" role="note">
  <span class="caixa-titulo">&#129504; Teoria Base</span>
  <p>Filete duplo à esquerda.
  Três marcas simultâneas: ícone, cor de fundo e desenho do filete.</p>
</div>

${figura}

<blockquote>
  <p>Regras ditam como você deve fazer as coisas,
  enquanto princípios revelam o que funciona.</p>
  <p>&mdash; Robert McKee, citado no Capítulo 1</p>
</blockquote>

<div class="faixa" role="presentation" aria-hidden="true"></div>

<h2 id="bloco-explicativo-com-figura">Bloco explicativo com figura</h2>

<p>Trecho didático destacado do texto corrido, com espaço reservado
para a peça gráfica que entra depois.
A vaga marca proporção e altura desde já, para que a paginação seja
realista antes de a figura existir.</p>

<div class="bloco-explicativo">
  <h3>A tríade indissociável</h3>
  <p>Personagem, trama e tema não se projetam em separado.
  Alterar uma variável compromete a física de todo o resto da obra.</p>

  <figure>
    <div class="imagem-vaga" role="img"
         aria-label="Vaga reservada para diagrama da tríade indissociável.">
      <p class="rotulo">Vaga de imagem</p>
      <p class="medida">Diagrama da tríade &middot; 16:9</p>
    </div>
    <figcaption>Figura 2 &middot; Reserva provisória, a substituir por peça em SVG.</figcaption>
  </figure>

  <p>Se você quebrar uma costela do esqueleto narrativo,
  o coração do protagonista baterá em ritmo diferente.</p>
</div>

<span class="respiro" role="presentation" aria-hidden="true"></span>

<p>Depois do respiro, o texto corrido retoma sem sinalização pesada.
O separador curto marca mudança de assunto dentro da mesma seção,
sem exigir um título novo.</p>

<div class="bloco-explicativo">
  <h3>Vaga em retrato</h3>
  <figure>
    <div class="imagem-vaga imagem-vaga--retrato" role="img"
         aria-label="Vaga reservada para ilustração em formato retrato.">
      <p class="rotulo">Vaga de imagem</p>
      <p class="medida">Ilustração &middot; 3:4</p>
    </div>
    <figcaption>Figura 3 &middot; Segunda proporção, para testar a quebra de página.</figcaption>
  </figure>
</div>

<div class="faixa faixa--fina" role="presentation" aria-hidden="true"></div>
`;
}

/* ---------- 5. Fontes embutidas ---------- */

function faceDeFontes() {
  const partes = [];
  for (const f of FONTES) {
    const caminho = path.join(PASTA_FONTES, f.arquivo);
    if (!fs.existsSync(caminho)) {
      console.warn(`  ! fonte não encontrada, seguindo sem ela: ${f.arquivo}`);
      continue;
    }
    partes.push(
      `@font-face {\n` +
      `  font-family: "OpenDyslexic";\n` +
      `  font-style: normal;\n` +
      `  font-weight: ${f.peso};\n` +
      `  font-display: swap;\n` +
      `  src: url(data:font/otf;base64,${base64(caminho)}) format("opentype");\n` +
      `}`
    );
  }
  return partes.join('\n');
}

/* ---------- Execução ---------- */

console.log('NarrATO — build do livro digital\n');

const argamassa = fs.readFileSync(path.join(RAIZ, 'Argamassa.md'), 'utf8');
console.log(`  fonte      Argamassa.md (${argamassa.split(/\r?\n/).length} linhas)`);

const bruto = extrairCapitulo(argamassa, CAPITULO_ALVO);
const preparado = higienizarGlifos(normalizarParagrafos(bruto));
const promovido = promoverTitulos(preparado);
const renderizado = md.render(promovido);
const { html: comIds, indice } = comAncoras(renderizado);

let imagemDataUri = '';
if (fs.existsSync(IMAGEM_DEMO)) {
  imagemDataUri = `data:image/png;base64,${base64(IMAGEM_DEMO)}`;
} else {
  console.warn('  ! imagem de demonstração não encontrada, figura omitida');
}

const conteudo = agruparMovimentos(comIds) + blocoDemonstracao(imagemDataUri);

const titulo = (bruto.match(/^###\s*(.+)$/m) || [, CAPITULO_ALVO])[1]
  .replace(/[^\x20-\x7E\u00C0-\u017F]/g, '').trim();

// O sistema visual é um só para site, livro e PDF (ADR-008): os tokens vêm
// do mesmo arquivo que o site importa, e entram antes da folha do livro.
const tokens = fs.readFileSync(path.join(RAIZ, 'jekyll', 'assets', 'css', 'tokens.css'), 'utf8');
let estilo = tokens + '\n' + fs.readFileSync(path.join(AQUI, 'src', 'estilo.css'), 'utf8');
estilo = estilo.replace('/*FONTES*/', faceDeFontes());

const data = new Date().toLocaleDateString('pt-BR', {
  day: '2-digit', month: 'long', year: 'numeric',
});

/* ---------- Controles de leitura, só na versão web ---------- */

const CONTROLES = `<nav class="controles" aria-label="Controles de leitura">
  <span class="grupo"><strong>Leitura:</strong></span>
  <span class="grupo">
    <button type="button" id="btn-fonte" aria-pressed="false">Fonte de leitura alternativa</button>
  </span>
  <span class="grupo">
    <button type="button" id="btn-menor" aria-label="Diminuir o corpo do texto">A&minus;</button>
    <button type="button" id="btn-maior" aria-label="Aumentar o corpo do texto">A+</button>
    <button type="button" id="btn-reset">Padrão</button>
  </span>
</nav>`;

const SCRIPT_CONTROLES = `<script>
(function () {
  var corpo = document.body, raiz = document.documentElement;
  var base = 112.5, atual = base;
  function aplicar(v) { atual = Math.min(200, Math.max(85, v)); raiz.style.fontSize = atual + '%'; }
  document.getElementById('btn-maior').addEventListener('click', function () { aplicar(atual + 12.5); });
  document.getElementById('btn-menor').addEventListener('click', function () { aplicar(atual - 12.5); });
  document.getElementById('btn-reset').addEventListener('click', function () { aplicar(base); });
  var bf = document.getElementById('btn-fonte');
  bf.addEventListener('click', function () {
    var on = corpo.classList.toggle('fonte-legivel');
    bf.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
})();
</script>`;

/* Realce do tópico corrente no menu lateral.
   Progressive enhancement: sem JavaScript o menu continua
   funcionando como lista de links. */
const SCRIPT_NAVEGACAO = `<script>
(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.navegacao a[href^="#"]')
  );
  if (!links.length || !('IntersectionObserver' in window)) return;

  var porId = {};
  links.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });

  var alvos = links
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  var visiveis = new Set();

  var ultimo = null;

  function realcar() {
    var atual = null;
    for (var i = 0; i < alvos.length; i++) {
      if (visiveis.has(alvos[i].id)) { atual = alvos[i].id; break; }
    }
    // Entre um título e o próximo não há nada na faixa de leitura.
    // Nesse intervalo o realce fica onde estava, para o leitor não
    // perder a referência de onde está no capítulo.
    if (!atual) atual = ultimo;
    if (!atual) return;
    ultimo = atual;
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (porId[atual]) porId[atual].setAttribute('aria-current', 'true');
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) visiveis.add(e.target.id);
      else visiveis.delete(e.target.id);
    });
    realcar();
  }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });

  alvos.forEach(function (t) { observador.observe(t); });
})();
</script>`;

/* ---------- Montagem das duas renderizações ---------- */

const modelo = fs.readFileSync(path.join(AQUI, 'src', 'modelo.html'), 'utf8');

function montar({ extraHead, extraBody, controles, navegacao, sumario }) {
  return modelo
    .replace('{{ESTILO}}', () => estilo)
    .replace(/\{\{TITULO\}\}/g, () => titulo)
    .replace('{{SUMARIO}}', () => sumario)
    .replace('{{NAVEGACAO}}', () => navegacao)
    .replace('{{PROGRESSO}}', () => montarProgresso(1, 10))
    .replace('{{CONTEUDO}}', () => conteudo)
    .replace('{{DATA}}', () => data)
    .replace('{{EXTRA_HEAD}}', () => extraHead)
    .replace('{{EXTRA_BODY}}', () => extraBody)
    .replace('{{CONTROLES}}', () => controles);
}

fs.mkdirSync(DIST, { recursive: true });

// Versão web: texto que reflui, com controles e menu lateral.
// O menu lateral substitui o sumário no corpo, para não repetir
// a mesma lista duas vezes na mesma tela.
const paginaWeb = montar({
  extraHead: '',
  extraBody: SCRIPT_CONTROLES + '\n' + SCRIPT_NAVEGACAO,
  controles: CONTROLES,
  navegacao: montarNavegacao(indice),
  sumario: '',
});
const destinoWeb = path.join(DIST, 'narrato-capitulo-01.html');
fs.writeFileSync(destinoWeb, paginaWeb, 'utf8');

// Versão de impressão: paginada pelo Paged.js, com cabeçalho corrente.
const cssImpressao = fs.readFileSync(path.join(AQUI, 'src', 'impressao.css'), 'utf8');
const pagedjs = fs.readFileSync(
  path.join(AQUI, 'node_modules', 'pagedjs', 'dist', 'paged.polyfill.min.js'), 'utf8'
);

// Versão de impressão: sem menu lateral, que não existe em papel.
// O sumário volta ao corpo e vira a folha de âncoras do PDF.
const paginaImpressao = montar({
  extraHead: `<style>${cssImpressao}</style>`,
  extraBody: `<script>${pagedjs}</script>`,
  controles: '',
  navegacao: '',
  sumario: montarSumario(indice),
});
const destinoImpressao = path.join(DIST, 'narrato-capitulo-01-impressao.html');
fs.writeFileSync(destinoImpressao, paginaImpressao, 'utf8');

console.log(`  capítulo   ${titulo}`);
console.log(`  seções     ${indice.length} entradas no sumário`);
console.log(`  web        ${path.relative(RAIZ, destinoWeb)}  (${(Buffer.byteLength(paginaWeb) / 1024).toFixed(0)} KB)`);
console.log(`  impressão  ${path.relative(RAIZ, destinoImpressao)}  (${(Buffer.byteLength(paginaImpressao) / 1024).toFixed(0)} KB)\n`);
console.log('pronto.');
