import { useRef, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import { checkSubmodule } from '../../Permission/CheckSubmodules'
import useDidMountEffect from '../useDidMountEffect'
import ModalCreateNewProperty from './PropertyModals/ModalCreateNewProperty'
import ModalDeleteProperty from './PropertyModals/ModalDeleteProperty'
import ModalEditProperty from './PropertyModals/ModalEditProperty'

const NewProperty = ({ name, property, id, deleteProperty, editProperty, submodules}) => {

    const [showModalDeleteProperty, setShowModalDeleteProperty] = useState(false)
    const [showModalEditProperty, setShowModalEditProperty] = useState(false)

    return (
        <div className="pr-[5px]">
            <div>
                <p className="text-white/60 ml-[12px] mt-[10px] text-[18px] font-medium">
                    {name}:
                </p>
                <p className="text-white ml-[12px] mt-[4px] font-bold break-words">
                    {property}
                </p>
            </div>
            <div className="flex flex-row justify-end mt-[10px]">
                {checkSubmodule(submodules, "Eliminar Propiedad") &&
                <button onClick={() => setShowModalDeleteProperty(true)} className="text-white font-bold mr-[4px]">
                    Eliminar
                </button>}
                <ModalDeleteProperty show={showModalDeleteProperty} onClose={() => setShowModalDeleteProperty(false)} deleteProperty={deleteProperty} id={id} />
                {checkSubmodule(submodules, "Editar Propiedad") &&
                <button onClick={() => setShowModalEditProperty(true)} className="text-white font-bold ml-[4px] mr-[8px]">
                    Editar
                </button>}
                <ModalEditProperty show={showModalEditProperty} onClose={() => setShowModalEditProperty(false)} editProperty={editProperty} name={name} property={property} id={id} />
            </div>
        </div>
    )
}

const SettingPropertyCard = ({ settingProperty, setSettingProperty, version, setVersion, sendNewVersion, submodules }) => {

    const [showModalProperty, setShowModalProperty] = useState(false)

    const isRepeat = (name) => {
        const repeat = settingProperty.some(el => el.name === name);
        if (repeat) return true
        return false
    }

    const addNewProperty = (key, value) => {
        const iterid = settingProperty.length === 0 ? 1 : settingProperty[settingProperty.length - 1].id + 1
        setSettingProperty([...settingProperty, { id: iterid, name: key, property: value }])

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.1.0
        let versionArray = version.version.split(".")
        versionArray[1] = (parseInt(versionArray[1]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const editProperty = (id, key, value) => {
        setSettingProperty(settingProperty.map(p => p.id === id ? { ...p, name: key, property: value } : p))

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const deleteProperty = (id) => {
        const Data = settingProperty.filter((dato) => dato.id !== id)
        setSettingProperty(Data)

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const previousValues = useRef({ settingProperty, version })

    //Solo se ejecutara cuando settingProperty y version cambien
    useDidMountEffect(() => {
        if (previousValues.current.settingProperty !== settingProperty && previousValues.current.version !== version) {
            sendNewVersion()
            previousValues.current = { settingProperty, version }
        }
    }, [settingProperty, version])

    return (
        <div className="mt-[10px]">
            <p className="text-white font-bold text-[20px] ml-9 mt-[20px] mb-[20px]">Propiedades</p>

            <div className="flex flex-col p-[15px] mt-[10px] w-[300px] max-h-[340px] rounded-[10px] bg-white/[0.15]" >
                {checkSubmodule(submodules, "Crear Propiedad") &&
                <button onClick={() => setShowModalProperty(true)} className='flex flex-row items-center content-center border-white/30 border-2 p-[5px] rounded-[10px] w-[230px] mb-[20px]'>
                    <RiAddLine className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                            w-[20px] h-[20px] 
                            rounded-[10px] text-[16px] text-white
                            bg-white/[0.15]
                            "/>
                    <p className="text-white">
                        Añadir nueva variable
                    </p>
                </button>}
                <ModalCreateNewProperty show={showModalProperty} onClose={() => setShowModalProperty(false)} addNewProperty={addNewProperty} isRepeat={isRepeat} />
                <div className="max-h-[340px] overflow-y-auto gt-scroll">
                    {settingProperty?.map(({ id, name, property }, index) => {
                        return <NewProperty key={id} name={name} property={property} id={id} deleteProperty={deleteProperty} editProperty={editProperty} submodules={submodules} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default SettingPropertyCard