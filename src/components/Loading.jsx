export default function Loading({ label = "Finding delicious ideas..." }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-stone-500">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-tomato" />
      <p className="text-sm">{label}</p>
    </div>
  );
}