
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Users, Receipt, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewExpense = () => {
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    splitType: "equal",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!expenseData.title || !expenseData.amount || !expenseData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would normally save the expense data to your backend
    console.log("Submitting expense:", expenseData);
    
    // Show success message
    toast.success("Expense added successfully!");
    
    // Navigate back to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="mb-6">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Add New Expense</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Expense Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Dinner, Movie tickets, etc."
                  value={expenseData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("category", value)}
                  value={expenseData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Drinks</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add more details about this expense..."
                  value={expenseData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="splitType">Split Type</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("splitType", value)}
                  value={expenseData.splitType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How to split the expense" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Equal Split</SelectItem>
                    <SelectItem value="percentage">Percentage Split</SelectItem>
                    <SelectItem value="custom">Custom Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 flex items-center gap-4">
                <Button variant="outline" type="button" className="gap-2">
                  <Users className="h-4 w-4" />
                  Add People
                </Button>
                <Button type="submit" className="flex-1">Save Expense</Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewExpense;
