import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { RiMapPinAddLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import HwSwitch from '../HwSwitch'
import axios from "axios";
import { useRouter } from "next/router";
const ModalCreateBranch = (props) => {

    const { show, onClose } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm();
    const [active, setActive] = useState(false)
    const [saveForm, setSaveForm] = useState(true)
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [zoneId, setZoneId] = useState(null);
    const { push } = useRouter();

    useEffect(() => {

        async function fetchZones() {
            await getZones();
        }
        fetchZones();

    }, [])


    const getZones = async () => {
        setLoading(true);
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}zonelist`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                    setZones(response.data.zone);
                }).catch(error => {
                    if (error.response.status === 401) {
                       push('/')
                    }
                    resolve(error);
                })
        });


        setLoading(false);

    }


    const onSubmit = async (event) => {

        if (saveForm) {
            setSaveForm(false);

            const data = {
                name: event.branch_name,
                active: active,
                label: event.branch_label,
                long: event.branch_long,
                lat: event.branch_lat,
                zone_id: event.branch_zoneId
            }



            const listDetails = await new Promise((resolve, reject) => {
                axios.post(`${process.env.REACT_APP_API_URL}createbranch`, data, { withCredentials: true })
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
            reset({ branch_name: "", branch_label: "", branch_long: "", branch_lat: "" });
            setSaveForm(true);
            onClose();
        }

    };

    const handleZone = (e) => {

        if (e.target.value !== "") {

            setZoneId(e.target.value)

        }

    }

    const closeModal = () => {
        reset({ branch_name: "", branch_label: "", branch_long: "", branch_lat: "" });
        clearErrors()
        onClose();
    }

    const handleCallback = (childData) => {
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
                        <div className="inline-block w-[327px] h-[605px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[2.5rem] m:my-[2rem] rounded-[1.875rem]">
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
                                            <RiMapPinAddLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                           Crear sucursal
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/[0.10] border-none h-[8px] mb-[16px]' />

                            <div className="h-[360px]">

                                {/*Contenido*/}
                                <form onSubmit={handleSubmit(onSubmit)} id="createBranch">
                                    <div className="h-[350px] overflow-auto gt-scroll">
                                        <label className='text-[#FAFAFA] text-sm flex flex-col'>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] text-[#FAFAFA]'>Nombre de Sucursal</div>
                                            <input
                                                {...register("branch_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='branch_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.branch_name && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.branch_name.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA]'>Etiqueta de Sucursal</div>
                                            <input
                                                {...register("branch_label", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='branch_label' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.branch_label && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.branch_label.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA]'>Longitud</div>
                                            <input
                                                {...register("branch_long", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    pattern: { value: /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/, message: "* Formato Inválido" },
                                                })} name='branch_long'
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.branch_long && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.branch_long.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-[#FAFAFA]'>Latitud</div>
                                            <input
                                                {...register("branch_lat", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    pattern: { value: /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/, message: "* Formato Inválido" }
                                                })} name='branch_lat'
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.branch_lat && <span className='text-xs text-[#FAFAFAFA] ml-[24px]'>{errors.branch_lat.message}</span>}

                                            <div className='mt-[20px] flex'>
                                                <div className='ml-[24px] mr-[8px] text-[16px] leading-[21.79px] tracking-[-5%] self-center text-[#FAFAFA]'>Inactivo</div>
                                                <HwSwitch parentCallback={handleCallback} />
                                                <div className='self-center ml-[8px] text-[#84BD00] text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                            </div>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Zona </div>
                                            <select className='ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                                {...register("branch_zoneId", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })}
                                                defaultValue={""}
                                                onChange={(event) => handleZone(event)}>
                                                <option className='bg-black hover:[#262626]' value=""> Seleccionar zona</option>
                                                {zones && zones.length > 0 &&
                                                    zones.map((zone) => {
                                                        return (<option className='bg-black' value={zone._id}>{zone.label}</option>) //editar
                                                    })}
                                            </select>
                                            {errors.branch_zoneId && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.branch_zoneId.message}</span>}

                                        </label>

                                    </div>
                                    <div className='flex mt-[30px]'>
                                        <div
                                            className="h-[48px] w-[135px] border-[2px] border-white/[0.20] bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px] leading-[22px] tracking-[-1px]"
                                            onClick={() => closeModal()}
                                        >

                                            <div className='flex ml-[20px] cursor-pointer'>
                                                <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 mt-[10px]">
                                                    <RiCloseFill className='w-[14px] h-[14px] text-[#FFFFFF]/60' aria-hidden="true" />
                                                </div>
                                                <div className='text-[#FAFAFA] ml-[8px] mt-[11px]'>Cancelar</div>
                                            </div>

                                        </div>
                                        <button type="submit"
                                            className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] text-[16px] leading-[22px] tracking-[-1px] ">
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

export default ModalCreateBranch;