import { Fragment, useRef, useState } from 'react'
import { RiCloseFill, RiAddCircleLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { IoMdAddCircle, IoMdCloseCircle } from 'react-icons/io'
import { useForm } from 'react-hook-form'
import axios from "axios";
import { useRouter } from "next/router";
const ModalAddSubmodule = (props) => {

    const { show, onClose, ide, nameModule, currentSubmodules } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm();
    const [submodules, setSubmodules] = useState([])
    const [errorSubmodules, setErrorSubmodules] = useState(false)
    const [saveForm, setSaveForm] = useState(true)
    const { push } = useRouter();
    const onSubmit = async (event) => {

        if (submodules.length !== 0) {
            setErrorSubmodules(false)
            setSaveForm(false);
            const module_name = nameModule;

            const data = {

                submodules: submodules
            }

            const listDetails = await new Promise((resolve, reject) => {
                axios.put(`${process.env.REACT_APP_API_URL}submodules/${ide}`, data, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        resolve(error);
                    })
            });

            props.parentCallback({ state: true, status: listDetails.status, message: "saveSubmodule" });
            reset({ submodule_name: "" });

            setSaveForm(true);
            closeModal()
        } else {
            setErrorSubmodules(true)
        }
    };

    const addSubmodule = (event) => {
        event.preventDefault()
        let submodule = document.getElementById("submoduleName").value
        if (submodule.trim() !== '' && submodules.find((submoduleFind) => { return submoduleFind === submodule }) === undefined && currentSubmodules.find((submoduleFind) => { return submoduleFind.nameSubmodule === submodule }) === undefined) {
            let updatedSubmodules = [...submodules]
            updatedSubmodules.push(submodule)

            setSubmodules(updatedSubmodules);
            document.getElementById("submoduleName").value = ''


        }
        document.getElementById("submoduleName").focus()

    }

    const removeSubmodule = (submodule) => {

        let updatedSubmodules = [...submodules]
        for (let i = 0; i < updatedSubmodules.length; i++) {
            if (updatedSubmodules[i] === submodule) {
                updatedSubmodules.splice(i, 1)
            }
        }
        setSubmodules(updatedSubmodules)
    }

    const closeModal = () => {
        setErrorSubmodules(false)
        setSubmodules([])
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

                        <div className="inline-block w-[327px] h-[554px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[5rem] m:my-[4rem] rounded-[1.875rem]">
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
                                            <RiAddCircleLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Crear submódulo
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/[0.10] border-none h-[8px] mb-[16px]' />



                            {/*Contenido*/}
                            <form onSubmit={handleSubmit(onSubmit)} id="createSubmodule">
                                <div className="h-[295]">
                                    <label className='text-[#FAFAFA] text-sm flex flex-col'>
                                        <div className='overflow-auto gt-scroll  h-[310px]'>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] text-[#FAFAFA]'>Nombre de módulo</div>
                                            <input
                                                {...register("module_name",
                                                )} name='module_name' type="text"

                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off'
                                                defaultValue={nameModule}
                                                disabled />

                                            {errors.module_name && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.module_name.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Nombre de submódulo</div>
                                            <div className='flex'>
                                                <input
                                                    {...register("submodule_name",
                                                    )} name='submodule_name' type="text"
                                                    id='submoduleName'
                                                    className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                    autoComplete='off' />

                                                <div onClick={(event) => addSubmodule(event)} className='flex cursor-pointer self-center ml-[-32px]'>
                                                    <IoMdAddCircle className="text-[#FFFFFF] w-[20px] h-[20px]" />
                                                </div>


                                            </div>
                                            {errorSubmodules && <span className='text-xs text-[#FAFAFA] ml-[24px]'>* Ingrese al menos un submódulo</span>}

                                            <div className='flex ml-[24px] flex-wrap h-[100px] mt-[15px]'>
                                                {currentSubmodules && currentSubmodules.length !== 0 &&
                                                    currentSubmodules.map((sub) =>
                                                        <div className='flex h-[48px] rounded-[10px] bg-[#FAFAFA] bg-opacity-10 mr-[9px] mb-[9px]'>
                                                            <div className='ml-[14px] text-[#FAFAFA] mr-[10px] my-[10px] text-[14px] font-bold self-center'>{sub.nameSubmodule}</div>

                                                        </div>
                                                    )
                                                }
                                                {submodules && submodules.length !== 0 &&
                                                    submodules.map((sub) =>
                                                        <div className='flex h-[48px] rounded-[10px] bg-[#FAFAFA] bg-opacity-10 mr-[16px] mb-[8px]'>
                                                            <div className='ml-[14px] text-[#FAFAFA] mr-[10px] my-[10px] text-[14px] font-bold self-center'>{sub}</div>
                                                            <IoMdCloseCircle onClick={() => { removeSubmodule(sub) }} className='self-center font-[#424040] h-[16px] w-[16px] mr-[10px] cursor-pointer'></IoMdCloseCircle>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </label>

                                </div>
                                <div className='flex mt-[35px]'>
                                            <div
                                                className="h-[48px] w-[135px] border-[2px] border-white/[0.20] bg-transparent rounded-[10px] ml-[24px] mr-[9px] font-bold text-[16px]  leading-[22px] tracking-[-1px]"
                                                onClick={() => closeModal()}
                                            >

                                                <div className='flex ml-[20px] cursor-pointer'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 mt-[10px]">
                                                        <RiCloseFill className='w-[14px] h-[14px] text-[#FAFAFA]' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-[#FAFAFA] ml-[8px] mt-[11px]'>Cancelar</div>
                                                </div>

                                            </div>

                                            <button type="submit"
                                                className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                <div className='flex ml-[20px]'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                </div>
                                            </button>

                                        </div>
                            </form>



                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalAddSubmodule;