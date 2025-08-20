import React from 'react';
import { prepareExpenseBarChartData } from '../../utils/helper';
import { useState } from 'react';
import { useEffect } from 'react';

const Last30DaysExpenses=({data})=>{

    const [chartData, setChartData]=useState(null);

    useEffect(()=>{
        const result=prepareExpenseBarChartData(data);
        setChartData(result);
        return ()=>{};
    },[data]);
    return(
        <div className="card col-span-1">
            <div className="flex items-center justify-between">
            <h5 className="text-lg">Expenses</h5>
            </div>

            <CustomBarChart
            data={chartData}
            
            />
        </div>
    )
}
export default Last30DaysExpenses;
