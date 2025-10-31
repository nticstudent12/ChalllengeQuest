import { useEffect, useRef } from "react";

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient = ({ className = "" }: AnimatedGradientProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

      const drawGradientWave = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      // Use brand colors with transparency
      const isDark = document.documentElement.classList.contains("dark");

      // Create multiple gradient waves (reduced from 3 to 2 for performance)
      for (let i = 0; i < 2; i++) {
        const waveOffset = (time * (0.5 + i * 0.3)) % (Math.PI * 2);
        const waveAmplitude = 50 + i * 30;
        const waveFrequency = 0.002 + i * 0.001;

        const gradient = ctx.createLinearGradient(
          0,
          canvas.height / 2,
          canvas.width,
          canvas.height / 2
        );

        const primaryColor = isDark
          ? `hsla(263, 70%, 70%, ${0.12 - i * 0.04})`
          : `hsla(263, 70%, 60%, ${0.08 - i * 0.03})`;
        const secondaryColor = isDark
          ? `hsla(190, 95%, 70%, ${0.12 - i * 0.04})`
          : `hsla(190, 95%, 60%, ${0.08 - i * 0.03})`;

        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(0.5, secondaryColor);
        gradient.addColorStop(1, primaryColor);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        // Optimize: draw every 2 pixels instead of every pixel
        for (let x = 0; x < canvas.width; x += 2) {
          const y =
            canvas.height / 2 +
            Math.sin(x * waveFrequency + waveOffset + i * Math.PI) *
              waveAmplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(drawGradientWave);
    };

    drawGradientWave();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ mixBlendMode: "multiply" }}
    />
  );
};

export default AnimatedGradient;

