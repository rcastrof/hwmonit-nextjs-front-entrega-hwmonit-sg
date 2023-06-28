import React, { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { FiUser } from 'react-icons/fi'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from "axios";
import { useRouter } from "next/router";


function ModalUserRol(props) {

    const { show, onClose, userList, rolesList } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, getValues } = useForm();
    const { push } = useRouter();
    const [arrayUserRol, setArrayUserRol] = useState([])


    const closeModal = () => {
        setArrayUserRol([])
        onClose();
    }

    const sendRoles = async () => {

        if (arrayUserRol && arrayUserRol.length > 0) {

            arrayUserRol.map(async (item) => {

                const detailsRol = await new Promise((resolve, reject) => {
                    axios.put(`${process.env.REACT_APP_API_URL}nuevoRolUsuario/${item._id}`, { typeUser: item.typeRol }, { withCredentials: true })
                        .then(response => {
                            resolve(response);

                        }).catch(error => {
                            if (error.response.status === 401) {
                                push('/')
                            }
                            resolve(error);
                        })
                });
                props.parentCallback({ state: true, status: detailsRol.status, message: "save" });
            })

            onClose();
        }
    };

    const handleRol = async (event, id) => {

        arrayUserRol.push({ typeRol: event.target.value, _id: id })



    };


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
                        <div className="inline-block w-[327px] h-[481px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[4rem] m:my-[5rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <FiUser className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                           Usuarios sin rol
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />


                                {/*Contenido*/}
                                <div className="h-[255px] overflow-y-auto gt-scroll">
                                <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] text-white tracking-[-5%] text-[14px]'>Listado de usuarios sin rol asignado:</div>
                                <div className='flex mt-[20px] ml-[24px] flex-wrap '>
                                    {userList && userList.length > 0 && userList.map((item) => {

                                        return (<div
                                            className="h-[101px] w-[279px] bg-white/[0.15] rounded-[16px] mr-[8px] text-[16px] leading-[22px] tracking-[-1px] mb-[8px]"
                                        >

                                            <div className='flex text-white ml-[16px] cursor-pointer flex-wrap'>

                                                <div className='text-white mt-[16px] self-center mb-[8px]'>{item.email}</div>
                                                <select className='border-[2px] border-white/20 bg-transparent rounded-[9px] w-[247px] h-[38px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                                    onChange={(event) => handleRol(event, item._id)}
                                                    defaultValue={""}>

                                                    <option className='bg-black hover:[#262626]' value="" >Asignar rol</option>

                                                    {rolesList && rolesList.length > 0 && rolesList.map((item) => {
                                                        return (item.typeUser !== 'SUPERADMINISTRADOR' && <option className='bg-black' value={item.typeUser}>{item.typeUser}</option>)
                                                    })}

                                                </select>
                                            </div>

                                        </div>)

                                    })
                                    }


                                </div>
                            </div>
                            <div className='flex mt-[20px] ml-[24px] '>

                                <div
                                    className="h-[48px] w-[135px] border-[2px] border-white/20 bg-transparent rounded-[10px]  mr-[9px] text-[16px]  leading-[22px] tracking-[-1px]"
                                    onClick={() => closeModal()}
                                >

                                    <div className='flex ml-[20px] cursor-pointer'>
                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/20  mt-[10px]">
                                            <RiCloseFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                        </div>
                                        <div className='text-white ml-[8px] mt-[11px]'>Cancelar</div>
                                    </div>

                                </div>
                                <button
                                    className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] text-[16px] leading-[22px] tracking-[-1px]" onClick={() => sendRoles()}>
                                    <div className='flex ml-[20px]'>
                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/20">
                                            <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                        </div>
                                        <div className='text-white ml-[8px] font-semibold'>Guardar</div>
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

export default ModalUserRol