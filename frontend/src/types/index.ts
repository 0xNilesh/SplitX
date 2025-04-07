
export interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  totalAmount: number;
}

export interface Member {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  paidBy: Member;
  participants: {
    member: Member;
    amount: number;
    settled: boolean;
  }[];
  description?: string;
}

export interface User {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  totalBalance: number;
  totalOwed: number;
  totalOwe: number;
}
