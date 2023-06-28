import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Layout from '../../components/Layout/Layout'
import { HiOutlineRefresh } from 'react-icons/hi'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { FiUserCheck } from 'react-icons/fi'
import { BsUiChecks } from 'react-icons/bs'
import { IoMdAddCircle } from 'react-icons/io'
import { useRouter } from "next/router";
import axios from "axios";
import { Bars } from 'react-loader-spinner';
import { BsCheck } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { checkSubmodule } from '../../components/Permission/CheckSubmodules'
import { signIn } from "next-auth/react"
import EncryptConfig from '../../components/Login/utils/encryptConfig'

const profile = ({loginData}) => {

    const { push } = useRouter();
    const [edit, setEdit] = useState(true);
    const [name, setName] = useState(loginData.user.name)
    const [loading, setLoading] = useState(false);
    const [countRolNull, setCountRolNull] = useState(false);
    const [loginError, setLoginError] = useState(null)
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const { register: registerName, 
            handleSubmit: handleSubmitName, 
            formState: { errors: errorsName }, setValue, reset: resetName } = useForm();

    const data = loginData
    const id = data?.user?._id

    const cancelName = () => {
        setEdit(true)
        resetName({profileName: ""})
    }

    const navigate = (url) => {
        push(url);
    }

    const onSubmitName = async (event) => {
        setEdit(true)

        const userName = { userName: event.profileName }

        const resp = await new Promise((resolve, reject) => {
            axios.put(`${process.env.REACT_APP_API_URL}userProfile/${id}`, userName, { withCredentials: true })
                .then(response => {
                    resolve(response);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error)
                    }
                    resolve(error);
                })
        });
        setName(event.profileName)
        resetName({profileName: ""})
    }

    const onSubmit = async (event) => {

        reset({password: "", newPassword: "", confirmPassword: ""})
        const pass = event.password;
        const newPassword = event.newPassword;
        
        const email = data?.user?.email
        const id = data?.user?._id
        let tempEnpass = await EncryptConfig.encryptLogin(pass);
        let tempNewEnPass = await EncryptConfig.encryptLogin(newPassword);

        let passData = {
            password: tempEnpass,
            newPassword: tempNewEnPass
        }


        if (tempEnpass !== "") {
            setLoginError(null)
            const autenticar = await signIn('credentials', {
                redirect: false,
                email: email,
                password: tempEnpass,
            });

            if (autenticar && autenticar.ok) {
                const resp = await new Promise((resolve, reject) => {
                    axios.put(`${process.env.REACT_APP_API_URL}firstLogin/${id}`, passData, { withCredentials: true })
                        .then(response => {
                            resolve(response);
                            push("/logout")
                        }).catch(error => {
                            if (error.response.status === 401) {
                                resolve(error)
                            }
                            resolve(error);
                        })
                });
            } else if (autenticar.error) {
                setLoginError("* Contraseña Incorrecta")
            }
        }

    };

    const dataUser = async () => {
        setLoading(true)
        const data = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}userProfile/${id}`, { withCredentials: true,})
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    push("/")
                    resolve(error);
                })
        });
        setName(data?.user?.name)
        setLoading(false)
    }

    useEffect(() => {
        dataUser()
    }, [])

    return (<>
        <Layout refreshDate='' selected='bg-[#FAFAFA]/20' position="setting">
            <div className='flex-row flow-root'>

                <div className='flex mt-[10px] mb-[12px] float-left'>
                    <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={() => { navigate("/content/setting") }}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
                    </div>
                </div>

                <div className='flex mt-[10px] mb-[22px] float-right' onClick={() => { dataUser() }}>
                    <div className='flex cursor-pointer'>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>

            <div className='font-bold text-[32px] text-hw-white ml-[24px] mt-[12px] mb-[16px]'>
                Mi Perfil
            </div>

            {loading ?
                <div className='flex justify-center items-center align mt-[24px]'>
                    <Bars color="#FAFAFA" className="mr-[auto] ml-[auto]" height={80} width={80} />
                </div> :

            <div className="flex flex-col justify-center p-4 pb-10 content-center items-center">
                <form onSubmit={handleSubmitName(onSubmitName)} className='flex flex-row h-fit w-4/12 min-w-[320px] p-4 bg-white/[0.15] rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%]'>
                    <div className="w-full mr-4">
                        <div className="w-full">
                            <p className='text-white/60 font-medium w-full'>Nombre:</p>
                            {edit ? <p className='text-white font-semibold'>{name}</p>
                                  : 
                                  <>
                                  <input {...registerName("profileName", {
                                    required: { value: true, message: "* Campo Requerido" },
                                    minLength: { value: 3 , message: "* Debe tener mas de 2 caracteres"},
                                    maxLength: { value: 30, message: "* No debe tener mas de 30 caracteres"}
                                  })}
                                           className=' text-white font-semibold focus:outline-none w-full
                                         bg-white/25 focus:border-blue-600 border-solid p-1 border-2 text-base rounded-[10px]' 
                                           type="text" autoFocus placeholder="Ingrese nombre" id="profileName" label="profileName" name="profileName"
                                           />
                                           {errorsName.profileName && <span className='text-xs text-hw-white ml-7'>{errorsName.profileName.message}</span>}          
                                           </>
                            }
                        </div>
                        <div className="mt-4 mb-4 w-full">
                            <p className='text-white/60 font-medium w-full'>Email:</p>
                            <p className='text-white font-semibold w-full break-words'>{data.user.email}</p>
                        </div>
                        <div>
                            <p className='text-white/60 font-medium w-full'>Tipo de usuario:</p>
                            <p className='text-white font-semibold w-full break-words'>{data.user.typeUser}</p>
                        </div>
                    </div>
                    <div className='w-20 pr-2 pt-4 h-[10px]'>
                        {edit 
                              ? <div onClick={() => setEdit(!edit)} className='text-[#EA683F] hover:cursor-pointer font-semibold'>Editar</div> 
                              : 
                              <>
                                <button type='submit' className='text-[#EA683F] font-semibold'>Guardar</button>
                                <button onClick={() => cancelName()} className='text-white/60 mt-[10px] font-semibold'>Cancelar</button>
                              </>
                        }
                    </div>
                </form>
                <div className='bg-white/[0.15] w-4/12 min-w-[320px] h-fit pb-4 rounded-[10px] flex flex-col font-body'>
                    <div className="block p-2 mt-4 ml-5">
                        <p className="text-white font-bold text-[18px]">Cambiar contraseña</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" autoComplete="off" >

                        <label className='text-white text-sm flex flex-col mx-7 mt-2'>
                            <span className='mb-0.5'>Contraseña actual:</span>
                            <input {...register("password", {
                                required: { value: true, message: "* Campo Requerido" }, minLength: {
                                    value: 1, message: "El campo no debe quedar vacío",
                                }
                            })} id="password" label="Password" placeholder="Contraseña Actual" name='password' type="password"
                                className={`login-password-base ${errors.password && "login-password-error"}`} />
                        </label>
                        {errors.password && <span className='text-xs text-hw-white ml-7'>{errors.password.message}</span>}
                        {loginError && <span className='text-xs text-hw-white ml-7 '>{loginError}</span>}

                        <label className='text-white text-sm flex flex-col mx-7 mt-2'>
                            <span className='mb-0.5'>Nueva contraseña:</span>
                            <input {...register("newPassword", {
                                required: { value: true, message: "* Campo Requerido" },
                                minLength: { value: 6, message: "* La contraseña debe ser minimo 6 caracteres", },
                                pattern: { value: /^(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/, message: "* Formato invalido" }
                            })} id="newPassword" label="newPassword" placeholder="Nueva Contraseña" name='newPassword' type="password"
                                className={`login-password-base ${errors.newPassword && "login-password-error"} `} />
                        </label>
                        <div className='flex justify-self-end self-end mr-5 leading-[16px] tracking-[-5%] text-[11px] mt-[6px] opacity-60 text-white italic'>Debe poseer al menos un numero y un carácter especial</div>
                        {errors.newPassword && <span className='text-xs text-hw-white ml-7'>{errors.newPassword.message}</span>}

                        <label className='text-white text-sm flex flex-col mx-7 mt-2'>
                            <span className='mb-0.5'>Confirmar nueva contraseña:</span>
                            <input {...register("confirmPassword", {
                                required: { value: true, message: "* Campo Requerido" },
                                minLength: { value: 1, message: "* El campo no debe quedar vacío" },
                                validate: (val) => {
                                    if (watch("newPassword") !== val) {
                                        return "* Las contraseñas no coinciden"
                                    }
                                }
                            })} id="confirmPassword" label="confirmPassword" placeholder="Confirmar Nueva Contraseña" name='confirmPassword' type="password"
                                className={`login-password-base ${errors.confirmPassword && "login-password-error"} `} />
                        </label>
                        {errors.confirmPassword && <span className='text-xs text-hw-white ml-7'>{errors.confirmPassword.message}</span>}

                        <div className='flex flex-col'>
                            <button type="submit"
                                className="login-submit">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>}

        </Layout>

    </>


    )
}

export default profile

export async function getServerSideProps(context) {

    const firstLogin = async () => {
        const firstLoginData = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}checkFirstLogin/`, {
                withCredentials: true, headers: {
                    Cookie: context.req.headers.cookie
                }
            })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
        });

        return firstLoginData
    }


    let loginData = await firstLogin()

    if (loginData === 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }

    if (loginData.user.firstLogin === false) {
        return {
            redirect: {
                permanent: false,
                destination: "/firstLogin",
            },
            props: {},
        };
    }

    return {
        props: {loginData: loginData},
    }
}