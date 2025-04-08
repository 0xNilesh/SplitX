import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export const ExpenseModal = ({
  isOpen,
  onClose,
  groupId,
  groups,
}: ExpenseModalProps) => {
  const { toast } = useToast();
  const { user, addExpenseTx } = useApp();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  // const [description, setDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(groupId || "");
  const [splitType, setSplitType] = useState("equal");
  const [participants, setParticipants] = useState<
    { id: string; name: string; walletAddress: string }[]
  >([]);
  const [paidByAddress, setPaidByAddress] = useState(user?.walletAddress || "");

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  useEffect(() => {
    if (selectedGroup) {
      const enrichedParticipants = selectedGroup.participants.map((p) => ({
        id: p.walletAddress,
        name: p.name,
        walletAddress: p.walletAddress,
      }));
      setParticipants(enrichedParticipants);

      // Default paidBy to current user if in group
      const currentUserInGroup = enrichedParticipants.find(
        (p) => p.walletAddress === user?.walletAddress
      );
      if (currentUserInGroup) {
        setPaidByAddress(currentUserInGroup.walletAddress);
      } else if (enrichedParticipants.length > 0) {
        setPaidByAddress(enrichedParticipants[0].walletAddress);
      }
    }
  }, [selectedGroupId, selectedGroup, user]);

  const handleRemoveParticipant = (id: string) => {
    if (id === paidByAddress) return;
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (!participants.length) {
      toast({
        title: "Error",
        description: "At least one participant is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await addExpenseTx(
        Number(selectedGroupId),
        paidByAddress,
        Number(amount),
        participants.map((p) => p.walletAddress),
        title
      );

      toast({
        title: "Success",
        description: `Expense "${title}" added successfully`,
      });

      setTitle("");
      setAmount("");
      setSplitType("equal");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Try again.",
        variant: "destructive",
      });
      console.error(error);
    }
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
            <Label>Paid By</Label>
            <Select value={paidByAddress} onValueChange={setPaidByAddress}>
              <SelectTrigger>
                <SelectValue placeholder="Select payer" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((p) => (
                  <SelectItem key={p.walletAddress} value={p.walletAddress}>
                    {p.name}
                    {p.walletAddress === user?.walletAddress ? " (You)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Split Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={splitType === "equal" ? "default" : "outline"}
                className={
                  splitType === "equal"
                    ? "bg-splitx-blue hover:bg-blue-700"
                    : ""
                }
                onClick={() => setSplitType("equal")}
              >
                <Check className="mr-1 h-4 w-4" />
                Split Equally
              </Button>
              <Button type="button" variant="outline" disabled>
                Custom Split
              </Button>
            </div>
          </div>

          {selectedGroup && (
            <div className="space-y-2">
              <Label>Participants</Label>
              <div className="flex flex-wrap gap-2">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center rounded-full border px-3 py-1 text-sm bg-muted"
                  >
                    <span>{p.name}</span>
                    {p.walletAddress !== paidByAddress && (
                      <button
                        onClick={() => handleRemoveParticipant(p.walletAddress)}
                        className="ml-2 text-gray-500 hover:text-red-600"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                Each pays: $
                {amount && participants.length
                  ? (Number(amount) / participants.length).toFixed(2)
                  : "0.00"}
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
            <Button type="submit" className="bg-splitx-blue hover:bg-blue-700">
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
