import { useAuth } from "@/hooks";
import { motion } from "framer-motion";

export const WelcomeCard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();

  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-lg"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {getGreeting()}, {user?.email?.split("@")[0] || "User"}! 👋
      </h1>
      <p className="text-blue-100">
        Welcome back to your HCMS dashboard. Here's what's happening today.
      </p>
    </motion.div>
  );
};
