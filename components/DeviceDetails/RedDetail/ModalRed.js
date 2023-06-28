import { Fragment, useRef, useState } from 'react'
import { RiCloseFill, RiRouterFill } from 'react-icons/ri'
import { Dialog, Transition} from '@headlessui/react'
import CardRed from './CardRed';


const ModalRed = ( props ) =>  {

    const { show, onClose, details} = props;
    const cancelButtonRef = useRef(null);

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
                        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
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
                        <div className="inline-block w-[327px] h-[600px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[1rem] xl:my-[10rem] rounded-[1.875rem]">
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
                                            <RiRouterFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                        Información de discos
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px] text-[14px] leading-[18px] tracking-[-2%] ' />
                                <div className='mb-[16px]'>

                                    <div className= 'h-[43px] select-none  bg-white/[0.15] flex max-w-fit items-center rounded-[30px] ml-[24px] mb-[8px]'>
                                        <div className='mr-[3px] ml-[16px] text-white/90 '>Total de Bytes enviados: </div>
                                        <div className='text-white font-semibold mr-[16px]'>{details.totalByteSent}</div>
                                    </div>

                                    <div className= 'h-[43px] select-none bg-white/[0.15] flex max-w-fit items-center rounded-[30px] ml-[24px] mb-[8px]'>
                                        <div className='mr-[3px] ml-[16px] text-white/90'>Total de Bytes recibidos: </div>
                                        <div className='text-white font-semibold mr-[16px]'>{details.totalByteReceived}</div>
                                    </div>

                                </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />

                            <div className="h-[300px] overflow-y-auto flex flex-wrap gt-scroll">

                                {/*Contenido*/}
                                {details !== null && 
                                    details.interfaceInet.map((detail) =>{
                                        return(
                                            <CardRed detail = {detail}/>
                                        )
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

export default ModalRed;