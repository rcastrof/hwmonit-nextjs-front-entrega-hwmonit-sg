import React,{ useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { HiOutlineRefresh } from 'react-icons/hi'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import {Bars} from 'react-loader-spinner';
import {RiAddLine} from 'react-icons/ri'
import { useRouter } from "next/router";
import axios from 'axios';
import CardModule from '../../components/RoleSettings/CardModule'
import ModalConfigRol from '../../components/Permission/ModalConfigRol'
import ModalDelete from '../../components/Permission/ModalDelete'
import  { checkSubmodule } from '../../components/Permission/CheckSubmodules'
function roleSettings(props) {
    const router = useRouter();
    const {push} = router;
    const {id} = router.query;

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalRol, setShowModalRol] = useState(false);

    const [modules, setModules] = useState([])
    const [typeUser, setTypeUser] = useState(null)
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const navigate = (url) => {
        push(url);
    }

    useEffect(() => {

        async function fecthInfo(id){
            await getInfo(id);
         }
     
        if(id !== undefined){
             fecthInfo(id);           
        }

    
      }, [id])
    const getInfo = async (ide) => {

        setInitialLoading(true);

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}submodulesNew/${ide}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
            });
            setTypeUser(response.permissonsView[0].typeUser)
            setModules(response.permissonsView[0].permissons)
            setInitialLoading(false);
    }


    const reloadInfo = async (ide) => {

        setLoading(true);

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}submodulesNew/${ide}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
            });

            setTypeUser(response.permissonsView[0].typeUser)
            setModules(response.permissonsView[0].permissons)
            setLoading(false);
    }

    const handleCallback = (childData) =>{
        if(childData && childData.state){
            reloadInfo(id)
        }
    }

    const changeToDelete = () => {
        setShowModalRol(false)
        setTimeout(()=>{
          setShowModalDelete(true)
        },500)
        
      }
    return (<>
        <Layout refreshDate='' selected='bg-[#FAFAFA]/20' position="setting">
        <div className='flex-row flow-root'>
            
            <div className='flex mt-[10px] mb-[12px] float-left'>
            <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={()=>{navigate("/content/permission")}}>
                <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                    <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                </div>
                <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
            </div>
            </div>

            <div className='flex mt-[10px] mb-[22px] float-right'>
                <div className='flex cursor-pointer'onClick={()=>reloadInfo(id)}>
                    <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                        <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                    </div>
                    <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                </div>
            </div>
        </div>


            { initialLoading &&
                <div className='flex justify-center mt-[24px]'>
                    <Bars color="#FAFAFA" height={80} width={80} />
                </div>
            }

            {!initialLoading && 
            <><div className='font-bold text-[32px] leading-[42px] text-hw-white  ml-[24px] mt-[12px] mb-[27px]'>
               {typeUser}
            </div>
            {checkSubmodule(props.submodules, 'Configurar Rol') && 
            <div>
                <div className='flex w-[216px] h-[48px] bg-[#EA683F] cursor-pointer rounded-[10px] ml-[24px]  mb-[13px]' onClick={( )=> setShowModalRol(true) }>
                    <div className='flex self-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 ml-[16px] mr-[8px]'>
                        <RiAddLine className="self-center text-white w-[24px] h-[24px]"/>
                    </div>
                    <div className='self-center text-white text-[16px] font-bold leading-[22px] tracking-[-1%] '>
                        Configuración de Rol
                    </div>
                </div>
                <ModalConfigRol show={showModalRol} onClose={() => setShowModalRol(false)} nameRol={typeUser} showModalDelete={changeToDelete}/>
                <ModalDelete show={showModalDelete} onClose={() => setShowModalDelete(false)} nameRol={typeUser} />
            </div>
            }

            
                {loading && 
                    <div className='flex justify-center self-center ml-[24px] mt-[24px]'>
                    <Bars color="#FAFAFA" height={80} width={80} />
                    </div>
                }{!loading && 
                   
            <div className='flex mt-[20px] flex-wrap m:ml-[24px]'>
                  {/* Contenido */}
                
                     {modules && modules.length!==0 && modules.map((module)=>
                            <CardModule ide={id} module={module} parentCallback={handleCallback} submodules={props.submodules}/>
                        )}

            </div>}   </>}

        </Layout>

    </>


    )
}

export default roleSettings

export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Panel de Administración"}, { withCredentials: true, headers: {
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

//   if(context.req.headers.referer || context.req.headers.referer !== `${process.env.NEXT_PUBLIC_SELF_URL}content/permission` || context.req.headers.referer.split(process.env.NEXT_PUBLIC_SELF_URL)[1]===context.req.url){
//     return {
//         redirect: {
//           permanent: false,
//           destination: "/",
//         },
//         props:{},
//       };
//     }
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