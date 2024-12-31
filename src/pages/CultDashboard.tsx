import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Cult } from "@/types/cult";
import { 
  ArrowLeft, 
  Users, 
  Twitter, 
  Settings, 
  Globe, 
  Lock,
  UserPlus,
  MessageSquare,
  Activity,
  Share2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

      return data as Cult;
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

  // Dynamic gradient based on cult's theme color
  const gradientStyle = `from-cultDark to-[${cult.theme_color}]`;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientStyle} p-4`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-cultDark/50 rounded-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-cultWhite hover:bg-cultPurple/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Management Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-cultDark/50 border-cultGlow">
              <CardHeader>
                <CardTitle className="text-cultWhite">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                >
                  <UserPlus className="h-6 w-6" />
                  <span>Invite Members</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Announcements</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                >
                  <Share2 className="h-6 w-6" />
                  <span>Share Cult</span>
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="bg-cultDark/50 border-cultGlow">
              <CardHeader>
                <CardTitle className="text-cultWhite">Recent Activity</CardTitle>
                <CardDescription className="text-cultWhite/60">
                  Latest events in your cult
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] rounded-md border border-cultGlow/20 p-4">
                  <div className="space-y-4">
                    {/* Placeholder activities - will be replaced with real data */}
                    <div className="flex items-center gap-4 text-cultWhite/80">
                      <Activity className="h-4 w-4" />
                      <span>New member joined the cult</span>
                      <span className="text-sm text-cultWhite/60">2m ago</span>
                    </div>
                    {/* Add more activity items here */}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats and Info */}
          <div className="space-y-6">
            {/* Cult Stats */}
            <Card className="bg-cultDark/50 border-cultGlow">
              <CardHeader>
                <CardTitle className="text-cultWhite">Cult Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-cultWhite/80">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Members
                  </span>
                  <span>{cult.linked_agents_count || 0}</span>
                </div>
                <div className="flex justify-between items-center text-cultWhite/80">
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Visibility
                  </span>
                  <span className="flex items-center gap-1">
                    {cult.visibility === 'public' ? (
                      <>
                        <Globe className="h-4 w-4" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Private
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-cultWhite/80">
                  <span>Type</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    cult.cult_type === 'dev' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {cult.cult_type === 'dev' ? 'Developer' : 'AI Agent'}
                  </span>
                </div>
              </CardContent>
            </Card>

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