import React from 'react';

export const TestLayout = ({ children }: { children: React.ReactNode }) => (
    <div style={{ padding: '20px', border: '5px solid green' }}>
        {children}
    </div>
);
