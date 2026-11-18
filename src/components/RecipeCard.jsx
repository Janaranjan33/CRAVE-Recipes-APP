import { Heart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function RecipeCard({ meal, categoryLabel = "Recipe" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(meal.idMeal);

  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative overflow-hidden">
        <Link to={`/recipe/${meal.idMeal}`} aria-label={`View ${meal.strMeal}`}>
          <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(meal)}
          aria-label={saved ? "Remove from favourites" : "Add to favourites"}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow transition hover:scale-105 ${saved ? "text-tomato" : "text-stone-500"}`}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.15em] text-sage">{categoryLabel}</p>
        <div className="flex items-start justify-between gap-3">
          <Link to={`/recipe/${meal.idMeal}`} className="line-clamp-2 font-display text-lg font-bold leading-snug hover:text-tomato">{meal.strMeal}</Link>
          <Link to={`/recipe/${meal.idMeal}`} className="mt-1 shrink-0 text-stone-400 transition group-hover:text-tomato" aria-label="Open recipe"><ArrowUpRight size={19} /></Link>
        </div>
      </div>
    </article>
  );
}