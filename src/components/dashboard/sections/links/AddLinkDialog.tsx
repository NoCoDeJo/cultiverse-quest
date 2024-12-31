import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Link } from "./types";

interface AddLinkDialogProps {
  onAddLink: (link: Link) => void;
}

export const AddLinkDialog = ({ onAddLink }: AddLinkDialogProps) => {
  const [newLink, setNewLink] = useState<Link>({ title: "", url: "" });

  const handleAddLink = () => {
    onAddLink(newLink);
    setNewLink({ title: "", url: "" });
  };

  return (
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
  );
};