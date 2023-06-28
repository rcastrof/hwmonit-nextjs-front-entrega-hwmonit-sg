import { BsArrowRightShort, BsCheck, BsExclamation } from "react-icons/bs";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import ModalEditarDeviceType from "./ModalEditarDeviceType";
import { MdLabelImportant } from "react-icons/md";
import ModalDelete from "./ModalDeleteDeviceType";
import { checkSubmodule } from "../Permission/CheckSubmodules";
const CardDeviceType = (props) => {
  const { title, label, ide, creationDate } = props;
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

    const listDetails = await new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}deviceType/${id}`, { withCredentials: true })
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


  return (
    <div className='flex flex-col h-[154px] mx-[24px] m:mx-0 m:mr-[15px] m:w-[327px] bg-white/[0.15] rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%]'>
      <div className='flex' >
        <div className='flex-auto mt-[24px] ml-[24px] font-bold text-[20px] text-white align-top'>{title}</div>

      </div>

      <div className='flex mt-[16px] ml-[24px] text-[16px]'>
        <MdLabelImportant className="text-[#EA683F] self-center mr-[0.5px]" />
        <div className="text-[16px] text-[#EA683F] font-bold self-center"> {label} </div>
      </div>

      <div className="flex flex-row mt-[28px]">
        <div className="flex-auto ml-[24px] text-white/80 text-[12px] mt-[4px] ">Creación: {dateUpdate}</div>
        {checkSubmodule(props.submodules, "Modificar Tipo de Dispositivo") && 
        <div>
          <div className='self-end text-[14px]  flex mr-[24px] cursor-pointer text-white font-semibold'
               onClick={() => getDetails(ide)}    >Editar <BsArrowRightShort className='mt-[4px] ml-[6px]' />
          </div>
          <ModalDelete show={showModalDelete} onClose={()=> setShowModalDelete(false)} ide={ide} parentCallback={handleCallback}>  </ModalDelete>
          <ModalEditarDeviceType show={showModal} onClose={() => setShowModal(false)} parentCallback={handleCallback} loading={loadingCard} details={details} showModalDelete={changeToDelete} submodules={props.submodules}/>
        </div>}
      </div>

    </div>
  );

}

export default CardDeviceType;