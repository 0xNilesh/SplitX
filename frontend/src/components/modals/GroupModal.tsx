
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  const { user, addGroup } = useApp();
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([
    { id: "participant1", name: "", walletAddress: "" },
  ]);

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { id: `participant${participants.length + 2}`, name: "", walletAddress: "" },
    ]);
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const handleParticipantChange = (id: string, field: "name" | "walletAddress", value: string) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    const validParticipants = participants.filter(
      (p) => p.name.trim() !== "" && p.walletAddress.trim() !== ""
    );

    if (validParticipants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one valid participant",
        variant: "destructive",
      });
      return;
    }

    // Create group with current user and valid participants
    const members = [
      // Add current user
      {
        id: user?.id || "user1",
        name: user?.name || "You",
        walletAddress: user?.walletAddress || "0x1234...5678",
        avatar: user?.avatar,
      },
      // Add participants
      ...validParticipants.map((p, index) => ({
        id: `new-user-${index + 1}`,
        name: p.name,
        walletAddress: p.walletAddress,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
      })),
    ];

    addGroup({
      name: groupName,
      members,
      expenses: [],
      totalAmount: 0,
    });

    toast({
      title: "Success",
      description: `Group "${groupName}" created successfully`,
    });

    // Reset form
    setGroupName("");
    setParticipants([{ id: "participant1", name: "", walletAddress: "" }]);
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
              className="col-span-3"
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

            {participants.map((participant) => (
              <div
                key={participant.id}
                className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center"
              >
                <Input
                  placeholder="Name"
                  value={participant.name}
                  onChange={(e) =>
                    handleParticipantChange(participant.id, "name", e.target.value)
                  }
                />
                <Input
                  placeholder="Wallet Address"
                  value={participant.walletAddress}
                  onChange={(e) =>
                    handleParticipantChange(
                      participant.id,
                      "walletAddress",
                      e.target.value
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveParticipant(participant.id)}
                  disabled={participants.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
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
            <Button type="submit" className="bg-splitx-blue hover:bg-blue-700">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
