import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiContactsBookFill } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from "axios";
import { BsTrashFill } from 'react-icons/bs'
import { Bars } from 'react-loader-spinner';
import ModalDelete from "../Branch/ModalDelete";
import { useRouter } from "next/router";

const ModalContact = (props) => {

    const { show, onClose, details, idBranch, loading, creation } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm();
    const [active, setActive] = useState(false)
    const [saveForm, setSaveForm] = useState(true)
    let timeOptions = { year: "numeric", month: "long", day: "numeric" };
    const [dateUpdate, setDateUpdate] = useState(null)
    const { push } = useRouter();

    useEffect(() => {
        setDateUpdate(new Date(props.details.creation_date).toLocaleString("es-ES", timeOptions))
    }, [props.details.creation_date])

    const onSubmit = async (event) => {

        if (saveForm && (details._id == null || details._id == undefined)) {
            setSaveForm(false);
            const contact_name = event.contact_name;
            const contact_label = event.contact_label;
            const contact_address = event.contact_address;
            const contact_main_phone = event.contact_main_phone;
            const contact_email = event.contact_email;



            const data = {
                name: contact_name,
                label: contact_label,
                address: contact_address,
                main_phone: contact_main_phone,
                email: contact_email
            }




            const listDetails = await new Promise((resolve, reject) => {
                axios.post(`${process.env.REACT_APP_API_URL}contact/${idBranch}`, data, { withCredentials: true })
                    .then(response => {
                        resolve(response);

                    }).catch(error => {
                        if (error.response.status === 401) {
                           push('/')
                        }
                        resolve(error);
                    })
            });

            props.parentCallback({ state: true, status: listDetails.status, message: "contactSave" });
            reset({ contact_name: "", contact_label: "", contact_address: "", contact_main_phone: "", contact_email: "" });
            setSaveForm(true);
            onClose();
        }
        else {
            if (saveForm) {

                setSaveForm(false);
                const contact_name = event.contact_name;
                const contact_label = event.contact_label;
                const contact_address = event.contact_address;
                const contact_main_phone = event.contact_main_phone;
                const contact_email = event.contact_email;



                const data = {
                    name: details.name,
                    label: contact_label,
                    address: contact_address,
                    main_phone: contact_main_phone,
                    email: contact_email,
                    creation_date: details.creation_date
                }




                const listDetails = await new Promise((resolve, reject) => {
                    axios.put(`${process.env.REACT_APP_API_URL}contact/${details._id}`, data, { withCredentials: true })
                        .then(response => {
                            resolve(response);

                        }).catch(error => {
                            if (error.response.status === 401) {
                                push('/')
                            }
                            resolve(error);
                        })
                });

                props.parentCallback({ state: true, status: listDetails.status, message: "contactUpdate" });
                reset({ contact_name: "", contact_label: "", contact_address: "", contact_main_phone: "", contact_email: "" });
                setSaveForm(true);
                onClose();


            }

        }



    };

    const handleCallback = (childData) => {
        if (childData && childData.state) {

            props.parentCallback(childData);
        }
    }




    const closeModal = () => {

        setValue('contact_name', details.name, { shouldDirty: true })
        setValue('contact_label', details.label, { shouldDirty: true })
        setValue('contact_address', details.address, { shouldDirty: true })
        setValue('contact_main_phone', details.main_phone, { shouldDirty: true })
        setValue('contact_email', details.email, { shouldDirty: true })

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
                        <div className="inline-block w-[327px] h-[635px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[0.5rem] lg:my-[3rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]/60' aria-hidden="true" />
                                        </div>
                                    </div>

                                    {/**add icon */}
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <RiContactsBookFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                        Contacto
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

                                <div className="h-[350px] overflow-auto gt-scroll">

                                    {/*Contenido*/}
                                    <form onSubmit={handleSubmit(onSubmit)} id="createContact">
                                        <label className='text-black text-sm flex flex-col'>
                                        <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]  mt-[18px]  text-white'>Nombre</div>
                                            {details.name ? <input
                                                name='contact_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] text-[#FAFAFA] rounded-[9px] w-[279px] h-[40px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off'
                                                defaultValue={details.name}
                                                disabled /> : <input
                                                {...register("contact_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })}
                                                name='contact_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[40px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white text-[#FAFAFA]"
                                                autoComplete='off'
                                            />
                                            }
                                            {errors.contact_name && <span className='text-xs text-[#FFFFFF] ml-[24px]'>{errors.contact_name.message}</span>}
                                            
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-white'>Etiqueta</div>
                                            <input
                                                {...register("contact_label", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='contact_label' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[40px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white text-[#FAFAFA]"
                                                defaultValue={details.label}
                                                autoComplete='off' />
                                            {errors.contact_label && <span className='text-xs text-[#FFFFFF] ml-[24px]'>{errors.contact_label.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-white'>Dirección</div>
                                            <input
                                                {...register("contact_address", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='contact_address' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[40px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white text-[#FAFAFA]"
                                                defaultValue={details.address}
                                                autoComplete='off' />
                                            {errors.contact_address && <span className='text-xs text-[#FFFFFF] ml-[24px]'>{errors.contact_address.message}</span>}
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-white'>Teléfono</div>
                                            <input
                                                {...register("contact_main_phone", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    pattern: { value: /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/i, message: "* Formato inválido" }
                                                })} name='contact_main_phone' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[40px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white text-[#FAFAFA]"
                                                defaultValue={details.main_phone}
                                                autoComplete='off' />
                                            {errors.contact_main_phone && <span className='text-xs text-[#FFFFFF] ml-[24px]'>{errors.contact_main_phone.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] text-white'>Email</div>
                                            <input
                                                {...register("contact_email", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "* Formato inválido" }
                                                })} name='contact_email' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[40px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white text-[#FAFAFA]"
                                                defaultValue={details.email}
                                                autoComplete='off' />
                                            {errors.contact_email && <span className='text-xs text-[#FFFFFF] ml-[24px]'>{errors.contact_email.message}</span>}


                                        </label>



                                    </form>

                                </div>}

                            {!(details._id == null || details._id == undefined) ? <div className='mb-[8px] ml-[24px] leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px] opacity-[0.6] font-semibold text-[#FAFAFA]'>
                                Fecha Creación:<br></br> {dateUpdate}</div>
                                : null}

                            <div className='flex mt-[20px]'>
                                {!(details._id == null || details._id == undefined) ? <div
                                    className="h-[48px] w-[135px] border-[2px] border-white/[0.20] bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px]  leading-[22px] tracking-[-1px]"
                                    onClick={() => closeModal()}
                                >

                                    <div className='flex ml-[20px] cursor-pointer' onClick={() => { props.showModalDelete() }}>
                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 mt-[10px]">
                                            <BsTrashFill className='self-center w-[14px] h-[14px] text-[#FAFAFA]/60' />
                                        </div>

                                        <div className='text-[#FAFAFA] ml-[8px] mt-[11px] self-center'>Eliminar</div>

                                    </div>

                                </div> : null}
                                {!(details._id == null || details._id == undefined) ? <button type="submit"
                                    className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] text-[16px] leading-[22px] tracking-[-1px]"
                                    onClick={handleSubmit(onSubmit)}>
                                    <div className='flex ml-[20px]' >
                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                            <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                        </div>
                                        <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                    </div>
                                </button> : <button type="submit"
                                    className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[auto] ml-[auto] text-[16px] leading-[22px] tracking-[-1px] mt-[3.5rem]"
                                    onClick={handleSubmit(onSubmit)}>
                                    <div className='flex ml-[20px]'>
                                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                            <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                        </div>
                                        <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                    </div>
                                </button>}

                            </div>


                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalContact;