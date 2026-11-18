import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, Heart, MapPin, PlayCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getMealById } from "../services/recipeApi";
import { useFavorites } from "../context/FavoritesContext";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function RecipeDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let active = true;
    async function loadMeal() {
      setLoading(true);
      setError(false);
      try {
        const result = await getMealById(id);
        if (active) setMeal(result);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMeal();
    return () => { active = false; };
  }, [id]);

  if (loading) return <Loading label="Loading recipe details..." />;
  if (error) return <div className="mx-auto max-w-4xl px-5 py-16"><EmptyState title="Couldn't load this recipe" message="Please check your connection and try again." /></div>;
  if (!meal) return <div className="mx-auto max-w-4xl px-5 py-16"><EmptyState title="Recipe not found" message="This recipe may no longer be available." /></div>;

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    return {
      name: meal[`strIngredient${number}`]?.trim(),
      measure: meal[`strMeasure${number}`]?.trim(),
    };
  }).filter((item) => item.name);

  const instructions = (meal.strInstructions || "").split(/\r\n|\n|\r/).map((line) => line.trim()).filter(Boolean);
  const saved = isFavorite(meal.idMeal);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
      <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-tomato"><ArrowLeft size={17} /> Back to recipes</Link>
      <div className="grid gap-10 lg:grid-cols-[1fr_.9fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] bg-stone-100 shadow-soft">
            <img src={meal.strMealThumb} alt={meal.strMeal} className="aspect-[4/3] w-full object-cover" />
          </div>
          {meal.strYoutube && (
            <a href={meal.strYoutube} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-bold hover:border-tomato hover:text-tomato">
              <PlayCircle size={18} /> Watch cooking video
            </a>
          )}
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {meal.strCategory && <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-tomato">{meal.strCategory}</span>}
            {meal.strArea && <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-sage"><MapPin size={12} /> {meal.strArea}</span>}
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">{meal.strMeal}</h1>
          <p className="mt-4 leading-7 text-stone-600">Everything you need to prepare this dish at home. Check the ingredients, follow the steps and enjoy!</p>
          <button onClick={() => toggleFavorite(meal)} className={`mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${saved ? "bg-orange-100 text-tomato" : "bg-ink text-white hover:bg-tomato"}`}>
            <Heart size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved to favourites" : "Save this recipe"}
          </button>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Ingredients</h2>
              <span className="text-xs text-stone-500">{ingredients.length} items</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {ingredients.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm">
                  <span className="font-semibold">{item.name}</span>
                  <span className="shrink-0 text-right text-stone-500">{item.measure}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-14 max-w-4xl">
        <h2 className="mb-5 font-display text-3xl font-bold">Cooking instructions</h2>
        <div className="space-y-4">
          {instructions.map((step, index) => (
            <div key={index} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-bold text-tomato">{index + 1}</span>
              <p className="pt-1 text-sm leading-7 text-stone-600">{step}</p>
            </div>
          ))}
        </div>
        {meal.strSource && <a href={meal.strSource} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm font-bold text-tomato underline">View original source</a>}
      </section>
    </div>
  );
}