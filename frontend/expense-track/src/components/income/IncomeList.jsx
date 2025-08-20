import React from 'react';
import TransactionsInfoCard from '../Dashboard/TransactionsInfoCard';
import moment from 'moment';
import { LuDownload } from 'react-icons/lu';    

const IncomeList=({
    transactions,
    onDelete,
    onDownload,
})=>{
    return(
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income Sources</h5>
            
            <button className="card-btn" onClick={onDownload}>
                <LuDownload className="text-base"/>
                Download 
            </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions?.map((income)=>(
                    <TransactionsInfoCard
                    key={income._id}
                    title={income.source}
                    icon={income.icon}
                    date={moment(income.date).format('DD/MM/YYYY')}
                    amount={item.amount}
                    type="income"
                    onDelete={()=>onDelete(income._id)}
                    />

                ))}
            </div>


        </div>
    )
}