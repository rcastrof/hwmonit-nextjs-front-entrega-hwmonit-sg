import { Fragment, useEffect, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { Dialog, Transition } from '@headlessui/react'
import { HiChip } from 'react-icons/hi'
import { FaFan } from 'react-icons/fa'
import CardFan from './CardFan'


const ModalFan = (props) => {
    const { show, onClose, details } = props;
    const cancelButtonRef = useRef(null);
    let i = 0;

    const [lpcio, setLpcio] = useState(details?.fan_lpcio ? details.fan_lpcio : null);


    useEffect(() => {
        if (!details) {
            setLpcio(null)
        }
        if (lpcio?.length === 0) {
            setLpcio(null)
        }
    }, [])


    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => onClose()} >
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
                        <div className="inline-block w-[327px] h-[550px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[1rem] m:my-[3rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer" onClick={() => onClose()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]/60' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <FaFan className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Ventiladores
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px] text-[14px] leading-[18px] tracking-[-2%] ' />

                            <div className="h-[450px] overflow-y-auto gt-scroll">

                                <div className='w-[105px] h-[40px] select-none border-[#EA683F] bg-[#FFFFFF]/20 flex min-w-fit items-center rounded-[10px] ml-[24px] mt-[5px] cursor-pointer chip chip-selected'>
                                    <div className='h-[24px] w-[24px] mx-[8px] bg-hw-button rounded-full ml-3'> {/** button */}
                                        <HiChip className='mt-[2.5px] h-[18px] w-[18px] text-[#FAFAFA] ml-[2px]' />
                                    </div>
                                    <Dialog.Title className="text-[16px] font-bold leading-[18px] pt-[16px] text-[#FAFAFA] tracking-[-2%] whitespace-nowrap mb-[16px]">
                                        LPCIO
                                    </Dialog.Title>

                                </div>
                                <br />
                                <hr className='bg-white/10 border-none h-[8px] mb-[16px] text-[14px] leading-[18px] tracking-[-2%] ' />

                                <div className="h-[280px] overflow-y-auto flex flex-wrap gt-scroll">

                                    {/*Contenido*/}
                                    {lpcio !== null ? (
                                        lpcio.map((detail, index) => {
                                            return <CardFan key={index} detail={detail} />;
                                        })
                                    ) : (
                                        <div className="flex-wrap text-center">
                                            <span className="text-[24px]">🤓 </span>{" "}
                                            <span className="text-[16px] font-semibold text-[#FAFAFA]">
                                                {" "}
                                                No es posible monitorear esta información ...{" "}
                                            </span>
                                        </div>
                                    )}
                                </div>

                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalFan