import React from 'react';

export default function PreviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col">
            {children}
        </div>
    );
}
