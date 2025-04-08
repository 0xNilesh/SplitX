
export interface Group {
  id: string;
  name: string;
  creator: string;
  participants: Member[];
  expenses: Expense[];
  totalAmount: number;
  owedCurrentUser: number;
  oweCurrentUser: number;
}

export interface Member {
  name: string;
  walletAddress: string;
}

export interface Expense {
  id: string;
  amount: number;
  paidBy: Member;
  participants: {
    member: Member;
    amount: number;
    settled: boolean;
  }[];
  description: string;
}

export interface User {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  totalOwed: number;
  totalOwe: number;
}
