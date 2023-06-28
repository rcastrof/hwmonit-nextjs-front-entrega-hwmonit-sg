import { useState, useEffect } from "react";
import { Switch } from '@headlessui/react'

const HwSwitch = ( props ) => {
    
    const [enabled, setEnabled] = useState(props.status)

    useEffect(() => {
      setEnabled(props.status)
    }, [props.status])
       

    const onTrigger = () => {
        setEnabled(!enabled);
        props.parentCallback(!enabled);
    }

    return(
        <Switch
        checked={enabled}
        onChange={() => {onTrigger();}}
        className={`${
            enabled ? 'bg-[#84BD00]' : 'bg-[#E4E4E4]'
        } relative inline-flex items-center h-[32px] rounded-full w-[59px]`}
        >
        <span >{enabled}</span>
        <span
            className={`${
            enabled ? 'translate-x-8 bg-white' : 'translate-x-1 bg-[#969696]'
            } inline-block w-[24px] h-[24px] transform  rounded-full`}
            
        />
    </Switch>
    );

}

export default HwSwitch;