import React, {useEffect} from "react";
import { RiCloseFill } from 'react-icons/ri'
import {BsArrowRightShort, BsCheck, BsExclamation} from "react-icons/bs";
import {IoClose} from "react-icons/io5";
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import { useRouter } from "next/router";
export default function PopUpComponent(props){
    const {push} = useRouter();

      const getIcon = (status) => {
        if(status === 0){
          return(<div className=" h-[17px] w-[17px] mx-[8px] bg-[#E00000] rounded-full">
          <IoClose className=' h-[17px] w-[17px] self-center  text-white' />
        </div>)
        }else if(status === 1){
          return(<div className=" h-[17px] w-[17px] mx-[8px] bg-[#9EC431] rounded-full">
          <BsCheck className=' h-[17px] w-[17px]  text-white' />
        </div>)
        }else if(status === 2){
          return(  <div className=" h-[17px] w-[17px] mx-[8px] bg-[#FF9900] rounded-full">
          <BsExclamation className=' h-[17px] w-[17px]  text-white' />
        </div>)
        }else{
          return(<div className=" h-[17px] w-[17px] mx-[8px] bg-[#E00000] rounded-full">
          <IoClose className=' h-[17px] w-[17px]  text-white' />
        </div>)
        }
      
      }

    return(
        <>
        <div class="border-solid border-b-white/30 backdrop-blur-sm border-b-8 border-x-transparent border-x-8 border-t-0 mt-[4px] ml-[8px] shadow-sm"></div>
        <div className='w-[237px] h-[162px] ml-[-136px] rounded-2xl bg-white/30 backdrop-blur-sm  flex flex-col shadow-lg'>
            <div className="flex flex-row justify-between flex-wrap ">
                <div className="ml-[16px] mt-[14px] mb-[12px] text-[16px] font-semibold tracking-[-5%] leading-[16px] flex-wrap">{props.branch.branch_name} </div>
                
                <div className="flex self-center w-[20px] h-[20px] rounded-full justify-center items-center bg-[#DEDDDB] cursor-pointer mr-[16px]" onClick={() => props.handlePinInfo(null)}>
                    <RiCloseFill className='flex w-[16px] h-[16px] font-bold text-[#626262]' aria-hidden="true" />
                </div>
               
            </div>
            
            <hr className='bg-[#F0F0F0] border-[1px] border-solid h-[1px] mb-[12px]' />
            <div className="flex flex-col ml-[12px] mr-[12px] pr-[4px] overflow-y-auto gt-scroll">
            {props.branch.deviceStatus && props.branch.deviceStatus.length!==0 ? props.branch.deviceStatus.map((device)=>
                <div className="bg-[#EDEDED]/70  rounded-lg hover:underline flex self-center mb-[8px] w-[205px] p-[8px]  justify-between cursor-pointer" onClick={() =>{device.deviceId ? push(`/device_details/${device.deviceId}`) : null }}>
                    

                      <div className="text-[14px] tracking-[-5%] leading-[16px]  font-normal ">{device.label}</div>

                      {<div className="flex justify-end">
                        <div className="flex ">{getIcon(device.status_general)}</div>
                        {device.deviceId ? <FaChevronRight className=' h-[16px] w-[16px]  ml-[8px] text-black justify-end' />  : <div className="h-[16px] w-[16px]  ml-[8px]"/>}
                      </div>}
                      
                   
                    
                </div>
                

            )
                :
                <div className="flex text-[14px] justify-center self-center tracking-[-5%] leading-[16px] font-normal ">Sucursal sin dispositivos ☹️</div>
            }
            </div>
            


        </div>
        </>
    )

}