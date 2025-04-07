
import React, { createContext, useContext, useState, useEffect } from "react";
import { Group, User } from "@/types";
import { currentUser, mockGroups } from "@/data/mockData";

interface AppContextType {
  user: User | null;
  groups: Group[];
  addGroup: (group: Omit<Group, "id">) => void;
  addExpense: (groupId: string, expense: any) => void;
  getGroupById: (id: string) => Group | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Simulate fetching user and groups data
    setUser(currentUser);
    setGroups(mockGroups);
  }, []);

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
            date: new Date()
          };
          return {
            ...group,
            expenses: [...group.expenses, newExpense],
            totalAmount: group.totalAmount + expense.amount
          };
        }
        return group;
      })
    );
  };

  const getGroupById = (id: string) => {
    return groups.find((group) => group.id === id);
  };

  return (
    <AppContext.Provider value={{ user, groups, addGroup, addExpense, getGroupById }}>
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
