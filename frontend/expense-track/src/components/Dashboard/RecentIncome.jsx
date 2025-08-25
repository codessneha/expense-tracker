import React from 'react';
import TransactionsInfoCard from '../cards/TransactionInfoCard';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';

const RecentIncome = ({ transactions = [], onSeeMore }) => {
    console.log('RecentIncome - transactions:', transactions);
    // Ensure transactions is an array and has items before mapping
    const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 5) : [];
    console.log('RecentIncome - recentTransactions:', recentTransactions);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Income</h5>
                <button 
                    className="card-btn" 
                    onClick={onSeeMore}
                    disabled={!recentTransactions.length}
                >
                    See More <LuArrowRight className="text-base inline ml-1" />
                </button>
            </div>
            <div className="mt-6">
                {recentTransactions.length > 0 ? (
                    recentTransactions.map((item) => (
                        <TransactionsInfoCard
                            key={item._id || Math.random().toString(36).substr(2, 9)}
                            title={item.incomeSource || item.source || 'Unknown Source'}
                            icon={item.icon || '💰'}
                            date={item.date ? moment(item.date).format('DD/MM/YYYY') : 'N/A'}
                            amount={item.amount || 0}
                            type={item.type || 'income'}
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No recent income transactions</p>
                )}
            </div>
        </div>
    );
};

export default RecentIncome;