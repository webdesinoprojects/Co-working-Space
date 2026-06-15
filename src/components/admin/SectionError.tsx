export function SectionError({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-8 text-center max-w-sm shadow-lg">
        <p className="text-neutral-700 font-semibold">Failed to load {label} section</p>
        <p className="text-neutral-500 text-sm mt-1">Check your database connection and refresh.</p>
      </div>
    </div>
  );
}
