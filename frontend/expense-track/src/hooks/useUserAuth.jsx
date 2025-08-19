import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apipath";

export const useUserAuth=()=>{
    const {user,updateUser,clearUser}=useContext(UserContext);
    const navigate=useNavigate();

    useEffect(()=>{
        if(user) return;
        let isMounted=true;
        const fetchUser=async()=>{
            try{
                const response=await axiosInstance.get(API_PATH.AUTH.GET_USER);
                
                if(isMounted && response.data){
                    updateUser(response.data);
                }
            }catch(error){
                console.log(error);
                if(isMounted){
                    clearUser();
                    navigate('/login');
                }
            }
        }
        fetchUser();
        return()=>{
            isMounted=false;
        }
    },[updateUser, clearUser, navigate])
}