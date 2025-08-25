import React, { useState, useEffect, useMemo } from 'react';
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../charts/CustomBarChart';

const Last30DaysExpenses = ({ data = [] }) => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Process the data when it changes
    useEffect(() => {
        const processData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                console.log('=== Last30DaysExpenses Debug ===');
                console.log('Raw data received:', {
                    isArray: Array.isArray(data),
                    dataLength: data?.length || 0,
                    sampleItem: data?.[0],
                    sampleCategory: data?.[0]?.category,
                    sampleAmount: data?.[0]?.amount
                });
                
                // Ensure we have valid data
                if (!Array.isArray(data)) {
                    console.error('Error: Data is not an array');
                    throw new Error('Data is not an array');
                }
                
                if (data.length === 0) {
                    console.log('Info: No expense data available');
                    setChartData([]);
                    return;
                }
                
                // Process the data for the chart
                console.log('Processing data with prepareExpenseBarChartData...');
                const processedData = prepareExpenseBarChartData(data);
                
                console.log('Processed chart data:', {
                    isArray: Array.isArray(processedData),
                    dataLength: processedData?.length || 0,
                    sampleItem: processedData?.[0],
                    allCategories: processedData?.map(item => item?.name)
                });
                
                if (!Array.isArray(processedData) || processedData.length === 0) {
                    console.error('Error: Processed data is empty or invalid');
                    throw new Error('Processed data is empty or invalid');
                }
                
                setChartData(processedData);
            } catch (error) {
                console.error('Error processing expense data:', error);
                setError(error.message);
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };

        processData();
    }, [data]);

    // Render loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-48 p-4 text-center">
                <p className="text-red-500 font-medium mb-2">Error loading chart data</p>
                <p className="text-sm text-gray-600">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm text-blue-600 hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    // Render empty state
    if (!chartData || chartData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 p-4 text-center">
                <p className="text-gray-500">No expense data available</p>
                <p className="text-sm text-gray-400 mt-1">Add expenses to see the chart</p>
            </div>
        );
    }

    // Render chart
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 min-h-0 w-full">
                <div className="w-full h-full">
                    <CustomBarChart data={chartData} />
                </div>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
                Showing {chartData.length} categor{chartData.length === 1 ? 'y' : 'ies'}
            </div>
        </div>
    );
};

export default Last30DaysExpenses;
