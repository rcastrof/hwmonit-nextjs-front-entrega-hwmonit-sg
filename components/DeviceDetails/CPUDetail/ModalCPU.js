import { Fragment, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { BsCpuFill } from 'react-icons/bs'
import { Dialog, Transition} from '@headlessui/react'


const ModalCPU = ( props ) =>  {

    const { show, onClose, details} = props;
    const cancelButtonRef = useRef(null);
    let i = 0;
    const getChip = (status) =>{
        if(status===0){
            return(<div className="h-[18px] w-[18px]  bg-hw-alert rounded-full ml-[8px] ">
            </div>)
        }
        if(status===1){
            return(<div className="h-[18px] w-[18px]  bg-hw-ok rounded-full ml-[8px]  self ">

            </div>)
        }
        if(status===2){
            return(
                <div className="h-[18px] w-[18px]  bg-hw-warning rounded-full ml-[8px] ">
  
                </div>
            )
        }
    }
    return (
       
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => onClose()} >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center content-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black/30  backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 "
                        enterTo="opacity-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 "
                        leaveTo="opacity-0 translate-y-4 "
                    >
                        <div className="inline-block w-[327px] h-[615px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[1rem] xl:my-[10rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() => onClose()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <BsCpuFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                        Información CPU
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px] text-[14px] ' />
                            
                            <div className="h-[450px] overflow-y-auto gt-scroll">
                                <div className='text-[14px] leading-[18px] tracking-[-2%]  '>

                                    <div className= 'h-[43px] select-none  bg-white/[0.15] flex max-w-fit items-center  rounded-[30px] ml-[24px] mb-[8px]'>
                                        <div className='mr-[3px] text-white/90 ml-[16px] '>Physical cores: </div>
                                        <div className='text-white font-semibold mr-[16px]'>{details.n_physical_core}</div>
                                    </div>

                                    <div className= 'h-[43px] select-none bg-white/[0.15] flex max-w-fit items-center rounded-[30px] ml-[24px] mb-[8px]'>
                                        <div className='mr-[3px] ml-[16px] text-white/90 '>Total cores: </div>
                                        <div className='text-white font-semibold mr-[16px]'>{details.total_core}</div>
                                    </div>

                                    <div className= 'h-[43px] select-none bg-white/[0.15] flex max-w-fit items-center rounded-[30px] ml-[24px] mb-[8px]'>
                                        <div className='mr-[3px] ml-[16px] text-white/90 '>Máx. Frecuencia: </div>
                                        <div className='text-white font-semibold mr-[16px]'>{details.max_frequency}</div>
                                    </div>

                                    <div className= 'h-[43px] select-none bg-white/[0.15] flex max-w-fit items-center rounded-[30px] ml-[24px] mb-[8px]'>
                                        <div className='mr-[3px] ml-[16px] text-white/90 '>Mín. Frecuencia: </div>
                                        <div className='text-white font-semibold mr-[16px]'>{details.min_frequency}</div>
                                    </div>

                                    <div className= 'h-[43px] select-none bg-white/[0.15] flex max-w-fit items-center rounded-[30px] ml-[24px] mb-[4px]'>
                                        <div className='mr-[3px] ml-[16px] text-white/90 '>Frecuencia Actual: </div>
                                        <div className='text-white font-semibold mr-[16px]'>{details.current_frequency}</div>
                                    </div>

                                    <div className= 'h-[43px] select-none  flex max-w-fit items-center rounded-[30px] ml-[24px] mb-[4px]'>
                                        <div className='mr-[3px] ml-[16px] text-white/90 font-semibold'>Uso Total: </div>
                                        <div className='flex text-white font-semibold mr-[16px]'>{details.total_cpu_usage}% {getChip(details.status)}</div>
                                    </div>
                        
                                </div>
                                
                                <hr className='bg-white/10 border-none h-[8px] mb-[20px]' />

                                <div className='bg-white/[0.15] rounded-[15px] mx-[24px] pl-[16px] pb-[16px] flex flex-col'>
                                    <div className='text-white font-bold text-[16px] leading-[18px] tracking-[-2%] mb-[16px] pt-[16px]'>
                                        Core usage
                                    </div>
                               
                                    <div className='flex flex-wrap flex-row'>
                                        {details.cpu_usage !== null &&

                                            details.cpu_usage.map((cpu) => {
                                                i++
                                                return(
                                                    <div className='bg-white/[0.15] w-[115px] h-[73px] rounded-[16px] mb-[8px] flex flex-col items-center leading-[18px] tracking-[-2%] mr-[8px]'>
                                                        <div className=' mt-[16px] text-white text-[14px] font-bold mb-[5px]'>Core {i}</div>
                                                        <div className='text-[20px] text-hw-white/80 font-semibold '>{cpu}%</div>
                                                    </div>
                                                )
                                            })
                                            
                                        }
                                    
                                    
                                    </div>
                                   
                                </div>

                                {/*Contenido*/}
                                {/*details !== null && 
                                    details.partition.map((detail) =>{
                                        return(
                                            <div> Core 1</div>
                                        )
                                    })
                                */}
                               
                            </div>

                            

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalCPU;