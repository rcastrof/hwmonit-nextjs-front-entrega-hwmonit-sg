import React, { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiUserSettingsLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from "axios";
import { BsFillTrashFill } from 'react-icons/bs'
import { useRouter } from "next/router";
const dataRol = "ADMINISTRADOR"

const data = []

function ModalConfigRol(props) {

    const { push } = useRouter();
    const { show, onClose, nameRol } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm();
    const [saveForm, setSaveForm] = useState(true)
    const [loading, setLoading] = useState(false);
    const [listUserRol, setListUserRol] = useState([])
    const [arrayDelete, setArrayDelete] = useState([])


    useEffect(() => {

        async function fecthInfo(name) {
            await getInfo(name);
        }

        if (nameRol !== undefined) {
            fecthInfo(nameRol);
        }


    }, [nameRol])



    const getInfo = async (name) => {

        setLoading(true);

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}usersRoles/${name}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                    setListUserRol(response.data.listaMails)
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });


        setLoading(false);
    }


    const deleteUsers = async () => {
        // actualiza a null typeUser usuarios
        if (arrayDelete && arrayDelete.length > 0) {

            arrayDelete.map(async (item) => {

                const detailsDelete = await new Promise((resolve, reject) => {
                    axios.put(`${process.env.REACT_APP_API_URL}nuevoRolUsuario/${item}`, { typeUser: null }, { withCredentials: true })
                        .then(response => {
                            resolve(response);

                        }).catch(error => {
                            if (error.response.status === 401) {
                                push('/')
                            }
                            resolve(error);
                        })
                });
            })

            closeModal()
        }
    }



    const closeModal = () => {
        setArrayDelete([])
        getInfo(nameRol)
        clearErrors()
        onClose();
    }


    const handleDelete = (id) => {

        arrayDelete.push(id)


        let filterDevices = listUserRol.filter((item) => { return item._id !== id })

        setListUserRol(filterDevices)

    }




    return (
        <>
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
                            <div className="inline-block w-[327px] h-[500px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[2rem] m:my-[5rem] rounded-[1.875rem]">
                                {/*Header modal */}
                                <div className="px-4 pt-5 justify-end">
                                    <div className="flex flex-col">
                                        <div className='flex justify-end mr-[0.5rem]'>
                                            <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer" onClick={() => closeModal()}>
                                                <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]/60' aria-hidden="true" />
                                            </div>
                                        </div>
                                        <div className="mt-3 ml-[0.5rem] flex">
                                            <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                                <RiUserSettingsLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                            </div>
                                            <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                                Configuración de rol
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                </div>

                                <hr className='bg-white/20 border-none h-[8px] mb-[16px]' />

                                {/*Contenido*/}
                                <div className="h-[280px] overflow-y-auto gt-scroll">
                                    <div className='mb-[8px] ml-[24px] font-bold text-[#FAFAFA] leading-[19.07px] tracking-[-5%] text-[14px]'>Nombre del nuevo Rol</div>
                                    <input
                                        name='rol_name' type="text"
                                        className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                        autoComplete='off'
                                        placeholder={nameRol}
                                        disabled />


                                    <div className='mb-[8px] mt-[15px] ml-[24px] text-[#FAFAFA] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Usuarios asociados al rol: </div>
                                    <div className='flex mt-[20px] ml-[24px] flex-wrap '>
                                        {listUserRol && listUserRol.length > 0 && listUserRol.map((item) => {

                                            return (<div
                                                className="h-[64px] w-[279px] border-white/[0.20] bg-white/20 rounded-[10px] mr-[8px] text-[16px] leading-[22px] tracking-[-1px] mb-[8px]"
                                            >

                                                <div className='flex ml-[20px] cursor-pointer'>

                                                    <div className='text-[#FAFAFA] ml-[8px] mt-[20px] self-center'>{item.email}</div>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-[16px] bg-[#D6E1E7]/25 mt-[20px] ml-[auto] mr-[24px]" onClick={() => handleDelete(item._id)}>
                                                        <BsFillTrashFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                                    </div>
                                                </div>

                                            </div>)

                                        })
                                        }
                                        {(listUserRol && listUserRol.length > 0) ? null : <div className='mb-[8px] mt-[8px] ml-[24px] font-semibold leading-[21.79px] tracking-[-5%] text-[#FAFAFA] text-[16px]'>Sin usuarios asignados 😕</div>}

                                    </div>

                                </div>

                                {((listUserRol && listUserRol.length > 0) || arrayDelete.length!==0) ? <div className='flex mt-[10px]  ml-[24px] '>

                                    <div
                                        className="h-[48px] w-[135px] border-[2px] border-white/[0.20] bg-transparent rounded-[10px] mr-[9px] text-[16px] leading-[22px] tracking-[-1px]"
                                        onClick={() => closeModal()}
                                    >

                                        <div className='flex ml-[20px] cursor-pointer'>
                                            <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 mt-[10px]">
                                                <RiCloseFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                            </div>
                                            <div className='text-[#FAFAFA] ml-[8px] mt-[11px]'>Cancelar</div>
                                        </div>

                                    </div>
                                    <button
                                        className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] font-semibold text-[16px] leading-[22px] tracking-[-1px]" onClick={() => deleteUsers()}>
                                        <div className='flex ml-[20px]'>
                                            <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                            </div>
                                            <div className='text-white ml-[8px]'>Guardar</div>
                                        </div>
                                    </button>

                                </div> :  <div
                                    className="flex mt-[10px] ml-[24px] h-[48px] w-[279px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] cursor-pointer" onClick={() => { props.showModalDelete() }}>
                                    <div className='flex ml-[auto] mr-[auto]'>
                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25 mt-[12px]">
                                            <BsFillTrashFill className='w-[15px] h-[15px] text-white self-center ' aria-hidden="true" />
                                        </div>

                                        <div className='text-white ml-[8px] self-center '>Eliminar</div>
                                    </div>
                                </div>}


                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default ModalConfigRol