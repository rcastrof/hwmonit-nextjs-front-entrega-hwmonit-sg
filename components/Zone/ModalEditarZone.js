import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiRoadMapLine } from 'react-icons/ri'

import {BsCheck, BsTrashFill} from 'react-icons/bs'
import { Dialog, Transition} from '@headlessui/react'
import { useForm } from 'react-hook-form'
import HwSwitch from '../HwSwitch'
import axios from "axios";
import { useRouter } from "next/router";
import {Bars} from 'react-loader-spinner';
import {IoCloseCircle, IoAddCircle} from 'react-icons/io5'
import { checkSubmodule } from '../Permission/CheckSubmodules'
const ModalEditarZone = ( props ) =>  {

    const { show, onClose, loading, details} = props;
    const cancelButtonRef = useRef(null);
    let {register, handleSubmit,formState:{errors}, clearErrors, setValue } = useForm();
    const [active, setActive] = useState(props.active)
    const [saveForm, setSaveForm] = useState(true)
    const [branchDetails, setBranchDetails] = useState(props.branchDetail)
    const [branchesToAsign, setBranchesToAsign] = useState(props.branchesToAsign)
    useEffect(() => {
        setBranchDetails(props.branchDetail);
    }, [props.branchDetail])
    useEffect(() => {
        setBranchesToAsign(props.branchesToAsign);
    }, [props.branchesToAsign])
    useEffect(() => {
        setActive(props.active);
    }, [props.active])
    const { push } = useRouter();
    const onSubmit = async (event) => {

        if(saveForm){
            setSaveForm(false);
            const zone_name = event.zone_name;
            const zone_label = event.zone_label;
            let detailBranchId = branchDetails.map((branchDetailId) => { return branchDetailId._id });


            const data = {
                name: zone_name,
                active: active,
                label: zone_label,
                branch_office: detailBranchId
            }

           
            const listDetails = await new Promise((resolve, reject) => {
                axios.put(`${process.env.REACT_APP_API_URL}zone/${details.zone._id}`, data, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        resolve(error);
                    })
            });

            props.parentCallback({state: true, status: listDetails.status,  message: "save"});
            setSaveForm(true);
            onClose();   
        }

 
    };

    const deleteZone = async () => {
        if(saveForm){
            setSaveForm(false);

            const listDetails = await new Promise((resolve, reject) => {
                axios.delete(`${process.env.REACT_APP_API_URL}zone/${details.zone._id}`, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        resolve(error);
                    })
            });

            props.parentCallback({state: true, status: listDetails.status,  message: "delete"});
            setSaveForm(true);
            onClose();   
        }

    }

    const closeModal = () => {
        setValue('zone_name', details.zone.name, { shouldDirty: true })
        setValue('zone_label', details.zone.label, { shouldDirty: true })
        clearErrors()
        onClose();
    }

    const handleCallback = (childData) =>{
        setActive(childData);
    }

    const removeBranch = (id) => {

        let filterBranch =  branchDetails.filter((branch) => {return branch._id !== id})
        let unassingedBranch =  branchDetails.filter((branch) => {return branch._id === id})[0]
        let newBranchesToAssign = [...branchesToAsign, unassingedBranch]
        setBranchDetails(filterBranch)
        setBranchesToAsign(newBranchesToAssign)
    }

    const addBranch = (branch) =>{
        if(branchDetails.filter((bInList)=> bInList._id===branch._id ).length===0){
            let newBranchDetails = [...branchDetails,branch]
            let unassingedBranch =  branchesToAsign.filter((bInList) => {return bInList._id !== branch._id})
            setBranchesToAsign(unassingedBranch)
            setBranchDetails(newBranchDetails)
            
        }
    }

    return (
       
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => closeModal()} >
                <div className="flex items-end justify-center min-h-screen  px-4 pb-20 text-center content-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black/30  backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 "
                        enterTo="opacity-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 "
                        leaveTo="opacity-0 translate-y-4 "
                    >
                        <div className="inline-block w-[327px] h-[610px] align-bottom  bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[2.5rem] m:my-[2rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                    <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <RiRoadMapLine className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            {details.zone ? details.zone.name : ''}
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />

                            
                            { loading &&
                                <div className='flex flex-row justify-center mt-[24px]'>
                                    <Bars color="#FAFAFA" height={80} width={80} />
                                </div>
                            }

                            
                            { !loading &&
                            <>
                            
                                {/*Contenido*/}
                                <form onSubmit={handleSubmit(onSubmit)} id="createZone">
                                <div className="h-[380px] overflow-y-auto gt-scroll">
                                    <label className='text-white text-sm flex flex-col'>
                                        <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Nombre de zona:</div>
                                        <input 
                                             name='zone_name' type="text"  
                                            className="ml-[24px] border-[2px] border-white/20 bg-transparent text-white/60 rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                            autoComplete='off'
                                            defaultValue={details.zone.name}
                                            disabled/>
                                            
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Etiqueta de zona:</div>
                                        <input 
                                            {...register("zone_label", {required: {value: true, message: "* Campo Requerido"}, 
                                            })} name='zone_label' type="text"  
                                            className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                            defaultValue={details.zone.label}
                                            autoComplete='off'/> 

                                        {errors.zone_label && <span className='text-xs text-hw-white ml-[24px]'>{errors.zone_label.message}</span>}
                                         
                                         <div className='mt-[20px] flex'>
                                             <div className='ml-[24px] mr-[8px] text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>Inactivo</div>
                                            <HwSwitch parentCallback = {handleCallback} status={active}/>
                                            <div className='self-center ml-[8px] text-[#84BD00] font-semibold  text-[16px] leading-[21.79px] tracking-[-5%]'>Activo</div>
                                        </div>
                                        
                                        <div className='flex mt-[24px] font-bold ml-[24px]'>
                                            Sucursales asignadas a esta zona
                                        </div>

                                        <div className='flex h-[60px] leading-[21.79px] tracking-[-5%] text-[16px] flex-wrap  ml-[16px] mt-[16px]'>
                                            {branchDetails !== undefined && branchDetails.length > 0 &&
                                                branchDetails.map((branch)=>{
                                                    return(
                                                        <div className= 'h-[38px] bg-white/[0.15] flex min-w-fit items-center rounded-[10px] ml-[8px] mb-[8px]'>
                                                            <div className='text-[14px] text-white mr-[16px] leading-[19.07px] tracking-[-5%] pl-[14px] flex-auto '>{branch.label}</div>
                                                            {checkSubmodule(props.submodules,"Desasignar Sucursal") &&<IoCloseCircle className="self-center h-[20px] w-[20px] mr-[8px] cursor-pointer text-white" onClick={() => removeBranch(branch._id)}/> }
                                                        </div>  
                                                    )
                                                    })
                                    
                                                }


                                             {  branchDetails.length === 0 &&
                                            <div className='mt-[8px]'>
                                                 <span className='text-[24px]'>😒</span> <span className='text-[16px] font-semibold text-hw-white'> Zona sin sucursales asignadas ... </span>
                                            </div>
                                            }
    
                                
                                        </div>
                                        
                                    </label>

                                    </div>

                                </form>

                            <div className='flex mt-[20px]'>
                                            {checkSubmodule(props.submodules,'Eliminar Zona') ? <><div 
                                                className="h-[48px] w-[135px] border-[2px] border-white/20 bg-transparent rounded-[10px] ml-[24px] mr-[9px] text-[16px]  leading-[22px] tracking-[-1px]"
                                                onClick={() => closeModal()}
                                            >
                                               
                                                <div className='flex ml-[20px] cursor-pointer' onClick={()=>{props.showModalDelete()}}>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/20 mt-[10px]">
                                                        <BsTrashFill className='w-[14px] h-[14px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] mt-[11px]'>Eliminar</div>
                                                </div> 
                                                
                                            </div> <button type="submit"  form="createZone"
                                            className="h-[48px] w-[135px] bg-[#EA683F] rounded-[10px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                <div className='flex ml-[20px]'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                </div> 
                                            </button></>
                                            :<button type="submit"  form="createZone"
                                            className="h-[48px]  w-[135px] bg-[#EA683F] rounded-[10px] ml-[24px] mr-[24px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                                <div className='flex ml-[20px]'>
                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                                    </div>
                                                    <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                                </div> 
                                            </button>}
                                            
                                   
                            </div>                
                                      
                            </>
                            }

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalEditarZone;