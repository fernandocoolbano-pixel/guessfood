import { Recipe, RecipeCategory } from '../types';

export interface BaseRecipeTemplate {
  id: string;
  title: string;
  category: RecipeCategory;
  description: string;
  prepTimeMinutes: number;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  servings: number;
  requiredAppliances: string[];
  primaryIngredients: string[];
  optionalIngredients: string[];
  mealMoments: string[];
  steps: {
    title: string;
    description: string;
    timerMinutes?: number;
  }[];
  chefTip: string;
  adaptedAlternativeText?: string;
}

export const RECIPE_DATABASE: BaseRecipeTemplate[] = [
  // 1. Air fryer - Frango Crocante com Batatas
  {
    id: 'frango-crocante-airfryer',
    title: 'Frango Dourado com Batatas Crocantes na Air Fryer',
    category: 'incrementado',
    description: 'Pedaços suculentos de frango com batatas temperadas com páprica e azeite, assadas até atingirem crocância perfeita.',
    prepTimeMinutes: 25,
    difficulty: 'Fácil',
    servings: 2,
    requiredAppliances: ['airfryer'],
    primaryIngredients: ['frango', 'batata'],
    optionalIngredients: ['azeite', 'alho', 'sal', 'páprica', 'limão'],
    mealMoments: ['almoco', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Cortar e temperar',
        description: 'Corte o frango em cubos médios e as batatas em gomos finos. Tempere tudo com sal, alho picado ou o que tiver na despensa e um fio de azeite.',
      },
      {
        title: 'Pré-aquecer e acomodar',
        description: 'Acomode o frango e as batatas no cesto da Air Fryer, sem empilhar em excesso para o ar circular.',
      },
      {
        title: 'Dourar na Air Fryer',
        description: 'Ligue a 190°C por 20 a 25 minutos. Abra na metade do tempo e chacoalhe o cesto para dourar por igual.',
        timerMinutes: 22,
      },
      {
        title: 'Finalizar e servir',
        description: 'Sirva fumegante com umas gotas de limão ou o molho de sua preferência.',
      },
    ],
    chefTip: 'Se quiser ainda mais crocante, seque as batatas cruas num pano de prato limpo antes de temperar!',
    adaptedAlternativeText: 'Se não tiver páprica ou limão, apenas sal e um pouquinho de óleo já deixam o frango e a batata sensacionais na Air Fryer.',
  },

  // 2. Sanduicheira - Tostex Gourmet Caprichado
  {
    id: 'tostex-gourmet-sanduicheira',
    title: 'Tostex Crocante de Queijo com Tomate e Orégano',
    category: 'rapido',
    description: 'Pão tostadinho com queijo derretido, rodelas de tomate suculento e um toque de manteiga dourada na sanduicheira.',
    prepTimeMinutes: 8,
    difficulty: 'Fácil',
    servings: 1,
    requiredAppliances: ['sanduicheira'],
    primaryIngredients: ['pão', 'queijo'],
    optionalIngredients: ['tomate', 'manteiga', 'orégano', 'presunto'],
    mealMoments: ['cafe', 'lanche', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Montar as fatias',
        description: 'Passe uma camada fina de manteiga na parte externa dos pães. Recheie com queijo generoso e fatias de tomate.',
      },
      {
        title: 'Tostar na sanduicheira',
        description: 'Coloque na sanduicheira já aquecida e feche. Deixe tostar por 4 a 6 minutos até que o queijo derreta e a casca fique douradinha.',
        timerMinutes: 5,
      },
      {
        title: 'Cortar ao meio',
        description: 'Retire com cuidado, corte na diagonal e aproveite o queijo puxando fios!',
      },
    ],
    chefTip: 'Passar manteiga ou requeijão no lado de fora do pão cria uma crosta dourada inacreditável.',
    adaptedAlternativeText: 'Se faltar tomate, faça apenas com queijo e manteiga ou adicione uma pitada de açúcar/canela para virar tostex doce.',
  },

  // 3. Fogão - Omelete Cremosa com Tomate e Queijo
  {
    id: 'omelete-cremosa-fogao',
    title: 'Omelete Macia Recheada com Queijo e Tomate',
    category: 'rapido',
    description: 'Ovos batidos aerados preparados na frigideira com recheio cremoso e casquinha macia.',
    prepTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 1,
    requiredAppliances: ['fogao'],
    primaryIngredients: ['ovos'],
    optionalIngredients: ['queijo', 'tomate', 'cebola', 'manteiga', 'sal'],
    mealMoments: ['cafe', 'lanche', 'jantar', 'almoco', 'decide_por_mim'],
    steps: [
      {
        title: 'Bater os ovos',
        description: 'Bata 2 a 3 ovos com um garfo vigorosamente até espumar levemente. Tempere com uma pitadinha de sal.',
      },
      {
        title: 'Aquecer a frigideira',
        description: 'Em fogo baixo na boca do fogão, derreta uma colherzinha de manteiga ou azeite na frigideira.',
      },
      {
        title: 'Cozinhar e rechear',
        description: 'Despeje os ovos batidos. Quando a base firmar mas o centro estiver úmido, adicione o queijo e o tomate picado.',
        timerMinutes: 4,
      },
      {
        title: 'Dobrar e servir',
        description: 'Dobre a omelete ao meio com uma espátula, espere mais 30 segundos para o queijo fundir e sirva.',
      },
    ],
    chefTip: 'O segredo da omelete perfeita é cozinhar em fogo baixo; fogo alto queima a base antes do interior ficar aveludado.',
    adaptedAlternativeText: 'Não tem queijo nem tomate? Apenas ovos bem batidos com sal e cebola picadinha já formam uma omelete digna de bistrô.',
  },

  // 4. Fogão - Arroz Cremoso Caipira (Aproveitamento Inteligente)
  {
    id: 'arroz-cremoso-caipira-fogao',
    title: 'Arroz Cremoso Caipira de Geladeira',
    category: 'incrementado',
    description: 'Transforma aquele arroz do dia anterior em um risoto brasileiro suculento com frango, queijo derretido e temperos.',
    prepTimeMinutes: 15,
    difficulty: 'Fácil',
    servings: 2,
    requiredAppliances: ['fogao'],
    primaryIngredients: ['arroz'],
    optionalIngredients: ['frango', 'queijo', 'cebola', 'tomate', 'leite', 'manteiga'],
    mealMoments: ['almoco', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Refogar a base',
        description: 'Numa panela em fogo médio, refogue cebola picada na manteiga ou óleo até dourar levemente.',
      },
      {
        title: 'Incorporar o arroz e recheio',
        description: 'Junte o arroz já cozido e o frango desfiado (ou o que tiver). Mexa por 2 minutos para aquecer.',
      },
      {
        title: 'Dar a cremosidade',
        description: 'Acrescente meio copo de leite ou água quente e mexa até absorver. Desligue o fogo e adicione o queijo picado, misturando até derreter.',
        timerMinutes: 5,
      },
      {
        title: 'Servir bem quente',
        description: 'Finalize com cheiro verde ou queijo ralado por cima e sirva imediatamente.',
      },
    ],
    chefTip: 'Nunca jogue arroz que sobrou fora: com um pouco de líquido quente e queijo, ele ganha textura de risoto reconfortante.',
    adaptedAlternativeText: 'Sem leite? Use um pouco de água morna com manteiga ou requeijão para dar a cremosidade necessária.',
  },

  // 5. Liquidificador - Crepioca / Panqueca Nuvem
  {
    id: 'panqueca-nuvem-liquidificador',
    title: 'Panqueca Leve de Banana e Ovos no Liquidificador',
    category: 'criativo',
    description: 'Massa cremosa e saudável batida em 1 minuto, sem farinha de trigo, perfeita para rechear com queijo ou comer doce.',
    prepTimeMinutes: 12,
    difficulty: 'Fácil',
    servings: 2,
    requiredAppliances: ['liquidificador', 'fogao'],
    primaryIngredients: ['banana', 'ovos'],
    optionalIngredients: ['aveia', 'canela', 'manteiga', 'mel'],
    mealMoments: ['cafe', 'lanche', 'sobremesa', 'decide_por_mim'],
    steps: [
      {
        title: 'Bater no liquidificador',
        description: 'Coloque as bananas, os ovos e 2 colheres de aveia (se tiver) no copo do liquidificador. Bata por 45 segundos até virar um creme uniforme.',
      },
      {
        title: 'Aquecer a frigideira',
        description: 'Unte uma frigideira com uma pontinha de manteiga e coloque no fogo baixo.',
      },
      {
        title: 'Dourar os discos',
        description: 'Despeje pequenas conchas da massa. Quando criar bolinhas na superfície, vire com cuidado e doure o outro lado por 1 minuto.',
        timerMinutes: 3,
      },
      {
        title: 'Servir',
        description: 'Empilhe os discos e sirva com canela, rodelas de banana fresca ou queijo derretido.',
      },
    ],
    chefTip: 'Bananas bem maduras deixam a massa naturalmente doce, dispensando açúcar.',
    adaptedAlternativeText: 'Se você não tiver aveia, faça apenas com banana amassada e ovos batidos vigorosamente.',
  },

  // 6. Micro-ondas - Bolo de Caneca Expresso
  {
    id: 'bolo-caneca-microondas',
    title: 'Bolo Fofinho de Caneca no Micro-ondas',
    category: 'rapido',
    description: 'Um bolinho quente e fofo pronto em 3 minutos dentro da sua caneca favorita usando o micro-ondas.',
    prepTimeMinutes: 4,
    difficulty: 'Fácil',
    servings: 1,
    requiredAppliances: ['microondas'],
    primaryIngredients: ['ovos', 'leite'],
    optionalIngredients: ['açúcar', 'manteiga', 'banana', 'aveia', 'achocolatado'],
    mealMoments: ['cafe', 'lanche', 'sobremesa', 'decide_por_mim'],
    steps: [
      {
        title: 'Misturar na caneca',
        description: 'Na caneca de cerâmica, misture 1 ovo batido, 2 colheres de leite, 1 colher de manteiga derretida e a banana amassada ou açúcar.',
      },
      {
        title: 'Homogeneizar',
        description: 'Misture bem com um garfo até ficar uniforme e sem grumos.',
      },
      {
        title: 'Assar no micro-ondas',
        description: 'Leve ao micro-ondas em potência alta por 1 minuto e meio a 2 minutos. O bolo vai crescer e firmar.',
        timerMinutes: 2,
      },
      {
        title: 'Aproveitar quente',
        description: 'Retire com cuidado da caneca quente e coma com colher.',
      },
    ],
    chefTip: 'Use uma caneca com capacidade mínima de 300ml para a massa não transbordar ao inflar no micro-ondas.',
    adaptedAlternativeText: 'Se faltar leite, pode usar 2 colheres de água morna com um pingo de óleo vegetal.',
  },

  // 7. Panela de Pressão - Carne Moída Desfiada com Batatas
  {
    id: 'carne-batata-panela-pressao',
    title: 'Gisado Macio de Carne com Batatas e Molho Rápido',
    category: 'incrementado',
    description: 'Prato reconfortante onde a carne e as batatas cozinham no caldo temperado sob pressão, desmanchando na boca.',
    prepTimeMinutes: 20,
    difficulty: 'Fácil',
    servings: 3,
    requiredAppliances: ['panela_pressao'],
    primaryIngredients: ['carne moída', 'batata'],
    optionalIngredients: ['cebola', 'tomate', 'alho', 'azeite', 'sal'],
    mealMoments: ['almoco', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Dourar e selar',
        description: 'Na panela de pressão aberta com azeite ou óleo, refogue a cebola e adicione a carne, refogando até perder a cor rosada.',
      },
      {
        title: 'Juntar os legumes',
        description: 'Adicione as batatas cortadas em cubos, o tomate picado e 1 xícara de água com sal.',
      },
      {
        title: 'Pegar pressão',
        description: 'Tampe a panela. Quando começar a chiar, abaixe o fogo e conte 10 minutos.',
        timerMinutes: 10,
      },
      {
        title: 'Finalizar',
        description: 'Deixe a pressão sair naturalmente, abra e mexa para o amido da batata engrossar o caldo.',
      },
    ],
    chefTip: 'As batatas soltam amido natural no caldo durante a pressão, dispensando qualquer espessante.',
    adaptedAlternativeText: 'Pode ser feito com peito de frango em cubos caso você não tenha carne moída disponível.',
  },

  // 8. Máquina de Waffle - Pão de Queijo de Waffle
  {
    id: 'waffle-pao-de-queijo',
    title: 'Waffle Dourado Crocante de Queijo e Ovos',
    category: 'criativo',
    description: 'Casquinha super crocante por fora e macia por dentro assada na máquina de waffle em minutos.',
    prepTimeMinutes: 7,
    difficulty: 'Fácil',
    servings: 2,
    requiredAppliances: ['waffle'],
    primaryIngredients: ['queijo', 'ovos'],
    optionalIngredients: ['amido', 'polvilho', 'leite', 'manteiga'],
    mealMoments: ['cafe', 'lanche', 'decide_por_mim'],
    steps: [
      {
        title: 'Misturar os ingredientes',
        description: 'Misture os ovos batidos com queijo ralado ou picadinho e uma colher de manteiga derretida.',
      },
      {
        title: 'Aquecer a chapa',
        description: 'Unte levemente as placas da máquina de waffle e espere acender a luz indicadora.',
      },
      {
        title: 'Pressionar e dourar',
        description: 'Despeje a massa no centro e feche a tampa. Asse por cerca de 4 a 6 minutos até dourar intensamente.',
        timerMinutes: 5,
      },
      {
        title: 'Saborear crocante',
        description: 'Retire com garfo de silicone e aproveite os favos crocantes cheios de sabor.',
      },
    ],
    chefTip: 'O queijo direto na chapa cria pequenos pontos crocantes que lembram a casquinha do pão de queijo mineiro.',
    adaptedAlternativeText: 'Se não tiver polvilho ou farinha, apenas ovos com queijo ralado na máquina de waffle viram o famoso "chaffle" cetogênico super crocante.',
  },

  // 9. Panela Elétrica - Risoto Prático de Frango com Legumes
  {
    id: 'risoto-panela-eletrica',
    title: 'Arroz Aromático Úmido com Frango e Cenoura na Panela Elétrica',
    category: 'incrementado',
    description: 'Tudo feito numa única panela elétrica sem sujar fogão, com tempero apurado e legumes macios.',
    prepTimeMinutes: 18,
    difficulty: 'Fácil',
    servings: 3,
    requiredAppliances: ['panela_eletrica'],
    primaryIngredients: ['arroz', 'frango'],
    optionalIngredients: ['cenoura', 'cebola', 'alho', 'azeite', 'sal'],
    mealMoments: ['almoco', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Ligar no modo cozinhar',
        description: 'Coloque a panela elétrica na função Cozinhar com um fio de azeite e doure a cebola e o frango picadinho.',
      },
      {
        title: 'Adicionar arroz e líquidos',
        description: 'Junte o arroz, cenoura picadinha, sal e a quantidade padrão de água recomendada pela sua panela.',
      },
      {
        title: 'Cozimento automático',
        description: 'Feche a tampa e deixe a panela trabalhar até mudar automaticamente para o modo Manter Aquecido.',
        timerMinutes: 15,
      },
      {
        title: 'Aveludar',
        description: 'Abra a tampa, adicione uma colherada de manteiga ou queijo, mexa delicadamente e sirva.',
      },
    ],
    chefTip: 'A panela elétrica mantém todo o vapor dentro, o que deixa o frango muito mais macio e úmido.',
    adaptedAlternativeText: 'Pode substituir cenoura por tomate picado ou batata em cubinhos.',
  },

  // 10. Forno - Batatas Rústicas Assadas com Ervas e Queijo
  {
    id: 'batatas-rusticas-forno',
    title: 'Batatas Rústicas Assadas Douradas no Forno',
    category: 'incrementado',
    description: 'Gomos de batata com casca, assados até ficarem crocantes nas bordas e cremosos por dentro, com queijo gratinado.',
    prepTimeMinutes: 30,
    difficulty: 'Fácil',
    servings: 2,
    requiredAppliances: ['forno'],
    primaryIngredients: ['batata'],
    optionalIngredients: ['azeite', 'queijo', 'sal', 'alho', 'alecrim'],
    mealMoments: ['almoco', 'jantar', 'lanche', 'decide_por_mim'],
    steps: [
      {
        title: 'Pré-aquecer e cortar',
        description: 'Ligue o forno a 200°C. Lave bem as batatas e corte em gomos mantendo a casca.',
      },
      {
        title: 'Temperar e dispor',
        description: 'Em uma assadeira, envolva as batatas com azeite ou óleo, sal e alho esmagado. Espalhe para não sobrepor.',
      },
      {
        title: 'Assar',
        description: 'Leve ao forno médio-alto por 25 a 30 minutos até dourarem.',
        timerMinutes: 28,
      },
      {
        title: 'Gratinar com queijo',
        description: 'Salpique queijo por cima nos últimos 4 minutos de forno para derreter e criar uma crosta.',
      },
    ],
    chefTip: 'Ferver as batatas cortadas por 3 minutos em água antes de levar ao forno deixa o interior igual purê e a casca crocante.',
    adaptedAlternativeText: 'Sem queijo? Apenas azeite ou óleo com sal e qualquer erva seca já deixa as batatas espetaculares.',
  },

  // 11. Fogão - Macarrão Alho, Óleo e Tomate Fresco
  {
    id: 'macarrao-alho-oleo-tomate',
    title: 'Massa Rápida ao Alho e Óleo com Tomates Salteados',
    category: 'rapido',
    description: 'A clássica massa italiana reconfortante pronta em 12 minutos com apenas 3 ingredientes essenciais.',
    prepTimeMinutes: 12,
    difficulty: 'Fácil',
    servings: 2,
    requiredAppliances: ['fogao'],
    primaryIngredients: ['macarrão'],
    optionalIngredients: ['alho', 'tomate', 'azeite', 'queijo', 'sal'],
    mealMoments: ['almoco', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Cozinhar a massa',
        description: 'Em água fervente com sal abundante no fogão, cozinhe o macarrão até ficar al dente. Reserve meia xícara da água do cozimento.',
        timerMinutes: 8,
      },
      {
        title: 'Dourar o alho',
        description: 'Em outra panela ou frigideira com óleo ou azeite, doure lâminas finas de alho sem queimar.',
      },
      {
        title: 'Saltear os tomates',
        description: 'Junte os tomates picados e mexa por 1 minuto para soltarem o suco.',
      },
      {
        title: 'Emulsionar e servir',
        description: 'Despeje o macarrão escorrido e duas colheres da água reservada. Misture vigorosamente e polvilhe queijo se desejar.',
      },
    ],
    chefTip: 'A água do cozimento do macarrão contém amido e cria uma emulsão aveludada instantânea com o azeite.',
    adaptedAlternativeText: 'Se faltar tomate, faça a receita clássica tradicional apenas com alho, óleo/manteiga e uma pitada de sal.',
  },

  // 12. Liquidificador - Suco Refrescante Tropical Cremoso
  {
    id: 'suco-cremoso-tropical-liquidificador',
    title: 'Smoothie Cremoso Refrescante de Banana e Limão',
    category: 'rapido',
    description: 'Bebida aveludada, energizante e refrescante batida geladinha em segundos.',
    prepTimeMinutes: 3,
    difficulty: 'Fácil',
    servings: 1,
    requiredAppliances: ['liquidificador'],
    primaryIngredients: ['banana'],
    optionalIngredients: ['leite', 'limão', 'aveia', 'açúcar', 'gelo'],
    mealMoments: ['cafe', 'lanche', 'bebida', 'decide_por_mim'],
    steps: [
      {
        title: 'Juntar no copo',
        description: 'Coloque a banana picada, 1 copo de leite (ou água), algumas gotas de suco de limão e cubos de gelo.',
      },
      {
        title: 'Bater em potência máxima',
        description: 'Ligue o liquidificador por 45 segundos até espumar e ficar bem cremoso.',
        timerMinutes: 1,
      },
      {
        title: 'Servir geladíssimo',
        description: 'Despeje num copo alto e aproveite a textura aveludada.',
      },
    ],
    chefTip: 'O limão quebra o doce da banana e adiciona um frescor cítrico inesperado.',
    adaptedAlternativeText: 'Pode ser feito com água filtrada ou água de coco em vez de leite.',
  },

  // 13. Fogão - Torta Rápida de Frigideira com Queijo
  {
    id: 'torta-frigideira-fogao',
    title: 'Torta Salgada Dourada de Frigideira',
    category: 'criativo',
    description: 'Uma torta individual alta, macia e recheada que não vai ao forno e fica pronta em menos de 15 minutos.',
    prepTimeMinutes: 14,
    difficulty: 'Fácil',
    servings: 2,
    requiredAppliances: ['fogao'],
    primaryIngredients: ['ovos', 'leite'],
    optionalIngredients: ['queijo', 'tomate', 'cebola', 'manteiga', 'fermento'],
    mealMoments: ['almoco', 'jantar', 'lanche', 'decide_por_mim'],
    steps: [
      {
        title: 'Bater a base',
        description: 'Em uma tigela com garfo, bata 2 ovos, 3 colheres de leite e uma pitada de sal.',
      },
      {
        title: 'Adicionar recheio',
        description: 'Misture cubos de queijo, tomate e cebola picadinha na própria massa líquida.',
      },
      {
        title: 'Tampar a frigideira',
        description: 'Despeje na frigideira untada em fogo bem baixo e TAMPE. O vapor cozinha a parte de cima.',
        timerMinutes: 6,
      },
      {
        title: 'Virar como panqueca',
        description: 'Quando a superfície estiver firme, vire com auxílio da tampa e deixe mais 2 minutos para dourar o outro lado.',
      },
    ],
    chefTip: 'Tampar a frigideira é essencial para reter o calor e assar por igual como um mini forno no fogão.',
    adaptedAlternativeText: 'Substitua leite por água e use qualquer frios ou sobras de carnes que tiver na geladeira.',
  },

  // 14. Air fryer - Queijo Quente com Crosta Tostada na Air Fryer
  {
    id: 'queijo-quente-crocante-airfryer',
    title: 'Queijo Quente Dourado Ultra Crocante na Air Fryer',
    category: 'rapido',
    description: 'A Air Fryer tosta os dois lados do pão por igual em 5 minutos enquanto o interior derrete completamente.',
    prepTimeMinutes: 6,
    difficulty: 'Fácil',
    servings: 1,
    requiredAppliances: ['airfryer'],
    primaryIngredients: ['pão', 'queijo'],
    optionalIngredients: ['manteiga', 'tomate', 'orégano'],
    mealMoments: ['cafe', 'lanche', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Montar o sanduíche',
        description: 'Coloque fatias fartas de queijo entre dois pães e passe manteiga nas partes externas.',
      },
      {
        title: 'Air fryer a 180°C',
        description: 'Coloque no cesto da Air Fryer (se o pão for muito leve, espete um palito para a ventoinha não deslocar a fatia de cima).',
      },
      {
        title: 'Aquecer e dourar',
        description: 'Ligue a 180°C por 5 minutos até a casquinha ficar dourada e crocante como uma torrada de padaria.',
        timerMinutes: 5,
      },
      {
        title: 'Servir',
        description: 'Corte ao meio e sinta o croc-croc irresistível.',
      },
    ],
    chefTip: 'Colocar uma fatia de queijo por cima do pão no último minuto cria uma crosta gratinada gourmet.',
    adaptedAlternativeText: 'Pode usar pão francês amanhecido, pão de forma ou pão sírio.',
  },

  // 15. Micro-ondas - Omelete de Caneca Suave
  {
    id: 'omelete-caneca-microondas',
    title: 'Omelete de Caneca Sem Gordura no Micro-ondas',
    category: 'rapido',
    description: 'Zero óleo, zero frigideira para lavar e pronta em 90 segundos para saciar a fome com proteína.',
    prepTimeMinutes: 3,
    difficulty: 'Fácil',
    servings: 1,
    requiredAppliances: ['microondas'],
    primaryIngredients: ['ovos'],
    optionalIngredients: ['queijo', 'tomate', 'leite', 'sal', 'cebola'],
    mealMoments: ['cafe', 'lanche', 'jantar', 'decide_por_mim'],
    steps: [
      {
        title: 'Bater na caneca',
        description: 'Unte levemente a caneca com uma gota de azeite ou manteiga. Quebre 2 ovos, adicione 1 colher de leite ou água e bata bem com garfo.',
      },
      {
        title: 'Adicionar complementos',
        description: 'Misture pedacinhos de queijo e tomate picado com uma pitada de sal.',
      },
      {
        title: 'Micro-ondas',
        description: 'Ligue na potência média/alta por 1 minuto e 20 segundos. Se o centro ainda estiver cru, dê mais 20 segundos.',
        timerMinutes: 1,
      },
      {
        title: 'Comer',
        description: 'Coma direto na caneca ainda fumegante.',
      },
    ],
    chefTip: 'Pausar o micro-ondas na metade do tempo e dar uma rápida mexidinha garante uma textura ainda mais uniforme.',
    adaptedAlternativeText: 'Apenas ovos e uma pitada de sal na caneca já resultam num almoço rápido e nutritivo.',
  },
];

