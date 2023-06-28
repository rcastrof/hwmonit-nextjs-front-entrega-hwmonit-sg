import { BsArrowRightShort, BsCheck, BsExclamation } from "react-icons/bs";
import { IoCopy } from "react-icons/io5";
import { MdLabelImportant } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ModalEditarDeviceType from "./ModalEditarDevice";
import ModalDeleteDevice from "./ModalConfirmDelete";
import { checkSubmodule } from "../Permission/CheckSubmodules";
const CardDeviceSetting = (props) => {
  const { title, ide, creationDate, status, deviceType, token, isAutomaticShutdown, isElectricityMonitoring } = props;

  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [details, setDetails] = useState([]);
  const [loadingCard, setLoadingCard] = useState(true);
  let timeOptions = { year: "numeric", month: "long", day: "numeric" };
  const [dateUpdate, setDateUpdate] = useState(new Date(creationDate).toLocaleString("es-ES", timeOptions))
  const { push } = useRouter();


  const getDetails = async (id) => {
    setShowModal(true);
    setLoadingCard(true);
    console.log(props)

    const listDetails = await new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}device/${id}`, { withCredentials: true })
        .then(response => {
          resolve(response.data.responseDevice);
        }).catch(error => {
          if (error.response.status === 401) {
            push('/')
          }
          resolve(error);
        })
    });

    setDetails(listDetails);
    setLoadingCard(false);

  }

  const changeToDelete = () => {
    setShowModal(false)
    setTimeout(()=>{
      setShowModalDelete(true)
    },500)
    
  }



  const handleCallback = (childData) => {
    if (childData) {
      props.parentCallback(childData);
    }
  }

  const handleCopy = (token) =>{
    navigator.clipboard.writeText(token)
    props.handleCopyToken()
  }

  const getChip = () => {
     
    if(status === true){
      return(<div className="flex self-end h-[24px] w-[56px] mt-[12px] mr-[25px] bg-[#97BA35] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
      <div className="self-center ml-[9px] font-semibold">
        Activo
      </div>
  </div>)
    }else if(status === false){
      return(<div className="flex self-end h-[24px] w-[66px] mt-[12px] mr-[25px] bg-[#DA5151] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
      <div className="self-center ml-[9px] font-semibold">
        Inactivo
      </div>
    </div>)
    }
  }

  const getElectricity = () => {
    if(isElectricityMonitoring === true){
      return(<div className="flex self-end h-[24px] w-[66px] mt-[12px] mr-[25px] bg-[#97BA35] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
      <div className="self-center ml-[9px] font-semibold">
        Activo
      </div>
  </div>)
    }else if(isElectricityMonitoring === false){
      return(<div className="flex self-end h-[24px] w-[66px] mt-[12px] mr-[25px] bg-[#DA5151] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
      <div className="self-center ml-[9px] font-semibold">
        Inactivo
      </div>
    </div>)
    }
  }

  const getAutomaticShutdown = () => {
    console.log(isAutomaticShutdown)
    if(isAutomaticShutdown === true){
      return(<div className="flex self-center h-[24px] w-[66px] mt-[12px] mr-[25px] bg-[#97BA35] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
      <div className="self-center ml-[9px] font-semibold">
        Activo
      </div>
  </div>)
    }else if(isAutomaticShutdown === false){
      return(<div className="flex self-center h-[24px] w-[66px] mt-[12px] mr-[25px] bg-[#DA5151] rounded-[31px] text-white  leading-[18px] tracking-[-4%] text-[14px]">
      <div className="self-center ml-[9px] font-semibold">
        Inactivo
      </div>
    </div>)
    }
  }


  return (
    <div className='flex flex-col h-[232px] mx-[24px] m:mx-0 m:mr-[15px] m:w-[327px] bg-white/[0.15] rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%]'>
      {getChip()}
      {getElectricity()}
      {getAutomaticShutdown()}
      
      <div className='flex' >
        
        <div className='flex-auto mt-[8px] ml-[24px] font-bold text-[20px] h-[30px] text-white'>{title}</div>
        
      </div>

      <div className='mt-[4px] ml-[24px] text-[16px] ]'>
        <div className=" font-semibold text-white text-[16px] mb-[8px] leading-[18px] tracking-[-2%]">Tipo de dispositivo:</div>
        <div className="flex font-bold text-[16px] text-[#EA683F] self-center"> <MdLabelImportant className="text-[#EA683F] text-[18px] self-center mr-[0.5px]" /> {deviceType} </div>
      </div>

      <div className="flex-auto ml-[24px] text-white/80 text-[12px] mt-[28px]  ">Creación: {dateUpdate}</div>
      <div className="flex flex-row justify-between mb-[18px] align-middle mt-[20px] ">
        <div className="flex self-start bg-[#EA683F] text-white ml-[24px]  h-[32px] w-[121px] rounded-lg cursor-pointer "  onClick={()=>{handleCopy(token)}}>
        <IoCopy className="self-center ml-[9px] "></IoCopy>
        <div className="self-center text-[14px] bg- text-white leading-[18px] tracking-[-2%] ml-[4px]" >Copiar token</div>
        </div>
        
        {checkSubmodule(props.submodules, "Modificar Dispositivo" ) && 
          <div>
            <div className='self-center text-[14px] flex mr-[24px] text-white cursor-pointer font-semibold'
              onClick={() => getDetails(ide)}> Editar <BsArrowRightShort className='mt-[4px] ml-[6px]' />
            </div>
            <ModalDeleteDevice show={showModalDelete} onClose={()=> setShowModalDelete(false)} ide={ide} parentCallback={handleCallback}></ModalDeleteDevice>
            <ModalEditarDeviceType show={showModal} onClose={() => setShowModal(false)} parentCallback={handleCallback} loading={loadingCard} details={details} active={status} showModalDelete={changeToDelete} submodules={props.submodules}/>
          </div>
        }
      </div>

    </div>
  );

}

export default CardDeviceSetting;