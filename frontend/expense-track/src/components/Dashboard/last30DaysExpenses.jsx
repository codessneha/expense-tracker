import React, { useState, useEffect, useMemo } from 'react';
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../charts/CustomBarChart';

const Last30DaysExpenses = ({ data = {} }) => {
    const [chartData, setChartData] = useState([]);

    // Safely process the data
    useEffect(() => {
        try {
            const processedData = Array.isArray(data) ? data : [];
            const result = prepareExpenseBarChartData(processedData);
            setChartData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error('Error processing chart data:', error);
            setChartData([]);
        }
    }, [data]);

    // Memoize the chart to prevent unnecessary re-renders
    const memoizedChart = useMemo(() => (
        <CustomBarChart data={chartData} />
    ), [chartData]);

    return (
        <div className="card col-span-1">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses</h5>
            </div>
            {memoizedChart}
        </div>
    );
};

export default Last30DaysExpenses;
