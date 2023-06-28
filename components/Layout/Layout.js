import Image from 'next/image';
import {CgMenuLeft} from 'react-icons/cg';
import { HiHome} from 'react-icons/hi';
import { BsGearFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import { RiBarChartFill,  RiRoadMapLine } from 'react-icons/ri'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import { checkSubmodule } from '../Permission/CheckSubmodules';
import axios from 'axios';


const Layout = ( props ) => {

    const {children, refreshDate, refreshText, selected, position} = props;
    const [isOpened, setisOpened] = useState(false);
    const [screens, setScreens] = useState([])
    const [submodules, setSubmodules] = useState(null)
    const {push} = useRouter();

    useEffect(() => {
        async function fetchScreens() {
            await getScreens();
            await getSubmodules();

        }
        fetchScreens();

    }, [])

    const getSubmodules = async () => {
  
        const submodules = await new Promise((resolve, reject) => {
          axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Sucursales"}, { withCredentials: true,})
              .then(response => {
                  resolve(response.data);
              }).catch(error => {
    
                  if (error.response.status === 401) {
                      resolve(error.response.status)
                  }
                  resolve(error);
              })
        });
    
        setSubmodules(submodules.submodules)
    
    }
    
    
      

    const checkScreen = (nameScreen) =>{
        if(screens.filter((screen)=>screen.nameModule===nameScreen).length!==0){

            return true
        }else{

            return false
        }
    }

    const getScreens = async () => {

  

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}getNavBarItems`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
       
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });
        setScreens(response.screens)
       
    }

    const handledOpenMenu = () => {
        setisOpened(!isOpened);
        (isOpened ? document.body.style.overflow = 'auto' : document.body.style.overflow = 'hidden');
    }

    const navigate = (url) => {
       push(url);
    }



   return(
    <div className='bg-gradient-to-b from-[#002B45] to-[#17565B] min-h-screen'>
        {/*NavBar*/}
        <div className="bg-hw-background bg-cover h-[120px] flex flex-inline">
            <div className="flex justify-start ml-[24px]">
                <Image src="/banner.svg" alt="HwMonit Logo" width={216} height={90}/>
            </div>

            {!isOpened &&
                <div className='flex flex-auto justify-end text-white items-center mr-[24px]'>
                    <CgMenuLeft className='w-[32px] h-[32px] cursor-pointer' onClick={()=>handledOpenMenu()}/>
                </div>
            }

            {isOpened &&
                <>
                    <div className="fixed inset-0 min-h-screen bg-black/30 backdrop-blur-sm transition-opacity z-10" onClick={() => handledOpenMenu()}>
                    <div className="fixed right-0 h-screen w-[16.875rem]  bg-[#003C61]/60 z-20 overflow-hidden">
                        <div className="absolute  h-[35rem] w-[35rem]  bg-hw-background bg-cover rounded-full top-[-18.375rem] left-[-8.938rem]">
                            <div className="absolute ml-[12.5rem] mt-[23rem]">
                                <Image src="/burger_menu.svg" alt="HwMonit Logo" width={161} height={120} />
                            </div>
                        </div>

                        {checkScreen("Sucursales") && checkSubmodule(submodules, "Sucursales") ? <div className={`w-[16.875rem] h-[3.563rem] mt-[18.688rem] cursor-pointer ${position === "general"?selected:""}`} onClick={() =>{if(position !== "general"){navigate("/content/general")}}}>
                            <div className="flex">
                                <HiHome className="ml-[1.5rem] mt-[1.063rem] h-[1.5rem] w-[1.5rem] text-[#FAFAFA]" />
                                <div className="ml-[1rem] mt-[1.188rem] text-[1rem] text-[#FAFAFA]">Monitoreo </div>
                            </div>
                        </div>: <div className='mt-[18.688rem]' />}
                        {checkScreen('Mapa') && <div className={`w-[16.875rem] h-[3.563rem] cursor-pointer ${position === "mapsInfo"?selected:""}`} onClick={() =>{if(position !== "mapsInfo"){navigate("/content/mapsInfo")}}}>
                            <div className="flex">
                                <RiRoadMapLine className="ml-[1.5rem] mt-[1.063rem] h-[1.5rem] w-[1.5rem] text-[#FAFAFA]" />
                                <div className="ml-[1rem] mt-[1.188rem] text-[1rem] text-[#FAFAFA]"> Mapa </div>
                            </div>
                        </div>}
                        
                        {checkScreen("Menú Estadísticas") && <div className={`w-[16.875rem] h-[3.563rem] cursor-pointer ${position === "menuStatistics"?selected:""}`} onClick={() =>{if(position !== "menuStatistics"){navigate("/content/menuStatistics")}}}>
                            <div className="flex">
                                <RiBarChartFill className="ml-[1.5rem] mt-[1.063rem] h-[1.5rem] w-[1.5rem] text-[#FAFAFA]" />
                                <div className="ml-[1rem] mt-[1.188rem] text-[1rem] text-[#FAFAFA]"> Estadísticas  </div>
                            </div>
                        </div>}
                        {checkScreen('Configuración') && <div className={`w-[16.875rem] h-[3.563rem] cursor-pointer ${position === "setting"?selected:""}`} onClick={() =>{if(position !== "setting"){navigate("/content/setting")}}}>
                            <div className="flex">
                                <BsGearFill className="ml-[1.5rem] mt-[1.063rem] h-[1.5rem] w-[1.5rem] text-[#FAFAFA]" />
                                <div className="ml-[1rem] mt-[1.188rem] text-[1rem] text-[#FAFAFA]"> Configuración </div>
                            </div>
                        </div>}

                        


                        <div className="absolute w-[16.875rem] h-[3.563rem] cursor-pointer" onClick={() => { navigate("/logout") }}>
                            <div className="flex">
                                <BiExit className="ml-[1.5rem] mt-[1.063rem] h-[1.5rem] w-[1.5rem] text-[#FAFAFA]"  />
                                <div className="ml-[1rem] mt-[1.188rem] text-[1rem] text-[#FAFAFA]"> Salir </div>
                            </div>
                        </div>

                       
                    </div>
                     <div className='absolute  bottom-0 right-0 h-8 mr-[24px] text-[#FAFAFA] text-[11px] font-normal'>© 2022 Meta-X</div>
 
                    </div>   
                    
                </>
            }       

        </div>
        
        {/*RefreshBar*/}{/*18/11/2021 · 11:13:20*/}
        <div className='bg-white/[15%]'>
            <div className='flex flex-auto items-center h-[40px] ml-[24px] m:justify-end m:mr-[24px]'>  
                <div className='text-[13px] text-white'>{refreshText} <span className='font-bold'>{refreshDate}</span></div>
            </div>
        </div>
        
        {/*Content*/}
        <div >
            {children}
        </div>

    </div>
   );
}

export default Layout;



export async function getServerSideProps(context) {

 
    function cookieParser(cookieString) {
   
      // Return an empty object if cookieString
      // is empty
      if (cookieString === "")
          return {};
  
      // Get each individual key-value pairs
      // from the cookie string
      // This returns a new array
      let pairs = cookieString.split(";");
  
      // Separate keys from values in each pair string
      // Returns a new array which looks like
      // [[key1,value1], [key2,value2], ...]
      let splittedPairs = pairs.map(cookie => cookie.split("="));
  
  
      // Create an object with all key-value pairs
      const cookieObj = splittedPairs.reduce(function (obj, cookie) {
  
          // cookie[0] is the key of cookie
          // cookie[1] is the value of the cookie
          // decodeURIComponent() decodes the cookie
          // string, to handle cookies with special
          // characters, e.g. '$'.
          // string.trim() trims the blank spaces
          // auround the key and value.
          obj[decodeURIComponent(cookie[0].trim())]
              = decodeURIComponent(cookie[1].trim());
  
          return obj;
      }, {})
  
      return cookieObj;
  }



  if(submodules===401){
    return {
        redirect: {
          permanent: false,
          destination: "/",
        },
        props:{},
      };
    }
  
    let modules = cookieParser(context.req.headers.cookie).modules
    let propsToPerms = {
        submodules: submodules.submodules,
        modules
    }
    return {
        props: propsToPerms, // will be passed to the page component as props
    }
  }