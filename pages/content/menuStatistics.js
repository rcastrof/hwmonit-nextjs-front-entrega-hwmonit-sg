import Layout from '../../components/Layout/Layout'
import CardSetting from '../../components/Setting/CardSetting'
import { checkSubmodule } from '../../components/Permission/CheckSubmodules'
import axios from 'axios'

export default function menuStatistics(props) {

    return (
    
    <Layout refreshDate='' selected ="bg-[#FAFAFA]/20" position="menuStatistics">
       
        <div className='font-bold text-[32px] text-hw-white ml-[24px] mt-[27px] mb-[27px]'>
        Estadísticas 
        </div>

       <div className='m:flex m:flex-wrap m:ml-[24px]'>
        {checkSubmodule(props.submodules,"Estadísticas") &&<CardSetting title="Estadísticas" path="/content/statistics"  detail="Observa el resumen del rendimiento de los dispositivos por zona y además revisa el detalle de cada zona por sucursal a nivel general." icon="estadistica"/>}
        {checkSubmodule(props.submodules, "Mapa") &&<CardSetting path="/content/mapsInfo" title="Mapa de sucursales" detail="Observa a nivel mundial el estado de tus sucursales y filtra el estado que te interese." icon="zona"/>}
        {checkSubmodule(props.submodules, "Exportar data") &&<CardSetting path="/content/export_data" title="Exportar datos" detail="Genera archivos con los datos tus dispositivos." icon="export"/>}
        {checkSubmodule(props.submodules, "Vista Métricas") &&<CardSetting path="/content/metrics" title="Métricas" detail="Observa de forma gráfica datos relevantes del uso de recursos de tus dispositivos." icon="metrics"/>}
        <div className='pb-[10px]'/>
       </div>

   </Layout>
      
  )
}



export async function getServerSideProps(context) {

    const getSubmodules = async () => {
  
      const branches = await new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_API_URL}checkSubmodules/`,{module:"Menú Estadísticas"}, { withCredentials: true, headers: {
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


