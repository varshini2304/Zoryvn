const Input = ({ label, className = "", ...props }) => {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label ? <span>{label}</span> : null}
      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-ink focus:ring-1 focus:ring-ink ${className}`}
        {...props}
      />
    </label>
  );
};

export default Input;
