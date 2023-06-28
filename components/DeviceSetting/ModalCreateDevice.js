import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiAddLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from "axios";
import { useRouter } from "next/router";
import { Bars } from 'react-loader-spinner';
import HwSwitch from '../HwSwitch'
const ModalCreateDeviceType = (props) => {

    const { show, onClose } = props;
    const cancelButtonRef = useRef(null);
    const [deviceTypes, setdeviceTypes] = useState([]);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm();
    const [saveForm, setSaveForm] = useState(true)
    const [active, setActive] = useState(false)
    const [isAutomaticShutdown, setIsAutomaticShutdown] = useState(false)
    const [isElectricityMonitoring, setIsElectricityMonitoring] = useState(false)
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();
    const [selectedDeviceType, setSelectedDeviceType] = useState(null)
    const onSubmit = async (event) => {

        if (saveForm) {
            setSaveForm(false);
            const deviceType_name = event.deviceType_name;
            const deviceType_label = event.deviceType_label;
            
            const data = {
                name: deviceType_name,
                label: deviceType_label,
                device_type: selectedDeviceType,
                active: active,
                isAutomaticShutdown: isAutomaticShutdown,
                isElectricityMonitoring : isElectricityMonitoring,
            }

            const listDetails = await new Promise((resolve, reject) => {
                axios.post(`${process.env.REACT_APP_API_URL}device`, data, { withCredentials: true })
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
            reset({ deviceType_name: "", deviceType_label: "" });
            setSaveForm(true);
            onClose();
        }
    };

    const closeModal = () => {
        reset({ deviceType_name: "", deviceType_label: "", device_typeId: '' });
        clearErrors()
        onClose();
    }

    const handleCallback = (childData) => {
        setActive(childData);
    }

    const handleCallbackAutomaticShutdown = (childData) => {
        setIsAutomaticShutdown(childData);
    }

    const handleCallbackElectricityMonitoring = (childData) => {
        setIsElectricityMonitoring(childData);
    }


    const handleDeviceType = (event) => {

        if (event.target.value !== '') {
            setSelectedDeviceType(event.target.value)
        }
    }

    useEffect(() => {

        async function fetchdeviceTypes() {
            await getDeviceTypes();
        }
        fetchdeviceTypes();

    }, [])


    const getDeviceTypes = async () => {
        setLoading(true)
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}allDeviceType`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });

        setdeviceTypes(response.deviceType);

        setLoading(false);

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
                        <div className="inline-block w-[327px] h-[565px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[4rem] m:my-[1.5rem] lg:my-[7rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem] '>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <RiAddLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Crear dispositivo
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />
                            {loading &&
                                <div className='flex flex-row justify-center mt-[24px]'>
                                    <Bars color="#FAFAFA" height={80} width={80} />
                                </div>
                            }
                            {!loading && <div className="h-[306px]">

                                {/*Contenido*/}
                                <form onSubmit={handleSubmit(onSubmit)} id="createdeviceType">
                                    <div className="h-[335px] overflow-auto gt-scroll">
                                        <label className='text-white text-sm flex flex-col'>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Nombre de dispositivo:</div>
                                            <input
                                                {...register("deviceType_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='deviceType_name' type="text"
                                                className="ml-[24px] border-[2px]  border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.deviceType_name && <span className='text-xs text-hw-white ml-[24px]'>{errors.deviceType_name.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Etiqueta de dispositivo:</div>
                                            <input
                                                {...register("deviceType_label", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='deviceType_label' type="text"
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.deviceType_label && <span className='text-xs text-hw-white ml-[24px]'>{errors.deviceType_label.message}</span>}
                                            <div className='mt-[20px] flex'>
                                                <div className='ml-[24px] mr-[8px] text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>Inactivo</div>
                                                <HwSwitch parentCallback={handleCallback} />
                                                <div className='self-center ml-[8px] text-[#84BD00] font-semibold  text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                            </div>
                                            <div className='mt-[20px] ml-[24px]'>
                                                <div className="font-bold text-[14px] mb-[8px] leading-[19.07px] tracking-[-5%]">Tipo de dispositivo:</div>

                                                <select className='border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                                    {...register("device_typeId", {
                                                        required: { value: true, message: "* Campo Requerido" },
                                                    })}
                                                    defaultValue={""}
                                                    onChange={(event) => handleDeviceType(event)}>
                                                    <option className='bg-black hover:[#262626]' value=""> Seleccionar tipo de dispositivo</option>
                                                    {deviceTypes && deviceTypes.length > 0 &&
                                                        deviceTypes.map((device) => {
                                                            return (<option className='bg-black' value={device._id}>{device.label}</option>)
                                                        })}
                                                </select>
                                                {errors.device_typeId && <span className='text-xs text-hw-white ml-[24px]'>{errors.device_typeId.message}</span>}
                                            </div>

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Apagado Automático:</div>
                                            <div className='mt-[20px] flex'>
                                                <div className='ml-[24px] mr-[8px] text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>Inactivo</div>
                                                <HwSwitch parentCallback={handleCallbackAutomaticShutdown} />
                                                <div className='self-center ml-[8px] text-[#84BD00] font-semibold  text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                            </div>
{/* 
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Entity ID:</div>
                                            <input
                                                {...register("deviceType_label", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='deviceType_label' type="text"
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.deviceType_label && <span className='text-xs text-hw-white ml-[24px]'>{errors.deviceType_label.message}</span>}

                                             */}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Monitorear Eléctricidad:</div>
                                            <div className='mt-[20px] flex'>
                                                <div className='ml-[24px] mr-[8px] text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>Inactivo</div>
                                                <HwSwitch parentCallback={handleCallbackElectricityMonitoring} />
                                                <div className='self-center ml-[8px] text-[#84BD00] font-semibold  text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                            </div>

                                        </label>

                                    </div>
                                    <div className='flex mt-[20px]'>
                                                <div
                                                    className="h-[48px] w-[135px] border-[2px] border-white/20 bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px]  leading-[22px] tracking-[-1px]"
                                                    onClick={() => closeModal()}
                                                >

                                                    <div className='flex ml-[20px] cursor-pointer'>
                                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/20 mt-[10px]">
                                                            <RiCloseFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                                        </div>
                                                        <div className='text-white ml-[8px] mt-[11px]'>Cancelar</div>
                                                    </div>

                                                </div>
                                                <button type="submit"
                                                    className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                    <div className='flex ml-[20px]'>
                                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">
                                                            <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                        </div>
                                                        <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                    </div>
                                                </button>

                                            </div>

                                </form>

                            </div>}

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalCreateDeviceType;