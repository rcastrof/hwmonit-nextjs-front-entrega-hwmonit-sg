import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill, RiComputerFill } from 'react-icons/ri'
import { Dialog, Transition} from '@headlessui/react'


const ModalScreen = ( props ) =>  {

    const { show, onClose, details} = props;
    const [monitorState, setMonitorState] = useState("No definido");
    const [displayState, setDisplayState] = useState("No definido");
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        if(props.details !== undefined && props.details.settings !== undefined){
            props.details.settings.map((setting) => {
                if(setting.monitor_power_on !== undefined){
                    setMonitorState(setting.monitor_power_on);
                }
                if(setting.console_display_state !== undefined){
                    setDisplayState(setting.console_display_state);
                }
            });
        }
    }, [props.details])
    
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
                                            <RiComputerFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                        Información pantalla
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />

                            <div className="h-[360px]">

                                {/*Contenido*/}
                                <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                    <div className="flex-auto text-white/90 ">Monitor Power</div>
                                    <div className="justify-end text-white font-bold">{monitorState}</div>
                                </div>
                                <div className="bg-white/20 h-[2px] mx-[24px] mb-[16px]"></div>

                                <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                    <div className="flex-auto text-white/90  ">Console Display State</div>
                                    <div className="justify-end text-white font-bold">{displayState}</div>
                                </div>
                                <div className="bg-white/20  h-[2px] mx-[24px] mb-[16px]"></div>

                                <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[24px]">
                                    <div className="flex-auto text-white/90  ">Resolución</div>
                                    <div className="justify-end text-white font-bold">{
                                   
                                        (details.monitors !== undefined && details.monitors[0].width !== undefined && details.monitors[0].height !== undefined)?
                                        `${details.monitors[0].width} x ${details.monitors[0].height}`
                                        : "No definido"
                                    }</div>
                                </div>
                       
                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalScreen;