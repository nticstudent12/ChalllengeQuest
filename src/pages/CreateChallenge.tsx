import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [stages, setStages] = useState([{ id: 1, name: "", description: "", gps: "", verification: "gps" }]);

  const addStage = () => {
    setStages([...stages, { id: stages.length + 1, name: "", description: "", gps: "", verification: "gps" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Challenge Created",
      description: "Your challenge has been successfully created!",
    });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create New Challenge
          </h1>
          <div className="w-24" />
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
                <Input id="name" placeholder="Enter challenge name" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your challenge" rows={3} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban Exploration</SelectItem>
                      <SelectItem value="nature">Nature Trail</SelectItem>
                      <SelectItem value="tech">Tech Hunt</SelectItem>
                      <SelectItem value="cultural">Cultural Quest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select>
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
                  <Input id="startDate" type="datetime-local" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input id="duration" type="number" placeholder="24" defaultValue="24" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input id="coverImage" type="url" placeholder="https://example.com/image.jpg" />
              </div>
            </CardContent>
          </Card>

          {/* Story/Narrative */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Challenge Story</CardTitle>
              <CardDescription>Create an engaging narrative for participants</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Write the story that will guide participants through this challenge..." 
                rows={6}
              />
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
                      <Label htmlFor={`stage-name-${stage.id}`}>Stage Name</Label>
                      <Input id={`stage-name-${stage.id}`} placeholder="Enter stage name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`stage-desc-${stage.id}`}>Description</Label>
                      <Textarea id={`stage-desc-${stage.id}`} placeholder="Describe this stage" rows={2} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`stage-gps-${stage.id}`}>GPS Coordinates</Label>
                        <div className="flex gap-2">
                          <Input id={`stage-gps-${stage.id}`} placeholder="Lat, Long" />
                          <Button type="button" variant="outline" size="icon">
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`stage-verify-${stage.id}`}>Verification Method</Label>
                        <Select defaultValue="gps">
                          <SelectTrigger id={`stage-verify-${stage.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gps">GPS Check</SelectItem>
                            <SelectItem value="qr">QR Code</SelectItem>
                            <SelectItem value="photo">Photo Upload</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`stage-xp-${stage.id}`}>XP Reward</Label>
                        <Input id={`stage-xp-${stage.id}`} type="number" placeholder="100" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`stage-time-${stage.id}`}>Min. Completion Time (min)</Label>
                        <Input id={`stage-time-${stage.id}`} type="number" placeholder="5" />
                      </div>
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
