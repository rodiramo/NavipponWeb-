import React, { useState } from 'react';

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex border-b">
                {React.Children.map(children, (child, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {React.Children.map(children, (child, index) => (
                    <div key={index} className={activeTab === index ? 'block' : 'hidden'}>
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