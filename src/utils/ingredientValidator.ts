import { Recipe } from '../types';
import { normalizeSingular } from './ingredientParser';

// Common synonyms / equivalent culinary ingredients in Portuguese
const SYNONYM_GROUPS: string[][] = [
  ['ovo', 'ovos'],
  ['tomate', 'tomates'],
  ['cebola', 'cebolas'],
  ['alho', 'alhos'],
  ['batata', 'batatas'],
  ['cenoura', 'cenouras'],
  ['queijo', 'mussarela', 'queijo mussarela', 'queijo prato', 'parmesao', 'parmesão'],
  ['manteiga', 'margarina'],
  ['azeite', 'oleo', 'óleo', 'azeite de oliva'],
  ['frango', 'peito de frango', 'frango desfiado', 'file de frango', 'filé de frango'],
  ['carne', 'carne moida', 'carne moída', 'bife'],
  ['arroz', 'arroz branco', 'arroz cozido'],
  ['macarrao', 'macarrão', 'espaguete', 'massa'],
  ['pao', 'pão', 'paes', 'pães', 'pao de forma', 'pão de forma', 'pao frances', 'pão francês', 'torrada'],
  ['leite', 'leite integral', 'leite desnatado'],
  ['limao', 'limão', 'limoes', 'limões'],
  ['banana', 'bananas'],
  ['maca', 'maçã', 'macas', 'maçãs'],
  ['morango', 'morangos'],
  ['presunto', 'apresuntado'],
];

function sanitizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Checks if a recipe ingredient is owned by the user given the user's pantry list.
 * Considers singular/plural (Ovo == Ovos), synonyms, and subset matches.
 */
export function isIngredientOwned(recipeIngredient: string, userPantry: string[]): boolean {
  if (!recipeIngredient) return false;
  const cleanRecipe = sanitizeForMatch(recipeIngredient);
  const rootRecipe = normalizeSingular(cleanRecipe);

  for (const pantryItem of userPantry) {
    const cleanPantry = sanitizeForMatch(pantryItem);
    const rootPantry = normalizeSingular(cleanPantry);

    // 1. Direct match or root singular match
    if (cleanRecipe === cleanPantry || rootRecipe === rootPantry) {
      return true;
    }

    // 2. Substring matching (e.g. user has "frango", recipe asks for "peito de frango" or "frango desfiado")
    if (cleanRecipe.includes(cleanPantry) || cleanPantry.includes(cleanRecipe)) {
      // Ensure we don't match very short unrelated words (e.g. "sal" vs "salsa")
      if (cleanPantry.length > 3 && cleanRecipe.length > 3) {
        return true;
      }
      if (cleanPantry === 'ovo' || cleanPantry === 'ovos' || cleanPantry === 'sal' || cleanPantry === 'alho') {
        if (cleanRecipe.split(/\s+/).includes(cleanPantry)) return true;
      }
    }

    // 3. Check synonym groups
    for (const group of SYNONYM_GROUPS) {
      const sanitizedGroup = group.map(sanitizeForMatch);
      const recipeInGroup = sanitizedGroup.some(g => g === cleanRecipe || g === rootRecipe || cleanRecipe.includes(g));
      const pantryInGroup = sanitizedGroup.some(g => g === cleanPantry || g === rootPantry || cleanPantry.includes(g));

      if (recipeInGroup && pantryInGroup) {
        return true;
      }
    }
  }

  return false;
}

export interface RecipeValidationResult {
  recipe: Recipe;
  totalIngredients: number;
  ownedCount: number;
  missingCount: number;
  missingItems: string[];
  isFullyAvailable: boolean;
  canBeAdaptedToPantryOnly: boolean;
}

/**
 * Performs strict, consistent validation of a recipe against user's pantry and appliances.
 * Enforces:
 * - EXACT same state for Summary, "Você está quase lá", "Você vai usar", and Cooking Mode.
 * - In pantryOnlyMode (FAZER SÓ COM O QUE TENHO), adapts or omits missing items so NO missing items are needed.
 * - In Posso comprar o que falta, clearly tags what is owned and what is missing with amounts.
 */
export function validateAndAdaptRecipe(
  recipe: Recipe,
  userPantry: string[],
  userAppliances: string[],
  pantryOnlyMode: boolean
): RecipeValidationResult {
  const normalizedAppliances = userAppliances.map(a => a.toLowerCase().trim());

  // 1. Check appliance compatibility
  const applianceAllowed = recipe.appliancesUsed.every(app => {
    const cleanApp = app.toLowerCase().trim();
    return normalizedAppliances.some(userApp => userApp.includes(cleanApp) || cleanApp.includes(userApp));
  });

  // 2. Evaluate each ingredient
  const updatedIngredientsUsed = recipe.ingredientsUsed.map(ing => {
    const isOwned = isIngredientOwned(ing.name, userPantry);
    return {
      ...ing,
      isOwned,
    };
  });

  const ownedItems = updatedIngredientsUsed.filter(i => i.isOwned);
  const missingItems = updatedIngredientsUsed.filter(i => !i.isOwned);

  const totalIngredients = updatedIngredientsUsed.length;
  const ownedCount = ownedItems.length;
  const missingCount = missingItems.length;
  const isFullyAvailable = missingCount === 0;

  // In pantryOnlyMode:
  // If user selected "FAZER SÓ COM O QUE TENHO",
  // we filter out or adapt missing ingredients so the recipe only uses what the user has!
  let adaptedRecipe: Recipe;

  if (pantryOnlyMode) {
    // Only include owned ingredients in the active list
    const strictlyOwnedIngredients = updatedIngredientsUsed
      .filter(i => i.isOwned)
      .map(i => ({ ...i, isOwned: true }));

    adaptedRecipe = {
      ...recipe,
      ingredientsUsed: strictlyOwnedIngredients.length > 0 ? strictlyOwnedIngredients : updatedIngredientsUsed,
      hasAllIngredients: true,
      missingIngredient: undefined,
      adaptedForPantryOnly:
        recipe.adaptedForPantryOnly ||
        'Versão adaptada: preparada utilizando exclusivamente os ingredientes da sua despensa.',
      // Adapt steps if necessary to remove references to missing optional items
      steps: recipe.steps.map(s => {
        let text = s.description;
        missingItems.forEach(m => {
          // If step mentions adding missing item (e.g. "adicione o queijo"), qualify with "(se disponível)"
          const reg = new RegExp(`\\b${m.name}\\b`, 'gi');
          text = text.replace(reg, `${m.name} (se disponível)`);
        });
        return {
          ...s,
          description: text,
        };
      }),
    };
  } else {
    // Mode "Posso comprar o que falta"
    adaptedRecipe = {
      ...recipe,
      ingredientsUsed: updatedIngredientsUsed,
      hasAllIngredients: isFullyAvailable,
      missingIngredient: missingItems.length > 0 ? missingItems[0].name : undefined,
    };
  }

  return {
    recipe: adaptedRecipe,
    totalIngredients,
    ownedCount,
    missingCount,
    missingItems: missingItems.map(i => i.name),
    isFullyAvailable,
    canBeAdaptedToPantryOnly: ownedCount >= 1 && applianceAllowed,
  };
}
