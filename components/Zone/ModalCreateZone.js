import { Fragment, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import {BsCheck} from 'react-icons/bs'
import { Dialog, Transition} from '@headlessui/react'
import { useForm } from 'react-hook-form'
import HwSwitch from '../HwSwitch'
import axios from "axios";
import { useRouter } from "next/router";
import { RiMapPinAddLine } from "react-icons/ri";
const ModalCreateZone = ( props ) =>  {

    const { show, onClose} = props;
    const cancelButtonRef = useRef(null);
    const {register, handleSubmit,formState:{errors}, clearErrors, reset } = useForm();
    const [active, setActive] = useState(false)
    const [saveForm, setSaveForm] = useState(true)
    const { push } = useRouter();
    const onSubmit = async (event) => {

        if(saveForm){
            setSaveForm(false);
            const zone_name = event.zone_name;
            const zone_label = event.zone_label;

            const data = {
                name: zone_name,
                active: active,
                label: zone_label
            }
            
            const listDetails = await new Promise((resolve, reject) => {
                axios.post(`${process.env.REACT_APP_API_URL}Createzone`, data, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        resolve(error);
                    })
            });

            props.parentCallback({state: true, status: listDetails.status, message: "save"});
            reset({ zone_name: "",  zone_label: ""});
            setActive(false);
            setSaveForm(true);
            onClose();   
        }

 
    };

    const closeModal = () => {
        reset({ zone_name: "",  zone_label: ""});
        clearErrors()
        onClose();
    }

    const handleCallback = (childData) =>{
        setActive(childData);
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
                        <div className="inline-block w-[327px] h-[490px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[2.5rem] m:my-[5rem] lg:my-[10rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <RiMapPinAddLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                           Crear zona
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />

                            <div className="h-[360px]">

                                {/*Contenido*/}
                                <form onSubmit={handleSubmit(onSubmit)} id="createZone">
                                <div className="h-[250px]">
                                    <label className='text-white text-sm flex flex-col'>
                                        <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] '>Nombre de zona:</div>
                                        <input 
                                            {...register("zone_name", {required: {value: true, message: "* Campo Requerido"}, 
                                            })} name='zone_name' type="text"  
                                            className="ml-[24px] border-[2px]  border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                            autoComplete='off'/>
                                            
                                            {errors.zone_name && <span className='text-xs text-hw-white ml-[24px]'>{errors.zone_name.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Etiqueta de zona:</div>
                                        <input 
                                            {...register("zone_label", {required: {value: true, message: "* Campo Requerido"}, 
                                            })} name='zone_label' type="text"  
                                            className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                            autoComplete='off'/>

                                        {errors.zone_label && <span className='text-xs text-hw-white ml-[24px]'>{errors.zone_label.message}</span>}
                                         
                                         <div className='mt-[20px] flex'>
                                             <div className='ml-[24px] mr-[8px] font-semibold text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>Inactivo</div>
                                            <HwSwitch parentCallback = {handleCallback} />
                                            <div className='self-center ml-[8px] text-[#84BD00] font-semibold  text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                        </div>
                                       
                                    </label>

                                    </div>
                                    <div className='flex mt-[30px]'>
                                            <div 
                                                className="h-[48px] w-[135px] border-[2px] border-white/20 bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px] leading-[22px] tracking-[-1px]"
                                                onClick={() => closeModal()}
                                            >
                                               
                                               <div className='flex ml-[20px] cursor-pointer'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px]  rounded-full bg-white/20 mt-[10px]">
                                                        <RiCloseFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white tex.t-[14px] text-bold ml-[8px] mt-[11px]'>Cancelar</div>
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

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalCreateZone;