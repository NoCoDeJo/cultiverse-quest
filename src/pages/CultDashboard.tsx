import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Cult } from "@/types/cult";
import { LandingPageContent } from "@/types/landing";
import { ArrowLeft, Twitter, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/sections/QuickActions";
import { ActivityFeed } from "@/components/dashboard/sections/ActivityFeed";
import { CultStats } from "@/components/dashboard/sections/CultStats";
import { RitualSection } from "@/components/dashboard/sections/RitualSection";
import { LinksSection } from "@/components/dashboard/sections/LinksSection";
import { ImageManagement } from "@/components/dashboard/sections/ImageManagement";
import { CommunityManagement } from "@/components/dashboard/sections/CommunityManagement";
import { AgentSection } from "@/components/dashboard/sections/agents/AgentSection";

const CultDashboard = () => {
  const { cultId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: cult, isLoading, error } = useQuery({
    queryKey: ['cult', cultId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cults')
        .select('*')
        .eq('id', cultId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load cult details",
          variant: "destructive",
        });
        throw error;
      }

      // Ensure landing_page_content has the correct structure with proper type casting
      const landingContent = (data.landing_page_content as any as LandingPageContent) || { sections: [] };
      return {
        ...data,
        landing_page_content: landingContent
      } as Cult;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Channeling cult energies...
        </div>
      </div>
    );
  }

  if (error || !cult) {
    return (
      <div className="min-h-screen bg-cultDark p-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load cult dashboard</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mt-4 border-cultGlow text-cultWhite hover:bg-cultPurple/50"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Banner */}
        <div className="relative rounded-lg overflow-hidden">
          {cult.banner_url ? (
            <img 
              src={cult.banner_url} 
              alt={`${cult.name} banner`}
              className="w-full h-[200px] object-cover"
            />
          ) : (
            <div className="w-full h-[200px] bg-cultDark/50" />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cultDark/90 to-transparent p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-cultWhite hover:bg-cultPurple/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-cinzel text-cultWhite">
                  {cult.name}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {cult.twitter_handle && (
                  <a
                    href={`https://twitter.com/${cult.twitter_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cultWhite/60 hover:text-cultWhite transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                <Button variant="outline" className="border-cultGlow text-cultWhite">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Management Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Management */}
            <Card className="bg-cultDark/50 border-cultGlow">
              <CardHeader>
                <CardTitle className="text-cultWhite">Cult Images</CardTitle>
                <CardDescription className="text-cultWhite/60">
                  Manage your cult's profile and banner images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageManagement cult={cult} />
              </CardContent>
            </Card>

            {/* Community Management */}
            <CommunityManagement cultId={cult.id} />

            {/* AI Agents Section */}
            <AgentSection cultId={cult.id} />

            {/* Quick Actions */}
            <Card className="bg-cultDark/50 border-cultGlow">
              <CardHeader>
                <CardTitle className="text-cultWhite">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions cultId={cult.id} cultName={cult.name} />
              </CardContent>
            </Card>

            {/* Ritual Section */}
            <RitualSection />

            {/* Activity Feed */}
            <Card className="bg-cultDark/50 border-cultGlow">
              <CardHeader>
                <CardTitle className="text-cultWhite">Recent Activity</CardTitle>
                <CardDescription className="text-cultWhite/60">
                  Latest events in your cult
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed cultId={cult.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats and Info */}
          <div className="space-y-6">
            {/* Cult Stats */}
            <CultStats cult={cult} />

            {/* Links Section */}
            <LinksSection />

            {/* Description */}
            <Card className="bg-cultDark/50 border-cultGlow">
              <CardHeader>
                <CardTitle className="text-cultWhite">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cultWhite/80">
                  {cult.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultDashboard;