import Layout from '../../components/Layout/Layout'
import { FaChevronLeft, FaChevronRight, FaTemperatureLow, FaFan, FaBolt } from 'react-icons/fa'
import { RiComputerFill, RiContactsBookFill, RiRouterFill } from 'react-icons/ri'
import { HiOutlineRefresh } from 'react-icons/hi'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import { Bars } from 'react-loader-spinner';
import axios from 'axios';
import { BsCheck, BsPrinterFill, BsDiscFill, BsCpuFill, BsCpu, BsExclamation } from 'react-icons/bs'
import { CgSmartphoneRam } from 'react-icons/cg'
import { IoClose } from 'react-icons/io5'
import ModalRam from '../../components/DeviceDetails/ModalRam';
import ModalScreen from '../../components/DeviceDetails/ModalScreen';
import ModalContact from '../../components/DeviceDetails/ModalContact';
import ModalGPU from '../../components/DeviceDetails/ModalGPU';
import ModalDisk from '../../components/DeviceDetails/DiskDetail/ModalDisk';
import ModalRed from '../../components/DeviceDetails/RedDetail/ModalRed';
import ModalCPU from '../../components/DeviceDetails/CPUDetail/ModalCPU';
import ModalPrinter from '../../components/DeviceDetails/ModalPrinter';
import ModalFan from '../../components/DeviceDetails/FanDetail/ModalFan'
import ModalTemperature from '../../components/DeviceDetails/TemperatureDetail/ModalTemperature';
import { checkSubmodule } from '../../components/Permission/CheckSubmodules';
import HwSwitch from '../../components/HwSwitch';
import ModalElectricity from '../../components/DeviceDetails/ModalElectricity';

