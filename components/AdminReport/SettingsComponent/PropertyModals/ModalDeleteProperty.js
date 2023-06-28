import { Fragment, useRef, useState } from 'react'
import { RiCloseFill, RiAddCircleLine, RiAddLine } from 'react-icons/ri'
import { BsCheck, BsExclamationTriangleFill } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { IoMdAddCircle, IoMdCloseCircle } from 'react-icons/io'
import { useForm } from 'react-hook-form'
import axios from "axios";

const ModalDeleteUrl = (props) => {

    const { show, onClose, id, deleteProperty } = props;
    const cancelButtonRef = useRef(null);
    const closeModal = () => {
        onClose();
    }

    return (

        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 -inset-y-1/3 inset-x-1 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => closeModal()} >
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

                        <div className="inline-block w-[327px] h-[254px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[5rem] m:my-[5rem] rounded-[1.875rem]">
                            {/*Header modal */}

                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]/60' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] pt-[20px] flex">
                                        <div className="h-[65px] w-[65px] mr-[8px] rounded-full flex">
                                            <BsExclamationTriangleFill className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                                            w-[60px] h-[60px] text-[#cc2626] self-center"/>
                                        </div>
                                        <Dialog.Title as="h3" className="h-[40px] text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            <p>¿Seguro que deseas</p>
                                            <p>eliminar esta variable</p>
                                            <p>de configuración?</p>
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            {/*Contenido*/}
                            <div className='flex flex-row mt-[30px] items-center justify-evenly'>
                                <button onClick={() => deleteProperty(id)} type="submit" className="h-[48px] w-[145px] bg-[#EA683F] rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                    <div className='flex items-center justify-center'>
                                        <div className='text-white ml-[8px] font-bold'>Si, eliminar</div>
                                    </div>
                                </button>
                                <button onClick={() => closeModal()} type="submit" className="h-[48px] w-[145px] bg-transparent border-white/[0.20] border-[2px] border-solid rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                    <div className='flex items-center justify-center'>
                                        <div className='text-white ml-[8px] font-bold'>No</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalDeleteUrl;