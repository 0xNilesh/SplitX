
import { Card } from "@/components/ui/card";
import { ArrowRight, Plus, ArrowUpRight, ArrowDownRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Overview</h1>
          <p className="text-muted-foreground mt-2">Track your group expenses</p>
        </div>
        <Link to="/new-expense">
          <Button className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <h2 className="text-2xl font-bold mt-1">$1,234.56</h2>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">You are owed</p>
              <h2 className="text-2xl font-bold mt-1 text-green-500">$850.00</h2>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">You owe</p>
              <h2 className="text-2xl font-bold mt-1 text-red-500">$384.44</h2>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Groups</h3>
          <Link to="/groups">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, name: "Roommates", members: 4, owes: 0, owed: 250.75 },
            { id: 2, name: "Trip to Miami", members: 6, owes: 120.50, owed: 0 },
            { id: 3, name: "Weekly Lunch", members: 3, owes: 0, owed: 45.00 },
          ].map((group) => (
            <Link to={`/groups/${group.id}`} key={group.id}>
              <div className="flex items-center justify-between py-2 hover:bg-muted/20 px-2 rounded-md transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{group.members} members</p>
                  </div>
                </div>
                {group.owes > 0 ? (
                  <p className="font-semibold text-red-500">You owe ${group.owes.toFixed(2)}</p>
                ) : (
                  <p className="font-semibold text-green-500">Owed ${group.owed.toFixed(2)}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
