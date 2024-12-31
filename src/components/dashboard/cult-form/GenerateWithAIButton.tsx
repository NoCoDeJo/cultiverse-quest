import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";

interface GenerateWithAIButtonProps {
  onClick: () => Promise<void>;
}

const GenerateWithAIButton = ({ onClick }: GenerateWithAIButtonProps) => {
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { generateFromTwitter } = useAIAssistant();

  const handleTwitterGenerate = async () => {
    if (!twitterHandle) return;
    
    const cultInfo = await generateFromTwitter(twitterHandle);
    if (cultInfo) {
      // Update form values through the parent component
      onClick();
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
        >
          <Wand2 className="h-4 w-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-cultDark border-cultGlow">
        <DialogHeader>
          <DialogTitle className="text-cultWhite">Generate Cult Info</DialogTitle>
          <DialogDescription className="text-cultWhite/60">
            Choose how to generate your cult information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            onClick={() => {
              onClick();
              setIsOpen(false);
            }}
            className="w-full bg-cultGlow hover:bg-cultGlow/80"
          >
            Generate Random Cult
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-cultWhite/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cultDark px-2 text-cultWhite/60">Or</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-cultWhite">Twitter Handle</label>
            <div className="flex gap-2">
              <Input
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="elonmusk"
                className="bg-cultDark/30 border-cultGlow text-cultWhite"
              />
              <Button
                onClick={handleTwitterGenerate}
                className="bg-cultGlow hover:bg-cultGlow/80"
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateWithAIButton;