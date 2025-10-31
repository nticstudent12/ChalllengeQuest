import { useEffect, useState } from "react";

const GradientOrbs = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const orbs = [
    {
      size: "w-[500px] h-[500px] sm:w-[600px] sm:h-[600px]",
      position: "top-[-250px] left-[-100px] sm:top-[-300px] sm:left-[-150px]",
      colorFrom: isDark ? "hsl(263,70%,60%)" : "hsl(263,70%,70%)",
      colorVia: isDark ? "hsl(263,90%,50%)" : "hsl(263,90%,60%)",
      opacity: isDark ? 0.3 : 0.2,
      duration: "3s",
    },
    {
      size: "w-[600px] h-[600px] sm:w-[700px] sm:h-[700px]",
      position: "top-[50%] right-[-200px] sm:right-[-250px]",
      colorFrom: isDark ? "hsl(190,95%,60%)" : "hsl(190,95%,70%)",
      colorVia: isDark ? "hsl(190,95%,50%)" : "hsl(190,95%,60%)",
      opacity: isDark ? 0.25 : 0.15,
      duration: "4s",
      delay: "1s",
    },
    {
      size: "w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]",
      position: "bottom-[-150px] left-[30%] sm:bottom-[-200px]",
      colorFrom: isDark ? "hsl(230,80%,55%)" : "hsl(230,80%,65%)",
      colorVia: isDark ? "hsl(230,80%,45%)" : "hsl(230,80%,55%)",
      opacity: isDark ? 0.2 : 0.1,
      duration: "3.5s",
      delay: "2s",
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <div
          key={index}
          className={`absolute ${orb.size} ${orb.position} rounded-full blur-3xl animate-pulse`}
          style={{
            background: `radial-gradient(circle, ${orb.colorFrom}, ${orb.colorVia}, transparent)`,
            opacity: orb.opacity,
            animationDuration: orb.duration,
            animationDelay: orb.delay || "0s",
            willChange: "opacity",
          }}
        />
      ))}
    </div>
  );
};

export default GradientOrbs;

