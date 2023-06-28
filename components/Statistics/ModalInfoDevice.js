import React from 'react'
import { Fragment, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { RiCloseFill } from 'react-icons/ri'
import { GoAlert } from 'react-icons/go'

const dataTotems = [
    { name: "PC seba", active: true },
    { name: "PC asdas", active: false }
]

const dataScreen = [
    { name: "NOTEBOOK acer", active: true }

]


export default function ModalInfoDevice(props) {

    const { show, onClose } = props;
    const cancelButtonRef = useRef(null);


    const closeModal = () => {
        onClose();
    }


    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-autogrcontactId" initialFocus={cancelButtonRef} onClose={() => closeModal()} >
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
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                        <div className="inline-block w-[327px] h-[400px] align-bottom bg-[#FFFFFF] text-left  shadow-xl transform transition-all my-[6rem] m:my-[15rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer" onClick={() => closeModal()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]/60' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="ml-[0.5rem]">
                                        <Dialog.Title as="h3" className="text-[22px] font-bold leading-[42px] text-hw-black tracking-[-3%] whitespace-nowrap mb-[8px]">
                                            Información de dispositivos
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-[#FAFAFA] border-none h-[8px] mb-[16px]' />


                            <div className="h-[230px] ml-[1rem] overflow-y-auto gt-scroll">
                                <div className='font-bold leading-[19.07px] tracking-[-5%] text-[14px] mb-[8px]'>Tótems</div>
                                <div className='flex flex-wrap'>
                                  {dataTotems && dataTotems.length >0 && dataTotems.map((totem) => {
                                      return (<div className='flex w-[279px] h-[68px] bg-[#F5F5F5] rounded-[15px] mb-[8px]'>
                                          <div className='ml-[16px] mt-[8px] w-[176px] h-[44px] font-[600] text-[16px] tracking-[-3%] text-black'>  {totem.name} </div>
                                          <div className={`flex w-[63px] h-[32px]  ${totem.active ? 'bg-[#34C759]' : 'bg-[#D62C2C]'} self-center rounded-[16px]`}> 
                                            <div className='self-center ml-[auto] mr-[auto] text-[12px] font-bold text-white opacity-90 tracking-[-2%]'>{totem.active ? 'Online': 'Offline'}</div>
                                           </div>
                                       
                                      </div>
  )
                                  })}  

                                </div>

                                <div className='font-bold leading-[19.07px] tracking-[-5%] text-[14px] mb-[8px]'>Screens</div>
                                <div className='flex flex-wrap'>
                                  {dataScreen && dataScreen.length >0 && dataScreen.map((screen) => {
                                      return (
                                        <div className='flex w-[279px] h-[68px] bg-[#F5F5F5] rounded-[15px] mb-[8px]'>
                                        <div className='ml-[16px] mt-[8px] w-[176px] h-[44px] font-[600] text-[16px] tracking-[-3%] text-black'>  {screen.name} </div>
                                        <div className={`flex w-[63px] h-[32px]  ${screen.active ? 'bg-[#34C759]' : 'bg-[#D62C2C]'} self-center rounded-[16px]`}> 
                                          <div className='self-center ml-[auto] mr-[auto] text-[12px] font-bold text-white opacity-90 tracking-[-2%]'>{screen.active ? 'Online': 'Offline'}</div>
                                         </div>
                                     
                                    </div>
  )
                                  })}  

                                </div>





                            </div>


                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
