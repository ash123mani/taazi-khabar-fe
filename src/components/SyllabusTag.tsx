const SUBJECT_COLORS: Record<string, string> = {
  Polity: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  History: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Geography: 'bg-green-500/20 text-green-300 border-green-500/30',
  Economy: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Environment: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Science: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Art & Culture': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Social Issues': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'International Relations': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Ethics: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

export default function SyllabusTag({ tag }: { tag: string | null }) {
  if (!tag) return null;

  const subject = tag.split(' > ')[0];
  const colorClass = SUBJECT_COLORS[subject] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${colorClass}`}
    >
      {tag}
    </span>
  );
}
