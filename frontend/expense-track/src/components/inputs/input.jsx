import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, type, placeholder, label, required = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className={`relative rounded-md shadow-sm ${isFocused ? 'ring-2 ring-violet-500' : ''}`}>
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className={`
                        block w-full rounded-md border-gray-300 
                        shadow-sm focus:border-violet-500 focus:ring-violet-500 
                        sm:text-sm py-2.5 px-3.5 border 
                        ${type === 'password' ? 'pr-10' : ''}
                    `}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                />
                {type === 'password' && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={toggleShowPassword}
                            tabIndex="-1"
                        >
                            {showPassword ? (
                                <FaRegEyeSlash className="h-5 w-5" />
                            ) : (
                                <FaRegEye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;