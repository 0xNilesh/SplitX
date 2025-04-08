"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GroupModal } from "@/components/modals/GroupModal";
import { motion } from "framer-motion";
import Link from "next/link";
import AbstractionPage from "../abstraxionPage";
import { Navbar } from "@/components/layout/Navbar";

export default function GroupsPage() {
  const { groups } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Groups</h1>
            <p className="text-gray-600">Manage your expense groups</p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search groups..."
                className="pl-10 border-gray-200 focus:border-splitx-blue transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowGroupModal(true)}
              className="bg-splitx-blue hover:bg-blue-700 shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" /> New Group
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredGroups.map((group) => (
            <motion.div
              key={group.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href={`/groups/${group.id}`}>
                <Card className="h-full hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
                  <CardContent className="p-8 flex flex-col">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">{group.name}</h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{group?.participants?.length} members</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        {group?.participants?.slice(0, 4).map((participant, index) => (
                          <img
                            key={index}
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`}
                            alt={participant.name}
                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                          />
                        ))}
                        {group?.participants?.length > 4 && (
                          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium">
                            +{group?.participants?.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="text-lg font-bold text-splitx-blue">
                        ${group.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Group Modal */}
        <GroupModal
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
        />
      </motion.div>
    </AbstractionPage>
  );
}
