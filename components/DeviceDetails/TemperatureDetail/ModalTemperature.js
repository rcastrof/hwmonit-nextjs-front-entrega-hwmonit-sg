import { Fragment, useEffect, useRef, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import CardTemperature from "./CardTemperature";
import { FaTemperatureLow } from "react-icons/fa";
import { HiChip } from "react-icons/hi";
import { BsCpu, BsCpuFill } from "react-icons/bs";
import SelectorTemperatures from "./SelectorTemperatures";

// Array que guardara los iconos en el orden del array de devices
const icons = [BsCpu, HiChip, BsCpuFill];

// Array para recorrer los distintos dispositivlos
const devices = [
    {
        name: "CPU",
        actual: "12",
        min: "13",
        max: "20",
    },
    {
        name: "LPCIO",
        actual: "12",
        min: "13",
        max: "20",
    },
    {
        name: "GPU",
        actual: "12",
        min: "13",
        max: "20",
    },
];

const ModalTemperature = (props) => {
    const { show, onClose, details } = props;
    const cancelButtonRef = useRef(null);

    //Variable para guardar el dispositivo seleccionado
    const [selected, setSelected] = useState(devices[0]);

    // Variable para guardar el array de temperaturas seleccionada
    const [temperature, setTemperature] = useState(null);

    // Funcion que setea en una variable los array de temperatura una vez se cambia el 
    // valor en el componente SelectorTemperatures y luego de eso se consulta si el array esta
    // vacio o no para darle el valor del array para que lo recorra el map o null para mostrar
    // que no hay informacion
    const handleTemperature = () => {
        
        if(!details){
            return setTemperature(null)
        }
        if(selected.name === "CPU"){
            return setTemperature(details?.temperature_cpu?.length ? details.temperature_cpu : null);
        }
        if(selected.name === "GPU"){
            return setTemperature(details?.temperature_gpu?.length ? details.temperature_gpu : null);
        }
        if(selected.name === "LPCIO"){
            return setTemperature(details?.temperature_lpcio?.length ? details.temperature_lpcio : null);
        }
    }

    // Se ejecutara cada vez que el valor de SelectorTemperature
    useEffect(() => {
        handleTemperature();
    }, [selected])

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-autogrid"
                initialFocus={cancelButtonRef}
                onClose={() => onClose()}
            >
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
                        <div className="inline-block w-[327px] h-[550px] align-bottom bg-gradient-to-b from-[#003C61] to-[#1B6970] text-left overflow-hidden shadow-xl transform transition-all my-[1rem] m:my-[2rem] rounded-[1.875rem]">
                            {/*Header modal */}
                            <div className="px-4 pt-5 justify-end">
                                <div className="flex flex-col">
                                    <div className="flex justify-end mr-[0.5rem]">
                                        <div
                                            className="flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#F5F5F5] cursor-pointer"
                                            onClick={() => onClose()}
                                        >
                                            <RiCloseFill
                                                className="w-[1.5rem] h-[1.5rem] text-[#000]/60"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-[0.5rem] flex">
                                        <div className="h-[32px] w-[32px] mr-[8px] bg-[#EA683F] rounded-full flex">
                                            <FaTemperatureLow className=' h-[20px] w-[20px] ml-[6px] text-white self-center' />
                                        </div>
                                        <Dialog.Title as="h3" className="text-[20px] font-bold leading-[27px] text-hw-white tracking-[-3%] whitespace-nowrap mb-[29px] mt-[4px]">
                                        Temperaturas
                                        </Dialog.Title> 
                                    </div>
                                </div>
                            </div>

                            <hr className="bg-white/10 border-none h-[8px] text-[14px] leading-[18px] tracking-[-2%]" />
                            {/*Modal Temperature */}
                            <div className="w-full px-2 py-2">
                                <div className="mx-auto w-full max-w-md">
                                    <SelectorTemperatures selected={selected} setSelected={setSelected} devices={devices} icons={icons} />
                                </div>
                            </div>

                            <hr className="bg-white/10 border-none h-[8px] mb-5 text-[14px] leading-[18px] tracking-[-2%]" />

                            <div className="h-[253px] overflow-y-auto flex flex-wrap gt-scroll">
                                {/*Contenido*/}
                                {temperature !== null ? (
                                    temperature.map((detail, index) => {
                                        return <CardTemperature key={index} detail={detail} />;
                                    })
                                ) : (
                                    <div className="flex-wrap text-center">
                                        <span className="text-[24px]">🤓</span>{" "}
                                        <span className="text-[16px] font-semibold text-[#FAFAFA]">
                                         No es posible monitorear esta información ...
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalTemperature;