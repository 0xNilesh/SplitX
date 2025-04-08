"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import AbstractionPage from "../abstraxionPage";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { ExpenseModal } from "@/components/modals/ExpenseModal";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardPage() {
  const { user, groups } = useApp();
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  if (!user) {
    return (
      <AbstractionPage>
        <Navbar />
        <div className="h-full flex items-center justify-center p-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AbstractionPage>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AbstractionPage>
      <Navbar />
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="container mx-auto py-10 px-4 max-w-6xl"
      >
        <motion.div
          variants={item}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">Your expenses dashboard at a glance</p>
          </div>
          <Button
            onClick={() => setShowExpenseModal(true)}
            className="bg-splitx-blue hover:bg-blue-700 shadow-md mt-4 md:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" /> New Expense
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium text-gray-600">
                    Net Balance
                  </p>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <ArrowRight className="h-5 w-5 text-splitx-blue" />
                  </div>
                </div>
                {(() => {
                  const netBalance = user.totalOwed - user.totalOwe;
                  const isPositive = netBalance >= 0;
                  return (
                    <p
                      className={`text-3xl font-bold ${
                        isPositive ? "text-splitx-green" : "text-splitx-red"
                      }`}
                    >
                      ${netBalance.toFixed(2)}
                    </p>
                  );
                })()}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6 bg-gradient-to-br from-green-50 to-white">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium text-gray-600">
                    You are owed
                  </p>
                  <div className="p-2 bg-green-100 rounded-full">
                    <ArrowUp className="h-5 w-5 text-splitx-green" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-splitx-green">
                  ${user.totalOwed.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6 bg-gradient-to-br from-red-50 to-white">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium text-gray-600">You owe</p>
                  <div className="p-2 bg-red-100 rounded-full">
                    <ArrowDown className="h-5 w-5 text-splitx-red" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-splitx-red">
                  ${user.totalOwe.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          className="mb-8 flex justify-between items-center"
        >
          <h2 className="text-2xl font-bold">Your Groups</h2>
          <Link
            href="/groups"
            className="text-splitx-blue flex items-center hover:underline font-medium"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          {groups &&
            groups.map((group, index) => (
              <motion.div
                key={group.id}
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={`/groups/${group.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                    <CardContent className="p-5 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex -space-x-3 overflow-hidden mr-4">
                          {group.participants
                            ?.slice(0, 4)
                            .map((participant, index) => (
                              <img
                                key={index}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant?.name}`}
                                alt={participant?.name}
                                className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                              />
                            ))}
                          {group.participants?.length > 4 && (
                            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium">
                              +{group.participants.length - 4}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {group.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {group.participants?.length} members
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        {group.oweCurrentUser > 0 && (
                          <div className="text-splitx-red font-medium">
                            You owe ${group.oweCurrentUser.toFixed(2)}
                          </div>
                        )}
                        {group.owedCurrentUser > 0 && (
                          <div className="text-splitx-green font-medium">
                            You are owed ${group.owedCurrentUser.toFixed(2)}
                          </div>
                        )}
                        {group.oweCurrentUser === 0 &&
                          group.owedCurrentUser === 0 && (
                            <div className="text-gray-500 text-sm">
                              Settled up
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </motion.div>

        {/* Expense Modal */}
        <ExpenseModal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          groups={groups}
        />
      </motion.div>
    </AbstractionPage>
  );
}
