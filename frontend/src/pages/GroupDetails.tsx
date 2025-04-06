
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  AlertCircle, 
  Users, 
  Receipt,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for the example
const mockGroups = [
  {
    id: "1",
    name: "Trip to Miami",
    creator: "0x123...456",
    participants: [
      { address: "0x123...456", name: "You" },
      { address: "0x789...012", name: "Alice" },
      { address: "0x345...678", name: "Bob" },
      { address: "0x901...234", name: "Charlie" }
    ],
    expenses: [
      { 
        id: "e1", 
        description: "Hotel Booking", 
        amount: 450.00, 
        paidBy: "0x123...456", 
        date: "2023-06-15",
        splits: [
          { address: "0x123...456", amount: 112.50, paid: true },
          { address: "0x789...012", amount: 112.50, paid: false },
          { address: "0x345...678", amount: 112.50, paid: false },
          { address: "0x901...234", amount: 112.50, paid: true }
        ]
      },
      { 
        id: "e2", 
        description: "Dinner at Seafood Place", 
        amount: 180.25, 
        paidBy: "0x789...012", 
        date: "2023-06-16",
        splits: [
          { address: "0x123...456", amount: 45.06, paid: false },
          { address: "0x789...012", amount: 45.06, paid: true },
          { address: "0x345...678", amount: 45.06, paid: true },
          { address: "0x901...234", amount: 45.07, paid: false }
        ]
      },
      { 
        id: "e3", 
        description: "Beach Activities", 
        amount: 120.00, 
        paidBy: "0x345...678", 
        date: "2023-06-17",
        splits: [
          { address: "0x123...456", amount: 30.00, paid: true },
          { address: "0x789...012", amount: 30.00, paid: false },
          { address: "0x345...678", amount: 30.00, paid: true },
          { address: "0x901...234", amount: 30.00, paid: false }
        ]
      }
    ]
  },
  // Add more mock groups if needed
];

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState("0x123...456"); // Simulating the connected wallet

  useEffect(() => {
    // Simulate fetching group data
    setTimeout(() => {
      const foundGroup = mockGroups.find(g => g.id === groupId);
      setGroup(foundGroup);
      setLoading(false);
    }, 500);
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-xl">Loading group details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
            <p className="text-muted-foreground mb-4">The group you're looking for doesn't exist or you don't have access.</p>
            <Link to="/groups">
              <Button variant="outline">Return to Groups</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const getInitials = (address: string) => {
    // For real app, you might want to use ENS names or nicknames
    if (address.includes("You")) return "YO";
    return address.substring(2, 4).toUpperCase();
  };

  const getUserSplitStatusForExpense = (expense: any) => {
    const userSplit = expense.splits.find((split: any) => split.address === userAddress);
    if (expense.paidBy === userAddress) {
      return {
        status: "paid",
        message: "You paid this expense"
      };
    }
    if (userSplit) {
      return {
        status: userSplit.paid ? "paid" : "unpaid",
        amount: userSplit.amount,
        message: userSplit.paid ? "Your share is paid" : "You owe this amount"
      };
    }
    return {
      status: "not-involved",
      message: "You're not involved in this expense"
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <p className="text-muted-foreground">{group.participants.length} participants</p>
            </div>
            <div className="flex gap-3">
              <Link to={`/groups/${groupId}/add-expense`}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button variant="outline" disabled className="gap-2">
                        Settle Debts
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Participants Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
              </h2>
              <div className="space-y-3">
                {group.participants.map((participant: any) => (
                  <div key={participant.address} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(participant.name || participant.address)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{participant.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Expenses List */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Expenses
                </h2>
                <Link to={`/groups/${groupId}/add-expense`}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </Button>
                </Link>
              </div>

              {group.expenses.length > 0 ? (
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Your Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.expenses.map((expense: any) => {
                        const paidByUser = group.participants.find((p: any) => p.address === expense.paidBy);
                        const userSplitStatus = getUserSplitStatusForExpense(expense);
                        
                        return (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell>${expense.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{getInitials(paidByUser?.name || expense.paidBy)}</AvatarFallback>
                                </Avatar>
                                <span>{paidByUser?.name || expense.paidBy.substring(0, 6) + "..."}</span>
                              </div>
                            </TableCell>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>
                              {userSplitStatus.status === "paid" && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Paid
                                </Badge>
                              )}
                              {userSplitStatus.status === "unpaid" && (
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Unpaid
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {userSplitStatus.status === "unpaid" && (
                                <Button size="sm" className="h-8">
                                  Pay ${userSplitStatus.amount?.toFixed(2)}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium">Expense Details</h3>
                    {group.expenses.map((expense: any) => {
                      const paidByUser = group.participants.find((p: any) => p.address === expense.paidBy);
                      return (
                        <div key={expense.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{expense.description}</h4>
                              <p className="text-muted-foreground text-sm">Added on {expense.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
                              <p className="text-sm">
                                Paid by {paidByUser?.name || expense.paidBy.substring(0, 6) + "..."}
                              </p>
                            </div>
                          </div>
                          
                          <h5 className="font-medium text-sm mb-2">Split Details</h5>
                          <div className="space-y-2">
                            {expense.splits.map((split: any, index: number) => {
                              const participant = group.participants.find((p: any) => p.address === split.address);
                              return (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback>{getInitials(participant?.name || split.address)}</AvatarFallback>
                                    </Avatar>
                                    <span>{participant?.name || split.address.substring(0, 6) + "..."}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span>${split.amount.toFixed(2)}</span>
                                    {split.paid ? (
                                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Unpaid</Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Receipt className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
                  <h3 className="text-lg font-medium mb-1">No Expenses Yet</h3>
                  <p className="text-muted-foreground mb-4">Start adding expenses to this group.</p>
                  <Link to={`/groups/${groupId}/add-expense`}>
                    <Button size="sm">Add First Expense</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupDetails;