// Smart Culinary Matcher & Solver
export function matchAndSolveRecipes(params: {
  userIngredients: string[];
  userAppliances: string[];
  mealType?: string;
}): Recipe[] {
  const { userIngredients, userAppliances, mealType } = params;

  const normalizedUserIngredients = userIngredients.map(i =>
    i.toLowerCase().trim()
  );
  const normalizedUserAppliances = userAppliances.map(a =>
    a.toLowerCase().trim()
  );

  // 1. FILTER: strictly respect appliances
  const applianceCompatible = RECIPE_DATABASE.filter(template => {
    return template.requiredAppliances.every(reqApp =>
      normalizedUserAppliances.includes(reqApp.toLowerCase())
    );
  });

  // 2. Score by ingredients match
  const scored = applianceCompatible.map(template => {
    let matchedCount = 0;
    const allIngredientsToCheck = [
      ...template.primaryIngredients,
      ...template.optionalIngredients,
    ];

    allIngredientsToCheck.forEach(ing => {
      const isPresent = normalizedUserIngredients.some(
        userIng => userIng.includes(ing) || ing.includes(userIng)
      );
      if (isPresent) matchedCount++;
    });

    const primaryMatched = template.primaryIngredients.filter(ing =>
      normalizedUserIngredients.some(
        userIng => userIng.includes(ing) || ing.includes(userIng)
      )
    ).length;

    // Check if meal moment matches
    const momentMatches =
      !mealType ||
      mealType === 'decide_por_mim' ||
      template.mealMoments.includes(mealType);

    const score =
      primaryMatched * 4 + matchedCount * 2 + (momentMatches ? 3 : 0);

    return {
      template,
      score,
      primaryMatched,
      matchedCount,
    };
  });

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  // Pick up to 1 per category: rapido, pratico, incrementado, criativo
  const selectedCategories: Record<RecipeCategory, BaseRecipeTemplate | null> = {
    rapido: null,
    pratico: null,
    incrementado: null,
    criativo: null,
  };

  for (const item of scored) {
    const cat = item.template.category;
    if (!selectedCategories[cat]) {
      selectedCategories[cat] = item.template;
    }
  }

  // Format into final Recipe objects
  const finalRecipes: Recipe[] = [];

  const categoriesOrder: RecipeCategory[] = ['rapido', 'pratico', 'incrementado', 'criativo'];

  for (const cat of categoriesOrder) {
    const template = selectedCategories[cat];
    if (template) {
      // Determine owned vs missing ingredients
      const ingredientsUsed = [
        ...template.primaryIngredients.map(name => {
          const isOwned = normalizedUserIngredients.some(
            u => u.includes(name) || name.includes(u)
          );
          return {
            name: capitalize(name),
            amount: isOwned ? 'A gosto / Conforme disponível' : '1 porção',
            isOwned,
          };
        }),
        ...template.optionalIngredients.slice(0, 3).map(name => {
          const isOwned = normalizedUserIngredients.some(
            u => u.includes(name) || name.includes(u)
          );
          return {
            name: capitalize(name),
            amount: 'A gosto',
            isOwned,
          };
        }),
      ];

      const missing = ingredientsUsed.find(i => !i.isOwned);
      const hasAll = !missing;

      finalRecipes.push({
        id: template.id,
        title: template.title,
        category: template.category,
        description: template.description,
        prepTimeMinutes: template.prepTimeMinutes,
        difficulty: template.difficulty,
        servings: template.servings,
        appliancesUsed: template.requiredAppliances,
        ingredientsUsed,
        hasAllIngredients: hasAll,
        missingIngredient: missing ? missing.name : undefined,
        adaptedForPantryOnly:
          template.adaptedAlternativeText ||
          `Se você não tiver ${missing?.name || 'algum tempero'}, prepare apenas com os ingredientes disponíveis adaptando o tempero.`,
        steps: template.steps.map((s, idx) => ({
          stepNumber: idx + 1,
          title: s.title,
          description: s.description,
          timerMinutes: s.timerMinutes,
        })),
        chefTip: template.chefTip,
      });
    }
  }

  // If none matched because of rare appliances/ingredients, dynamically synthesize a recipe:
  if (finalRecipes.length === 0 && normalizedUserAppliances.length > 0) {
    const app = normalizedUserAppliances[0];
    const ing1 = userIngredients[0] || 'Ingredientes da despensa';
    const ing2 = userIngredients[1] || 'temperos a gosto';

    finalRecipes.push({
      id: `custom-recipe-${Date.now()}`,
      title: `Preparo Rápido de ${capitalize(ing1)} na Cozinha`,
      category: 'rapido',
      description: `Uma combinação prática e direta feita sob medida para o seu equipamento (${app}) usando ${ing1} e ${ing2}.`,
      prepTimeMinutes: 15,
      difficulty: 'Fácil',
      servings: 2,
      appliancesUsed: [app],
      ingredientsUsed: userIngredients.map(name => ({
        name: capitalize(name),
        amount: 'A gosto',
        isOwned: true,
      })),
      hasAllIngredients: true,
      steps: [
        {
          stepNumber: 1,
          title: 'Preparação inicial',
          description: `Higienize e corte ${ing1} em pedaços uniformes para um cozimento equilibrado.`,
        },
        {
          stepNumber: 2,
          title: 'Temperar e acomodar',
          description: `Tempere com sal e especiarias de sua preferência. Acomode no seu equipamento (${app}).`,
        },
        {
          stepNumber: 3,
          title: 'Cozinhar no ponto ideal',
          description: `Deixe dourar ou cozinhar até atingir o ponto desejado, cuidando para não passar do ponto.`,
          timerMinutes: 10,
        },
        {
          stepNumber: 4,
          title: 'Servir',
          description: 'Sirva quente imediatamente e aproveite sua refeição!',
        },
      ],
      chefTip: 'Misturar um toque de azeite ou manteiga sempre ajuda a intensificar os aromas.',
    });
  }

  return finalRecipes;
}

