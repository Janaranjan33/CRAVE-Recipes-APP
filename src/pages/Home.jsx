import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import {
  getAllMeals, getAreas, getCategories, getMealsByArea, getMealsByCategory,
  getMealsByIngredient, getMealsByName
} from "../services/recipeApi";

const HOME_RECIPE_LIMIT = 50;

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const didInitialLoad = useRef(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setError("");
        const [categoryData, areaData] = await Promise.all([
          getCategories(), getAreas()
        ]);
        const allMeals = await getAllMeals(categoryData);
        setCategories(categoryData);
        setAreas(areaData);
        setMeals(allMeals.slice(0, HOME_RECIPE_LIMIT));
      } catch {
        setError("We couldn't load recipes. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!didInitialLoad.current) {
      didInitialLoad.current = true;
      return;
    }
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        // Each active filter returns meal IDs. Intersecting IDs makes filters work together.
        const requests = [];
        if (search.trim()) requests.push(getMealsByName(search.trim()));
        if (category) requests.push(getMealsByCategory(category));
        if (area) requests.push(getMealsByArea(area));
        if (ingredient.trim()) requests.push(getMealsByIngredient(ingredient.trim()));

        if (requests.length === 0) {
          const allMeals = await getAllMeals(categories);
          if (active) setMeals(allMeals.slice(0, HOME_RECIPE_LIMIT));
        } else {
          const results = await Promise.all(requests);
          const [first, ...rest] = results;
          const allowedIds = rest.reduce(
            (ids, list) => new Set(list.map((meal) => meal.idMeal).filter((id) => ids.has(id))),
            new Set(first.map((meal) => meal.idMeal))
          );
          const matchingMeals = first.filter((meal) => allowedIds.has(meal.idMeal));

          // Filter endpoints return summary objects. Search endpoint may contain full meal details.
          // Keep the first result's order and hydrate selected cards only when required.
          const hydrated = await Promise.all(matchingMeals.map(async (meal) => {
            if (meal.strCategory || meal.strInstructions) return meal;
            return meal;
          }));
          if (active) setMeals(hydrated);
        }
      } catch {
        if (active) setError("Something went wrong while searching. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, category, area, ingredient, categories]);

  const activeFilters = useMemo(
    () => [category, area, ingredient].filter(Boolean).length,
    [category, area, ingredient]
  );

  function clearFilters() {
    setSearch("");
    setCategory("");
    setArea("");
    setIngredient("");
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />
        <div className="absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24 lg:px-8">
          <div>
            <h1 className="max-w-2xl font-display text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Find your next <span className="italic text-tomato">favourite</span> meal.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-stone-600">
              Explore dishes from around the world, discover something new and bring a little more joy to your kitchen.
            </p>
            <a href="#recipes" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-tomato">Explore recipes <span className="ml-2">↓</span></a>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <img src="https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg" alt="A freshly prepared meal" className="aspect-[5/4] w-full rounded-[2rem] object-cover shadow-soft" />
            <div className="absolute -bottom-5 -left-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-soft sm:-left-8">
              <p className="text-xs font-semibold text-stone-500">A little inspiration</p>
              <p className="mt-1 font-display text-lg font-bold">Cook. Share. Enjoy.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="recipes" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 pt-12 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-tomato">The recipe collection</p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">What are you craving?</h2>
            <p className="mt-2 text-sm text-stone-500">Search, mix filters and find your next favourite.</p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-600 shadow-sm">{meals.length} recipes</span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={19} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by recipe name, e.g. Arrabiata..." className="w-full rounded-2xl border border-stone-200 bg-cream py-4 pl-12 pr-12 text-sm outline-none transition focus:border-tomato" />
            {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink" aria-label="Clear search"><X size={18} /></button>}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none focus:border-tomato">
                <option value="">All categories</option>
                {categories.map((item) => <option key={item.idCategory} value={item.strCategory}>{item.strCategory}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">Cuisine / area</span>
              <select value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none focus:border-tomato">
                <option value="">All cuisines</option>
                {areas.map((item) => <option key={item.strArea} value={item.strArea}>{item.strArea}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">Ingredient</span>
              <input value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="e.g. chicken_breast" className="w-full rounded-xl border border-stone-200 px-3 py-3 text-sm outline-none focus:border-tomato" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs text-stone-500"><SlidersHorizontal size={14} /> {activeFilters} active filter{activeFilters === 1 ? "" : "s"}</span>
            {(search || activeFilters > 0) && <button onClick={clearFilters} className="text-sm font-bold text-tomato hover:underline">Clear all</button>}
          </div>
        </div>

        <div className="mb-5 mt-10 flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold">Explore recipes</h3>
          <span className="text-xs text-stone-500">Powered by TheMealDB</span>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            {error} <button onClick={() => window.location.reload()} className="ml-2 font-bold underline">Reload</button>
          </div>
        ) : loading ? <Loading /> : meals.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {meals.map((meal) => <RecipeCard key={meal.idMeal} meal={meal} categoryLabel={meal.strCategory || category || meal.strArea || area || "Discover"} />)}
          </div>
        ) : <EmptyState />}
      </section>
    </>
  );
}
