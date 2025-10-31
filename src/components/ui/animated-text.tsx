import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  effect?: "shimmer" | "glow" | "gradient" | "none";
  delay?: number;
}

const AnimatedText = React.forwardRef<HTMLElement, AnimatedTextProps>(
  (
    {
      className,
      as: Component = "span",
      effect = "none",
      delay = 0,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = "transition-all duration-300";
    
    const effectClasses = {
      shimmer:
        "bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]",
      glow: "text-primary drop-shadow-[0_0_8px_hsl(263_70%_50%/0.5)] hover:drop-shadow-[0_0_12px_hsl(263_90%_65%/0.7)]",
      gradient:
        "bg-gradient-to-r from-[hsl(263,70%,60%)] to-[hsl(190,95%,60%)] bg-clip-text text-transparent",
      none: "",
    };

    return (
      <Component
        ref={ref as any}
        className={cn(baseClasses, effectClasses[effect], className)}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
AnimatedText.displayName = "AnimatedText";

export { AnimatedText };

