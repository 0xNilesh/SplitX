import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupModal = ({ isOpen, onClose }: GroupModalProps) => {
  const { toast } = useToast();
  const { user, createGroup } = useApp();
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (user?.walletAddress) {
      setParticipants([user.walletAddress]);
    }
  }, [user]);

  const handleAddParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const handleRemoveParticipant = (index: number) => {
    // Prevent removing the first participant (current user)
    if (index > 0) {
      const updated = [...participants];
      updated.splice(index, 1);
      setParticipants(updated);
    }
  };

  const handleParticipantChange = (index: number, value: string) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    const nonUserParticipants = participants
      .slice(1)
      .filter((addr) => addr.trim() !== "");
    console.log(nonUserParticipants);
    if (nonUserParticipants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one more participant",
        variant: "destructive",
      });
      return;
    }

    await createGroup(groupName, participants);

    toast({
      title: "Success",
      description: `Group "${groupName}" created successfully`,
    });

    setGroupName("");
    setParticipants([user?.walletAddress || ""]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Participants</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddParticipant}
              >
                Add Participant
              </Button>
            </div>

            {participants.map((walletAddress, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr,auto] gap-2 items-center"
              >
                {index === 0 ? (
                  <div className="text-sm px-3 py-2 border rounded bg-muted text-muted-foreground">
                    {walletAddress.slice(0, 9)}...{walletAddress.slice(-4)}{" "}
                    (you)
                  </div>
                ) : (
                  <>
                    <Input
                      placeholder="Wallet Address"
                      value={walletAddress}
                      onChange={(e) =>
                        handleParticipantChange(index, e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveParticipant(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-splitx-blue hover:bg-blue-700">
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
