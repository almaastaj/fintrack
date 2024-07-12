// components/ScrollableContainer.js
import React from "react";

const ScrollableContainer = ({ children }) => {
    return (
        <div className="overflow-auto no-scrollbar max-h-screen">
            {children}
        </div>
    );
};

export default ScrollableContainer;
