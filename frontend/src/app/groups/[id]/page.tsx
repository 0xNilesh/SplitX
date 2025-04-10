"use client";

import { useState, useEffect } from "react";
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
  Clock,
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
import AbstractionPage from "../../abstraxionPage";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { ExpenseModal } from "@/components/modals/ExpenseModal";
import { useApp } from "@/context/AppContext";
import { Expense, Group } from "@/types";

export default function GroupPage({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const { user, groups, payExpense } = useApp();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  // const [userAddress, setUserAddress] = useState("0x123...456"); // Simulating the connected wallet
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    if (!user?.walletAddress) return;
    const foundGroup = groups.find((g: Group) => g.id === groupId);
    setGroup(foundGroup || null);
    setLoading(false);
  }, [groupId, groups, user?.walletAddress]);

  if (loading) {
    return (
      <AbstractionPage>
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-xl">
              Loading group details...
            </div>
          </div>
        </main>
      </AbstractionPage>
    );
  }

  if (!group) {
    return (
      <AbstractionPage>
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The group you&#39;re looking for doesn&#39;t exist or you
              don&#39;t have access.
            </p>
            <Link href="/groups">
              <Button variant="outline">Return to Groups</Button>
            </Link>
          </div>
        </main>
      </AbstractionPage>
    );
  }

  const getInitials = (address: string) => {
    // For real app, you might want to use ENS names or nicknames
    if (address.includes("You")) return "YO";
    return address.substring(2, 4).toUpperCase();
  };

  const getUserSplitStatusForExpense = (expense: Expense) => {
    const userSplit = expense.participants.find(
      (participant) => participant.member.walletAddress === user?.walletAddress
    );
    if (expense.paidBy.walletAddress === user?.walletAddress) {
      return {
        status: "paid",
        message: "You paid this expense",
      };
    }
    if (userSplit) {
      return {
        status: userSplit.settled ? "paid" : "unpaid",
        amount: userSplit.amount,
        message: userSplit.settled
          ? "Your share is paid"
          : "You owe this amount",
      };
    }
    return {
      status: "not-involved",
      message: "You're not involved in this expense",
    };
  };

  return (
    <AbstractionPage>
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <p className="text-muted-foreground">
                {group.participants.length} members
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowExpenseModal(true)}
                className="bg-splitx-blue hover:bg-blue-700 shadow-md mt-4 md:mt-0"
              >
                <Plus className="mr-2 h-4 w-4" /> New Expense
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="outline"
                        disabled
                        className="gap-2 cursor-not-allowed"
                      >
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
                Members
              </h2>
              <div className="space-y-3">
                {group.participants?.map((participant) => (
                  <div
                    key={participant.walletAddress}
                    className="flex items-center gap-3"
                  >
                    <img
                      key={participant.walletAddress}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant?.name}`}
                      alt={participant?.name}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                    />
                    <div>
                      <p className="font-medium">
                        {participant.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.name}
                      </p>
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
                {/* <Link href={`/groups/${groupId}/add-expense`}>
                  <Button className="gap-2 bg-splitx-blue hover:bg-blue-700 shadow-lg ">
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </Button>
                </Link> */}
              </div>

              {group.expenses.length > 0 ? (
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid By</TableHead>
                        {/* <TableHead>Date</TableHead> */}
                        <TableHead>Your Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.expenses.map((expense) => {
                        const paidByUser = group.participants.find(
                          (p) =>
                            p.walletAddress === expense.paidBy.walletAddress
                        );
                        const userSplitStatus =
                          getUserSplitStatusForExpense(expense);

                        return (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">
                              {expense.description}
                            </TableCell>
                            <TableCell>${expense.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <img
                                  key={expense.paidBy.walletAddress}
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${expense.paidBy?.name}`}
                                  alt={expense.paidBy?.name}
                                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                />
                                {/* <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {getInitials(
                                      paidByUser?.name || expense.paidBy.walletAddress
                                    )}
                                  </AvatarFallback>
                                </Avatar> */}
                                <span>
                                  {paidByUser?.name ||
                                    expense.paidBy.walletAddress.substring(
                                      0,
                                      6
                                    ) + "..."}
                                </span>
                              </div>
                            </TableCell>
                            {/* <TableCell>{expense.date}</TableCell> */}
                            <TableCell>
                              {userSplitStatus.status === "paid" && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-500 border-green-500/20"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Paid
                                </Badge>
                              )}
                              {userSplitStatus.status === "unpaid" && (
                                <Badge
                                  variant="outline"
                                  className="bg-orange-500/10 text-orange-500 border-orange-500/20"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Unpaid
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {userSplitStatus.status === "unpaid" && userSplitStatus.amount && (
                                <Button
                                  size="sm"
                                  className="h-8 bg-splitx-blue hover:bg-blue-700 shadow-lg "
                                  onClick={() =>
                                    payExpense(
                                      Number(groupId),
                                      Number(expense.id),
                                      userSplitStatus.amount
                                    )
                                  }
                                >
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
                    {group.expenses.map((expense) => {
                      const paidByUser = group.participants.find(
                        (p) => p.walletAddress === expense.paidBy.walletAddress
                      );
                      return (
                        <div key={expense.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {expense.description}
                              </h4>
                              {/* <p className="text-muted-foreground text-sm">
                                Added on {expense.date}
                              </p> */}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                ${expense.amount.toFixed(2)}
                              </p>
                              <p className="text-sm">
                                Paid by{" "}
                                {paidByUser?.name ||
                                  expense.paidBy.walletAddress.substring(0, 6) +
                                    "..."}
                              </p>
                            </div>
                          </div>

                          <h5 className="font-medium text-sm mb-2">
                            Split Details
                          </h5>
                          <div className="space-y-2">
                            {expense.participants.map(
                              (participant, index: number) => {
                                // const participant = group.participants.find(
                                //   (p) => p.address === split.address
                                // );
                                return (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <div className="flex items-center gap-2">
                                      {/* <Avatar className="h-6 w-6">
                                      <AvatarFallback>
                                        {getInitials(
                                          participant.member.walletAddress
                                        )}
                                      </AvatarFallback>
                                    </Avatar> */}
                                      <img
                                        key={participant.member.walletAddress}
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.member?.name}`}
                                        alt={participant.member?.name}
                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      />
                                      <span>
                                        {participant.member.name ||
                                          participant.member.walletAddress.substring(
                                            0,
                                            6
                                          ) + "..."}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span>
                                        ${participant.amount.toFixed(2)}
                                      </span>
                                      {participant.settled ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-500/10 text-green-500 border-green-500/20"
                                        >
                                          Paid
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="bg-orange-500/10 text-orange-500 border-orange-500/20"
                                        >
                                          Unpaid
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
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
                  <p className="text-muted-foreground mb-4">
                    Start adding expenses to this group.
                  </p>
                  {/* <Link href={`/groups/${groupId}/add-expense`}> */}
                    <Button size="sm" onClick={() => setShowExpenseModal(true)}>Add First Expense</Button>
                  {/* </Link> */}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      {/* Expense Modal */}
      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        groups={groups}
        groupId={groupId}
      />
    </AbstractionPage>
  );
}
