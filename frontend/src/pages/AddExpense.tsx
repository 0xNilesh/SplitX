
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Receipt, ArrowLeft } from "lucide-react";

// Mock data - in a real app this would come from your API/blockchain
const mockParticipants = [
  { address: "0x123...456", name: "You" },
  { address: "0x789...012", name: "Alice" },
  { address: "0x345...678", name: "Bob" },
  { address: "0x901...234", name: "Charlie" }
];

const AddExpense = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState(mockParticipants[0].address);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [splitType, setSplitType] = useState("equal"); // equal or custom
  const [participants, setParticipants] = useState(
    mockParticipants.map(p => ({ ...p, included: true, share: 0 }))
  );

  // Calculate equal shares when amount or included participants change
  const calculateEqualShares = () => {
    const includedCount = participants.filter(p => p.included).length;
    if (includedCount === 0 || !amount) return;
    
    const share = parseFloat(amount) / includedCount;
    
    setParticipants(participants.map(p => ({
      ...p,
      share: p.included ? share : 0
    })));
  };

  const handleIncludedChange = (address: string, checked: boolean) => {
    setParticipants(
      participants.map(p => 
        p.address === address ? { ...p, included: checked } : p
      )
    );
    
    if (splitType === "equal") {
      setTimeout(calculateEqualShares, 0);
    }
  };

  const handleShareChange = (address: string, value: string) => {
    setParticipants(
      participants.map(p => 
        p.address === address ? { ...p, share: parseFloat(value) || 0 } : p
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    
    const includedParticipants = participants.filter(p => p.included);
    if (includedParticipants.length === 0) {
      toast.error("Please include at least one participant");
      return;
    }
    
    if (splitType === "custom") {
      const totalShares = includedParticipants.reduce((sum, p) => sum + p.share, 0);
      const totalAmount = parseFloat(amount);
      
      if (Math.abs(totalShares - totalAmount) > 0.01) {
        toast.error("The sum of shares must equal the total amount");
        return;
      }
    }
    
    // Submit the expense
    console.log("Submitting expense:", {
      groupId,
      amount: parseFloat(amount),
      description,
      paidBy,
      date,
      splitType,
      participants: participants.filter(p => p.included)
    });
    
    toast.success("Expense added successfully");
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(`/groups/${groupId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Group
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Add New Expense</h1>
          <p className="text-muted-foreground mb-8">Add an expense to split with your group</p>
          
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (splitType === "equal") {
                        setTimeout(calculateEqualShares, 0);
                      }
                    }}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="paidBy">Paid By</Label>
                  <Select 
                    value={paidBy} 
                    onValueChange={setPaidBy}
                  >
                    <SelectTrigger id="paidBy" className="mt-1">
                      <SelectValue placeholder="Select who paid" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockParticipants.map(participant => (
                        <SelectItem 
                          key={participant.address} 
                          value={participant.address}
                        >
                          {participant.name} ({participant.address.substring(0, 6)}...)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Split Type</Label>
                <div className="flex mt-1 space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="equal"
                      name="splitType"
                      value="equal"
                      checked={splitType === "equal"}
                      onChange={() => {
                        setSplitType("equal");
                        setTimeout(calculateEqualShares, 0);
                      }}
                      className="mr-2"
                    />
                    <Label htmlFor="equal" className="cursor-pointer">Equal</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="custom"
                      name="splitType"
                      value="custom"
                      checked={splitType === "custom"}
                      onChange={() => setSplitType("custom")}
                      className="mr-2"
                    />
                    <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Participants</Label>
                <div className="space-y-3">
                  {participants.map(participant => (
                    <div key={participant.address} className="flex items-center">
                      <div className="flex items-center flex-1">
                        <Checkbox
                          id={`participant-${participant.address}`}
                          checked={participant.included}
                          onCheckedChange={(checked) => 
                            handleIncludedChange(participant.address, checked as boolean)
                          }
                          className="mr-2"
                        />
                        <Label 
                          htmlFor={`participant-${participant.address}`}
                          className="cursor-pointer"
                        >
                          {participant.name} ({participant.address.substring(0, 6)}...)
                        </Label>
                      </div>
                      
                      {participant.included && splitType === "custom" && (
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={participant.share || ""}
                          onChange={(e) => handleShareChange(participant.address, e.target.value)}
                          className="w-24 ml-auto"
                        />
                      )}
                      
                      {participant.included && splitType === "equal" && (
                        <div className="w-24 ml-auto text-right">
                          ${participant.share.toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Receipt className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddExpense;
