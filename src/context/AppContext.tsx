import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Appliance,
  ApplianceId,
  MealMomentId,
  CookingEffort,
  Recipe,
  SpecialOccasionId,
  DrinkRecipe,
  FavoriteRecipe,
  HistoryItem,
  AppView,
} from '../types';
import { INITIAL_APPLIANCES } from '../data/kitchenAppliances';
import {
  matchRecipesForEffort,
  matchOccasionRecipes,
  matchAndSolveDrinks,
  DrinkTemplate,
  matchAndSolveRecipes,
} from '../data/smartRecipes';
import { fetchGeneratedRecipes, parseIngredientsFromText } from '../services/api';

interface AppContextType {
  // Navigation
  activeView: AppView;
  setActiveView: (view: AppView) => void;

  // Appliances
  appliances: Appliance[];
  selectedApplianceIds: string[];
  toggleAppliance: (id: string) => void;
  addCustomAppliance: (name: string, icon?: string) => void;

  // Ingredients / Pantry
  pantryIngredients: string[];
  addIngredient: (name: string) => void;
  removeIngredient: (name: string) => void;
  clearIngredients: () => void;
  setIngredients: (items: string[]) => void;
  parseAndAddIngredientsFromText: (text: string) => Promise<number>;

  // Cooking Effort (Rápido, Prático, Incrementado)
  cookingEffort: CookingEffort;
  setCookingEffort: (effort: CookingEffort) => void;

  // Meal Moment
  mealMoment: MealMomentId;
  setMealMoment: (moment: MealMomentId) => void;

  // Recipes & Generation
  generatedRecipes: Recipe[];
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  isLoading: boolean;
  loadingMessage: string;
  generateRecipesFlow: () => Promise<Recipe[]>;
  generateRecipesForEffortFlow: (effort: CookingEffort) => Promise<Recipe[]>;
  decideForMeQuickFlow: () => Promise<Recipe | null>;

  // Special Occasions
  selectedOccasion: SpecialOccasionId | null;
  setSelectedOccasion: (occ: SpecialOccasionId | null) => void;
  generateOccasionRecipesFlow: (occId: SpecialOccasionId) => Promise<Recipe[]>;

  // Drinks
  drinkIngredients: string[];
  addDrinkIngredient: (name: string) => void;
  removeDrinkIngredient: (name: string) => void;
  clearDrinkIngredients: () => void;
  parseAndAddDrinkIngredientsFromText: (text: string) => Promise<number>;
  drinkRecipes: DrinkTemplate[];
  selectedDrink: DrinkTemplate | null;
  setSelectedDrink: (drink: DrinkTemplate | null) => void;
  generateDrinksFlow: () => DrinkTemplate[];

  // Recipe Options & Adaptation
  pantryOnlyMode: boolean;
  setPantryOnlyMode: (mode: boolean) => void;

  // Favorites & History
  favorites: FavoriteRecipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (recipeId: string) => boolean;
  history: HistoryItem[];
  markAsCooked: (recipe: Recipe, rating?: number) => void;

  // Membership & Modals
  isLifetime: boolean;
  upgradeToLifetime: () => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isDecideForMeModalOpen: boolean;
  setIsDecideForMeModalOpen: (open: boolean) => void;

  // Helper Stats
  stats: {
    recipesDecided: number;
    recipesCooked: number;
    totalFavorites: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Navigation
  const [activeView, setActiveView] = useState<AppView>('home');

  // 2. Appliances
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    try {
      const saved = localStorage.getItem('guessfood_appliances');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_APPLIANCES;
  });

