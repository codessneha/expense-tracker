import react from 'react';
import { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Dashboard/IncomeOverview';
import { API_PATHS } from '../../utils/apipath';
import axiosInstance from '../../utils/axiosInstance';
import { PiFileRsThin } from 'react-icons/pi';
import { MdOutlineAlarmAdd } from 'react-icons/md';
const Income=()=>{
    const [incomeData,setIncomeData]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);
    const [openDeleteAlert,setOpenDeleteAlert]=useState({
        show:false,
        data:null,
    });
    const [openAddIncomeModel,setOpenAddIncomeModel]=useState(false);

    //get all income details
    const fetchIncomeDetails=async()=>{
        if(loading) return;
        setLoading(true);
        try{
            const response=await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
            if(response.data){
                setIncomeData(response.data);
            }
        }catch(error){
            console.log(error);
            setError(error.message);
        }finally{
            setLoading(false);
        }
    }

    //handle add income
    const handleAddIncome=async(income)=>{
        const {source,aount,date,icon}=income;
        if(!source || !aount || !date || !icon){
            toast.error("All fields are required");
            return;
        }
        try{
            const response=await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,{
                source,
                amount,
                date,
                icon,
            });
            if(response.data){
                setOpenAddIncomeModel(false);
                fetchIncomeDetails();
            }
        }catch(error){
            console.log(error);
            toast.error(error.message);
        }
    };

    //handle delete income
    const deleteIncome=async(id)=>{
        try{
            const response=await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME,{
                data:{id},
            });
            if(response.data){
                fetchIncomeDetails();
            }
        }catch(error){
            console.log(error);
            toast.error(error.message);
        }
    };

    //handle download income details
    const handleDownloadIncomeDetails=async ()=>{};

    UseEffect(()=>{
        fetchIncomeDetails();
        return ()=>{};
    },[]);




    return(
    <div>
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <IncomeOverview
                        transactions={incomeData}
                        onAddIncome={()=>setOpenAddIncomeModel(true)}
                        />

                    </div>
                    
                </div>

            <IncomeList
            transactions={incomeData}
            onDelete={(id)=>{
                setOpenDeleteAlert({
                    show:true,
                    data:{id},
                })
            }}
            onDownload={handleDownloadIncomeDetails}
            />


                <Modal
                isOpen={openAddIncomeModel}
                onClose={()=>setOpenAddIncomeModel(false)}
                title="Add Income"
                >
                    <AddIncomeForm
                    onAddIncome={handleAddIncome}
                    
                    />
                </Modal>


                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={()=>setOpenDeleteAlert({show:false,data:null})}
                    title="Delete Income">
                        <p>Are you sure you want to delete this income?</p>
                        <div className="flex items-center gap-4 mt-6">
                            <button
                            type="button"
                            onClick={()=>setOpenDeleteAlert({show:false,data:null})}
                            className="add-btn add-btn-fill"
                            >
                                Cancel
                            </button>
                            <button
                            type="button"
                            onClick={()=>deleteIncome(openDeleteAlert.data.id)}
                            className="add-btn add-btn-fill"
                            >
                                Delete
                            </button>
                        </div>
                </Modal>
                
            </div>
        
        </DashboardLayout>
    </div>
    )
}
export default Income;