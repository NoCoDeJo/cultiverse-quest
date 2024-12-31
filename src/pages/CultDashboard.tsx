import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Cult } from "@/types/cult";
import { ArrowLeft, Twitter, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/sections/QuickActions";
import { ActivityFeed } from "@/components/dashboard/sections/ActivityFeed";
import { CultStats } from "@/components/dashboard/sections/CultStats";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple p-4">
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
              <CardContent>
                <QuickActions cultId={cult.id} cultName={cult.name} />
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
                <ActivityFeed cultId={cult.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats and Info */}
          <div className="space-y-6">
            {/* Cult Stats */}
            <CultStats cult={cult} />

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