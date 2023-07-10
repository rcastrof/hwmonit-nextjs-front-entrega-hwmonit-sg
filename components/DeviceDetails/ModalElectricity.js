import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { Dialog, Transition } from '@headlessui/react'
import { FaBolt } from 'react-icons/fa';
import { Bars } from 'react-loader-spinner';



const ModalElectricity = (props) => {

    const { show, onClose, voltage, current, power, isLoadingElectricity } = props;
    const cancelButtonRef = useRef(null);

    return (

        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrid" initialFocus={cancelButtonRef} onClose={() => onClose()} >
                <div className="flex items-end justify-center min-h-screen  px-4 pb-20 text-center content-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black/30  backdrop-blur-sm transition-opacity" />
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
                        <div className="inline-block w-[327px] h-[312px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[10rem] xl:my-[15rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() => onClose()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <FaBolt className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Información Electricidad
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />
                            {isLoadingElectricity ?
                                (<div className='flex justify-center mt-[24px]'>
                                    <Bars color="#FAFAFA" height={80} width={80} />
                                </div>) :

                                (<div className="h-[360px]">

                                    {/*Contenido*/}
                                    <div className="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                        <div className="flex-auto text-white/90 ">Voltaje</div>

                                        <div className="justify-end text-white font-bold">{voltage.state} {voltage.attributes.unit_of_measurement}</div>

                                    </div>
                                    <div className="bg-white/20 h-[2px] mx-[24px] mb-[16px]"></div>

                                    <div className="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                        <div className="flex-auto text-white/90  ">Corriente</div>
                                        <div className="justify-end text-white font-bold">{current.state} {current.attributes.unit_of_measurement}</div>
                                    </div>
                                    <div className="bg-white/20  h-[2px] mx-[24px] mb-[16px]"></div>

                                    <div className="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                        <div className="flex-auto text-white/90  ">Power</div>
                                        <div className="justify-end text-white font-bold">{power.state} {power.attributes.unit_of_measurement}</div>
                                    </div>

                                </div>
                                )}

                        </div>
                    </Transition.Child>
                </div>
            </Dialog >
        </Transition.Root >

    )
}

export default ModalElectricity;