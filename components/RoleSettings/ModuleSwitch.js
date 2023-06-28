import { useState, useEffect } from "react";
import { Switch } from '@headlessui/react'
import axios from "axios";
import { useRouter } from "next/router";
const ModuleSwitch = ( props ) => {
    const { push } = useRouter();
    const [enabled, setEnabled] = useState(props.status)

    
    
    useEffect(() => {
      setEnabled(props.status)
    }, [props.status])
    
    
    const getSubmodulesId = () =>{

        let ids = []
        props.submodules.map((submodule)=>{
            ids= [...ids, submodule.id]
        })
        return ids

    }

    const disableSubmodules = async () =>{
        
        if(props.idSubmodule){
            let submodule = props.idSubmodule
            const listDetails = await new Promise((resolve, reject) => {
                axios.put(`${process.env.REACT_APP_API_URL}disableRolPerms/${props.ide}`, {submodule: submodule}, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        
                        resolve(error);
                    })
                
            });
            props.handleCallback({state: true})

        }
        if(props.submodules){
            let submoduleArray = getSubmodulesId()

            const listDetails = await new Promise((resolve, reject) => {
                axios.put(`${process.env.REACT_APP_API_URL}disableRolPerms/${props.ide}`, {submoduleArray: submoduleArray}, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        
                        resolve(error);
                    })
            });

        props.handleCallback({state: true})

        }


    }

    const enableSubmodules = async () =>{

        if(props.idSubmodule){
            let submodule = props.idSubmodule
            const listDetails = await new Promise((resolve, reject) => {
                axios.put(`${process.env.REACT_APP_API_URL}enableRolPerms/${props.ide}`, {submodule: submodule}, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        
                        resolve(error);
                    })
            });
            props.handleCallback({state: true})
        }
        if(props.submodules){
            let submoduleArray = getSubmodulesId()

            const listDetails = await new Promise((resolve, reject) => {
                axios.put(`${process.env.REACT_APP_API_URL}enableRolPerms/${props.ide}`, {submoduleArray: submoduleArray}, { withCredentials: true })
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                        if (error.response.status === 401) {
                            push('/')
                        }
                        
                        resolve(error);
                    })
            });
            props.handleCallback({state: true})
        }

    }

    const onTrigger = async () => {
        
        if(enabled){

            await disableSubmodules()

        }else{
            await enableSubmodules()
        }





    }

    return(
        <Switch
        checked={enabled}
        onChange={() => {onTrigger();}}
        className={`${
            enabled ? 'bg-[#E5EECF]' : 'bg-[#E4E4E4]'
        } relative inline-flex items-center rounded-full w-10 h-5`}
        >
        <span className="sr-only">{enabled}</span>
        <span
            className={`${
            enabled ? 'translate-x-5 bg-[#84BD00]' : 'translate-x-0 bg-[#969696]'
            } inline-block w-4 h-4 transform  rounded-full`}
        />
    </Switch>
    );

}

export default ModuleSwitch;