// Filter recipes according to user-selected cooking effort (Rápido, Prático, Incrementado)
export function matchRecipesForEffort(params: {
  userIngredients: string[];
  userAppliances: string[];
  effort: 'rapido' | 'pratico' | 'incrementado';
}): Recipe[] {
  const { userIngredients, userAppliances, effort } = params;
  const normalizedUserIngredients = userIngredients.map(i => i.toLowerCase().trim());
  const normalizedUserAppliances = userAppliances.map(a => a.toLowerCase().trim());

  // 1. Filter strictly by appliances
  const applianceCompatible = RECIPE_DATABASE.filter(template => {
    return template.requiredAppliances.every(reqApp =>
      normalizedUserAppliances.includes(reqApp.toLowerCase())
    );
  });

  // 2. Score by ingredients match
  const scored = applianceCompatible.map(template => {
    let matchedCount = 0;
    const allIngredientsToCheck = [
      ...template.primaryIngredients,
      ...template.optionalIngredients,
    ];

    allIngredientsToCheck.forEach(ing => {
      const isPresent = normalizedUserIngredients.some(
        userIng => userIng.includes(ing) || ing.includes(userIng)
      );
      if (isPresent) matchedCount++;
    });

    const primaryMatched = template.primaryIngredients.filter(ing =>
      normalizedUserIngredients.some(
        userIng => userIng.includes(ing) || ing.includes(userIng)
      )
    ).length;

    // Effort bonus
    let effortBonus = 0;
    if (effort === 'rapido') {
      if (template.prepTimeMinutes <= 15 || template.category === 'rapido') effortBonus += 8;
    } else if (effort === 'pratico') {
      if (template.steps.length <= 3 || template.requiredAppliances.length === 1) effortBonus += 8;
    } else if (effort === 'incrementado') {
      if (template.category === 'incrementado' || template.prepTimeMinutes >= 18) effortBonus += 8;
    }

    const score = primaryMatched * 5 + matchedCount * 2 + effortBonus;

    return {
      template,
      score,
      primaryMatched,
      matchedCount,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick top 2 to 4 recipes for the wheel
  const topTemplates = scored.slice(0, 4).map(s => s.template);

  const recipes: Recipe[] = topTemplates.map(template => {
    const ingredientsUsed = [
      ...template.primaryIngredients.map(name => {
        const isOwned = normalizedUserIngredients.some(
          u => u.includes(name) || name.includes(u)
        );
        return {
          name: capitalize(name),
          amount: isOwned ? 'A gosto / Conforme disponível' : '1 porção',
          isOwned,
        };
      }),
      ...template.optionalIngredients.slice(0, 2).map(name => {
        const isOwned = normalizedUserIngredients.some(
          u => u.includes(name) || name.includes(u)
        );
        return {
          name: capitalize(name),
          amount: 'A gosto',
          isOwned,
        };
      }),
    ];

    const missing = ingredientsUsed.find(i => !i.isOwned);

    return {
      id: template.id,
      title: template.title,
      category: template.category,
      description: template.description,
      prepTimeMinutes: template.prepTimeMinutes,
      difficulty: template.difficulty,
      servings: template.servings,
      appliancesUsed: template.requiredAppliances,
      ingredientsUsed,
      hasAllIngredients: !missing,
      missingIngredient: missing ? missing.name : undefined,
      adaptedForPantryOnly:
        template.adaptedAlternativeText ||
        `Prepare apenas com os ingredientes disponíveis adaptando o tempero.`,
      steps: template.steps.map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title,
        description: s.description,
        timerMinutes: s.timerMinutes,
      })),
      chefTip: template.chefTip,
    };
  });

  // Fallback if none matched
  if (recipes.length === 0) {
    return matchAndSolveRecipes({ userIngredients, userAppliances });
  }

  return recipes;
}

