import {API_PATH} from "./apipath";
import axiosInstance from "./axiosInstance";

export const uploadImage=async(imageFile)=>{
    const formData=new FormData();
    //append image file to form data
    formData.append("image",imageFile); 
    try{
        const response=await axiosInstance.post(API_PATH.IMAGE.UPLOAD_IMAGE,formData,{
            headers:{
                "Content-Type":"multipart/form-data",
            },
        });
        return response.data;
    }
    catch(error){
        console.log(error);
        return null;
    }
}
export default uploadImage;
