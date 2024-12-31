import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link2, Wand2 } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { LinksList } from "./links/LinksList";
import { AddLinkDialog } from "./links/AddLinkDialog";
import { Link } from "./links/types";

export const LinksSection = () => {
  const [links, setLinks] = useState<Link[]>([
    { title: "ElizaOS Website", url: "https://elizaos.com" },
    { title: "Developer Documentation", url: "https://docs.elizaos.com" },
    { title: "Community Forum", url: "https://community.elizaos.com" },
  ]);
  
  const { toast } = useToast();
  const { generateLandingContent } = useAIAssistant();

  const handleAddLink = (newLink: Link) => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Please fill in both title and URL",
        variant: "destructive",
      });
      return;
    }

    setLinks([...links, newLink]);
    toast({
      title: "Link Added",
      description: "Your link has been added successfully",
    });
  };

  const handleGenerateLinks = async () => {
    const generatedLinks = await generateLandingContent("Your Cult", "dev");
    if (generatedLinks) {
      setLinks(generatedLinks);
      toast({
        title: "Success",
        description: "Generated new links with AI",
      });
    }
  };

  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Important Links
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateLinks}
              className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Links
            </Button>
            <AddLinkDialog onAddLink={handleAddLink} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LinksList links={links} />
      </CardContent>
    </Card>
  );
};