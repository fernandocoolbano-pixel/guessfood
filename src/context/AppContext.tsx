import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Appliance,
  ApplianceId,
  MealMomentId,
  Recipe,
  FavoriteRecipe,
  HistoryItem,
  AppView,
} from '../types';
import { INITIAL_APPLIANCES } from '../data/kitchenAppliances';
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
  decideForMeQuickFlow: () => Promise<Recipe | null>;

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
    // Default popular starting equipment: Fogão, Micro-ondas, Air fryer, Sanduicheira
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
        // Keep at least one appliance selected
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
    return ['Arroz', 'Frango', 'Tomate', 'Ovos', 'Queijo'];
  });

  useEffect(() => {
    localStorage.setItem('guessfood_pantry_ingredients', JSON.stringify(pantryIngredients));
  }, [pantryIngredients]);

  const addIngredient = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (!pantryIngredients.some(i => i.toLowerCase() === clean.toLowerCase())) {
      setPantryIngredientsState(prev => [...prev, clean]);
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

  // 4. Meal Moment
  const [mealMoment, setMealMoment] = useState<MealMomentId>('decide_por_mim');

  // 5. Recipes & Generation
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [pantryOnlyMode, setPantryOnlyMode] = useState<boolean>(false);

  // 6. Favorites & History
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

  // 7. Membership & Modals
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

  // 8. Stats
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

  // Recipe generation flow
  const generateRecipesFlow = async (): Promise<Recipe[]> => {
    if (pantryIngredients.length === 0) {
      throw new Error('Informe ao menos 1 ingrediente');
    }
    if (selectedApplianceIds.length === 0) {
      throw new Error('Selecione ao menos 1 equipamento na sua cozinha');
    }

    setIsLoading(true);
    setLoadingMessage('Analisando sua geladeira e equipamentos...');

    try {
      // Map appliance names
      const applianceNames = selectedApplianceIds.map(id => {
        const found = appliances.find(a => a.id === id);
        return found ? found.name : id;
      });

      const result = await fetchGeneratedRecipes({
        ingredients: pantryIngredients,
        appliances: selectedApplianceIds,
        mealType: mealMoment,
      });

      setGeneratedRecipes(result.recipes);
      setRecipesDecidedCount(c => c + 1);
      setPantryOnlyMode(false);
      return result.recipes;
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
      const recipes = await generateRecipesFlow();
      if (recipes && recipes.length > 0) {
        // Pick best matching recipe
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
        mealMoment,
        setMealMoment,
        generatedRecipes,
        selectedRecipe,
        setSelectedRecipe,
        isLoading,
        loadingMessage,
        generateRecipesFlow,
        decideForMeQuickFlow,
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
