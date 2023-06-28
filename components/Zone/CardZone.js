import {BsArrowRightShort, BsCheck, BsExclamation} from "react-icons/bs";

import { useState } from "react";
import axios from "axios";
import ModalEditarZone from "./ModalEditarZone";
import ModalDelete from "./ModalDelete";
import { checkSubmodule } from "../Permission/CheckSubmodules";
import { useRouter } from "next/router";
const CardZone = ( props ) => {
    const {title, amount, status, ide, creationDate} = props;
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [details, setDetails] = useState([]);
    const [branchDetail, setBranchDetail] = useState([]);
    const [branchNoZone, setBranchNoZone] = useState([])
    const [loading, setLoading] = useState(true);
    const [loadingCard, setLoadingCard] = useState(true);
    const [active, setActive] = useState(false);
    const { push } = useRouter();
    let timeOptions = {year: "numeric", month: "long", day: "numeric"};
    const [dateUpdate, setDateUpdate] = useState(new Date(creationDate).toLocaleString("es-ES", timeOptions))
    
    const getDetails = async (id) => {
      setShowModal(true);
      setLoadingCard(true);

      const listDetails = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}zone/${id}`, { withCredentials: true })
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
      setActive(listDetails.zone.active);

      if(listDetails !== undefined && listDetails.zone !== undefined && listDetails.zone.branch_office.length > 0) {
        setBranchDetail(listDetails.zone.branch_office.map((branch)=>{return branch}))
        setBranchNoZone(listDetails.branches_no_zone)
      }

      setLoadingCard(false);

    }

    const handleCallback = (childData) =>{
      if(childData){
        props.parentCallback(childData);
      }
  }

    const getChip = () => {
     
      if(status === true){
        return(<div className="flex self-end h-[24px] w-[56px] mt-[22px] mr-[25px] bg-[#97BA35] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
        <div className="self-center ml-[9px] font-semibold">
          Activo
        </div>
    </div>)
      }else if(status === false){
        return(<div className="flex self-end h-[24px] w-[66px] mt-[22px] mr-[25px] bg-[#DA5151] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
        <div className="self-center ml-[9px] font-semibold">
          Inactivo
        </div>
      </div>)
      }
    
    }
    const changeToDelete = () => {
      setShowModal(false)
      setTimeout(()=>{
        setShowModalDelete(true)
      },500)
      
    }


    return(
        <div className='flex flex-col h-[115px] mx-[24px] m:mx-0 m:mr-[15px] m:w-[327px] bg-white/[0.15] rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%]'>
              <div className='flex'>
                <div className='flex-auto mt-[24px] text-white ml-[24px] font-bold text-[20px]'>{title}</div>
                {getChip()}
            </div>

            <div className='mt-[4px] ml-[24px] '>
              <div className="text-white text-[16px]"> {amount} <span className=" text-white/80">{amount===1? "sucursal":"sucursales"}</span> </div>
            </div> 

            <div className="flex flex-row mt-[16px]" >
            <div className="flex-auto ml-[24px] text-white/80 text-[12px]">Creación: {dateUpdate}</div>
              {checkSubmodule(props.submodules, "Modificar Zona") && 
              <div>
                <div className='flex-end text-[14px] text-white flex mr-[24px] items-center cursor-pointer font-semibold'
                    onClick={( )=> getDetails(ide) }    >Editar <BsArrowRightShort className=' ml-[6px]'/>
                </div>
                    <ModalEditarZone  show={showModal} onClose={() =>  setShowModal(false) } parentCallback = {handleCallback} loading = {loadingCard} details = {details} branchDetail = {branchDetail} branchesToAsign = {branchNoZone} active={active} showModalDelete={changeToDelete} submodules={props.submodules}/>
                    <ModalDelete  show={showModalDelete} onClose={() =>  setShowModalDelete(false) } parentCallback = {handleCallback} details = {details} />
              </div>
              }
            </div>

        </div>
   );

}

export default CardZone;