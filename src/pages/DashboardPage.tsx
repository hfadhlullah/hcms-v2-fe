import { motion } from "framer-motion";
import { StatsGrid } from "@/components/molecules";
import {
  WelcomeCard,
  RecentActivity,
  QuickActions
} from "@/components/organisms";

export const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-8"
    >
      {/* Welcome Card */}
      <WelcomeCard />

      {/* Stats Grid */}
      <StatsGrid />

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-neutral-500 dark:text-neutral-500 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <p>HCMS Dashboard v1.0.0 - Last updated today</p>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
