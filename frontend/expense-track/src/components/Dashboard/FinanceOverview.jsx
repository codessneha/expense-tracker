import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Modern color scheme with better contrast
const COLORS = ["#4F46E5", "#EC4899"]; // Indigo for Income, Pink for Expense

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p>₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const FinanceOverview = ({ totalBalance = 0, totalIncome = 0, totalExpense = 0 }) => {
    const chartData = [
        {
            name: "Income",
            value: parseFloat(totalIncome) || 0,
            color: COLORS[0]
        },
        {
            name: "Expense",
            value: parseFloat(totalExpense) || 0,
            color: COLORS[1]
        }
    ];

    const hasData = chartData.some(item => item.value > 0);

    return (
        <div className="card h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-medium">Finance Overview</h5>
            </div>
            
            <div className="flex-1 flex flex-col">
                {hasData ? (
                    <div className="flex-1 min-h-[300px]">
                        <div className="w-full h-full p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend 
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{
                                            paddingTop: '10px',
                                            fontSize: '12px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                )}
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-sm text-gray-500">Balance</div>
                        <div className="font-semibold">${parseFloat(totalBalance || 0).toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Income</div>
                        <div className="font-semibold text-green-500">${parseFloat(totalIncome || 0).toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Expense</div>
                        <div className="font-semibold text-amber-500">${parseFloat(totalExpense || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;