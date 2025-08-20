import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import CustomBarChart from '../charts/CustomBarChart';
const COLORS=["#875CF5","#FA2C37","#FF6900","#4f39f6"];
const RecentIncomeWithChart=({data,totalIncome})=>{

    const [chartData, setChartData]=useState(null);

    const prepareIncomeBarChartData=(data)=>{
        const dataArr=data?.map((item)=>({
            name: item?.source,
            amount: item?.amount,
        }))
        setChartData(dataArr);
    };
    useEffect(()=>{
        prepareIncomeBarChartData();
        return ()=>{};
    },[data]);
    return(
        <div className="card">
            <div className="flex items-center justify-between">
            <h5 className="text-lg">Last 60 Days Income</h5>
            </div>
            <CustomBarChart
            data={chartData}
            label="Total Income"
            totalAmount={`$${totalIncome}`}
            showTextAnchor
        colours={COLORS}
            />
        </div>
    )
}
export default RecentIncomeWithChart;

