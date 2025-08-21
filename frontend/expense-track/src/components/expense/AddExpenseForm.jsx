import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Input from '../inputs/input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "💰", // Default icon
    });

    const handleChange = (e) => {
        if (e && e.target) {
            const { name, value } = e.target;
            setExpense(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEmojiSelect = (emoji) => {
        setExpense(prev => ({ ...prev, icon: emoji }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('=== Form submitted ===');
        console.log('Form data:', JSON.stringify(expense, null, 2));
        
        // Validate required fields
        if (!expense.category || !expense.amount || !expense.date) {
            const missingFields = [];
            if (!expense.category) missingFields.push('category');
            if (!expense.amount) missingFields.push('amount');
            if (!expense.date) missingFields.push('date');
            
            console.error('❌ Missing required fields:', missingFields);
            toast.error(`Please fill in all fields. Missing: ${missingFields.join(', ')}`);
            return;
        }
        
        try {
            console.log('✅ Valid form data, calling onAddExpense...');
            onAddExpense(expense);
            
            // Reset form only if onAddExpense doesn't throw an error
            setExpense({
                category: "",
                amount: "",
                date: "",
                icon: "💰",
            });
            
        } catch (error) {
            console.error('❌ Error in handleSubmit:', error);
            toast.error(error.message || 'Failed to process expense');
        }
    };

    // Debug log when component renders
    console.log('AddExpenseForm rendered with props:', { onAddExpense: typeof onAddExpense });

    return (
        <form onSubmit={(e) => {
            console.log('Form submitted');
            handleSubmit(e);
        }}>
            <EmojiPickerPopup
                defaultEmoji={expense.icon}
                onEmojiClick={handleEmojiSelect}
            />
            <Input
                name="category"
                value={expense.category}
                onChange={handleChange}
                label="Expense Category"
                placeholder="Enter Expense Category"
                type="text"
            />

            <Input
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                label="Expense Amount"
                placeholder="Enter Expense Amount"
                type="number"
                min="0"
                step="0.01"
            />

            <Input
                name="date"
                value={expense.date}
                onChange={handleChange}
                label="Date"
                placeholder="Select Date"
                type="date"
            />
            
            <div className="flex items-center justify-center gap-4 mt-5">
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setExpense({ category: "", amount: "", date: "", icon: "💰" })}
                >
                    Clear
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                    disabled={!expense.category || !expense.amount || !expense.date}
                >
                    Add Expense
                </button>
            </div>
        </form>
    );
};

export default AddExpenseForm;
