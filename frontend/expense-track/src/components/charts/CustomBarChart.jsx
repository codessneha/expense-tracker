import React from 'react';
import { BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
 } from 'recharts';


const CustomBarChart=({data = []})=>{

const getBarColor=(index)=>{
    return index%2 === 0?"#87cf5":"#cfbefb";
};

const CustomTooltip=({active, payload, label})=>{
    if(active && payload && payload.length){
        return(
            <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                <p className="text-sx font-semibold text-purple-800 mb-1">{label}</p>
                <p className="text-sm text-gray-600">
                    Amount: <span className="text-sm font-medium text-gray-900">${payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
}

    if (!data || data.length === 0) {
      return (
        <div className="bg-white mt-6 p-4 rounded-lg shadow">
          <p className="text-center text-gray-500">No data available</p>
        </div>
      );
    }

    return(
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{fontSize:12, fill:"#555"}} 
                  stroke="#ddd"
                />
                <YAxis 
                  tick={{fontSize:12, fill:"#555"}} 
                  stroke="#ddd"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                <Legend/>
                <Bar 
                  dataKey="amount" 
                  fill="#4f46e5"
                  radius={[4,4,0,0]}
                  activeBar={{fill:'#4338ca'}}
                >
                {data.map((entry,index)=>(
                    <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(index)}
                    />
                ))}
                
                </Bar>
                
            </BarChart>
            </ResponsiveContainer>
            
        </div>
    )
}
export default CustomBarChart;