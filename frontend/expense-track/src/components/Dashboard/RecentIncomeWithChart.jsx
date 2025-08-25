import React, { useEffect, useState, useMemo } from 'react';
import CustomBarChart from '../charts/CustomBarChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data = [], totalIncome = 0 }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        try {
            console.log('Raw chart data received:', data);
            
            // Handle different data structures
            let transactions = [];
            if (Array.isArray(data)) {
                transactions = data;
            } else if (data && typeof data === 'object' && Array.isArray(data.transactions)) {
                transactions = data.transactions;
            } else if (data && typeof data === 'object' && data.data) {
                transactions = Array.isArray(data.data) ? data.data : [];
            } else if (data && typeof data === 'object' && data.amount) {
                // Handle case where data is a single transaction object
                transactions = [data];
            }
            
            // Log the first few transactions for debugging
            console.log('First 3 transactions:', transactions.slice(0, 3).map(t => ({
                id: t._id,
                amount: t.amount,
                source: t.source,
                date: t.date,
                keys: Object.keys(t)
            })));
            
            console.log('Processed transactions:', transactions);
            
            if (!transactions.length) {
                console.warn('No transaction data found in:', {
                    dataType: typeof data,
                    isArray: Array.isArray(data),
                    dataKeys: data && typeof data === 'object' ? Object.keys(data) : 'N/A',
                    dataValue: data
                });
                setChartData([]);
                return;
            }

            // Log sample data for debugging
            if (transactions.length > 0) {
                console.log('Sample transaction:', {
                    date: transactions[0]?.date,
                    amount: transactions[0]?.amount,
                    source: transactions[0]?.incomeSource || transactions[0]?.source || 'N/A',
                    transactionKeys: Object.keys(transactions[0] || {})
                });
            }

            // Process data with better error handling
            const dataArr = transactions
                .filter(item => item && (item.amount || item.amount === 0)) // Filter out invalid items
                .map((item, index) => {
                    try {
                        const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0;
                        let date;
                        
                        // Handle different date formats
                        if (item.date) {
                            date = new Date(item.date);
                            if (isNaN(date.getTime())) {
                                console.warn(`Invalid date at index ${index}:`, item.date);
                                date = new Date();
                            }
                        } else {
                            console.warn(`Missing date at index ${index}, using current date`);
                            date = new Date();
                        }
                        
                        // Use the 'source' field from the income model
                        const source = (item.source && item.source.trim()) || 'Other Income';
                        if (!item.source) {
                            console.warn('Missing source for income item:', { 
                                id: item._id, 
                                amount: item.amount, 
                                date: item.date 
                            });
                        }
                        const month = date.toLocaleString('default', { month: 'short' });
                        const year = date.getFullYear();
                        const fullDate = date.toISOString().split('T')[0];
                        
                        return {
                            name: source,
                            amount: amount,
                            month: month,
                            year: year,
                            fullDate: fullDate,
                            rawItem: item // Keep original item for debugging
                        };
                    } catch (error) {
                        console.error(`Error processing transaction at index ${index}:`, error, 'Item:', item);
                        return null;
                    }
                })
                .filter(Boolean); // Remove any null entries from errors
                
            console.log('Processed data array:', dataArr);
            
            if (dataArr.length === 0) {
                console.warn('No valid data points after processing');
                setChartData([]);
                return;
            }
            
            console.log('Processed data points:', dataArr);
            
            // Group by month-year and sum amounts
            const groupedData = dataArr.reduce((acc, curr) => {
                const key = `${curr.month}-${curr.year}`;
                if (!acc[key]) {
                    acc[key] = { 
                        name: curr.month,
                        amount: 0,
                        fullDate: curr.fullDate,
                        month: curr.month,
                        year: curr.year
                    };
                }
                acc[key].amount += curr.amount;
                return acc;
            }, {});
            
            // Convert to array and sort by date
            const finalData = Object.values(groupedData)
                .sort((a, b) => {
                    // Sort by year and then by month
                    if (a.year !== b.year) return a.year - b.year;
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return months.indexOf(a.month) - months.indexOf(b.month);
                })
                .map(item => ({
                    name: item.name,
                    amount: parseFloat(item.amount.toFixed(2)), // Ensure 2 decimal places
                    fullDate: item.fullDate
                }));
                
            console.log('Final chart data:', finalData);
            
            if (finalData.length === 0) {
                console.warn('No valid data points after processing');
                // Add sample data for testing if needed
                // finalData.push({ name: 'Sample', amount: 1000, fullDate: new Date().toISOString().split('T')[0] });
            }
            
            setChartData(finalData);
        } catch (error) {
            console.error('Error processing income chart data:', error, 'Data:', data);
            setChartData([]);
        }
    }, [data]);

    // Memoize the chart to prevent unnecessary re-renders
    const memoizedChart = useMemo(() => (
        chartData.length > 0 ? (
            <CustomBarChart
                data={chartData}
                colors={COLORS}
            />
        ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-700 mb-1">No Income Data</h4>
                <p className="text-gray-500 text-sm">
                    {data.length === 0 
                        ? "No income transactions found in the last 60 days." 
                        : "Could not process the income data. Please check the console for details."}
                </p>
            </div>
        )
    ), [chartData, data.length]);

    return (
        <div className="card h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-medium">Last 60 Days Income</h5>
                {totalIncome > 0 && (
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        Total: ₹{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                )}
            </div>
            <div className="flex-1">
                {memoizedChart}
            </div>
        </div>
    );
};

export default RecentIncomeWithChart;

