import { useState, useEffect } from 'react'
import { BiDownload } from 'react-icons/bi'
import { checkSubmodule } from '../../Permission/CheckSubmodules'
import SettingHeaderCard from './SettingHeaderCard'
import SettingPropertyCard from './SettingPropertyCard'

const SettingCard = ({ settingProperty, setSettingProperty, settingHeader, setSettingHeader, version, setVersion, sendNewVersion, submodules }) => {

  const [url, setUrl] = useState()

  const downloadSettings = () => {
    const data = [{config: [...settingProperty]}, {headers: [...settingHeader]}]
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    setUrl(URL.createObjectURL(blob))
  }

  useEffect(() => {
    downloadSettings()
  }, [settingHeader, settingProperty])

  return (
    <div className="flex flex-wrap flex-col">
      <div className="flex flex-wrap content-start items-center">
        <SettingPropertyCard settingProperty={settingProperty} setSettingProperty={setSettingProperty} version={version} setVersion={setVersion} sendNewVersion={sendNewVersion} submodules={submodules}/>
        <div className="p-[10px]"></div>
        <SettingHeaderCard settingHeader={settingHeader} setSettingHeader={setSettingHeader} version={version} setVersion={setVersion} sendNewVersion={sendNewVersion} submodules={submodules}/>
      </div>
      {checkSubmodule(submodules, "Descargar Configuración") &&
      <div className='pt-[10px]'>
        <a href={url} download={"config.json"} className='flex flex-row items-center content-center bg-[#EA683F] border-2 p-[5px] rounded-[10px] w-[210px]'>
          <BiDownload className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                            w-[25px] h-[25px] 
                            rounded-[10px] text-[16px] text-white"/>
          <p className="text-white font-bold">
            Descargar
          </p>
        </a>
      </div>}
    </div>
  )
}

export default SettingCard