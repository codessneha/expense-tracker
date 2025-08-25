import React from 'react';
import moment from 'moment';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import { LuArrowRight } from 'react-icons/lu';

const RecentTransactions = ({ transactions = [], onSeeMore }) => {
    console.log('RecentTransactions - transactions:', transactions);
    
    // Ensure transactions is an array and has items
    const validTransactions = Array.isArray(transactions) ? transactions : [];
    console.log('Valid transactions:', validTransactions);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-medium text-gray-800">Recent Transactions</h5>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-800" onClick={onSeeMore}>See More <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-6">
                {validTransactions.slice(0, 5).map((item, index) => {
                    console.log(`Rendering transaction ${index}:`, item);
                    return (
                        <TransactionInfoCard
                            key={item._id || index}
                            title={item.type === 'expense' ? item.category : item.incomeSource}
                            icon={item.icon}
                            date={item.date ? moment(item.date).format('DD/MM/YYYY') : 'N/A'}
                            amount={item.amount || 0}
                            type={item.type || 'expense'}
                            hideDeleteBtn
                        />
                    );
                })}
                </div>

                
            </div>

    )
}
export default RecentTransactions;