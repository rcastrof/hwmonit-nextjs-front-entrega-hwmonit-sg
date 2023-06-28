import {BsTrashFill} from "react-icons/bs";
import { useState } from "react";
import ModalAddSubmodule from "./ModalAddSubmodule";
import ModalDeleteSubmodule from "./ModalDeleteSubmodule";
import ModalDeleteModule from "./ModalDeleteModule";
import { IoMdAddCircle } from 'react-icons/io'
import {RiEyeOffLine, RiEyeLine } from 'react-icons/ri'
import { checkSubmodule } from "../Permission/CheckSubmodules";
import { useForm } from 'react-hook-form'
import axios from 'axios'


const CardModule = (props) => {
  const { module } = props;
  const [showModal, setShowModal] = useState(false);
  const [showModalDeleteModule, setShowModalDeleteModule] = useState(false)
  const [showModalDeleteSubmodule, setShowModalDeleteSubmodule] = useState(false)
  const [idSubmoduleToDelete, setIdSubmoduleToDelete] = useState();
  const [idModule, setIdModule] = useState(props.id)
  const [editPath, setEditPath] = useState(false)
  const [editPriority, setEditPriority] = useState(false)
  const [path, setPath] = useState(module.path)
  const [priority, setPriority] = useState(module.priority)
  let { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm();

    const handleCallback = (childData) =>{
      if(childData){
        props.parentCallback(childData);
      }
    }

    const handleDelete = (idSubmodule) =>{
      setIdSubmoduleToDelete(idSubmodule)
      setShowModalDeleteSubmodule(true)
    }

  const onCancel = () => {
    setEditPath(!editPath)
    setEditPriority(!editPriority)
    setPath(path)
    setPriority(priority)
  }

  const onSubmit = async (event) => {

    let data = {
      priority: priority,
      path: path
    }

    await saveData(data)
  }

  const cleanData = () => {
    reset({ path: "", priority: "" });
  }

  const changeVisibilitySubmodule = async (idSubmodule, newVisibility)=>{
    const response = await new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API_URL}submodule_access/${idSubmodule}`, {newVisibility}, { withCredentials: true })
        .then(response => {
          resolve(response);
        }).catch(error => {
          if (error.response.status === 401) {
            resolve(error.response.status)
          }

          resolve(error);
        })
    });
    props.reloadData()
  }

  const changeVisibilityModule = async (idModule, newVisibility)=>{
    const response = await new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API_URL}module_access/${idModule}`, {newVisibility}, { withCredentials: true })
        .then(response => {
          resolve(response);
        }).catch(error => {
          if (error.response.status === 401) {
            resolve(error.response.status)
          }

          resolve(error);
        })
    });
    props.reloadData()
  }

  const saveData = async (data) => {
    
    let expresion = /^\/[a-z_-]+/ig;
    let expresionNumber = /^[^0\-\+\*\!\"\#\$\%\&\(\)\/]\d+$/
    if (data && data !== undefined && data.path.match(expresion) && data.priority.match(expresionNumber)){
      const saveData = await new Promise((resolve, reject) => {
        axios.put(`${process.env.REACT_APP_API_URL}editpath/${module.idModule}`, data, { withCredentials: true })
          .then(response => {
            resolve(response);
          }).catch(error => {
            if (error.response.status === 401) {
              resolve(error.response.status)
            }
  
            resolve(error);
          })
      });
  
      if (saveData.status === 200) {
        props.parentCallback({ state: true, status: saveData.status, message: 'save' })
  
      }
    } else {
      props.parentCallback({ state: true, status: 200, message: 'errorPath' })
    }
    
  }

 

    return(
        <div className='flex flex-col mt-[5px] mx-[24px] m:mx-0 m:mr-[15px] w-[327px] bg-white/[15%] rounded-[16px] mb-[12px] leading-[19px] tracking-[-3%]'>
              <div className='flex justify-between ml-[24px] mt-[16px]  mb-[10px]'>
                <div className='self-center  font-bold text-[#FAFAFA] text-[14px]'>{module.nameModule}</div>

        <div className="flex mr-[24px] "> {/**echar ojo a esto */}
          <div className="flex mr-[8px] mt-[2px]">
            {props.roleUser==='SUPERADMINISTRADOR' &&
                <>
                {module.active? <RiEyeLine className="text-white h-[20px] w-[20px] cursor-pointer" onClick={()=>{changeVisibilityModule(module.idModule, false)}} />:<RiEyeOffLine className="h-[20px] w-[20px] text-white/50 cursor-pointer" onClick={()=>{changeVisibilityModule(module.idModule, true)}}/>}
                </>
              }
                   
          </div>
          {checkSubmodule(props.submodules, 'Editar Módulo') && <div onClick={() => setShowModal(true)} className='flex cursor-pointer mr-[8px]'>
            <IoMdAddCircle className="text-[#FFFFFF] w-[24px] h-[24px]" />
          </div>}
          <ModalAddSubmodule show={showModal} onClose={() => setShowModal(false)} parentCallback={handleCallback} ide={module.idModule} nameModule={module.nameModule} currentSubmodules={module.submodules} />
          {checkSubmodule(props.submodules, 'Eliminar Módulo') &&
            <div>
              <div onClick={() => setShowModalDeleteModule(true)} className='flex cursor-pointer'>
                <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                  <BsTrashFill className=' h-[16px] w-[16px] ml-[4px] mt-[4px] text-[#FFFFFF]' />
                </div>
              </div>
              <ModalDeleteModule show={showModalDeleteModule} onClose={() => setShowModalDeleteModule(false)} parentCallback={handleCallback} ide={module.idModule} />
            </div>}
        </div>

      </div>
      <form onSubmit={handleSubmit(onSubmit)} id="editPathPriority">
        <div className="h-[35px]">
          {!editPath &&
            <>
              <div className="flex justify-between text-[11px] ml-[24px] mb-[3px]">
                <div className='text-[#FAFAFA]'>Ruta:</div>
                <div className='flex justify-items-end text-[#FAFAFA] ml-[130px]'>{module.path}</div>
                <button
                  className="text-[12px] mb-[5px] mr-[25px] font-semibold flex cursor-pointer w-[32px] h-[12px] text-[#EA683F] self-end"
                  onClick={() => { setEditPath(true) }}>Editar</button>
              </div>
            </>

          }

          {editPath &&
            <>
              <div className="flex justify-between text-[11px] ml-[24px]">
                <div className='text-[#FAFAFA]'>Ruta:</div>
                <input
                  {...register("edit_path")}
                  name="path"
                  className="w-[100px] h-[17px] bg-transparent text-right pr-[4px] text-[#FAFAFA] text-[11px] focus:outline-none ml-[104px] mt-[5px]"
                  value={path} onChange={e => setPath(e.target.value)} />

                <button
                  type="submit"
                  className="text-[12px] mb-[5px] mr-[40px] font-semibold flex cursor-pointer w-[32px] h-[12px] text-[#EA683F] self-end"
                  onClick={() => { setEditPath(false), onSubmit() }}
                >Guardar</button>
              </div>
            </>

          }


          {!editPriority &&
            <div className="flex justify-between text-[11px] ml-[24px]" >
              <div className='text-[#FAFAFA]'>Prioridad:</div>
              <div className='flex justify-items-end text-[#FAFAFA] ml-[130px]'>{module.priority}</div>

              <button
                className="text-[12px] mb-[5px] mr-[25px] font-semibold flex cursor-pointer w-[32px] h-[12px] text-[#EA683F] self-end"
                onClick={() => { setEditPriority(true) }}>Editar</button>
            </div>

          }

          {editPriority &&
            <div className="flex justify-between text-[11px] ml-[24px]" >
              <div className='text-[#FAFAFA]'>Prioridad:</div>

              <input
                className="w-[100px] h-[12px] bg-transparent text-right pr-[4px] text-[#FAFAFA] text-[11px] focus:outline-none ml-[81px] mt-[5px]"
                name="priority"
                type=''
                value={priority} onChange={e => setPriority(e.target.value)} />

              <button
                type="submit"
                className="text-[12px] mb-[5px] mr-[50px] font-semibold flex cursor-pointer w-[32px] h-[12px] text-[#EA683F] self-end"
                onClick={() => { setEditPriority(false), onSubmit() }}>Guardar</button>
            </div>
          }
        </div>
      </form >

            
              
            <hr className='bg-white/[0.10] border-none h-[8px] mt-[8px]' />
            <div className='mt-[10px] mb-[24px] ml-[24px] mr-[24px] '>
              {module.submodules.map((submodule, key)=>
                <div className="flex justify-between my-[8px]">
                  

                  <div className="text-[14px] leading-[12px] text-[#FAFAFA] self-center">{submodule.nameSubmodule}</div>
    

                    <div className='flex cursor-pointer'>
                    <div className="flex mr-[16px] mt-[4px]">
                      {props.roleUser==='SUPERADMINISTRADOR' &&
                          <>
                          {submodule.active? <RiEyeLine className="text-white h-[20px] w-[20px]" onClick={()=>{changeVisibilitySubmodule(submodule.id, false)}} />:<RiEyeOffLine className="h-[20px] w-[20px] text-white/50" onClick={()=>{changeVisibilitySubmodule(submodule.id, true)}}/>}
                          </>
                      }
                   
                  </div>
                  {checkSubmodule(props.submodules,'Eliminar Submódulo')&&
                      <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'  onClick={()=>handleDelete(submodule.id)}>
                          <BsTrashFill className=' h-[16px] w-[16px] ml-[4px] mt-[4px] text-[#FAFAFA]' />
                      </div>
                      }
                  </div>

                </div>
              )

              }
              <ModalDeleteSubmodule show={showModalDeleteSubmodule} onClose={()=>setShowModalDeleteSubmodule(false)} parentCallback = {handleCallback} ide={idSubmoduleToDelete}/>


              </div> 
            
           
        </div>
   );

}

export default CardModule;