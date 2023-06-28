import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { FiUserCheck } from 'react-icons/fi'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from "axios";
import EncryptConfig from "./../Login/utils/encryptConfig"
import { useRouter } from "next/router";

const ModalNewUser = (props) => {
    const { show, onClose } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, getValues } = useForm();
    const [active, setActive] = useState(false)
    const [saveForm, setSaveForm] = useState(true)
    const [listRol, setListRol] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rolId, setRolId] = useState(null);
    const [errorPassword, setErrorPasssword] = useState(null);
    const { push } = useRouter();

    useEffect(() => {

        async function fetchlistRol() {
            await getlistRol();
        }
        fetchlistRol();

    }, [])


    const getlistRol = async () => {
        setLoading(true);
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}configRol`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                    setListRol(response.data.configRol);
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

        if (saveForm && !errorPassword) {
            setSaveForm(false);

            let tempEnpass = await EncryptConfig.encryptLogin(event.user_password);


            let data = {
                name: event.user_name,
                email: event.user_email,
                password: tempEnpass,
                typeUser: event.user_rol

            }


            const resp = await new Promise((resolve, reject) => {
                axios.post(`${process.env.REACT_APP_API_URL}hw_user/`, data, { withCredentials: true })
                    .then(response => {
                        resolve(response);

                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        resolve(error);
                    })
            });

            props.parentCallback({ state: true, status: resp.status, message: "save" });
            reset({ user_name: "", user_email: "", user_password: "", user_passwordConfirm: "", user_rol: "" });
            setSaveForm(true);
            onClose();
        }




    };

    const handleRol = (e) => {

        if (e.target.value !== "") {

            setRolId(e.target.value)

        }

    }

    const closeModal = () => {
        reset({ user_name: "", user_email: "", user_password: "", user_passwordConfirm: "", user_rol: "" });
        setErrorPasssword(null)
        clearErrors()
        onClose();
    }

    const handleCallback = (childData) => {
        setActive(childData);
    }


    const handlePass = (e) => {

        let confirmPass = e.target.value
        let userPass = getValues("user_password")

        if (userPass === confirmPass) {

            setErrorPasssword(false)
        }
        else {
            setErrorPasssword(true)
        }

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
                        <div className="inline-block w-[327px] h-[600px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[1rem] lg:my-[5rem] rounded-[1.875rem]">
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
                                            <FiUserCheck className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                           Registrar usuario
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />


                            {/*Contenido*/}
                            <form onSubmit={handleSubmit(onSubmit)} id="createBranch">
                                <div className="h-[375px]">
                                    <label className='text-white text-sm flex flex-col'>
                                        <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Nombre de usuario</div>
                                        <div className="h-[360px] overflow-y-auto gt-scroll">
                                            <input
                                                {...register("user_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    minLength: { value: 5, message: "* Nombre de usuario debe tener minimo 5 caracteres" },
                                                })}
                                                name='user_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.user_name && <span className='text-xs text-hw-white ml-[24px]'>{errors.user_name.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Correo electrónico</div>
                                            <input
                                                {...register("user_email", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "* Formato inválido" }
                                                })} name='user_email' type="text"
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.user_email && <span className='text-xs text-hw-white ml-[24px]'>{errors.user_email.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] bg-transparent tracking-[-5%] text-[14px] mt-[18px]'>Contraseña</div>
                                            <input
                                                {...register("user_password", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    minLength: { value: 6, message: "* La contraseña debe ser minimo 6 caracteres" },
                                                    pattern: { value: /^(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/, message: "* Formato invalido" }
                                                })} name='user_password' type="password"
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />
                                            <div className=' ml-[24px] leading-[16px] tracking-[-5%] text-[10px] mt-[8px] opacity-60 italic'>Debe poseer al menos un numero y un carácter especial </div>

                                            {errors.user_password && <span className='text-xs text-hw-white ml-[24px]'>{errors.user_password.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]' >Confirmar contraseña</div>
                                            <input
                                                {...register("user_passwordConfirm", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    minLength: { value: 6, message: "* La contraseña debe ser minimo 6 caracteres" },
                                                })} name='user_passwordConfirm' type="password"
                                                onChange={handlePass}
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' />

                                            {errors.user_passwordConfirm && <span className='text-xs text-hw-white ml-[24px]'>{errors.user_passwordConfirm.message}</span>}

                                            {errorPassword && <span className='text-xs text-hw-white ml-[24px]'>* Contraseñas deben ser iguales</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Rol </div>
                                            <select className='ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                                {...register("user_rol", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })}
                                                defaultValue={""}
                                                onChange={(event) => handleRol(event)}>
                                                <option className='bg-black hover:[#262626]' value=""> Seleccionar rol</option>
                                                {listRol && listRol.length > 0 &&
                                                    listRol.map((rol) => {
                                                        return (rol.typeUser !== 'SUPERADMINISTRADOR' && <option className='bg-black' value={rol.typeUser}>{rol.typeUser}</option>)
                                                    })}
                                            </select>

                                            {errors.user_rol && <span className='text-xs  text-hw-white ml-[24px]'>{errors.user_rol.message}</span>}

                                        </div>
                                    </label>
                                </div>
                                <div className='flex mt-[20px]'>
                                            <div
                                                className="h-[48px] w-[135px] border-[2px] border-white/20 bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px] leading-[22px] tracking-[-1px]"
                                                onClick={() => closeModal()}
                                            >

                                                <div className='flex ml-[20px] cursor-pointer'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/20 mt-[10px]">
                                                        <RiCloseFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] mt-[11px]'>Cancelar</div>
                                                </div>

                                            </div>
                                            <button
                                                className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px]" onClick={handleSubmit(onSubmit)}>
                                                <div className='flex ml-[20px]'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/20">
                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px]'>Guardar</div>
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

export default ModalNewUser