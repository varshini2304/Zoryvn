const Select = ({ label, className = "", children, ...props }) => {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label ? <span>{label}</span> : null}
      <select
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-ink focus:ring-1 focus:ring-ink ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};

export default Select;
