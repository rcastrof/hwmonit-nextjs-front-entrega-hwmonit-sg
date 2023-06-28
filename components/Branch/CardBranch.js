import { BsArrowRightShort } from "react-icons/bs";
import { RiContactsBookFill } from 'react-icons/ri'
import { useState } from "react";
import axios from "axios";
import ModalEditarBranch from "../Branch/ModalEditarBranch";
import ModalContact from "../Branch/ModalContact";
import ModalDelete from "../Branch/ModalDelete";
import { checkSubmodule } from "../Permission/CheckSubmodules";
import { useRouter } from "next/router";
const CardBranch = (props) => {
  const { title, amount, status, ide, creationDate, contactId } = props;
  const [showModal, setShowModal] = useState(false);
  const [showModalContact, setShowModalContact] = useState(false);
  const [details, setDetails] = useState([]);
  const [branchDetail, setBranchDetail] = useState([]);
  const [contactDetails, setContactDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCard, setLoadingCard] = useState(true);
  const [active, setActive] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalDeleteBranch, setShowModalDeleteBranch] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const { push } = useRouter();

  let timeOptions = { year: "numeric", month: "long", day: "numeric" };
  const [dateUpdate, setDateUpdate] = useState(new Date(creationDate).toLocaleString("es-ES", timeOptions))

  const getDetails = async (id) => {
    setShowModal(true);
    setLoadingCard(true);

    const listDetails = await new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}branch_office/${id}`, { withCredentials: true })
        .then(response => {
          resolve(response.data);
        }).catch(error => {
          if (error.response.status === 401) {
            push('/')
          }
          resolve(error);
        })
    });

    const availableList = await new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}deviceAvailable`, { withCredentials: true })
        .then(response => {
          resolve(response.data);
          setAvailableDevices(response.data.device)
        }).catch(error => {
          if (error.response.status === 401) {
            push('/')
          }
          resolve(error);
        })
    });

    setDetails(listDetails);

    setActive(listDetails.branch_office.active);


    if (listDetails !== undefined && listDetails.branch_office !== undefined) {
      setBranchDetail(listDetails.branch_office)
      setDeviceDetails(listDetails.branch_office.device)

    }

    setLoadingCard(false);

  }

  const handleCallback = (childData) => {
    if (childData && childData.state) {

      props.parentCallback(childData);
    }
  }

  const getChip = () => {

    if (status === true) {
      return (<div className="flex self-end h-[24px] w-[56px] mt-[22px] mr-[25px] bg-[#84BD00] rounded-[31px] text-[#FAFAFA] font-semibold leading-[18px] tracking-[-4%] text-[14px]">
        <div className="self-center ml-[9px]">
          Activo
        </div>
      </div>)
    } else if (status === false) {
      return (<div className="flex self-end h-[24px] w-[66px] mt-[22px] mr-[25px] bg-[#DA5151] rounded-[31px] text-[#FAFAFA] font-semibold leading-[18px] tracking-[-4%] text-[14px]">
        <div className="self-center ml-[9px]">
          Inactivo
        </div>
      </div>)
    }

  }


  const getContact = async (id) => {
    setShowModalContact(true)
    setLoading(true)

    if (id !== null && id !== undefined) {
      const listDetails = await new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_API_URL}contact/${id}`, { withCredentials: true })
          .then(response => {
            resolve(response.data);
            setContactDetails(response.data.contact)
       
          }).catch(error => {
            if (error.response.status === 401) {
              push('/')
            }
            resolve(error);
          })
      });
    }
    setLoading(false)

  }
  const changeToDelete = () => {
    setShowModalContact(false)
    setTimeout(()=>{
      setShowModalDelete(true)
    },500)
    
  }

  const changeToDeleteBranch = () => {
    setShowModalContact(false)
    setTimeout(()=>{
      setShowModalDeleteBranch(true)

    },500)
    
  }


  return (
    <div className='flex flex-col h-[154px] mx-[24px] m:mx-0 m:mr-[15px] m:w-[327px] bg-white/[15%] rounded-[16px] mb-[11px] leading-[18px] tracking-[-2%]'>
      <div className='flex'>
        <div className='flex-auto mt-[24px] ml-[24px] font-bold text-[18px] text-[#FAFAFA]'>{title}</div>
        {getChip()}
      </div>

      <div className='mt-[4px] ml-[24px] text-[14px]'>
        <div className="text-[16px] text-[#FAFAFA]"> {amount} <span className="mt-[4px] text-[16px] text-[#FAFAFA]">dispositivos</span> </div>
      </div>
      <div className="ml-[24px] text-white/80 text-[12px] mt-[10px] ">Creación: {dateUpdate}</div>
      <div className="flex">
        {checkSubmodule(props.submodules, "Editar Contacto Sucursal") && <div className="flex-auto self-end ml-[24px]">
          <div className="flex bg-[#EA683F] w-[120px] h-[32px] rounded-[8px] cursor-pointer mt-[11px]" onClick={() => getContact(contactId)}>
            <RiContactsBookFill className=" text-[#FAFAFA] mr-[0.5rem] self-center ml-[4px]" />
            <div className="text-[14px] text-[#FAFAFA] leading-[18px] tracking-[-4%] self-center">
              Ver Contacto
            </div>
          </div>
          <ModalContact show={showModalContact} onClose={() => setShowModalContact(false)} parentCallback={handleCallback} loading={loading} details={contactDetails} idBranch={ide} creation={contactDetails.creation_date} showModalDelete={changeToDelete}/>
          <ModalDelete show={showModalDelete} onClose={() => setShowModalDelete(false)} contactId={contactDetails._id} parentCallback={handleCallback} selection={1} />

        </div>}
        {checkSubmodule(props.submodules, "Modificar Sucursal") && 
        <div>
          <div className='self-end text-[14px] mt-[20px] flex mr-[24px] cursor-pointer text-[#FAFAFA] font-semibold'
            onClick={() => getDetails(ide)}    >Editar <BsArrowRightShort className='mt-[4px] ml-[6px]' />
          </div>
          <ModalEditarBranch show={showModal} onClose={() => setShowModal(false)} parentCallback={handleCallback} loading={loadingCard} details={details} deviceDetails={deviceDetails} availableDevices={availableDevices} active={active} showModalDelete={changeToDeleteBranch} submodules={props.submodules}/>
          <ModalDelete show={showModalDeleteBranch} onClose={() => setShowModalDeleteBranch(false)} branchId={branchDetail._id} parentCallback={handleCallback} selection={2} />   
        </div>}
      </div>

    </div>
  );

}

export default CardBranch;