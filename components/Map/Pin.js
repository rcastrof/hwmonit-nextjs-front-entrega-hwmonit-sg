import React from "react";

export default function PinComponent(props){

    return(    
    <div className="mt-[-32px]">
        {
            props.status===1 ?  <img src='/pin_ok.svg' className='w-[32px] h-[32px]' /> :  props.status===2 ? <img src='/pin_warning.svg' className='w-[32px] h-[32px]'/> : 
            props.status===0 ? <img src='/pin_alert.svg' className='w-[32px] h-[32px]' onClick={()=>props.handlePinInfo(props.branch)}/> : null
        }

    </div>
    )
};