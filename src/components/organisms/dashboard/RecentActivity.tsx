import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "attendance" | "request" | "shift" | "approval";
}

const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Attendance Marked",
    description: "Checked in at 09:00 AM",
    timestamp: "Today at 09:00 AM",
    type: "attendance",
  },
  {
    id: "2",
    title: "Leave Request Approved",
    description: "Your leave request for tomorrow has been approved",
    timestamp: "Yesterday at 02:30 PM",
    type: "approval",
  },
  {
    id: "3",
    title: "Shift Assigned",
    description: "You've been assigned to shift on Friday",
    timestamp: "2 days ago",
    type: "shift",
  },
];

const getTypeColor = (type: Activity["type"]) => {
  switch (type) {
    case "attendance":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    case "request":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
    case "shift":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
    case "approval":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    default:
      return "bg-neutral-100 dark:bg-neutral-900/30 text-neutral-600 dark:text-neutral-400";
  }
};

export const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-2"
    >
      <CardSpotlight>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {mockActivities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="flex gap-4 pb-4 last:pb-0 border-b last:border-b-0 border-neutral-200 dark:border-neutral-800"
            >
              <div className={`flex-shrink-0 w-3 h-3 mt-2 rounded-full ${getTypeColor(activity.type)}`} />
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900 dark:text-white">
                  {activity.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardSpotlight>
    </motion.div>
  );
};
