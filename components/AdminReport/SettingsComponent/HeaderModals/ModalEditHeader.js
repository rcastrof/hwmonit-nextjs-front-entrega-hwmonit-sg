import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiAddLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'

const ModalEditHeader = (props) => {

    const { show, onClose, name, header, id, editHeader } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm();
    const [saveForm, setSaveForm] = useState(true)

    const onSubmit = async (event) => {

        if (saveForm) {

            setSaveForm(false);
            const key_name = event.key_name;
            const value_name = event.value_name;
            editHeader(id, key_name, value_name)
            reset({ key_name: "", value_name: "" });
            setSaveForm(true);
            closeModal()
        }
    };

    const closeModal = () => {
        reset({ key_name: "", value_name: "" });
        clearErrors()
        onClose();
    }


    useEffect(() => {
        setValue("key_name", name)
        setValue("value_name", header)
        return () => {
            setValue("key_name", "")
            setValue("value_name", "")
        }
    }, [show])

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

                        <div className="inline-block w-[327px] h-[454px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[5rem] m:my-[5rem] rounded-[1.875rem]">
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
                                            <RiAddLine className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                                            w-[25px] h-[25px] text-white self-center"/>
                                        </div>
                                        <Dialog.Title as="h3" className="h-[40px] text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            <p>Editar variable de</p>
                                            <p>configuración</p>
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/[0.10] border-none h-[8px] mb-[16px]' />



                            {/*Contenido*/}
                            <form onSubmit={handleSubmit(onSubmit)} id="createModule">
                                <div className="h-[180px]">
                                    <label className='text-[#FAFAFA] text-sm flex flex-col'>
                                        <div className='overflow-auto gt-scroll h-[310px]'>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Clave</div>
                                            <input
                                                {...register("key_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    minLength: { value: 2, message: "* Campo debe tener 2 o mas de longitud" },
                                                    maxLength: { value: 50, message: "* Longitud Máxima de 50 caracteres" },
                                                })} name='key_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent/30 rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete="off" placeholder="Ingresa una clave" minLength={2} maxLength={100} disabled/>

                                            {errors.key_name && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.key_name.message}</span>}



                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Valor</div>
                                            <input
                                                {...register("value_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    minLength: { value: 2, message: "* Campo debe tener 2 o mas de longitud" },
                                                    maxLength: { value: 50, message: "* Longitud Máxima de 50 caracteres" },
                                                })} name="value_name" type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete="off" placeholder="Ingresa un valor" minLength={2} maxLength={100} autoFocus/>

                                            {errors.value_name && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.value_name.message}</span>}


                                        </div>

                                    </label>

                                </div>
                                <div className='flex mt-[50px] items-center justify-center'>
                                    <button type="submit" className="h-[48px] w-[275px] bg-[#EA683F] rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                        <div className='flex items-center justify-center'>
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

export default ModalEditHeader;