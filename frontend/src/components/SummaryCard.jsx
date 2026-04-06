import { cn } from "../utils/cn";

const SummaryCard = ({ title, value, icon: Icon, accentClass = "text-sea bg-sea/10", animateDelay = "" }) => {
  return (
    <div className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 card-shadow transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 animate-slide-up",
        animateDelay
      )}
    >
      {/* Background ambient glow based on accent */}
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-40", accentClass.split(' ')[1])} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-4 text-3xl font-display font-semibold tracking-tight text-ink">{value}</p>
        </div>
        
        {Icon && (
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", accentClass)}>
            <Icon size={24} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
