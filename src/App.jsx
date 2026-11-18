import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import Favorites from "./pages/Favorites";
import { FavoritesContext } from "./context/FavoritesContext";

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("crave-favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("crave-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo(() => ({
    favorites,
    isFavorite: (id) => favorites.some((meal) => meal.idMeal === id),
    toggleFavorite: (meal) => {
      setFavorites((current) =>
        current.some((item) => item.idMeal === meal.idMeal)
          ? current.filter((item) => item.idMeal !== meal.idMeal)
          : [...current, meal]
      );
    },
  }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <footer className="border-t border-stone-200/80 py-8 text-center text-sm text-stone-500">
          Made with care · Recipe data powered by TheMealDB
        </footer>
      </div>
    </FavoritesContext.Provider>
  );
}