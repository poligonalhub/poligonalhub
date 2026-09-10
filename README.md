# Centro Comunitário-Criativo Poligonal

> **Vários ângulos, todos anti-imperialistas.**  
> Estúdio e centro comunitário-criativo do Nordeste Brasileiro desenvolvendo jogos em Unreal Engine, produções audiovisuais e soluções web.

---

## 🧭 Estrutura do Repositório

O repositório do **Poligonal Hub** foi projetado para abrigar a vitrine principal do coletivo e hospedar as landing pages e *1-Pager GDDs* (Game Design Documents) de todos os projetos de forma unificada, preservando a identidade estética de cada universo.

```
poligonalhub/
├── index.html                     # Portal principal do Poligonal Hub (Vitrine e Manifesto)
├── contato.html                   # Canal de contato direto e parcerias
│
├── shared/                        # Componentes globais compartilhados
│   ├── hub-bar.js                 # Barra de navegação universal superior injetável
│   ├── hub-footer.js              # Loader de include dinâmico e Web Component do rodapé
│   ├── footer.html                # Include HTML semântico estático do rodapé institucional
│   ├── footer.css                 # Layout base e design tokens do rodapé (variáveis CSS)
│   └── radar-preset.js            # Helper reutilizável para Radar Charts (Chart.js)
│
├── carcarah/                      # GDD do jogo Carcarah! (UE5 / Roguelike)
├── ocupareresistir/               # GDD e Pitch de Ocupar e Resistir (Tower Defense)
├── paranoide/                     # GDD de PARANOIDE (Cyberpunk / IA DDA)
├── oush/                          # GDD de OUSH Nordeste 2076 (Retro-futurismo)
├── profanadores/                  # GDD de Profanadores (Dark Fantasy Metroidvania)
├── mabetedoc/                     # Documentação arquitetural completa MABeTe
├── unrealingo/                    # Plataforma gamificada de aprendizado Unreal Engine
├── bp/                            # Blueprint Node Editor interativo
├── bpfikdik.html                  # Guia de boas práticas e atalhos de Blueprints
├── maileditor.html                # Gerador visual de assinaturas institucionais de e-mail
│
└── links/ (redirecionamentos)
    ├── fluxo/                     # Substack / Newsletter oficial
    ├── narratozap/                # Grupo de WhatsApp / Comunidade
    ├── quemndevnteme/             # Evento Epic Games João Pessoa
    └── unrealjp/                  # Comunidade oficial Unreal Engine João Pessoa
```

---

## 📐 Padrão Arquitetural para Páginas de Projetos

Todas as páginas de projetos e GDDs seguem a **Estrutura Unificada em 9 Blocos**:

1. **Hub Bar Superior (`shared/hub-bar.js`)**: Breadcrumb, link para o Hub e menu de acesso rápido a todos os projetos.
2. **Hero / Pitch**: Logline de impacto, título, gênero e badges de classificação/plataforma.
3. **Visão Geral**: Sinopse narrativa e premissa central.
4. **Características & Loop**: Sistemas mecânicos principais e dinâmicas de jogo.
5. **Diferenciais de Mercado (USPs)**: 3 a 4 cartões com os pilares exclusivos.
6. **Módulos / Roster / Universo**: Deep dive visual (galeria de personagens, cards 3D ou abas).
7. **Posicionamento de Mercado**: Radar Chart padronizado comparando com referências do gênero.
8. **Ficha Técnica & Parcerias**: Engine, escopo, plataformas e call-to-action.
9. **Footer Institucional (`shared/footer.html` / `shared/hub-footer.js`)**: Rodapé unificado como include, com layout semântico e dados institucionais idênticos, permitindo que cada página resolva sua própria estética via design tokens CSS.

### Como usar o Rodapé Unificado (Include):

O rodapé foi desacoplado de estilos inline rígidos e pode ser consumido de três formas:

#### Opção A: Inclusão Dinâmica / Web Component (Recomendada no front estático)
Adicione o script do loader e a tag na página:
```html
<!-- Via atributo data -->
<footer data-poligonal-footer></footer>
<script src="../shared/hub-footer.js"></script>

<!-- Ou via Web Component nativo -->
<poligonal-footer></poligonal-footer>
<script src="../shared/hub-footer.js"></script>
```

#### Opção B: Include Estático / Server-Side (SSG, PHP, Nginx SSI, etc.)
Copie ou inclua o arquivo `shared/footer.html` diretamente no template e importe `shared/footer.css`:
```html
<link rel="stylesheet" href="/shared/footer.css">
<!-- include 'shared/footer.html' -->
```

#### Personalização Estética por Página:
O rodapé herda automaticamente as variáveis do tema da página ou aceita personalizações diretas:
```css
:root {
  /* Herança automática dos temas dos GDDs */
  --theme-accent: #FF6127;
  --theme-surface: rgba(20, 20, 20, 0.8);
  --theme-border: rgba(255, 255, 255, 0.1);
  --theme-font-title: 'Major Mono Display', monospace;
  --theme-font-body: 'Space Mono', monospace;

  /* Ou sobrescrevendo os tokens exclusivos do rodapé */
  --footer-accent: #00EAFF;
  --footer-bg: #0b0b0f;
  --footer-border: #1f293d;
}
```

### Como adicionar um novo projeto ao Hub:

1. Crie uma pasta para o projeto com seu `index.html` (ex: `meuprojeto/index.html`).
2. No `<head>`, defina o nome do projeto para a Hub Bar:
   ```html
   <meta name="poligonal-project-name" content="Meu Projeto">
   ```
3. Logo após a abertura da tag `<body>`, inclua a Hub Bar:
   ```html
   <script src="../shared/hub-bar.js"></script>
   ```
4. No final do `<body>`, adicione a ancoragem do rodapé:
   ```html
   <footer data-poligonal-footer></footer>
   <script src="../shared/hub-footer.js"></script>
   ```
5. Registre o novo projeto na lista `PROJECTS` em `shared/hub-bar.js` e no grid do `index.html`.

---

## 🌐 Links e Comunidade

- **Site Oficial**: [poligonalhub.com](https://poligonalhub.com)
- **Apoia-se**: [apoia.se/poligonal](https://apoia.se/poligonal)
- **Newsletter Fluxo**: [poligonal.substack.com](https://poligonal.substack.com)
- **Discord**: [discord.gg/kSCNNdFaQE](https://discord.gg/kSCNNdFaQE)
- **Contato**: [poligonalhub@gmail.com](mailto:poligonalhub@gmail.com)
