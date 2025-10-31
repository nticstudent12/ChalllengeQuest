import * as React from "react";
import { cn } from "@/lib/utils";
import { useHover } from "@/hooks/useHover";

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  floating?: boolean;
  glow?: boolean;
}

const FloatingCard = React.forwardRef<HTMLDivElement, FloatingCardProps>(
  ({ className, floating = true, glow = false, children, ...props }, ref) => {
    const { ref: hoverRef, isHovered } = useHover<HTMLDivElement>();

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          hoverRef.current = node;
        }}
        className={cn(
          "transition-all duration-300",
          floating && "hover:translate-y-[-4px] hover:shadow-lg",
          glow &&
            isHovered &&
            "shadow-[0_0_30px_hsl(263_70%_50%/0.3)] dark:shadow-[0_0_30px_hsl(263_70%_60%/0.4)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FloatingCard.displayName = "FloatingCard";

export { FloatingCard };

