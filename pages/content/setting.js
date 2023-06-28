import Layout from '../../components/Layout/Layout'
import CardSetting from '../../components/Setting/CardSetting'
import axios from "axios";
import { checkSubmodule } from '../../components/Permission/CheckSubmodules';

export default function Setting(props) {


    return (
    
    <Layout refreshDate='' selected ="bg-[#FAFAFA]/20" position="setting">
       
        <div className='font-bold text-[32px] text-hw-white ml-[24px] mt-[27px] mb-[27px] '>
            Configuración
        </div>

       <div className='m:flex m:flex-wrap m:ml-[24px] '>
       <CardSetting title="Mi Perfil" path="/content/profile"  detail="Administra tu perfil o cambia tu contraseña" icon="perfil"/>
        {checkSubmodule(props.submodules, "Configuración Permisos") && <CardSetting title="Permisos" path="/content/permission"  detail="Desde esta opción podrás administrar a todos tus usuarios del sistema, así como también podrás darle permisos para ver las distintas funcionalidades del sistema." icon="permiso"/>}
        {checkSubmodule(props.submodules, "Configuración Zonas") && <CardSetting path="/content/zone" title="Zonas" detail="Para realizar un seguimiento más ordenado de tus sucursales crea zonas, que te permitirán agrupar todas las sucursales que deseas crear." icon="zona"/>}
        {checkSubmodule(props.submodules, "Configuración Sucursales") && <CardSetting title="Sucursales" path="/content/branch" detail="Administra desde esta opción todas tus sucursales en donde también podrás agregar los dispositivos que desees monitorear." icon="sucursal"/>}
        {checkSubmodule(props.submodules, "Configuración Tipo de dispositivos") && <CardSetting path="/content/device_type" title="Tipos de dispositivos" detail="Identifica de forma más sencilla los distintos dispositivos que deseas monitorear. Desde acá podrás crear un alías para identificar diferentes dispositivos." icon="tipo dispositivo"/>}
        {checkSubmodule(props.submodules, "Configuración Dispositivos") && <CardSetting path="/content/device_setting" title="Dispositivos" detail="Desde esta opción podrás administrar los diferentes dispositivos que desees monitorear." icon="dispositivo"/>}
        {checkSubmodule(props.submodules, "Configuración de Monitoreos") && <CardSetting path="/content/monitor_config" title="Configuración de Monitoreos" detail="Configura los rangos mínimos y máximo, para las alertas de los distintos componentes de tus dispositivos." icon="monitor"/>}
        {checkSubmodule(props.submodules, "Configuración Administrador Report") && <CardSetting path="/content/adminReport" title="Administrador Report" detail="Configura las caracteristicas del sistema de instalación / actualización de Hwmonit." icon="report"/>}
        <div className='pb-[10px]'/>
       </div>

   </Layout>
      
  )
}

export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Configuración"}, { withCredentials: true, headers: {
          Cookie: context.req.headers.cookie
      }})
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

    if(submodules===401){
      return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props:{},
        };
  }
    return {
      props: submodules, // will be passed to the page component as props
    }
  }


