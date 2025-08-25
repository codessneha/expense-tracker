import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';

const CustomBarChart = ({ data = [] }) => {
    // Default colors for the bars
    const colors = ['#4f46e5', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];
    
    // Helper function to get color for bars
    const getBarColor = (index) => colors[index % colors.length];

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-3 border border-gray-200 text-sm">
                    <p className="font-medium text-gray-900 mb-1">{label || 'N/A'}</p>
                    <p className="text-gray-700">
                        Amount: <span className="font-semibold">₹{payload[0].value.toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                        })}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Handle empty or missing data
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">No income data available for the selected period</p>
            </div>
        );
    }

    // Log the incoming data for debugging
    console.log('CustomBarChart data:', {
        rawData: data,
        dataLength: data?.length || 0,
        sampleItem: data?.[0],
        dataKeys: data?.[0] ? Object.keys(data[0]) : []
    });

    // Process and sort data
    const processedData = data.map(item => {
        // Handle different possible data structures
        const amount = parseFloat(item.value || item.amount || 0);
        const name = item.name || item.label || item.category?.name || 'Uncategorized';
        
        return {
            ...item,
            amount: amount,
            value: amount, // Ensure value exists for the tooltip
            label: name,
            name: name    // Ensure name exists for the bar chart
        };
    });

    const sortedData = [...processedData].sort((a, b) => b.amount - a.amount);
    console.log('Processed and sorted data:', sortedData);

    // Calculate Y-axis scale
    const amounts = processedData.map(item => parseFloat(item.amount) || 0);
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
    const maxValue = Math.ceil((maxAmount * 1.2) / 100) * 100 || 1000; // Add 20% padding
    
    // Generate Y-axis ticks
    let yAxisTicks = [];
    if (maxValue > 0) {
        const step = maxValue / 5;
        for (let i = 0; i <= 5; i++) {
            yAxisTicks.push(Math.round(i * step));
        }
    } else {
        yAxisTicks = [0, 500, 1000]; // Default ticks if no data
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={sortedData}
                    margin={{ top: 10, right: 20, left: 5, bottom: 40 }}
                    barSize={30}
                    barGap={2}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                        dataKey="label" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        tickMargin={10}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis 
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        domain={[0, maxValue]}
                        ticks={yAxisTicks}
                        width={60}
                    />
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} 
                        wrapperStyle={{ zIndex: 100 }}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
                        {sortedData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={getBarColor(index)} 
                                stroke="#ffffff" 
                                strokeWidth={1} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;
