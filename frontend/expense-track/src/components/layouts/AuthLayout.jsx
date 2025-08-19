import React from 'react';
import { LuTrendingUp } from 'react-icons/lu';
import card1 from '../../assets/card1.avif';

const StatsInfoCard = ({ icon, label, color, value }) => (
  <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
    <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
      {icon}
    </div>
    <div>
      <h6 className="text-sm font-medium text-gray-700">{label}</h6>
      <p className="text-xs text-slate-700 mt-1">Track and manage your finances</p>
      <p className="text-xs text-slate-700 mt-1">{value}</p>
    </div>
  </div>
);

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Left side - 50% */}
      <div className="w-1/2 px-6 sm:px-12 pt-8 pb-12 overflow-y-auto">
        <h2 className="text-lg font-medium text-black mb-8">Expense Tracker</h2>
        {children}
      </div>

      {/* Right side - 50% */}
      <div className="w-1/2 bg-violet-50 relative p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute w-48 h-48 rounded-[40px] bg-purple-600 -top-7 -left-5 z-0"></div>
        <div className="absolute w-48 h-48 rounded-[40px] border-[20px] border-fuchsia-600 top-[30%] right-[10%] z-0"></div>
        <div className="absolute w-48 h-48 rounded-[40px] bg-violet-600 -bottom-7 left-5 z-0"></div>

        {/* Card */}
        <div className="grid grid-cols-1 relative z-10">
          <StatsInfoCard
            icon={<LuTrendingUp />}
            label="Track Your Income And Expenses"
            color="bg-primary"
            value="₹430,000"
          />
        </div>

        {/* Image */}
        <img 
          src={card1} 
          alt="Financial tracking"
          className="w-64 lg:w-[90%] absolute bottom-10 right-8 shadow-lg shadow-blue-400/15 z-10"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
