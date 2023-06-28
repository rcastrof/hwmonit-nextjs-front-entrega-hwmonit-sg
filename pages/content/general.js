import Layout from '../../components/Layout/Layout'
import Chip from '../../components/General/Chip';
import CardGeneral from '../../components/General/CardGeneral';
import ModalFiler from '../../components/General/ModalFiler';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Bars} from 'react-loader-spinner';
import { useRouter } from "next/router";
import { BiSliderAlt } from 'react-icons/bi';
import { checkSubmodule } from '../../components/Permission/CheckSubmodules';


export default function General(props) {

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [refreshDate, setRefreshDate] = useState(new Date().toLocaleString("es-ES",{ year: "numeric", month: "long", day: "numeric", hour:"2-digit", minute:'2-digit', second:'2-digit' }))
  const {push} = router;
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [branchId, setBranchId] = useState('-1');
  const [zoneId, setZoneId] = useState('-1');
  const [filterState, setFilterState] = useState(-1);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {

    if(!checkSubmodule(props.submodules,"Sucursales")){
      push('/logout')
    }
    async function fecthBranches(){
      await getBranches();
    }
    fecthBranches();

  }, [])
  
  const handleCallback = (children) => {
    branchId = children.branchId
    zoneId = children.zoneId
    setZoneId(children.zoneId)
    setBranchId(children.branchId)
    filterBranches(filterState)
    setIsFiltered(true)
  }
  const getBranches = async () => {

      const branches = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}branch_office/${zoneId}/${branchId}`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if (error.response.status === 401) {
                    resolve(error.response.status)
                }
                resolve(error);
            })
      });
      if(branches===401)
      {
      
        push('/')
      }else{
        setBranches(branches);
      setLoading(false);
      }
      

  }

  const filterBranches = async (state) => {

    setLoading(true);

    const branches = await new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}branch_office/${zoneId}/${branchId}`, { withCredentials: true })
          .then(response => {
              resolve(response.data);
          }).catch(error => {
              if (error.response.status === 401) {
                  resolve(error.response.status)
              }
              resolve(error);
          })
    });
    if(branches===401)
    {
      
      push('/')
    }else{
      if(state === 0){
        branches = branches.filter((branch) => (branch.status_general === state || branch.status_general === -1))
      }else if(state === 1 || state === 2){
        branches = branches.filter((branch) => (branch.status_general === state))
      }
      

      setBranches(branches);
      setRefreshDate(new Date().toLocaleString("es-ES", { year: "numeric", month: "long", day: "numeric", hour:"2-digit", minute:'2-digit', second:'2-digit' }))
      setLoading(false);
    }

}

  const hideFilter = async () =>{
    branchId = '-1';
    zoneId = '-1';
    setZoneId('-1')
    setBranchId('-1')
    await filterBranches(filterState)
    isFiltered = false
    setIsFiltered(false)

  }
  return (
    
    <Layout refreshDate={refreshDate} refreshText="Última actualización" selected ="bg-[#FAFAFA]/20" position="general">
       
  <div className='flex justify-between'>
        <div className='font-bold text-[32px] text-white ml-[24px] mt-[27px] mb-[27px] leading-[42px] tracking-[-3%]'>
            Monitoreo
        </div>

        {!isFiltered && 
        <>
          <button type="submit"
            className="h-[48px] w-[102px] bg-white/[0.15] rounded-[10px] mr-[18px] text-[16px] leading-[22px] tracking-normal mt-[25px] " onClick={() => setShowModalFilter(true)}>
            <div className='flex ml-[8px]'>
              <div className="flex justify-items-end items-end w-[24px] h-[24px]">
                <BiSliderAlt className='w-[24px] h-[24px] text-white' aria-hidden="true" />
              </div>
              <div className='text-white font-semibold ml-[8px]'>Filtro</div>            
            </div>
          </button>
          <ModalFiler show={showModalFilter} data={branches} parentCallBack={handleCallback} onClose={() => setShowModalFilter(false)} />
        </>}

        {isFiltered && <button type="submit"
          className="h-[48px] w-[112px] bg-white/[0.15] rounded-[10px] mr-[18px] text-[15px] leading-[22px] tracking-normal mt-[25px] " onClick={() => hideFilter()}>
          <div className='flex ml-[8px]'>
            <div className='text-[#EA683F] font-semibold ml-[8px]'>Quitar filtro</div>
           
          </div>

        </button>}

      </div>
        <div className='flex mx-[15px] overflow-x-scroll lg:overflow-hidden h-[58px] mb-[16px] gt-scroll'>
          
            <div onClick={() => { filterBranches(-1); setFilterState(-1) }} >
              <Chip name="Todos" status="-1" selectedChip="true"/>
            </div>

            <div onClick={() => { filterBranches(1); setFilterState(1) }}>
              <Chip name="Funcionando" status="1" />
            </div>

           <div onClick={() => { filterBranches(2); setFilterState(2) }}>
              <Chip name="Advertencia" status="2"/>
            </div>
            
            <div onClick={() => { filterBranches(0); setFilterState(0) }}>
              <Chip name="Error" status="0"/>
            </div>

        </div>
        { !loading &&
          <div className='m:flex m:flex-wrap m:ml-[24px]'>
            {branches && branches.length > 0 && branches.map((branch) => {
                if(branch.zone_id !== null){
                  return <CardGeneral title={branch.branch} subtitle={branch.zone} count={branch.count}  status={branch.status_general} ide={branch.id} key={branch.id} submodules={props.submodules}/>;
                }
            })}

            {branches && branches.length === 0 &&
              <div className='flex-wrap text-center'>
                <span className='text-[24px]'>🤔</span> <span className='text-[16px] font-semibold text-hw-white'> No existen sucursales con el estado solicitado ... </span>
              </div>
            }

            <div className='pb-[10px]'/>
          </div>
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
      axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Sucursales"}, { withCredentials: true, headers: {
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

//login (cookie inicial) -> auth ( va a buscar modulos) -> decide a que pagina va

//mover cookie parser a componente auth, indicar de donde viene


//middleware: controlar login, controlar orden de paginas (modulos), modificar gestor de modulos para agregar orden y pagina