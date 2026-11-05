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

// 1. Parse free-form ingredient text
app.post('/api/parse-ingredients', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texto não fornecido' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Você é o extrator de ingredientes culinários do app GuessFood. O usuário escreveu em português: "${text}".
Extraia apenas os nomes dos ingredientes limpos e normalizados em português (singular, minúsculo, sem pontuação, sem quantidades numéricas, apenas os alimentos/ingredientes).
Exemplo: "tenho 2 tomates, arroz que sobrou de ontem, frango desfiado e cebola" -> ["tomate", "arroz", "frango", "cebola"].`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'Nome limpo do ingrediente',
              },
            },
          },
        });

        const parsed = JSON.parse(response.text ?? '[]');
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ ingredients: parsed });
        }
      } catch (geminiErr) {
        console.warn('Gemini parse error, falling back to regex parser:', geminiErr);
      }
    }

    // High quality Portuguese fallback regex parser
    const cleanItems = text
      .toLowerCase()
      .replace(/\b(tenho|tem|temos|na geladeira|em casa|sobrou|sobras de|comprei|bastante|um pouco de|uns|umas|pouco de|alguns|algumas)\b/g, '')
      .replace(/\s+e\s+/g, ',')
      .split(/[,;\n\.\+\/&]/g)
      .map(item => item.trim())
      .map(item => item.replace(/^\d+(\s*g|\s*kg|\s*ml|\s*l|\s*colheres?|\s*xícaras?|\s*unidades?)?\s*/i, ''))
      .map(item => item.replace(/^(um|uma|dois|duas|três|quatro)\s+/i, ''))
      .map(item => item.trim())
      .filter(item => item.length > 1 && !/^(de|com|sem|para|o|a|os|as|e)$/.test(item));

    const uniqueItems = Array.from(new Set(cleanItems));
    return res.json({ ingredients: uniqueItems });
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
