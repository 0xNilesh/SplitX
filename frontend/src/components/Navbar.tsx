
import { Bell, User, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Skip navbar on landing page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 glass z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SplitX
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link to="/dashboard" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/groups" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/groups' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                <Users className="h-4 w-4 mr-2" />
                Groups
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <Link to="/profile">
              <Button variant="outline" size="icon" className={`rounded-full ${location.pathname === '/profile' ? 'bg-primary/10 border-primary text-primary' : ''}`}>
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
