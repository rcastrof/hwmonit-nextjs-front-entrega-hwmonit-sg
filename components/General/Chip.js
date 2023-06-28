import { useEffect, useState } from "react";
import {BsArrowRightShort, BsCheck, BsExclamation} from "react-icons/bs";
import {IoClose, IoGridOutline} from "react-icons/io5";
import { BiGridAlt } from "react-icons/bi";

const Chip = ( props ) => {

    const {name, selectedChip, status} = props;
    const [selected, setSelected] = useState("");
    
    useEffect(() => {
        if(selectedChip === 'true'){
            setSelected(" chip chip-selected");
        }else{
            setSelected(" chip");
        }
    
    }, []);

    const handleSelect = (event) => {
        let selected = document.getElementsByClassName("chip");

        for (let i = 0; i < selected.length; i++) {
            selected[i].className = selected[i].className.replace(" chip-selected", "");
        }
        event.currentTarget.className += " chip-selected";
      }

    const getIcon = () => {
        if(status === "0"){
            return(
                <div className="h-[24px] w-[24px] mx-[8px] bg-[#E00000] rounded-full">
                    <IoClose className=' h-[24px] w-[24px]  text-white' />
                </div>
            )
        }

        if(status === "1"){
            return(
                <div className="h-[24px] w-[24px]  mx-[8px] bg-[#9EC431] rounded-full">
                    <BsCheck className=' h-[24px] w-[24px]  text-white' />
                </div>
            )
        }

        if(status === "2"){
            return(  
                <div className="h-[24px] w-[24px] mx-[8px] bg-[#FF9900] rounded-full">
                    <BsExclamation className=' h-[24px] w-[24px] text-white' />
                </div>
            )
        }

        return(  
            <div className="h-[24px] w-[24px] mx-[8px] bg-[#2A8BEB] rounded-full">
                <BiGridAlt className=' h-[16px] w-[16px] ml-[3.5px] mt-[3.5px]  text-white' />
            </div>
        )

    }
    

   return(

    <div className= {`h-[40px] select-none border-1 bg-white/[15%] flex min-w-fit items-center rounded-[10px] ml-[8px] cursor-pointer ${selected}`} onClick={(event)=>handleSelect(event)}>
        {getIcon()}
        <div className='text-[16px] text-white mr-[16px] font-bold leading-[19px]'>{name}</div>
    </div>

   );
}

export default Chip;