import React from "react";
import "flag-icons/css/flag-icons.min.css";

interface TeamFlagProps {
  flag: string;
  className?: string;
}

export const TeamFlag: React.FC<TeamFlagProps> = ({ flag, className = "" }) => {
  const isPlaceholder = flag === "🏳️" || flag === "🏳" || !flag || flag.trim() === "";

  if (isPlaceholder) {
    return (
      <span
        className={`inline-block w-[1.33em] h-[1em] bg-slate-200 dark:bg-slate-800 border border-slate-350 dark:border-slate-700 rounded-sm align-middle select-none shrink-0 ${className}`}
      />
    );
  }

  // Normalize code (e.g. "mx", "gb-eng")
  const code = flag.toLowerCase().trim();

  return (
    <span
      className={`fi fi-${code} rounded-sm shadow-xs align-middle select-none shrink-0 ${className}`}
    />
  );
};
