import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import EmptyState from "../components/EmptyState";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-5 py-14 lg:px-8">
      <div className="mb-9">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-tomato"><Heart size={14} /> Your collection</p>
        <h1 className="font-display text-4xl font-bold">Saved recipes</h1>
        <p className="mt-2 text-sm text-stone-500">Your favourite dishes, all in one place.</p>
      </div>
      {favorites.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((meal) => <RecipeCard key={meal.idMeal} meal={meal} categoryLabel="Your favourite" />)}
        </div>
      ) : (
        <div className="space-y-5">
          <EmptyState title="No saved recipes yet" message="Tap the heart on any recipe to keep it here for later." />
          <div className="text-center"><Link to="/" className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-tomato">Discover recipes</Link></div>
        </div>
      )}
    </section>
  );
}