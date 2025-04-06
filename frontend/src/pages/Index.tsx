
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // Redirect to landing page if accessed directly
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
