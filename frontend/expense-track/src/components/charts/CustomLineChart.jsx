import React from 'react';
import {
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Area,
    AreaChart,
    Cell
} from 'recharts';

const CustomLineChart = ({ data = [] }) => {
    const getBarColor = (index) => {
        return index % 2 === 0 ? "#87cf5" : "#cfbefb";
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-sx font-semibold text-purple-800 mb-1">
                        {payload[0]?.payload?.category || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="text-sm font-medium text-gray-900">
                            ${payload[0]?.value?.toLocaleString() || '0'}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        stroke="#ddd"
                    />
                    <YAxis 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        stroke="#ddd"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#4f46e5"
                        fill="#c7d2fe"
                        fillOpacity={0.8}
                        activeDot={{ r: 6, fill: '#4338ca' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
export default CustomLineChart;
