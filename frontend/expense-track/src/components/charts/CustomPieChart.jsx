import React from 'react';
import CustomLegend from './CustomLengend';
import CustomTooltip from './CustomTooltio';
import { PieChart,
    Pie,
    Cell,Tooltip,ResponsiveContainer,Legend
 } from 'react-chartjs-2';

const CustomPieChart=({
    data,
    label,
    totalAmount,
    colours,
    showTextAnchor
})=>{
    return <ResponsiveContainer width="100%" height="380">
    <PieChart>
        <Pie
        data={data}
        dataKey="amount"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={130}
        innerRadius={100}
        labelLine={false}
        >
        {data.map((entry, index)=>(
            <Cell
            key={`cell-${index}`}
            fill={colours[index%colours.length]}
            />
        ) )}
    </Pie>
    <Tooltip content={<CustomTooltip/>}/>
    <Legend content={<CustomLegend/>}/>

    {showTextAnchor && (
        <>
    <text
    x="50%"
    y="50%"
    dy={-25}
    textAnchor="middle"
    dominantBaseline="middle"
    fontSize="14px"
    fill="#666"
    >
    {label}
    </text>
    <text
    x="50%"
    y="50%"
    dy={8}
    textAnchor="middle"
    dominantBaseline="middle"
    fontSize="24px"
    fill="#333"
    fontWeight="semi-bold"
    >
    {totalAmount}
    </text>
    </>
    )}
    </PieChart>
    </ResponsiveContainer>
    
}
export default CustomPieChart;
