import { Appliance, MealMoment } from '../types';

export const INITIAL_APPLIANCES: Appliance[] = [
  {
    id: 'fogao',
    name: 'Fogão',
    icon: '🍳',
    description: 'Bocas a gás ou por indução',
  },
  {
    id: 'microondas',
    name: 'Micro-ondas',
    icon: '📡',
    description: 'Aquecimento e preparos ultrarrápidos',
  },
  {
    id: 'airfryer',
    name: 'Air fryer',
    icon: '🍟',
    description: 'Fritura a ar sem óleo e crocância',
  },
  {
    id: 'forno',
    name: 'Forno',
    icon: '🔥',
    description: 'Forno a gás ou elétrico tradicional',
  },
  {
    id: 'liquidificador',
    name: 'Liquidificador',
    icon: '🥤',
    description: 'Massas, sucos, cremes e vitaminas',
  },
  {
    id: 'sanduicheira',
    name: 'Sanduicheira / Grill',
    icon: '🍞',
    description: 'Tostados, queijos quentes e grelhados',
  },
  {
    id: 'panela_eletrica',
    name: 'Panela elétrica',
    icon: '🍲',
    description: 'Arroz, legumes a vapor e cozidos',
  },
  {
    id: 'panela_pressao',
    name: 'Panela de pressão',
    icon: '🥘',
    description: 'Feijão, carnes desfiadas e cozimento rápido',
  },
  {
    id: 'waffle',
    name: 'Máquina de waffle',
    icon: '🧇',
    description: 'Waffles doces e salgados',
  },
];

export const MEAL_MOMENTS: MealMoment[] = [
  {
    id: 'cafe',
    title: 'Café da manhã',
    icon: '☀️',
    subtitle: 'Energia para começar o dia',
    color: 'from-amber-400 to-orange-400',
  },
  {
    id: 'almoco',
    title: 'Almoço',
    icon: '🍛',
    subtitle: 'Comida de verdade e sustança',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'jantar',
    title: 'Jantar',
    icon: '🌙',
    subtitle: 'Confortável, leve ou reforçado',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'lanche',
    title: 'Lanche',
    icon: '🥪',
    subtitle: 'Petisco rápido da tarde ou noite',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'sobremesa',
    title: 'Sobremesa',
    icon: '🍰',
    subtitle: 'Aquele docinho merecido',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'bebida',
    title: 'Bebida / Suco',
    icon: '🥤',
    subtitle: 'Sucos refrescantes e shakes',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'decide_por_mim',
    title: 'Não sei. Decide por mim.',
    icon: '🤷',
    subtitle: 'O GuessFood escolhe o melhor pra você',
    color: 'from-amber-500 via-rose-500 to-purple-600',
  },
];

export const COMMON_PANTRY_SUGGESTIONS = [
  { name: 'Ovos', icon: '🥚' },
  { name: 'Arroz', icon: '🍚' },
  { name: 'Frango', icon: '🍗' },
  { name: 'Queijo', icon: '🧀' },
  { name: 'Tomate', icon: '🍅' },
  { name: 'Cebola', icon: '🧅' },
  { name: 'Batata', icon: '🥔' },
  { name: 'Pão', icon: '🍞' },
  { name: 'Manteiga', icon: '🧈' },
  { name: 'Leite', icon: '🥛' },
  { name: 'Alho', icon: '🧄' },
  { name: 'Carne moída', icon: '🥩' },
  { name: 'Macarrão', icon: '🍝' },
  { name: 'Banana', icon: '🍌' },
  { name: 'Cenoura', icon: '🥕' },
  { name: 'Limão', icon: '🍋' },
  { name: 'Presunto', icon: '🥓' },
  { name: 'Aveia', icon: '🌾' },
];
