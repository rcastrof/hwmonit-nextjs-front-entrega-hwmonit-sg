import React, {useState, useEffect, useRef} from 'react'
import Image from 'next/image';
import Layout from '../../components/Layout/Layout'
import { useRouter } from "next/router";
import {BiExport} from 'react-icons/bi'
import { FaChevronLeft } from 'react-icons/fa'
import axios from 'axios';
import { HiOutlineRefresh } from 'react-icons/hi'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as locales from 'react-date-range/dist/locale';
import { setDate } from 'date-fns';
import { Bars } from 'react-loader-spinner';
import {CSVLink, CSVDownload} from 'react-csv';
export default function ExportData(props) {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPicker, setIsLoadingPicker] =useState(false)
  const [datePick, setDatePick] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);
  const [zonePick, setZonePick] = useState('')
  
  const [zones, setZones] = useState(null)
  const [branchPick, setBranchPick] = useState('')
  const [branches, setBranches] = useState(null)
  const [devices, setDevices] = useState(null)
  const [devicePick, setDevicePick] = useState('')
  const now= new Date()
  const lowerLimitDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  const [jsonForCSV, setJsonForCSV] = useState(null)
  const [filename, setFilename] = useState('archivo.csv')
    const csvLinkEl = useRef();
  
    const headersCsv = [
      {key: "device_id", label: "device_id"},
      {key: "branch", label: "branch"},
      {key: "zone", label: "zone"},
      {key: "name", label: "name"},
      {key: "label", label: "label"},
      {key: "device_type", label: "device_type"},
      {key: "cpu_info", label: "cpu_info"},
      {key: "disk_info", label: "disk_info"},
      {key: "display_info", label: "display_info"},
      {key: "fan_info", label: "fan_info"},
      {key: "gpu_info", label: "gpu_info"},
      {key: "memory_info", label: "memory_info"},
      {key: "printer_info", label: "printer_info"},
      {key: "red_info", label: "red_info"},
      {key: "system_info", label: "system_info"},
      {key: "temperature_info", label: "temperature_info"},
      {key: "update_date", label: "update_date"}
    ]

  useEffect(() => {

    async function fetchZones() {
        await getZones();
    }
    fetchZones();

}, [])


  const getZones = async () => {
    const response = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}zonelist`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if (error.response.status === 401) {
                  push('/')
                }
                resolve(error);
            })
    });

    setZones(response.zone)
    
  }

  const getDevices = async (id) => {
    const response = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}device_list/${id}`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if (error.response.status === 401) {
                  push('/')
                }
                resolve(error);
            })
    });

    setDevices(response.device)
    
  }

  const fetchbranches = async (id) => {



    const response = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}branchesZone/${id}`, { withCredentials: true })
            .then(response => {
                resolve(response.data);

            }).catch(error => {
                if (error.response.status === 401) {
                    push('/')
                }
                resolve(error);
            })
    });

    setBranches(response);

} 
const fetchCsvData = async (startDate, endDate) => {
  const response = await new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}get_report/${devicePick}/${startDate}/${endDate}`, { withCredentials: true })
          .then(response => {
              resolve(response.data);

          }).catch(error => {
              if (error.response.status === 401) {
                  push('/')
              }
              resolve(error);
          })
  });
  
    setJsonForCSV(response.report_data);
  
  
  setTimeout(()=>{
    csvLinkEl.current.link.click()
},1000)

}
  const handleZonePick = (event) =>{

    setZonePick(event)
    if(event!==''){
      setIsLoadingPicker(true)
      setBranchPick('')
      setDevicePick('')
      fetchbranches(event)
      setIsLoadingPicker(false)

    }
  }

  const handleBranchPick = (event) =>{
    setBranchPick(event)
    if(event!==''){
      setIsLoadingPicker(true)
      setDevicePick('')
      getDevices(event)
      setIsLoadingPicker(false)
    }


  }

  const handleDevicePick = (event) =>{
    setDevicePick(event)
  }



  async function getCsv(){
    setIsLoading(true)
    let startDate = datePick[0].startDate.getTime()
    let endDate = datePick[0].endDate.getTime() + 86400000


    await fetchCsvData(startDate, endDate)
   
    setIsLoading(false)
  }

    return (
    
        <Layout refreshDate='' selected="bg-[#FAFAFA]/20" position="menuStatistics">
        <div className='flex-row flow-root'>
    
            <div className='flex mt-[10px] mb-[12px] float-left'>
            <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={()=>{push("/content/menuStatistics")}}>
                <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                    <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                </div>
                <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
            </div>
            </div>


        </div>
    
        <div className='flex ml-[24px] mt-[20px] text-hw-white text-[23px]  font-bold tracking-[-3%] leading-[42px] mb-[22px]'>Exportar datos</div>
        <div className='flex flex-wrap  ml-[24px]'>
        <div>

        <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%] text-white">Filtrar por Zona</div>
          <select className='border-[2px] mb-[1rem] m:mr-[32px] border-white/20 bg-transparent text-white rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
              disabled={isLoading|| isLoadingPicker} 
              defaultValue={""}
              onChange={(event) => {handleZonePick(event.target.value)}}>
              <option className='bg-black hover:[#262626]' value=""> Selecciona una zona</option>
              {zones && zones.length!==0 && zones.map((singleZone)=>{
                 return (<option className='bg-black' value={singleZone._id}>{singleZone.label}</option>)
              })}
              
          </select>
        </div>

        <div>

        <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%] text-white">Filtrar por Sucursal</div>
          <select className='border-[2px] border-white/20 bg-transparent mb-[1rem] m:mr-[32px] text-white rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
              disabled={isLoading || isLoadingPicker}
              defaultValue={""}
              onChange={(event) => {handleBranchPick(event.target.value)}}>
              <option className='bg-black hover:[#262626]' value=""> Seleccionar una sucursal</option>
              {branches && branches.length!==0 && branches.map((singleBranch)=>{
                 return (<option className='bg-black' value={singleBranch.branch_id}>{singleBranch.branch_name}</option>)
              })}
          </select>
        </div>

        <div>
        <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%] text-white">Filtrar por Dispositivo</div>
          <select className='border-[2px] border-white/20 bg-transparent mb-[1rem] m:mr-[32px] text-white rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
              disabled={isLoading || isLoadingPicker}
              defaultValue={""}
              onChange={(event) => handleDevicePick(event.target.value)}>
              <option className='bg-black hover:[#262626]' value=""> Seleccionar un dispositivo</option>
              {devices && devices.length!==0 && devices.map((singleDevice)=>{
                 return (<option className='bg-black' value={singleDevice._id}>{singleDevice.label}</option>)
              })}
              
          </select>
        </div>
        

            
        </div>

        {!isLoading ? <><div className='flex justify-center mb-[1rem]'>
          <DateRange
            
            editableDateInputs={true}
            onChange={item => setDatePick([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={datePick}
         
            maxDate={now}
            locale={locales['es']}
          />



        </div>

        <div className='flex justify-center mb-[1rem]'>
        <div onClick={()=>{if(devicePick && datePick[0].startDate && datePick[0].endDate){getCsv()}}}
            className=" flex  h-[48px] w-[135px] bg-[#EA683F] cursor-pointer rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
            <div className='flex flex-auto ml-[20px] self-center'>
                <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">
                     <BiExport className='w-[20px] h-[20px] text-white self-center' aria-hidden="true" /> 
                </div>
                <div className='text-white ml-[8px] font-bold'>Exportar</div>
            </div>
        </div>

        
        </div></>:
         <div className='flex justify-center mb-[1rem]'>
         <Bars color="#FAFAFA" height={80} width={80}/>
         </div> 
        }

        <CSVLink
                data={jsonForCSV!==null? jsonForCSV : ''}
                filename={filename}
                headers={headersCsv}
                separator={";"}
                ref={csvLinkEl}>                      
            </CSVLink>
            <div className='pb-[10px]'/>
    </Layout>
      
  )
}



export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Exportar Data"}, { withCredentials: true, headers: {
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