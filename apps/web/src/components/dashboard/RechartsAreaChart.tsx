import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export const RechartsAreaChart = ({
    className,
    data
}: {
    className?: string;
    data?: any[];
}) => {
    if (!data || data.length === 0) return null;

    return (
        <div className={className}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#153625', borderColor: '#1F4D36', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#34d399' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#34d399"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
