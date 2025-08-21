import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {prepareIncomeBarChartData} from '../../utils/helper';
import { LuPlus as LuPlusCircle } from 'react-icons/lu';
    import CustomBarChart from '../charts/CustomBarChart';
import TransactionsInfoCard from '../cards/TransactionInfoCard';
import {LuArrowRight} from 'react-icons/lu';
import moment from 'moment';


const IncomeOverview = ({ transactions = [], onAddIncome }) => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            setIsLoading(true);
            const result = prepareIncomeBarChartData(transactions || []);
            setChartData(result || []);
        } catch (error) {
            console.error('Error processing income data:', error);
            setChartData([]);
        } finally {
            setIsLoading(false);
        }
    }, [transactions]);


    return(
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h5 className="text-lg font-medium">
                        Income Overview
                    </h5>
                    <p className="text-sm text-gray-600">
                        Track your earnings over time and analyze your income trends
                    </p>
                </div>

                <button 
                    className="add-btn" 
                    onClick={onAddIncome}
                    disabled={isLoading}
                >
                    <LuPlusCircle className="text-lg"/>
                </button>
            </div>
            
            <div className="min-h-[300px] flex items-center justify-center">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-2"></div>
                        <p className="text-gray-500">Loading income data...</p>
                    </div>
                ) : chartData && chartData.length > 0 ? (
                    <div className="w-full h-[300px]">
                        <CustomBarChart data={chartData} />
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <p className="text-gray-500 mb-4">No income data available</p>
                        <button 
                            onClick={onAddIncome}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                            + Add your first income
                        </button>
                    </div>
                )}
            </div>


            
        </div>
    )
}
export default IncomeOverview;