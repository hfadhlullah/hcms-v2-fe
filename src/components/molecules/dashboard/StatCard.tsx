import React from "react";
import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Clock, AlertCircle, Calendar } from "lucide-react";

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "orange" | "purple";
}

export const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color = "blue",
}: StatCardProps) => {
  const colorClass = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
    purple: "text-purple-600 dark:text-purple-400",
  }[color];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <CardSpotlight>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 ${colorClass}`}>
            {icon}
          </div>
        </div>
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            {subtitle}
          </p>
        )}
      </CardSpotlight>
    </motion.div>
  );
};

export const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<Clock className="w-6 h-6" />}
        title="Today's Attendance"
        value="8h 32m"
        subtitle="On time"
        color="blue"
      />
      <StatCard
        icon={<AlertCircle className="w-6 h-6" />}
        title="Pending Requests"
        value="2"
        subtitle="Need review"
        color="orange"
      />
      <StatCard
        icon={<Calendar className="w-6 h-6" />}
        title="Upcoming Shifts"
        value="3"
        subtitle="This week"
        color="purple"
      />
    </div>
  );
};
