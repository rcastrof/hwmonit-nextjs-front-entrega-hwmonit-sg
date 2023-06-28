import { Fragment, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { Dialog, Transition} from '@headlessui/react'
import { BsPrinterFill } from 'react-icons/bs'

const ModalPrinter = ( props ) =>  {

    const { show, onClose, details} = props;
    const cancelButtonRef = useRef(null);
    const description = [
        {"error": "PRINTER_STATUS_ERROR",
         "desc": "The printer is in an error state."},
        {"error": "PRINTER_STATUS_DOOR_OPEN",
         "desc": "The printer door is open."},
        {"error": "PRINTER_STATUS_PAPER_OUT",
         "desc": "The printer is out of paper."},
         {"error": "PRINTER_STATUS_PAPER_JAM",
          "desc": "	Paper is jammed in the printer"},
          {"error": "PRINTER_STATUS_PAPER_PROBLEM",
           "desc": "The printer has a paper problem."},
           {"error": "PRINTER_STATUS_OFFLINE",
            "desc": "The printer is offline."},
            {"error": "PRINTER_STATUS_NOT_AVAILABLE",
             "desc": "The printer is not available for printing."},
             {"error": "PRINTER_STATUS_NO_TONER",
              "desc": "The printer is out of toner."},
              {"error": "PRINTER_STATUS_TONER_LOW",
               "desc": "The printer is low on toner."},
               {"error": "PRINTER_STATUS_USER_INTERVENTION",
                "desc": "	The printer has an error that requires the user to do something."},
                {"error": "PRINTER_STATUS_PAUSED",
                 "desc": "The printer is paused."}
      ]
     
      const getDescription = (error) => {
        const desc = description.find((desc)=>{return desc.error === error})
        if(desc !== undefined){
            return desc.desc
        }else{
            return "Sin descripción"
        }
      }
    
    
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
                        <div className="inline-block w-[345px] h-[600px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[1rem] xl:my-[10rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() => onClose()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]/60' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <BsPrinterFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                        Información de impresora
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px] text-[14px] leading-[18px] tracking-[-2%] ' />
                                <div className='mb-4'>

                                    <div className= 'select-none  bg-white/[0.15]  flex max-w-fit items-center rounded-[30px] ml-[24px] mr-[16px] mb-[8px]'>
                                        <div className='mr-[3px] ml-[16px] font-semibold text-white/90 py-[12px]'>Impresora: </div>
                                        <div className='text-white font-semibold mr-[16px] text-[15px]'>{details.name!==undefined?details.name:"Sin Identificar"}</div>
                                    </div>
                        
                                </div>

                            <hr className='bg-white/10 border-none h-[8px] mb-[16px]' />

                            <div className="h-[340px] overflow-y-auto flex flex-wrap gt-scroll">

                            {details !== null && details.printer_errors.length === 0 &&
                                        <div className='flex-col flex-wrap ml-[40px]'>
                                            <div className='flex text-[24px]'>😎 <div className='text-[16px] font-semibold text-hw-white self-center ml-[8px]'> Impresora sin problemas ... </div></div> 
                                         </div>
                             }

                                {/*Contenido*/}
                                <div className='flex flex-col leading-[18px] tracking-[-2%] mx-[24px] w-[294px]'>
                                    
                                    {/*Debo agregar estrucutra con el for*/}
                                    {details !== null && details.printer_errors.length > 0 &&
                                    details.printer_errors.map((error) => {return(
                                        <div className='bg-white/[0.15] mb-[8px] pl-[16px]  rounded-[15px]'>
                                            <div className='text-white text-[16px] font-bold mt-[16px] mb-[12px]'>Error</div>
                                            <div className='font-semibold text-[14px] text-hw-white/80'>{error}</div>
                                            <div className='text-white text-[16px] font-bold mt-[16px] mb-[12px]'>Descripción</div>
                                            <div className='font-semibold text-[14px] text-hw-white/80 pb-[20px]'>{
                                                getDescription(error)
                                        
                                            }</div>
                                        </div>
                                    )})
                                    
                                    }

                                  

                                </div>
                              

                            </div>

                          
                            

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default ModalPrinter;