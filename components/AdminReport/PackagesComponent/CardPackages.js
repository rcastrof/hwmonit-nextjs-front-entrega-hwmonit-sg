import { useRef, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import { checkSubmodule } from '../../Permission/CheckSubmodules'
import useDidMountEffect from '../useDidMountEffect'
import AddPackages from './AddPackages'
import ModalCreateNewPackage from './PackageModals/ModalCreateNewPackage'

const CardPackages = ({ packages, setPackages, version, setVersion, sendNewVersion, submodules }) => {

    const [showModalPackages, setShowModalPackages] = useState(false)

    const isRepeat = (name) => {
        const repeat = packages.some(el => el.package_name === name);
        if (repeat) return true
        return false
    }

    const addNewPackage = (key, value) => {
        const iterid = packages.length === 0 ? 1 : packages[packages.length - 1].id + 1
        setPackages([...packages, { id: iterid, package_name: key, package_version: value }])

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.1.0
        let versionArray = version.version.split(".")
        versionArray[1] = (parseInt(versionArray[1]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const editPackage = (id, name, packageVersion) => {
        setPackages(packages.map(p => p.id === id ? { ...p, package_name: name, package_version: packageVersion } : p))

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const deletePackage = (id) => {
        const Data = packages.filter((dato) => dato.id !== id)
        setPackages(Data)

        // Aumenta La version en 1 Ejemplo: 1.0.0 -> 1.0.1
        let versionArray = version.version.split(".")
        versionArray[2] = (parseInt(versionArray[2]) + 1).toString()
        setVersion({ version: versionArray.join(".") })
    }

    const previousValues = useRef({ packages, version })

    //Solo se ejecutara cuando package y version cambien
    useDidMountEffect(() => {
        if (previousValues.current.packages !== packages && previousValues.current.version !== version) {
            sendNewVersion()
            previousValues.current = { packages, version }
        }
    }, [packages, version])

    return (
        <div className="flex flex-wrap flex-col space-y-2">
            {checkSubmodule(submodules, "Crear Paquete") &&
                <div>
                    <button onClick={() => setShowModalPackages(true)}
                        className="flex flex-row items-center justify-center 
                                w-[220px] h-[40px] bg-[#EA683F] 
                                rounded-[10px] text-[16px] text-white">
                        <RiAddLine />
                        <p className="pl-[10px]">
                            Añadir paquete
                        </p>
                    </button>
                    <ModalCreateNewPackage show={showModalPackages} onClose={() => setShowModalPackages(false)} addNewPackage={addNewPackage} isRepeat={isRepeat} />
                </div>}
            <div className="flex flex-wrap max-h-[500px] overflow-y-auto overflow-x-auto gt-scroll">
                {packages.map(({ id, package_name, package_version }, index) => {
                    return <AddPackages key={id} name={package_name} version={package_version} id={id} deletePackage={deletePackage} editPackage={editPackage} submodules={submodules} />
                })}
            </div>
        </div >
    )
}

export default CardPackages