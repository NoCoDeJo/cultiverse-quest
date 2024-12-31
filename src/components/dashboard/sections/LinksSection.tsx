import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link2, Plus, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAIAssistant } from "@/hooks/useAIAssistant";

interface Link {
  title: string;
  url: string;
}

export const LinksSection = () => {
  const [links, setLinks] = useState<Link[]>([
    { title: "ElizaOS Website", url: "https://elizaos.com" },
    { title: "Developer Documentation", url: "https://docs.elizaos.com" },
    { title: "Community Forum", url: "https://community.elizaos.com" },
  ]);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const { toast } = useToast();
  const { generateLandingContent } = useAIAssistant();

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Please fill in both title and URL",
        variant: "destructive",
      });
      return;
    }

    setLinks([...links, newLink]);
    setNewLink({ title: "", url: "" });
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-cultDark border-cultGlow">
                <DialogHeader>
                  <DialogTitle className="text-cultWhite">Add New Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Link Title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="bg-cultDark/30 border-cultGlow text-cultWhite"
                  />
                  <Input
                    placeholder="URL"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="bg-cultDark/30 border-cultGlow text-cultWhite"
                  />
                  <Button
                    onClick={handleAddLink}
                    className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                  >
                    Add Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded border border-cultGlow/20 hover:border-cultGlow hover:bg-cultPurple/20 transition-all text-cultWhite"
          >
            {link.title}
          </a>
        ))}
      </CardContent>
    </Card>
  );
};