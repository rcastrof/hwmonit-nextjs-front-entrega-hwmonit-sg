import Layout from '../../components/Layout/Layout'
import {FaChevronLeft, FaChevronDown} from 'react-icons/fa'
import {RiAddLine} from 'react-icons/ri'
import {HiOutlineRefresh} from 'react-icons/hi'
import { useRouter } from "next/router";
import CardDeviceSetting from '../../components/DeviceSetting/CardDeviceSetting';
import { useEffect, useState, useRef } from 'react';
import { Bars } from 'react-loader-spinner';
import axios from 'axios';
import { BsCheck } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { BiSliderAlt, BiCloudDownload } from 'react-icons/bi'
import { checkSubmodule } from '../../components/Permission/CheckSubmodules';
import ModalCreateDeviceType from '../../components/DeviceSetting/ModalCreateDevice';
import FilterDeviceModal from '../../components/DeviceSetting/FilterDeviceModal '
import { CSVLink } from 'react-csv'

export default function deviceType(props) {

    const {push} = useRouter();
    const [devices, setdevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saveOK, setSaveOK] = useState(false);
    const [deleteOK, setDeleteOK] = useState(false);
    const [deleteAssigned, setDeleteAssigned] = useState(false);
    const [copyTokenOk, setCopyTokenOk] = useState(false)
    //estados para el filtro
    const [showFilterDeviceModal, setShowFilterDeviceModal] = useState(false)
    const [deviceType, setDeviceType] = useState([])
    const [deviceTypeSelected, setDeviceTypeSelected] = useState('')
    const [filename, setFileName] = useState('Informe general')
    const [deviceTypeId, setDeviceTypeId] = useState(null)
    const [isFiltered, setIsFiltered] = useState(false)
    
    //CSV
    const csvData = []
    const csvLinkEl = useRef();
    const [download, setDownload] = useState(false)

    //paginación
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(2)
    const [loadingMore, setLoadingMore] = useState(false)
    const [filter, setFilter] = useState(null)
    let offset = 0
    
    const headers =
     [
         { key: "name", label: "Nombre de dispositivo" },
         { key: "label", label: "Tipo de dispositivo" },
         { key: "token", label: "Token" },
     ]

    const navigate = (url) => {
        push(url);
     }

    //Armado de CSV
    devices.map((el) => {
        let name = el.label
        let label = el.device_type
        let token = el.token
        let buildData = { name: name, label: label, token: token }
        csvData.push(buildData)
    })

     useEffect(() => {

        async function fetchdevices() {
            await getDevices();
            await getDevicesType()
        }
        fetchdevices();
    
      }, [])

    const getDevices = async (devicesFilter = null) => {
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}allDevice/${filter}?limit=${process.env.LIMIT_DEVICES}&offset=${offset}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
                
        });

        setdevices(current => [...current, ...response.responseDevices])
        let count = response.responseDevices.length
        setCount(count)
        setFilter(filter)
        setLoading(false);
    }

    const getDevicesType = async () => {
        setLoading(true)
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}deviceType`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });
        setDeviceType(response.deviceType)
        setLoading(false);

    }

    const refreshDevices = async () => {
        setPage(2)
        setIsFiltered(false)
        setFilter(null)
        offset = 0
        setLoading(true);

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}allDevice/null?limit=${process.env.LIMIT_DEVICES}&offset=${offset}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });

        setdevices(current => response.responseDevices);
        let count = response.responseDevices.length
        setCount(count)
        setLoading(false);
    }

    const clearArray = () => {  
        setdevices([])
    }

    const showMore = async () => {

        setLoadingMore(true)
        offset = ((process.env.LIMIT_DEVICES * page) - process.env.LIMIT_DEVICES) // Fórmula para calcular desde donde traerá las siguientes zonas (varia segun límite)
        await getDevices()
        setPage(current => current + 1)
        setLoadingMore(false)

    }

    const handleCallback = (childData) => {
        if (childData && childData.state) {
            refreshDevices();
        }

        if(childData && childData.status === 200 && childData.message === "save"){
            setSaveOK(true);
        }

        if(childData && childData.status === 200 && childData.message === "delete"){
            setDeleteOK(true);
        }

        if(childData && childData.status === 412 && childData.message === "deleteAssigned"){
            setDeleteAssigned(true);
        }
    }

    const hideFilter = async () => {
        setFilter(null)
        await refreshDevices()
        setIsFiltered(false)
    }

    const handleCopyToken = () => {
        setCopyTokenOk(true)
        setTimeout(()=>{
            setCopyTokenOk(false)
        },[3000])
    }

    const downloadReport = async () => {
        setDownload(true)
        csvLinkEl.current.link.click()
        setDownload(false)
    }

    const sendIdDevice = async (data) => {
        filter = data
        setPage(2)
        offset = 0
        await getDevices()
    }

    return (
    
    <Layout refreshDate='' selected ='bg-[#FAFAFA]/20' position="setting" >
        <div className='flex-row flow-root'>
            
            <div className='flex mt-[10px] mb-[12px] float-left'>
            <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={()=>{navigate("/content/setting")}}>
                <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                    <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                </div>
                <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
            </div>
            </div>

            <div className='flex mt-[10px] mb-[22px] float-right'>
                <div className='flex cursor-pointer' onClick={() => refreshDevices()}>
                    <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                        <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                    </div>
                    <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                </div>
            </div>
        </div>

       

       <div className='font-bold text-[32px] leading-[42px] tracking-[-3%] text-hw-white ml-[24px] mt-[12px] mb-[27px]'>
            Dispositivo
        </div>

            <div className='flex justify-between'>
                {checkSubmodule(props.submodules, "Crear Dispositivo") &&
                    <div>
                        <div className='flex w-[215px] h-[48px] bg-[#EA683F] cursor-pointer rounded-[10px] ml-[24px]  mb-[13px]' onClick={() => setShowModal(true)}>
                            <div className='flex self-center w-[24px] h-[24px] rounded-full bg-white/25 ml-[10px] mr-[8px]'>
                                <RiAddLine className="self-center text-white w-[24px] h-[24px]" />
                            </div>
                            <div className='self-center text-white text-[15px] font-bold leading-[22px] tracking-[-1%] '>
                                Crear nuevo dispositivo
                            </div>
                        </div>
                        <ModalCreateDeviceType show={showModal} onClose={() => setShowModal(false)} parentCallback={handleCallback} />
                    </div>
                }

                 
                <div className='flex justify-end mr-[30px]'>
                    {checkSubmodule(props.submodules, "Exportar") && !loading && 
                        <div className='flex mx-[8px]'>
                            <button type='submit' className='h-[48px] w-[48px] bg-white/[0.15] rounded-[10px]  text-[16px] leading-[22px] tracking-normal'
                                onClick={() => downloadReport()}>
                                <div className='flex ml-[8px]'>
                                    <div className="flex justify-items-end items-end w-[24px] h-[24px] ml-[4px]">
                                        <BiCloudDownload className='w-[24px] h-[24px] text-white' aria-hidden="true" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    }

                    <CSVLink data={csvData} headers={headers}
                        filename={"Informe general" + ".csv"}
                        separator={";"}
                        ref={csvLinkEl}
                    >
                    </CSVLink>

                   {!isFiltered &&
                        <div className='flex'>
                            <button type='submit' className='h-[48px] w-[48px] bg-white/[0.15] rounded-[10px] text-[16px] leading-[22px] tracking-normal' 
                            onClick={() => setShowFilterDeviceModal(true)}>

                                <div className='flex ml-[8px]'>
                                    <div className="flex justify-items-end items-end w-[24px] h-[24px] ml-[4px]">
                                        <BiSliderAlt className='w-[24px] h-[24px] text-white' aria-hidden="true" />
                                    </div>
                                </div>
                            </button>

                            <FilterDeviceModal deviceTypeSelected={deviceTypeSelected} setDeviceTypeSelected={setDeviceTypeSelected} show={showFilterDeviceModal} getDevices={getDevices} setIsFiltered={setIsFiltered} deviceType={deviceType} devices={devices} setdevices={setdevices} onClose={() => setShowFilterDeviceModal(false)} clearArray={clearArray} sendIdDevice={sendIdDevice} />
                        </div>
                    }

                    {isFiltered &&
                        <div className='flex'>
                            <button type="submit"
                                className='h-[48px] w-[48px] bg-white/[0.15] rounded-[10px] text-[16px] leading-[22px] tracking-normal'
                                onClick={hideFilter}>

                                <div className='flex ml-[8px]'>
                                    <div className="flex justify-items-end items-end w-[24px] h-[24px] ml-[4px]">
                                        <BiSliderAlt className='w-[24px] h-[24px] text-[#EA683F]' aria-hidden="true" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    }

                </div>

            </div>



            {saveOK &&
                <div className=" bg-white border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] my-[24px] rounded-[8px] m:w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className=' w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Dispositivo guardado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setSaveOK(false)} />
                    </div>
                </div>
            }

        {copyTokenOk &&
            <div className="bg-white border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] m:w-[327px]" role="alert">
                <div className="flex">
                    <BsCheck className=' w-[20px] h-[20px] self-center mr-[4px]'/>
                    <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Token copiado al portapapeles</p>
                    
                </div>
            </div>
        }

        {deleteOK &&
            <div className="bg-white border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] m:w-[327px]" role="alert">
            <div className="flex">
                <BsCheck className=' w-[20px] h-[20px] self-center mr-[4px]'/>
                <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Dispositivo eliminado exitosamente.</p>
                <IoClose className='self-center cursor-pointer' onClick={() => setDeleteOK(false)}/>
            </div>
        </div>
        }

        

        
            { !loading && 
                <div className='m:flex m:flex-wrap m:ml-[24px]'>
                
                    {devices && devices.length > 0 && 
                        devices.map((device, key) => {

                            return (
                                <CardDeviceSetting
                                    title={device.label} ide={device.id} label={device.label} deviceType={device.device_type} creationDate={device.creation_date} key={key} token={device.token} status={device.active} isAutomaticShutdown={device.isAutomaticShutdown} isElectricityMonitoring={device.isElectricityMonitoring}  parentCallback={handleCallback} handleCopyToken={handleCopyToken} submodules={props.submodules} />
                            )
                        })
                    }

                    {devices && devices.length === 0 &&
                                <div className='flex-wrap text-center'>
                                    <span className='text-[24px]'>🤓</span> <span className='text-[16px] font-semibold text-[#FAFAFA]'> No hay tipos de dispositivos configurados, presiona el botón "Crear nuevo tipo de dispositivo" para comenzar... </span>
                                </div>
                    }
                    <div className='pb-[10px]'/>
                </div>
            }

            {/*Cargar más*/}
            {count !== 0 ?
                <div className='flex justify-center  justify-items-center pb-[16px] m:mt-[16px]'>

                    {/* Mientras trae las zonas muestra un loadaer de barras */}
                    {!loadingMore ?
                        <button
                            className='flex cursor-pointer disabled:cursor-not-allowed text-[#FAFAFA] text-[1rem] font-bold leading-[1.375rem] tracking-[-0.04em] whitespace-nowrap'
                            onClick={() => showMore()}
                            disabled={loadingMore}>
                            Cargar más
                            <FaChevronDown className='mt-1 ml-[0.444rem] text-[#FAFAFA]' />
                        </button>
                        :
                        <div className='flex m:justify-center'>
                            <Bars color="#FAFAFA" height={30} width={30} />
                        </div>
                    }
                </div>
                : null
            }
        


        { loading &&
         <div className='flex justify-center mt-[24px]'>
            <Bars color="#FAFAFA" height={80} width={80} />
         </div>
         }
        

   </Layout>
      
  )
}




export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Gestión de Dispositivos"}, { withCredentials: true, headers: {
          Cookie: context.req.headers.cookie
      }})
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

    if(submodules===401){
        return {
            redirect: {
              permanent: false,
              destination: "/",
            },
            props:{},
          };
    }
    return {
      props: submodules, // will be passed to the page component as props
    }
  }