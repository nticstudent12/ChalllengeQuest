import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "@/hooks/useReduceMotion";

const animatedButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow-primary)] hover:shadow-[0_0_50px_hsl(263_90%_65%/0.4)] hover:scale-105 active:scale-95",
        hero: "bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(230,80%,55%)] text-primary-foreground font-bold shadow-[var(--shadow-glow-primary)] hover:shadow-[0_0_60px_hsl(263_90%_65%/0.5)] hover:scale-105 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[var(--shadow-glow-secondary)] hover:shadow-[0_0_50px_hsl(190_95%_60%/0.4)] hover:scale-105 active:scale-95",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:scale-105 active:scale-95",
        glass:
          "glass-card text-foreground hover:bg-white/10 border border-white/20 hover:border-white/40 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean;
  shimmer?: boolean;
  glow?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      shimmer = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReduceMotion();
    const Comp = asChild ? Slot : "button";
    
    // Disable animations if user prefers reduced motion
    const shouldShimmer = shimmer && !prefersReducedMotion;
    const shouldGlow = glow && !prefersReducedMotion;
    
    return (
      <Comp
        className={cn(
          animatedButtonVariants({ variant, size, className }),
          prefersReducedMotion && "transition-none hover:scale-100 active:scale-100"
        )}
        ref={ref}
        {...props}
      >
        {shouldShimmer && (
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        {shouldGlow && (
          <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 blur-xl -z-10" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Comp>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };

