import React from 'react';
import CustomPieChart from '../charts/CustomPieChart';

const COLORS=["#875CF5","#FA2C37","#FF6900"];

const FinanceOverview = ({ totalBalance = 0, totalIncome = 0, totalExpense = 0 }) => {

    const balanceData=[
        {
            name:"Total Balance",
            amount:totalBalance,
            color:"#875CF5"
        },
    {
        name:"Total Income",
        amount:totalIncome,
        color:"#FA2C37"
    },
    {
        name:"Total Expense",
        amount:totalExpense,
        color:"#FF6900"
    }
    ]
    return(
        <div className="card">
            <div className="flex items-center justify-between">
            <h5 className="text-lg">Finance Overview</h5>
            </div>
            <CustomPieChart 
              data={balanceData}
              label="Total Balance"
              totalAmount={totalBalance}
              colors={COLORS}
              showTextAnchor
            />
            
        </div>
    )
}
export default FinanceOverview;