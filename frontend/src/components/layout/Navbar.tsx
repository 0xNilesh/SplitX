import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Users } from "lucide-react";

export const Navbar = () => {
  const { user } = useApp();
  const isAuthenticated = !!user;

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-splitx-blue to-blue-400 bg-clip-text text-transparent">
              SplitX
            </span>
          </Link>

          {isAuthenticated && (
            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`group flex items-center px-3 py-2 rounded-full hover:bg-blue-50 transition-colors ${
                  location.pathname === "/dashboard" && "bg-blue-50"
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="relative font-medium">
                  Dashboard
                  <span className="h-[2px] inline-block bg-splitx-blue absolute left-0 -bottom-0.5 w-0 group-hover:w-full transition-[width] ease duration-300"></span>
                </span>
              </Link>
              <Link
                href="/groups"
                className={`group flex items-center px-3 py-2 rounded-full hover:bg-blue-50 transition-colors ${
                  location.pathname === "/groups" && "bg-blue-50"
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="relative font-medium">
                  Groups
                  <span className="h-[2px] inline-block bg-splitx-blue absolute left-0 -bottom-0.5 w-0 group-hover:w-full transition-[width] ease duration-300"></span>
                </span>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </motion.div> */}
            </>
          ) : (
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-splitx-blue hover:bg-blue-700 shadow-md">
                  Get Started
                </Button>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
