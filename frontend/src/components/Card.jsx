import { cn } from "../utils/cn";

const Card = ({ children, className = "", animate = false }) => {
  return (
    <div 
      className={cn(
        "card-base p-6",
        animate && "animate-slide-up hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
