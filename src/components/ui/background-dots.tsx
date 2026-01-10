import { cn } from "@/lib/utils";

/**
 * Aceternity BackgroundDots component with subtle dot pattern background.
 */
export const BackgroundDots = ({
  className,
  dotClassName,
}: {
  className?: string;
  dotClassName?: string;
}) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="20"
              cy="20"
              r="2"
              className={cn(
                "fill-neutral-300 dark:fill-neutral-700",
                dotClassName
              )}
            />
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#dots)" />
      </svg>
    </div>
  );
};
