# Animations Guide

This guide explains the animation system implemented across the website using React Bits-inspired components.

## Overview

The animation system provides:
- **Reusable components** for consistent animations
- **Performance-optimized** animations
- **Accessibility-friendly** with reduced motion support
- **Responsive** animations that adapt to screen size
- **Theme-aware** animations that match color scheme

## Components

### 1. AnimatedButton

Enhanced button component with optional shimmer and glow effects.

```tsx
import { AnimatedButton } from "@/components/ui/animated-button";

<AnimatedButton 
  variant="hero" 
  shimmer 
  glow
  onClick={handleClick}
>
  Click Me
</AnimatedButton>
```

**Props:**
- `variant`: Button style (hero, default, secondary, ghost, outline, glass)
- `shimmer`: Enable shimmer effect on hover
- `glow`: Enable glow effect on hover
- All standard button props are supported

### 2. AnimatedText

Text component with various animation effects.

```tsx
import { AnimatedText } from "@/components/ui/animated-text";

<AnimatedText 
  as="h1" 
  effect="gradient" 
>
  Animated Title
</AnimatedText>
```

**Effects:**
- `shimmer`: Shimmer animation
- `glow`: Glowing text effect
- `gradient`: Gradient text with brand colors
- `none`: No animation

### 3. AnimatedLink

Link component with hover animations.

```tsx
import { AnimatedLink } from "@/components/ui/animated-link";

<AnimatedLink 
  to="/dashboard" 
  variant="underline"
>
  Go to Dashboard
</AnimatedLink>
```

**Variants:**
- `default`: Scale on hover
- `underline`: Animated underline on hover
- `glow`: Glow effect on hover
- `shimmer`: Shimmer animation

### 4. FloatingCard

Card wrapper with floating and glow effects.

```tsx
import { FloatingCard } from "@/components/ui/floating-card";

<FloatingCard floating glow>
  <Card>
    {/* Card content */}
  </Card>
</FloatingCard>
```

**Props:**
- `floating`: Enable floating animation on hover
- `glow`: Enable glow effect on hover

## Hooks

### useHover

Hook to detect hover state for any element.

```tsx
import { useHover } from "@/hooks/useHover";

const { ref, isHovered } = useHover<HTMLDivElement>();

return <div ref={ref}>{isHovered ? "Hovering!" : "Not hovering"}</div>;
```

### useReduceMotion

Hook to detect if user prefers reduced motion (accessibility).

```tsx
import { useReduceMotion } from "@/hooks/useReduceMotion";

const prefersReducedMotion = useReduceMotion();

// Disable animations if user prefers reduced motion
const shouldAnimate = !prefersReducedMotion;
```

## Background Animations

### ParticlesBackground

Interactive particle system with:
- Click to add particles
- Hover to grab/repel particles
- Particle trails
- Theme-aware colors

### AnimatedGradient

Canvas-based gradient wave animations using brand colors.

### FloatingShapes

Floating geometric shapes (circles, triangles, squares) with rotation and movement.

### GradientOrbs

Large pulsing gradient orbs positioned strategically across the page.

## Performance Optimization

1. **Reduced Motion Support**: All animations respect user's motion preferences
2. **GPU Acceleration**: Uses `willChange` and `transform` for smooth animations
3. **Mobile Optimization**: Reduced particle/shape counts on mobile devices
4. **Efficient Rendering**: Canvas optimizations and requestAnimationFrame usage
5. **Lazy Loading**: Background animations only load on landing page

## Customization

### Colors

All animations use CSS variables from your design system:
- `--primary`: Primary color
- `--secondary`: Secondary color
- `--primary-glow`: Primary glow color
- `--shadow-glow-primary`: Primary shadow glow

### Animation Timing

Animations use consistent timing:
- Fast transitions: 300ms
- Medium transitions: 500ms
- Slow animations: 1000ms+

### Adding Custom Animations

1. Create component in `src/components/ui/`
2. Use Tailwind CSS classes or CSS keyframes
3. Add to `src/index.css` if using custom keyframes
4. Export and use across the app

## Best Practices

1. **Use AnimatedButton for CTAs**: Make important buttons stand out
2. **Apply FloatingCard to cards**: Enhance card interactivity
3. **Use AnimatedText for headings**: Make titles engaging
4. **Respect reduced motion**: Always check `useReduceMotion`
5. **Test on mobile**: Ensure animations don't impact performance
6. **Keep it subtle**: Don't over-animate; focus on key interactions

## Examples

### Landing Page
- Hero buttons: `AnimatedButton` with shimmer and glow
- Headings: `AnimatedText` with gradient effect
- Background: Multi-layer particle system

### Dashboard
- Challenge cards: `FloatingCard` wrapper
- Action buttons: `AnimatedButton` with shimmer
- Cards float and glow on hover

### Profile Page
- Statistics cards: `FloatingCard` with glow
- Buttons: `AnimatedButton` variants
- Smooth transitions throughout

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS transforms and animations
- Canvas API for gradient waves
- Intersection Observer for scroll animations (if added)

## Accessibility

- Respects `prefers-reduced-motion` media query
- All animations are optional enhancements
- Focus states remain visible
- Keyboard navigation works normally
- Screen readers are not affected

