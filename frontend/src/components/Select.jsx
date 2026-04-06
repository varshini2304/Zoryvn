import { cn } from "../utils/cn";

const Select = ({ label, className = "", children, ...props }) => {
  return (
    <label className="block w-full">
      {label && <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>}
      <select
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm text-ink shadow-sm transition-all duration-200",
          "focus:border-ocean focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean/10",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};

export default Select;