export default function DeviceDetails(props) {

    const router = useRouter();
    const { push } = router;
    const { id } = router.query;

    const [device, setDevice] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModalRam, setShowModalRam] = useState(false);
    const [showModalScreen, setShowModalScreen] = useState(false);
    const [showModalContact, setShowModalContact] = useState(false);
    const [showModalGPU, setShowModalGPU] = useState(false);
    const [showModalDisk, setShowModalDisk] = useState(false);
    const [showModalRed, setShowModalRed] = useState(false);
    const [showModalCPU, setShowModalCPU] = useState(false);
    const [showModalPrinter, setShowModalPrinter] = useState(false);
    const [showModalTemperature, setShowModalTemperature] = useState(false);
    const [showModalFan, setShowModalFan] = useState(false);
    const [showModalElectricity, setShowModalElectricity] = useState(false);
    const [monitorCtrl, setMonitorCtrl] = useState(0);
    const [printCtrl, setPrintCtrl] = useState(0);
    const [diskCtrl, setDiskCtrl] = useState(0)
    const [ramCtrl, setRamCtrl] = useState(0)
    const [gpuCtrl, setGpuCtrl] = useState(0)
    const [cpuCtrl, setCpuCtrl] = useState(0)
    const [lastUpdate, setLastUpdate] = useState('')
    const [isLoadingElectricity, setIsLoadingElectricity] = useState(true)
    const [voltage, setVoltage] = useState([]);
    const [current, setCurrent] = useState([]);
    const [power, setPower] = useState([]);
    const [deviceState, setDeviceState] = useState(false);
    const [isPowerLoading, setIsPowerLoading] = useState(true);

    const navigate = (url) => {
        push(url);
    }

    useEffect(() => {

        async function fecthDevice(id) {
            await getDevice(id);
        }

        if (id !== undefined) {
            fecthDevice(id);
        }

    }, [id])

    useEffect(() => {
        if (device.length > 0) {
            if (device[0].device_data.update_date) {

                setLastUpdate(new Date(device[0].device_data.update_date).toLocaleString("es-ES", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: '2-digit', second: '2-digit' }))
            } else if (device[0].device_data.creation_date) {

                setLastUpdate(new Date(device[0].device_data.creation_date).toLocaleString("es-ES", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: '2-digit', second: '2-digit' }))
            } else {
                setLastUpdate('')
            }
        }

        if (device === null || device === undefined || Object.keys(device).length === 0) {
            console.log('no device')
        } else {
            async function fetchPower() {
                await getPower();
            }
            fetchPower();
        }
    }, [device])


    const getIcon = (status) => {
        if (status === 0) {
            return (<div className=" h-[24px] w-[24px] mx-[8px] bg-[#E00000] rounded-full">
                <IoClose className=' h-[24px] w-[24px] self-center  text-white' />
            </div>)
        } else if (status === 1) {
            return (<div className=" h-[24px] w-[24px] mx-[8px] bg-[#9EC431] rounded-full">
                <BsCheck className=' h-[24px] w-[24px]  text-white' />
            </div>)
        } else if (status === 2) {
            return (<div className=" h-[24px] w-[24px] mx-[8px] bg-[#FF9900] rounded-full">
                <BsExclamation className=' h-[24px] w-[24px]  text-white' />
            </div>)
        } else {
            return (<div className=" h-[24px] w-[24px] mx-[8px] bg-[#E00000] rounded-full">
                <IoClose className=' h-[24px] w-[24px]  text-white' />
            </div>)
        }

    }

    const getIconInformation = (status) => {
        if (status === 0) {
            return (<div className=" h-[24px] w-[24px] mx-[8px] bg-[#9EC431] rounded-full">
                <BsCheck className=' h-[24px] w-[24px]  text-white' />
            </div>)
        }
        if (status === 1) {
            return (<div className=" h-[24px] w-[24px] mx-[8px] bg-[#E00000] rounded-full">
                <IoClose className=' h-[24px] w-[24px] self-center  text-white' />
            </div>)
        }
        if (status === 2) {
            return (<div className=" h-[24px] w-[24px] mx-[8px] bg-[#FF9900] rounded-full">
                <BsExclamation className=' h-[24px] w-[24px]  text-white' />
            </div>)
        }
    }

    const getDevice = async (ide) => {

        setLoading(true);
        setMonitorCtrl(0);
        setPrintCtrl(0);
        setDiskCtrl(0);
        setRamCtrl(0);
        setGpuCtrl(0);
        setCpuCtrl(0);

        const response = await new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_API_URL}device_data_details/${ide}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response.status === 401) {
                        push('/')
                    }
                    resolve(error);
                })
        });

        const error_cont_monitor = 0;
        const error_cont_print = 0;
        const error_cont_disk = 0;
        const error_cont_ram = 0;
        const error_cont_cpu = 0;
        const error_cont_gpu = 0;
        response[1].map((error) => {
            if (error.description_error === 'Monitor principal con problemas' || error.description_error === 'La Pantalla se encuentra apagada') {
                error_cont_monitor += 1;
            }

            if (error.description_error === 'Impresora con problemas') {
                error_cont_print += 1;
            }
            if (error.description_error === 'Problemas en capacidad de uso de disco(s)') {

                if (error.status === 0) {
                    error_cont_disk += 1
                }
                if (error.status === 2) {
                    error_cont_disk += 2
                }
            }
            if (error.description_error === 'Consumo memoria RAM elevado') {
                error_cont_ram = 2
            }
            if (error.description_error === 'Consumo memoria RAM crítico') {
                error_cont_ram = 1
            }

            if (error.description_error === 'Uso de GPU elevado') {
                error_cont_gpu = 2
            }
            if (error.description_error === 'Uso de GPU crítico') {
                error_cont_gpu = 1
            }
            if (error.description_error === 'Uso de CPU elevado') {
                error_cont_cpu = 2
            }
            if (error.description_error === 'Uso de CPU crítico') {
                error_cont_cpu = 1
            }

        })

        if (error_cont_monitor > 0) {
            setMonitorCtrl(1);
        }

        if (error_cont_print > 0) {
            setPrintCtrl(1);
        }
        if (error_cont_disk > 0) {
            setDiskCtrl(error_cont_disk)
        }
        if (error_cont_ram > 0) {
            setRamCtrl(error_cont_ram)
        }
        if (error_cont_gpu > 0) {
            setGpuCtrl(error_cont_gpu)
        }
        if (error_cont_cpu > 0) {
            setCpuCtrl(error_cont_cpu)
        }
        setDevice(response);
        getDeviceStates();
        setLoading(false);
    }

    const getPower = async () => {

        setIsPowerLoading(true);

        await axios.get(`${process.env.HOME_ASSISTANT_STATES}sensor.${device[0].electricity_id}_energy_power`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HOME_ASSISTANT_TOKEN}`
            }
        }).then(response => {
            setPower(response.data);
            setIsPowerLoading(false);

        }).catch(error => {
            if (error.response && error.response.status === 401) {
                push('/');
            }
            console.error(error);
        });
    }

    useEffect(() => {
        if (power.state !== null) {
            if (power.state >= 30) {
                setDeviceState(true);
            } else if (power.state < 30) {
                setDeviceState(false);
            }
        }
    }, [power.state])


    const getElectricity = async () => {
        setIsLoadingElectricity(true);
        //voltaje
        await axios.get(`${process.env.HOME_ASSISTANT_STATES}sensor.${device[0].electricity_id}_energy_voltage`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HOME_ASSISTANT_TOKEN}`,
            }
        }).then(response => {
            setVoltage(response.data);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                push('/');
            }
            console.error(error);
        });

        //corriente
        await axios.get(`${process.env.HOME_ASSISTANT_STATES}sensor.${device[0].electricity_id}_energy_current`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HOME_ASSISTANT_TOKEN}`,
            }
        }).then(response => {
            setCurrent(response.data);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                push('/');
            }
            console.error(error);
        });

        //potencia
        await axios.get(`${process.env.HOME_ASSISTANT_STATES}sensor.${device[0].electricity_id}_energy_power`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HOME_ASSISTANT_TOKEN}`
            }
        }).then(response => {
            setPower(response.data);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                push('/');
            }
            console.error(error);
        });
        setIsLoadingElectricity(false);

    }

    async function getDeviceStates() {
        try {
            const deviceState = power.state >= 30 || false;
            setDeviceState(deviceState);
        } catch (error) {
            if (error.response?.status === 401) {
                push('/');
            }
        }
    }

    async function switchDeviceState() {
        try {
            const response = await axios.post(
                `${process.env.HOME_ASSISTANT_SERVICES}switch/turn_on`,
                {
                    "entity_id": `switch.${device[0].entity_id}`
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.HOME_ASSISTANT_TOKEN}`
                    }
                }
            );            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                push('/');
            }
            console.error(error);
        }
    }

    const handleCallback = (childData) => {
        setDeviceState(childData);
    }

    return (

        <Layout refreshDate={lastUpdate} refreshText={lastUpdate !== '' ? 'Último reporte:' : ''} selected='bg-[#F3F3F3]' position="">
            <div className='flex-row flow-root'>
                <div className='flex mt-[10px] mb-[12px] float-left'>
                    <div className="flex ml-[24px] cursor-pointer w-[80px]" onClick={() => { props.fromMap ? navigate("/content/mapsInfo") : navigate("/content/general") }}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#F25B3D]'>
                            <FaChevronLeft className=' h-[12px] w-[7px] ml-[8px] mt-[6px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px]'>Volver</div>
                    </div>
                </div>

                <div className='flex mt-[10px] mb-[22px] float-right'>
                    <div className='flex cursor-pointer' onClick={() => getDevice(id)}>
                        <div className='w-[24px] h-[24px] rounded-full bg-[#F25B3D]'>
                            <HiOutlineRefresh className=' h-[20px] w-[20px] ml-[2px] mt-[2px] text-[#FFFFFF]' />
                        </div>
                        <div className='text-[16px] leading-[18px] tracking-[-2%] font-bold text-[#FFFFFF] mt-[3px] ml-[8px] mr-[24px]'>Actualizar</div>
                    </div>
                </div>
            </div>

            {device.length > 0 && !loading && <>
                <div className='font-bold text-[32px] text-hw-white ml-[24px] mt-[12px] mb-[27px]'>
                    {device[0].label}
                </div>

                {
                    isPowerLoading ? (
                        <div className='flex justify-center mt-[24px]'>
                            <Bars color="#FAFAFA" height={50} width={80} />
                        </div>
                    ) : (
                        !isPowerLoading && (
                            <div className='flex justify-end mr-10'>
                                {device[0].isAutomaticShutdown === true && checkSubmodule(props.submodules, "Ver Apagado Automático") ? (
                                    <div className='mt-[20px] flex' onClick={() => switchDeviceState()} >
                                        <div className='ml-[24px] mr-[8px] font-semibold text-[16px] leading-[21.79px] tracking-[-5%] self-center text-white'>OFF</div>
                                        <HwSwitch parentCallback={handleCallback} status={deviceState} />
                                        <div className='self-center ml-[8px] text-[#84BD00] font-semibold text-[16px] leading-[21.79px] tracking-[-5%]'>ON</div>
                                    </div>
                                ) : null}
                            </div>
                        )
                    )
                }

                <div className='flex flex-wrap mb-[24px] ml-[24px]'>
                    {device[1].map(
                        (description) => {
                            return (
                                <div className='h-[40px] select-none bg-white/[0.15] flex min-w-fit items-center rounded-[10px] mb-[8px] mr-[8px]'>
                                    <div className='text-[16px] text-white ml-[12px] font-bold leading-[19.2px]'>{description.description_error}</div>
                                    {getIcon(description.status)}
                                </div>
                            )
                        }
                    )}

                </div>

                <div className='flex flex-wrap bg-white/[0.15] mb-[16px] mx-[24px] rounded-[16px] text-[16px] text-white leading-[18px] tracking-[-2%] '>

                    <div className='m:flex m:flex-wrap ml-[24px]  mt-[20px]'>
                        <div className='m:flex'>
                            <div className='text-[#FAFAFA]/80 m:mr-[10px]'>Oficina sucursal:</div>
                            <div className='mb-[20px] m:mr-[40px] font-bold '>{device[0].branch_id.label}</div>
                        </div>

                        <div className='m:flex'>
                            <div className='text-[#FAFAFA]/80 m:mr-[10px]'>Tipo de dispositivo:</div>
                            <div className='mb-[20px] m:mr-[40px] font-bold'>{device[0].device_type.label}</div>
                        </div>

                        <div className='m:flex'>
                            <div className='text-[#FAFAFA]/80 m:mr-[10px]'>Sistema:</div>
                            <div className='mb-[20px] m:mr-[40px] font-bold'>{device[0].device_data.system_info.system}</div>
                        </div>

                        <div className='m:flex'>
                            <div className='text-[#FAFAFA]/80 m:mr-[10px]'>Release:</div>
                            <div className='mb-[20px] m:mr-[40px] font-bold'>{device[0].device_data.system_info.release}</div>

                        </div>

                        <div className='m:flex'>
                            <div className='text-[#FAFAFA]/80 m:mr-[10px]'>Versión:</div>
                            <div className='mb-[20px] m:mr-[40px] font-bold'>{device[0].device_data.system_info.version}</div>
                        </div>

                        <div className='m:flex'>
                            <div className='text-[#FAFAFA]/80 m:mr-[10px]'>Node name:</div>
                            <div className='mb-[20px] m:mr-[40px] font-bold'>{device[0].device_data.system_info.node_name}</div>
                        </div>

                        <div className='m:flex'>
                            <div className='text-[#FAFAFA]/80 m:mr-[10px]'>Procesador:</div>
                            <div className='mb-[20px] m:mr-[40px] font-bold'>{device[0].device_data.system_info.processor}</div>
                        </div>

                    </div>

                </div>

                <div className='flex flex-wrap '>
                    <div className='flex flex-wrap bg-white/[0.15] mb-[16px] mx-[24px] rounded-[16px] m:w-[325px] pb-[40px] flex-auto'>
                        <div className='flex mt-[32px] ml-[24px] mb-[12px] text-white  font-bold leading-[18px] tracking-[-2%] text-[18px]'>Información</div>

                        {!checkSubmodule(props.submodules, "Ver Discos") && !checkSubmodule(props.submodules, "Ver GPU") && !checkSubmodule(props.submodules, "Ver Red") && !checkSubmodule(props.submodules, "Ver Memoria RAM") && !checkSubmodule(props.submodules, "Ver CPU") && !checkSubmodule(props.submodules, "Ver Contacto") &&
                            <div className='text-[16px] text-hw-white font-semibold leading-[22px] flex items-center text-center'>👮 Para acceder a esta información, necesitarás obtener un permiso.</div>

                        }

                        <div className='flex flex-wrap'>

                            {checkSubmodule(props.submodules, "Ver Impresora") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] cursor-pointer' onClick={() => setShowModalPrinter(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <BsPrinterFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Impresora</div>
                                    </div>

                                    {printCtrl > 0 &&
                                        <div className=" h-[24px] w-[24px] mx-[8px] bg-[#E00000] rounded-full">
                                            <IoClose className=' h-[24px] w-[24px] self-center  text-white' />
                                        </div>
                                    }

                                    {printCtrl === 0 &&
                                        <div className=" h-[24px] w-[24px] mx-[8px] bg-[#9EC431] rounded-full">
                                            <BsCheck className=' h-[24px] w-[24px]  text-white' />
                                        </div>
                                    }

                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white' />
                                </div>
                                <ModalPrinter show={showModalPrinter} onClose={() => setShowModalPrinter(false)} details={(device[0].device_data.printer_info !== undefined && device[0].device_data.printer_info !== null) ? device[0].device_data.printer_info : null} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver Pantalla") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] cursor-pointer' onClick={() => setShowModalScreen(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <RiComputerFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Pantalla</div>
                                    </div>

                                    {monitorCtrl > 0 &&
                                        <div className="h-[24px] w-[24px] mr-[16px] bg-[#F9EAD0] rounded-full ml-[16px] justify-end">
                                            <BsExclamation className=' h-[24px] w-[24px]  text-white' />
                                        </div>
                                    }

                                    {monitorCtrl === 0 &&
                                        <div className=" h-[24px] w-[24px] mx-[8px] bg-[#9EC431] rounded-full">
                                            <BsCheck className=' h-[24px] w-[24px]  text-white' />
                                        </div>
                                    }

                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white' />
                                </div>
                                <ModalScreen show={showModalScreen} onClose={() => setShowModalScreen(false)} details={device[0].device_data.display_info} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver Discos") && <div className='flex ml-[24px] mt-[8px]'>

                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalDisk(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <BsDiscFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Discos</div>

                                    </div>
                                    {getIconInformation(diskCtrl)}
                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                </div>
                                <ModalDisk show={showModalDisk} onClose={() => setShowModalDisk(false)} details={(device[0].device_data.disk_info !== undefined && device[0].device_data.disk_info !== null) ? device[0].device_data.disk_info : null} swapDetails={device[0].device_data.memory_info.percentage_swap} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver GPU") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalGPU(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <BsCpu className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>GPU</div>
                                    </div>
                                    {getIconInformation(gpuCtrl)}
                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                </div>
                                <ModalGPU show={showModalGPU} onClose={() => setShowModalGPU(false)} details={(device[0].device_data.gpu_info !== undefined && device[0].device_data.gpu_info !== null) ? device[0].device_data.gpu_info : null} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver Memoria RAM") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalRam(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <CgSmartphoneRam className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Memoria RAM</div>
                                    </div>
                                    {getIconInformation(ramCtrl)}
                                    <FaChevronRight className=' h-[10px] w-[10px] text-white mr-[23px] justify-end' />
                                </div>
                                <ModalRam show={showModalRam} onClose={() => setShowModalRam(false)} details={device[0].device_data.memory_info} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver CPU") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalCPU(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <BsCpuFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>CPU</div>
                                    </div>
                                    {getIconInformation(cpuCtrl)}
                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                </div>
                                <ModalCPU show={showModalCPU} onClose={() => setShowModalCPU(false)} details={(device[0].device_data.cpu_info !== undefined && device[0].device_data.cpu_info !== null) ? device[0].device_data.cpu_info : null} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver Red") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalRed(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <RiRouterFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Red</div>
                                    </div>

                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                </div>
                                <ModalRed show={showModalRed} onClose={() => setShowModalRed(false)} details={(device[0].device_data.red_info !== undefined && device[0].device_data.red_info !== null) ? device[0].device_data.red_info : null} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver Temperatura") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalTemperature(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <FaTemperatureLow className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Temperatura</div>
                                    </div>
                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                </div>
                                <ModalTemperature show={showModalTemperature} onClose={() => setShowModalTemperature(false)} details={(device[0].device_data.temperature_info !== undefined && device[0].device_data.temperature_info !== null) ? device[0].device_data.temperature_info : null} />
                            </div>}

                            {checkSubmodule(props.submodules, "Ver Ventilador") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalFan(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <FaFan className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Ventilador</div>
                                    </div>
                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                </div>
                                <ModalFan show={showModalFan} onClose={() => setShowModalFan(false)} details={(device[0].device_data.fan_info !== undefined && device[0].device_data.fan_info !== null) ? device[0].device_data.fan_info : null} />

                            </div>}

                            {checkSubmodule(props.submodules, "Ver Contacto") && <div className='flex ml-[24px] mt-[8px]'>
                                <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalContact(true)}>

                                    <div className='flex flex-auto'>
                                        <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                            <RiContactsBookFill className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <div className='text-[14px] text-white ml-[8px]  leading-[18px] flex self-center'>Contacto</div>
                                    </div>
                                    <FaChevronRight className=' h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                </div>
                                <ModalContact show={showModalContact} onClose={() => setShowModalContact(false)} details={(device[0].branch_id.contact !== undefined && device[0].branch_id.contact !== null) ? device[0].branch_id.contact : null} />
                            </div>}

                            {device[0].isElectricityMonitoring === true && checkSubmodule(props.submodules, "Ver Monitoreo de Electricidad") ? (
                                <div className='flex ml-[24px] mt-[8px]' >
                                    <div className='h-[56px] select-none bg-[#F5F5F5]/20 flex min-w-fit items-center rounded-[16px] mb-[8px] mr-[8px] w-[279px] flex-row cursor-pointer' onClick={() => setShowModalElectricity(true)}>
                                        <div className='flex flex-auto' onClick={() => getElectricity()}>
                                            <div className="h-[32px] w-[32px] mx-[8px] bg-[#EA683F] rounded-full ml-[16px] flex">
                                                <FaBolt className='h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                            </div>
                                            <div className='text-[14px] text-white ml-[8px] leading-[18px] flex self-center'>Electricidad</div>
                                        </div>
                                        <FaChevronRight className='h-[10px] w-[10px] mr-[23px] text-white justify-end' />
                                    </div>
                                    <ModalElectricity show={showModalElectricity} voltage={voltage} current={current} power={power} isLoadingElectricity={isLoadingElectricity} onClose={() => setShowModalElectricity(false)} details={(device[0]?.branch_id?.contact !== undefined && device[0]?.branch_id?.contact !== null) ? device[0].branch_id.contact : null} />
                                </div>
                            ) : null
                            }

                        </div>
                    </div>
                </div>
            </>
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
            axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`, { module: "Sucursales" }, {
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
            axios.get(`${process.env.REACT_APP_API_URL}checkFirstLogin/`, {
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

        return firstLoginData
    }

    let loginData = await firstLogin()

    if (loginData.user.firstLogin === false) {
        return {
            redirect: {
                permanent: false,
                destination: "/firstLogin",
            },
            props: {},
        };
    }


    let allowedURLS = [`${process.env.NEXT_PUBLIC_SELF_URL}content/general`, `${process.env.NEXT_PUBLIC_SELF_URL}content/mapsInfo`]

    if (context.req.headers.referer) {
        if (allowedURLS.includes(context.req.headers.referer) === false || context.req.headers.referer.split(process.env.NEXT_PUBLIC_SELF_URL)[1] === context.req.url) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
                props: {},
            };
        }
    } else {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
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
    if (context.req.headers.referer === `${process.env.NEXT_PUBLIC_SELF_URL}content/mapsInfo`) {
        let propsMap = {
            fromMap: true,
            submodules: submodules.submodules
        }
        return {
            props: propsMap
        }
    } else {
        return {
            props: submodules, // will be passed to the page component as props
        }
    }

}

