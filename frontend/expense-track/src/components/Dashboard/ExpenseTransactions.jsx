import React from 'react';
import TransactionsInfoCard from '../cards/TransactionInfoCard';
import {LuArrowRight} from 'react-icons/lu';

const ExpenseTransactions=({transactions,onSeeMore})=>{
    return(
        <div className="card">
            <div className="flex items-center justify-between">
            <h5 className="text-lg">Expense</h5>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-800" onClick={onSeeMore}>See More <LuArrowRight className="text-base"/>
            </button>
            </div>

            <div className="mt-6">
                {transactions?.slice(0,5)?.map((expense)=>(
                    <TransactionsInfoCard
                    key={expense._id}
                    title={expense.type=='expense' ? expense.category : expense.incomeSource}
                    icon={expense.icon}
                    date={moment(expense.date).format('DD/MM/YYYY')}
                    amount={expense.amount}
                    type={expense.type}
                    hideDeleteBtn
                    />
                 ))}
            </div>


        </div>
    )
}
export default ExpenseTransactions;