// Special Occasions Solver
export function matchOccasionRecipes(params: {
  occasionId: string;
  userIngredients: string[];
  userAppliances: string[];
}): Recipe[] {
  const { occasionId, userIngredients, userAppliances } = params;
  const base = matchAndSolveRecipes({ userIngredients, userAppliances });

  // Map occasion customization
  const occasionTitles: Record<string, { prefix: string; note: string }> = {
    amigos: {
      prefix: 'Tábua de Compartilhar: ',
      note: 'Perfeito para servir no centro da mesa com amigos.',
    },
    casal: {
      prefix: 'Especial a Dois: ',
      note: 'Aroma aconchegante e apresentação charmosa para dois.',
    },
    domingo: {
      prefix: 'Tradição de Domingo: ',
      note: 'Comida reconfortante de família com sabor de casa cheia.',
    },
    happy_hour: {
      prefix: 'Petisco de Boteco: ',
      note: 'Tira-gosto dourado e sequinho para beliscar sem pressa.',
    },
    comemoracao: {
      prefix: 'Receita Festiva: ',
      note: 'Prato marcante para celebrar um momento especial.',
    },
  };

  const custom = occasionTitles[occasionId] || { prefix: '', note: '' };

  return base.map(recipe => ({
    ...recipe,
    title: recipe.title.startsWith(custom.prefix) ? recipe.title : `${custom.prefix}${recipe.title}`,
    chefTip: `${recipe.chefTip || ''} ${custom.note}`.trim(),
    occasionId,
  }));
}

