import { Fragment, useRef, useState } from 'react'
import { RiCloseFill, RiAddLine } from 'react-icons/ri'
import { BsCheck } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { Menu } from '@headlessui/react'
import { FaChevronDown } from 'react-icons/fa'

const ModalCreateNewVersion = (props) => {

    const { show, onClose, setOperatingSystem, operatingSystem, selectOperatingSystem, setSelectOperatingSystem, createNewVersion } = props;
    const cancelButtonRef = useRef(null);

    const [saveForm, setSaveForm] = useState(true)

    const onSubmit = async (event) => {
        setSelectOperatingSystem({ operating_system: operatingSystem, new_version: true })
        onClose()
    };

    const closeModal = () => {
        onClose();
    }

    return (

        <Transition.Root show={show} as={Fragment}>
            
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => closeModal()} >
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

                        <div className="inline-block w-[327px] h-[404px] align-bottom bg-[#D6E1E7]/25 bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[5rem] m:my-[5rem] rounded-[1.875rem]">
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
                                            Crear nueva versión
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/[0.10] border-none h-[8px] mb-[16px]' />



                            {/*Contenido*/}
                            <div id="createModule">
                                <div className="h-[120px]">
                                    <label className='text-[#FAFAFA] text-sm flex flex-col'>
                                        <div className='overflow-auto gt-scroll h-[310px]'>
                                            <div className='mb-[8px] ml-[24px] font-bold leading-[19.07px] tracking-[-5%] text-[14px]'>Selecciona un sistema operativo</div>
                                            <Menu as="div" className="inline-block text-left">
                                                <Menu.Button className="inline-flex w-[279px] border-[2px] border-white/[0.20] rounded-md bg-transparent bg-opacity-20 px-4 py-2 ml-[24px] font-bold text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                    <p className="w-[200px] text-left">{operatingSystem}</p>
                                                    <FaChevronDown className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
                                                </Menu.Button>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="inline-flex w-[279px] rounded-md bg-transparent bg-opacity-20 font-bold text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                        <div className="">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button onClick={() => setOperatingSystem("windows")} className="hover:bg-[#012459d1] inline-flex w-[279px] border-[2px] border-white/[0.20] rounded-md bg-transparent bg-opacity-20 px-4 py-2 ml-[24px] font-bold text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                        Windows
                                                                    </button>)}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button onClick={() => setOperatingSystem("linux")} className="hover:bg-[#012459d1] inline-flex w-[279px] border-[2px] border-white/[0.20] rounded-md bg-transparent bg-opacity-20 px-4 py-2 ml-[24px] font-bold text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                                        Linux
                                                                    </button>)}
                                                            </Menu.Item>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </label>
                                </div>
                                <div className='flex mt-[50px] items-center justify-center'>
                                    <button onClick={() => onSubmit()} className="h-[48px] w-[275px] bg-[#EA683F] rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">
                                        <div className='flex items-center justify-center'>
                                            <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25">
                                                <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />
                                            </div>
                                            <div className='text-white ml-[8px] font-bold'>Guardar</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalCreateNewVersion;