import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { HiOutlineRefresh } from 'react-icons/hi'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { FiUserCheck } from 'react-icons/fi'
import { BsUiChecks } from 'react-icons/bs'
import { IoMdAddCircle } from 'react-icons/io'
import { useRouter } from "next/router";
import ModalNewUser from '../../components/Permission/ModalNewUser';
import ModalNewRol from '../../components/Permission/ModalNewRol';
import ModalUserRol from '../../components/Permission/ModalUserRol';
import axios from "axios";
import { Bars } from 'react-loader-spinner';
import { BsCheck } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { checkSubmodule } from '../../components/Permission/CheckSubmodules'
const permission = (props) => {

    const { push } = useRouter();
    const [showModalRol, setShowModalRol] = useState(false);
    const [showModalUser, setShowModalUser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [saveOK, setSaveOK] = useState(false);
    const [countRolNull, setCountRolNull] = useState(false);
    const navigate = (url) => {
        push(url);
    }


    useEffect(() => {

        async function fetchRoles() {
            await getRoles();
        }
        async function fetchUsers() {
            await getUsers();
        }
        fetchRoles();
        fetchUsers();

    }, [])


    const getRoles = async () => {
        setLoading(true);
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}configRol`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                    setRoles(response.data.configRol);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });


        setLoading(false);

    }

    const getUsers = async () => {
        setLoading(true);
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}usersNull`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                    setUsers(response.data.usuarios);
                    setCountRolNull(response.data.cuantos)

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });


        setLoading(false);

    }

    const handleCallback = (childData) => {

        if (childData && childData.state) {
            getRoles()
            getUsers()

        }

        if (childData && childData.status === 200 && childData.message === "save") {
            setSaveOK(true);
        }


    }


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

                <div className='flex mt-[10px] mb-[22px] float-right'>
                    <div className='flex cursor-pointer' onClick={() => getRoles()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>

            <div className='font-bold text-[32px] text-hw-white ml-[24px] mt-[12px] mb-[16px]'>
                Permisos
            </div>

            <div className='flex mt-[20px] flex-wrap ml-[24px]'>

                {checkSubmodule(props.submodules, "Gestión de módulos") && <button type="submit"
                    className="h-[48px] w-[187px] bg-white/[0.15] rounded-[10px] mr-[8px] text-[16px] leading-[22px] tracking-[-1px] mb-[8px] " onClick={() => { navigate("/content/module_setting") }}>
                    <div className='flex ml-[8px]'>
                        <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#EA683F]">
                            <BsUiChecks className='w-[17px] h-[17px] text-white' aria-hidden="true" />
                        </div>
                        <div className='text-white ml-[8px]'>Gestionar módulos</div>
                    </div>

                </button>}

                {checkSubmodule(props.submodules, "Crear Usuario") && 
                <div>
                    <button
                        className="h-[48px] w-[172px] bg-white/[0.15] rounded-[10px] mr-[8px] text-[16px] leading-[22px] tracking-[-1px] mb-[8px] " onClick={() => setShowModalUser(true)}>
                        <div className='flex ml-[8px]'>
                            <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#EA683F]">
                                <FiUserCheck className='w-[18px] h-[18px] text-white' aria-hidden="true" />
                            </div>
                            <div className='text-white ml-[8px]'>Registrar usuario</div>
                        </div>
                    </button>
                    <ModalNewUser show={showModalUser} onClose={() => setShowModalUser(false)} parentCallback={handleCallback} />
                </div>}
            </div>

            <div className='flex mt-[20px] flex-wrap ml-[24px]'>

                {users && users.length > 0 && users.find(item => item.typeUser == null) &&
                    <>    <div className='absolute h-[16px] w-[16px] bg-[#E00000] rounded-full left-[210px] '>
                        <div className='text-white ml-[5px] font-bold text-xs '>{countRolNull}</div>
                    </div>
                        {checkSubmodule(props.submodules, "Asignar Usuarios Sin Rol") && 
                        <div>
                            <button type="submit"
                                className="h-[48px] w-[197px] bg-white/[0.15] rounded-[10px] mr-[8px] text-[16px] leading-[22px] tracking-[-1px] mb-[8px] border-[2px] border-solid border-[#E00000]"
                                onClick={() => setShowModal(true)}>

                                <div className='flex ml-[8px]'>

                                    <div className='text-white ml-[8px]'>Usuarios sin Rol asignado</div>

                                </div>
                            </button>
                            <ModalUserRol show={showModal} onClose={() => setShowModal(false)} userList={users} rolesList={roles} parentCallback={handleCallback} />
                        </div>}
                    </>

                }
            </div>

            {saveOK &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] leading-[22px] tracking-[-1px] font-bold  flex-auto">Guardado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setSaveOK(false)} />
                    </div>
                </div>

            }



            {checkSubmodule(props.submodules, "Crear Rol") && <div className='flex mt-[4px] mb-[22px]'>
                <div className='flex-auto'></div>
                <div className='flex cursor-pointer'>

                    <IoMdAddCircle className=' h-[25px] w-[25px] ml-[2px] mt-[2px] text-white' />

                    <div className='text-[16px] leading-[18px] tracking-[-4%] font-bold text-white mt-[3px] ml-[8px] mr-[24px] self-center' onClick={() => setShowModalRol(true)} >Crear nuevo Rol</div>
                    <ModalNewRol show={showModalRol} onClose={() => setShowModalRol(false)} parentCallback={handleCallback} />
                </div>
            </div>}
            <div className='flex mt-[20px] flex-wrap ml-[24px]'>
                {!loading &&

                    <>  {roles && roles.length > 0 && roles.map((item) => {
                        return (item.typeUser !== 'SUPERADMINISTRADOR' || props.roleUser === 'SUPERADMINISTRADOR') && <button
                            onClick={() => push(`/role_settings/${item._id}`)}
                            className="h-[63px] w-[327px] bg-white/[0.15] rounded-[16px] mr-[8px] font-bold text-[16px] leading-[22px] tracking-[-3%] mb-[8px]">
                            <div className='flex ml-[8px]'>

                                <div className='text-white ml-[24px] font-bold '>{item.typeUser}</div>

                                <FaChevronRight className='w-[9px] h-[14px] text-white ml-auto mr-[24px] self-center' aria-hidden="true" />

                            </div>
                        </button>
                    })}</>
                }

            </div>

            {loading &&
                <div className='flex justify-center items-center align mt-[24px]'>
                    <Bars color="#FAFAFA" className="mr-[auto] ml-[auto]" height={80} width={80} />
                </div>
            }

        </Layout>

    </>


    )
}

export default permission
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