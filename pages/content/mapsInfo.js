import React, {useState, useEffect} from 'react'
import Image from 'next/image';
import Layout from '../../components/Layout/Layout'
import GoogleMapReact from 'google-map-react';
import { RiMapPin5Fill } from 'react-icons/ri'
import { AiOutlineEyeInvisible, AiFillEye } from 'react-icons/ai'
import { useRouter } from "next/router";
import { FaChevronLeft } from 'react-icons/fa'
import axios from 'axios';
import PinComponent from '../../components/Map/Pin';
import PopUpComponent from '../../components/Map/PopUp';
import { HiOutlineRefresh } from 'react-icons/hi'

export default function mapsInfo(props) {


    const { push } = useRouter();
    const [loading, setLoading] = useState(false)
    const [placesOk, setPlacesOk] = useState([])

    const [placesWarning, setPlacesWarning] = useState([])
    const [placesAlert,setPlacesAlert] = useState([])
    const [showOk, setShowOk] = useState(true)
    const [showWarning, setShowWarning]  = useState(true)
    const [showAlert, setShowAlert] = useState(true)
    const [pinInfo, setPinInfo] = useState(null)
    const navigate = (url) => {
        push(url);
     }

     useEffect(() => {

        async function fetchBranchInfo() {
            await getBranchInfo();
        }
        fetchBranchInfo();

    }, [])
 

    const getBranchInfo = async () =>{
        setLoading(true)
        const branches = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}branchesMap`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status === 401)
                    }
                    resolve(error);
                })
          });
          if(branches===401)
      {
        push('/')
      }else{
          setPlacesAlert(branches.arrayAlert)

          setPlacesWarning(branches.arrayWarning)
          setPlacesOk(branches.arrayOk)
          setLoading(false)
      }
    }

    const reloadBranchInfo = async () =>{
        setLoading(true)
        setPinInfo(null)
        const branches = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}branchesMap`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
          });

        setPlacesAlert(branches.arrayAlert)
        setShowAlert(true)
        setPlacesWarning(branches.arrayWarning)
        setShowWarning(true)
        setPlacesOk(branches.arrayOk)
        setShowOk(true)
        setLoading(false)
    
    }

    async function handleReload(){
        await reloadBranchInfo()
    }

    const handlePinInfo = (branch) =>{
        setPinInfo(branch)
    }

    
    
    const data = {
        center: { lat: -35.412052, lng: -67.3896206 },
        zoom: 3
    }
    



    return (
        <Layout refreshDate='' selected="bg-[#FAFAFA]/20" position="mapsInfo">
            <div className='flex-row flow-root'>
        
                

                <div className='flex mt-[10px] mb-[22px] float-right'>
                    <div className='flex cursor-pointer' onClick={() => handleReload()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>
        
            <div className='flex ml-[24px] mt-[20px] text-hw-white text-[23px] font-bold tracking-[-3%] leading-[42px] mb-[22px]'>Mapa de estado de sucursales</div>
            <div className='flex flex-wrap mb-[1rem] ml-[24px]'>

                 <div className='flex bg-white/[0.15] w-[327px] h-[56px] mb-[8px] rounded-2xl justify-between mr-[16px]'>
                    <div className='ml-[12px] flex'>
                        <Image src='/pin_ok.svg' height={32} width={32}  />
                        <div className='text-white font-semibold self-center text-[16px] ml-[8px]'>Funcionando</div>
                    </div>
                    {showOk ? 
                        <AiFillEye className='flex self-center  mr-[17.08px] w-[22px] h-[22px] text-white cursor-pointer' onClick={() => {setPinInfo(null); setShowOk(false)}}/>
                        :
                        <AiOutlineEyeInvisible className='flex self-center  mr-[17.08px] w-[22px] h-[22px] text-[#C0C0C0] cursor-pointer' onClick={() => {setPinInfo(null); setShowOk(true)}}/>
                    }
                </div>
                

                <div className='flex bg-white/[0.15] w-[327px] h-[56px] mb-[8px] rounded-2xl justify-between mr-[16px]'>
                    <div className='ml-[12px] flex'>
                        <Image src='/pin_warning.svg' height={32} width={32}  />
                        <div className='text-white font-semibold self-center text-[16px] ml-[8px]'>Advertencia</div>
                    </div>
                    {showWarning ? 
                        <AiFillEye className='flex self-center  mr-[17.08px] w-[22px] h-[22px] text-white cursor-pointer' onClick={() => {setPinInfo(null);setShowWarning(false)}}/>
                        :
                        <AiOutlineEyeInvisible className='flex self-center  mr-[17.08px] w-[22px] h-[22px] text-[#C0C0C0] cursor-pointer' onClick={() => {setPinInfo(null); setShowWarning(true)}}/>
                    }
                </div>

                <div className='flex bg-white/[0.15] w-[327px] h-[56px] mb-[8px] rounded-2xl justify-between  mr-[16px]'>
                    <div className='ml-[12px] flex'>
                        <Image src='/pin_alert.svg' height={32} width={32}  />
                        <div className='text-white font-semibold self-center text-[16px] ml-[8px]'>Error</div>
                    </div>
                    {showAlert ? 
                        <AiFillEye className='flex self-center  mr-[17.08px] w-[22px] h-[22px] text-white cursor-pointer' onClick={() => {setPinInfo(null); setShowAlert(false)}}/>
                        :
                        <AiOutlineEyeInvisible className='flex self-center  mr-[17.08px] w-[22px] h-[22px] text-[#C0C0C0] cursor-pointer' onClick={() =>{setPinInfo(null); setShowAlert(true)}}/>
                    }
                </div>
                


            </div>


            <div className='flex ml-[auto] mr-[auto] pb-[24px] h-[400px] m:h-[500px]  w-[85%]'>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyDmv8BdD6Wa9CuicvTnzMhrsDqIbft7LG0' }}
                    defaultCenter={data.center}
                    defaultZoom={data.zoom}
                >

                    {showOk && placesOk && placesOk.length!==0 && placesOk.map((item)=>{
                        return(
                            
                            <PinComponent
                            lat={item.lat}
                            lng={item.long}
                            status={item.branch_status}
                            branch={item}
                            handlePinInfo={handlePinInfo}
                    />
                    
                    
                        )
                    })

                    }

                    

               

                    {showWarning && placesWarning && placesWarning.length!==0 && placesWarning.map((item)=>{
                        return(
                            <PinComponent
                            lat={item.lat}
                            lng={item.long}
                            status={item.branch_status}
                            branch={item}
                            handlePinInfo={handlePinInfo}
                    />
                        )
                    })

                    }

                    {showAlert && placesAlert && placesAlert.length!==0 && placesAlert.map((item)=>{
                        return(
                            <PinComponent
                        lat={item.lat}
                        lng={item.long}
                        status={item.branch_status}
                        branch={item}
                        handlePinInfo={handlePinInfo}

                        
                        
                    />
                        )
                    })

                    }       

                    {pinInfo && 
                        <PopUpComponent
                            lat={pinInfo.lat}
                            lng={pinInfo.long}
                            branch = {pinInfo}
                            handlePinInfo={handlePinInfo}
                        />
                    }
                
                </GoogleMapReact>
            </div>
        </Layout>
    )
}



export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Mapa"}, { withCredentials: true, headers: {
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