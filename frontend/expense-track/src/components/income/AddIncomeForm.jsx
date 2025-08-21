import React, { useState, useCallback } from 'react';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';
import Input from '../inputs/input';

// Format number as Indian Rupees
const formatCurrency = (value) => {
    if (!value) return '';
    // Remove all non-digit characters except decimal point
    const number = value.toString().replace(/[^\d.]/g, '');
    // If empty after cleanup, return empty string
    if (!number) return '';
    // Convert to number and format with commas as thousand separators
    return parseFloat(number).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        useGrouping: true
    });
};

const AddIncome = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: null,   // ✅ Changed from empty string to null
        icon: "💰"
    });

    const handleChange = (e) => {
        if (e && e.target) {
            const { name, value } = e.target;
            
            if (name === 'amount') {
                // Format the amount with thousand separators
                const formattedValue = formatCurrency(value);
                setIncome(prev => ({ ...prev, [name]: formattedValue }));
            } else {
                setIncome(prev => ({ ...prev, [name]: value }));
            }
        }
    };

    // Parse the formatted amount back to a number before submission
    const parseAmount = (formattedAmount) => {
        if (!formattedAmount) return 0;
        // Remove all non-digit characters except decimal point and convert to number
        const number = formattedAmount.toString().replace(/[^\d.]/g, '');
        // Convert to number and round to 2 decimal places to avoid floating point issues
        const amount = Math.round(parseFloat(number) * 100) / 100;
        return isNaN(amount) ? 0 : amount;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!income.source || !income.amount || !income.date) {
            alert('Please fill in all fields');
            return;
        }
        
        // Parse the formatted amount before submission
        const amount = parseAmount(income.amount);
        
        // Create a new date object to ensure proper date handling
        let formattedDate;
        if (income.date instanceof Date) {
            formattedDate = income.date.toISOString().split('T')[0];
        } else if (typeof income.date === 'string') {
            // If it's a string, try to parse it
            formattedDate = new Date(income.date).toISOString().split('T')[0];
        } else {
            // Default to today's date if invalid
            formattedDate = new Date().toISOString().split('T')[0];
        }
            
        // Create a new income object with only the necessary fields
        const newIncome = {
            source: income.source,
            amount: amount,
            date: formattedDate,
            icon: income.icon || '💰'
        };
        
        onAddIncome(newIncome);
        
        // Reset form after submission
        setIncome({
            source: "",
            amount: "",
            date: null,
            icon: "💰"
        });
    };

    const handleEmojiSelect = (emoji) => {
        setIncome(prev => ({ ...prev, icon: emoji }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <EmojiPickerPopup
                onEmojiClick={handleEmojiSelect}
                defaultEmoji={income.icon}
            />

            <Input
                name="source"
                value={income.source}
                onChange={handleChange}
                label="Income Source"
                placeholder="Freelance, Salary, etc."
                type="text"
            />

            <Input
                name="amount"
                value={income.amount}
                onChange={handleChange}
                label="Income Amount"
                placeholder="Enter Income Amount"
                type="text"
            />

            <Input
                name="date"
                value={income.date || ''}
                onChange={handleChange}
                label="Date"
                type="date"
            />

            <div className="flex gap-4 mt-6">
                <button
                    type="button"
                    onClick={() => setIncome({
                        source: "",
                        amount: "",
                        date: null,
                        icon: "💰"
                    })}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Clear
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Add Income
                </button>
            </div>
        </form>
    );
};

export default AddIncome;
