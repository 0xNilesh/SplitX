
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([
    { address: "0x123...456" }, // Example prefilled wallet address
  ]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { address: "" }]);
  };

  const handleRemoveParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index].address = value;
    setParticipants(newParticipants);
  };

  const handleCreateGroup = () => {
    // Validation
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (participants.some(p => !p.address.trim())) {
      toast.error("Please fill all participant addresses");
      return;
    }

    // Here you would call the blockchain contract
    console.log("Creating group:", { groupName, participants });
    
    // Show success message
    toast.success(`Group "${groupName}" created successfully!`);
    
    // Navigate to groups page
    navigate("/groups");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New Group</h1>
          <p className="text-muted-foreground mb-8">Set up a new expense sharing group with your friends.</p>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input 
                  id="groupName" 
                  placeholder="e.g., Trip to Miami" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Participants</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddParticipant}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input 
                        placeholder="Wallet Address (0x...)" 
                        value={participant.address}
                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                        className="flex-grow"
                        disabled={index === 0} // First participant is the creator
                      />
                      {index !== 0 && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleRemoveParticipant(index)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {participants.length === 1 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Add the wallet addresses of people you want to split expenses with.
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleCreateGroup} 
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateGroup;
