import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fast timeout wrapper to prevent Gemini calls from stalling user UX
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// Known culinary items for semantic tokenization in Portuguese
const SERVER_KNOWN_FOODS = [
  'arroz', 'feijao', 'feijão', 'macarrao', 'macarrão', 'espaguete', 'massa',
  'ovo', 'ovos', 'frango', 'peito de frango', 'carne', 'carne moida', 'carne moída',
  'bife', 'calabresa', 'presunto', 'bacon', 'peixe', 'atum', 'salmao', 'salmão',
  'camarao', 'camarão', 'queijo', 'mussarela', 'tomate', 'tomates', 'cebola',
  'cebolas', 'alho', 'batata', 'batatas', 'cenoura', 'cenouras', 'abobrinha',
  'alface', 'couve', 'brocolis', 'brócolis', 'milho', 'ervilha', 'azeitona',
  'leite', 'creme de leite', 'manteiga', 'margarina', 'oleo', 'óleo', 'azeite',
  'limao', 'limão', 'laranja', 'banana', 'maca', 'maçã', 'morango', 'pao', 'pão',
  'paes', 'pães', 'torrada', 'farinha', 'aveia', 'acucar', 'açúcar', 'sal',
  'pimenta', 'oregano', 'orégano', 'cheiro verde', 'molho de tomate'
];

