import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { BsCheck, BsTrashFill } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import HwSwitch from '../HwSwitch'
import axios from "axios";
import { Bars } from 'react-loader-spinner';
import { IoCloseCircle, IoAddCircle } from 'react-icons/io5'
import { checkSubmodule } from '../Permission/CheckSubmodules'
import { RiStoreLine } from  'react-icons/ri'
import { useRouter } from "next/router";
const ModalEditarBranch = (props) => {

    const { show, onClose, loading, details, active } = props;
    const cancelButtonRef = useRef(null);
    let { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm();
    const [activeSwitch, setActiveSwitch] = useState(null)
    const [saveForm, setSaveForm] = useState(true)
    const [deviceAsig, setDeviceAsig] = useState([])
    const [deviceAvailables, setDeviceAvailables] = useState([])
    const { push } = useRouter();

    useEffect(() => {

        async function loadInfo() {
            setActiveSwitch(active)
            setDeviceAsig(props.deviceDetails)
            setDeviceAvailables(props.availableDevices)

        }
        loadInfo();

    }, [active, props.deviceDetails])

    const onSubmit = async (event) => {

        let arrayDevices = []
        deviceAsig.map((item) => {
            arrayDevices.push(item._id)
        })


        let data = {
            name: details.branch_office.name,
            label: event.branch_label,
            long: event.branch_long,
            lat: event.branch_lat,
            active: activeSwitch,
            device: arrayDevices
        }



        const response = await new Promise((resolve, reject) => {
            axios.put(`${process.env.REACT_APP_API_URL}branch_office/${details.branch_office._id}`, data, { withCredentials: true })
                .then(response => {
                    resolve(response);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });

        props.parentCallback({ state: true, status: response.status, message: "branchUpdate" });

        closeModal()

    };


    const closeModal = () => {
        setValue('branch_name', details.branch_office.name, { shouldDirty: true })
        setValue('branch_label', details.branch_office.label, { shouldDirty: true })
        setValue('branch_long', details.branch_office.long, { shouldDirty: true })
        setValue('branch_lat', details.branch_office.lat, { shouldDirty: true })
        clearErrors()
        onClose();
    }

    const handleCallback = (childData) => {
        setActiveSwitch(childData);
    }

    const removeDevice = (id) => {

        let filterDevices = deviceAsig.filter((item) => { return item._id !== id })
        let existe = deviceAvailables.includes({ _id: id })

        if (!existe) {
            deviceAsig.map((item) => {
                if (item._id == id) {
                    deviceAvailables.push(item)
                    setDeviceAvailables(deviceAvailables)
                    setDeviceAsig(filterDevices)
                }
            })
        }

    }


    const addDevice = (id) => {

        let existe = deviceAsig.includes({ _id: id })

        if (!existe) {

            deviceAvailables.map((item) => {
                if (item._id == id) {
                    let filterDevices = deviceAvailables.filter((item) => { return item._id !== id })
                    setDeviceAvailables(filterDevices)
                    deviceAsig.push(item)

                    setDeviceAsig(deviceAsig)
                }
            })
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
                        <div className="inline-block w-[327px] h-[655px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[0.5rem] lg:my-[3rem] rounded-[1.875rem]">
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
                                            <RiStoreLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                           Editar sucursal
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/[0.10] border-none h-[8px] mb-[16px]' />


                            {loading &&
                                <div className='flex flex-row justify-center mt-[24px]'>
                                    <Bars color="#FAFAFA" height={80} width={80} />
                                </div>
                            }


                            {!loading &&
                                <Fragment><div className="h-[420px] overflow-y-auto gt-scroll" >

                                    {/*Contenido*/}
                                    <form onSubmit={handleSubmit(onSubmit)} id="editBranch">
                                        <label className='text-black text-sm flex flex-col'>
                                        <div className='mt-[18px] mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] text-[#FAFAFA]'>Nombre de Surcursal</div>
                                            <input
                                                name='branch_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] text-[#FAFAFA] rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off'
                                                defaultValue={details.branch_office.name}
                                                disabled />

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA]'>Etiqueta de Surcursal</div>
                                            <input
                                                {...register("branch_label", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='branch_label' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent text-[#FAFAFA] rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                defaultValue={details.branch_office.label}
                                                autoComplete='off' />
                                            {errors.branch_label && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.branch_label.message}</span>}


                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA]'>Longitud</div>
                                            <input
                                                {...register("branch_long", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='branch_long' pattern="^-?[0-9]\d*(.\d+)?$" 
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent text-[#FAFAFA] rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                defaultValue={details.branch_office.long}
                                                autoComplete='off' />
                                            {errors.branch_long && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.branch_long.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA]'>Latitud</div>
                                            <input
                                                {...register("branch_lat", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='branch_lat' pattern="^-?[0-9]\d*(.\d+)?$" 
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent text-[#FAFAFA] rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                defaultValue={details.branch_office.lat}
                                                autoComplete='off' />
                                            {errors.branch_lat && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.branch_lat.message}</span>}

                                            {checkSubmodule(props.submodules, "Cambiar Estado Sucursal") && <div className='mt-[17px] flex'>
                                                <div className='ml-[24px] mr-[8px] text-[16px] leading-[21.79px] tracking-[-5%] self-center text-[#FAFAFA]'>Inactivo</div>
                                                <HwSwitch parentCallback={handleCallback} status={activeSwitch} />
                                                <div className='self-center ml-[8px] text-[#84BD00] text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                            </div>}
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA] '>Dispositivos disponibles</div>
                                            <div className='flex min-h-[72px] leading-[21.79px] tracking-[-5%] text-[16px] flex-wrap ml-[16px] mt-[8px]'>

                                                {deviceAvailables !== undefined && deviceAvailables.length > 0 &&
                                                    deviceAvailables.map((item) => {
                                                        return (
                                                            <div className='h-[38px] bg-[#E5EECF] flex min-w-fit items-center rounded-[10px] ml-[8px] mb-[8px]'>
                                                                <div className='text-[14px] text-[#84BD00] mr-[16px] leading-[19.07px] tracking-[-5%] pl-[14px] flex-auto '>{item.label}</div>
                                                                {checkSubmodule(props.submodules, "Modificar Dispositivos Asignados") && <IoAddCircle className="self-center h-[20px] w-[20px] mr-[8px] cursor-pointer text-[#84BD00]" onClick={() => addDevice(item._id)} />}
                                                            </div>
                                                        )
                                                    })
                                                }

                                                {deviceAvailables.length === 0 &&
                                                    <div className='mt-[8px]'>
                                                        <span className='text-[24px]'>😒</span> <span className='text-[16px] text-[#FAFAFA] font-semibold'> No hay dispostivos disponibles... </span>
                                                    </div>
                                                }


                                            </div>


                                            <div className='mb-[8px] ml-[24px] leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA] font-semibold'>Dispositivos asignados a esta sucursal</div>
                                            <div className='flex min-h-[72px] leading-[21.79px] tracking-[-5%] text-[16px] flex-wrap ml-[16px] mt-[8px]'>

                                                {deviceAsig !== undefined && deviceAsig.length > 0 &&
                                                    deviceAsig.map((item) => {
                                                        return (
                                                            <div className='h-[38px] bg-[#59A0D8]/10 flex min-w-fit items-center rounded-[10px] ml-[8px] mb-[8px]'>
                                                                <div className='text-[14px] text-[#FFFFFF] mr-[16px] leading-[19.07px] tracking-[-5%] pl-[14px] flex-auto '>{item.label}</div>
                                                                {checkSubmodule(props.submodules, "Modificar Dispositivos Asignados") && <IoCloseCircle className="self-center h-[20px] w-[20px] mr-[8px] cursor-pointer text-[#FFFFFF]" onClick={() => removeDevice(item._id)} />}
                                                            </div>
                                                        )
                                                    })
                                                }

                                                {deviceAsig.length === 0 &&
                                                    <div className='mt-[8px]'>
                                                        <span className='text-[24px]'>😒</span> <span className='text-[16px] text-[#FAFAFA] font-semibold'> Sucursal sin dispositivos asignados ... </span>
                                                    </div>
                                                }


                                            </div>


                                        </label>



                                    </form>

                                </div>
                                    <div className='flex mt-[25px]'>
                                        {checkSubmodule(props.submodules, 'Eliminar Sucursal') ? <><div
                                            className="h-[48px] w-[135px] border-[2px] border-white/[0.20] bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px] leading-[22px] tracking-[-1px]"
                                            onClick={() => closeModal()}
                                        >

                                            <div className='flex ml-[20px] cursor-pointer' onClick={() => { props.showModalDelete() }}>
                                                <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 mt-[10px]">
                                                    <BsTrashFill className='w-[14px] h-[14px] text-[#FAFAFA]/60' aria-hidden="true" />
                                                </div>
                                                <div className='text-[#FAFAFA] ml-[8px] mt-[11px]'>Eliminar</div>
                                            </div>

                                        </div> <button type="submit" form='editBranch'
                                            className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                <div className='flex ml-[20px]'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                </div>
                                            </button></>
                                            : <button type="submit" form='editBranch'
                                                className="h-[48px]  w-[135px] bg-[#EA683F] rounded-[10px] ml-[24px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                <div className='flex ml-[20px]'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                </div>
                                            </button>}


                                    </div>

                                </Fragment>}

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalEditarBranch;