/**
 * ============================================================================
 * T.R.A.U.M.A. • NDD (NARRATIVE DESIGN DOCUMENT)
 * REGISTRO CENTRAL DE DADOS & ÍNDICE DO SISTEMA (TRAUMA_SYSTEM)
 * ============================================================================
 * Este arquivo funciona como o índice mestre de dados estruturados do sistema,
 * permitindo manutenção rápida e isolada de episódios, personagens, laudos,
 * topografia e especificações técnicas sem necessidade de editar marcação HTML.
 */

const TRAUMA_SYSTEM = {
  // --------------------------------------------------------------------------
  // ÍNDICE MESTRE DOS MÓDULOS DO SISTEMA (TABLE OF CONTENTS / OS MODULE MAP)
  // --------------------------------------------------------------------------
  INDEX: {
    systemName: "SINESP-HEET // SISTEMA DE GESTÃO DE OCORRÊNCIAS & PRONTUÁRIOS",
    version: "v3.0.0-PROD",
    hospital: "Hospital Estadual de Emergência e Trauma (HEET) • SESP-PB",
    unidade: "Complexo Metropolitano Senador Ricardo Cunha Lima • BR-230 Km 18",
    modulos: [
      {
        id: "hero",
        code: "MOD-01",
        tecla: "F1",
        titulo: "Admissão & Premissa",
        subtitulo: "Registro Inicial & Núcleo Temático",
        categoria: "DIRETRIZ GERAL",
        badge: "DIRETRIZ",
        corBadge: "bg-blue-100 text-blue-900 border-blue-300",
        descricao: "Premissa dramática, ideia governante hipernormal e dispositivo híbrido de dados reais."
      },
      {
        id: "mapa",
        code: "MOD-02",
        tecla: "F2",
        titulo: "Topografia do Complexo",
        subtitulo: "Planta Baixa & Regras de Conduta",
        categoria: "INFRAESTRUTURA",
        badge: "4 ANDARES",
        corBadge: "bg-indigo-100 text-indigo-900 border-indigo-300",
        descricao: "Divisão vertical dos 4 pavimentos do HEET e as 4 regras de encenação técnica."
      },
      {
        id: "elenco",
        code: "MOD-03",
        tecla: "F3",
        titulo: "Prontuários do Elenco",
        subtitulo: "Corpo Clínico & Operadores",
        categoria: "RECURSOS HUMANOS",
        badge: "6 OPERADORES",
        corBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
        descricao: "Anamnese funcional, CRM/COREN, dilemas éticos e arcos evolutivos de cada profissional."
      },
      {
        id: "arcos",
        code: "MOD-04",
        tecla: "F4",
        titulo: "Livro de Ocorrências",
        subtitulo: "Boletins de Plantão (Eps 1.1 a 3.3)",
        categoria: "REGISTRO POLICIAL/CLÍNICO",
        badge: "9 BOLETINS",
        corBadge: "bg-amber-100 text-amber-900 border-amber-300",
        descricao: "Os 9 episódios da 1ª temporada estruturados como Boletins de Ocorrência com escaletas e dados reais."
      },
      {
        id: "evidencias",
        code: "MOD-05",
        tecla: "F5",
        titulo: "Laudos & Evidências UFPB",
        subtitulo: "Arquivo Pericial Epidemiológico",
        categoria: "CUSTÓDIA PROBATÓRIA",
        badge: "4 LAUDOS PDF",
        corBadge: "bg-purple-100 text-purple-900 border-purple-300",
        descricao: "Dossiê de evidências científicas da Profa. Dra. Thaís Máximo (UFPB / CNPq) com leitor integrado."
      },
      {
        id: "radar",
        code: "MOD-06",
        tecla: "F6",
        titulo: "Matriz Comparativa",
        subtitulo: "Radar de Gênero & Posicionamento",
        categoria: "AUDITORIA DE MERCADO",
        badge: "5 EIXOS",
        corBadge: "bg-cyan-100 text-cyan-900 border-cyan-300",
        descricao: "Análise comparativa quantitativa com Sob Pressão, Plantão Médico (ER), The Pitt e Grey's Anatomy."
      },
      {
        id: "producao",
        code: "MOD-07",
        tecla: "F7",
        titulo: "Cadastro de Produção",
        subtitulo: "Ficha Técnica & Linhas de Fomento",
        categoria: "ESPECIFICAÇÕES",
        badge: "FICHA TÉCNICA",
        corBadge: "bg-slate-100 text-slate-900 border-slate-300",
        descricao: "Formato, duração, alocação orçamentária, janelas de veiculação e contato da Poligonal Hub."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // PREMISSA DRAMÁTICA & NÚCLEO NARRATIVO
  // --------------------------------------------------------------------------
  PREMISSA: {
    titulo: "T.R.A.U.M.A.",
    subtitulo: "BASEADO EM DADOS REAIS",
    natureza: "Minissérie Médica Dramática • Formato Procedural & Serializado",
    episodiosCount: 9,
    duracaoMedia: "45 a 52 minutos",
    ambientacao: "Hospital Estadual de Emergência e Trauma (HEET) • Parahyba",
    logline: "Confinados no maior complexo de trauma do Nordeste, uma cirurgiã cínica e uma equipe multidisciplinar à beira do esgotamento enfrentam três eras de colapso — do acidente pré-pandêmico à privatização algorítmica —, descobrindo que salvar vidas no SUS depende de uma rede clandestina de desobediência ética.",
    ideiaGovernante: "A salvação da vida humana no serviço público sobrevive não pela engrenagem burocrática estatal ou privada, mas pela rebeldia ética e solidariedade clandestina dos seus trabalhadores contra a precarização neoliberal e o mito cínico do heroísmo institucional.",
    forcasSistemicas: [
      {
        forca: "A Farsa do Herói",
        operador: "Dr. Tarcísio Meireles (Diretor Geral / Secretário)",
        mecanica: "A instrumentalização do sacrifício alheio para maquiar desvios orçamentários, falta de insumos e negligência estatal, convertendo mortes evitáveis em sacrifício sagrado."
      },
      {
        forca: "O Sistema Racional Desumanizador",
        operador: "A Gestão Burocrática / Organização Social / Algoritmo",
        mecanica: "A redução da dor a tabelas métricas e descarte estatístico. No Arco 3, atinge o ápice na triagem automatizada por IA que nega leitos a idosos de baixa renda."
      },
      {
        forca: "A Ação Humana Clandestina",
        operador: "Mariana, Amanda, Renata, Uana e Aziz",
        mecanica: "A resistência operada nos pontos cegos: desvio solidário de medicamentos, sabotagem de registros fraudados, uso de ervas e a cirurgia clandestina da madrugada."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TOPOGRAFIA VERTICAL DO COMPLEXO & REGRAS DE CONDUTA
  // --------------------------------------------------------------------------
  COMPLEXO: {
    pavimentos: [
      {
        andar: "TÉRREO",
        codigo: "DEP-00/EMERG",
        nome: "A PORTA & A LAMA",
        ala: "ALA VERMELHA",
        corBorda: "border-t-red-600",
        corTexto: "text-red-700",
        descricao: "Recepção superlotada, macas emperradas, piso de granilite manchado e choque frontal com a população desesperada. A porta aberta 24h sem filtros."
      },
      {
        andar: "1º PAVIMENTO",
        codigo: "DEP-01/CC-UTI",
        nome: "A CARNE & A UTI",
        ala: "ALA AZUL",
        corBorda: "border-t-sky-600",
        corTexto: "text-sky-700",
        descricao: "Centro cirúrgico, respiradores mecânicos e portas pressurizadas. Onde Mariana, Uana e Amanda operam o cuidado físico no limite do desgaste térmico."
      },
      {
        andar: "2º PAVIMENTO",
        codigo: "DEP-02/DIR-NIR",
        nome: "A TORRE DE MARFIM",
        ala: "ALA ADMINISTRATIVA",
        corBorda: "border-t-amber-600",
        corTexto: "text-amber-700",
        descricao: "Diretoria climatizada, carpete, telas de monitoramento e planilhas de corte de custos de Tarcísio e Renata. Onde as vidas viram números regulados."
      },
      {
        andar: "SUBSOLO",
        codigo: "DEP-M1/MANUT",
        nome: "O SUBSOLO ANCESTRAL",
        ala: "ALA TÉCNICA",
        corBorda: "border-t-purple-700",
        corTexto: "text-purple-700",
        descricao: "Dutos de oxigênio, cheiro de cloro e ervas secas, painéis elétricos antigos. O território subterrâneo de Aziz, suas chaves mestras e passagens secretas."
      }
    ],
    regrasConduta: [
      {
        numero: "01",
        titulo: "O Confinamento Obrigatório",
        regra: "95% da narrativa ocorre rigorosamente dentro das dependências do HEET. O mundo exterior só entra via ambulâncias, notícias no rádio ou vidros embaçados."
      },
      {
        numero: "02",
        titulo: "Linguagem Técnica Sem Didatismo",
        regra: "Diálogos clínicos velozes com jargões médicos reais (drenagem em selo d'água, intubação rápida, PEEP, lactato). O espectador aprende pelo contexto de urgência."
      },
      {
        numero: "03",
        titulo: "A Luz Crua do Granilite",
        regra: "Iluminação hospitalar inclemente de lâmpadas fluorescentes contínuas, granilite lavado com hipoclorito, suor sob as máscaras e ausência de filtros estéticos romantizados."
      },
      {
        numero: "04",
        titulo: "A Burocracia Como Antagonista Ativo",
        regra: "O formulário que trava, a falta de carimbo, a senha da regulação e a planilha do NIR são tão letais quanto a hemorragia arterial não estancada."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // PRONTUÁRIOS CLÍNICOS DO CORPO CLÍNICO (6 OPERADORES)
  // --------------------------------------------------------------------------
  PRONTUARIOS: {
    mariana: {
      prontuario: "PRONT-HEET/2019-M01",
      matricula: "MAT-77402-PB",
      status: "EM PLANTÃO ATIVO",
      statusClass: "text-emerald-700 bg-emerald-50 border-emerald-300",
      name: "Dra. Mariana Costa",
      role: "Médica com Residência em Cirurgia Geral e do Trauma • CRM-Parahyba 10.421",
      tag: "Lente de Entrada → Rebeldia",
      tagColor: "bg-sky-50 text-sky-800 border border-sky-300",
      lotacao: "Pronto-Socorro / Ala Vermelha / Centro Cirúrgico",
      desejo: "Dominar a técnica operatória e sobreviver ao plantão sem falhas clínicas e sem punição institucional.",
      necessidade: "Redescobrir sua bússola moral e aceitar que ser médica exige rebelar-se contra ordens institucionais desumanas.",
      reacao: "Rejeição agressiva através do cinismo e do humor ácido. Recusa ser chamada de heroína para não ser usada como bucha de canhão.",
      t1: "Idealista e sobrecarregada na porta. Sofre o choque de classe ao ver o playboy VIP ser priorizado e blindado da cadeia, enquanto trabalhadores são confinados no corredor.",
      t2: "Na trincheira da COVID-19, perde a inocência técnica intubando colegas e drenando tórax em meio à privação brutal de insumos.",
      t3: "Cirurgiã veterana cínica que opera no automático da privatização até quebrar o protocolo e liderar a cirurgia proibida para salvar Seu Moacir."
    },
    amanda: {
      prontuario: "PRONT-HEET/2019-A02",
      matricula: "MAT-62118-PB",
      status: "EM PLANTÃO ATIVO",
      statusClass: "text-emerald-700 bg-emerald-50 border-emerald-300",
      name: "Amanda Silveira",
      role: "Técnica de Enfermagem Especializada em Cuidados Críticos e Emergência • COREN-PB 401.992",
      tag: "Coração Sensorial do Front",
      tagColor: "bg-pink-50 text-pink-800 border border-pink-300",
      lotacao: "Ala Amarela / Enfermagem de Triagem / UTI",
      desejo: "Anestesiar a própria dor e terminar os plantões sem colapsar emocionalmente.",
      necessidade: "Transformar o luto e a culpa pela morte de sua afilhada Laila em um ato concreto de justiça e desobediência.",
      reacao: "Auto-sacrifício inicial que deságua em adoecimento psíquico severo e anestesia medicamentosa contínua.",
      t1: "Rápida, experiente e maternal com a equipe, sustenta a retaguarda no corredor superlotado, sentindo a masmorra do aprisionamento hospitalar.",
      t2: "Tenta blindar sua afilhada Laila no setor respiratório, assistindo impotente à sua morte pela privação criminosa de EPIs.",
      t3: "Trabalha dopada por antidepressivos na engrenagem privatizada da OS até reencontrar a faísca da ação humana na defesa do ex-porteiro Moacir."
    },
    renata: {
      prontuario: "PRONT-HEET/2019-R03",
      matricula: "MAT-48920-PB",
      status: "AUDITORIA DE GESTÃO",
      statusClass: "text-amber-700 bg-amber-50 border-amber-300",
      name: "Dra. Renata Albuquerque",
      role: "Médica Intensivista e Gestora • Chefe da UTI (A1/A2) → Diretora Geral (A3)",
      tag: "A Ponte Trágica da Gestão",
      tagColor: "bg-amber-50 text-amber-800 border border-amber-300",
      lotacao: "Coordenação da UTI Geral / Diretoria Clínica",
      desejo: "Manter o hospital de portas abertas e demonstrar eficiência métrica inquestionável perante a secretaria.",
      necessidade: "Participa da ação clandestina ao lado da equipe, mas adverte previamente que demitirá todos os envolvidos na manhã seguinte porque discorda institucionalmente do ato. Reconhece que ajudar é o imperativo ético correto, mas sua contradição interna e instinto de autopreservação a impedem de aceitar o ônus político.",
      reacao: "Manipulação instrumental da retórica do heroísmo para exigir sacrifício da equipe sem remunerá-la decentemente.",
      t1: "Chefe técnica da UTI, rigorosa e focada na precisão e na distribuição de leitos, coagida a pactuar com a blindagem penal do VIP.",
      t2: "Pressionada pela direção para maquiar índices no meio do colapso e da privação criminosa de respiradores.",
      t3: "Diretora Geral da OS privatizada que assina relatórios e demissões da IA, até sabotar os logs corporativos e descer para operar na sala 4."
    },
    uana: {
      prontuario: "PRONT-HEET/2019-U04",
      matricula: "MAT-83109-PB",
      status: "EM PLANTÃO ATIVO",
      statusClass: "text-emerald-700 bg-emerald-50 border-emerald-300",
      name: "Uana Pirilampo",
      role: "Fisioterapeuta Especialista em Respiração Mecânica e Terapia Intensiva • CREFITO-PB 18.234",
      tag: "A Legalista Despertada",
      tagColor: "bg-purple-50 text-purple-800 border border-purple-300",
      lotacao: "Unidade de Terapia Intensiva / Ventilação Mecânica",
      desejo: "Cumprir protocolos e diretrizes à risca para se blindar psicologicamente da incerteza, do erro e do luto.",
      necessidade: "Entender que a lealdade cega a regras corrompidas é uma forma sutil de cumplicidade com o homicídio institucional.",
      reacao: "Postura de soldado legalista que enxerga o trabalho como dever técnico desprovido de questionamento político.",
      t1: "Altamente capacitada na calibração de ventiladores mecânicos, rígida com parâmetros no plantão do encarceramento institucional.",
      t2: "Defende o cumprimento estrito das regras durante a privação de oxigênio, entrando em choque frontal com Mariana no caso de Dr. Samuel.",
      t3: "Adere com entusiasmo aos tablets da OS privatizada, até descobrir a fraude do descarte algorítmico e quebrar o lacre da sala 4."
    },
    tarcisio: {
      prontuario: "PRONT-HEET/2019-T05",
      matricula: "MAT-10023-PB",
      status: "CARGO POLÍTICO / SECRETARIA",
      statusClass: "text-red-700 bg-red-50 border-red-300",
      name: "Dr. Tarcísio Meireles",
      role: "Médico de Carreira • Diretor Geral (A1/A2) → Secretário de Estado da Saúde (A3)",
      tag: "A Face do Capital Neoliberal",
      tagColor: "bg-red-50 text-red-800 border border-red-300",
      lotacao: "Gabinete da Direção Geral / Secretaria de Estado da Saúde",
      desejo: "Acumular capital político, prestígio corporativo e ascensão inabalável no aparelho de Estado.",
      necessidade: "Blindar-se contra qualquer responsabilização legal ou moral pelos crimes de gestão e precarização cometidos.",
      reacao: "O criador e propagandista da 'Farsa do Herói': usa o heroísmo alheio como escudo moral para seus desvios orçamentários.",
      t1: "Diretor Geral subserviente à elite política. Articula a farsa do socorro para livrar o playboy VIP do flagrante e da prisão.",
      t2: "Tranca máscaras na sua sala climatizada e lucra politicamente com a privação alheia, vendendo-se como 'gestor modelo'.",
      t3: "Secretário de Estado da Saúde. Entrega o hospital às Organizações Sociais e lucra com a privatização enquanto a IA descarta pacientes pobres."
    },
    aziz: {
      prontuario: "<span class=\"mosh-noise\">0x00_ERR//</span><span class=\"mosh-slice inline-block\">PRONT-???<span class=\"text-red-500 font-bold\">§7F</span></span>",
      matricula: "MAT-INEXISTENTE // SUBSOLO",
      status: "NÃO LOCALIZADO NO SISTEMA",
      statusClass: "text-purple-700 bg-purple-50 border-purple-300 font-mono",
      name: "<span class=\"mosh-slice\">Aziz <span class=\"text-slate-400 font-mono text-base tracking-normal font-bold\">(\"Seu Assis\")</span></span> <span class=\"mosh-macroblock\">P-FRAME_DROP</span>",
      role: "<div class=\"mosh-slice font-mono text-[11px]\"><span class=\"mosh-noise\">01100010 01111001 01110100 01100101</span> <span class=\"mosh-survivor\">subsolo</span> <span class=\"mosh-noise\">:: [OFFSET 0xBF80] øæ~</span></div>",
      tag: "<span class=\"mosh-slice-alt font-mono\"><span class=\"mosh-macroblock\">P-FRAME COLLAPSE</span> 0xFA91 <span class=\"mosh-survivor\">subsolo</span></span>",
      tagColor: "bg-red-50 text-red-900 border border-red-300 font-mono",
      lotacao: "Manutenção Predial / Dutos Subterrâneos / Casa de Máquinas",
      desejo: "<div class=\"mosh-block\"><div class=\"mosh-slice\"><span class=\"mosh-noise\">ÿØÿà..JFIF..\\x00\\x01\\x02\\x11 0x7A9B</span> <span class=\"mosh-survivor\">caminhos pela ventilação</span> <span class=\"mosh-noise\">¶§∆¬ 01000111 01001100 01001001</span></div><div class=\"mosh-slice-alt mt-1\"><span class=\"mosh-noise\">STREAM_ERR: BUFFER_OVERFLOW // 0xCC 0xFF 0x00 0x12 //</span> <span class=\"mosh-macroblock\">P_SYNC_LOST</span> <span class=\"mosh-noise\">≈≠±√ 0x90EA</span></div></div>",
      necessidade: "<div class=\"mosh-block\"><div class=\"mosh-slice-alt\"><span class=\"mosh-noise\">0xDEADBEEF 0x00000000 :: NULL_PTR_EXC</span> <span class=\"mosh-survivor\">lavagem de ervas</span> <span class=\"mosh-noise\">§¬~ 0x89504E47</span></div><div class=\"mosh-slice mt-1\"><span class=\"mosh-noise\">01101001 01101110 01100110 01110101 01110011 \\x89\\x50</span> <span class=\"mosh-macroblock\">CHROMA_MISMATCH</span> <span class=\"mosh-noise\">77 65 65 64 73 0x00</span></div></div>",
      reacao: "<div class=\"mosh-block\"><div class=\"mosh-slice\"><span class=\"mosh-noise\">\\x1b[31m SIGSEGV: KERNEL_HALT //</span> <span class=\"mosh-survivor\">controle do elevador</span> <span class=\"mosh-noise\">0x00A3 0x11FF 0x4B21</span></div><div class=\"mosh-slice-alt mt-1\"><span class=\"mosh-noise\">MPEG-4 BITSTREAM MOSH: [I-FRAME DROP] ¶§µø 01010011 01010100 01001111 01010000</span></div></div>",
      t1: "<div class=\"mosh-block\"><div class=\"mosh-slice\"><span class=\"mosh-noise\">0x7F 0x45 0x4C 0x46 // A1_CORRUPT //</span> <span class=\"mosh-survivor\">subsolo</span> <span class=\"mosh-noise\">¬¶ 00101010</span></div></div>",
      t2: "<div class=\"mosh-block\"><div class=\"mosh-slice-alt\"><span class=\"mosh-noise\">b'\\x1a\\xfa\\x00\\x03' // CABO_TRAÇÃO //</span> <span class=\"mosh-survivor\">tubulações</span> <span class=\"mosh-noise\">0xEE92 FF:FF:00</span></div></div>",
      t3: "<div class=\"mosh-block\"><div class=\"mosh-slice\"><span class=\"mosh-noise\">MACROBLOCK_SMEAR // 0x44 0x41 0x54 0x41 //</span> <span class=\"mosh-survivor\">lavagem de ervas</span> <span class=\"mosh-noise\">:: EOF_OVERWRITE 0x99</span></div></div>"
    }
  },

  // --------------------------------------------------------------------------
  // LIVRO DE OCORRÊNCIAS & ESCALA DE PLANTÕES (9 BOLETINS / EPISÓDIOS)
  // --------------------------------------------------------------------------
  ARCOS: [
    {
      id: 1,
      titulo: "ARCO 1: A PRISÃO",
      periodo: "20/12/2019 • Pré-Pandemia • Plantão Noturno de Fim de Ano",
      contexto: "Ocorrência Rodoviária com Colisão na BR-230",
      descricaoOcorrencia: "Colisão de trânsito violenta na BR-230 envolvendo um esportivo de luxo e um ônibus de trabalhadores da construção civil. 32 operários feridos e 1 paciente VIP (Enzo Raviolli, playboy de família de usineiros e políticos).",
      statusNIR: "BLOQUEIO DE LEITOS • OCUPAÇÃO 180%",
      mentiraTitulo: "Igualdade da Boca pra Fora",
      mentiraDescricao: "A ficção institucional de que a triagem hospitalar é clínica e igualitária. Na realidade, o poder econômico e político compra prioridade cirúrgica imediata, desviando bolsas de sangue raras das vítimas do ônibus para blindar o playboy causador do desastre.",
      conflitoCentral: "A vida humana precificada sob o véu burocrático e a cumplicidade do aparelho médico com as elites regionais.",
      corBadge: "border-t-amber-500",
      badgeTexto: "MENTIRA ESTRUTURAL A1",
      episodios: [
        {
          numero: "1.1",
          protocolo: "PB-HEET-2019-BO-01.1",
          duracao: "45 min",
          titulo: "O Impacto",
          natureza: "Colisão Múltipla com Vítimas Fatais (BR-230)",
          plantonista: "Dra. Mariana Costa (Cirurgia Geral)",
          classificacao: "VERMELHO // EMERGÊNCIA ABSOLUTA",
          coldOpen: "O esportivo de Enzo Raviolli costura a BR-230 chuvosa em alta velocidade e colide violentamente contra o ônibus de operários.",
          desenvolvimento: "Mariana assume seu primeiro grande plantão noturno. Dr. Tarcísio isola o playboy na suíte privativa e abandona Mariana com 18 operários graves agonizando no corredor.",
          climax: "Mariana precisa estancar hemorragias massivas no corredor improvisado sem equipe de apoio e sem monitores cardíacos suficientes."
        },
        {
          numero: "1.2",
          protocolo: "PB-HEET-2019-BO-01.2",
          duracao: "45 min",
          titulo: "A Triagem do Sangue",
          natureza: "Esgotamento Crítico de Hemoderivados (Hemocentro PB)",
          plantonista: "Amanda Silveira & Dra. Renata Albuquerque",
          classificacao: "LARANJA // RISCO IMINENTE",
          coldOpen: "Banco de sangue estadual envia as últimas bolsas O- sob escolta policial em meio à tempestade torrencial.",
          desenvolvimento: "Dona Maria, passageira do ônibus com choque hemorrágico, necessita de transfusão imediata, mas a direção de Tarcísio desvia todas as bolsas para a cirurgia plástica reparadora de Enzo Raviolli.",
          climax: "Aziz encontra sacos com entorpecentes escondidos na jaqueta do playboy no lixo do subsolo, provando o crime abafado pela direção."
        },
        {
          numero: "1.3",
          protocolo: "PB-HEET-2019-BO-01.3",
          duracao: "45 min",
          titulo: "O Encobrimento",
          natureza: "Falsificação de Prontuário Médico-Legal e Flagrante Policial",
          plantonista: "Dra. Mariana Costa & Dr. Tarcísio Meireles",
          classificacao: "VERMELHO // INFRAÇÃO ÉTICO-LEGAL",
          coldOpen: "Delegado da Polícia Civil chega à porta do HEET exigindo exame toxicológico e depoimento do causador do acidente.",
          desenvolvimento: "Tarcísio coagiu Renata e Mariana a forjarem o prontuário de Enzo, registrando trauma craniano fictício para impedir a prisão em flagrante.",
          climax: "Mariana confronta Tarcísio na diretoria; Enzo sai pela porta dos fundos em ambulância particular enquanto o operário morre no corredor."
        }
      ]
    },
    {
      id: 2,
      titulo: "ARCO 2: A PRIVAÇÃO",
      periodo: "14/07/2021 • Pandemia de COVID-19 • Pique da Segunda Onda",
      contexto: "Crise de Oxigênio, Racionamento de EPIs e Colapso da Linha de Frente",
      descricaoOcorrencia: "Colapso sanitário completo. O HEET opera com 230% de ocupação na UTI respiratória, racionamento criminoso de máscaras N95 pela direção e esgotamento da usina de oxigênio líquido.",
      statusNIR: "COLAPSO TOTAL • BANDEIRA PRETA",
      mentiraTitulo: "O Mito dos Heróis",
      mentiraDescricao: "A exaltação midiática e institucional dos trabalhadores da saúde como 'anjos heroicos' para mascarar a escassez proposital de insumos, o desvio de verbas emergenciais e a negligência com vidas humanas.",
      conflitoCentral: "O sacrifício forçado da enfermagem e a escolha de quem vive e quem morre diante da falta de oxigênio.",
      corBadge: "border-t-red-500",
      badgeTexto: "MENTIRA ESTRUTURAL A2",
      episodios: [
        {
          numero: "2.1",
          protocolo: "PB-HEET-2021-BO-02.1",
          duracao: "48 min",
          titulo: "A Onda",
          natureza: "Sobrecarga Respiratória e Barreira de Acesso na Porta",
          plantonista: "Uana Pirilampo & Amanda Silveira",
          classificacao: "VERMELHO // INSUFICIÊNCIA RESPIRATÓRIA AGUDA",
          coldOpen: "Três ambulâncias do SAMU chegam simultaneamente buzinando com pacientes hipóxicos quebrando o vidro da recepção por ar.",
          desenvolvimento: "Uana raciona os circuitos de ventiladores mecânicos. Amanda é obrigada a reutilizar a mesma máscara N95 descartável pelo décimo quarto dia consecutivo.",
          climax: "Laila, afilhada de Amanda e jovem técnica de enfermagem, inicia tosse seca febril enquanto segura a mão de um paciente intubado."
        },
        {
          numero: "2.2",
          protocolo: "PB-HEET-2021-BO-02.2",
          duracao: "50 min",
          titulo: "A Escolha de Sofia",
          natureza: "Queda na Pressão da Usina de O2 e Protocolo de Finitude",
          plantonista: "Dra. Mariana Costa & Uana Pirilampo",
          classificacao: "VERMELHO // CÓDIGO DE PARADA CARDIORRESPIRATÓRIA",
          coldOpen: "O alarme sonoro da usina central de oxigênio dispara no subsolo: a pressão cai para níveis críticos de asfixia em massa.",
          desenvolvimento: "Mariana e Uana têm apenas 1 ventilador vago para 2 pacientes em insuficiência aguda: o respeitado Dr. Samuel (médico idoso) ou uma jovem grávida da periferia.",
          climax: "Mariana decide salvar a gestante; Aziz manobra clandestinamente válvulas mecânicas manuais no subsolo para manter Dr. Samuel vivo por mais 3 horas."
        },
        {
          numero: "2.3",
          protocolo: "PB-HEET-2021-BO-02.3",
          duracao: "45 min",
          titulo: "O Colapso & Vingança",
          natureza: "Óbito por Falha de Insumo e Rebelião no Almoxarifado",
          plantonista: "Amanda Silveira & Dra. Renata Albuquerque",
          classificacao: "VERMELHO // PARADA EM PROFISSIONAL DE SAÚDE",
          coldOpen: "Laila tem parada respiratória fulminante na UTI. Amanda tenta reanimá-la em prantos enquanto a cânula de oxigênio sopra ar sem pressão.",
          desenvolvimento: "Laila morre por falta de ventilador e insumos básicos. Amanda descobre que caixas de máscaras N95 e medicamentos estavam estocados na sala trancada de Tarcísio para campanha eleitoral.",
          climax: "Amanda arromba o gabinete da direção com uma barra de ferro, distribui EPIs aos berros para a equipe e é contida pelos seguranças particulares."
        }
      ]
    },
    {
      id: 3,
      titulo: "ARCO 3: A PRIVATIZAÇÃO",
      periodo: "18/11/2026 • Pós-Pandemia • Era das Organizações Sociais (OS) e IA",
      contexto: "Gestão Neoliberal por OS, Descarte Algorítmico e Cirurgia Clandestina",
      descricaoOcorrencia: "O HEET foi qualificado e terceirizado para a Organização Social 'Instituto Vida & Gestão'. Médicos pejotizados, metas de corte de custos monitoradas por IA e descarte de pacientes sem prognóstico financeiro.",
      statusNIR: "SISTEMA ALGORÍTMICO INTEGRADO • GLITCH DETECTADO",
      mentiraTitulo: "A Eficiência Neutra dos Algoritmos",
      mentiraDescricao: "A falácia corporativa de que a gestão privada por Organizações Sociais e algoritmos de triagem eliminou a corrupção e aumentou a eficácia. Na verdade, a IA foi calibrada para cortar custos rejeitando pacientes vulneráveis.",
      conflitoCentral: "O confronto final entre a medicina guiada por lucro/dados frios e a desobediência ética clandestina para salvar um trabalhador idoso descartado.",
      corBadge: "border-t-purple-600",
      badgeTexto: "MENTIRA ESTRUTURAL A3",
      episodios: [
        {
          numero: "3.1",
          protocolo: "PB-HEET-2026-BO-03.1",
          duracao: "45 min",
          titulo: "O Novo Normal",
          natureza: "Implantação de Totens de Autoatendimento e Prontuário por IA",
          plantonista: "Dra. Renata Albuquerque (Diretora Geral da OS)",
          classificacao: "AZUL // AUDITORIA GERENCIAL DE METAS",
          coldOpen: "Totens eletrônicos com reconhecimento facial e robôs de triagem substituem os técnicos na recepção do HEET.",
          desenvolvimento: "Renata agora veste terno executivo como diretora da OS. Médicos que demoram mais de 7 minutos por consulta recebem notificação de advertência no tablet com corte de honorários.",
          climax: "Seu Moacir, idoso de 72 anos e ex-porteiro do HEET com abdome agudo cirúrgico, recebe bandeira azul da IA por 'baixo retorno do investimento terapêutico' e é colocado para esperar na calçada."
        },
        {
          numero: "3.2",
          protocolo: "PB-HEET-2026-BO-03.2",
          duracao: "48 min",
          titulo: "O Glitch Humano",
          natureza: "Sabotagem de Metadados e Conspiração Clínica da Madrugada",
          plantonista: "Uana Pirilampo & Dra. Mariana Costa",
          classificacao: "AMARELO // MANIPULAÇÃO DE BANCO DE DADOS",
          coldOpen: "Uana analisa as linhas de código do software da OS e descobre o viés etário embutido que nega suporte intensivo a maiores de 65 anos.",
          desenvolvimento: "Mariana examina Seu Moacir escondido no depósito de expurgo e constata perfuração de víscera oca: ele tem menos de 6 horas de vida sem laparotomia de emergência.",
          climax: "Mariana, Amanda e Uana decidem operar Seu Moacir clandestinamente durante a madrugada; procuram Renata, que finge não ver os logs de desligamento de câmeras."
        },
        {
          numero: "3.3",
          protocolo: "PB-HEET-2026-BO-03.3",
          duracao: "52 min",
          titulo: "A Cirurgia Clandestina & Libertação",
          natureza: "Invasão do Centro Cirúrgico Lacrado e Conspiração Multidisciplinar",
          plantonista: "Equipe Completa Multidisciplinar (Mariana, Amanda, Renata, Uana, Aziz)",
          classificacao: "VERMELHO // OPERAÇÃO CLANDESTINA DE RISCO DE VIDA",
          coldOpen: "Às 03:12 da madrugada, Aziz destrava a porta da Sala de Cirurgia 4 lacrada pela auditoria através de um atalho nos dutos do subsolo.",
          desenvolvimento: "Mariana abre o abdome de Seu Moacir sob a luz trêmula de baterias de emergência. A segurança corporativa da OS cerca os corredores; Renata aparece na antessala, fecha a porta corta-fogo, veste luvas e assume o campo para ajudar a estancar o sangramento.",
          climax: "Moacir sobrevive. Ao amanhecer, a auditoria invade o bloco cirúrgico; a equipe recusa-se a entregar os bisturis. Pela primeira vez em anos, os profissionais caminham juntos pelo corredor com a dignidade reconquistada, enquanto a sirene da ambulância ilumina o piso de granilite."
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // DOSSIÊ DE EVIDÊNCIAS CIENTÍFICAS & LAUDOS EPIDEMIOLÓGICOS (UFPB / CNPQ)
  // --------------------------------------------------------------------------
  EVIDENCIAS: [
    {
      id: 1,
      tag: "ESTUDO I // SURVEY QUANTITATIVO",
      titulo: "Boletim de Resultados do Estudo I — Perfil Socioeconômico, Condições Laborais e Sentido do Trabalho",
      arquivo: "docs/relatorios/estudo-01-saude-trabalhador-covid19.pdf",
      tamanho: "16.5 MB (40 páginas)",
      periodo: "Novembro/2020 a Fevereiro/2021",
      coordenacao: "Profa. Dra. Thaís Máximo (UFPB / CNPq)",
      destaques: [
        "Levantamento quantitativo regional com profissionais de 23 categorias do SUS nos 9 estados nordestinos (49% na Paraíba).",
        "Evidencia sobrecarga crônica de trabalho, multivinculação contratual e jornadas extenuantes acima de 60 horas semanais.",
        "Falhas graves no fornecimento contínuo de Equipamentos de Proteção Individual (EPIs) adequados.",
        "Impacto psíquico profundo na enfermagem e equipes de apoio higiênico."
      ]
    },
    {
      id: 2,
      tag: "ESTUDO II // PESQUISA QUALITATIVA",
      titulo: "Boletim de Resultados do Estudo II — O Trabalho Real, Sofrimento e Enfrentamento na Linha de Frente",
      arquivo: "docs/relatorios/estudo-02-saude-trabalhador-covid19.pdf",
      tamanho: "6.2 MB (34 páginas)",
      periodo: "Julho/2021 a Novembro/2021",
      coordenacao: "Profa. Dra. Thaís Máximo (UFPB / CNPq)",
      destaques: [
        "51 entrevistas semiestruturadas em profundidade com profissionais de saúde analisadas via software Iramuteq.",
        "Relatos orais dramáticos sobre a paramentação sufocante, sede, calor e lesões faciais por pressão de máscaras N95.",
        "Denúncias contundentes de racionamento seletivo de EPIs pela administração hospitalar.",
        "Sentimento de estigma social da população e colapso emocional de trabalhadores confinados."
      ]
    },
    {
      id: 3,
      tag: "ESTUDO III // SAÚDE & SEGURANÇA",
      titulo: "Boletim de Resultados do Estudo III — Condições de Segurança, Violência no Trabalho e Medicalização",
      arquivo: "docs/relatorios/estudo-03-saude-trabalhador-covid19.pdf",
      tamanho: "5.7 MB (40 páginas)",
      periodo: "Agosto/2021 a Abril/2022",
      coordenacao: "Profa. Dra. Thaís Máximo (UFPB / CNPq)",
      destaques: [
        "Estudo ampliado com 1.003 profissionais das redes pública e privada da Paraíba e Nordeste.",
        "Taxa alarmante de contaminação prévia por COVID-19 atingindo 55,3% dos profissionais entrevistados.",
        "Registros documentados de violência verbal e agressões físicas de familiares desesperados nas portas do hospital.",
        "Crescimento vertiginoso no consumo diário de ansiolíticos, antidepressivos e indutores de sono para aguentar os plantões."
      ]
    },
    {
      id: 4,
      tag: "RELATÓRIO TÉCNICO // PARCIAL",
      titulo: "Relatório Técnico Parcial — Mapeamento Institucional, Revisão Sistemática e Plataformas Tecnológicas",
      arquivo: "docs/relatorios/relatorio-tecnico-geral-covid19.pdf",
      tamanho: "10.3 MB (32 páginas)",
      periodo: "Julho/2020 a Fevereiro/2021",
      coordenacao: "Profa. Dra. Thaís Máximo (UFPB / CNPq)",
      destaques: [
        "Prestação de contas e mapeamento técnico submetido ao CNPq e Ministério da Saúde.",
        "Disparidades metodológicas severas e inconsistências nos boletins epidemiológicos oficiais dos estados nordestinos.",
        "Documentação da infraestrutura de dados para suporte tecnológico (Observatório Web e Aplicativo de Notificação).",
        "Sistematização de artigos científicos e teses que subsidiam a fundamentação do roteiro de T.R.A.U.M.A."
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // MATRIZ COMPARATIVA DE MERCADO & RADAR DE GÊNERO (5 EIXOS)
  // --------------------------------------------------------------------------
  BENCHMARK: {
    eixos: [
      "Realismo Clínico (Dados Reais)",
      "Pressão Sistêmica / Burocracia",
      "Misticismo Sutil (Realismo Mágico)",
      "Conflito Moral / Ética de Guerra",
      "Ritmo de Urgência Contínuo"
    ],
    series: [
      {
        nome: "T.R.A.U.M.A. (HEET)",
        cor: "rgba(12, 50, 111, 0.85)",
        borda: "#0c326f",
        valores: [98, 95, 80, 96, 92],
        resumo: "Foco absoluto na realidade nordestina, dados empíricos da UFPB, confinamento claustrofóbico e elemento místico sutil (Aziz)."
      },
      {
        nome: "Sob Pressão (Globo)",
        cor: "rgba(220, 38, 38, 0.4)",
        borda: "#dc2626",
        valores: [90, 85, 10, 88, 90],
        resumo: "Drama médico realista carioca focado na escassez de recursos públicos e heroísmo individual de Evandro e Carolina."
      },
      {
        nome: "Plantão Médico / ER (NBC)",
        cor: "rgba(16, 185, 129, 0.4)",
        borda: "#10b981",
        valores: [85, 75, 5, 80, 85],
        resumo: "A matriz clássica americana do drama médico procedural de urgência, equilibrando vida pessoal e emergência hospitalar."
      },
      {
        nome: "The Pitt (Max)",
        cor: "rgba(147, 51, 234, 0.4)",
        borda: "#9333ea",
        valores: [88, 90, 5, 85, 95],
        resumo: "Retrato hiper-realista da sobrecarga contemporânea de pronto-socorro pós-pandemia nos EUA."
      },
      {
        nome: "Grey's Anatomy (ABC)",
        cor: "rgba(245, 158, 11, 0.4)",
        borda: "#f59e0b",
        valores: [50, 40, 2, 60, 65],
        resumo: "Melodrama romântico operístico em ambiente hospitalar estilizado com foco nas relações interpessoais."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // CADASTRO TÉCNICO DE PRODUÇÃO & FICHA TÉCNICA AUTÊNTICA
  // --------------------------------------------------------------------------
  PRODUCAO: {
    especificacoesFormato: {
      formato: "Minissérie Dramática em Temporada Única (9 episódios x 45 min)",
      estrutura: "3 Arcos Históricos de 3 episódios (Prisão, Privação, Privatização)",
      genero: "Drama Médico / Distopia Burocrática Hipernormalizada",
      praca: "Estado da Parahyba (Nordeste • Universo Hipernormal)",
      publicoAlvo: "Jovens adultos e adultos fãs de ficção social densa"
    },
    locacoesPrincipais: [
      { local: "Corredor de Triagem / Porta", descricao: "O canteiro de superlotação crônica onde macas viram leitos permanentes." },
      { local: "Centro Cirúrgico (Sala 4)", descricao: "O bunker de precisão técnica, palco da cirurgia clandestina desobediente." },
      { local: "UTI Respiratória", descricao: "Isolamento por lonas plásticas, foco da escassez de ventiladores e privação de EPIs." },
      { local: "Sala da Diretoria Geral", descricao: "Espaço climatizado e asséptico onde Tarcísio comete a violência burocrática." },
      { local: "Subsolo & Dutos", descricao: "O território invisível de Aziz, matriz da fiação predial e rota de fuga." }
    ],
    parametrosPesquisa: {
      titulo: "Parâmetros de Pesquisa Empírica",
      itens: [
        { termo: "Base Documental", descricao: "Pesquisa fundamentada nos relatórios e produções acadêmicas da Profa. Dra. Thaís Máximo (UFPB / Observatório da Saúde do Trabalhador) sobre a precarização e o sofrimento dos trabalhadores da saúde no SUS/Trauma." },
        { termo: "Sem Didatismo", descricao: "Os dados epidemiológicos operam como forças dramáticas invisíveis que empurram os personagens para o limite." },
        { termo: "Conflito Materialista", descricao: "A medicina não é tratada como sacerdócio sagrado, mas como trabalho precarizado sob cerco do capital." }
      ],
      realizacao: "Centro Comunitário-Criativo Poligonal"
    },
    contato: {
      instituicao: "Centro Comunitário-Criativo Poligonal",
      email: "poligonalhub@gmail.com",
      website: "https://poligonalhub.com",
      instagram: "@poligonalhub",
      substack: "https://poligonal.substack.com"
    }
  }
};

// Exportação compatível com ambientes Node/Browser/ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TRAUMA_SYSTEM;
}
