import { Fragment, useRef, useState, useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { Dialog, Transition } from '@headlessui/react'
import { BsCheck } from 'react-icons/bs';
import { BiSliderAlt } from 'react-icons/bi'
import { useForm } from 'react-hook-form'

const FilterBranchModal = (props) => {
    const { show, onClose, setIsFiltered, getBranchFilter, setBranchFilter, branchFilter, clearArray } = props;
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm();

    const cancelButtonRef = useRef(null)

    const onSubmit = e => {
        setIsFiltered(true)
        clearArray()
        getBranchFilter()
        setBranchFilter('data')
        onClose()
    }

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
                        <div className="inline-block w-[327px] h-[325px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[10rem] xl:my-[295px] rounded-[1.875rem]">
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
                                            <BiSliderAlt className=' h-[20px] w-[20px] ml-[6px] text-hw-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Filtro
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px]' />

                            <form onSubmit={handleSubmit(onSubmit)} id="filterBranch">
                                <div className="h-[10px] w-[299px] rounded-[16px] mr-[8px] leading-[22px] tracking-[-1px]">
                                    {/**input para buscar sucursal */}
                                    <div className="h-[95px]">
                                        <label className='text-hw-white text-sm flex flex-col'>

                                            <div className='mb-[8px] ml-[24px] leading-[19.07px] tracking-[-5%] text-[14px] mt-[18px]'>Buscar sucursal</div>
                                            <input
                                                {...register("branch_name", {
                                                    required: { value: true, message: "* Campo Requerido" },
                                                })} type="text"
                                                className="ml-[24px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                                                autoComplete='off'
                                                onChange={(e) => setBranchFilter(e.target.value)} />

                                            {errors.branch_name && <span className='text-xs text-hw-white ml-[24px]'>{errors.branch_name.message}</span>}

                                        </label>
                                    </div>

                                    <div className='flex mt-[25px] ml-[30px] '>

                                        {branchFilter === 'data' || branchFilter === '' ?

                                            <button
                                                type="submit"
                                                className="h-[48px] w-[279px] bg-hw-orange-hover rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] "
                                                disabled
                                            >

                                                <div className='flex ml-[85px]'>

                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">

                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />

                                                    </div>

                                                    <div className='text-white ml-[8px] font-bold'>Guardar</div>

                                                </div>

                                            </button> :

                                            <button
                                                type="submit"
                                                className="h-[48px] w-[279px] bg-hw-orange rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] "
                                            >

                                                <div className='flex ml-[85px]'
                                                    onClick={() => onSubmit()}>

                                                    <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">

                                                        <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />

                                                    </div>

                                                    <div className='text-hw-white ml-[8px] font-bold'>Guardar</div>

                                                </div>

                                            </button>

                                        }
                                    </div>

                                </div>

                            </form>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default FilterBranchModal
