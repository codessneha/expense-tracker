import React from 'react';
const InfoCard=({
    icon,
    label,
    value,
    color
})=>{
    return(
        <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
          <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
            {icon}
          </div>  
          <div>
            <h6 className="text-sm font-medium text-gray-700">{label}</h6>
            <p className="text-xs text-slate-700 mt-1">{value}</p>
          </div>
        </div>
    )
}
export default InfoCard;
