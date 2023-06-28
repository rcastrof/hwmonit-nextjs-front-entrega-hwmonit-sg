import { Fragment, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { Dialog, Transition} from '@headlessui/react'
import { BsCpu } from 'react-icons/bs'

const ModalGPU = ( props ) =>  {

    const { show, onClose, details} = props;
    const cancelButtonRef = useRef(null);
    const getChip = (status) =>{
        if(status===0){
            return(<div className="h-[18px] w-[18px]  bg-hw-alert rounded-full ml-[8px] ">
            </div>)
        }
        if(status===1){
            return(<div className="h-[18px] w-[18px] bg-hw-ok rounded-full ml-[8px]  self ">

            </div>)
        }
        if(status===2){
            return(
                <div className="h-[18px] w-[18px] bg-hw-warning rounded-full ml-[8px] ">
  
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
                        <div className="inline-block w-[327px] h-[350px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[10rem] xl:my-[10rem] rounded-[1.875rem]">
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
                                            <BsCpu className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                        Información GPU
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[20px]' />
                            
                            {details === null &&
                                 <div className='flex-wrap text-center'>
                                    <span className='text-[24px]'>🤔</span> <span className='text-[16px] font-semibold text-[#666666]'> GPU sin información ... </span>
                               </div>
                            }

                            <div className="h-[140px] overflow-y-auto gt-scroll">

                                {/*Contenido*/}

                              
                            {details !== null && 
                             <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                    <div className="flex-auto text-white font-bold ">Nombre de GPU</div>
                                    <div className="justify-end text-white font-bold ">Carga de GPU</div>
                            </div>
                            }

                            {details !== null && 
                                <div className="bg-white/20 h-[2px] mx-[24px] mb-[16px]"></div>
                            }
                           
                           {details !== null && 
                           
                           details.map((detail) => {
                            return(<div>
                                <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                    <div className="text-white basis-3/4">{detail.gpu_name}</div>
                                    <div className="flex-auto "></div>
                                    <div className="flex justify-end text-white ">{detail.gpu_load}% {getChip(detail.status)}</div>
                                </div>
                                <div className="bg-white/20 h-[2px] mx-[24px] mb-[16px]"></div>
                             </div>)

                            })
                            
                            }
                               

                                




                
                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalGPU;