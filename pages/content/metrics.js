import React, {useState, useEffect} from 'react'

import Layout from '../../components/Layout/Layout'
import { useRouter } from "next/router";
import { LineChart, BarChart, Bar, Line, CartesianGrid, XAxis, YAxis, Legend, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { FaChevronLeft } from 'react-icons/fa'
import axios from 'axios';
import moment from 'moment'

import { Bars } from 'react-loader-spinner';

export default function ExportData(props) {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPicker, setIsLoadingPicker] =useState(false)
 
  const [zonePick, setZonePick] = useState('')
  
  const [zones, setZones] = useState(null)
  const [branchPick, setBranchPick] = useState('')
  const [branches, setBranches] = useState(null)
  const [devices, setDevices] = useState(null)
  const [devicePick, setDevicePick] = useState('')
  const [metricPick, setMetricPick] = useState('')
  const [descriptionMetric, setDescriptionMetric] = useState('')
  const [metrics, setMetrics] = useState(null)
  const [metricCode, setMetricCode] =useState(null)
  const [dataBar, setDataBar] =useState([])
  const [metricRange, setMetricRange]=useState('1HR')
  useEffect(() => {

    async function fetchZones() {
        await getZones();
        await getMetrics()
    }
    fetchZones();

}, [])

useEffect(() => {

  async function getMetricData() {
      await fetchMetricData();
  }
  if(metricCode!==null && devicePick!=='' ){
    getMetricData()
  }


}, [metricCode, metricRange])

const [data,setData] = useState([]);

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

  const getMetrics = async () => {
    const response = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}graphic_metrics`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if (error.response.status === 401) {
                  push('/')
                }
                resolve(error);
            })
    });

    setMetrics(response.metrics)
    
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
const fetchMetricData = async () => {



  const response = await new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}get_metric_data/${devicePick}/${metricCode}/${metricRange}/`, { withCredentials: true })
          .then(response => {
              resolve(response.data);

          }).catch(error => {
              if (error.response.status === 401) {
                  push('/')
              }
              resolve(error);
          })
      
  });
  if(metricCode==='RAM_PERCENTAGE'){
    setData(response.ram_report_data)
  }
  if(metricCode==='HDD_PERCENTAGE'){

    setDataBar(response.hdd_report_data)
  }
  if(metricCode==='CPU_PERCENTAGE'){
    setData(response.cpu_report_data)
  }

}

