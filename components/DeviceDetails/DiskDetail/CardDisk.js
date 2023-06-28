
const CardDisk = ( props ) => {
    const {detail} = props;

    const getChip = (status) =>{
        if(status===0){
            return(<div className="h-[24px] w-[24px]  bg-hw-alert rounded-full ml-[8px] ">
            </div>)
        }
        if(status===1){
            return(<div className="h-[24px] w-[24px] bg-hw-ok rounded-full ml-[8px]  self ">

            </div>)
        }
        if(status===2){
            return(
                <div className="h-[24px] w-[24px] bg-hw-warning rounded-full ml-[8px] ">
  
                </div>
            )
        }
    }
    
    return(
        <div className='bg-white/[0.15] mx-[24px] rounded-[15px] w-[279px] h-[255px] mb-[8px]'>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px] mt-[16px]">
            <div className="flex-auto text-hw-white font-bold ">Dispositivo {detail.device} </div>
            {getChip(detail.status)}
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px]  text-hw-white/80">
            <div className="flex-auto ">Mountpoint</div>
            <div className="justify-end font-semibold">{detail.mountpoint}</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px] text-hw-white/80">
            <div className="flex-auto ">Tipo FS</div>
            <div className="justify-end font-semibold ">{detail.fstype}</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px] text-hw-white/80">
            <div className="flex-auto ">Tamaño total</div>
            <div className="justify-end font-semibold ">{detail.total_size} GB</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px]  text-hw-white/80">
            <div className="flex-auto ">Usado</div>
            <div className="justify-end font-semibold ">{detail.used} GB</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px] text-hw-white/80">
            <div className="flex-auto ">Libre</div>
            <div className="justify-end font-semibold ">{detail.free} GB</div>
        </div>

        <div className ="flex mb-[16px] leading-[18px] tracking-[-2%] text-[16px] mx-[16px]  text-hw-white/80">
            <div className="flex-auto ">Porcentaje</div>
            <div className="flex justify-end font-semibold ">{detail.percentage}% </div>
            
        </div>

    </div>

   );

}

export default CardDisk;