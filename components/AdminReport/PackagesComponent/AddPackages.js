import { useState } from 'react'
import { BsTrashFill } from 'react-icons/bs';
import { checkSubmodule } from '../../Permission/CheckSubmodules';
import ModalDeletePackage from './PackageModals/ModalDeletePackage';
import ModalEditPackage from './PackageModals/ModalEditPackage';

const AddPackages = ({ id, name, version, deletePackage, editPackage, submodules }) => {

    const [showModalDeletePackage, setShowModalDeletePackage] = useState(false)
    const [showModalEditPackage, setShowModalEditPackage] = useState(false)

    return (
        <div className="flex flex-col p-[15px] mr-[10px] mt-[10px] w-[300px] h-[220px] rounded-[10px] bg-white/[0.15]">
            <div className="flex flex-row space-y-2">
                <div className="flex-col w-[230px]">
                    <div>
                        <p className='text-white/60 ml-[12px] mt-[10px] text-[18px] font-medium'>
                            Nombre:
                        </p>
                        <p className='text-white ml-[12px] mt-[10px] font-bold'>
                            {name}
                        </p>
                    </div>
                    <div>
                        <p className='text-white/60 ml-[12px] mt-[10px] text-[18px] font-medium'>
                            Version:
                        </p>
                        <p className='text-white ml-[12px] mt-[10px] font-bold'>
                            v{version}
                        </p>
                    </div>
                </div>
                {checkSubmodule(submodules, "Eliminar Paquete") &&
                    <button onClick={() => setShowModalDeletePackage(true)} className="flex pl-[7px] items-center content-center rounded-full h-[35px] w-[35px] bg-[#EA683F]">
                        <BsTrashFill className='h-[20px] w-[20px] text-[#FFFFFF]' />
                    </button>}
                    <ModalDeletePackage show={showModalDeletePackage} onClose={() => setShowModalDeletePackage(false)} deletePackage={deletePackage} id={id} />
                
            </div>
            {checkSubmodule(submodules, "Editar Paquete") &&
                <div className="flex flex-row justify-end mt-[20px]">
                    <button onClick={() => setShowModalEditPackage(true)} className='text-white font-bold ml-[15px] mr-[5px]'>
                        Editar
                    </button>
                    <ModalEditPackage show={showModalEditPackage} onClose={() => setShowModalEditPackage(false)} editPackage={editPackage} name={name} version={version} id={id} />
                </div>
            }
        </div>
    )
}

export default AddPackages