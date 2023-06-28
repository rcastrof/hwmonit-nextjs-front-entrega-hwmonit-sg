import { useRef, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import { checkSubmodule } from '../../Permission/CheckSubmodules'
import useDidMountEffect from '../useDidMountEffect'
import ModalCreateNewHeader from './HeaderModals/ModalCreateNewHeader'
import ModalDeleteHeader from './HeaderModals/ModalDeleteHeader'
import ModalEditHeader from './HeaderModals/ModalEditHeader'

const NewHeader = ({ name, header, id, deleteHeader, editHeader, submodules }) => {

    const [showModalDeleteHeader, setShowModalDeleteHeader] = useState(false)
    const [showModalEditHeader, setShowModalEditHeader] = useState(false)

    return (
        <div>
            <div>
                <p className="text-white/60 ml-[12px] mt-[10px] text-[18px] font-medium">
                    {name}:
                </p>
                <p className="text-white ml-[12px] mt-[4px] font-bold">
                    {header}
                </p>
            </div>
            <div className="flex flex-row justify-end mt-[10px]">
                {checkSubmodule(submodules, "Eliminar Header") &&
                <button onClick={() => setShowModalDeleteHeader(true)} className="text-white font-bold mr-[4px]">
                    Eliminar
                </button>}
                <ModalDeleteHeader show={showModalDeleteHeader} onClose={() => setShowModalDeleteHeader(false)} deleteHeader={deleteHeader} id={id} />
                {checkSubmodule(submodules, "Editar Header") &&
                <button onClick={() => setShowModalEditHeader(true)} className="text-white font-bold ml-[4px] mr-[8px]">
                    Editar
                </button>}
                <ModalEditHeader show={showModalEditHeader} onClose={() => setShowModalEditHeader(false)} editHeader={editHeader} name={name} header={header} id={id} />
            </div>
        </div>
    )
}

const SettingHeaderCard = ({ settingHeader, setSettingHeader, version, setVersion, sendNewVersion, submodules }) => {

    const [showModalHeader, setShowModalHeader] = useState(false)

    const isRepeat = (name) => {
        const repeat = settingHeader.some(el => el.key === name);
        if (repeat) return true
        return false
    }

    const addNewHeader = (key, value) => {
        const iterid = settingHeader.length === 0 ? 1 : settingHeader[settingHeader.length - 1].id + 1
        setSettingHeader([...settingHeader, { id: iterid, key: key, value: value }])

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.1.0
        let versionArray = version.version.split(".")
        versionArray[1] = (parseInt(versionArray[1]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const editHeader = (id, key, value) => {
        setSettingHeader(settingHeader.map(p => p.id === id ? { ...p, key: key, value: value } : p))

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const deleteHeader = (id) => {
        const Data = settingHeader.filter((dato) => dato.id !== id)
        setSettingHeader(Data)

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const previousValues = useRef({ settingHeader, version })

    //Solo se ejecutara cuando settingHeader y version cambien
    useDidMountEffect(() => {
        if (previousValues.current.settingHeader !== settingHeader && previousValues.current.version !== version) {
            sendNewVersion()
            previousValues.current = { settingHeader, version }
        }
    }, [settingHeader, version])

    return (
        <div className="mt-[10px]">
            <p className="text-white font-bold text-[20px] ml-9 mt-[20px] mb-[20px]">Headers</p>
            <div className="flex flex-col p-[15px] mt-[10px] w-[300px] max-h-[340px] rounded-[10px] bg-white/[0.15]">
                {checkSubmodule(submodules, "Crear Header") &&
                <button onClick={() => setShowModalHeader(true)} className='flex flex-row items-center content-center border-white/30 border-2 p-[5px] rounded-[10px] w-[230px] mb-[20px]'>
                    <RiAddLine className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                            w-[20px] h-[20px] 
                            rounded-[10px] text-[16px] text-white
                            bg-white/[0.15]
                            "/>
                    <p className="text-white">
                        Añadir nueva variable
                    </p>
                </button>}
                <ModalCreateNewHeader show={showModalHeader} onClose={() => setShowModalHeader(false)} addNewHeader={addNewHeader} isRepeat={isRepeat} />
                <div className='max-h-[340px] overflow-y-auto gt-scroll'>
                    {settingHeader?.map(({ id, key, value }, index) => {
                        return <NewHeader key={id} name={key} header={value} id={id} deleteHeader={deleteHeader} editHeader={editHeader} submodules={submodules} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default SettingHeaderCard