import { useState } from "react";

const CardRed = ( props ) => {
    const {detail} = props;

    
    return(
        <div className='bg-white/[0.15] mx-[24px] rounded-[15px] w-[279px] h-[168px] mb-[8px]'>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px] mt-[16px]">
            <div className="flex-auto text-white font-bold ">{detail.name}</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px]  ">
            <div className="flex-auto text-hw-white/80 ">Dirección IP</div>
            <div className="justify-end text-white/80 font-semibold ">{detail.ip_address}</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px]  ">
            <div className="flex-auto text-hw-white/80 ">Netmask</div>
            <div className="justify-end text-white/80 font-semibold">{detail.netmask}</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px]  ">
            <div className="flex-auto text-hw-white/80 ">Broadcast IP</div>
            <div className="justify-end text-white/80 font-semibold">{detail.broadcast_ip}</div>
        </div>

    </div>

   );

}

export default CardRed;