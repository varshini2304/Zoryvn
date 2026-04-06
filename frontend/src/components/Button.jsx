import { cn } from "../utils/cn";

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base"
  };

  const variants = {
    primary: "bg-ink text-white shadow-soft hover:bg-slate-800 hover:shadow-soft-lg focus:ring-ink",
    outline: "border border-slate-200 bg-white/50 backdrop-blur-md text-ink hover:border-ink hover:bg-white focus:ring-ink",
    ghost: "text-slate-600 hover:text-ink hover:bg-slate-100/80 focus:ring-slate-200",
    danger: "bg-rose text-white shadow-soft hover:bg-rose/90 hover:shadow-soft-lg focus:ring-rose"
  };

  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