const handleRangeChange = (newRange) =>{
  
  setMetricRange(newRange)
 
  
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


  const handleMetricPick = (event) =>{
    if(event===''){
     
        setMetricCode(null)
        setMetricRange('1HR')
        setData(null)
        setDataBar(null)
      
      setDescriptionMetric('')
    }else{
      let description = metrics.filter((metric)=> metric._id === event)[0].description
      let code = metrics.filter((metric)=> metric._id === event)[0].code
 
      setDescriptionMetric(description)
      setMetricCode(code)

    }
    setMetricPick(event)
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
    
        <div className='flex ml-[24px] mt-[20px] text-hw-white text-[23px]  font-bold tracking-[-3%] leading-[42px] mb-[22px]'>Gráficos de métricas</div>
        <div className='flex flex-wrap  ml-[24px]'>
        <div>

        <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%] text-white">Seleccionar una Zona</div>
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

        <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%] text-white">Selecciona una Sucursal</div>
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
        <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%] text-white">Selecciona un Dispositivo</div>
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
        
        <div>
        <div className="font-bold text-[14px] leading-[19.07px] mb-[8px] tracking-[-5%] text-white">Selecciona una Métrica</div>
          <select className='border-[2px] border-white/20 bg-transparent mb-[1rem] m:mr-[32px] text-white rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
              disabled={isLoading || isLoadingPicker}
              defaultValue={""}
              onChange={(event) => handleMetricPick(event.target.value)}>
              <option className='bg-black hover:[#262626]' value=""> Seleccionar una métrica</option>
              {metrics && metrics.length!==0 && metrics.map((singleMetric)=>{
                 return (<option className='bg-black' value={singleMetric._id}>{singleMetric.name}</option>)
              })}
              
          </select>
        </div>
            
        </div>

        {!isLoading ? <>
        {metricPick!=='' &&
          <div className='flex flex-wrap flex-col mb-[1rem] ml-[24px]  tracking-[-2%] text-white'>
            <div className='flex mb-[1rem] font-bold text-[20px] leading-[27.24px]'>{descriptionMetric}</div>
            <div className='flex text-[16px] leading-[21.79px] '>Esta métrica muestra el uso en función del tiempo transcurrido.</div>
          </div>
        }

        <div className='flex justify-center mb-[1rem] '>
        
             {metricCode==='RAM_PERCENTAGE' && <div className='bg-white/[0.15] pt-[16px] '>
              <div className='md:w-[890px]  h-[350px] m:w-[650px] w-[350px] '>
              <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <Line  name='RAM Utilizada (%)' type="monotone" dataKey="memory_info" stroke="#2A8BEB" />
              <Legend/>
              <Tooltip  labelFormatter={timeStr => { 
    return `Hora reporte: ${moment(timeStr).format('DD/MM HH:mm')}`;
  }} />
              <CartesianGrid stroke="#5b8089" strokeDasharray="5 5" />
              <XAxis stroke='#FFFFFF' dy={10} scale="point" dataKey="update_date" tickFormatter={timeStr => moment(timeStr).format('DD/MM HH:mm') }>
              
                </XAxis>
              <YAxis stroke='#FFFFFF' tickFormatter={(tick) => {
              return `${tick}%`;
              }} />
              </LineChart>
              </ResponsiveContainer>
              </div>
              <div className='flex justify-center my-[1rem] text-white text-[20px] leading-[27.24px] tracking-[-2%]'>
                  Mostrar última:
                  <div className={`ml-[8px] ${metricRange!=='1HR'? 'text-[#EA683F] cursor-pointer' : ''} `} onClick={()=>{if(metricRange!=='1HR'){ handleRangeChange('1HR')}}}>1 hora</div>
                  <div className={`ml-[8px] ${metricRange!=='6HR'? 'text-[#EA683F] cursor-pointer' : ''}`} onClick={()=>{if(metricRange!=='6HR'){ handleRangeChange('6HR')}}}>6 horas</div>
                  <div className={`ml-[8px] ${metricRange!=='1D'? 'text-[#EA683F] cursor-pointer' : ''}`} onClick={()=>{if(metricRange!=='1D'){ handleRangeChange('1D')}}}>1 día</div>
                  <div className={`ml-[8px] ${metricRange!=='1W'? 'text-[#EA683F] cursor-pointer' : ''}`} onClick={()=>{if(metricRange!=='1W'){ handleRangeChange('1W')}}}>1 semana</div>
                </div>
              </div>}

              {metricCode==='CPU_PERCENTAGE' && <div className='bg-white/[0.15] pt-[16px]  '>
              <div className='md:w-[890px]  h-[350px] m:w-[650px] w-[350px]'>
              <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" name='CPU Utilizada (%)'  dataKey="cpu_info" stroke="#2A8BEB" />
              <Legend/>
              <Tooltip  labelFormatter={timeStr => { 
    return `Hora reporte: ${moment(timeStr).format('DD/MM HH:mm')}`;
  }} />
              <CartesianGrid stroke="#5b8089" strokeDasharray="5 5" />
              <XAxis stroke='#FFFFFF' scale="point" dataKey="update_date"  dy={10} tickFormatter={timeStr => moment(timeStr).format('DD/MM HH:mm')}/>
              <YAxis stroke='#FFFFFF' tickFormatter={(tick) => {
              return `${tick}%`;
              }} />
              </LineChart>
              </ResponsiveContainer>
              </div>
              <div className='flex justify-center my-[1rem] text-white text-[20px] leading-[27.24px] tracking-[-2%]'>
                  Mostrar última:
                  <div className={`ml-[8px] ${metricRange!=='1HR'? 'text-[#EA683F] cursor-pointer' : ''} `} onClick={()=>{if(metricRange!=='1HR'){ handleRangeChange('1HR')}}}>1 hora</div>
                  <div className={`ml-[8px] ${metricRange!=='6HR'? 'text-[#EA683F] cursor-pointer' : ''}`} onClick={()=>{if(metricRange!=='6HR'){ handleRangeChange('6HR')}}}>6 horas</div>
                  <div className={`ml-[8px] ${metricRange!=='1D'? 'text-[#EA683F] cursor-pointer' : ''}`} onClick={()=>{if(metricRange!=='1D'){ handleRangeChange('1D')}}}>1 día</div>
                  <div className={`ml-[8px] ${metricRange!=='1W'? 'text-[#EA683F] cursor-pointer' : ''}`} onClick={()=>{if(metricRange!=='1W'){ handleRangeChange('1W')}}}>1 semana</div>
                </div>
              </div>}
              
              {metricCode==='HDD_PERCENTAGE'&&
              
        
              <div className='bg-white/[0.15] pt-[16px] md:w-[890px]  h-[350px] m:w-[650px] w-[350px]  '>
              <ResponsiveContainer>
              <BarChart data={dataBar} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <Bar barSize={100} name='% Disco utilizado' dataKey="percentage" stackId="a" fill="#8884d8" />
              <Bar barSize={100} stackId="a" name='% Disco disponible' dataKey='avaliable'  fill="#82ca9d" />
              <Legend/>
              <Tooltip cursor={{fill: 'transparent'}} />
              <CartesianGrid stroke="#5b8089" strokeDasharray="5 5" />
              <XAxis stroke='#FFFFFF' dy={10}  dataKey="mountpoint"/>
              <YAxis stroke='#FFFFFF' tickFormatter={(tick) => {
              return `${tick}%`;
              }} />
              </BarChart>
              </ResponsiveContainer>
              </div>
              }

              
        </div>
        
        </>:
         <div className='flex justify-center mb-[1rem]'>
         <Bars color="#FAFAFA" height={80} width={80}/>
         </div> 
        }

       
            <div className='pb-[10px]'/>
    </Layout>
      
  )
}



export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Métricas"}, { withCredentials: true, headers: {
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