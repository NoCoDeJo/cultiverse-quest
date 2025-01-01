import { motion } from "framer-motion";
import { Globe, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ghost } from "lucide-react";
import { Cult } from "@/types/cult";
import CultGrid from "./CultGrid";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: "discover" | "my-cults") => void;
  filteredCults: Cult[] | undefined;
  onJoinCult: (cultId: string) => void;
}

export const DashboardTabs = ({ 
  activeTab, 
  setActiveTab, 
  filteredCults,
  onJoinCult 
}: DashboardTabsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "discover" | "my-cults")}>
        <TabsList className="bg-cultDark/50 border-cultGlow">
          <TabsTrigger 
            value="discover" 
            className="text-cultWhite data-[state=active]:bg-cultPurple/30 data-[state=active]:glow-border transition-all duration-300"
          >
            <Globe className="w-4 h-4 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger 
            value="my-cults" 
            className="text-cultWhite data-[state=active]:bg-cultPurple/30 data-[state=active]:glow-border transition-all duration-300"
          >
            <Users className="w-4 h-4 mr-2" />
            My Cults
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {!filteredCults || filteredCults.length === 0 ? (
            <Alert className="bg-cultDark/50 border-cultGlow animate-fade-in">
              <AlertDescription className="text-cultWhite flex items-center gap-2">
                <Ghost className="h-4 w-4 animate-float" />
                {activeTab === 'my-cults' 
                  ? "You haven't created any cults yet. Begin your mystical journey by creating your first cult."
                  : "No cults match your search criteria in this realm."}
              </AlertDescription>
            </Alert>
          ) : (
            <CultGrid cults={filteredCults} onJoinCult={onJoinCult} />
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};