import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Save, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useCategories } from "@/hooks/useApi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Stage {
  id: number;
  title: string;
  description: string;
  gps: string;
  radius?: number;
  qrCode?: string;
}

const CreateChallenge = () => {
  const navigate = useNavigate();
  
  // Fetch categories from backend
  const { data: categories, isLoading: categoriesLoading } = useCategories(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [xpReward, setXpReward] = useState(500);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState(24);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined);
  
  // Stages state
  const [stages, setStages] = useState<Stage[]>([
    { id: 1, title: "", description: "", gps: "", radius: 50 }
  ]);

  const addStage = () => {
    setStages([...stages, { id: stages.length + 1, title: "", description: "", gps: "", radius: 50 }]);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!title.trim() || !description.trim() || !category || !startDate) {
    toast({
      title: "❌ Validation Error",
      description: "Please fill in all required fields.",
      variant: "destructive",
    });
    return;
  }

  if (stages.length === 0) {
    toast({
      title: "❌ Validation Error",
      description: "Please add at least one stage.",
      variant: "destructive",
    });
    return;
  }

  try {
    // Calculate endDate from startDate + duration
    const startDateTime = new Date(startDate);
    if (isNaN(startDateTime.getTime())) {
      throw new Error("Invalid start date");
    }

    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
    
    // Validate stages
    const validatedStages = stages.map((stage, index) => {
      if (!stage.title.trim() || !stage.description.trim() || !stage.gps.trim()) {
        throw new Error(`Stage ${index + 1} is missing required fields`);
      }

      const gpsParts = stage.gps.split(",").map(s => s.trim());
      if (gpsParts.length !== 2) {
        throw new Error(`Stage ${index + 1} GPS coordinates must be in format "latitude, longitude"`);
      }

      const latitude = parseFloat(gpsParts[0]);
      const longitude = parseFloat(gpsParts[1]);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error(`Stage ${index + 1} has invalid GPS coordinates`);
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        throw new Error(`Stage ${index + 1} has GPS coordinates out of valid range`);
      }

      return {
        order: index + 1,
        title: stage.title.trim(),
        description: stage.description.trim(),
        latitude,
        longitude,
        radius: stage.radius || 50,
        ...(stage.qrCode && { qrCode: stage.qrCode.trim() }),
      };
    });

    const challengeData = {
      title: title.trim(),
      description: description.trim(),
      category: category,
      difficulty: difficulty.toUpperCase() as "EASY" | "MEDIUM" | "HARD",
      xpReward: xpReward,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      ...(maxParticipants && maxParticipants > 0 && { maxParticipants }),
      stages: validatedStages,
    };

    await apiClient.createChallenge(challengeData);

    toast({
      title: "🎯 Challenge Created!",
      description: "Your challenge has been successfully created.",
      duration: 3000,
    });

    navigate("/admin");
  } catch (err) {
    toast({
      title: "❌ Error Creating Challenge",
      description: err instanceof Error ? err.message : "An unexpected error occurred.",
      duration: 4000,
      variant: "destructive",
    });
  }
};


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/admin")}
                className="text-xs sm:text-sm px-2 sm:px-4 h-9 sm:h-10 flex-shrink-0"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 hidden sm:inline" />
                <span className="hidden sm:inline">Back to Admin</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to admin dashboard</p>
            </TooltipContent>
          </Tooltip>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center truncate flex-1 min-w-0">
            Create New Challenge
          </h1>
          <div className="w-12 sm:w-24 flex-shrink-0" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Set up the main details of your challenge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Challenge Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter challenge name" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your challenge" 
                  rows={3} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} disabled={categoriesLoading}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      ) : categories && categories.length > 0 ? (
                        categories
                          .filter(cat => cat.isActive)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.icon && <span className="mr-2">{cat.icon}</span>}
                              {cat.name}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input 
                    id="startDate" 
                    type="datetime-local" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="24" 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value) || 24)}
                    min="1"
                    required 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input 
                    id="xpReward" 
                    type="number" 
                    placeholder="500" 
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value) || 500)}
                    min="1"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants (optional)</Label>
                  <Input 
                    id="maxParticipants" 
                    type="number" 
                    placeholder="Leave empty for unlimited" 
                    value={maxParticipants || ""}
                    onChange={(e) => setMaxParticipants(e.target.value ? Number(e.target.value) : undefined)}
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Stages */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Challenge Stages</CardTitle>
                  <CardDescription>Define the stages participants will complete</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addStage}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stage
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.map((stage, index) => (
                <Card key={stage.id} className="bg-muted/20 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Stage {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`stage-name-${stage.id}`}>Stage Name *</Label>
                      <Input 
                        id={`stage-name-${stage.id}`} 
                        placeholder="Enter stage name" 
                        value={stage.title}
                        onChange={(e) => {
                          const updatedStages = stages.map(s => 
                            s.id === stage.id ? { ...s, title: e.target.value } : s
                          );
                          setStages(updatedStages);
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`stage-desc-${stage.id}`}>Description *</Label>
                      <Textarea 
                        id={`stage-desc-${stage.id}`} 
                        placeholder="Describe this stage" 
                        rows={2}
                        value={stage.description}
                        onChange={(e) => {
                          const updatedStages = stages.map(s => 
                            s.id === stage.id ? { ...s, description: e.target.value } : s
                          );
                          setStages(updatedStages);
                        }}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`stage-gps-${stage.id}`}>GPS Coordinates *</Label>
                        <div className="flex gap-2">
                          <Input 
                            id={`stage-gps-${stage.id}`} 
                            placeholder="Latitude, Longitude (e.g., 40.7128, -74.0060)" 
                            value={stage.gps}
                            onChange={(e) => {
                              const updatedStages = stages.map(s => 
                                s.id === stage.id ? { ...s, gps: e.target.value } : s
                              );
                              setStages(updatedStages);
                            }}
                            required
                          />
                          <Button type="button" variant="outline" size="icon" title="Get current location">
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`stage-radius-${stage.id}`}>Radius (meters)</Label>
                        <Input 
                          id={`stage-radius-${stage.id}`} 
                          type="number" 
                          placeholder="50" 
                          value={stage.radius || 50}
                          onChange={(e) => {
                            const updatedStages = stages.map(s => 
                              s.id === stage.id ? { ...s, radius: Number(e.target.value) || 50 } : s
                            );
                            setStages(updatedStages);
                          }}
                          min="1"
                          max="1000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`stage-qr-${stage.id}`}>QR Code (optional)</Label>
                      <Input 
                        id={`stage-qr-${stage.id}`} 
                        placeholder="QR code identifier (optional)" 
                        value={stage.qrCode || ""}
                        onChange={(e) => {
                          const updatedStages = stages.map(s => 
                            s.id === stage.id ? { ...s, qrCode: e.target.value || undefined } : s
                          );
                          setStages(updatedStages);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              <Save className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallenge;
