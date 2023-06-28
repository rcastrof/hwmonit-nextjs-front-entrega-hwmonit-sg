import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { FaChevronLeft } from 'react-icons/fa'
import { useRouter } from "next/router";
import ModalNewUser from '../../components/Permission/ModalNewUser';
import ModalNewRol from '../../components/Permission/ModalNewRol';
import ModalUserRol from '../../components/Permission/ModalUserRol';
import axios from "axios";
import { checkSubmodule } from '../../components/Permission/CheckSubmodules'
import AccordionLayout from '../../components/AdminReport/AccordionLayout'
import CardFiles from '../../components/AdminReport/FilesComponent/CardFiles'
import CardPackages from '../../components/AdminReport/PackagesComponent/CardPackages'
import SettingCard from '../../components/AdminReport/SettingsComponent/SettingCard'
import useWindowDimensions from '../../components/AdminReport/useWindowDimensions';
import useDidMountEffect from '../../components/AdminReport/useDidMountEffect';
import RightLayout from '../../components/AdminReport/RightLayout';
import ModalCreateNewVersion from '../../components/AdminReport/ModalCreateNewVersion';
import { Bars } from 'react-loader-spinner';
import { data } from 'autoprefixer';
import { RiAddLine } from 'react-icons/ri';
import { HiOutlineRefresh } from 'react-icons/hi';


