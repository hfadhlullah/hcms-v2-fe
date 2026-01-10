import React from "react";
import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { FileText, Clock, User, Plus } from "lucide-react";

export interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  color: "blue" | "green" | "purple" | "orange";
}

const quickActions: QuickAction[] = [
  {
    id: "1",
    icon: <FileText className="w-6 h-6" />,
    label: "Submit Request",
    href: "/requests/new",
    color: "blue",
  },
  {
    id: "2",
    icon: <Clock className="w-6 h-6" />,
    label: "Log Hours",
    href: "/attendance/log",
    color: "purple",
  },
  {
    id: "3",
    icon: <User className="w-6 h-6" />,
    label: "View Profile",
    href: "/profile",
    color: "green",
  },
  {
    id: "4",
    icon: <Plus className="w-6 h-6" />,
    label: "More Actions",
    href: "#",
    color: "orange",
  },
];

const getColorClasses = (color: QuickAction["color"]) => {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50",
  };
  return colors[color];
};

export const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="lg:col-span-1"
    >
      <CardSpotlight>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, idx) => (
            <motion.a
              key={action.id}
              href={action.href}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-colors ${getColorClasses(action.color)}`}
            >
              {action.icon}
              <span className="text-xs font-medium text-center">
                {action.label}
              </span>
            </motion.a>
          ))}
        </div>
      </CardSpotlight>
    </motion.div>
  );
};
