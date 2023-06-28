import {BsArrowRightShort, BsCheck, BsExclamation} from "react-icons/bs";
import {IoClose} from "react-icons/io5";
import { useRouter } from "next/router";
import {AiOutlineEye} from 'react-icons/ai'
import { checkSubmodule } from "../Permission/CheckSubmodules";
const CardModalGeneral = ( props ) => {
    const {title, subtitle, status, ide} = props;
    const {push} = useRouter();

    const getIcon = () => {
      if(status === 0){
        return(<div className="self-end h-[24px] w-[24px] mt-[18px] mr-[25px] bg-[#E00000] rounded-full">
        <IoClose className=' h-[24px] w-[24px] self-center  text-white' />
      </div>)
      }else if(status === 1){
        return(<div className="self-end h-[24px] w-[24px] mt-[18px] mr-[25px] bg-[#9EC431] rounded-full">
        <BsCheck className=' h-[24px] w-[24px]  text-white' />
      </div>)
      }else if(status === 2){
        return(  <div className="self-end h-[24px] w-[24px] mt-[18px] mr-[25px] bg-[#FF9900] rounded-full">
        <BsExclamation className=' h-[24px] w-[24px]  text-white' />
      </div>)
      }else{
        return(<div className="self-end h-[24px] w-[24px] mt-[18px] mr-[25px] bg-[#E00000] rounded-full">
        <IoClose className=' h-[24px] w-[24px]  text-white' />
      </div>)
      }
    
    }
    
    return(
        
        <div className='flex flex-col h-[164px] mx-[20px] m:mx-0 m:mr-[15px] m:w-[272px] bg-[#FFFF]/[.15] rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%]'>
        <div className='flex mb-[10px] flex-row justify-center'>
            <div className='flex-auto mt-[20px] ml-[20px] font-bold text-[#FAFAFA] text-[16px]]'>{title}</div>
            {getIcon()}
        </div>
        <hr className='bg-[#FFFFFF]/10 border-none h-[4px] mb-[8px]' />
        <div className='ml-[20px] text-[12px] text-[#FAFAFA] font-normal h-[40px] overflow-auto gt-scroll'>  
            {   typeof subtitle === "object" ? subtitle.map((desc) => {return <div className="mr-[4px]" > · {desc.description_error}</div>}) : <div> · {subtitle}</div>  }
        </div> 
        {checkSubmodule(props.submodules, "Ver Detalle Equipo") && ide!==null &&
          <div className='bg-[#EA683F] w-[156px] h-[34px] rounded-[10px] items-center justify-items-center mb- leading-[18px] tracking-[-2%] self-end text-[14px] mt-[12px] flex mr-[24px] cursor-pointer  text-[#FAFAFA]' onClick={() =>push(`/device_details/${ide}`) }>
              <AiOutlineEye className="mr-[5px] h-[16px] w-[16px] ml-[20px] " /> Ver dispositivo 
          </div> }
    </div>    
   );

}

export default CardModalGeneral;