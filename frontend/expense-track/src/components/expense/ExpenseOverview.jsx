import React, { useState, useEffect } from 'react';
import { LuPlus } from 'react-icons/lu';   
import CustomLineChart from '../charts/CustomLineChart';
import { prepareExpenseLineChartData } from '../../utils/helper';



const ExpenseOverview=({
    transactions,
    onExpenseIncome,
})=>{
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            setIsLoading(true);
            const result = prepareExpenseLineChartData(transactions || []);
            setChartData(result || []);
        } catch (error) {
            console.error('Error processing expense data:', error);
            setChartData([]);
        } finally {
            setIsLoading(false);
        }
    }, [transactions]);
    return(
       <div className="card">
        <div className="flex items-center justify-between">
            <div className="">
                <h5 className="text-lg">Expense Overview</h5>
                <p className="text-sm text-gray-600 mt-0.5">Track your spending over time and analyze your expense trends</p>
            </div>
            <button className="add-btn" onClick={onExpenseIncome}>
                <LuPlus className="text-lg"/>
                Add Expense
            </button>
        </div>

        <div className="m-10">
            <CustomLineChart
            data={chartData}
            />
        </div>
       </div>
    )
}
export default ExpenseOverview;

