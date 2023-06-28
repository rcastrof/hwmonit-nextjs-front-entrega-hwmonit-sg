import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BsArrowRightShort } from 'react-icons/bs'
import { useRouter } from "next/router";

const EditMonitor = (monitorData) => {
  const [edit, setEdit] = useState(false);
  const { component, warning_min, warning_max, alert_min, alert_max, operator, _id: id } = monitorData.monitorData
  const [warningMin, setWarningMin] = useState(warning_min)
  const [warningMax, setWarningMax] = useState(warning_max)
  const [alertMin, setAlertMin] = useState(alert_min)
  const [alertMax, setAlertMax] = useState(alert_max)
  const { push } = useRouter();
  const onCancel = () => {
    setEdit(!edit)
    setWarningMin(warning_min)
    setWarningMax(warning_max)
    setAlertMin(alert_min)
    setAlertMax(alert_max)
  }

  const onSubmit = async (event) => {

    let data = {
      warning_min: warningMin,
      warning_max: warningMax,
      alert_min: alertMin,
      alert_max: alertMax
    }
    
    if(Number(warningMin) > Number(warningMax)){
      return
    }
    if(Number(warningMax) > Number(alertMin)){
      return
    }
    if(Number(alertMin) > Number(alertMax)){
      return 
    }

    await saveData1(data)
  }

  const saveData1 = async (data) => {
    const saveData = await new Promise((resolve, reject) => {
      axios.put(`${process.env.REACT_APP_API_URL}monitorConfig/${id}`, data, { withCredentials: true })
        .then(response => {
          resolve(response);
        }).catch(error => {
          if (error.response.status === 401) {
            push('/')
          }

          resolve(error);
        })
    });
    
    setEdit(!edit);
    if (saveData.status === 200) {
      monitorData.parentCallback({ state: true, status: saveData.status, message: 'save' })

    }
  }


  return (
    <div className="bg-white/[15%] flex-col m:mx-0 m:mr-[5px] mx-[15px] p-[2px] rounded-[16px] m:w-[327px] h-[196px] mb-[19px] leading-[18px] tracking-[-2%]">
      <div className="bg-transparent rounded-[15px] mx-[6px] p-[2px] pl-[4px] flex flex-col">
        <div className="text-[#F25B3D] font-bold text-[16px] leading-[18px] tracking-[-2%] mb-[16px] pt-[16px] pl-[5px]">
          {component}
        </div>

        <div className="flex flew-wrap flex-row justify-around">

          <div className="bg-white/[15%] break-words w-[67px] h-[86px] rounded-[16px] mb-[2px] flex flex-col items-center leading-[18px] justify-center tracking-[-2%] mr-[8px]">
            {edit ? <input className="bg-transparent w-[50px] focus:outline-none text-[14px] text-[#FAFAFA] font-semibold p-2"
              type='' //cambiar 
              value={warningMin}
              onChange={e => setWarningMin(e.target.value)} /> :
              <div className="text-[14px] text-[#FAFAFA] font-semibold p-2">{warning_min}{operator}</div>}

            <div className="text-[12px] text-[#FAFAFA] text-center">Min. Warning</div>
          </div>

          <div className="bg-white/[15%] w-[67px] h-[86px] rounded-[16px] mb-[2px] flex flex-col items-center leading-[18px] justify-center tracking-[-2%] mr-[8px]">
            {edit ? <input className="bg-transparent w-[50px] focus:outline-none text-[14px] text-[#FAFAFA] font-semibold p-2"
              type='' 
              value={warningMax}
              onChange={e => setWarningMax(e.target.value)} /> :
              <div className="text-[14px] text-[#FAFAFA] font-semibold p-2">{warning_max}{operator}</div>}

            <div className="text-[12px] text-[#FAFAFA] text-center">Máx. Warning</div>
          </div>

          <div className="bg-white/[15%] w-[67px] h-[86px] rounded-[16px] mb-[2px] flex flex-col items-center leading-[18px] justify-center tracking-[-2%] mr-[8px]">
            {edit ? <input className="bg-transparent w-[50px] focus:outline-none text-[14px] text-[#FAFAFA] font-semibold p-2"
              type=''
              value={alertMin}
              onChange={e => setAlertMin(e.target.value)} /> :
              <div className="text-[14px] text-[#FAFAFA] font-semibold p-2">{alert_min}{operator}</div>}

            <div className="text-[12px] text-[#FAFAFA] text-center">Min. <br />Error</div>
          </div>

          <div className="bg-white/[15%] w-[67px] h-[86px] rounded-[16px] mb-[2px] flex flex-col items-center leading-[18px] justify-center tracking-[-2%] mr-[8px]">
            {edit ? <input className="bg-transparent w-[50px] focus:outline-none text-[14px] text-[#FAFAFA] font-semibold p-2"
              type=''
              value={alertMax}
              onChange={e => setAlertMax(e.target.value)} /> :
              <div className="text-[14px] text-[#FAFAFA] font-semibold p-2">{alert_max}{operator}</div>}

            <div className="text-[12px] text-[#FAFAFA] text-center">Máx. <br />Error</div>
          </div>
        </div>
      </div>

      <div className='flex'>
        <div className="flex-auto ml-[24px] text-black/60 text-[14px] h-[18px] font-semibold mt-[4px] "></div>


        {edit ?
          <div className='flex flex-row mt-[4px] ml-4 '><button className='self-end text-[14px] mt-[15px] flex cursor-pointer w-[39px] h-[18px] mr-10 ' onClick={() => onCancel()} >
            <div className='flex self-center mb-3 ml-2 text-[#FAFAFA]'>Cancelar</div></button>
            <button className='flex self-end text-[14px] mt-[5px] mr-[24px] cursor-pointer w-[97px] h-[32px] rounded-[8px] bg-[#F25B3D]' onClick={onSubmit}>
              <div className='flex self-center ml-[18px] text-[#FAFAFA]'>Guardar</div>
              </button>
          </div> : //flex w-[97px] h-[32px]  cursor-pointer  ml-[24px] mb-[13px] 
          
          <button type='submit' className='text-[14px] font-semibold mt-[15px] flex mr-[24px] cursor-pointer w-[59px] h-[30px] text-[#EA683F] self-end' onClick={() => setEdit(!edit)} >
            Editar <BsArrowRightShort className='flex text-[#EA683F]' size={19} /></button>} 

      </div>
    </div>
  )
}

export default EditMonitor