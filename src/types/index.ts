export type ApplianceId =
  | 'fogao'
  | 'microondas'
  | 'airfryer'
  | 'forno'
  | 'liquidificador'
  | 'sanduicheira'
  | 'panela_eletrica'
  | 'panela_pressao'
  | 'waffle'
  | string;

export interface Appliance {
  id: ApplianceId;
  name: string;
  icon: string;
  description: string;
  isCustom?: boolean;
}

export type MealMomentId =
  | 'cafe'
  | 'almoco'
  | 'jantar'
  | 'lanche'
  | 'sobremesa'
  | 'bebida'
  | 'decide_por_mim';

export interface MealMoment {
  id: MealMomentId;
  title: string;
  icon: string;
  subtitle: string;
  color: string;
}

export type RecipeCategory = 'rapido' | 'incrementado' | 'criativo';

export interface RecipeIngredient {
  name: string;
  amount: string;
  isOwned: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  description: string;
  timerMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  description: string;
  prepTimeMinutes: number;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  servings: number;
  appliancesUsed: string[];
  ingredientsUsed: RecipeIngredient[];
  hasAllIngredients: boolean;
  missingIngredient?: string;
  adaptedForPantryOnly?: string;
  steps: RecipeStep[];
  chefTip?: string;
  matchedIngredientsCount?: number;
}

export interface FavoriteRecipe {
  recipe: Recipe;
  savedAt: string;
}

export interface HistoryItem {
  id: string;
  recipe: Recipe;
  cookedAt: string;
  rating?: number;
}

export type AppView =
  | 'home'
  | 'kitchen'
  | 'ingredients'
  | 'meal-moment'
  | 'wheel'
  | 'recipe'
  | 'cooking-mode'
  | 'favorites'
  | 'history'
  | 'profile';
