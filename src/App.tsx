/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MyKitchenView } from './components/MyKitchenView';
import { IngredientsInputView } from './components/IngredientsInputView';
import { MealMomentView } from './components/MealMomentView';
import { HungerWheelView } from './components/HungerWheelView';
import { SpecialOccasionsView } from './components/SpecialOccasionsView';
import { DrinksView } from './components/DrinksView';
import { RecipeDetailView } from './components/RecipeDetailView';
import { StepByStepCookingMode } from './components/StepByStepCookingMode';
import { FavoritesView } from './components/FavoritesView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { Footer } from './components/Footer';
import { UpgradeModal } from './components/UpgradeModal';
import { DecideForMeModal } from './components/DecideForMeModal';
import { Disc } from 'lucide-react';

function AppContent() {
  const { activeView, isLoading, loadingMessage } = useApp();

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans overflow-x-hidden w-full max-w-full">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 pt-3 sm:pt-6">
        {activeView === 'home' && <HomeView />}
        {activeView === 'kitchen' && <MyKitchenView />}
        {activeView === 'ingredients' && <IngredientsInputView />}
        {activeView === 'meal-moment' && <MealMomentView />}
        {activeView === 'wheel' && <HungerWheelView />}
        {activeView === 'occasions' && <SpecialOccasionsView />}
        {activeView === 'drinks' && <DrinksView />}
        {activeView === 'recipe' && <RecipeDetailView />}
        {activeView === 'favorites' && <FavoritesView />}
        {activeView === 'history' && <HistoryView />}
        {activeView === 'profile' && <ProfileView />}
      </main>

      {/* Harmonious Footer */}
      <Footer />

      {/* Interactive Cooking Mode is a full-screen overlay */}
      {activeView === 'cooking-mode' && <StepByStepCookingMode />}

      {/* Global Modals */}
      <UpgradeModal />
      <DecideForMeModal />

      {/* Global Floating Loading Indicator */}
      {isLoading && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-bottom-4">
          <Disc className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-xs sm:text-sm font-bold">
            {loadingMessage || 'Processando com GuessFood...'}
          </span>
        </div>
      )}

      {/* Mobile-first bottom navigation */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
