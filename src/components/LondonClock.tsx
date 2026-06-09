"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LondonClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Asia/Kolkata timezone
      const formattedTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setTime(formattedTime);
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <div className="flex items-center gap-2 text-gray-600 opacity-0"><Clock size={14} /><span>--:-- in New Delhi</span></div>;
  }

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Clock size={14} />
      <span className="text-[13px]">{time} in New Delhi</span>
    </div>
  );
}
