/**
 * Simple brand tagline block used on the Home page.
 * Keep it lightweight, professional, and translation-ready later.
 */
export default function Tagline() {
  return (
    <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/60 bg-white/70 dark:bg-gray-900/40 backdrop-blur p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          TropiNord
        </p>
        <h3 className="text-xl sm:text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
          Nature remembers, and so do we.
        </h3>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          Digitally traceable, thoughtfully sourced goods from the tropics, connecting
          small producers with conscious customers.
        </p>
      </div>
    </div>
  );
}
