import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Layout from '../../components/Layout/Layout'
import { useRouter } from 'next/router';
import { FaChevronLeft } from 'react-icons/fa'
import CardMonitor from '../../components/MonitorConfig/CardMonitor'
import { HiOutlineRefresh } from 'react-icons/hi'
import { BsCheck } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { Bars } from 'react-loader-spinner'

const monitor_config = () => {

    const { push } = useRouter();
    const [monitorConfig, setMonitorConfig] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveOK, setSaveOK] = useState(false);

    const navigate = (url) => {
        push(url);
    }


    useEffect(() => {

        async function fetchmonitorconfig() {
            await getMonitorConfig();
        }
        fetchmonitorconfig();

    }, [])


    const getMonitorConfig = async () => {
        setLoading(true)
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}monitorConfig`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });

        setMonitorConfig(response.monitorConfig);
        setLoading(false);

    }


    const handleCallback = (childData) => {
        if (childData && childData.state) {
            getMonitorConfig();
        }

        if (childData && childData.status === 200 && childData.message === "save") {
            setSaveOK(true);
        }
    }


    return (

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

                <div className='flex mt-[10px] mb-[22px] float-right'>
                    <div className='flex cursor-pointer' onClick={() => getMonitorConfig()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>
            <div className='font-bold text-[22px] text-[#FAFAFA] ml-[24px] mt-[12px] mb-[27px]'>
                Configuración de Alertas
            </div>



            {saveOK &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] flex-auto">Actualizado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setSaveOK(false)} />
                    </div>
                </div>
            }

            {loading &&
                <div className='flex justify-center self-center ml-[24px] mt-[24px]'>
                    <Bars color="#FAFAFA" height={80} width={80} />
                </div>
            }{!loading &&
                <div className='m:flex m:flex-wrap m:ml-[24px]'>

                    {monitorConfig && monitorConfig.length > 0 &&
                        monitorConfig.map((config, key) =>


                            <CardMonitor monitor={config} parentCallback={handleCallback} />
                        )
                    }

                    {monitorConfig && monitorConfig.length === 0 &&
                        <div className='flex-wrap text-center'>
                            <span className='text-[24px]'>🤓</span> <span className='text-[16px] font-semibold text-[#FAFAFA]'> No hay información para monitorear... </span>
                        </div>
                    }
                </div>
            }


        </Layout>

    )
}
//funcion para traer datos
export async function getServerSideProps(context) {

    const getSubmodules = async () => {

        const monitor = await new Promise((resolve, reject) => {                 //cambiar gestion de tipos de dispositivos para los permisos
            axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`, { module: "Monitores" }, {
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

        return monitor

    }

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

    if(loginData.user.firstLogin === false){
        return {
            redirect: {
              permanent: false,
              destination: "/firstLogin",
            },
            props:{},
        };
    }


    let submodules = await getSubmodules()

    if (submodules === 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }
    return {
        props: submodules, // will be passed to the page component as props
    }
}

export default monitor_config