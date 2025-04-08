import React, { createContext, useContext, useState, useEffect } from "react";
import { Group, User } from "@/types";
import { currentUser, mockGroups } from "@/data/mockData";
import {
  useAbstraxionAccount,
  useAbstraxionClient,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { Expense } from "@/types";
import { splitXContractAddress } from "@/constants";
import { formatExpense, shortenWallet } from "@/lib/utils";

interface AppContextType {
  user: User | null;
  groups: Group[];
  addGroup: (group: Omit<Group, "id">) => void;
  addExpense: (groupId: string, expense: any) => void;
  getGroupById: (id: string) => Group | undefined;

  // Queries
  fetchGroup: (groupId: number) => Promise<Group | null>;
  fetchAllGroups: () => Promise<void>;
  fetchExpense: (groupId: number, expenseId: number) => Promise<Expense | null>;
  fetchGroupExpenses: (groupId: number) => Promise<Expense[]>;
  fetchUserGroups: () => Promise<void>;

  // Transactions
  createGroup: (name: string, participants: string[]) => Promise<void>;
  addExpenseTx: (
    groupId: number,
    paidBy: string,
    amount: number,
    participants: string[],
    description: string
  ) => Promise<void>;
  payExpense: (groupId: number, expenseId: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  const { data: account } = useAbstraxionAccount();
  const { client, signArb, logout } = useAbstraxionSigningClient();
  const { client: queryClient } = useAbstraxionClient();

  useEffect(() => {
    console.log("Running useEffect");
    if (account?.bech32Address) {
      fetchUserGroups();
    }
  }, [account?.bech32Address]);

  const addGroup = (group: Omit<Group, "id">) => {
    const newGroup: Group = {
      ...group,
      id: `group${groups.length + 1}`,
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const addExpense = (groupId: string, expense: any) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const newExpense = {
            ...expense,
            id: `exp${group.expenses.length + 1}`,
            date: new Date(),
          };
          return {
            ...group,
            expenses: [...group.expenses, newExpense],
            totalAmount: group.totalAmount + expense.amount,
          };
        }
        return group;
      })
    );
  };

  const getGroupById = (id: string) => {
    return groups.find((group) => group.id === id);
  };

  // ========== QUERY FUNCTIONS ==========

  const fetchGroup = async (groupId: number): Promise<Group | null> => {
    if (!queryClient) return null;
    try {
      const res: Group = await queryClient.queryContractSmart(
        splitXContractAddress,
        {
          get_group: { group_id: groupId },
        }
      );
      // console.log("Fetched group:", res, groupId);
      return res;
    } catch (err) {
      console.error("fetchGroup error:", err);
      return null;
    }
  };

  const fetchAllGroups = async () => {
    if (!queryClient) return;
    try {
      const res = await queryClient.queryContractSmart(splitXContractAddress, {
        get_all_groups: {},
      });
      // console.log("All groups:", res.groups);
    } catch (err) {
      console.error("fetchAllGroups error:", err);
    }
  };

  const fetchExpense = async (
    groupId: number,
    expenseId: number
  ): Promise<Expense | null> => {
    if (!queryClient) return null;
    try {
      const res: Expense = await queryClient.queryContractSmart(
        splitXContractAddress,
        {
          get_expense: { group_id: groupId, expense_id: expenseId },
        }
      );
      return res;
    } catch (err) {
      console.error("fetchExpense error:", err);
      return null;
    }
  };

  // import { formatExpense } from "@/utils/formatters"; // or wherever it's defined

  const fetchGroupExpenses = async (groupId: number): Promise<Expense[]> => {
    if (!queryClient) return [];
    try {
      const res = await queryClient.queryContractSmart(splitXContractAddress, {
        get_group_expenses: { group_id: groupId },
      });

      // console.log(res.expenses);

      return res.expenses.map(formatExpense);
    } catch (err) {
      console.error("fetchGroupExpenses error:", err);
      return [];
    }
  };

  const fetchUserGroups = async () => {
    if (!queryClient || !account) return;
  
    try {
      const res = await queryClient.queryContractSmart(splitXContractAddress, {
        get_user_groups: { user: account.bech32Address },
      });
  
      // Update participants + creator here itself
      const enrichedGroups = res.groups.map(
        ([id, group]: [
          number,
          any
        ]) => {
          return [
            id,
            {
              ...group,
              participants: group.participants.map((wallet: string) => ({
                walletAddress: wallet,
                name: shortenWallet(wallet), // or shortenWallet(wallet)
              })),
              creator: group.creator,
            },
          ];
        }
      );
  
      let totalOwe = 0;
      let totalOwed = 0;
  
      const formattedGroups: Group[] = await Promise.all(
        enrichedGroups.map(
          async ([id, group]: [
            number,
            Omit<Group, "id" | "expenses" | "owedCurrentUser" | "oweCurrentUser">
          ]) => {
            const expenses = await fetchGroupExpenses(id);
            console.log("Fetched expenses for group:", id, expenses);
  
            let owedCurrentUser = 0;
            let oweCurrentUser = 0;
  
            for (const expense of expenses) {
              const isPayer =
                expense.paidBy.walletAddress === account.bech32Address;
  
              for (const participant of expense.participants) {
                const isCurrentUser =
                  participant.member.walletAddress === account.bech32Address;
  
                if (isPayer && !isCurrentUser && !participant.settled) {
                  owedCurrentUser += participant.amount;
                  totalOwed += participant.amount;
                }
  
                if (!isPayer && isCurrentUser && !participant.settled) {
                  oweCurrentUser += participant.amount;
                  totalOwe += participant.amount;
                }
              }
            }
  
            return {
              ...group,
              id: String(id),
              expenses,
              totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
              owedCurrentUser,
              oweCurrentUser,
            };
          }
        )
      );
  
      setGroups(formattedGroups);
      console.log("Formatted groups:", formattedGroups);
  
      const userName = shortenWallet(account.bech32Address);
      setUser({
        id: account.bech32Address,
        walletAddress: account.bech32Address,
        name: userName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
        totalOwe,
        totalOwed,
      });
    } catch (err) {
      console.error("fetchUserGroups error:", err);
    }
  };
  

  // ========== TX FUNCTIONS ==========
  const createGroup = async (name: string, participants: string[]) => {
    if (!queryClient || !account) return;

    try {
      await client?.execute(
        account.bech32Address,
        splitXContractAddress,
        {
          create_group: {
            name,
            participants,
          },
        },
        "auto"
      );

      // console.log("Group created");
      await fetchUserGroups();
    } catch (err) {
      console.error("createGroup error:", err);
    }
  };

  const addExpenseTx = async (
    groupId: number,
    paidBy: string,
    amount: number,
    participants: string[],
    description: string
  ) => {
    if (!queryClient || !account) return;

    try {
      await client?.execute(
        account.bech32Address,
        splitXContractAddress,
        {
          add_expense: {
            group_id: groupId,
            paid_by: paidBy,
            amount,
            participants,
            description,
          },
        },
        "auto"
      );

      console.log("Expense added");
    } catch (err) {
      console.error("addExpenseTx error:", err);
    }
  };

  const payExpense = async (groupId: number, expenseId: number) => {
    if (!queryClient || !account) return;

    try {
      await client?.execute(
        account.bech32Address,
        splitXContractAddress,
        {
          pay_expense: {
            group_id: groupId,
            expense_id: expenseId,
          },
        },
        "auto"
      );

      console.log("Expense paid");
    } catch (err) {
      console.error("payExpense error:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        groups,
        addGroup,
        addExpense,
        getGroupById,
        fetchGroup,
        fetchAllGroups,
        fetchExpense,
        fetchGroupExpenses,
        fetchUserGroups,
        createGroup,
        addExpenseTx,
        payExpense,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
