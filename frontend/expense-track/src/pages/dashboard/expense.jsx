import React from 'react';
import { useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { API_PATH } from '../../utils/apipath';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import ExpenseList from '../../components/expense/ExpenseList';
import AddExpenseForm from '../../components/expense/AddExpenseForm';
import moment from 'moment';
import CustomBarChart from '../../components/charts/CustomBarChart';
import ExpenseOverview from '../../components/expense/ExpenseOverview';
import { useUserContext } from '../../context/userContext';


const Expense = () => {
    useUserAuth();

    const[expenseData,setexpenseData]=useState(null);
    const[loading,setLoading]=useState(false);
    const[openDeleteAlert,setOpenDeleteAlert]=useState({
      show:false,
      data:null,
    })
    const[openAddExpenseModel,setOpenAddExpenseModel]=useState(false);

    //get all expense details
    const fetchExpenseDetails=async()=>{
      if(loading) return;
      setLoading(true);
      console.log('Fetching expense data...');
      try{
        const response=await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE);
        console.log('Expense data response:', response);
        if(response && response.data){
          console.log('Setting expense data:', response.data);
          setexpenseData(response.data);
        } else {
          console.warn('No data in response:', response);
          setexpenseData([]);
        }
      }catch(error){
        console.log(error);
        setError(error.message);
      }finally{
        setLoading(false);
      }
    }

    //handle add expense
    console.log('handleAddExpense function is defined');
    const handleAddExpense = async (expense) => {
        console.log('handleAddExpense called with:', expense);
        console.log('=== handleAddExpense called ===');
        console.log('Expense data:', JSON.stringify(expense, null, 2));
        
        const { category, amount, date, icon } = expense;
        
        // Validate required fields
        if (!category || !amount || !date || !icon) {
            const missingFields = [];
            if (!category) missingFields.push('category');
            if (!amount) missingFields.push('amount');
            if (!date) missingFields.push('date');
            if (!icon) missingFields.push('icon');
            
            console.error('❌ Missing required fields:', missingFields);
            toast.error(`Please fill in all fields. Missing: ${missingFields.join(', ')}`);
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            console.log('🔑 Token from localStorage:', token ? 'Token exists' : 'No token found');
            
            const requestData = {
                category,
                amount: parseFloat(amount),
                date: date, // Ensure date is in the correct format
                icon,
            };
            
            console.log('📤 Sending request to:', `${axiosInstance.defaults.baseURL}${API_PATH.EXPENSE.ADD_EXPENSE}`);
            console.log('📦 Request payload:', JSON.stringify(requestData, null, 2));
            console.log('🔑 Request headers:', {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            });
            
            const response = await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('✅ API Response:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            });
            
            if (response.data) {
                console.log('🔄 Refreshing data...');
                setOpenAddExpenseModel(false);
                
                try {
                    await Promise.all([
                        fetchExpenseDetails(),
                        window.dispatchEvent(new Event('dashboard-data-changed'))
                    ]);
                    console.log('✅ Data refreshed successfully');
                    toast.success("Expense added successfully!");
                } catch (refreshError) {
                    console.error('❌ Error refreshing data:', refreshError);
                    toast.error("Expense added but there was an error refreshing the data");
                }
            }
        } catch (error) {
            console.error('❌ Error adding expense:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                } : 'No response',
                config: error.config ? {
                    url: error.config.url,
                    method: error.config.method,
                    headers: error.config.headers,
                    data: error.config.data
                } : 'No config'
            });
            
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Failed to add expense";
            toast.error(errorMessage);
        }
    };

    //handle delete expense
    const deleteExpense=async(id)=>{
      try{
        const response=await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE,{
          data:{id},
        });
        if(response.data){
          fetchExpenseDetails();
        }
      }catch(error){
        console.log(error);
        toast.error(error.message);
      }
    };

    //handle download expense details
    const handleDownloadExpenseDetails=async()=>{
      try{
        const response=await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE,{
          responseType:"blob",
        });
        if(response.data){
          //create url for blob
          const url=window.URL.createObjectURL(new Blob([response.data]));
          const link=document.createElement("a");
          link.href=url;
          link.setAttribute("download","expense-details.csv");
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      }catch(error){
        console.log(error);
        toast.error(error.message);
      }
    }

    //useEffect
    useEffect(()=>{
      fetchExpenseDetails();
      return ()=>{};
    },[]);
  return (
   <DashboardLayout activeMenu="Expense">
    <div className="my-5 mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="">
          <ExpenseOverview
          transactions={expenseData}
          onExpenseIncome={()=>setOpenAddExpenseModel(true)}
          />
        </div>
      </div>

      <ExpenseList
      transactions={expenseData}
      onDelete={(id)=>setOpenDeleteAlert({show:true,data:{id}})}
      onDownload={handleDownloadExpenseDetails}
      />

      <Modal
      isOpen={openAddExpenseModel}
      onClose={()=>{
          console.log('Modal close button clicked');
          setOpenAddExpenseModel(false);
      }}
      title="Add Expense"
      >
      {console.log('Modal isOpen:', openAddExpenseModel)}
        <AddExpenseForm
        onAddExpense={handleAddExpense}
        />
      </Modal>

      <Modal
      isOpen={openDeleteAlert.show}
      onClose={()=>setOpenDeleteAlert({show:false,data:null})}
      title="Delete Expense"
      >
        <p>Are you sure you want to delete this expense?</p>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={()=>deleteExpense(openDeleteAlert.data.id)}
            className="add-btn add-btn-fill"
          >
            Delete
          </button>
        </div>
      </Modal>

      
    </div>
    
   </DashboardLayout>
  );
};

export default Expense;