// DRINKS DATA & SOLVER
export interface DrinkTemplate {
  id: string;
  title: string;
  description: string;
  isAlcoholic: boolean;
  prepTimeMinutes: number;
  glassware: string;
  difficulty: 'Fácil' | 'Médio';
  primaryIngredients: string[];
  optionalIngredients: string[];
  steps: {
    title: string;
    description: string;
    timerMinutes?: number;
  }[];
  bartenderTip: string;
}

export const DRINKS_DATABASE: DrinkTemplate[] = [
  {
    id: 'caipirinha-classica',
    title: 'Caipirinha Tradicional Refrescante',
    description: 'O drink clássico brasileiro com limão macerado com açúcar, gelo e cachaça ou vodka.',
    isAlcoholic: true,
    prepTimeMinutes: 4,
    glassware: 'Copo baixo (On the Rocks)',
    difficulty: 'Fácil',
    primaryIngredients: ['limão', 'açúcar'],
    optionalIngredients: ['cachaça', 'vodka', 'gelo'],
    steps: [
      {
        title: 'Macerar o limão',
        description: 'Corte o limão em gomos retirando o miolo branco para não amargar. Coloque no copo com 1 a 2 colheres de açúcar e macere suavemente.',
      },
      {
        title: 'Adicionar gelo',
        description: 'Encha o copo com cubos de gelo até a borda.',
      },
      {
        title: 'Acrescentar a bebida',
        description: 'Adicione 50ml de cachaça ou vodka. Misture bem de baixo para cima com uma colher bailarina ou mexedor.',
      },
      {
        title: 'Servir',
        description: 'Decore com uma rodela de limão fresca e aproveite!',
      },
    ],
    bartenderTip: 'Retirar a parte branca central do limão evita qualquer amargor no drink.',
  },
  {
    id: 'gin-tropical',
    title: 'Gin Tropical com Frutas',
    description: 'Bebida aromática, leve e sofisticada com gin ou vodka, água tônica ou com gás e frutas frescas.',
    isAlcoholic: true,
    prepTimeMinutes: 3,
    glassware: 'Taça bojuda de Gin',
    difficulty: 'Fácil',
    primaryIngredients: ['gin'],
    optionalIngredients: ['água com gás', 'água tônica', 'morango', 'limão', 'gelo', 'laranja'],
    steps: [
      {
        title: 'Gelar a taça',
        description: 'Encha uma taça grande com bastante gelo e gire para resfriar o vidro.',
      },
      {
        title: 'Adicionar frutas e gin',
        description: 'Coloque fatias de morango ou limão e adicione uma dose (50ml) de gin.',
      },
      {
        title: 'Completar com tônica ou gás',
        description: 'Despeje a água tônica ou água com gás bem gelada devagar para preservar as borbulhas.',
      },
      {
        title: 'Mexer suavemente',
        description: 'Dê apenas uma leve mexida de baixo para cima e sirva.',
      },
    ],
    bartenderTip: 'Quanto mais gelo tiver a taça, mais devagar ele derrete e menos o drink fica aguado.',
  },
  {
    id: 'batida-morango-cremosa',
    title: 'Batida Cremosa de Morango',
    description: 'Doce, aveludada e refrescante batida no liquidificador em segundos.',
    isAlcoholic: true,
    prepTimeMinutes: 3,
    glassware: 'Copo alto ou taça',
    difficulty: 'Fácil',
    primaryIngredients: ['morango', 'leite condensado'],
    optionalIngredients: ['vodka', 'cachaça', 'gelo', 'leite'],
    steps: [
      {
        title: 'Juntar os ingredientes',
        description: 'No liquidificador, coloque morangos limpos, 3 colheres de leite condensado, gelo e uma dose de vodka (ou leite para versão sem álcool).',
      },
      {
        title: 'Bater até ficar cremoso',
        description: 'Bata na potência máxima por 30 segundos até triturar o gelo e criar uma textura de smoothie.',
      },
      {
        title: 'Servir',
        description: 'Despeje no copo e decore com um morango na borda.',
      },
    ],
    bartenderTip: 'Se não tiver leite condensado, leite com 2 colheres de açúcar e um pouco de creme já dá o mesmo toque cremoso.',
  },
  {
    id: 'mojito-hortela',
    title: 'Mojito Refrescante de Hortelã',
    description: 'O drink caribenho ultra refrescante com hortelã fresca, limão, açúcar e água gaseificada.',
    isAlcoholic: true,
    prepTimeMinutes: 5,
    glassware: 'Copo Long Drink',
    difficulty: 'Fácil',
    primaryIngredients: ['limão', 'hortelã', 'açúcar'],
    optionalIngredients: ['rum', 'vodka', 'água com gás', 'gelo'],
    steps: [
      {
        title: 'Despertar a hortelã',
        description: 'Bata suavemente as folhas de hortelã na palma da mão para soltar os óleos essenciais e coloque no copo.',
      },
      {
        title: 'Macerar com limão e açúcar',
        description: 'Adicione suco de 1 limão e 1 colher de açúcar. Macere com cuidado para não despedaçar as folhas.',
      },
      {
        title: 'Gelo e destilado',
        description: 'Encha o copo de gelo picado ou em cubos e adicione 50ml de rum ou vodka.',
      },
      {
        title: 'Completar com água com gás',
        description: 'Complete com água com gás e misture delicadamente.',
      },
    ],
    bartenderTip: 'Nunca esmague a hortelã com força excessiva, apenas pressione para liberar o frescor sem amargar.',
  },
  {
    id: 'soda-italiana-frutas',
    title: 'Soda Italiana Artesanal (Sem Álcool)',
    description: 'Bebida efervescente, frutada e perfeita para qualquer hora do dia.',
    isAlcoholic: false,
    prepTimeMinutes: 3,
    glassware: 'Copo alto com canudo',
    difficulty: 'Fácil',
    primaryIngredients: ['água com gás'],
    optionalIngredients: ['morango', 'limão', 'açúcar', 'gelo', 'hortelã'],
    steps: [
      {
        title: 'Preparar a base de fruta',
        description: 'No fundo do copo, amasse morangos ou frutas disponíveis com uma colher de açúcar ou mel.',
      },
      {
        title: 'Adicionar muito gelo',
        description: 'Preencha todo o copo com cubos de gelo.',
      },
      {
        title: 'Completar com gás',
        description: 'Adicione a água com gás bem gelada lentamente e finalize com umas gotas de limão.',
      },
      {
        title: 'Aproveitar',
        description: 'Sirva com um raminho de hortelã e mexa antes de beber.',
      },
    ],
    bartenderTip: 'Excelente opção não-alcoólica sofisticada para quem quer algo refrescante e com poucas calorias.',
  },
  {
    id: 'limonada-suica-cremosa',
    title: 'Limonada Suíça Cremosa (Sem Álcool)',
    description: 'Batida com casca e leite condensado, cremosa e agridoce sem igual.',
    isAlcoholic: false,
    prepTimeMinutes: 3,
    glassware: 'Copo alto',
    difficulty: 'Fácil',
    primaryIngredients: ['limão', 'leite condensado'],
    optionalIngredients: ['água', 'gelo', 'açúcar'],
    steps: [
      {
        title: 'Cortar os limões',
        description: 'Corte 2 limões bem lavados em 4 partes e retire o miolo branco central.',
      },
      {
        title: 'Bater ligeiro',
        description: 'Coloque no liquidificador com 500ml de água, 3 colheres de leite condensado e gelo. Bata no botão pulsar por apenas 5 a 8 segundos para não amargar.',
      },
      {
        title: 'Coar imediatamente',
        description: 'Passe pela peneira direto para a jarra ou copo.',
      },
      {
        title: 'Servir bem gelado',
        description: 'Beba na hora enquanto a espuma aveludada está no topo!',
      },
    ],
    bartenderTip: 'Bater apenas por poucos segundos é o grande segredo para extrair o aroma da casca sem amargar a bebida.',
  },
  {
    id: 'moscow-mule-caseiro',
    title: 'Moscow Mule Caseiro com Limão',
    description: 'Drink refrescante cítrico com toque aromático e espuma fresca.',
    isAlcoholic: true,
    prepTimeMinutes: 4,
    glassware: 'Caneca de cobre ou copo baixo',
    difficulty: 'Fácil',
    primaryIngredients: ['limão'],
    optionalIngredients: ['vodka', 'água com gás', 'gengibre', 'açúcar', 'gelo'],
    steps: [
      {
        title: 'Gelar o recipiente',
        description: 'Encha a caneca ou copo com pedras de gelo.',
      },
      {
        title: 'Misturar vodka e limão',
        description: 'Adicione 50ml de vodka e o suco de meio limão fresco.',
      },
      {
        title: 'Adicionar o toque aromático',
        description: 'Acrescente uma fatia de gengibre ou xarope simples de açúcar com limão.',
      },
      {
        title: 'Completar com gás',
        description: 'Complete com água com gás bem gelada e decore com uma rodela de limão.',
      },
    ],
    bartenderTip: 'A caneca de cobre mantém a temperatura congelante por muito mais tempo.',
  },
];

// Match drinks from user ingredients
export function matchAndSolveDrinks(params: {
  userDrinkIngredients: string[];
}): DrinkTemplate[] {
  const { userDrinkIngredients } = params;
  const normalized = userDrinkIngredients.map(i => i.toLowerCase().trim());

  if (normalized.length === 0) {
    return DRINKS_DATABASE.slice(0, 3);
  }

  const scored = DRINKS_DATABASE.map(drink => {
    let matchCount = 0;
    const all = [...drink.primaryIngredients, ...drink.optionalIngredients];
    all.forEach(ing => {
      if (normalized.some(u => u.includes(ing) || ing.includes(u))) {
        matchCount++;
      }
    });

    const primaryMatch = drink.primaryIngredients.filter(ing =>
      normalized.some(u => u.includes(ing) || ing.includes(u))
    ).length;

    return {
      drink,
      score: primaryMatch * 4 + matchCount * 2,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map(s => s.drink);
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

