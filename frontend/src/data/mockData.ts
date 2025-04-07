
import { Group, User } from "@/types";

export const currentUser: User = {
  id: "user1",
  name: "John Doe",
  walletAddress: "0x1234...5678",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  totalBalance: 1234.56,
  totalOwed: 850.00,
  totalOwe: 384.44
};

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Roommates",
    members: [
      {
        id: "user1",
        name: "John Doe",
        walletAddress: "0x1234...5678",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      },
      {
        id: "user2",
        name: "Jane Smith",
        walletAddress: "0x2345...6789",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
      },
      {
        id: "user3",
        name: "Mike Johnson",
        walletAddress: "0x3456...7890",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
      },
      {
        id: "user4",
        name: "Sarah Williams",
        walletAddress: "0x4567...8901",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      }
    ],
    expenses: [
      {
        id: "exp1",
        title: "Rent - May",
        amount: 2000,
        date: new Date("2024-05-01"),
        paidBy: {
          id: "user1",
          name: "John Doe",
          walletAddress: "0x1234...5678",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        },
        participants: [
          {
            member: {
              id: "user1",
              name: "John Doe",
              walletAddress: "0x1234...5678",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
            },
            amount: 500,
            settled: true
          },
          {
            member: {
              id: "user2",
              name: "Jane Smith",
              walletAddress: "0x2345...6789",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
            },
            amount: 500,
            settled: false
          },
          {
            member: {
              id: "user3",
              name: "Mike Johnson",
              walletAddress: "0x3456...7890",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
            },
            amount: 500,
            settled: true
          },
          {
            member: {
              id: "user4",
              name: "Sarah Williams",
              walletAddress: "0x4567...8901",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
            },
            amount: 500,
            settled: false
          }
        ],
        description: "Monthly rent payment"
      },
      {
        id: "exp2",
        title: "Groceries",
        amount: 150.50,
        date: new Date("2024-05-05"),
        paidBy: {
          id: "user2",
          name: "Jane Smith",
          walletAddress: "0x2345...6789",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        },
        participants: [
          {
            member: {
              id: "user1",
              name: "John Doe",
              walletAddress: "0x1234...5678",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
            },
            amount: 37.63,
            settled: false
          },
          {
            member: {
              id: "user2",
              name: "Jane Smith",
              walletAddress: "0x2345...6789",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
            },
            amount: 37.62,
            settled: true
          },
          {
            member: {
              id: "user3",
              name: "Mike Johnson",
              walletAddress: "0x3456...7890",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
            },
            amount: 37.63,
            settled: true
          },
          {
            member: {
              id: "user4",
              name: "Sarah Williams",
              walletAddress: "0x4567...8901",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
            },
            amount: 37.62,
            settled: false
          }
        ],
        description: "Weekly grocery shopping"
      }
    ],
    totalAmount: 850.25
  },
  {
    id: "2",
    name: "Trip to Miami",
    members: [
      {
        id: "user1",
        name: "John Doe",
        walletAddress: "0x1234...5678",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      },
      {
        id: "user2",
        name: "Jane Smith",
        walletAddress: "0x2345...6789",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
      },
      {
        id: "user5",
        name: "Tom Wilson",
        walletAddress: "0x5678...9012",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom"
      },
      {
        id: "user6",
        name: "Lisa Brown",
        walletAddress: "0x6789...0123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa"
      }
    ],
    expenses: [
      {
        id: "exp3",
        title: "Flight Tickets",
        amount: 1200,
        date: new Date("2024-06-15"),
        paidBy: {
          id: "user5",
          name: "Tom Wilson",
          walletAddress: "0x5678...9012",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom"
        },
        participants: [
          {
            member: {
              id: "user1",
              name: "John Doe",
              walletAddress: "0x1234...5678",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
            },
            amount: 300,
            settled: false
          },
          {
            member: {
              id: "user2",
              name: "Jane Smith",
              walletAddress: "0x2345...6789",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
            },
            amount: 300,
            settled: true
          },
          {
            member: {
              id: "user5",
              name: "Tom Wilson",
              walletAddress: "0x5678...9012",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom"
            },
            amount: 300,
            settled: true
          },
          {
            member: {
              id: "user6",
              name: "Lisa Brown",
              walletAddress: "0x6789...0123",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa"
            },
            amount: 300,
            settled: true
          }
        ],
        description: "Round trip tickets to Miami"
      }
    ],
    totalAmount: 1245.75
  },
  {
    id: "3",
    name: "Weekly Lunch",
    members: [
      {
        id: "user1",
        name: "John Doe",
        walletAddress: "0x1234...5678",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      },
      {
        id: "user3",
        name: "Mike Johnson",
        walletAddress: "0x3456...7890",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
      },
      {
        id: "user7",
        name: "Alex Green",
        walletAddress: "0x7890...1234",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
      }
    ],
    expenses: [
      {
        id: "exp4",
        title: "Lunch - Mexican",
        amount: 65.25,
        date: new Date("2024-05-10"),
        paidBy: {
          id: "user3",
          name: "Mike Johnson",
          walletAddress: "0x3456...7890",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
        },
        participants: [
          {
            member: {
              id: "user1",
              name: "John Doe",
              walletAddress: "0x1234...5678",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
            },
            amount: 21.75,
            settled: true
          },
          {
            member: {
              id: "user3",
              name: "Mike Johnson",
              walletAddress: "0x3456...7890",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
            },
            amount: 21.75,
            settled: true
          },
          {
            member: {
              id: "user7",
              name: "Alex Green",
              walletAddress: "0x7890...1234",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            },
            amount: 21.75,
            settled: false
          }
        ],
        description: "Lunch at Taco Bell"
      }
    ],
    totalAmount: 120.00
  }
];
