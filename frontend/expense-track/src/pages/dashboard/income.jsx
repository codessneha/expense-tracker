import react from 'react';
import { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/income/IncomeOverview';
import { API_PATH } from '../../utils/apipath';
import axiosInstance from '../../utils/axiosInstance';
import { PiFileRsThin } from 'react-icons/pi';
import { MdOutlineAlarmAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import IncomeList from '../../components/income/IncomeList';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/income/AddIncomeForm';
import moment from 'moment';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useUserContext } from '../../context/userContext';



const Income=()=>{
    const [incomeData, setIncomeData] = useState([]);
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
            const response=await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);
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
        const {source,amount,date,icon}=income;
        if(!source || !amount || !date || !icon){
            toast.error("All fields are required");
            return;
        }
        try{
            const response=await axiosInstance.post(API_PATH.INCOME.ADD_INCOME,{
                source,
                amount,
                date,
                icon,
            });
            if(response.data){
                setOpenAddIncomeModel(false);
                // Refresh both income list and dashboard data
                await Promise.all([
                    fetchIncomeDetails(),
                    // Trigger dashboard data refresh by sending a custom event
                    window.dispatchEvent(new Event('dashboard-data-changed'))
                ]);
                toast.success("Income added successfully!");
            }
        }catch(error){
            console.error('Error adding income:', error);
            toast.error(error.response?.data?.message || error.message || "Failed to add income");
        }
    };

    //handle delete income
    const deleteIncome=async(id)=>{
        try{
            const response=await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME,{
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
    const handleDownloadIncomeDetails=async ()=>{
        try{
            const response=await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME,{
                responseType:"blob",
            });
            if(response.data){
                //create url for blob
                const url=window.URL.createObjectURL(new Blob([response.data]));
                const link=document.createElement("a");
                link.href=url;
                link.setAttribute("download","income-details.csv");
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }catch(error){
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(()=>{
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