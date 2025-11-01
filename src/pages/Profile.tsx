import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  Shield,
  KeyRound,
  Trophy,
  Zap,
  Target,
  Award,
  Activity,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile, useAuth, useUserChallenges, useUserRank } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";

const Profile = () => {
  console.log("🌍 API base URL =", import.meta.env.VITE_API_URL);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changing, setChanging] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Load user profile and challenges
  const { data: profile, isLoading, error } = useProfile();
  const { data: userChallenges, isLoading: challengesLoading } = useUserChallenges();
  const { data: userRank } = useUserRank('ALL_TIME');
  
  // Calculate stats
  const stats = {
    totalXP: profile?.xp || 0,
    level: profile?.level || 1,
    rank: userRank?.rank || profile?.rank || null,
    activeChallenges: userChallenges?.filter(c => c.status === 'ACTIVE').length || 0,
    completedChallenges: userChallenges?.filter(c => c.status === 'COMPLETED').length || 0,
    totalChallenges: userChallenges?.length || 0,
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast({
        title: "⚠️ Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "❌ Passwords do not match",
        description: "Make sure the new and confirm passwords are identical.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setChanging(true);

      const token = localStorage.getItem("auth_token");
      const baseUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${baseUrl}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "✅ Password changed successfully!",
          description: "Your password has been updated securely.",
          duration: 3000,
          className:
            "border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100",
        });

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "❌ Failed to change password",
          description: data.message || "An unknown error occurred.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch {
      toast({
        title: "⚠️ Network error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setChanging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load profile. Please try logging in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // XP and level logic
  const currentLevelXP = (profile.level - 1) * 1000;
  const nextLevelXP = profile.level * 1000;
  const xpProgress =
    ((profile.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="min-h-screen">
      <Navbar variant="client" />

      {/* Profile Content */}
      <main className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="glass-card border border-primary/20 rounded-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow-primary)] border-4 border-background">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-primary-foreground" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {profile.isAdmin && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg mb-3">@{profile.username}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                  {stats.rank && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-accent" />
                      <span>Rank #{stats.rank}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Level {stats.level} Progress
                </span>
                <span className="font-semibold">
                  {profile.xp} / {nextLevelXP} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{nextLevelXP - profile.xp} XP until Level {stats.level + 1}</span>
                <span>{Math.round(xpProgress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold">{stats.totalXP}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold">{stats.level}</span>
              </div>
              <p className="text-sm text-muted-foreground">Level</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold">{stats.activeChallenges}</span>
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold">{stats.completedChallenges}</span>
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Challenges and Settings */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="challenges">
              <Activity className="w-4 h-4 mr-2" />
              My Challenges ({stats.totalChallenges})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <KeyRound className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-6">
            {challengesLoading ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your challenges...</p>
                </CardContent>
              </Card>
            ) : stats.totalChallenges === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Challenges Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your journey by joining a challenge from the dashboard!
                  </p>
                  <Button variant="hero" onClick={() => navigate("/dashboard")}>
                    Browse Challenges
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Active Challenges */}
                {stats.activeChallenges > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-primary" />
                      Active Challenges ({stats.activeChallenges})
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userChallenges
                        ?.filter(c => c.status === 'ACTIVE')
                        .map((userChallenge) => {
                          const completedStages = userChallenge.stages.filter(
                            s => s.status === 'COMPLETED'
                          ).length;
                          const totalStages = userChallenge.challenge?.stages?.length || 0;
                          const progress = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;
                          
                          if (!userChallenge.challenge) return null;
                          
                          return (
                            <Card key={userChallenge.id} className="glass-card border-primary/20 hover:border-primary/50 transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {userChallenge.challenge.category || 'Challenge'}
                                  </Badge>
                                  <Badge className="bg-primary text-primary-foreground">
                                    ACTIVE
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg">{userChallenge.challenge.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {userChallenge.challenge.description || 'No description'}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Progress</span>
                                    <span>{completedStages}/{totalStages} stages</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Trophy className="w-4 h-4 text-accent" />
                                  <span>{userChallenge.challenge.xpReward || 0} XP reward</span>
                                </div>
                                <Button 
                                  variant="hero" 
                                  className="w-full"
                                  onClick={() => navigate(`/challenge/${userChallenge.challengeId}`)}
                                >
                                  Continue Challenge
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })
                        .filter(Boolean)}
                    </div>
                  </div>
                )}

                {/* Completed Challenges */}
                {stats.completedChallenges > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-success" />
                      Completed Challenges ({stats.completedChallenges})
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userChallenges
                        ?.filter(c => c.status === 'COMPLETED')
                        .slice(0, 6)
                        .map((userChallenge) => {
                          if (!userChallenge.challenge) return null;
                          return (
                            <Card key={userChallenge.id} className="glass-card border-success/20 hover:border-success/50 transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {userChallenge.challenge.category || 'Challenge'}
                                  </Badge>
                                  <Badge className="bg-success text-success-foreground">
                                    COMPLETED
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg">{userChallenge.challenge.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {userChallenge.challenge.description || 'No description'}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Trophy className="w-4 h-4 text-accent" />
                                  <span>Earned {userChallenge.challenge.xpReward || 0} XP</span>
                                </div>
                                {userChallenge.completedAt && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    <span>Completed {new Date(userChallenge.completedAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => navigate(`/challenge/${userChallenge.challengeId}`)}
                                >
                                  View Details
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })
                        .filter(Boolean)}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="settings">
            {/* Change Password Section */}
            <Card className="glass-card border border-border/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" /> Change Password
              </h2>
              {changing && (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
            </div>

            {/* Status Alerts */}

            {/* Inputs Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  key: "current",
                  placeholder: "Current Password",
                  value: passwordData.currentPassword,
                },
                {
                  key: "new",
                  placeholder: "New Password",
                  value: passwordData.newPassword,
                },
                {
                  key: "confirm",
                  placeholder: "Confirm Password",
                  value: passwordData.confirmPassword,
                },
              ].map((field) => (
                <div key={field.key} className="relative group">
                  <Input
                    type={
                      showPassword[field.key as keyof typeof showPassword]
                        ? "text"
                        : "password"
                    }
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        [`${field.key}Password`]: e.target.value,
                      } as typeof passwordData)
                    }
                    className="pr-10 focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        [field.key]:
                          !showPassword[field.key as keyof typeof showPassword],
                      })
                    }>
                    {showPassword[field.key as keyof typeof showPassword] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleChangePassword}
                disabled={changing}
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all rounded-lg shadow-md">
                {changing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Change Password
              </Button>
            </div>
          </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