function parseSemanticServer(text: string): string[] {
  const fillers = [
    /no arm[aá]rio\s+(tenho|tem)?/gi,
    /na geladeira\s+(tenho|tem)?/gi,
    /na despensa\s+(tenho|tem)?/gi,
    /na cozinha\s+(tenho|tem)?/gi,
    /em casa\s+(tenho|tem)?/gi,
    /\b(eu tenho|n[oó]s temos|aqui tem|aqui tenho|tenho aqui|tem aqui)\b/gi,
    /\b(tenho|tem|temos|sobrou|sobras de|comprei|bastante|um pouco de|pouco de|alguns|algumas)\b/gi,
    /\b(fatias de|peda[cç]o de|unidades? de|pacote de|lata de)\b/gi,
    /\b(tamb[eé]m|al[eé]m disso|ainda|mais)\b/gi,
  ];

  let cleaned = text;
  for (const f of fillers) {
    cleaned = cleaned.replace(f, ' ');
  }

  // Split by common delimiters and conjunctions
  const rawParts = cleaned
    .replace(/\s+(e|com|al[eé]m de|\+)\s+/gi, ',')
    .split(/[,;\n\.\+\/&]/g)
    .map(p => p.trim())
    .filter(Boolean);

  const items: string[] = [];

  for (const part of rawParts) {
    const stripped = part
      .replace(/^\d+(\s*g|\s*kg|\s*ml|\s*l|\s*colheres?|\s*x[ií]caras?|\s*unidades?)?\s*/i, '')
      .replace(/^(um|uma|dois|duas|tr[eê]s|quatro)\s+/i, '')
      .trim();

    const words = stripped.split(/\s+/).filter(w => w.length > 1);

    if (words.length > 2) {
      // Multiple words without punctuation
      let i = 0;
      while (i < words.length) {
        const two = words.slice(i, i + 2).join(' ').toLowerCase();
        const single = words[i].toLowerCase();
        if (SERVER_KNOWN_FOODS.includes(two)) {
          items.push(two);
          i += 2;
          continue;
        }
        if (SERVER_KNOWN_FOODS.includes(single) || (!['de', 'com', 'sem', 'para', 'em', 'no', 'na'].includes(single) && single.length > 2)) {
          items.push(single);
        }
        i++;
      }
    } else if (stripped.length > 1 && !/^(de|com|sem|para|o|a|os|as|e|no|na|em)$/i.test(stripped)) {
      items.push(stripped);
    }
  }

  // Deduplicate and format capitalize
  const finalSet: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const clean = item.replace(/[^\p{L}\s]/gu, '').trim();
    if (!clean) continue;
    const lower = clean.toLowerCase();
    const root = lower.endsWith('s') && !lower.endsWith('arroz') ? lower.slice(0, -1) : lower;
    if (!seen.has(root)) {
      seen.add(root);
      finalSet.push(clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  }

  return finalSet;
}

// 1. Parse free-form ingredient text
app.post('/api/parse-ingredients', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texto não fornecido' });
    }

    if (ai) {
      try {
        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Você é o extrator de ingredientes culinários do app GuessFood. O usuário falou em português: "${text}".
Extraia CADA ingrediente/alimento como um item independente em um array JSON.
NUNCA retorne a frase inteira como um único item.
Remova verbos (tenho, tem, comprei), locais (geladeira, armário) e quantificadores (um pouco de, 2 colheres).
Exemplo: "tenho ovos queijo tomate no armário tenho arroz e cebola" -> ["Ovos", "Queijo", "Tomate", "Arroz", "Cebola"].`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'Nome limpo do ingrediente individual',
              },
            },
          },
        });

        // Fast 3500ms timeout
        const response = await withTimeout(aiPromise, 3500);
        const parsed = JSON.parse(response.text ?? '[]');
        if (Array.isArray(parsed) && parsed.length > 0) {
          const capitalized = parsed
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 1 && !/^(tenho|tem|no|na|armario|armário|geladeira)$/i.test(s))
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1));
          if (capitalized.length > 0) {
            return res.json({ ingredients: capitalized });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini parse error or timeout, running instant semantic parser:', geminiErr);
      }
    }

    // Instant local semantic parser
    const fallbackItems = parseSemanticServer(text);
    return res.json({ ingredients: fallbackItems });
  } catch (error: any) {
    console.error('Error in /api/parse-ingredients:', error);
    return res.status(500).json({ error: 'Erro ao interpretar ingredientes' });
  }
});

// 2. Generate culinary recipes tailored strictly to ingredients + appliances + meal
app.post('/api/generate-recipes', async (req: Request, res: Response) => {
  try {
    const { ingredients, appliances, mealType, dietaryPreferences } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Informe ao menos um ingrediente' });
    }

    if (!appliances || !Array.isArray(appliances) || appliances.length === 0) {
      return res.status(400).json({ error: 'Informe ao menos um equipamento disponível' });
    }

    if (ai) {
      try {
        const prompt = `Você é o chef e motor de inteligência artificial do app culinário "GuessFood".
Sua regra suprema:
INGREDIENTES DISPONÍVEIS + EQUIPAMENTOS DISPONÍVEIS + MOMENTO DA REFEIÇÃO.

DADOS DO USUÁRIO:
- Ingredientes disponíveis que ele tem em casa: ${ingredients.join(', ')}
- Equipamentos que ele possui na cozinha: ${appliances.join(', ')}
- Momento/Tipo de refeição: ${mealType || 'decide por mim'}
- Preferências/Restrições: ${dietaryPreferences?.join(', ') || 'nenhuma'}

REGRAS CRÍTICAS E OBRIGATÓRIAS:
1. Uma receita NUNCA deve exigir um equipamento que o usuário NÃO possui. Por exemplo: se ele não tem forno, JAMAIS gere receita assada no forno. Se só tem micro-ondas ou air fryer, use APENAS os equipamentos que ele tem.
2. A qualidade e o sabor da receita são fundamentais. Faça sentido culinariamente.
3. Gere até 3 receitas distintas, cada uma correspondendo a um destes 3 estilos (se culinariamente possível com os recursos):
   - "rapido": Prático, simples, tempo reduzido de preparo (até 20-25 min).
   - "incrementado": Mais elaborado, sabor sofisticado e caprichado.
   - "criativo": Inesperado, combinação inovadora ou apresentação diferenciada.
   Se apenas 2 ou 1 estilo for possível realisticamente, gere apenas as viáveis.
4. Para cada receita:
   - Se faltar 1 ingrediente comum simples que tornaria a receita perfeita (ex: sal, azeite, cebola), indique "missingIngredient": "1 cebola" e marque "hasAllIngredients": false.
   - Forneça também a versão adaptada ("adaptedInstructionWithoutMissing") para o caso do usuário escolher "FAZER SÓ COM O QUE TENHO".
   - Detalhe tempo, porções, dificuldade (Fácil, Médio, Avançado), equipamentos necessários (apenas da lista do usuário!), ingredientes com quantidades, e passos claros e objetivos.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recipes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: 'Deve ser "rapido", "incrementado" ou "criativo"',
                      },
                      description: { type: Type.STRING },
                      prepTimeMinutes: { type: Type.INTEGER },
                      difficulty: { type: Type.STRING },
                      servings: { type: Type.INTEGER },
                      appliancesUsed: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      ingredientsUsed: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            isOwned: { type: Type.BOOLEAN },
                          },
                          required: ['name', 'amount', 'isOwned'],
                        },
                      },
                      hasAllIngredients: { type: Type.BOOLEAN },
                      missingIngredient: { type: Type.STRING },
                      adaptedForPantryOnly: { type: Type.STRING },
                      steps: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            stepNumber: { type: Type.INTEGER },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            timerMinutes: { type: Type.INTEGER },
                          },
                          required: ['stepNumber', 'title', 'description'],
                        },
                      },
                      chefTip: { type: Type.STRING },
                    },
                    required: [
                      'id',
                      'title',
                      'category',
                      'description',
                      'prepTimeMinutes',
                      'difficulty',
                      'servings',
                      'appliancesUsed',
                      'ingredientsUsed',
                      'hasAllIngredients',
                      'steps',
                    ],
                  },
                },
              },
              required: ['recipes'],
            },
          },
        });

        const parsed = JSON.parse(response.text ?? '{"recipes":[]}');
        if (parsed.recipes && Array.isArray(parsed.recipes) && parsed.recipes.length > 0) {
          return res.json({ recipes: parsed.recipes, source: 'ai' });
        }
      } catch (geminiError) {
        console.warn('Gemini recipe generation error, falling back to local culinary solver:', geminiError);
      }
    }

    // Return empty array signal to let client know or fallback in client
    return res.json({ recipes: [], source: 'fallback_needed' });
  } catch (error: any) {
    console.error('Error in /api/generate-recipes:', error);
    return res.status(500).json({ error: 'Erro ao gerar receitas' });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`GuessFood server running on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
