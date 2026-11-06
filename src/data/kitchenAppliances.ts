import { Appliance, MealMoment, CookingEffortOption, SpecialOccasion } from '../types';

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

export const COOKING_EFFORT_OPTIONS: CookingEffortOption[] = [
  {
    id: 'rapido',
    title: 'RÁPIDO',
    badge: '10 a 20 min',
    icon: '⚡',
    tagline: 'Quero comer logo.',
    description: 'Receitas expressas, práticas e que ficam prontas em minutos.',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'pratico',
    title: 'PRÁTICO',
    badge: 'Pouca louça',
    icon: '🍳',
    tagline: 'Pouco trabalho e poucos passos.',
    description: 'Preparo simples, sem complicação e quase nada para lavar.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'incrementado',
    title: 'INCREMENTADO',
    badge: 'Sabor especial',
    icon: '✨',
    tagline: 'Hoje eu quero caprichar.',
    description: 'Mais elaborado, aroma irresistível e apresentação de restaurante.',
    color: 'from-rose-500 to-orange-600',
  },
];

export const SPECIAL_OCCASIONS: SpecialOccasion[] = [
  {
    id: 'amigos',
    title: 'Noite com Amigos',
    icon: '👥',
    subtitle: 'Receitas para compartilhar',
    description: 'Petiscos, travessas fartas e pratos que todo mundo se serve junto.',
    color: 'from-amber-500 to-orange-500',
    badge: 'Para compartilhar',
  },
  {
    id: 'casal',
    title: 'Jantar a Dois',
    icon: '❤️',
    subtitle: 'Algo especial sem complicar demais',
    description: 'Prato charmoso, aconchegante e perfeito para criar um momento especial.',
    color: 'from-rose-500 to-pink-500',
    badge: 'Romântico & prático',
  },
  {
    id: 'domingo',
    title: 'Almoço de Domingo',
    icon: '☀️',
    subtitle: 'Receitas com clima de almoço em família',
    description: 'Comida de vó reconfortante, travessas quentes e aroma de casa cheia.',
    color: 'from-orange-500 to-amber-600',
    badge: 'Em família',
  },
  {
    id: 'happy_hour',
    title: 'Happy Hour em Casa',
    icon: '🍻',
    subtitle: 'Petiscos e acompanhamentos',
    description: 'Finger foods, tira-gostos dourados e comidinhas de boteco.',
    color: 'from-yellow-500 to-amber-600',
    badge: 'Boteco em casa',
  },
  {
    id: 'comemoracao',
    title: 'Comemoração Especial',
    icon: '🎂',
    subtitle: 'Receitas para uma ocasião especial',
    description: 'Prato festivo ou sobremesa memorável para brindar uma data marcante.',
    color: 'from-purple-500 to-rose-500',
    badge: 'Festivo & marcante',
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
