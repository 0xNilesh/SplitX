
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";
import { Textarea } from "@/components/ui/textarea";
import { Group } from "@/types";
import { Check, X } from "lucide-react";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string;
  groups: Group[];
}

export const ExpenseModal = ({ isOpen, onClose, groupId, groups }: ExpenseModalProps) => {
  const { toast } = useToast();
  const { user, addExpense } = useApp();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(groupId || "");
  const [splitType, setSplitType] = useState("equal");
  
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an expense title",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGroupId) {
      toast({
        title: "Error",
        description: "Please select a group",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = Number(amount);
    const paidBy = user || {
      id: "user1",
      name: "You",
      walletAddress: "0x1234...5678",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    };

    const selectedGroup = groups.find((g) => g.id === selectedGroupId);
    if (!selectedGroup) return;

    const memberCount = selectedGroup.members.length;
    const equalShare = numericAmount / memberCount;

    // Create participants with equal split
    const participants = selectedGroup.members.map((member) => ({
      member,
      amount: equalShare,
      settled: member.id === paidBy.id // The payer has already settled
    }));

    const expense = {
      title,
      amount: numericAmount,
      date: new Date(),
      paidBy,
      participants,
      description
    };

    addExpense(selectedGroupId, expense);

    toast({
      title: "Success",
      description: `Expense "${title}" added successfully`,
    });

    // Reset form
    setTitle("");
    setAmount("");
    setDescription("");
    setSplitType("equal");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {!groupId && (
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select 
                value={selectedGroupId} 
                onValueChange={setSelectedGroupId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Dinner, Rent, Groceries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Split Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={splitType === "equal" ? "default" : "outline"}
                className={splitType === "equal" ? "bg-splitx-blue hover:bg-blue-700" : ""}
                onClick={() => setSplitType("equal")}
              >
                <Check className="mr-1 h-4 w-4" />
                Split Equally
              </Button>
              <Button
                type="button"
                variant={splitType === "custom" ? "default" : "outline"}
                className={splitType === "custom" ? "bg-splitx-blue hover:bg-blue-700" : ""}
                onClick={() => setSplitType("custom")}
                disabled // Disable for now as we're only implementing equal split
              >
                Custom Split
              </Button>
            </div>
          </div>

          {selectedGroup && splitType === "equal" && (
            <div className="rounded-md border p-4">
              <Label className="mb-2 block">Each person pays:</Label>
              <div className="text-lg font-bold">
                ${amount ? (Number(amount) / selectedGroup.members.length).toFixed(2) : "0.00"}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Split equally among {selectedGroup.members.length} members
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-splitx-blue hover:bg-blue-700">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
