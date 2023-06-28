import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { HiOutlineRefresh } from 'react-icons/hi'
import { FaChevronLeft } from 'react-icons/fa'
import { Bars } from 'react-loader-spinner';
import { BsCheck } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { RiAddLine } from 'react-icons/ri'
import { useRouter } from "next/router";
import axios from 'axios';
import CardModule from '../../components/ModuleSettings/CardModule'
import ModalCreateModule from '../../components/ModuleSettings/ModalCreateModule';
import { checkSubmodule } from '../../components/Permission/CheckSubmodules';

function moduleSettings(props) {
    const router = useRouter();
    const { push } = router;

    const [showModal, setShowModal] = useState(false);
    const [modules, setModules] = useState([])
    const [loading, setLoading] = useState(false);
    const [moduleOk, setModuleOk] = useState(false);
    const [subModuleOK, setSubModuleOK] = useState(false);
    const [moduleDelete, setModuleDelete] = useState(false);
    const [subModuleDelete, setSubModuleDelete] = useState(false);
    const [pathOK, setPathOK] = useState(false)
    const [pathError, setPathError] = useState(false)


    const navigate = (url) => {
        push(url);
    }

    useEffect(() => {

        async function fecthInfo() {
            await getInfo();
        }

        fecthInfo();
    }, [])

    const getInfo = async () => {

        setLoading(true);

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}modules_mgr`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });

        setModules(response.modules)
        setLoading(false);
    }

    const handleCallback = (childData) => {
        if (childData && childData.state) {
            getInfo()
        }

        if (childData && childData.status === 200 && childData.message === "saveModule") {
            setModuleOk(true)
        }
        if (childData && childData.status === 200 && childData.message === "saveSubmodule") {
            setSubModuleOK(true)
        }
        if (childData && childData.status === 200 && childData.message === "deleteModule") {
            setModuleDelete(true)
        }
        if (childData && childData.status === 200 && childData.message === "deleteSubmodule") {
            setSubModuleDelete(true)
        }
        if (childData && childData.status === 200 && childData.message === "save") {
            setPathOK(true)
        }
        if (childData && childData.status === 200 && childData.message === "errorPath") {
            setPathError(true)
        }

    }


    return (<>
        <Layout refreshDate='' selected='bg-[#FAFAFA]/20' position="setting">

            <div className='flex-row flow-root'>

                <div className='flex mt-[10px] mb-[12px] float-left'>
                    <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={() => { navigate("/content/permission") }}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
                    </div>
                </div>

                <div className='flex mt-[10px] mb-[22px] float-right'>
                    <div className='flex cursor-pointer' onClick={() => getInfo()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>

            <div className='font-bold text-[24px] text-[#FAFAFA] ml-[24px] mt-[12px] mb-[27px]'>
                Gestión de módulos
            </div>
            {checkSubmodule(props.submodules, 'Crear Módulo') && 
            <div>
                <div className='flex w-[221px] h-[48px] bg-hw-button cursor-pointer rounded-[10px] ml-[24px]  mb-[13px]' onClick={() => setShowModal(true)}>
                    <div className='flex self-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 ml-[16px] mr-[8px]'>
                        <RiAddLine className="self-center text-white w-[24px] h-[24px]" />
                    </div>
                    <div className='self-center text-white text-[16px] font-bold leading-[22px] tracking-[-1%] '>
                        Crear nuevo módulo
                    </div>
                </div>
                <ModalCreateModule show={showModal} onClose={() => setShowModal(false)} parentCallback={handleCallback} />
            </div>}

            {moduleOk &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] flex-auto font-bold">Módulo guardado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setModuleOk(false)} />
                    </div>
                </div>
            }

            {subModuleOK &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] flex-auto font-bold">Submódulo guardado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setSubModuleOK(false)} />
                    </div>
                </div>
            }

            {moduleDelete &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] flex-auto font-bold">Módulo eliminado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setModuleDelete(false)} />
                    </div>
                </div>
            }

            {subModuleDelete &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] flex-auto font-bold">Submódulo eliminado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setSubModuleDelete(false)} />
                    </div>
                </div>
            }

            {pathOK &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] flex-auto font-bold">Modificado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setPathOK(false)} />
                    </div>
                </div>
            }

            
            {pathError &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#DA5151] rounded-b text-[#DA5151] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#DA5151] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] flex-auto font-bold">Error de formato</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setPathError(false)} />
                    </div>
                </div>
            }
            
            {loading &&
                <div className='flex justify-center self-center ml-[24px] mt-[24px]'>
                    <Bars color="#FAFAFA" height={80} width={80} />
                </div>
            }{!loading &&

                <div className='flex mt-[10px] flex-wrap m:ml-[24px]'>
                    {/* Contenido */}

                    {modules && modules.length !== 0 && modules.map((module) =>
                        <CardModule module={module} parentCallback={handleCallback} submodules={props.submodules} roleUser={props.roleUser} reloadData={getInfo} />
                    )}

                </div>}

        </Layout>

    </>


    )
}
export default moduleSettings

export async function getServerSideProps(context) {

    const getSubmodules = async () => {

        const branches = await new Promise((resolve, reject) => {
            axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`, { module: "Panel de Administración" }, {
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

        return branches

    }
    const getRole = async () => {

        const branches = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}checkRole`, {
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

        return branches

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
    let roleUser = await getRole()
    roleUser = roleUser.typeUser

    if (submodules === 401 || roleUser === 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }
    let propsToPerms = {
        submodules: submodules.submodules,
        roleUser
    }
    return {
        props: propsToPerms, // will be passed to the page component as props
    }
}