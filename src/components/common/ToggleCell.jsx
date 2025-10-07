import { ChevronUp } from "lucide-react";
import React, { useState } from "react";

const ToggleCell = ({ text, limit = 10, width = "100px" }) => {
  const [expanded, setExpanded] = useState(false);

  // Convert anything to string safely
  const safeText = text !== null && text !== undefined ? String(text) : "";

  if (!safeText) return <span>-</span>;

  const isLong = safeText.length > limit;
  const displayText = expanded ? safeText : safeText.slice(0, limit);

  return (
    <div
      style={{ width }}
      className="whitespace-normal break-words overflow-hidden"
    >
      {displayText}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 cursor-pointer ml-1"
        >
          {expanded ? <ChevronUp size={16} /> : "..."}
        </button>
      )}
    </div>
  );
};

export default ToggleCell;


