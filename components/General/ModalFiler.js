import { Fragment, useEffect, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { Dialog, Transition } from '@headlessui/react'
import { BsCheck } from 'react-icons/bs';
import { BiSliderAlt } from 'react-icons/bi'
import axios from "axios";
import { useForm } from 'react-hook-form'


const ModalFiler = (props) => {
    const { show, onClose, details, loading, title } = props;
    const cancelButtonRef = useRef(null);
    const [zones, setZones] = useState([]);
    const [zoneSelected, setZoneSelected] = useState('-1');
    const [branchSelected, setBranchSelected] = useState('-1');
    const [branches, setBranches] = useState([]);
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm();

    useEffect(() => {

        async function fetchReport() {

            await getZones();
        }
        fetchReport();

    }, [])

    const getZones = async () => {
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}zonelist`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
        });

        setZones(response.zone)
        
    }

    const getFilterZone = async (id) => {
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}zone/${id}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
        });

        if(response !== undefined && response.zone !== undefined && response.zone.branch_office !== undefined){
            setBranches(response.zone.branch_office)
        } else {
            setBranches([])
            setBranchSelected('-1')
        }
        
    }

    const handleZone = async (value) => {
        setZoneSelected(value.target.value)
        await getFilterZone(value.target.value)
    }

    const handleBranch = async (value) => {
        setBranchSelected(value.target.value)
        // await getBranches(value.target.value)
    }

    const onSubmit = (e) => {

    }

    const filterData = async () => {
       props.parentCallBack({branchId: branchSelected, zoneId: zoneSelected})
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
                        <div className="inline-block w-[327px] h-[425px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[10rem] xl:my-[15rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className='flex justify-end mr-[0.5rem]'>
                                        <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-hw-white cursor-pointer" onClick={() =>onClose()}>
                                            <RiCloseFill className='w-[1.5rem] h-[1.5rem] text-[#000]' aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <BiSliderAlt className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                            Filtro
                                        </Dialog.Title>
                                    </div>
                                </div>
                            </div>

                            <hr className='bg-white/10 border-none h-[8px]' />

                            <form onSubmit={handleSubmit(onSubmit)} id="filter">
                                <div className="h-[10px] w-[299px] rounded-[16px] mr-[8px] leading-[22px] tracking-[-1px]">

                                    <div className='flex text-white ml-[16px] cursor-pointer flex-wrap text-[14px]'>

                                        <div className='mb-[8px] ml-[14px] font-semibold tracking-[-3%] whitespace-nowrap leading-[19.07px] text-[15px] mt-[18px]'>Filtrar por zona</div>

                                        <select
                                            className='ml-[14px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                            onChange={handleZone}
                                            value={zoneSelected}>

                                            <option className='bg-black hover:[#262626]' value={'-1'} >Todas las zonas</option>
                                        

                                            {zones && zones.length !== 0 ? zones.map((zone) =>

                                                <option className='bg-black hover:[#262626]' value={zone._id} key={zone._id} >{zone.label}</option>

                                            ) : null}

                                        </select>
                                    </div>

                                    <div className='flex text-white ml-[16px] cursor-pointer flex-wrap text-[14px]'>

                                        <div className='mb-[8px] ml-[14px] font-semibold tracking-[-3%] whitespace-nowrap leading-[19.07px] text-[15px] mt-[18px] '>Filtrar por sucursales</div>

                                        <select
                                            className='ml-[14px] border-[2px] border-white/20 bg-transparent rounded-[9px] w-[279px] h-[48px] pl-[16px] focus:outline-none focus-visible:ring-1 focus-visible:ring-white'
                                            onChange={handleBranch}
                                            value={branchSelected}>

                                            <option className='bg-black hover:[#262626]' value={'-1'} >Todas las sucursales</option>
                                          

                                            {branches && branches.length !== 0 ? branches.map((branch) =>
                                                <option className='bg-black hover:[#262626]' value={branch._id} key={branch._id} >{branch.label}</option>
                                            ) : null}

                                        </select>
                                    </div>

                                    <div className='flex mt-[25px] ml-[30px] '>

                                        <button
                                            type="submit"
                                            className="h-[48px] w-[279px] bg-[#EA683F] rounded-[10px] font-bold text-[16px] leading-[22px] tracking-[-1px] ">

                                            <div className='flex ml-[85px]'
                                                onClick={() => filterData()}>

                                                <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white/25">

                                                    <BsCheck className='w-[20px] h-[20px] text-white' aria-hidden="true" />

                                                </div>

                                                <div className='text-white ml-[8px] font-bold'>Guardar</div>

                                            </div>

                                        </button>

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

export default ModalFiler