import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
const RecentTransactions=(transactions,onSeeMore)=>{
    return(
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-medium text-gray-800">Recent Transactions</h5>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-800" onClick={onSeeMore}>See More <LuArrowRight className="text-base"/>
                </button>
            </div>

            <div className="mt-6">
                {transactions?.slic}
                
            </div>
        </div>

    )
}
export default RecentTransactions;