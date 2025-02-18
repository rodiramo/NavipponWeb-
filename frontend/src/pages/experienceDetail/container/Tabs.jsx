import React, { useState } from "react";
import { useTheme } from "@mui/material";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme(); // ✅ Get theme colors

  return (
    <div>
      {/* Tabs Header */}
      <div className="flex border-b">
        {React.Children.map(children, (child, index) => (
          <button
            key={index}
            className="py-2 px-4 transition-colors"
            style={{
              borderBottom:
                activeTab === index
                  ? `2px solid ${theme.palette.primary.main}`
                  : "2px solid transparent",
              color:
                activeTab === index
                  ? theme.palette.primary.main
                  : theme.palette.secondary.dark,
            }}
            onClick={() => setActiveTab(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {React.Children.map(children, (child, index) => (
          <div key={index} className={activeTab === index ? "block" : "hidden"}>
            {child.props.children}
          </div>
        ))}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return <>{children}</>;
};

export { Tabs, Tab };
