import React, { useEffect, useState, useMemo } from 'react';
import CustomBarChart from '../charts/CustomBarChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data = [], totalIncome = 0 }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        try {
            const processedData = Array.isArray(data) ? data : [];
            const dataArr = processedData.map((item) => ({
                name: item?.source || 'Unknown',
                amount: item?.amount || 0,
                month: item?.date ? new Date(item.date).toLocaleString('default', { month: 'short' }) : ''
            }));
            setChartData(dataArr);
        } catch (error) {
            console.error('Error processing income chart data:', error);
            setChartData([]);
        }
    }, [data]);

    // Memoize the chart to prevent unnecessary re-renders
    const memoizedChart = useMemo(() => (
        <CustomBarChart
            data={chartData}
            colors={COLORS}
        />
    ), [chartData]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 60 Days Income</h5>
                <span className="text-sm font-medium text-gray-600">
                    Total: ${totalIncome.toLocaleString()}
                </span>
            </div>
            {memoizedChart}
        </div>
    );
};

export default RecentIncomeWithChart;

