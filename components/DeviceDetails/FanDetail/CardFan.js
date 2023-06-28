import React from 'react'

const CardFan = (props) => {
   const {detail} = props;

  return (
    <div className="bg-[#F5F5F5]/20 mx-[15px] ml-6 p-[2px] rounded-[15px] w-[279px] h-[135px] mb-[8px]">
    <div className="flex flex-col bg-transparent rounded-[15px] mx-[6px] p-[2px] pl-[4px] ">
        <div className="text-[#EA683F] font-bold text-[16px] leading-[18px] tracking-[-2%] mb-[5px] pt-[16px] pl-[5px]">
            {detail.name}
        </div>

        <div className="flex flew-wrap flex-row justify-around mt-[5px]">
           
            <div className="bg-white/20 break-words w-[100px] h-[70px] rounded-[16px] mb-[2px] flex flex-col items-center leading-[18px] justify-center tracking-[-2%] mr-[8px]">
                <div className="text-[14px] text-[#FAFAFA] font-semibold p-2">
                    {Math.round(detail.value)}RPM
                </div>
                <div className="text-[12px] text-[#FAFAFA]">
                    Actual
                </div>
            </div>
            <div className="bg-white/20 w-[100px] h-[70px] rounded-[16px] mb-[2px] flex flex-col items-center leading-[18px] justify-center tracking-[-2%] mr-[8px]">
                <div className="text-[14px] text-[#FAFAFA] font-semibold p-2">
                    {Math.round(detail.Min)}RPM
                </div>
                <div className="text-[12px] text-[#FAFAFA]">Min.</div>
            </div>
            <div className="bg-white/20 w-[100px] h-[70px] rounded-[16px] mb-[2px] flex flex-col items-center leading-[18px] justify-center tracking-[-2%] mr-[8px]">
                <div className="text-[14px] text-[#FAFAFA] font-semibold p-2">
                    {Math.round(detail.Max)}RPM
                </div>
                <div className="text-[12px] text-[#FAFAFA]">Max.</div>
            </div>
        </div>
    </div>
</div>
  )
}

export default CardFan