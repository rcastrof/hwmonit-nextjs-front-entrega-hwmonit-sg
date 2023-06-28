import { useState } from 'react'
import { BiDownload } from 'react-icons/bi'
import { BsTrashFill } from 'react-icons/bs'
import { checkSubmodule } from '../../Permission/CheckSubmodules'
import ModalDeleteFile from './FileModals/ModalDeleteFile'
import ModalEditFile from './FileModals/ModalEditFile'

const AddFiles = ({ id, name, path, data, deleteFile, editFile, submodules }) => {

    const [showModalDeleteFile, setShowModalDeleteFile] = useState(false)
    const [showModalEditFile, setShowModalEditFile] = useState(false)

    let objectURL
    if (objectURL) {
        URL.revokeObjectURL(objectURL)
    }

    objectURL = URL.createObjectURL(data);

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
                            Ruta:
                        </p>
                        <p className='text-white ml-[12px] mt-[10px] font-bold'>
                            {path}
                        </p>
                    </div>
                </div>
                {checkSubmodule(submodules, "Eliminar Archivo") &&
                    <>
                        <button onClick={() => setShowModalDeleteFile(true)} className="flex pl-[7px] items-center content-center rounded-full h-[35px] w-[35px] bg-[#EA683F]">
                            <BsTrashFill className='h-[20px] w-[20px] text-[#FFFFFF]' />
                        </button>
                        <ModalDeleteFile show={showModalDeleteFile} onClose={() => setShowModalDeleteFile(false)} deleteFile={deleteFile} id={id} />
                    </>}
            </div>
            <div className="flex flex-row mt-[20px]">
                {checkSubmodule(submodules, "Descargar Archivo") &&
                <button className='flex flex-row items-center content-center border-white/30 border-2 p-[5px] rounded-[10px] w-[210px]'>
                    <BiDownload className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                            w-[25px] h-[25px] 
                            rounded-[10px] text-[16px] text-white"/>
                    <a className="text-white font-bold" href={objectURL} download={name}>
                        Descargar Archivo
                    </a>
                </button>}
                {checkSubmodule(submodules, "Editar Archivo") &&
                    <>
                        <button onClick={() => setShowModalEditFile(true)} className='text-white font-bold ml-[15px] mr-[5px]'>
                            Editar
                        </button>
                        <ModalEditFile show={showModalEditFile} onClose={() => setShowModalEditFile(false)} editFile={editFile} name={name} data={data} path={path} id={id} />
                    </>}
            </div>
        </div>
    )
}

export default AddFiles