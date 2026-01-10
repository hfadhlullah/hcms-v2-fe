import { Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"

interface TimePickerProps {
    value?: string; // HH:mm format
    onChange: (time: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function TimePicker({
    value,
    onChange,
    disabled = false,
}: TimePickerProps) {
    const [open, setOpen] = useState(false);

    // Derive state from props
    const [selectedHour, selectedMinute] = value
        ? value.split(":").map(Number)
        : [9, 0];

    const hourListRef = useRef<HTMLDivElement>(null);
    const minuteListRef = useRef<HTMLDivElement>(null);

    // Scroll to selected items when popover opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                if (hourListRef.current) {
                    const selectedItem = hourListRef.current.querySelector('[data-selected="true"]');
                    if (selectedItem) {
                        selectedItem.scrollIntoView({ block: 'center', behavior: 'instant' });
                    }
                }
                if (minuteListRef.current) {
                    const selectedItem = minuteListRef.current.querySelector('[data-selected="true"]');
                    if (selectedItem) {
                        selectedItem.scrollIntoView({ block: 'center', behavior: 'instant' });
                    }
                }
            }, 0);
        }
    }, [open]);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const handleHourSelect = (hour: number) => {
        const timeString = `${hour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;
        onChange(timeString);
    };

    const handleMinuteSelect = (minute: number) => {
        const timeString = `${selectedHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        onChange(timeString);
        setOpen(false);
    };

    const displayTime = value || `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                        "flex items-center gap-2",
                        "bg-white hover:border-gray-400",
                        disabled && "opacity-50 cursor-not-allowed bg-gray-50"
                    )}
                >
                    <span className="text-gray-900 font-mono">{displayTime}</span>
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                <div className="flex bg-white rounded-md shadow-lg border border-gray-200">
                    {/* Hours Column */}
                    <div
                        ref={hourListRef}
                        className="h-48 w-12 overflow-y-auto border-r border-gray-100 scrollbar-thin"
                    >
                        {hours.map((hour) => (
                            <button
                                key={hour}
                                type="button"
                                data-selected={selectedHour === hour}
                                onClick={() => handleHourSelect(hour)}
                                className={cn(
                                    "w-full py-2 text-sm text-center transition-colors",
                                    "hover:bg-gray-100",
                                    selectedHour === hour
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-700"
                                )}
                            >
                                {hour.toString().padStart(2, "0")}
                            </button>
                        ))}
                    </div>

                    {/* Minutes Column */}
                    <div
                        ref={minuteListRef}
                        className="h-48 w-12 overflow-y-auto scrollbar-thin"
                    >
                        {minutes.map((minute) => (
                            <button
                                key={minute}
                                type="button"
                                data-selected={selectedMinute === minute}
                                onClick={() => handleMinuteSelect(minute)}
                                className={cn(
                                    "w-full py-2 text-sm text-center transition-colors",
                                    "hover:bg-gray-100",
                                    selectedMinute === minute
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-700"
                                )}
                            >
                                {minute.toString().padStart(2, "0")}
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
