import React from 'react'
import { Fragment,  useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { RiCloseFill } from 'react-icons/ri'
import { GoAlert } from 'react-icons/go'
import { useRouter } from "next/router";
import axios from "axios";


const ModalDelete = (props) => {
    const { show, onClose, ide } = props;
    const cancelButtonRef = useRef(null);

    const { push } = useRouter();
    const closeModal = () => {
        onClose();
    }

    
    const handleDelete = async () => {



        if(ide !== null && ide !== undefined){
         

            const listDetails = await new Promise((resolve, reject) => {
                axios.delete(`${process.env.REACT_APP_API_URL}deviceType/${ide}`, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                      
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        if(error.response.status===412){
                           
                            props.parentCallback({state: true, status: error.response.status,  message: "deleteAssigned"});
                           
                            closeModal() 
                        }
                        resolve(error);
                    })
            });
            if(listDetails.status===200){
                props.parentCallback({state: true, status: listDetails.status,  message: "delete"});
           
            closeModal()
            }  
        }
    }


    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => closeModal()} >
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
                        <div className="inline-block w-[327px] h-[246px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left  shadow-xl transform transition-all my-[6rem] lg:my-[15rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-black' aria-hidden="true" />
                                        </div>
                                    </div>
                             
                                </div>
                            </div>


                            <div className="flex h-[120px] ml-[24px] ">

                                {/*Contenido*/}
                                <GoAlert className='h-[80px] w-[80px] text-[#DA5151] self-center mr-[8px]'/>
                                <div className='font-bold leading-[19.07px] tracking-[-5%] text-hw-white text-[20px] self-center'>¿Seguro que deseas eliminar este tipo de dipositivo?</div>


                            </div>
                            <div className='flex mt-[1rem]'>

                                <button
                                    className="h-[48px] w-[136px] bg-[#EA683F] rounded-[10px] ml-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] "
                                    onClick={() => handleDelete()}>
                                    <div className='flex'>
                                        <div className='text-white font-bold self-center ml-[auto] mr-[auto]'>Si, eliminar</div>
                                    </div>
                                </button>
                                <div
                                    className="flex h-[48px] w-[136px] border-[2px] border-white/20 bg-transparent rounded-[10px] mr-[24px] ml-[9px] text-[16px]  
                                    cursor-pointer leading-[22px] tracking-[-1px]"
                                    onClick={() => closeModal()}
                                >

                                  
                                        <div className='text-white self-center ml-[auto] mr-[auto]'>No</div>
                                 

                                </div>
                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}


export default ModalDelete;