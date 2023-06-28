import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiAddLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { IoMdCloseCircle } from 'react-icons/io'
import { useForm } from 'react-hook-form'

const ModalCreateNewFile = (props) => {

    const { show, onClose, addNewFile, isRepeat } = props;
    const cancelButtonRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, watch, setError } = useForm();
    const [saveForm, setSaveForm] = useState(true)
    const [fileOpen, setFileOpen] = useState(true)
    const [fileName, setFileName] = useState()

    const PathRegex = new RegExp('(^[^\/]*\/)$|((?:[a-zA-Z0-9]+[\/\/])*([a-zA-Z0-9]+))', 'gi');
    const FileRegex = new RegExp(/([a-zA-Z0-9\s_\\.\-\(\):])+(.pyw)$/i, "gi");

    const onSubmit = async (event) => {

        const fileName = event.file_name
        const fileState = event?.file[0];
        const fileExtension = fileState.name.slice(-4);
        const fileType = ["text/x-python", "text/plain"]

        if(isRepeat(fileName)){
            setError("file", {
                type: "filetype",
                message: "Nombre del archivo repetido"
            })
            return
        }

        if (fileType.includes(fileState.type)) {
            if(fileExtension !== ".pyw"){
                setError("file", {
                    type: "filetype",
                    message: "Solo se admiten archivos .pyw"
                })
                return
            }
        } else {
            setError("file", {
                type: "filetype",
                message: "Solo se admiten archivos .pyw"
            })
            return
        }

        if (fileState.size > 2097152) {
            setError("file", {
                type: "fileSize",
                message: "El archivo pesa mas de 2 MB"
            })
            return
        }


        if (saveForm) {

            setSaveForm(false);
            const file_name = event.file_name;
            const file_path = event.file_path;
            const file = event.file[0];

            addNewFile(file_name, file_path, file)
            reset({ file_name: "", file_path: "", file: "" });
            setSaveForm(true);
            closeModal()
        }
    };

    const deleteFile = () => {
        setFileName();
        reset({ file: "" })
    }

    const closeModal = () => {
        reset({ file_name: "", file_path: "", file: "" });
        clearErrors()
        onClose();
    }

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (value.file === "") {
                setFileOpen(true)
            } else {
                if (value.file.length === 0) {
                    setFileOpen(true)
                } else {
                    setFileOpen(false)
                    const files = Array.prototype.slice.call(value.file)
                    setFileName(files[0].name)
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [watch])

    return (

        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => closeModal()} >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center content-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
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

                        <div className="inline-block w-[327px] h-[554px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[5rem] m:my-[5rem] rounded-[1.875rem]">
                            {/*Header modal */}

                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]/60' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <RiAddLine className="flex flex-row ml-[8px] mr-[8px] items-center justify-center 
                                            w-[25px] h-[25px] text-white self-center"/>
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Cargar nuevo archivo
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/[0.10] border-none h-[8px] mb-[16px]' />



                            {/*Contenido*/}
                            <form onSubmit={handleSubmit(onSubmit)} id="createModule">
                                <div className="h-[290px]">
                                    <label className='text-[#FAFAFA] text-sm flex flex-col'>
                                        <div className='overflow-auto gt-scroll h-[345px]'>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Nombre</div>
                                            <input
                                                {...register("file_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    minLength: { value: 5, message: "* Campo debe tener 5 o mas de longitud" },
                                                    maxLength: { value: 50, message: "* Longitud Máxima de 50 caracteres" },
                                                    pattern: { value: FileRegex, message: "* Extensión no valida, solo .pyw" }
                                                })} name='file_name' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' placeholder='Ingresa un nombre para el archivo' autoFocus/>

                                            {errors.file_name && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.file_name.message}</span>}



                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Ruta</div>
                                            <input
                                                {...register("file_path", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                    maxLength: { value: 50, message: "* Longitud Máxima de 50 caracteres" },
                                                    pattern: { value: PathRegex, message: "* Path no valido, / para ubicar los archivos en la raíz" }
                                                })} name='file_path' type="text"
                                                className="ml-[24px] border-[2px] border-white/[0.20] bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off' placeholder='Ingresa la ruta del archivo' />

                                            {errors.file_path && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.file_path.message}</span>}

                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Cargar archivo</div>
                                            <input
                                                {...register("file", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} name='file' type="file" accept=".pyw" className="appearance-none hidden" id="fileScript" />

                                            {fileOpen ?
                                                <div className='flex flex-col items-center content-center' >
                                                    <label
                                                        id="fileScript"
                                                        htmlFor="fileScript"
                                                        className="hover:border-solid hover:bg-slate-700 cursor-pointer border-[2px] rounded-[9px] text-center p-[10px] border-white/[0.20] border-dashed h-[65px] w-[279px]">
                                                        <p className="text-white font-bold">Formato Permitido .pyw</p>
                                                        <p>Máx 2 Mb</p>
                                                    </label>
                                                </div>
                                                :
                                                <div className="flex flex-col items-start content-start pl-[25px]">
                                                    <div className='flex h-[48px] rounded-[10px] bg-[#FAFAFA] bg-opacity-10 mr-[10px] mb-[8px]'>
                                                        <div className='text-[#FAFAFA] font-bold mr-[10px] my-[10px] text-[14px] self-center ml-[14px]'>{fileName}</div>
                                                        <IoMdCloseCircle onClick={() => deleteFile()} className='self-center font-[#424040] h-[16px] w-[16px] mr-[10px] cursor-pointer'></IoMdCloseCircle>
                                                    </div>
                                                </div>
                                            }


                                            {errors.file && <span className='text-xs text-[#FAFAFA] ml-[24px]'>{errors.file.message}</span>}


                                        </div>

                                    </label>

                                </div>
                                <div className='flex mt-[55px] items-center justify-center'>
                                    <button type="submit" className="h-[48px] w-[275px] bg-[#EA683F] rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                        <div className='flex items-center justify-center'>
                                            <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                            </div>
                                            <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                        </div>
                                    </button>
                                </div>
                            </form>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalCreateNewFile;