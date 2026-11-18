import { SearchX } from "lucide-react";

export default function EmptyState({ title = "No recipes found", message = "Try changing your search or filters." }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-tomato"><SearchX size={25} /></span>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-stone-500">{message}</p>
    </div>
  );
}