const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition";
  const variants = {
    primary: "bg-ink text-white hover:bg-slate-900",
    outline: "border border-slate-200 bg-white text-ink hover:border-ink",
    ghost: "text-ink hover:bg-slate-100",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
};

export default Button;
