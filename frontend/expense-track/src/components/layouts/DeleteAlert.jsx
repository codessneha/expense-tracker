import React from 'react';

const DeleteAlert=(
    {
        content,
        onDelete
    }
)=>{
    return(
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex items-center gap-4 mt-6">
                <button
                type="button"
                onClick={()=>onDelete()}
                className="add-btn add-btn-fill"
                >
                    Delete
                </button>
               
            </div>
        </div>
    )
}