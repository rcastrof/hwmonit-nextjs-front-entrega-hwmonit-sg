import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/router";
import EncryptConfig from "/components/Login/utils/encryptConfig"
import { signIn } from "next-auth/react"
import axios from 'axios';

const firstLogin = (props) => {

    const { register, handleSubmit, formState: { errors }, watch, setError, reset } = useForm();
    const { push } = useRouter();
    const [loginError, setLoginError] = useState(null)

    const onSubmit = async (event) => {
        reset({password: "", newPassword: "", confirmPassword: ""})
        const pass = event.password;
        const newPassword = event.newPassword;

        const data = props

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
                            if (error?.response?.status === 401) {
                                push('/')
                            }
                            resolve(error);
                        })
                });
            } else if (autenticar.error) {
                setLoginError("Contraseña Incorrecta")
            }
        }

    };

    return (

        <>

            <div className='login-container'>

                <span className='mt-[-1rem] mb-[0.5rem]'>
                    <Image src="/login.svg" alt="HwMonit Logo" width={167} height={109} />
                </span>

                <div className='bg-white/20 w-80 h-fit pb-4 backdrop-opacity-20 shadow-hw-blue rounded-[10px] flex flex-col font-body'>

                    <span className='font-bold text-white ml-7 mt-4 text-2xl font-body'>
                        Actualiza tu contraseña
                    </span>

                    <p className='text-white ml-7 mt-4 text-base break-words w-[270px]'>
                        Por su seguridad se requiere el cambio de contraseña en tu primer ingreso.
                    </p>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-white/40 mx-7"></div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                        <label className='text-white text-sm flex flex-col mx-7 mt-2'>
                            <span className='mb-0.5'>Contraseña actual:</span>
                            <input {...register("password", {
                                required: { value: true, message: "* Campo Requerido" }, minLength: {
                                    value: 1, message: "El campo no debe quedar vacío",
                                }
                            })} id="password" label="Password" placeholder="Contraseña Actual" name='password' type="password"
                                className={
                                    `login-password-base
                    ${errors.password && "login-password-error"}
                    `} />
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
                                className={
                                    `login-password-base
                    ${errors.newPassword && "login-password-error"}
                    `} />
                        </label>
                        <div className='ml-[24px] leading-[16px] tracking-[-5%] text-[11px] mt-[6px] opacity-60 text-white italic'>Debe poseer al menos un numero y un carácter especial</div>
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
                                className={
                                    `login-password-base
                    ${errors.confirmPassword && "login-password-error"}
                    `} />
                        </label>
                        {errors.confirmPassword && <span className='text-xs text-hw-white ml-7'>{errors.confirmPassword.message}</span>}

                        <div className='flex flex-col'>
                            <button type="submit"
                                className="login-submit">
                                Guardar
                            </button>

                            <span className='text-white text-xs text-center mt-[0.75rem]'>2022 todos los derechos reservados, Meta-X </span>
                        </div>
                    </form>

                </div>

                <span className='text-white text-xs text-center mt-[0.5rem]'>v1.0</span>

            </div>
        </>
    )
}

export default firstLogin

export async function getServerSideProps(context) {

    const firstLogin = async () => {
        const firstLoginData = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}checkFirstLogin/`, { withCredentials: true, headers: {
                Cookie: context.req.headers.cookie}})
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
  
    if(loginData === 401){
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
        props:{},
      };
    }

    return {
        props: loginData
    }

}