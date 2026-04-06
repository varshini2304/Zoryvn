import { cn } from "../utils/cn";

const Input = ({ label, className = "", ...props }) => {
  return (
    <label className="block w-full">
      {label && <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>}
      <input
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm text-ink shadow-sm transition-all duration-200",
          "placeholder:text-slate-400 focus:border-ocean focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean/10",
          className
        )}
        {...props}
      />
    </label>
  );
};

export default Input;
