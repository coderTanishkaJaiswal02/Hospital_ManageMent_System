// import React, { useState } from "react";

// const ToggleCell = ({ text, limit = 30, width = "150px" }) => {
//   const [expanded, setExpanded] = useState(false);

//   if (!text) return <span>-</span>;

//   const isLong = text.length > limit;
//   const displayText = expanded ? text : text.slice(0, limit);

//   return (
//     <div
//       style={{ width }}
//       className="whitespace-normal break-words overflow-hidden"
//     >
//       {displayText}
//       {isLong && !expanded && (
//         <button
//           onClick={() => setExpanded(true)}
//           className="text-gray-500 cursor-pointer ml-1"
//         >
//           ...
//         </button>
//       )}
//     </div>
//   );
// };

// export default ToggleCell;


import { ChevronUp } from "lucide-react";
import React, { useState } from "react";

const ToggleCell = ({ text, limit = 30, width = "150px" }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return <span>-</span>;

  const isLong = text.length > limit;
  const displayText = expanded ? text : text.slice(0, limit);

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
          {expanded ? <ChevronUp size={16} />: "..."}
        </button>
      )}
    </div>
  );
};

export default ToggleCell;
