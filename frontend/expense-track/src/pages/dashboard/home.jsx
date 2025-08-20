import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATH } from '../../utils/apipath';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../../components/cards/infoCards';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import axiosInstance from '../../utils/axiosInstance';
import { addThousandsSeperator } from '../../utils/helper';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
const Home=()=>{
    useUserAuth();
    const navigate=useNavigate();

    const [dashboardData, setDashboardData]=useState(null);
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState(null);

    const fetchDashboardData=async()=>{
        if(loading) return;
        setLoading(true);
        try{
            const response=await axiosInstance.get(API_PATH.DASHBOARD.GET_DATA);
            if(response.data){
                setDashboardData(response.data);
            }
        }catch(error){
            console.log(error);
            setError(error.message);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchDashboardData();
        return ()=> {};
    },[]);

    return(
    <DashboardLayout activeMenu="Dashboard">
    <div>
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard
                icon={<IoMdCard/>}
                label="Total Balance"
                value={addThousandsSeperator(dashboardData?.totalBalance)}
                color="bg-primary"
                />
                <InfoCard
                icon={<LuWalletMinimal/>}
                label="Total Income"
                value={addThousandsSeperator(dashboardData?.totalIncome)}
                color="bg-orange-500"
                />
                <InfoCard
                icon={<LuHandCoins/>}
                label="Total Expense"
                value={addThousandsSeperator(dashboardData?.totalExpense)}
                color="bg-red-500"
                />


            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={()=> navigate("/expense")}
            />

            <FinanceOverview
            totalBalance={dashboardData?.totalBalance||0}
            totalIncome={dashboardData?.totalIncome||0}
            totalExpense={dashboardData?.totalExpense||0}
            />




            
            </div>
            
        </div>

    </DashboardLayout>
    )
}
export default Home;