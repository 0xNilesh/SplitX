import { Expense } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenWallet = (wallet: string) =>
  `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

export const formatExpense = (exp: any): Expense => {
  // Build a map of paid amounts per wallet for quick lookup
  const paidMap = new Map<string, number>();
  exp.payments?.forEach((payment: any) => {
    if (payment.paid) {
      paidMap.set(
        payment.payer,
        (paidMap.get(payment.payer) || 0) + payment.amount
      );
    }
  });

  const splitAmount = exp.amount / exp.participants.length;
  return {
    id: String(exp.id),
    amount: exp.amount,
    paidBy: {
      walletAddress: exp.paid_by,
      name: shortenWallet(exp.paid_by),
    },
    participants: exp.participants.map((addr: string) => {
      const paidAmount = paidMap.get(addr) || 0;
      return {
        member: {
          walletAddress: addr,
          name: shortenWallet(addr),
        },
        amount: splitAmount,
        settled: paidAmount >= splitAmount, // Mark settled if they've paid their share or more
      };
    }),
    description: exp.description,
  };
};
