import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { FaChevronUp,FaChevronLeft } from 'react-icons/fa'
import { HiOutlineRefresh } from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'
import { BsCheck, BsExclamation} from 'react-icons/bs'
import { Disclosure } from '@headlessui/react'

import axios from "axios";
import { Bars } from 'react-loader-spinner';
import { useRouter } from "next/router";
import { checkSubmodule } from '../../components/Permission/CheckSubmodules'



function statistics(props) {
    const [expand, setExpand] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [infoStatistics, setInfoStatistics] = useState([]);
    const [infoZones, setInfoZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const { push } = useRouter();

    useEffect(() => {

        async function fetchStatistics() {
            await getStatistics();
        }
        async function fetchZonesStatistics() {
            await getZonesStats();
        }
        fetchStatistics();
        fetchZonesStatistics();

    }, [])


    const navigate = (url) => {
        push(url);
     }


    const getStatistics = async () => {
        setLoading(true);
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}statisticsZone`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                    setInfoStatistics(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });


        setLoading(false);

    }

    const getZonesStats = async () => {
        setLoading(true);
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}statics/status`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                    setInfoZones(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
        });


        setLoading(false);

    }


    const handleExpand = () => {

        setExpand(!expand)

    }


    const getStatus = (status) => {

        switch (status) {
            case 2:
                return(  <div className=" h-[20px] w-[20px] mx-[8px] bg-[#FF9900] rounded-full">
                    <BsExclamation className=' h-[20px] w-[20px]  text-white' />
                </div>)
                break;
            case 1:
                return(<div className=" h-[20px] w-[20px] mx-[8px] bg-[#9EC431] rounded-full">
                    <BsCheck className=' h-[20px] w-[20px] text-white' />
                </div>)
                break;
            case 0:
                return(<div className=" h-[20px] w-[20px] mx-[8px] bg-[#E00000] rounded-full">
                    <IoClose className=' h-[20px] w-[20px] self-center  text-white' />
                </div>)
                break;
        }

    }




    return (
        <Layout refreshDate='' selected="bg-[#FAFAFA]/20" position="menuStatistics">

           

            <div className='flex-row flow-root'>
                
                <div className='flex mt-[10px] mb-[12px] float-left'>
                <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={()=>{navigate("/content/menuStatistics")}}>
                    <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                        <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                    </div>
                    <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
                </div>
                </div>

                <div className='flex mt-[10px] mb-[22px] float-right'>
                    <div className='flex cursor-pointer' onClick={() => getStatistics()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>

            <div className='font-bold text-[32px] text-hw-white ml-[24px] mt-[27px] mb-[27px]'>
                Estadísticas
            </div>

            {checkSubmodule(props.submodules, "Rendimiento dispositivos por zona") && 
            <div className=" ml-[24px] mr-[16px] bg-white/[0.15] rounded-[16px] mb-[8px] pb-[16px]">
                <div className='flex  mb-[16px]'>

                    <div className='text-white ml-[16px] font-bold mt-[24px] leading-[18px] text-[16px] tracking-[-3%]'>Rendimiento de dispositivos por zonas</div>
                    <div className='mt-[24px] ml-[auto] w-[100px]'>
                        <div className='flex'>
                            <div className='h-[9px] w-[9px] bg-[#DA5151] rounded-full self-center'></div>
                            <div className=' text-white leading-[18px] text-[11px] tracking-[-2%] ml-[4px] self-center'>
                                Con error
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='h-[9px] w-[9px] bg-[#34C759] rounded-full self-center'></div>
                            <div className=' text-white text-[11px] leading-[18px] tracking-[-2%] ml-[4px] self-center'>
                                Sin error
                            </div>
                        </div>
                    </div>

                </div>
                {!loading && <div className='flex flex-wrap ml-[16px] mt-[8px}'>
                    {infoStatistics && infoStatistics.length > 0 && infoStatistics.map((item) => {
                        return (<div className={`h-[88px] w-[93px] bg-white/[0.15] rounded-[14px] mb-[8px] mr-[8px]`}>
                            <div className='flex flex-wrap'>
                                

                                {
                                    item.contError > 0 ?

                                    <div className="ml-[auto] mr-[auto] mt-[16px] font-bold  text-[24px] leading-[34px] tracking-[-2%] text-[#DA5151]">{item.number * 100}%</div>
                                    :
                                    <div className="ml-[auto] mr-[auto] mt-[16px] font-bold text-[#34C759] text-[24px] leading-[34px] tracking-[-2%]">{item.number * 100}%</div>
                                }
                            </div>
                            <div className='flex'>
                                <div className='ml-[auto] mr-[auto] text-[11px] leading-[14.98px] text-white tracking-[-2%] font-semibold '>{item.name}</div>
                            </div>

                        </div>)
                    })}
                </div>}

                {loading &&
                    <div className='flex justify-center items-center align mt-[24px]'>
                        <Bars color="#FAFAFA" className="mr-[auto] ml-[auto]" height={80} width={80} />
                    </div>
                }


            </div>}


            {checkSubmodule(props.submodules, "Detalle rendimiento zona") && <div className='flex flex-wrap mt-[24px]'>
                {infoZones && infoZones.length > 0 && !loading && infoZones.map((zone) => {
                    return (
                        <div className="">
                            <div className="ml-[24px] w-[336px] max-w-md pt-1 pb-1 bg-white/[0.15] rounded-2xl mb-[8px]">
                                <Disclosure as="div" className="mt-2">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex justify-between w-full leading-[14px] px-4 py-2 text-[16px] font-bold text-left text-white rounded-lg tracking-[-2%]">
                                                <span>{zone.zone_name}</span>
                                                <FaChevronUp
                                                    className={`${open ? 'transform rotate-180' : ''
                                                        } w-5 h-5 text-black-500`}
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="px-4  pb-2 text-sm">
                                                {zone.branches && zone.branches.length > 0 && zone.branches.map((branch) => {
                                                    return (<div className='bg-white/[0.15] pb-4 w-[306px] mt-[8px] rounded-[14px] pt-4'>

                                                        <div className='flex ml-[16px] mb-[24px] '>
                                                            <div className='text-white font-bold text-[16px]  tracking-[-2%]'> {branch.branch_name}</div>

                                                        </div>
                                                        {branch.deviceStatus && branch.deviceStatus.length > 0 && branch.deviceStatus.map((device) => {
                                                            return (<div className='flex ml-[16px] mb-[8px]'>
                                                                <div className='flex-auto w-64 text-white/80 font-normal text-[14px] tracking-[-2%]'>{device.label}
                                                                </div>

                                                                <div className='flex-auto mr-[16px] font-normal text-[14px] tracking-[-2%]'>
                                                                    {getStatus(device.status_general)}
                                                                </div>

                                                            </div>)
                                                        })}



                                                    </div>)
                                                })
                                                }



                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>

                            </div>
                        </div>)
                })}
                
                
            </div>}
            {loading &&
                    <div className='flex justify-center items-center align-center ml-[24px] mt-[24px]'>
                        <Bars color="#FAFAFA" className="mr-[auto] ml-[auto]" height={80} width={80} />
                    </div>
                }


        </Layout>
    )
}

export default statistics

export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Estadísticas"}, { withCredentials: true, headers: {
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