const adminReport = (props) => {

    // Estado para manejar los datos del script
    const [operatingSystem, setOperatingSystem] = useState("windows");
    const [version, setVersion] = useState({ version: "1.0.0" })
    const [dateScript, setDateScript] = useState()
    const [files, setFiles] = useState([])
    const [packages, setPackages] = useState([])
    const [settingProperty, setSettingProperty] = useState([])
    const [settingHeader, setSettingHeader] = useState([])
    const [selectOperatingSystem, setSelectOperatingSystem] = useState({ operating_system: "windows", new_version: false })

    // Hook que obtiene las dimensiones de la pantalla para el layout
    const { height, width } = useWindowDimensions()

    // Estados para manejar los modales
    const { push } = useRouter();
    const [showModalRol, setShowModalRol] = useState(false);
    const [showModalUser, setShowModalUser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFiles, setShowFiles] = useState(false);
    const [showPackages, setShowPackages] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado para manejar los caracteristicas del usuario
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [saveOK, setSaveOK] = useState(false);
    const [countRolNull, setCountRolNull] = useState(false);
    const [loadingVersion, setLoadingVersion] = useState(true);

    const submodules = props.submodules

    // Funcion para mostrar mostrar la tarjeta seleccionada y ocultar las demas
    const handleShow = (title) => {
        if (title === "Archivos") {
            setShowFiles(!showFiles)
            setShowPackages(false)
            setShowSettings(false)
        } else if (title === "Paquetes") {
            setShowPackages(!showPackages)
            setShowFiles(false)
            setShowSettings(false)
        } else if (title === "Configuración") {
            setShowSettings(!showSettings)
            setShowFiles(false)
            setShowPackages(false)
        }
    }

    const navigate = (url) => {
        push(url);
    }

    const createNewVersion = (exists = true, newVersionState = "1.0.0") => {
        if(exists){
            if(newVersionState === "1.0.0"){
                let versionArray = version.version.split(".")

                versionArray[0] = (parseInt(versionArray[0]) + 1).toString()
                versionArray[1] = "0"
                versionArray[2] = "0"
                setVersion({ version: versionArray.join(".") })
            }else{
                let versionArray = newVersionState.split(".")

                versionArray[0] = (parseInt(versionArray[0]) + 1).toString()
                versionArray[1] = "0"
                versionArray[2] = "0"
                setVersion({ version: versionArray.join(".") })
            }
        } else {
            setVersion({ version: "1.0.0" })
        }
        setDateScript(new Date().toLocaleDateString("en-GB"))
        setFiles([])
        setPackages([])
        setSettingProperty([])
        setSettingHeader([])
        setLoadingVersion(true);
    }

    // Funcion para tranformar objetos base64 a blob
    function base64toBlob(base64Data, contentType) {
        contentType = contentType || '';
        let sliceSize = 1024;
        let byteCharacters = atob(base64Data);
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);

        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);

            let bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    // Funcion para transformar objetos files o blob a base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // Funcion que enviara una nueva version, se ejecuta cada vez que se agrega, elimina o modifica un elemento
    const sendNewVersion = async () => {

        if (loadingVersion) {

            let NewData
            settingProperty.forEach(({ name, property }) => {
                NewData = { ...NewData, [name]: property }
            })
            const headers = settingHeader.map((header) => ({
                key: header.key,
                value: header.value
            }))

            const archivos = await Promise.all(files.map(async (file) => ({
                id: file.id,
                file_name: file.name,
                path: file.path,
                script: await toBase64(file.data).then((data) => data.substr(data.indexOf(",") + 1))
            })))

            const data = {
                version: version.version,
                operating_system: selectOperatingSystem.operating_system,
                files: archivos,
                packages: packages,
                config_script: { ...NewData, headers: [...headers] }
            }

            const listDetails = await new Promise((resolve, reject) => {
                axios.post(`${process.env.REACT_APP_API_URL}update_hwmonit_data/${selectOperatingSystem.operating_system}`, data, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            resolve(error.response.status)
                        }
                        resolve(error);
                    })
            });
        } else {
            setLoadingVersion(true)
        }


    }

    useEffect(() => {
        async function fetchRoles() {
            await getRoles();
        }
        async function fetchUsers() {
            await getUsers();
        }
        async function fetchScript() {
            await getScript();
        }
        fetchRoles();
        fetchUsers();
        fetchScript();
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
                        resolve(error.response.status)
                        push("/")
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
                        resolve(error.response.status)
                        push("/")
                    }
                    resolve(error);
                })
        });


        setLoading(false);

    }

    const getScript = async (newVersion = false) => {
        setLoading(true);
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}update_hwmonit_data/${selectOperatingSystem.operating_system}`, { withCredentials: true })
                .then(response => {
                    const data = response.data.monitor_script

                    const creationDate = new Date(data.creation_date)
                    const newDate = creationDate.toLocaleDateString("en-GB")
                    setDateScript(newDate)

                    if(newVersion){
                        createNewVersion(true, data.version)
                    }else{
                        setVersion({ version: data.version })
                    

                        const dataPackages = data.packages
                        setPackages(dataPackages.map((data, index) => ({
                            id: index + 1,
                            package_name: data.package_name,
                            package_version: data.package_version
                        })))

                        //Separar las propiedades , de los headers
                        let config = data.config_script
                        const dataHeaders = config.headers
                        delete config.headers

                        setSettingHeader(dataHeaders.map((data, index) => ({
                            id: index + 1,
                            key: data.key,
                            value: data.value
                        })))

                        const configSet = Object.entries(config)
                            .map(([key, value], index) => ({ id: index + 1, name: key, property: value }))
                        setSettingProperty(configSet)

                        const dataFiles = data.files

                        setFiles(dataFiles.map((data, index) => ({
                            id: index + 1,
                            name: data.file_name,
                            path: data.path,
                            data: base64toBlob(data.script, "")
                        })))
                    }

                }).catch(error => {
                    resolve(error)
                    if (error?.response?.status === 401) {
                        push("/")
                    }
                    createNewVersion(false)
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

    const getData = (newVersion = false) => {
        setLoadingVersion(false)
        getScript(newVersion)
        getRoles()
    }

    const handleOperatingSystem = (event) => {
        setSelectOperatingSystem({ operating_system: event.target.value, new_version: false })
    }

    useDidMountEffect(() => {
        if(selectOperatingSystem.new_version){
            getData(true)
        } else {
            getData()
        }
    },[selectOperatingSystem])

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
                    <div className='flex cursor-pointer' onClick={() => getData()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>
            <div className='font-bold text-[32px] text-hw-white ml-[24px] mt-[12px] mb-[16px]'>
                Administrador report
            </div>

            {checkSubmodule(props.submodules, "Crear Nueva Versión") &&
                <button onClick={() => setShowModal(true)} className='flex flex-row items-center content-center bg-[#EA683F] p-[5px] ml-[20px]  h-[50px] rounded-[10px] w-[230px] mb-[20px]'>
                    <RiAddLine className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                            w-[20px] h-[20px] 
                            rounded-[10px] text-[16px] text-white
                            bg-white/[0.15]
                            "/>
                    <p className="text-white">
                        Crear nueva versión
                    </p>
                </button>}
            <ModalCreateNewVersion show={showModal} onClose={() => setShowModal(false)} setOperatingSystem={setOperatingSystem} operatingSystem={operatingSystem}  setSelectOperatingSystem={setSelectOperatingSystem} selectOperatingSystem={selectOperatingSystem} createNewVersion={createNewVersion} getData={getData}/>
            {loading ? (<div className='flex justify-center items-center align mt-[24px]'>
                <Bars color="#FAFAFA" className="mr-[auto] ml-[auto]" height={80} width={80} />
            </div>) : (<div className="flex flex-row space-x-2">
                <div className="flex flex-wrap flex-col w-[350px] pl-[20px] space-y-2 pb-[30px]">

                    {/* Card Operating System */}
                    {checkSubmodule(props.submodules, "Sistemas Operativos") &&
                        <div className="flex flex-col mt-[8px] justify-start h-[75px] w-[340px] bg-white/[0.15] rounded-[10px] text-[16px] leading-[22px] tracking-[-1px]">
                            <div className='flex ml-[10px] items-center'>
                                <div className='text-white/60 ml-[12px] mt-[10px] text-[18px] font-medium'>Elije un sistema operativo:</div>
                            </div>
                            <div className="flex justify-around w-[200px] mt-[4px] ml-[10px]">
                                <div className="flex items-center space-x-2">
                                    <input onClick={(event) => handleOperatingSystem(event)} onChange={() => {}} type="radio" id="windowsOS" name="os" value="windows" className="w-5 h-5 accent-white" checked={selectOperatingSystem.operating_system === "windows"}/>
                                    <label htmlFor="windowsOS" className="text-white font-semibold hover:cursor-pointer hover:font-bold">
                                        Windows
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input onClick={(event) => handleOperatingSystem(event)} onChange={() => {}} type="radio" id="linuxOS" name="os" value="linux" className="w-5 h-5 accent-white" checked={selectOperatingSystem.operating_system === "linux"}/>
                                    <label htmlFor="linuxOS" className="text-white font-semibold hover:cursor-pointer hover:font-bold">
                                        Linux
                                    </label>
                                </div>
                            </div>
                        </div>
                    }

                    {/* Card Version and Date */}

                    {checkSubmodule(props.submodules, "Versión") &&
                        <div className="flex flex-col justify-start h-[75px] w-[340px] bg-white/[0.15] rounded-[10px] text-[16px] leading-[22px] tracking-[-1px]">
                            <div className="flex flex-row">
                                <p className='text-white/60 ml-[12px] mt-[10px] text-[18px] font-medium'>versión:</p>
                                <p className='text-white ml-[12px] mt-[10px] font-bold' >{version.version}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className='text-white/60 ml-[12px] mt-[10px] text-[18px] font-medium'>Fecha de creación:</p>
                                <p className='text-white ml-[12px] mt-[10px] font-bold' >{dateScript}</p>
                            </div>
                        </div>}

                    {/* Card Files */}

                    {checkSubmodule(props.submodules, "Archivos") &&
                        <AccordionLayout
                            className="m-[10px]"
                            title={"Archivos"}
                            children={<CardFiles
                                files={files}
                                setFiles={setFiles}
                                version={version}
                                setVersion={setVersion}
                                sendNewVersion={sendNewVersion}
                                submodules={submodules} />
                            }
                            show={showFiles}
                            handleShow={handleShow}
                            sizeHeight={height}
                            sizeWidth={width}
                        ></AccordionLayout>}

                    {/* Card Packages */}

                    {checkSubmodule(props.submodules, "Paquetes") &&
                        <AccordionLayout
                            className="m-[10px]"
                            title={"Paquetes"}
                            children={<CardPackages
                                packages={packages}
                                setPackages={setPackages}
                                version={version}
                                setVersion={setVersion}
                                sendNewVersion={sendNewVersion}
                                submodules={submodules} />
                            }
                            show={showPackages}
                            handleShow={handleShow}
                            sizeHeight={height}
                            sizeWidth={width}
                        ></AccordionLayout>}

                    {/* Card Configuration */}

                    {checkSubmodule(props.submodules, "Configuración") &&
                        <AccordionLayout
                            className="m-[10px]"
                            title={"Configuración"}
                            children={<SettingCard
                                settingProperty={settingProperty}
                                setSettingProperty={setSettingProperty}
                                settingHeader={settingHeader}
                                setSettingHeader={setSettingHeader}
                                version={version}
                                setVersion={setVersion}
                                sendNewVersion={sendNewVersion}
                                submodules={submodules} />
                            }
                            show={showSettings}
                            handleShow={handleShow}
                            sizeHeight={height}
                            sizeWidth={width}
                        ></AccordionLayout>}
                </div>
                <div className="mt-[2px]">
                    {width >= 768 && (
                        <div className="ml-[40px]">
                            {/* Card Files */}

                            {checkSubmodule(props.submodules, "Archivos") &&
                                <RightLayout
                                    className="m-[10px]"
                                    title={"Archivos"}
                                    children={<CardFiles
                                        files={files}
                                        setFiles={setFiles}
                                        version={version}
                                        setVersion={setVersion}
                                        sendNewVersion={sendNewVersion}
                                        submodules={submodules} />
                                    }
                                    show={showFiles}
                                    setShow={setShowFiles}
                                    sizeHeight={height}
                                    sizeWidth={width}
                                ></RightLayout>}

                            {/* Card Packages */}

                            {checkSubmodule(props.submodules, "Paquetes") &&
                                <RightLayout
                                    className="m-[10px]"
                                    title={"Paquetes"}
                                    children={<CardPackages
                                        packages={packages}
                                        setPackages={setPackages}
                                        version={version}
                                        setVersion={setVersion}
                                        sendNewVersion={sendNewVersion}
                                        submodules={submodules} />
                                    }
                                    show={showPackages}
                                    setShow={setShowPackages}
                                    sizeHeight={height}
                                    sizeWidth={width}
                                ></RightLayout>}

                            {/* Card Configuration */}

                            {checkSubmodule(props.submodules, "Configuración") &&
                                <RightLayout
                                    className="m-[10px]"
                                    title={"Configuración"}
                                    children={<SettingCard
                                        settingProperty={settingProperty}
                                        setSettingProperty={setSettingProperty}
                                        settingHeader={settingHeader}
                                        setSettingHeader={setSettingHeader}
                                        version={version}
                                        setVersion={setVersion}
                                        sendNewVersion={sendNewVersion}
                                        submodules={submodules} />
                                    }
                                    show={showSettings}
                                    setShow={setShowSettings}
                                    sizeHeight={height}
                                    sizeWidth={width}
                                ></RightLayout>}
                        </div>
                    )}
                </div>
            </div>)}

        </Layout>

    </>)
}

export default adminReport

export async function getServerSideProps(context) {

    const getSubmodules = async () => {

        const branches = await new Promise((resolve, reject) => {
            axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`, { module: "Gestión Reporte" }, {
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