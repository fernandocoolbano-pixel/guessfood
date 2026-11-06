// High-reliability Portuguese culinary semantic parser for GuessFood
// Corrects speech recognition artifacts, removes conversational noise,
// tokenizes food items properly even when speech has NO punctuation,
// and normalizes singular/plural and case.

export const KNOWN_CULINARY_ITEMS: string[] = [
  'arroz', 'feijao', 'feijão', 'macarrao', 'macarrão', 'espaguete', 'massa',
  'ovo', 'ovos', 'frango', 'peito de frango', 'coxa de frango', 'carne',
  'carne moida', 'carne moída', 'bife', 'alcatra', 'patinho', 'linguiça',
  'calabresa', 'presunto', 'bacon', 'peixe', 'atum', 'salmao', 'salmão',
  'camarao', 'camarão', 'queijo', 'queijo mussarela', 'mussarela', 'queijo prato',
  'parmesao', 'parmesão', 'requeijao', 'requeijão', 'tomate', 'tomates',
  'cebola', 'cebolas', 'alho', 'batata', 'batatas', 'batata doce', 'cenoura',
  'cenouras', 'abobrinha', 'berinjela', 'chuchu', 'mandioca', 'aipim',
  'alface', 'rucula', 'rúcula', 'couve', 'espinafre', 'brocolis', 'brócolis',
  'pimentao', 'pimentão', 'milho', 'ervilha', 'azeitona', 'azeitonas',
  'palmito', 'champignon', 'cogumelo', 'cogumelos', 'leite', 'creme de leite',
  'leite condensado', 'manteiga', 'margarina', 'oleo', 'óleo', 'azeite',
  'vinagre', 'limao', 'limão', 'limoes', 'limões', 'laranja', 'laranjas',
  'banana', 'bananas', 'maca', 'maçã', 'macas', 'maçãs', 'morango', 'morangos',
  'abacaxi', 'mamao', 'mamão', 'melancia', 'melao', 'melão', 'uva', 'uvas',
  'pao', 'pão', 'paes', 'pães', 'pao de forma', 'pão de forma', 'pao frances',
  'pão francês', 'torrada', 'torradas', 'biscoito', 'bolacha', 'farinha',
  'farinha de trigo', 'amido de milho', 'maizena', 'aveia', 'acucar', 'açúcar',
  'sal', 'pimenta', 'pimenta do reino', 'oregano', 'orégano', 'manjericao',
  'manjericão', 'salsa', 'cebolinha', 'cheiro verde', 'coentro', 'canela',
  'chocolate', 'cacau', 'achocolatado', 'nescau', 'toddy', 'cafe', 'café',
  'molho de tomate', 'extrato de tomate', 'maionese', 'ketchup', 'mostarda',
];

// Fillers, locations, and quantifiers to strip cleanly
const FILLERS = [
  /no arm[aá]rio\s+(tenho|tem)?/gi,
  /na geladeira\s+(tenho|tem)?/gi,
  /na despensa\s+(tenho|tem)?/gi,
  /na cozinha\s+(tenho|tem)?/gi,
  /em casa\s+(tenho|tem)?/gi,
  /\b(eu tenho|n[oó]s temos|aqui tem|aqui tenho|tenho aqui|tem aqui)\b/gi,
  /\b(tenho|tem|temos|sobrou|sobraram|sobras de|comprei|guardado|guardada)\b/gi,
  /\b(um pouco de|bastante|pouco de|um bocado de|uma por[cç][aã]o de)\b/gi,
  /\b(um pacote de|uma lata de|um vidro de|uma caixa de|um pote de)\b/gi,
  /\b(fatias de|peda[cç]o de|peda[cç]os de|unidades? de)\b/gi,
  /\b(tamb[eé]m|al[eé]m disso|ainda|mais)\b/gi,
];

export function cleanTextFillers(raw: string): string {
  let cleaned = raw;
  for (const pattern of FILLERS) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  return cleaned;
}

