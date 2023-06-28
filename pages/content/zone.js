import Layout from '../../components/Layout/Layout'
import {FaChevronLeft, FaChevronDown} from 'react-icons/fa'
import {RiAddLine} from 'react-icons/ri'
import {HiOutlineRefresh} from 'react-icons/hi'
import { useRouter } from "next/router";
import CardZone from '../../components/Zone/CardZone';
import { useEffect, useState } from 'react';
import {Bars} from 'react-loader-spinner';
import axios from 'axios';
import ModalCreateZone from '../../components/Zone/ModalCreateZone';
import {BsCheck} from 'react-icons/bs'
import {IoClose} from 'react-icons/io5'
import { checkSubmodule } from '../../components/Permission/CheckSubmodules';
export default function Zone(props) {

    const {push} = useRouter();
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saveOK, setSaveOK] = useState(false);
    const [deleteOK, setDeleteOK] = useState(false);

    //paginación
    const [loadingMore, setLoadingMore] = useState(false)
    const [count, setCount] = useState(false)
    const [page, setPage] = useState(2)
    let offset = 0

    const navigate = (url) => {
        push(url);
     }

     useEffect(() => {

        async function fetchZones(){
          await getZones();
        }
        fetchZones();
    
      }, [])


    



    const getZones = async () => {

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}zones?limit=${process.env.LIMIT_ZONES}&offset=${offset}`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if (error.response.status === 401) {
                    push('/')
                }
                resolve(error);
            })
        });

        setZones(
            current => {
                if (current.length === 0) {
                    return (response.responseZones)
                } else {
                    return ([...current, ...response.responseZones])
                }
            }
        )
        let count = response.responseZones.length
        setCount(count)
        setLoading(false);

    }

    const refreshZones = async () => {

        setPage(2)
        offset = 0
        setLoading(true);

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}zones?limit=${process.env.LIMIT_ZONES}&offset=${0}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
            });

        setZones(current => response.responseZones);
        let count = zones.length
        setCount(count)
        setLoading(false);
    }

    //Paginación - process.env.LIMIT_ZONES, limite establecido en .env -
    const showMore = async () => {
        setLoadingMore(true)
        offset = ((process.env.LIMIT_ZONES * page) - process.env.LIMIT_ZONES) // Formula para calcular desde donde traerá las siguientes zonas (varia segun límite)
        await getZones()
        setPage(current => current + 1)
        setLoadingMore(false)

    }

    const handleCallback = (childData) =>{
        if(childData && childData.state){
            refreshZones();
        }

        if(childData && childData.status === 200 && childData.message === "save"){
            setSaveOK(true);
        }

        if(childData && childData.status === 200 && childData.message === "delete"){
            setDeleteOK(true);
        }
    }

  

    return (
    
    <Layout refreshDate='' selected ='bg-[#FAFAFA]/20' position="setting">
        
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
                    <div className='flex cursor-pointer' onClick={() => refreshZones()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
        </div>

       <div className='font-bold text-[32px] leading-[42px] text-hw-white ml-[24px] mt-[16px] mb-[16px]'>
            Zonas
        </div>

        {checkSubmodule(props.submodules, "Crear Zona" ) && 
            <div>
                <div className='flex w-[189px] h-[48px] bg-[#EA683F] cursor-pointer rounded-[10px] ml-[24px] mb-[24px]' onClick={( )=> setShowModal(true) }>
                    <div className='flex self-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 ml-[16px] mr-[8px]'>
                        <RiAddLine className="self-center text-white w-[24px] h-[24px]"/>
                    </div>
                    <div className='self-center text-white text-[16px] font-bold leading-[22px] tracking-[-1%]'>
                        Crear nueva zona
                    </div>
                    
                </div>
                <ModalCreateZone  show={showModal} onClose={() =>  setShowModal(false) } parentCallback = {handleCallback}/>
            </div>
            
            }

        {saveOK &&
            <div className="bg-white border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] m:w-[327px]" role="alert">
                <div className="flex">
                    <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]'/>
                    <p className="text-[14px] leading-[22px] font-bold tracking-[-1px] flex-auto">Zona guardada exitosamente.</p>
                    <IoClose className='self-center cursor-pointer' onClick={() => setSaveOK(false)}/>
                </div>
            </div>
        }

        {deleteOK &&
            <div className="bg-white border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] m:w-[327px]" role="alert">
            <div className="flex">
                <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]'/>
                <p className="text-[14px] leading-[22px] tracking-[-1px] font-bold flex-auto">Zona eliminada exitosamente.</p>
                <IoClose className='self-center cursor-pointer' onClick={() => setDeleteOK(false)}/>
            </div>
        </div>
        }

        
            { !loading && 
                <div className='m:flex m:flex-wrap m:ml-[24px]'>
                
                    {zones && zones.length > 0 && 
                        zones.map((zone) => {
                            return (<CardZone title={zone.name} amount={zone.number_branches} ide={zone.id} status={zone.active} creationDate={zone.creation_date} key={zone.id} parentCallback = {handleCallback} submodules={props.submodules}/>)
                        })   
                    }

                    {zones && zones.length === 0 &&
                                <div className='flex-wrap text-center'>
                                    <span className='text-[24px]'>🤓</span> <span className='text-[16px] font-semibold text-hw-white'> No hay zonas configuradas, presiona el botón "Crear nueva zona" para comenzar... </span>
                                </div>
                    }
                    <div className='pb-[10px]'/>
                </div>
        }

        {/* Mientras el contador sea !==0 sigue mostrando el cargar más */}
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
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Gestión de Zonas"}, { withCredentials: true, headers: {
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


