import { Recipe } from '../types';
import { matchAndSolveRecipes } from '../data/smartRecipes';

export interface GenerateParams {
  ingredients: string[];
  appliances: string[];
  mealType?: string;
  dietaryPreferences?: string[];
}

import { parseIngredientsSemantic } from '../utils/ingredientParser';

export async function parseIngredientsFromText(text: string): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/parse-ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.ingredients) && data.ingredients.length > 0) {
        return data.ingredients;
      }
    }
  } catch (err) {
    console.warn('Network or server error while parsing ingredients, using instant local semantic parser:', err);
  }

  // Instant semantic Portuguese culinary parser fallback
  return parseIngredientsSemantic(text);
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
