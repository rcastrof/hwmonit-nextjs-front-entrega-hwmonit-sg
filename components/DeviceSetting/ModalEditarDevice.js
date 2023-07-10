import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { BsCheck, BsTrashFill } from 'react-icons/bs'
import { BiEditAlt } from "react-icons/bi";
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from "axios";
import { useRouter } from "next/router";
import { Bars } from 'react-loader-spinner';
import HwSwitch from '../HwSwitch'
import { checkSubmodule } from '../Permission/CheckSubmodules'
const ModalEditarDevice = (props) => {

    const { show, onClose, loading, details } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm();
    const [active, setActive] = useState(props.active)
    const [isAutomaticShutdown, setIsAutomaticShutdown] = useState(props.isAutomaticShutdown)
    const [isElectricityMonitoring, setIsElectricityMonitoring] = useState(props.isElectricityMonitoring)
    const [saveForm, setSaveForm] = useState(true)
    const [selectedDeviceType, setSelectedDeviceType] = useState(details.device_type)
    const [deviceTypes, setdeviceTypes] = useState([]);
    const { push } = useRouter();

    const onSubmit = async (event) => {



        if (saveForm) {
            setSaveForm(false);
            const deviceType_name = event.deviceType_name;
            const deviceType_label = event.deviceType_label;
            const deviceEntity_id = event.deviceEntity_id;
            const electricity_id = event.electricity_id;


            const data = {

                label: deviceType_label,
                device_type: selectedDeviceType,
                entity_id: deviceEntity_id,
                electricity_id: electricity_id,
                active: active,
                isAutomaticShutdown: isAutomaticShutdown,
                isElectricityMonitoring: isElectricityMonitoring,

            }


            const listDetails = await new Promise((resolve, reject) => {
                axios.put(`${process.env.REACT_APP_API_URL}device/${details.id}`, data, { withCredentials: true })
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
            setSaveForm(true);
            onClose();
        }


    };

    useEffect(() => {
        setSelectedDeviceType(props.details.device_type)
    }, props.details.device_type)

    useEffect(() => {

        async function fetchdeviceTypes() {
            await getDeviceTypes();
        }
        fetchdeviceTypes();

    }, [])


    const getDeviceTypes = async () => {

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


    }
    const closeModal = () => {
        setValue('deviceType_name', details.name, { shouldDirty: true })
        setValue('deviceType_label', details.label, { shouldDirty: true })
        setValue('device_typeId', details.device_type, { shouldDirty: true })
        setValue('deviceEntity_id', details.entity_id, { shouldDirty: true })
        setValue('electricity_id', details.electricity_id, { shouldDirty: true })
        clearErrors()
        onClose();
    }
    const handleDeviceType = (event) => {

        if (event.target.value !== '') {
            setSelectedDeviceType(event.target.value)
        }
    }
    const handleCallback = (childData) => {
        setActive(childData);
    }
    const handleCallbackAutomaticShutdown = (childData) => {
        setIsAutomaticShutdown(childData);
        
    }

    const handleCallbackElectricityMonitoring = (childData) => {
        setIsElectricityMonitoring(childData);
        if (childData === false && isAutomaticShutdown === true) {
            setIsElectricityMonitoring(true);
        } 
    }



    return (

        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => closeModal()} >
                <div className="flex items-end justify-center min-h-screen  px-4 pb-20 text-center content-center">
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
                        <div className="inline-block w-[327px] h-[565px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[5rem] m:my-[2.5rem] lg:my-[7rem] rounded-[1.875rem]">
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
                                            <BiEditAlt className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Editar dispositivo
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


                            {!loading &&
                                <div className="h-[306px]">

                                    {/*Contenido*/}
                                    <form onSubmit={handleSubmit(onSubmit)} id="createdeviceType">
                                        <div className="h-[335px] overflow-auto gt-scroll">
                                            <label className='text-white text-sm flex flex-col'>
                                                <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Nombre de dispositivo:</div>
                                                <input
                                                    name='deviceType_name' type="text"
                                                    className="ml-[24px] border-[2px] text-white/60 border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                    autoComplete='off'
                                                    defaultValue={details.name}
                                                    disabled />

                                                <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Etiqueta de dispositivo:</div>
                                                <input
                                                    {...register("deviceType_label", {
                                                        required: { value: true, message: "* Campo Requerido" },
                                                    })} name='deviceType_label' type="text"
                                                    className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                    defaultValue={details.label}
                                                    autoComplete='off' />

                                                {errors.deviceType_label && <span className='text-xs text-hw-white ml-[24px]'>{errors.deviceType_label.message}</span>}

                                                {checkSubmodule(props.submodules, "Cambiar Estado Dispositivo") && <div className='mt-[20px] flex'>
                                                    <div className='ml-[24px] mr-[8px] font-semibold text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>Inactivo</div>
                                                    <HwSwitch parentCallback={handleCallback} status={active} />
                                                    <div className='self-center ml-[8px] text-[#84BD00] font-semibold  text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                                </div>}
                                                <div className='mt-[20px] ml-[24px]'>
                                                    <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%]">Tipo de dispositivo</div>

                                                    <select className='border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                                        {...register("device_typeId", {
                                                            required: { value: true, message: "* Campo Requerido" },
                                                        })}
                                                        defaultValue={selectedDeviceType}
                                                        onChange={(event) => handleDeviceType(event)}>
                                                        <option className='bg-black hover:[#262626]' value=""> Seleccionar tipo de dispositivo</option>
                                                        {deviceTypes && deviceTypes.length > 0 &&
                                                            deviceTypes.map((device) => {
                                                                return (<option className='bg-black' value={device._id}>{device.label}</option>)
                                                            })}
                                                    </select>
                                                    {errors.device_typeId && <span className='text-xs text-hw-white ml-[24px]'>{errors.device_typeId.message}</span>}
                                                </div>
                                                
                                                {checkSubmodule(props.submodules, 'Cambiar Apagado Automático') && (
                                                    <div>
                                                        <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>
                                                            Apagado Remoto:
                                                        </div>
                                                        <div className='mt-[20px] flex'>
                                                            <div className='ml-[24px] mr-[8px] font-semibold text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>
                                                                Inactivo
                                                            </div>
                                                            <HwSwitch parentCallback={handleCallbackAutomaticShutdown} status={isAutomaticShutdown} />
                                                            <div className='self-center ml-[8px] text-[#84BD00] font-semibold text-[16px] leading-[21.79px] tracking-[-5%]'>
                                                                Activo
                                                            </div>
                                                        </div>

                                                        {isAutomaticShutdown && (
                                                            <div>
                                                                <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>
                                                                    Entity ID:
                                                                </div>
                                                                <input
                                                                    {...register('deviceEntity_id', {
                                                                        required: { value: true, message: '* Campo Requerido' },
                                                                    })}
                                                                    name='deviceEntity_id'
                                                                    type='text'
                                                                    className='ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                                                    autoComplete='off'
                                                                    defaultValue={details.entity_id}
                                                                />

                                                                {errors.deviceEntity_id && (
                                                                    <span className='text-xs text-hw-white ml-[24px]'>{errors.deviceEntity_id.message}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {checkSubmodule(props.submodules, 'Cambiar Monitoreo de Electricidad') && (
                                                    <div>
                                                        <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>
                                                            Monitorear Eléctricidad:
                                                        </div>
                                                        <div className='mt-[20px] flex'>
                                                            <div className='ml-[24px] mr-[8px] font-semibold text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>
                                                                Inactivo
                                                            </div>
                                                            <HwSwitch parentCallback={handleCallbackElectricityMonitoring} status={isElectricityMonitoring} />
                                                            <div className='self-center ml-[8px] text-[#84BD00] font-semibold text-[16px] leading-[21.79px] tracking-[-5%]'>
                                                                Activo
                                                            </div>
                                                        </div>

                                                        {isElectricityMonitoring && (
                                                            <div>
                                                                <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>
                                                                    Electricity ID:
                                                                </div>
                                                                <input
                                                                    {...register('electricity_id', {
                                                                        required: { value: true, message: '* Campo Requerido' },
                                                                    })}
                                                                    name='electricity_id'
                                                                    type='text'
                                                                    className='ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                                                    autoComplete='off'
                                                                    defaultValue={details.electricity_id}
                                                                />

                                                                {errors.electricity_id && (
                                                                    <span className='text-xs text-hw-white ml-[24px]'>{errors.electricity_id.message}</span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {!isElectricityMonitoring && isAutomaticShutdown && (
                                                            <div className='ml-[24px] mt-[8px] text-xs text-hw-white'>                                                                
                                                                * Es obligatorio tener electricidad para el apagado remoto.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            </label>
                                        </div>
                                        <div className='flex mt-[20px]'>
                                            {checkSubmodule(props.submodules, 'Eliminar Dispositivo') ? <><div
                                                className="h-[48px] w-[135px] border-[2px] border-white/20 bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px]  leading-[22px] tracking-[-1px]"
                                                onClick={() => closeModal()}
                                            >

                                                <div className='flex ml-[20px] cursor-pointer' onClick={() => { props.showModalDelete() }}>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/20 mt-[10px]">
                                                        <BsTrashFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] mt-[11px]'>Eliminar</div>
                                                </div>

                                            </div> <button type="submit"
                                                className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                    <div className='flex ml-[20px]'>
                                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">
                                                            <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                        </div>
                                                        <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                    </div>
                                                </button></>
                                                : <button type="submit"
                                                    className="h-[48px]  w-[135px] bg-[#EA683F] rounded-[10px] ml-[24px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                    <div className='flex ml-[20px]'>
                                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">
                                                            <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                        </div>
                                                        <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                    </div>
                                                </button>}
                                        </div>
                                    </form>
                                </div>
                            }

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalEditarDevice;