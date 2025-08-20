import React from 'react';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import {LuImage,
     LuX} from 'react-icons/lu';

const EmojiPickerPopup=()=>{
    const [isOpen,setisOpen]=useState(false);
    return(
        <div className="flex -col md:flex-row items-start gap-5 mb-6">
            <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={()=>setisOpen(true)}
            >
                <div
                className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg">
                    {icon?(
                        <img src={icon} alt="icon" className="w-12 h-12"/>
                    ):(
                        <LuImage/>
                    )}
                </div>

        <p className="">{icon?"change Icon":"pick icon"}</p>
            </div>
           
           {isOpen &&(
            <div className="relative">
                <button className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
                onClick={()=>setisOpen(false)}
                >
                    <LuX/>
                </button>
                <EmojiPicker
                open={isOpen}
                onEmojiClick={(emoji)=>onSelect(emoji?.imageUrl||"")}
                />
                </div>

           )}
           </div>
           
    )
}