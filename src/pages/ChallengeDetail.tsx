import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { Crown, MapPin, Clock, Trophy, Users, CheckCircle, Circle, Lock, Upload, QrCode, Navigation } from "lucide-react";

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock challenge data
  const challenge = {
    title: "City Explorer Quest",
    description: "Navigate through historic landmarks and discover hidden gems in the city center.",
    story: "The ancient city holds secrets waiting to be discovered. Follow the trail of historical markers, scan mysterious QR codes, and piece together the map to reveal the hidden treasure. Each stage brings you closer to unlocking the final mystery!",
    category: "Urban Adventure",
    difficulty: "medium" as const,
    xpReward: 500,
    deadline: "2 days left",
    participants: 234,
    currentStage: 3,
    totalStages: 6
  };

  const stages = [
    {
      id: 1,
      name: "City Hall Plaza",
      description: "Begin your journey at the historic City Hall. Scan the QR code at the main entrance.",
      status: "completed" as const,
      xp: 50,
      verificationType: "QR Code",
      location: "City Hall, Downtown"
    },
    {
      id: 2,
      name: "Museum District",
      description: "Navigate to the Museum District and capture a photo of the iconic fountain.",
      status: "completed" as const,
      xp: 75,
      verificationType: "Photo",
      location: "Museum Quarter"
    },
    {
      id: 3,
      name: "Riverside Park",
      description: "Head to Riverside Park and verify your location near the old bridge.",
      status: "active" as const,
      xp: 100,
      verificationType: "GPS Check",
      location: "Riverside Park, East Side"
    },
    {
      id: 4,
      name: "Tech Center",
      description: "Visit the Innovation Hub and complete the digital puzzle.",
      status: "locked" as const,
      xp: 100,
      verificationType: "GPS + QR",
      location: "Tech District"
    },
    {
      id: 5,
      name: "Historic Library",
      description: "Explore the ancient library and find the hidden marker.",
      status: "locked" as const,
      xp: 125,
      verificationType: "Photo",
      location: "Library Square"
    },
    {
      id: 6,
      name: "Final Stage: City Treasure",
      description: "Use all your collected map pieces to locate the final treasure!",
      status: "locked" as const,
      xp: 200,
      verificationType: "GPS + Photo",
      location: "Secret Location"
    }
  ];

  const progress = (challenge.currentStage / challenge.totalStages) * 100;

  const getStageIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="w-5 h-5 text-success" />;
    if (status === "active") return <Circle className="w-5 h-5 text-secondary" />;
    return <Lock className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Crown className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(263,70%,60%)] to-[hsl(190,95%,60%)] bg-clip-text text-transparent">
              ChallengeQuest
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Challenge Header */}
        <div className="glass-card rounded-xl p-8 mb-8 border border-primary/20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{challenge.category}</Badge>
                <Badge className="bg-accent text-accent-foreground">{challenge.difficulty.toUpperCase()}</Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{challenge.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">{challenge.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span>{challenge.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>{challenge.participants} players</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{challenge.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-success" />
                  <span>{challenge.totalStages} stages</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold">{challenge.currentStage}/{challenge.totalStages} stages</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </div>

            <div className="md:w-80">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Challenge Story</h3>
                  <p className="text-sm text-muted-foreground mb-4">{challenge.story}</p>
                  <Button variant="hero" className="w-full">
                    View Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Challenge Stages</h2>
          
          {stages.map((stage, index) => (
            <Card key={stage.id} className={`glass-card border ${stage.status === "active" ? "border-secondary" : "border-border/50"}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow-primary)]">
                    {getStageIcon(stage.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">Stage {stage.id}: {stage.name}</h3>
                        <p className="text-sm text-muted-foreground">{stage.location}</p>
                      </div>
                      <Badge variant="outline">+{stage.xp} XP</Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">{stage.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {stage.verificationType === "QR Code" && <QrCode className="w-4 h-4" />}
                          {stage.verificationType === "Photo" && <Upload className="w-4 h-4" />}
                          {stage.verificationType === "GPS Check" && <Navigation className="w-4 h-4" />}
                          {stage.verificationType === "GPS + QR" && <><Navigation className="w-4 h-4" /><QrCode className="w-4 h-4" /></>}
                          {stage.verificationType === "GPS + Photo" && <><Navigation className="w-4 h-4" /><Upload className="w-4 h-4" /></>}
                          {stage.verificationType}
                        </span>
                      </div>

                      {stage.status === "completed" && (
                        <Badge className="bg-success text-success-foreground">Completed ✓</Badge>
                      )}
                      {stage.status === "active" && (
                        <Button variant="secondary">
                          Submit Proof
                        </Button>
                      )}
                      {stage.status === "locked" && (
                        <Button variant="ghost" disabled>
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard Preview */}
        <Card className="glass-card border-border/50 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Challenge Leaderboard</h3>
              <Button variant="ghost" onClick={() => navigate("/leaderboard")}>
                View All →
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { rank: 1, name: "SpeedRunner", stage: 6, time: "2h 15m" },
                { rank: 2, name: "Explorer_X", stage: 6, time: "2h 48m" },
                { rank: 3, name: "QuestMaster", stage: 5, time: "3h 12m" }
              ].map((player) => (
                <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-accent">#{player.rank}</span>
                    <span className="font-semibold">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Stage {player.stage}/6</span>
                    <span>{player.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeDetail;
