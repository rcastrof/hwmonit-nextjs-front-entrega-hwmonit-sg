import {RiUserSettingsLine, RiRoadMapLine, RiDeviceLine, RiStoreLine, RiComputerLine, RiCheckFill} from "react-icons/ri";
import { useRouter } from "next/router";
import {GoGraph} from 'react-icons/go';
import { BsGear } from 'react-icons/bs'
import { BiExport, BiStats } from "react-icons/bi";
import { HiOutlineDocumentReport, HiOutlineKey } from "react-icons/hi";


const CardSetting = ( props ) => {
    const {title, detail, icon, path} = props;
    const {push} = useRouter();
    
       const getIcon = () => {
      if(icon === "perfil"){
        return(
          <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
          <RiUserSettingsLine className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
        </div>)

      }else if(icon === "permiso"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <HiOutlineKey className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)

      }else if(icon === "zona"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <RiRoadMapLine className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)

      }else if(icon === "tipo dispositivo"){
        return(   <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <RiDeviceLine className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)

      }else if(icon === "sucursal"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <RiStoreLine className=' h-[44px] w-[44px] text-[#FAFAFA] ml-[14px] mt-[14px]' />
      </div>)

      }else if(icon === "dispositivo"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <RiComputerLine className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)

      }else if(icon === "estadistica"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <GoGraph className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)

      }else if(icon === "monitor"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <BsGear className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)
      }else if(icon === "export"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <BiExport className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)
      }else if(icon === "metrics"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <BiStats className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
        </div>
        )
      }else if(icon === "report"){
        return(
        <div className="h-[74px] w-[74px] ml-[24px] mt-[20px] bg-[#EA683F] rounded-full">
        <HiOutlineDocumentReport className=' h-[44px] w-[44px]  text-hw-white ml-[14px] mt-[14px]' />
      </div>)
      }
      
    }

    const navigate = (url) => {
      push(url);
   }

    return(
        <div className='flex flex-col h-[242px] mx-[24px] m:mx-0 m:mr-[15px] m:w-[327px] bg-[#D6E1E7]/25 rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%] cursor-pointer' onClick={()=>{navigate(path)}}>
              <div className='flex flex-col'>
              
                {getIcon()}
              
                <div className='mt-[12px] ml-[24px] font-bold text-[20px] text-[#FAFAFA]'>{title}</div>
              </div>
            <div className='mt-[12px] mx-[24px] text-[12px] text-[#FAFAFA]'>{detail}</div> 
        </div>
   );

}

export default CardSetting;