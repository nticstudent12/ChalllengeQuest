import * as React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps extends LinkProps {
  variant?: "default" | "underline" | "glow" | "shimmer";
  className?: string;
  children: React.ReactNode;
}

const AnimatedLink = React.forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center transition-all duration-300 relative";

    const variantClasses = {
      default:
        "text-primary hover:text-primary/80 hover:scale-105 active:scale-95",
      underline:
        "text-primary hover:text-primary/80 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
      glow: "text-primary hover:text-primary/80 hover:drop-shadow-[0_0_8px_hsl(263_70%_50%/0.6)]",
      shimmer:
        "text-primary hover:text-primary/80 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_100%] hover:animate-[shimmer_2s_ease-in-out_infinite]",
    };

    return (
      <Link
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
AnimatedLink.displayName = "AnimatedLink";

export { AnimatedLink };

