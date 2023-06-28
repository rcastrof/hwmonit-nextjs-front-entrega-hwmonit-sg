import { Dialog, RadioGroup } from '@headlessui/react';
import React from 'react'

const SelectorTemperatures = ({ selected, setSelected, devices, icons }) => {
    return (
        <RadioGroup value={selected} onChange={setSelected}>
            <RadioGroup.Label className="sr-only">
                Temperatures
            </RadioGroup.Label>
            <div className="space-y-2 m-[5px] flex flex-row flex-wrap">
                {devices.map((device, id) => {
                    const Icon = icons[id];
                    return (
                        <RadioGroup.Option
                            key={device.name}
                            value={device}
                            className={({ active, checked }) =>
                                `${active
                                    ? "ring-2 bg-[#FAFAFA]/20 ring-opacity-60 ring-offset-2 ring-offset-[#EA683F]"
                                    : ""
                                }
                                ${checked
                                    ? "bg-[#FAFAFA]/20 bg-opacity-75 text-white ring-opacity-60 ring-offset-2 ring-offset-[#EA683F]"
                                    : "bg-[#FAFAFA]/20"
                                }
                                w-[105px] h-[40px] ml-[10px] mt-[5px] content-center justify-center bg-[#F5F5F5]/20 items-center rounded-[10px] cursor-pointer`
                            }
                        >
                            {({ active, checked }) => (
                                <RadioGroup.Label
                                    as="p"
                                    className={`font-medium flex flex-row content-center mr-[10px] mt-[8px]
                                    ${checked ? "text-white" : "text-gray-900"}`}
                                >
                                    <div className="h-[24px] w-[24px] mx-[8px] bg-[#EA683F] rounded-full ml-3">
                                        {/** button */}
                                        <Icon className="mt-[2.5px] h-[18px] w-[18px] text-[#FAFAFA] ml-[2px]" />
                                    </div>
                                    <Dialog.Title className="text-[16px] font-bold text-[#FAFAFA]">
                                        {device.name}
                                    </Dialog.Title>
                                </RadioGroup.Label>
                            )}
                        </RadioGroup.Option>
                    );
                })}
            </div>
        </RadioGroup>
    )
}

export default SelectorTemperatures