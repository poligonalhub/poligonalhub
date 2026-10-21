# Imagens do Projeto (`assets/images/`)

> **Escritório Virtual NarrATOsys V1.0**
> **Responsável**: João Mário / Duminguz (Direção de Arte)
> **Destino**: peças exportadas do Figma para uso no Caderno de Encargos, no livro digital, no PDF e nas peças de divulgação.

---

## 1. Por que a pasta existe aqui

O desacoplamento Jekyll separou dado, template e ativo estático.
Nessa convenção, arquivo estático mora em `assets/`, e imagem mora em `assets/images/`, preservando o caminho até a saída publicada.

Pastas e arquivos iniciados por `_`, `.`, `#` ou `~` são ignorados na geração.
Por isso nenhum nome de pasta ou de imagem começa com esses caracteres.

Os ativos de marca e vetores moram centralizados em `assets/svg/`.
As folhas de estilo e scripts moram no padrão Jekyll em `assets/css/` e `assets/js/`.
As capas de livro-fonte moram em sua pasta própria dentro de imagens: `assets/images/capas/`.

---

## 2. Estrutura

| Pasta | O que guarda |
| :--- | :--- |
| `capas/` | Capas de livros-fonte catalogados na bibliografia |
| `marca/` | Aplicações de marca exportadas do Figma: assinaturas, selos, versões e variações |
| `icones/eixos/` | Os cinco ícones de eixo: Consenso, Dissenso, Métodos, Reescrita e Coletivo |
| `icones/capitulos/` | Os dez ícones de módulo, quando substituírem os emoji provisórios |
| `ilustracoes/aberturas/` | As aberturas de capítulo, `ILU-ABER-01` a `ILU-ABER-10` |
| `texturas/` | Concreto, papel e demais fundos |
| `social/` | Imagens de compartilhamento e capas de rede social |

Pasta nova só entra quando houver peça para ela, e com uma linha nesta tabela.

### O que não mora aqui

- Vetores e ícones SVG globais, que ficam em `assets/svg/`.
- Fontes tipográficas, que ficam em `assets/fonts/`.
- Folhas de estilo e scripts, que ficam em `assets/css/` e `assets/js/`.
- Prints de livro-fonte da Matriz Gráfica, que ficam em `DRAFTS/matriz-grafica-refs/` e nunca são publicados.

---

## 3. Nome de arquivo

Mesma regra de slug do `DOCS/convencoes/markdown.md`: ASCII puro, minúsculas, hífen como separador.
Sem acento, sem cedilha, sem espaço, sem maiúscula e sem emoji.

```text
icones/eixos/eixo-consenso.svg
icones/capitulos/capitulo-01-planta-baixa.svg
ilustracoes/aberturas/ilu-aber-01-planta-baixa.svg
texturas/concreto-parede-1600w.jpg
marca/assinatura-horizontal-negativa.svg
```

Variação de tamanho em raster leva a largura como sufixo, como `-1600w`.
Versão otimizada leva `-opt`, mantendo o original ao lado quando ele for necessário.

---

## 4. Formato

| Uso | Formato |
| :--- | :--- |
| Ícone, logotipo, diagrama e qualquer vetor | SVG |
| Imagem com transparência | PNG |
| Fotografia e textura | JPG, ou WebP quando o ganho de peso justificar |

Vetor nunca é exportado como PNG para uso em tela.
O SVG é o que o livro, o Caderno e o PDF consomem, e é ele que sobrevive à ampliação.

---

## 5. Exportação do Figma

- Ícone desenhado em grade de 24px, monocromático, traço convertido em contorno.
- Ícone precisa continuar legível em 16px, conforme o RQ30 da spec `031-sistema-visual`.
- Cor de ícone sai do token da aplicação, e não do arquivo, sempre que o SVG for usado em linha.
- SVG limpo de metadado do editor, sem `id` gerado automaticamente e sem camada vazia.
- Raster acima de 300 KB volta para a otimização antes de subir.
  A textura de 11 MB versionada em agosto é o lembrete de que peso em Git não se desfaz.

---

## 6. Texto alternativo

Todo SVG nasce com `<title>` e `<desc>` dentro do arquivo, conforme o item 5 das consequências do [`ADR-003`](../../DOCS/adr/ADR-003-sistema-visual-em-css.md).

```xml
<svg role="img" aria-labelledby="t d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <title id="t">Eixo Consenso</title>
  <desc id="d">Balança de dois pratos em equilíbrio</desc>
</svg>
```

Imagem em raster carrega o texto alternativo em quem a usa, no `alt` do HTML.
Imagem puramente decorativa é marcada como decorativa, com `alt` vazio, e não recebe descrição inventada.

Pelo critério de pronto do partido de arte, nenhuma peça entra sem o seu texto alternativo escrito.

---

## 7. Como referenciar

No Caderno, o caminho é relativo à raiz publicada, e o compilador resolve o prefixo:

```html
<img src="assets/images/icones/eixos/eixo-consenso.svg" alt="Eixo Consenso">
```

Em template Jekyll, o caminho passa pelo filtro que respeita a raiz do site:

```liquid
<img src="{{ '/assets/images/icones/eixos/eixo-consenso.svg' | relative_url }}" alt="Eixo Consenso">
```

Caminho absoluto de disco, com letra de unidade, é proibido, conforme o `DOCS/convencoes/markdown.md`.
