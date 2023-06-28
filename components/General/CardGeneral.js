import {BsArrowRightShort, BsCheck, BsExclamation} from "react-icons/bs";
import {IoClose} from "react-icons/io5";
import ModalGeneral from "./ModalGeneral";
import { useState } from "react";
import {AiOutlineEye} from 'react-icons/ai'
import { RiDeviceLine } from 'react-icons/ri'
import axios from "axios";
import { useRouter } from "next/router";

const CardGeneral = ( props ) => {
    const {title, subtitle, count, status, ide} = props;
    const [showModal, setShowModal] = useState(false);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();
    const getDetails = async () => {
      setShowModal(true);
      setLoading(true);

      //Agregar Lógica para los Dispositivos
      const listDetails = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}branch_office/status/${ide}`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if (error.response.status === 401) {
                  push('/')
                }
                resolve(error);
            })
      });

      setDetails(listDetails);
      setLoading(false);

    }

    const getIcon = () => {
      if(status === 0){
        return(<div className="self-end h-[24px] w-[24px] mt-[22px] mr-[25px] bg-[#E00000] rounded-full">
        <IoClose className=' h-[24px] w-[24px] self-center  text-white' />
      </div>)
      }else if(status === 1){
        return(<div className="self-end h-[24px] w-[24px] mt-[22px] mr-[25px] bg-[#9EC431] rounded-full">
        <BsCheck className=' h-[24px] w-[24px]  text-white' />
      </div>)
      }else if(status === 2){
        return(  <div className="self-end h-[24px] w-[24px] mt-[22px] mr-[25px] bg-[#FF9900] rounded-full">
        <BsExclamation className=' h-[24px] w-[24px]  text-white' />
      </div>)
      }else{
        return(<div className="self-end h-[24px] w-[24px] mt-[22px] mr-[25px] bg-[#E00000] rounded-full">
        <IoClose className=' h-[24px] w-[24px]  text-white' />
      </div>)
      }
    
    }

    return(
        <div className='flex flex-col h-[173px] mx-[24px] m:mx-0 m:mr-[15px] m:w-[327px] bg-white/[15%] rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%] text-white'>
              <div className='flex'>
                <div className='flex-auto mt-[24px] ml-[24px] font-bold text-[18px]'>{title}</div>
                {getIcon()}
            </div>
            
            <div className='mt-[4px] ml-[24px] text-[14px]'>{subtitle}</div> 
            <hr className='bg-[#FFFFFF]/10 border-none h-[4px] mt-[12px] mb-[12px]' />
            <div className="flex items-center ml-[24px] text-[14px] "> <RiDeviceLine className="mr-[5.3px] h-[13.3px]"/>  {count} {count===1 ? "dispositivo" : "dispositivos"}</div>
            <div className='bg-[#EA683F] w-[131px] h-[34px] rounded-[10px] items-center justify-items-center mb- leading-[18px] tracking-[-2%] self-end text-[14px] mt-[12px] flex mr-[24px] cursor-pointer  text-[#FAFAFA]'
                onClick={() => getDetails()}    ><AiOutlineEye className="mr-[5px] h-[16px] w-[16px] ml-[20px] " /> Ver detalle </div> 
            <ModalGeneral show={showModal} details={details} loading={loading} title={title} onClose={() =>  setShowModal(false)} submodules={props.submodules}/>
        </div>
   );

}

export default CardGeneral;