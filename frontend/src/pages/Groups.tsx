
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Users, Plus, User, Search } from "lucide-react";

const Groups = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = () => {
    if (groupName.trim() === "") return;
    console.log("Creating group:", groupName);
    setGroupName("");
    setIsOpen(false);
  };

  // Dummy data for groups
  const groups = [
    { id: 1, name: "Roommates", members: 4, total: 850.25 },
    { id: 2, name: "Trip to Miami", members: 6, total: 1245.75 },
    { id: 3, name: "Weekly Lunch", members: 3, total: 120.00 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">Groups</h1>
              <p className="text-muted-foreground mt-2">Manage your expense groups</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  className="pl-10"
                />
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new group</DialogTitle>
                    <DialogDescription>
                      Create a group to share expenses with friends, family, or colleagues.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="group-name" className="text-sm font-medium">Group Name</label>
                      <Input
                        id="group-name"
                        placeholder="e.g. Roommates, Trip to Paris"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateGroup}>Create Group</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="font-medium">${group.total.toFixed(2)}</div>
                    </div>
                    <div className="flex -space-x-3">
                      {Array(Math.min(group.members, 4)).fill(0).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center"
                        >
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      ))}
                      {group.members > 4 && (
                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                          +{group.members - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Groups;
