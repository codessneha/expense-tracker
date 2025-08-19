import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import {LuUser,LuUpload,LuTrash} from 'react-icons/lu';


const ProfilePictureSelector=({image,setImage})=>{
    const inputRef=useRef(null);
    const[previewUrl,setPreviewUrl]=useState(image);

    const handleImageChange=(event)=>{
        const file=event.target.files[0];
        if(file){
            //update image status
            setImage(file);
            //generate preview
            const preview=URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage=()=>{
        setImage(null);
        setPreviewUrl(null);
    };

    const onChooseFile=()=>{
        inputRef.current.click();
    };
    return(
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />
            {(!image ?(
                <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
                    <LuUser className="text-4xl text-primary"/>

                    <button
                        type="button"
                        onClick={onChooseFile}
                        className="w-8 h-8 items-center flex justify-center bg-purple-600 text-white rounded-full absolute -bottom-1 -right-1"
                    >
                        <LuUpload className="text-xl"/>
                    </button>
                </div>
            ):(
                <div className="w-20 h-20 flex items-center justify-center bg-primary rounded-full relative">
                    <img 
                    src={previewUrl} 
                    alt="Profile"
                    className="rounded-full w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-8 h-8 items-center flex justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
                    >
                        <LuTrash/>
                    </button>
                </div>
            ))}
        </div>
    );
};
export default ProfilePictureSelector;
