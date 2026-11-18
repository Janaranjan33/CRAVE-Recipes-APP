import { Heart, UtensilsCrossed } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Navbar() {
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-cream/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-tomato text-white">
            <UtensilsCrossed size={20} />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight">crave<span className="text-tomato">.</span></span>
        </Link>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-tomato" : "text-stone-600 hover:text-ink"}>Discover</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `flex items-center gap-1.5 ${isActive ? "text-tomato" : "text-stone-600 hover:text-ink"}`}>
            <Heart size={17} /> Saved <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-tomato">{favorites.length}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}