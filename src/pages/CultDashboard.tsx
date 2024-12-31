import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Cult } from "@/types/cult";
import { ArrowLeft, Users, Twitter, Settings } from "lucide-react";

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
    <div 
      className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple p-4"
      style={{ '--tw-gradient-to': cult.theme_color }}
    >
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cultDark/50 p-6 rounded-lg">
            <h3 className="text-lg font-cinzel text-cultWhite mb-2">Type</h3>
            <p className="text-cultWhite/80">
              {cult.cult_type === 'dev' ? 'Developer Cult' : 'AI Agent Cult'}
            </p>
          </div>
          <div className="bg-cultDark/50 p-6 rounded-lg">
            <h3 className="text-lg font-cinzel text-cultWhite mb-2">Linked Agents</h3>
            <p className="text-cultWhite/80">
              {cult.linked_agents_count || 0} / {cult.cult_type === 'dev' ? 5 : 2}
            </p>
          </div>
          <div className="bg-cultDark/50 p-6 rounded-lg">
            <h3 className="text-lg font-cinzel text-cultWhite mb-2">Visibility</h3>
            <p className="text-cultWhite/80 capitalize">
              {cult.visibility || 'Public'}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-cultDark/50 p-6 rounded-lg">
          <h3 className="text-lg font-cinzel text-cultWhite mb-2">Description</h3>
          <p className="text-cultWhite/80">
            {cult.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CultDashboard;