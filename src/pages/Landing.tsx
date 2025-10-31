import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedText } from "@/components/ui/animated-text";
import { AnimatedLink } from "@/components/ui/animated-link";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Map,
  Zap,
  Target,
  Crown,
  LogOut,
  CheckCircle,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ParticlesBackground from "@/components/ParticlesBackground";
import AnimatedGradient from "@/components/AnimatedGradient";
import FloatingShapes from "@/components/FloatingShapes";
import GradientOrbs from "@/components/GradientOrbs";

const Landing = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token); // true if token exists
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);

    // ✅ Show animated success toast
    toast({
      title: "✅ Successfully logged out",
      description: "Hope to see you again soon!",
      duration: 2500,
      className:
        "border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100",
    });

    navigate("/");
  };

  const features = [
    {
      icon: Map,
      title: t("landing.features.gpsChallenges.title"),
      description: t("landing.features.gpsChallenges.description"),
    },
    {
      icon: Trophy,
      title: t("landing.features.leaderboards.title"),
      description: t("landing.features.leaderboards.description"),
    },
    {
      icon: Target,
      title: t("landing.features.multiStage.title"),
      description: t("landing.features.multiStage.description"),
    },
    {
      icon: Zap,
      title: t("landing.features.rewards.title"),
      description: t("landing.features.rewards.description"),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Multi-Layer Animated Background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        {/* Base: Gradient Orbs */}
        <GradientOrbs />
        
        {/* Layer 1: Floating Geometric Shapes */}
        <FloatingShapes />
        
        {/* Layer 2: Animated Gradient Waves */}
        <AnimatedGradient />
        
        {/* Layer 3: Interactive Particles */}
        <ParticlesBackground />
      </div>
      
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50 relative">
        <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[hsl(263,70%,60%)] to-[hsl(190,95%,60%)] bg-clip-text text-transparent truncate">
              ChallengeQuest
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />

            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex text-sm"
                >
                  {t("navigation.login")}
                </Button>
                <Button 
                  variant="hero" 
                  onClick={() => navigate("/register")}
                  className="text-xs sm:text-sm px-2 sm:px-4 h-9 sm:h-10"
                >
                  <span className="hidden sm:inline">{t("landing.getStarted")}</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout from your account</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {t("landing.tagline")}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <AnimatedText
              as="span"
              effect="gradient"
              className="block mb-2"
            >
              {t("landing.title")}
            </AnimatedText>
            <AnimatedText
              as="span"
              effect="none"
              className="text-foreground block"
            >
              {t("landing.subtitle")}
            </AnimatedText>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("landing.description")}
          </p>

          <div className="flex items-center justify-center gap-4 pt-6">
            <AnimatedButton
              variant="hero"
              size="xl"
              shimmer
              glow
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            >
              {isAuthenticated ? t("navigation.dashboard") || "Go to Dashboard" : t("landing.startJourney")}
            </AnimatedButton>
            <AnimatedButton
              variant="glass"
              size="xl"
              shimmer
              onClick={() => navigate("/leaderboard")}
            >
              {t("landing.viewLeaderboard")}
            </AnimatedButton>
          </div>

          <div className="flex items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              <span>{t("landing.activePlayers")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              <span>{t("landing.totalChallenges")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <AnimatedText as="span" effect="gradient">
              {t("landing.howItWorks")}
            </AnimatedText>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("landing.howItWorksSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-[var(--shadow-glow-primary)] group-hover:shadow-[0_0_50px_hsl(263_90%_65%/0.4)]">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="glass-card rounded-2xl p-12 text-center border-2 border-primary/20 shadow-[var(--shadow-card)]">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <AnimatedText as="span" effect="gradient">
              {t("landing.readyToCompete")}
            </AnimatedText>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {t("landing.readyToCompeteSubtitle")}
          </p>
          <AnimatedButton
            variant="hero"
            size="xl"
            shimmer
            glow
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
          >
            {isAuthenticated ? t("navigation.dashboard") || "Go to Dashboard" : t("landing.createFreeAccount")}
          </AnimatedButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 ChallengeQuest. {t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
