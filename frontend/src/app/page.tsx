"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@burnt-labs/ui/dist/index.css";
import AbstractionPage from "./abstraxionPage";
import { Users, MessageSquare, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Page(): JSX.Element {
  return (
    <AbstractionPage>
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <header className="glass border-b border-white/200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-xl font-semibold bg-blue-600 bg-clip-text text-transparent">
            SplitX
          </span>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-splitx-blue to-blue-400">
              Split expenses with friends.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              No wallets. No gas. Just vibes.
            </p>
            <p className="text-sm text-gray-500 mb-12">
              All secured on-chain, built with Xion.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-splitx-blue hover:bg-blue-700 shadow-lg gap-2">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/groups">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why choose <span className="text-splitx-blue">SplitX</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <motion.div 
                className="p-8 rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <Users className="h-7 w-7 text-splitx-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">Easy Splitting</h3>
                <p className="text-gray-600">
                  Create groups, split expenses evenly or customize as you need.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-8 rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <MessageSquare className="h-7 w-7 text-splitx-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">Abstracted UX</h3>
                <p className="text-gray-600">
                  No crypto wallet? No problem. Sign up with just your email and start splitting.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-8 rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <svg className="h-7 w-7 text-splitx-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Gasless Transactions</h3>
                <p className="text-gray-600">
                  No crypto needed. All transactions are gasless.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-8 rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <Shield className="h-7 w-7 text-splitx-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Transparent</h3>
                <p className="text-gray-600">
                  Your data lives on-chain, secured by smart contracts.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to split expenses the smart way?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already using SplitX to manage shared expenses.
          </p>
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="bg-splitx-blue hover:bg-blue-700 shadow-lg gap-2">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="text-xl font-bold text-splitx-blue">SplitX</span>
            </div>
            <p className="text-gray-600">© 2025 SplitX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </AbstractionPage>
  );
};
