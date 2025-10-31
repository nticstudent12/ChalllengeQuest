import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Crown, Users, Trophy, Activity, Plus, Eye, CheckCircle, XCircle, AlertTriangle, Loader2, User, Tag } from "lucide-react";
import { useChallenges, useLeaderboardStats } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useCreateCategory } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Category dialog state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [categoryColor, setCategoryColor] = useState("");

  const { data: statsData, isLoading: statsLoading } = useLeaderboardStats();
  const { data: challengesData, isLoading: challengesLoading } = useChallenges({ status: 'all', limit: 100 });
  const createCategoryMutation = useCreateCategory();
  
  const stats = {
    activeChallenges: challengesData?.challenges?.length ?? 0,
    totalPlayers: statsData?.totalUsers ?? 0,
    activePlayers: 0,
    topPerformers: statsData?.topUser ? 1 : 0,
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "❌ Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
        icon: categoryIcon.trim() || undefined,
        color: categoryColor.trim() || undefined,
      });

      toast({
        title: "✅ Category Created!",
        description: `Category "${categoryName}" has been successfully created.`,
        duration: 3000,
      });

      // Reset form
      setCategoryName("");
      setCategoryDescription("");
      setCategoryIcon("");
      setCategoryColor("");
      setIsCategoryDialogOpen(false);
    } catch (err) {
      toast({
        title: "❌ Error Creating Category",
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
        duration: 4000,
        variant: "destructive",
      });
    }
  };

  const pendingSubmissions: Array<{
    id: number;
    player: string;
    challenge: string;
    stage: number;
    type: string;
    timestamp: string;
  }> = [];

  const activeChallenges = (challengesData?.challenges ?? []).map((c) => ({
    id: c.id,
    name: c.title,
    participants: c._count?.progress ?? 0,
    completionRate: 0,
    status: "Active",
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[hsl(263,70%,60%)] to-[hsl(190,95%,60%)] bg-clip-text text-transparent truncate">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/")}
                  className="hidden sm:inline-flex text-sm"
                >
                  View Site
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View public site</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/profile")}
                  className="h-9 w-9 sm:h-10 sm:w-10"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View your profile</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCategoryDialogOpen(true)}
                  className="text-xs sm:text-sm px-2 sm:px-4 h-9 sm:h-10"
                >
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Category</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new category for challenges</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="hero" 
                  onClick={() => navigate("/admin/create-challenge")}
                  className="text-xs sm:text-sm px-2 sm:px-4 h-9 sm:h-10"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Challenge</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new challenge</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {(statsLoading || challengesLoading) && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        )}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription>Active Challenges</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.activeChallenges}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-success">
                <Activity className="w-4 h-4" />
                <span>Currently Running</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-secondary/20">
            <CardHeader className="pb-3">
              <CardDescription>Total Players</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.totalPlayers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Users className="w-4 h-4" />
                <span>{stats.activePlayers} Active Now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-accent/20">
            <CardHeader className="pb-3">
              <CardDescription>Active Players</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.activePlayers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-accent">
                <Activity className="w-4 h-4" />
                <span>In Challenges</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardDescription>Top Performers</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.topPerformers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4" />
                <span>This Week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="submissions">
              Submissions
              <Badge variant="destructive" className="ml-2">{pendingSubmissions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pending Submissions */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Submissions</CardTitle>
                    <CardDescription>Review and approve player submissions</CardDescription>
                  </div>
                  <Badge variant="destructive">{pendingSubmissions.length} Pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingSubmissions.length === 0 && (
                    <div className="text-sm text-muted-foreground py-4">No pending submissions.</div>
                  )}
                  {pendingSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Eye className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">{submission.player}</p>
                          <p className="text-sm text-muted-foreground">{submission.challenge} - Stage {submission.stage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{submission.type}</Badge>
                        <span className="text-sm text-muted-foreground">{submission.timestamp}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="bg-success hover:bg-success/90">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Challenges */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Challenges</CardTitle>
                    <CardDescription>Currently running challenges</CardDescription>
                  </div>
                  <Button variant="hero" onClick={() => navigate("/admin/create-challenge")}>
                    <Plus className="w-4 h-4" />
                    Create New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeChallenges.length === 0 && (
                    <div className="text-sm text-muted-foreground py-4">No active challenges.</div>
                  )}
                  {activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                      <div>
                        <p className="font-semibold">{challenge.name}</p>
                        <p className="text-sm text-muted-foreground">{challenge.participants} participants</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Completion Rate</p>
                          <p className="font-bold text-success">{challenge.completionRate}%</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">{challenge.status}</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="mb-4">Challenge management panel</p>
              <Button variant="hero" onClick={() => navigate("/admin/create-challenge")}>
                <Plus className="w-4 h-4" />
                Create First Challenge
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="players">
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Player management and tracking</p>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Submission review system</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Analytics and reports</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category that can be used when creating challenges.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                placeholder="e.g., Urban Exploration"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description (optional)</Label>
              <Textarea
                id="category-description"
                placeholder="Brief description of this category"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon (optional)</Label>
                <Input
                  id="category-icon"
                  placeholder="Icon name or emoji"
                  value={categoryIcon}
                  onChange={(e) => setCategoryIcon(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-color">Color (optional)</Label>
                <Input
                  id="category-color"
                  type="color"
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCategoryDialogOpen(false);
                setCategoryName("");
                setCategoryDescription("");
                setCategoryIcon("");
                setCategoryColor("");
              }}
              disabled={createCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={createCategoryMutation.isPending || !categoryName.trim()}
              variant="hero"
            >
              {createCategoryMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
