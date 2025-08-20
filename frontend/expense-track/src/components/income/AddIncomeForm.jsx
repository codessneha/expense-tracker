import { Input } from 'postcss';
import React from 'react';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';
import { useState } from 'react';
import Input from '../inputs/input';


const AddIncome=({onAddIncome})=>{
    const[income,setIncome]=useState({
        source:"",
        amount:"",
        date:"",
        source:"",
    });
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setIncome({...income,[name]:value});
    };
    return(
        <div>

            <EmojiPickerPopup
            icon={income.icon}
            onSelect={(selectedIcon)=>handleChange("icon",selectedicon)}
            
            />
            <Input
            value={income.source}
            onChange={({target})=>handleChange("source",target.value)}
        label="Income Source"
            placeholder="freelance, salary, etc"
            type="text"
            />

            <Input
            value={income.amount}
            onChange={({target})=>handleChange("amount",target.value)}
        label="Income Amount"
            placeholder="Enter Income Amount"
            type="number"
            />

            <Input
            value={income.date}
            onChange={({target})=>handleChange("date",target.value)}
        label="Income Date"
            placeholder="Enter Income Date"
            type="date"
            />

            <div className="flex justify-end mt-6">
                <button 
                type="button" 
                onClick={()=>onAddIncome(income)}
                className="add-btn add-btn-fill">Add Income</button>
            </div>






        </div>
    )
}
export default AddIncome;
