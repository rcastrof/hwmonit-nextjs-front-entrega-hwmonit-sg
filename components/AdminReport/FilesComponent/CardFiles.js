import { useRef, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import { checkSubmodule } from '../../Permission/CheckSubmodules'
import useDidMountEffect from '../useDidMountEffect'
import AddFiles from './AddFiles'
import ModalCreateNewFile from './FileModals/ModalCreateNewFile'

const CardFiles = ({ files, setFiles, version, setVersion, sendNewVersion, submodules }) => {

    const [showModalFiles, setShowModalFiles] = useState(false)

    const isRepeat = (name) => {
        const repeat = files.some(el => el.name === name);
        if (repeat) return true
        return false
    }

    const addNewFile = (name, path, file) => {
        const iterid = files.length === 0 ? 1 : files[files.length - 1].id + 1
        setFiles([...files, { id: iterid, name: name, path: path, data: file }])

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.1.0
        let versionArray = version.version.split(".")
        versionArray[1] = (parseInt(versionArray[1]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const editFile = (id, name, path, data) => {
        setFiles(files.map(p => p.id === id ? { ...p, name: name, path: path } : p))

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const deleteFile = (id) => {
        const Data = files.filter((file) => file.id !== id)
        setFiles(Data)

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const previousValues = useRef({ files, version })

    //Solo se ejecutara cuando files y version cambien
    useDidMountEffect(() => {
        if (previousValues.current.files !== files && previousValues.current.version !== version) {
            sendNewVersion()
            previousValues.current = { files, version }
        }
    }, [files, version])

    return (
        <div className="flex flex-wrap flex-col space-y-2">
            {checkSubmodule(submodules, "Crear Archivo") &&
            <div>
                <button onClick={() => setShowModalFiles(true)}
                    className="flex flex-row items-center justify-center 
                            w-[220px] h-[40px] bg-[#EA683F] 
                            rounded-[10px] text-[16px] text-white">
                    <RiAddLine />
                    <p className="pl-[10px]">
                        Cargar nuevo archivo
                    </p>
                </button>
                <ModalCreateNewFile show={showModalFiles} onClose={() => setShowModalFiles(false)} addNewFile={addNewFile} isRepeat={isRepeat} />
            </div>}
            <div className="flex flex-wrap max-h-[500px] overflow-y-auto overflow-x-auto gt-scroll">
                {files?.map(({ id, name, path, data }, index) => {
                    return <AddFiles key={id} name={name} id={id} path={path} data={data} deleteFile={deleteFile} editFile={editFile} submodules={submodules} />
                })}
            </div>
        </div>
    )
}

export default CardFiles