  const [selectedApplianceIds, setSelectedApplianceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('guessfood_selected_appliances');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return ['fogao', 'microondas', 'airfryer', 'sanduicheira'];
  });

  useEffect(() => {
    localStorage.setItem('guessfood_appliances', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('guessfood_selected_appliances', JSON.stringify(selectedApplianceIds));
  }, [selectedApplianceIds]);

  const toggleAppliance = (id: string) => {
    setSelectedApplianceIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const addCustomAppliance = (name: string, icon = '🍳') => {
    if (!name.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newApp: Appliance = {
      id: newId,
      name: name.trim(),
      icon,
      description: 'Equipamento personalizado',
      isCustom: true,
    };
    setAppliances(prev => [...prev, newApp]);
    setSelectedApplianceIds(prev => [...prev, newId]);
  };

  // 3. Pantry Ingredients
  const [pantryIngredients, setPantryIngredientsState] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('guessfood_pantry_ingredients');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return ['Ovos', 'Queijo', 'Tomate', 'Frango', 'Arroz', 'Macarrão', 'Cebola'];
  });

  useEffect(() => {
    localStorage.setItem('guessfood_pantry_ingredients', JSON.stringify(pantryIngredients));
  }, [pantryIngredients]);

  const addIngredient = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (!pantryIngredients.some(i => i.toLowerCase() === clean.toLowerCase())) {
      const cap = clean.charAt(0).toUpperCase() + clean.slice(1);
      setPantryIngredientsState(prev => [...prev, cap]);
    }
  };

  const removeIngredient = (name: string) => {
    setPantryIngredientsState(prev =>
      prev.filter(i => i.toLowerCase() !== name.toLowerCase())
    );
  };

  const clearIngredients = () => {
    setPantryIngredientsState([]);
  };

  const setIngredients = (items: string[]) => {
    setPantryIngredientsState(items);
  };

  const parseAndAddIngredientsFromText = async (text: string): Promise<number> => {
    const parsed = await parseIngredientsFromText(text);
    if (parsed.length > 0) {
      setPantryIngredientsState(prev => {
        const set = new Set(prev.map(i => i.toLowerCase()));
        const newItems = [...prev];
        for (const item of parsed) {
          const capitalized = item.charAt(0).toUpperCase() + item.slice(1);
          if (!set.has(item.toLowerCase())) {
            newItems.push(capitalized);
            set.add(item.toLowerCase());
          }
        }
        return newItems;
      });
      return parsed.length;
    }
    return 0;
  };

  // 4. Cooking Effort & Meal Moment
  const [cookingEffort, setCookingEffort] = useState<CookingEffort>('rapido');
  const [mealMoment, setMealMoment] = useState<MealMomentId>('decide_por_mim');

  // 5. Special Occasions
  const [selectedOccasion, setSelectedOccasion] = useState<SpecialOccasionId | null>(null);

  // 6. Drinks
  const [drinkIngredients, setDrinkIngredients] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('guessfood_drink_ingredients');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return ['Vodka', 'Limão', 'Água com gás', 'Açúcar', 'Morango'];
  });

  useEffect(() => {
    localStorage.setItem('guessfood_drink_ingredients', JSON.stringify(drinkIngredients));
  }, [drinkIngredients]);

  const addDrinkIngredient = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (!drinkIngredients.some(i => i.toLowerCase() === clean.toLowerCase())) {
      const cap = clean.charAt(0).toUpperCase() + clean.slice(1);
      setDrinkIngredients(prev => [...prev, cap]);
    }
  };

  const removeDrinkIngredient = (name: string) => {
    setDrinkIngredients(prev =>
      prev.filter(i => i.toLowerCase() !== name.toLowerCase())
    );
  };

  const clearDrinkIngredients = () => {
    setDrinkIngredients([]);
  };

  const parseAndAddDrinkIngredientsFromText = async (text: string): Promise<number> => {
    const parsed = await parseIngredientsFromText(text);
    if (parsed.length > 0) {
      setDrinkIngredients(prev => {
        const set = new Set(prev.map(i => i.toLowerCase()));
        const newItems = [...prev];
        for (const item of parsed) {
          const capitalized = item.charAt(0).toUpperCase() + item.slice(1);
          if (!set.has(item.toLowerCase())) {
            newItems.push(capitalized);
            set.add(item.toLowerCase());
          }
        }
        return newItems;
      });
      return parsed.length;
    }
    return 0;
  };

  const [drinkRecipes, setDrinkRecipes] = useState<DrinkTemplate[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<DrinkTemplate | null>(null);

  const generateDrinksFlow = (): DrinkTemplate[] => {
    const results = matchAndSolveDrinks({ userDrinkIngredients: drinkIngredients });
    setDrinkRecipes(results);
    return results;
  };

  // 7. Recipes & Generation
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [pantryOnlyMode, setPantryOnlyMode] = useState<boolean>(false);

  // 8. Favorites & History
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(() => {
    try {
      const saved = localStorage.getItem('guessfood_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('guessfood_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.recipe.id === recipe.id);
      if (exists) {
        return prev.filter(f => f.recipe.id !== recipe.id);
      } else {
        return [{ recipe, savedAt: new Date().toISOString() }, ...prev];
      }
    });
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some(f => f.recipe.id === recipeId);
  };

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('guessfood_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('guessfood_history', JSON.stringify(history));
  }, [history]);

  const markAsCooked = (recipe: Recipe, rating?: number) => {
    const item: HistoryItem = {
      id: `history_${Date.now()}`,
      recipe,
      cookedAt: new Date().toISOString(),
      rating: rating || 5,
    };
    setHistory(prev => [item, ...prev]);
  };

  // 9. Membership & Modals
  const [isLifetime, setIsLifetime] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('guessfood_lifetime');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const upgradeToLifetime = () => {
    setIsLifetime(true);
    localStorage.setItem('guessfood_lifetime', 'true');
    setIsUpgradeModalOpen(false);
  };

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isDecideForMeModalOpen, setIsDecideForMeModalOpen] = useState<boolean>(false);

  // 10. Stats
  const [recipesDecidedCount, setRecipesDecidedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('guessfood_decided_count');
      return saved ? parseInt(saved, 10) : 4;
    } catch (e) {
      return 4;
    }
  });

  useEffect(() => {
    localStorage.setItem('guessfood_decided_count', recipesDecidedCount.toString());
  }, [recipesDecidedCount]);

  // Standard generation
  const generateRecipesFlow = async (): Promise<Recipe[]> => {
    return generateRecipesForEffortFlow(cookingEffort);
  };

  // Generate recipes filtered for user's chosen effort (Rápido, Prático, Incrementado)
  const generateRecipesForEffortFlow = async (effort: CookingEffort): Promise<Recipe[]> => {
    if (pantryIngredients.length === 0) {
      throw new Error('Informe ao menos 1 ingrediente');
    }
    if (selectedApplianceIds.length === 0) {
      throw new Error('Selecione ao menos 1 equipamento na sua cozinha');
    }

    setIsLoading(true);
    setLoadingMessage('Preparando receitas sob medida para sua cozinha...');
    setCookingEffort(effort);

    try {
      // 1. Try server-side generation
      try {
        const result = await fetchGeneratedRecipes({
          ingredients: pantryIngredients,
          appliances: selectedApplianceIds,
          mealType: effort,
        });
        if (result.recipes && result.recipes.length > 0) {
          setGeneratedRecipes(result.recipes);
          setRecipesDecidedCount(c => c + 1);
          setPantryOnlyMode(false);
          return result.recipes;
        }
      } catch (e) {
        console.warn('Server recipe generation fallback to local solver:', e);
      }

      // 2. High-quality local solver
      const localRecipes = matchRecipesForEffort({
        userIngredients: pantryIngredients,
        userAppliances: selectedApplianceIds,
        effort,
      });

      setGeneratedRecipes(localRecipes);
      setRecipesDecidedCount(c => c + 1);
      setPantryOnlyMode(false);
      return localRecipes;
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Generate recipes for a Special Occasion
  const generateOccasionRecipesFlow = async (occId: SpecialOccasionId): Promise<Recipe[]> => {
    setIsLoading(true);
    setLoadingMessage('Criando receitas especiais para esta ocasião...');
    setSelectedOccasion(occId);

    try {
      const occasionRecipes = matchOccasionRecipes({
        occasionId: occId,
        userIngredients: pantryIngredients,
        userAppliances: selectedApplianceIds,
      });

      setGeneratedRecipes(occasionRecipes);
      setRecipesDecidedCount(c => c + 1);
      setPantryOnlyMode(false);
      return occasionRecipes;
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Instant 1-click "🚨 ESTOU COM FOME. DECIDE POR MIM!" flow
  const decideForMeQuickFlow = async (): Promise<Recipe | null> => {
    setIsLoading(true);
    setLoadingMessage('Decidindo na hora a melhor refeição para você...');

    try {
      const recipes = await generateRecipesForEffortFlow('rapido');
      if (recipes && recipes.length > 0) {
        const picked = recipes[0];
        setSelectedRecipe(picked);
        return picked;
      }
      return null;
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        appliances,
        selectedApplianceIds,
        toggleAppliance,
        addCustomAppliance,
        pantryIngredients,
        addIngredient,
        removeIngredient,
        clearIngredients,
        setIngredients,
        parseAndAddIngredientsFromText,
        cookingEffort,
        setCookingEffort,
        mealMoment,
        setMealMoment,
        generatedRecipes,
        selectedRecipe,
        setSelectedRecipe,
        isLoading,
        loadingMessage,
        generateRecipesFlow,
        generateRecipesForEffortFlow,
        decideForMeQuickFlow,
        selectedOccasion,
        setSelectedOccasion,
        generateOccasionRecipesFlow,
        drinkIngredients,
        addDrinkIngredient,
        removeDrinkIngredient,
        clearDrinkIngredients,
        parseAndAddDrinkIngredientsFromText,
        drinkRecipes,
        selectedDrink,
        setSelectedDrink,
        generateDrinksFlow,
        pantryOnlyMode,
        setPantryOnlyMode,
        favorites,
        toggleFavorite,
        isFavorite,
        history,
        markAsCooked,
        isLifetime,
        upgradeToLifetime,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isDecideForMeModalOpen,
        setIsDecideForMeModalOpen,
        stats: {
          recipesDecided: recipesDecidedCount,
          recipesCooked: history.length,
          totalFavorites: favorites.length,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
