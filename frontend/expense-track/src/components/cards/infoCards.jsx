import React from 'react';

const formatCurrency = (value) => {
    try {
        if (value === null || value === undefined || value === '') return '₹0';
        
        // Convert to number and handle very large numbers
        const number = Number(value);
        if (isNaN(number)) return '₹0';
        
        // Format as Indian Rupees with 2 decimal places
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(number);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return '₹0';
    }
};

const InfoCard=({
    icon,
    label,
    value,
    color
})=>{
    // Format the value as currency if it's a number
    const displayValue = typeof value === 'number' || !isNaN(Number(value)) 
        ? formatCurrency(value)
        : value;

    return(
        <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
          <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
            {icon}
          </div>  
          <div className="overflow-hidden">
            <h6 className="text-sm font-medium text-gray-700">{label}</h6>
            <p className="text-lg font-semibold text-slate-800 mt-1 truncate">
                {displayValue}
            </p>
          </div>
        </div>
    )
}

export default InfoCard;
