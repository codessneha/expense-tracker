import React from 'react';
import moment from 'moment';
import TransactionInfoCard from '../cards/TransactionInfoCard';
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
                {transactions?.slice(0,5)?.map((item)=>(
                    <TransactionsInfoCard
                    key={item._id}
                    title={item.type=='expense' ? item.category : item.incomeSource}
                    icon={item.icon}
                    date={moment(item.date).format('DD/MM/YYYY')}
                    amount={item.amount}
                    type={item.type}
                    hideDeleteBtn
                    />
                 ))}
                </div>

                
            </div>

    )
}
export default RecentTransactions;