export function capitalizeIngredient(word: string): string {
  if (!word) return '';
  const trimmed = word.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

// Singular/Plural normalizer
export function normalizeSingular(word: string): string {
  const lower = word.toLowerCase().trim();
  if (lower.endsWith('ões')) return lower.slice(0, -3) + 'ão';
  if (lower.endsWith('oes')) return lower.slice(0, -3) + 'ao';
  if (lower.endsWith('ães') || lower.endsWith('aes')) return lower.slice(0, -3) + 'ão';
  if (lower.endsWith('res') || lower.endsWith('zes')) return lower.slice(0, -2);
  if (lower.endsWith('ens')) return lower.slice(0, -3) + 'em';
  if (lower.endsWith('is') && !lower.endsWith('mais') && !lower.endsWith('seis')) return lower.slice(0, -2) + 'l';
  if (lower.endsWith('s') && !lower.endsWith('arroz') && !lower.endsWith('gas') && !lower.endsWith('gás') && !lower.endsWith('noz')) {
    // e.g. ovos -> ovo, tomates -> tomate, cebolas -> cebola
    return lower.slice(0, -1);
  }
  return lower;
}

/**
 * Robust semantic parser that extracts individual ingredients from natural spoken Portuguese,
 * whether punctuated or unpunctuated.
 */
export function parseIngredientsSemantic(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  // 1. Remove conversational fillers
  const sanitized = cleanTextFillers(text);

  // 2. Split by common natural delimiters (commas, semicolons, dots, ' e ', ' com ', '/', '+', line breaks)
  const segments = sanitized
    .replace(/\s+(e|com|al[eé]m de|\+)\s+/gi, ',')
    .split(/[,;\n\.\+\/&]/g)
    .map(s => s.trim())
    .filter(Boolean);

  const extracted: string[] = [];

  for (const segment of segments) {
    // Remove numerical quantities like '2', '500g', '1 colher', '3 unidades'
    const withoutNumbers = segment
      .replace(/^\d+(\s*g|\s*kg|\s*ml|\s*l|\s*colheres?|\s*x[ií]caras?|\s*unidades?)?\s*/i, '')
      .replace(/^(um|uma|dois|duas|tr[eê]s|quatro|cinco|seis)\s+/i, '')
      .trim();

    // Check if the segment directly contains multiple words that didn't get split
    // e.g., "ovos queijo tomate frango" (Web speech API with no punctuation)
    const words = withoutNumbers.split(/\s+/).filter(w => w.length > 1);

    if (words.length > 2) {
      // Check if individual words or word pairs are known food items
      let i = 0;
      let matchedAny = false;
      while (i < words.length) {
        // Try two-word food name first (e.g. 'peito de frango', 'carne moida', 'molho de tomate')
        const threeWords = words.slice(i, i + 3).join(' ').toLowerCase();
        const twoWords = words.slice(i, i + 2).join(' ').toLowerCase();
        const singleWord = words[i].toLowerCase();

        if (KNOWN_CULINARY_ITEMS.includes(threeWords)) {
          extracted.push(capitalizeIngredient(threeWords));
          i += 3;
          matchedAny = true;
          continue;
        }

        if (KNOWN_CULINARY_ITEMS.includes(twoWords)) {
          extracted.push(capitalizeIngredient(twoWords));
          i += 2;
          matchedAny = true;
          continue;
        }

        const normSingle = normalizeSingular(singleWord);
        const isFood = KNOWN_CULINARY_ITEMS.some(k => k === singleWord || normalizeSingular(k) === normSingle);

        if (isFood || (!['de', 'com', 'sem', 'para', 'em', 'no', 'na', 'um', 'uma'].includes(singleWord) && singleWord.length > 2)) {
          extracted.push(capitalizeIngredient(singleWord));
          matchedAny = true;
        }
        i++;
      }

      if (!matchedAny && withoutNumbers.length > 2) {
        extracted.push(capitalizeIngredient(withoutNumbers));
      }
    } else if (withoutNumbers.length > 1) {
      const cleanWord = withoutNumbers.replace(/[^\p{L}\s]/gu, '').trim();
      if (cleanWord.length > 1 && !/^(de|com|sem|para|o|a|os|as|e|no|na|em|um|uma)$/i.test(cleanWord)) {
        extracted.push(capitalizeIngredient(cleanWord));
      }
    }
  }

  // 3. Deduplicate based on singular root
  const result: string[] = [];
  const seenRoots = new Set<string>();

  for (const item of extracted) {
    const root = normalizeSingular(item.toLowerCase());
    if (!seenRoots.has(root)) {
      seenRoots.add(root);
      result.push(item);
    }
  }

  return result;
}
