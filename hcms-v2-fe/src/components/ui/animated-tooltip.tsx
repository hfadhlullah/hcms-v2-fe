import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Aceternity AnimatedTooltip component for animated tooltips on hover.
 */
export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="flex group items-center justify-center max-w-md">
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          className="relative group/tooltip"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          initial={{ x: 0 }}
          animate={{
            marginRight: hoveredId === item.id ? 20 : idx * -10,
          }}
        >
          <motion.div
            className={cn(
              "absolute -top-16 left-1/2 transform -translate-x-1/2",
              "bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap",
              "opacity-0 group-hover/tooltip:opacity-100 transition-opacity",
              hoveredId === item.id ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs text-neutral-400">{item.designation}</div>
          </motion.div>
          <motion.img
            src={item.image}
            height={40}
            width={40}
            alt={item.name}
            className={cn(
              "object-cover !m-0 h-10 w-10 rounded-full",
              "border-2 border-white dark:border-neutral-800 group-hover/tooltip:scale-105 group-hover/tooltip:z-30",
              "transition-all relative"
            )}
            animate={{
              scale: hoveredId === item.id ? 1.1 : 1,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
