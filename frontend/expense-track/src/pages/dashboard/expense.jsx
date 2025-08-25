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
    const handleAddExpense = async (expense) => {
        console.log('handleAddExpense called with:', expense);
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
            const requestData = {
                category,
                amount: parseFloat(amount),
                date: date,
                icon,
            };
            
            const response = await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('✅ API Response:', response.data);
            
            // Close the modal and refresh the expense list
            setOpenAddExpenseModel(false);
            
            // Refresh expense list and trigger dashboard update
            await fetchExpenseDetails();
            
            // Dispatch event to refresh dashboard data
            window.dispatchEvent(new Event('dashboard-data-changed'));
            
            toast.success('Expense added successfully!');
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
    const deleteExpense = async (id) => {
      if (!id) {
        console.error('No ID provided for deletion');
        toast.error('Error: No expense ID provided');
        return;
      }
      
      try {
        console.log('Attempting to delete expense with ID:', id);
        
        // Get the URL with the ID properly interpolated
        const deleteUrl = API_PATH.EXPENSE.DELETE_EXPENSE(id);
        console.log('Delete URL:', deleteUrl);
        
        // Using PUT instead of DELETE to match the backend route
        const response = await axiosInstance.put(deleteUrl);
        
        console.log('Delete response:', response);
        
        if (response.data && response.data.success) {
          toast.success('Expense deleted successfully');
          fetchExpenseDetails();
        } else {
          throw new Error(response.data?.message || 'Failed to delete expense');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to delete expense';
        toast.error(errorMessage);
      } finally {
        setOpenDeleteAlert({ show: false, data: null });
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
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title="Delete Expense"
      >
        <p>Are you sure you want to delete this expense?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => setOpenDeleteAlert({ show: false, data: null })}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteExpense(openDeleteAlert.data?.id)}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
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