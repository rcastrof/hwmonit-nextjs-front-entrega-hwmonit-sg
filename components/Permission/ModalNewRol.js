import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiAddCircleLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from "axios";
import { useRouter } from "next/router";
const ModalNewRol = (props) => {
    const { show, onClose } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm();
    const [saveForm, setSaveForm] = useState(true)
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();
    const onSubmit = async (event) => {


        if (saveForm) {
            setSaveForm(false);
            const rol_name = event.rol_name;
            const data = {
                typeUser: rol_name,
            }

            const listDetails = await new Promise((resolve, reject) => {
                axios.post(`${process.env.REACT_APP_API_URL}configRol`, data, { withCredentials: true })
                    .then(response => {
                        resolve(response);

                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        resolve(error);
                    })
            });
            props.parentCallback({ state: true, status: listDetails.status, message: "save" });
            reset({ rol_name: "" });
            setSaveForm(true);

            onClose();
        }

    };

    const closeModal = () => {
        reset({ rol_name: "" });
        clearErrors()
        onClose();
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
                        <div className="inline-block w-[327px] h-[311px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[4rem] m:my-[10rem] rounded-[1.875rem]">
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
                                            <RiAddCircleLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                           Crear nuevo rol
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />

                            {/*Contenido*/}
                            <form onSubmit={handleSubmit(onSubmit)} id="createBranch">
                                <div className="h-[360px]">
                                    <label className='text-white text-sm flex flex-col'>
                                        <div className='h-[100px]'>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Nombre del nuevo Rol</div>
                                            <input
                                                {...register("rol_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='rol_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />
                                            {errors.rol_name && <span className='text-xs text-hw-white ml-[24px]'>{errors.rol_name.message}</span>}

                                            
                                        </div>
                                        <div className='flex mt-[5px] ml-[25px] '>

                                                <button type="submit"
                                                    className="h-[48px] w-[279px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                    <div className='flex ml-[85px]'>
                                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">
                                                            <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                        </div>
                                                        <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                    </div>
                                                </button>

                                            </div>
                                    </label>
                                </div>
                            </form>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalNewRol