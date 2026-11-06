// Food & Drinks Emoji matcher for GuessFood

const EMOJI_MAP: Record<string, string> = {
  // Common pantry
  ovo: '🥚',
  ovos: '🥚',
  queijo: '🧀',
  mussarela: '🧀',
  parmesao: '🧀',
  prato: '🧀',
  tomate: '🍅',
  tomates: '🍅',
  frango: '🍗',
  peito: '🍗',
  arroz: '🍚',
  macarrao: '🍝',
  espaguete: '🍝',
  massa: '🍝',
  cebola: '🧅',
  cebolas: '🧅',
  alho: '🧄',
  batata: '🥔',
  batatas: '🥔',
  carne: '🥩',
  bife: '🥩',
  moida: '🥩',
  pao: '🍞',
  paes: '🍞',
  torrada: '🍞',
  manteiga: '🧈',
  margarina: '🧈',
  leite: '🥛',
  creme: '🥛',
  requeijao: '🥛',
  banana: '🍌',
  cenoura: '🥕',
  cenouras: '🥕',
  limao: '🍋',
  limoes: '🍋',
  laranja: '🍊',
  presunto: '🥓',
  bacon: '🥓',
  calabresa: '🥓',
  aveia: '🌾',
  farinha: '🌾',
  trigo: '🌾',
  azeite: '🫒',
  oleo: '🫒',
  azeitona: '🫒',
  azeitonas: '🫒',
  milho: '🌽',
  ervilha: '🫛',
  peixe: '🐟',
  atum: '🐟',
  salmao: '🐟',
  camarao: '🦐',
  chocolate: '🍫',
  acucar: '🍬',
  sal: '🧂',
  pimenta: '🌶️',
  molho: '🥫',
  extrato: '🥫',
  cafe: '☕',
  cha: '🫖',
  maca: '🍎',
  morango: '🍓',
  morangos: '🍓',
  abacaxi: '🍍',
  abacate: '🥑',
  mel: '🍯',
  canela: '🪵',
  organo: '🌿',
  manjericao: '🌿',
  cheiro: '🌿',
  salsa: '🌿',
  hortela: '🌿',
  alface: '🥬',
  brocolis: '🥦',
  cogumelo: '🍄',
  champignon: '🍄',

  // Drinks & Bar items
  vodka: '🍸',
  gim: '🍸',
  gin: '🍸',
  rum: '🍹',
  cachaca: '🥃',
  pinga: '🥃',
  whisky: '🥃',
  whiskey: '🥃',
  cerveja: '🍺',
  vinho: '🍷',
  espumante: '🥂',
  prosecco: '🥂',
  agua: '🫧',
  tonica: '🫧',
  gas: '🫧',
  gelo: '🧊',
  suco: '🧃',
  refrigerante: '🥤',
  refri: '🥤',
  cola: '🥤',
  guarana: '🥤',
  leitecondensado: '🥛',
  gengibre: '🫚',
  xarope: '🍯',
  licor: '🍶',
  curaçau: '🍹',
  tequila: '🥃',
  campari: '🍷',
  energetico: '⚡',
};

export function getIngredientEmoji(name: string): string {
  if (!name) return '🍽️';
  const clean = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Exact or word match
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (clean.includes(key)) {
      return emoji;
    }
  }

  // Fallbacks by category
  if (clean.includes('bebida') || clean.includes('drink')) return '🍸';
  if (clean.includes('doce') || clean.includes('sobremesa')) return '🍰';
  if (clean.includes('fruta')) return '🍎';
  if (clean.includes('legume') || clean.includes('verdura')) return '🥬';
  return '🧺';
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
