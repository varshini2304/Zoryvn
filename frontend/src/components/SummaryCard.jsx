const SummaryCard = ({ title, value, accent = "bg-ink" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className={`h-2 w-10 rounded-full ${accent}`} />
      </div>
      <p className="mt-4 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
};

export default SummaryCard;
