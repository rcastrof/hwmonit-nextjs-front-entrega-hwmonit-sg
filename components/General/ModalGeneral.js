import { Fragment, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { FiMapPin } from 'react-icons/fi'
import { Dialog, Transition } from '@headlessui/react'
import CardModalGeneral from './CardModalGeneral'
import {Bars} from 'react-loader-spinner';
const ModalGeneral = ( props ) =>  {



    const { show, onClose, details, loading, title } = props;
    const cancelButtonRef = useRef(null);

    

    return (
       
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={onClose}>
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
                        <div className="bg-gradient-to-b from-[#003C61] to-[#1B6970] inline-block w-[20.438rem] h-[36.188rem] m:h-[556px] m:w-[630px] align-bottom  text-left overflow-hidden shadow-xl transform transition-all mx-[1.5rem] my-[2.5rem] lg:my-[5rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col ">
                                    <div className='flex justify-end mr-[0.5rem] flex-row'>
                                        <div className="flex justify-center items-center w-[28px] h-[28px] rounded-full bg-[#FAFAFA] cursor-pointer" onClick={onClose}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000] justify-center' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className='flex flex-row ml-[0.5rem] '>
                                        <div className='h-[32px] w-[32px] mr-[10px] bg-[#EA683F] rounded-full flex  flex-col self-center items-center'>
                                            <FiMapPin className='h-[20px] w-[20px] mt-[6px] flex text-white'></FiMapPin>
                                        </div>
                                        <div className="mt-[19px] ">
                                            <Dialog.Title as='h3' className="text-[16px] font-bold leading-[18px] tracking-[-2%] text-[#FFFFFF] ">
                                                {title}
                                            </Dialog.Title>
                                            <Dialog.Title as='h3' className="text-[20px] font-bold leading-[36px] text-[#FAFAFA] tracking-[-3%] whitespace-nowrap mb-[19px]">
                                                Estado de dispositivos
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                            <hr className='bg-[#FFFFFF]/10 border-none h-[8px] mb-[16px]' />

                            { loading &&
                                <div className='flex flex-row justify-center mt-[24px]'>
                                    <Bars color="#FAFAFA" height={80} width={80} />
                                </div>
                            }

                            { !loading &&
                                details.map((detail) => {
                                    if(detail.description.description_error === "Sucursal sin dispositivos"){
                                       return( <div className='flex-wrap text-center'>
                                            <span className='text-[24px]'>😱</span> <span className='text-[16px] font-semibold text-hw-white'> Sucursal sin dispositivos asignados o sin reportar ... </span>
                                        </div>)
                                    }
                                })
                            }

                            { !loading && details.length === 0 &&
                                <div className='flex-wrap text-center'>
                                    <span className='text-[24px]'>😱</span> <span className='text-[16px] font-semibold text-hw-white'> Sucursal sin dispositivos asignados o sin reportar ... </span>
                                </div>
                            }
    
                            <div className="overflow-y-auto h-[360px] m:ml-[24px] m:flex m:flex-wrap gt-scroll">
                            { !loading &&
                                details.map((detail) => {
                                    if(detail.description.description_error !== "Sucursal sin dispositivos"){
                                        return(
                                        <CardModalGeneral title={detail.label} subtitle={detail.status_general === 1 ? "Dispositivo sin problemas" : detail.description} status={detail.status_general} ide={detail.device_id} submodules={props.submodules}/>
                                        )
                                    }
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

export default ModalGeneral;