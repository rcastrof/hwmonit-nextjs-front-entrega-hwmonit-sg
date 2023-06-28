import Layout from '../../components/Layout/Layout'
import { FaChevronLeft, FaChevronDown } from 'react-icons/fa'
import { RiAddLine } from 'react-icons/ri'
import { HiOutlineRefresh } from 'react-icons/hi'
import { useRouter } from "next/router";
import CardBranch from '../../components/Branch/CardBranch';
import { useEffect, useState } from 'react';
import { Bars } from 'react-loader-spinner';
import axios from 'axios';
import ModalCreatebranch from '../../components/Branch/ModalCreateBranch';
import FilterBranchModal from '../../components/Branch/FilterBranchModal';
import { BsCheck } from 'react-icons/bs'
import { BiSliderAlt, BiSearch } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { checkSubmodule } from '../../components/Permission/CheckSubmodules';
export default function Branch(props) {

    const { push } = useRouter();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saveOK, setSaveOK] = useState(false);
    const [deleteOK, setDeleteOK] = useState(false);
    const [contactOK, setContactOK] = useState(false);
    const [contactUpdate, setContactUpdate] = useState(false);
    const [contactDelete, setContactDelete] = useState(false);
    const [branchUpdate, setBranchUpdate] = useState(false);
    //estados para filtro
    const [branchFilter, setBranchFilter] = useState('data')
    const [showFilterBranchModal, setShowFilterBranchModal] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)

    //paginación
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(2)
    const [loadingMore, setLoadingMore] = useState(false)
    let offset = 0

    const navigate = (url) => {
        push(url);
    }

    useEffect(() => {

        async function fetchBranches() {            
            await getBranchFilter();
            
        }
        fetchBranches();

    }, [])



    const refreshbranches = async () => {

        setPage(2)
        offset = 0
        setLoading(true);
        setBranchFilter('data')
        setIsFiltered(false)

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}branchlist?limit=${process.env.LIMIT_BRANCHES}&offset=${offset}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });

        setBranches(current => response);
        let count = branches.length
        setCount(count)
        setLoading(false);
    }

    const getBranchFilter = async () => {

      
        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}branchfilter/${branchFilter || 'data'}?limit=${process.env.LIMIT_BRANCHES}&offset=${offset}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);

                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });
        setBranches(current => [...current, ...response])
        let count = response.length
        setCount(count)
        setBranchFilter(branchFilter)
        setLoading(false);

    }

    const showMore = async () => {

        setLoadingMore(true)
        offset = ((process.env.LIMIT_ZONES * page) - process.env.LIMIT_ZONES) // Fórmula para calcular desde donde traerá las siguientes zonas (varia segun límite)
        await getBranchFilter()
        setPage(current => current + 1)
        setLoadingMore(false)

    }    

    const hideFilter = async () => {
        setBranchFilter('data')
        await refreshbranches()
        setIsFiltered(false)
    }

    //Limpia las tarjetas previas del primer useEffect cuando se filtra por un valor específico 
    const clearArray = () => {
        setBranches([])
        offset = 0
        setPage(2)
    }

    const handleCallback = (childData) => {
        if (childData && childData.state) {
            refreshbranches();
        }

        if (childData && childData.status === 200 && childData.message === "save") {
            setSaveOK(true);
        }

        if (childData && childData.status === 200 && childData.message === "delete") {
            setDeleteOK(true);
        }

        if (childData && childData.status === 200 && childData.message === "contactSave") {
            setContactOK(true);
        }

        if (childData && childData.status === 200 && childData.message === "contactUpdate") {
            setContactUpdate(true);
        }

        if (childData && childData.status === 200 && childData.message === "contactDelete") {
            setContactDelete(true);
        }
        if (childData && childData.status === 200 && childData.message === "branchUpdate") {
            setBranchUpdate(true);
        }

    }

    return (

        <Layout refreshDate='' selected='bg-[#FAFAFA]/20' position="setting">
             
            <div className='flex-row flow-root'>

                <div className='flex mt-[10px] mb-[12px] float-left'>
                    <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={() => { navigate("/content/setting") }}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
                    </div>
                </div>

                <div className='flex mt-[10px] mb-[22px] float-right'>
                    <div className='flex cursor-pointer' onClick={() => refreshbranches()}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#EA683F]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>
           
            <div className='font-bold text-[32px] text-[#FAFAFA] ml-[24px] mt-[12px] mb-[27px]'>
                Sucursales
            </div>

            <div className='flex justify-between'>
                {checkSubmodule(props.submodules, "Crear Sucursal") &&
                    <div>
                        <div className='flex w-[215px] h-[48px] bg-[#EA683F] cursor-pointer rounded-[10px] ml-[24px] mb-[12px]' onClick={() => setShowModal(true)}>
                            <div className='flex self-center w-[24px] h-[24px] rounded-full bg-[#D6E1E7]/25 ml-[16px] mr-[8px]'>
                                <RiAddLine className="self-center text-white w-[24px] h-[24px]" />
                            </div>
                            <div className='self-center text-white text-[15px] font-bold leading-[22px] tracking-[-1%]'>
                                Crear nueva sucursal
                            </div>
                        </div>
                        <ModalCreatebranch show={showModal} onClose={() => setShowModal(false)} parentCallback={handleCallback} />
                    </div>}


                {!isFiltered &&
                    <div className='flex mr-[25px]'>
                        <button type='submit' className='h-[48px] w-[48px] bg-white/[0.15] rounded-[10px] text-[16px] leading-[22px] tracking-normal'
                            onClick={() => setShowFilterBranchModal(true)}>

                            <div className='flex ml-[8px]'>
                                <div className="flex justify-items-end items-end w-[24px] h-[24px] ml-[4px]">
                                    <BiSliderAlt className='w-[24px] h-[24px] text-hw-white' aria-hidden="true" />
                                </div>
                            </div>
                        </button>
                        <FilterBranchModal show={showFilterBranchModal} branchFilter={branchFilter} setBranchFilter={setBranchFilter} getBranchFilter={getBranchFilter} setIsFiltered={setIsFiltered} onClose={() => setShowFilterBranchModal(false)} clearArray={clearArray} />
                    </div>

                }

                {isFiltered &&
                    <div className='flex mr-[25px]'>
                        <button type="submit"
                            className='h-[48px] w-[48px] bg-white/[0.15] rounded-[10px] text-[16px] leading-[22px] tracking-normal'
                            onClick={() => hideFilter()}
                        >

                            <div className='flex ml-[8px]'>
                                <div className="flex justify-items-end items-end w-[24px] h-[24px] ml-[4px]">
                                    <BiSliderAlt className='w-[24px] h-[24px] text-hw-orange' aria-hidden="true" />
                                </div>
                            </div>
                        </button>
                    </div>
                }

            </div>

            {saveOK &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Sucursal guardada exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setSaveOK(false)} />
                    </div>
                </div>
            }

            {contactOK &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Contacto guardado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setContactOK(false)} />
                    </div>
                </div>
            }



            {contactUpdate &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Contacto actualizado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setContactUpdate(false)} />
                    </div>
                </div>
            }

            {contactDelete &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Contacto eliminado exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setContactDelete(false)} />
                    </div>
                </div>
            }

            {deleteOK &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Sucursal eliminada exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setDeleteOK(false)} />
                    </div>
                </div>
            }

            {branchUpdate &&
                <div className="bg-[#FFFFFF] border-t-8 border-[#84BD00] rounded-b text-[#84BD00] px-4 py-3 shadow-md mx-[24px] mb-[24px] rounded-[8px] w-[327px]" role="alert">
                    <div className="flex">
                        <BsCheck className='text-[#84BD00] w-[20px] h-[20px] self-center mr-[4px]' />
                        <p className="text-[14px] font-bold leading-[22px] tracking-[-1px] flex-auto">Sucursal actualizada exitosamente.</p>
                        <IoClose className='self-center cursor-pointer' onClick={() => setBranchUpdate(false)} />
                    </div>
                </div>
            }





            {!loading &&
                <div className='m:flex m:flex-wrap m:ml-[24px]'>

                    {branches && branches.length > 0 &&
                        branches.map((branch) => {
                            return (<CardBranch title={branch.branch_name} amount={branch.amount} ide={branch.branch_id} contactId={branch.contact_id} status={branch.active} creationDate={branch.creation_date} key={branch.branch_id} parentCallback={handleCallback} submodules={props.submodules} />)
                        })
                    }

                    <div className='pb-[10px]'/>

                    {branches && branches.length === 0 &&
                        <div className='flex-wrap text-center'>
                            <span className='text-[24px]'>🤓</span> <span className='text-[16px] text-[#FAFAFA]'> No hay sucursales configuradas, presiona el botón "Crear nueva sucursal" para comenzar... </span>
                        </div>
                    }
                </div>
            }
            
            {/* Cargar más */}
            {count !== 0 ?
                <div className='flex justify-center  justify-items-center pb-[16px] m:mt-[16px]'>

                    {/* Mientras trae las zonas muestra un loader de barras */}
                    {!loadingMore ?
                        <button
                            className='flex cursor-pointer disabled:cursor-not-allowed text-[#FAFAFA] text-[1rem] font-bold leading-[1.375rem] tracking-[-0.04em] whitespace-nowrap'
                            onClick={() => showMore()}
                            disabled={loadingMore}>
                            Cargar más
                            <FaChevronDown className='mt-1 ml-[0.444rem] text-[#FAFAFA]' />
                        </button>
                        :
                        <div className='flex m:justify-center'>
                            <Bars color="#FAFAFA" height={30} width={30} />
                        </div>
                    }
                </div>
                : null
            }




            {loading &&
                <div className='flex justify-center mt-[24px]'>
                    <Bars color="#FAFAFA" height={80} width={80} />
                </div>
            }

            
        </Layout>
    )
}


export async function getServerSideProps(context) {

    const getSubmodules = async () => {

        const branches = await new Promise((resolve, reject) => {
            axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`, { module: "Gestión de Sucursales" }, {
                withCredentials: true, headers: {
                    Cookie: context.req.headers.cookie
                }
            })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {

                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
        });

        return branches

    }

    const firstLogin = async () => {
        const firstLoginData = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}checkFirstLogin/`, { withCredentials: true, headers: {
                Cookie: context.req.headers.cookie}})
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        resolve(error.response.status)
                    }
                    resolve(error);
                })
        });

        return firstLoginData
    }

    let loginData = await firstLogin()

    if(loginData.user.firstLogin === false){
        return {
            redirect: {
              permanent: false,
              destination: "/firstLogin",
            },
            props:{},
        };
    }


    let submodules = await getSubmodules()

    if (submodules === 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }
    return {
        props: submodules, // will be passed to the page component as props
    }
}

