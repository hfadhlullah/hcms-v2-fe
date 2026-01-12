import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

export const BottomNav = ({
    navItems,
}: {
    navItems: BottomNavItem[];
}) => {
    const location = useLocation();

    return (
        <nav
            className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 z-50",
                "bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl",
                "border-t border-neutral-200 dark:border-neutral-800",
                "pb-safe"
            )}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item, idx) => {
                    const isActive = location.pathname === item.href ||
                        location.pathname.startsWith(item.href + '/');

                    return (
                        <a
                            key={idx}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                                "min-w-[4rem]",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            )}
                        >
                            <span
                                className={cn(
                                    "w-5 h-5 transition-transform duration-200",
                                    isActive && "scale-110"
                                )}
                            >
                                {item.icon}
                            </span>
                            <span
                                className={cn(
                                    "text-[10px] font-medium transition-all duration-200",
                                    isActive && "font-semibold"
                                )}
                            >
                                {item.label}
                            </span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
};
