
import { useState } from "react";
import axios from "axios";
import ModuleSwitch from "./ModuleSwitch";
import { checkSubmodule } from "../Permission/CheckSubmodules";
import { useRouter } from "next/router";
const CardModule = ( props ) => {
    const {module, ide, status} = props;
    const [showModal, setShowModal] = useState(false);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();
    const getDetails = async () => {
      setShowModal(true);
      setLoading(true);

      //Agregar Lógica para los Dispositivos
      const listDetails = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}branch_office/status/${ide}`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if (error.response.status === 401) {
                  push('/')
                }
                resolve(error);
            })
      });

      setDetails(listDetails);
      setLoading(false);

    }
    const handleCallback = (childData) =>{
      if(childData){
        props.parentCallback(childData);
      }
    }


    return(
        <div className='flex flex-col  mx-[24px] m:mx-0 m:mr-[15px] w-[327px] bg-[#D6E1E7]/25 rounded-[16px] mb-[11px] leading-[19px] tracking-[-3%]'>
              <div className='flex justify-between ml-[24px] mt-[16px] mr-[24px] mb-[10px]'>
                <div className='self-center  font-bold text-[#FAFAFA] text-[14px]'>{module.nameModule}</div>
                {checkSubmodule(props.submodules,'Gestionar Permisos Rol') && <ModuleSwitch ide={ide} submodules={module.submodules} status={module.active} handleCallback={handleCallback}></ModuleSwitch>}
               
            </div>
            <hr className='bg-white/[0.10] border-none h-[8px] mb-[16px]' />

            <div className='mt-[10px] mb-[24px] ml-[24px] mr-[24px] '>
              {module.submodules.map((submodule)=>
                <div className="flex justify-between my-[8px]">
                <div className="text-[14px] text-[#FAFAFA] leading-[12px]  self-center">{submodule.nameSubmodule}</div>
                  {checkSubmodule(props.submodules,'Gestionar Permisos Rol') && <ModuleSwitch status={submodule.active} ide={ide} idSubmodule={submodule.id} handleCallback={handleCallback}></ModuleSwitch> }
                </div>
              )

              }


              </div> 
            
           
        </div>
   );

}

export default CardModule;