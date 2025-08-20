import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {prepareIncomeBarChartData} from '../../utils/helper';
import {LuPlusCircle} from 'react-icons/lu';
import CustomBarChart from '../charts/CustomBarChart';
import TransactionsInfoCard from '../cards/TransactionInfoCard';
import {LuArrowRight} from 'react-icons/lu';
import moment from 'moment';
import { COLORS } from '../../utils/helper';

const IncomeOverview=({transactions,onAddIncome})=>{
    const [charData,setChartData]=useState(null);
    useEffect(()=>{
        const result=prepareIncomeBarChartData(transactions);
        setChartData(result);
        return ()=>{};
    },[transactions]);


    return(
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="">
                <h5 className="text-lg">
                    Income Overview
                </h5>
                <p className="text-sm text-gray-600">
                    Track your earnings over time and analyze your income trends
                </p>
            </div>

            <button className="add-btn" onClick={onAddIncome}>
                <LuPlusCircle className="text-lg"/>
            </button>
            </div>
            
            <div className="m-10">
                <CustomBarChart
                data={chartData}
                
                />

            </div>


            
        </div>
    )
}