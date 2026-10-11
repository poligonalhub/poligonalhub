# ADR-012: Diretriz de Apresentação Visual do NDD (Estética Integral do Portal Governamental HEET)

## Status
Aprovado pela Direção Geral

## Contexto
O documento de design narrativo (NDD de página única) do projeto T.R.A.U.M.A. necessitava de uma calibragem estética precisa para apresentação institucional aos parceiros, fundos de financiamento e equipe de roteiro.
Após testes com temas escuros e terminais CRT, a Direção Geral deliberou que o NDD deve adotar integralmente a estética de portal público de saúde do governo estadual (baseado no portal do Hospital de Trauma da Paraíba).
Essa escolha materializa a premissa diegética: a frieza burocrática e a violência institucional operam sob o verniz da transparência e da sobriedade administrativa de um portal governamental.

## Decisão
Adota-se a seguinte configuração oficial para a apresentação visual do NDD de T.R.A.U.M.A.:
* **Estética Integral do Portal**: Interface 100% clara com fundo neutro (`#f4f6f8`), cartões brancos sólidos (`#ffffff`) e bordas suaves (`#e2e8f0`).
* **Paleta de Identidade Governamental**: Azul marinho institucional (`#0c326f`) como tom primário de navegação e cabeçalho, azul SUS (`#0284c7`) para assistência e vermelho de trauma/emergência (`#d32f2f` / `#ed1c24`) para alertas e carimbos.
* **Faixa Oficial das Cinco Cores da Parahyba**: Inclusão da divisória governamental com as cinco cores estaduais (amarelo, vermelho, azul, verde e preto) no topo do portal.
* **Denominação Oficial Padronizada**: A unidade hospitalar é designada como **HEET** (**Hospital Estadual de Emergência e Trauma**). O patrono formal ("Senador Ricardo Cunha Lima") figura exclusivamente onde o nome jurídico completo é exigido.
* **Eliminação de Modos Alternativos e CRT**: Remoção completa de botões de alternância de temas, gavetas laterais de estilos, fundos escuros e filtros CRT scanlines, garantindo sobriedade estrita e fidelidade ao portal público.
* **Container Unificado de Elenco**: Integração do acrônimo interativo de seis letras (T-R-A-Ú-M-A), dos prontuários clínicos detalhados e dos personagens de apoio dentro de um único bloco visual coeso.
* **Radar de Posicionamento Competitivo Calibrado**: Gráfico de radar com alta legibilidade comparando T.R.A.U.M.A. com as três obras de referência solicitadas: "Sob Pressão", "House M.D." e "The Pitt".

## Consequências
* O arquivo `index.html` passa a operar como um documento autossuficiente e monocromático em termos de tema, eliminando dependências de seletores de estilos dinâmicos.
* A experiência visual transmite imediatamente o realismo documental e a atmosfera hipernormalizada de um órgão público em colapso.
* As fichas clínicas e as análises dramatúrgicas ganham legibilidade imediata para leitura executiva de mercado audiovisual.
