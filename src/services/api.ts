import { Recipe } from '../types';
import { matchAndSolveRecipes } from '../data/smartRecipes';

export interface GenerateParams {
  ingredients: string[];
  appliances: string[];
  mealType?: string;
  dietaryPreferences?: string[];
}

export async function parseIngredientsFromText(text: string): Promise<string[]> {
  try {
    const res = await fetch('/api/parse-ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.ingredients) && data.ingredients.length > 0) {
        return data.ingredients;
      }
    }
  } catch (err) {
    console.warn('Network or server error while parsing ingredients, using local regex:', err);
  }

  // Fallback client-side regex parsing
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

  return Array.from(new Set(cleanItems));
}

export async function fetchGeneratedRecipes(params: GenerateParams): Promise<{ recipes: Recipe[]; source: 'ai' | 'smart_solver' }> {
  try {
    const res = await fetch('/api/generate-recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        return { recipes: data.recipes, source: 'ai' };
      }
    }
  } catch (err) {
    console.warn('Server generation unavailable, using local culinary solver:', err);
  }

  // Local culinary solver strictly respecting appliance and pantry rules
  const localRecipes = matchAndSolveRecipes({
    userIngredients: params.ingredients,
    userAppliances: params.appliances,
    mealType: params.mealType,
  });

  return { recipes: localRecipes, source: 'smart_solver' };
}
